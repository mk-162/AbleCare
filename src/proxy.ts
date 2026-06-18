import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy: maintenance kill-switch + visitor-country geo cookie.
 *
 * ── MAINTENANCE MODE ─────────────────────────────────────────────────────────
 * While active, every public request receives a self-contained HTTP 503
 * "down for maintenance" page carrying `X-Robots-Tag: noindex`. This makes the
 * site invisible to visitors and search engines, while the 503 status signals a
 * *temporary* outage so search rankings are preserved (unlike a 404/410, which
 * tells crawlers the pages are gone for good). `/robots.txt` is overridden to
 * `Disallow: /` so well-behaved crawlers stay away entirely.
 *
 * Ships ON by default, so merging this is enough to take the site down — no
 * dashboard step required.
 *
 *   • To bring the site back WITHOUT a code change: set the `MAINTENANCE_MODE`
 *     environment variable to `off` (or `0` / `false`) in Vercel → Settings →
 *     Environment Variables (Production), then redeploy.
 *   • To remove the kill-switch permanently once resolved: revert this commit.
 *
 * The TinaCMS editor at `/admin` stays reachable so content can be corrected
 * while the public site is down. It is auth-gated and carries no public claims.
 *
 * ── NORMAL MODE ──────────────────────────────────────────────────────────────
 * Sets a `visitor-country` cookie from Vercel's `x-vercel-ip-country` header so
 * the GeoMismatchBanner client component can detect cross-region visitors.
 * No-op locally where the header is absent (cookie is empty and the banner is
 * silent). The cookie is only set on page responses — never on API, admin,
 * asset or metadata responses — to keep those CDN-cacheable.
 */

// Treat these as "off"; anything else (including unset) leaves maintenance ON.
const MAINTENANCE_OFF_VALUES = new Set(["0", "false", "off", "no"]);
const maintenanceOverride = process.env.MAINTENANCE_MODE?.trim().toLowerCase();
const MAINTENANCE_ACTIVE = maintenanceOverride
  ? !MAINTENANCE_OFF_VALUES.has(maintenanceOverride)
  : true;

// Paths that must keep working even during maintenance (content editing).
const MAINTENANCE_ALLOWLIST = ["/admin"];

// Self-contained maintenance page — no external CSS, JS, fonts or images, so it
// renders even with every other route returning 503. Brand colours and US copy.
const MAINTENANCE_HTML = `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Able Care — Site maintenance</title>
<style>
  :root{ --ac-blue:#1432FF; --ac-aqua:#00FFD2; --ac-ink:#191919; --ac-grey:#DCDCDC; }
  *{ box-sizing:border-box; }
  html,body{ height:100%; }
  body{
    margin:0;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    color:var(--ac-ink);
    background:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
    line-height:1.6;
  }
  .card{ max-width:560px; width:100%; text-align:center; }
  .wordmark{
    font-size:1.5rem; font-weight:800; letter-spacing:-0.02em;
    color:var(--ac-blue); margin-bottom:2.5rem;
  }
  .accent{
    width:48px; height:4px; border-radius:2px;
    background:var(--ac-aqua); margin:0 auto 2rem;
  }
  h1{
    font-size:clamp(1.6rem,4vw,2.25rem); line-height:1.2;
    letter-spacing:-0.02em; margin:0 0 1rem;
  }
  p{ margin:0 auto 1rem; max-width:46ch; color:#3a3a3a; font-size:1.05rem; }
  .contact{
    margin-top:2.25rem; padding-top:1.5rem;
    border-top:1px solid var(--ac-grey);
    font-size:0.95rem; color:#6b6b6b;
  }
  a{ color:var(--ac-blue); font-weight:600; text-decoration:none; }
  a:hover{ text-decoration:underline; }
</style>
</head>
<body>
  <main class="card">
    <div class="wordmark">Able Care</div>
    <div class="accent"></div>
    <h1>We're carrying out some maintenance</h1>
    <p>Our website is temporarily unavailable while we make some important updates. We're sorry for any inconvenience.</p>
    <p class="contact">Need to get in touch? Email us at <a href="mailto:hello@able-care.co">hello@able-care.co</a> and we'll get back to you as soon as we can.</p>
  </main>
</body>
</html>
`;

function isAllowlisted(pathname: string): boolean {
  return MAINTENANCE_ALLOWLIST.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// In normal mode, don't attach the visitor-country cookie to these paths
// (mirrors the original matcher exclusions so asset/API responses stay cacheable).
function isExcludedFromGeo(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/videos") ||
    pathname.startsWith("/downloads") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (MAINTENANCE_ACTIVE) {
    // Keep the CMS editor reachable so content can be corrected.
    if (isAllowlisted(pathname)) {
      return NextResponse.next();
    }

    // Tell crawlers to stay out entirely while we're down.
    if (pathname === "/robots.txt") {
      return new NextResponse("User-agent: *\nDisallow: /\n", {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store, max-age=0, must-revalidate",
          "x-robots-tag": "noindex",
        },
      });
    }

    return new NextResponse(MAINTENANCE_HTML, {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        // Never cache the maintenance page, so restoring the site is instant.
        "cache-control": "no-store, max-age=0, must-revalidate",
        // Temporary outage — ask crawlers/clients to retry later.
        "retry-after": "3600",
        // Belt-and-braces with the inline <meta robots> tag.
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  // ── Normal mode: visitor-country geo cookie (page responses only) ──
  if (isExcludedFromGeo(pathname)) {
    return NextResponse.next();
  }

  const country = request.headers.get("x-vercel-ip-country") || "";
  const response = NextResponse.next();
  response.cookies.set("visitor-country", country, {
    path: "/",
    httpOnly: false, // client component needs to read it
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}

export const config = {
  // Run on everything except Next.js build assets. The maintenance page and the
  // robots override are fully self-contained, so no `_next` assets are needed.
  // Path-specific behaviour (allowlist, robots, geo exclusions) is handled above.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
