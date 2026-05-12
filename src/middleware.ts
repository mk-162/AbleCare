import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Sets a `visitor-country` cookie from Vercel's `x-vercel-ip-country` header
 * so the GeoMismatchBanner client component can detect cross-region visitors.
 *
 * No-op locally where the header is absent (cookie is set to empty string and
 * the banner is silent).
 */
export function middleware(request: NextRequest) {
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
  // Run on all pages, skip API routes, admin, and static asset paths.
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|images|videos|downloads|robots.txt|sitemap.xml).*)",
  ],
};
