#!/usr/bin/env node
/**
 * Crawls the running dev site, collects all internal links per page,
 * checks each link's HTTP status, and reports any non-200.
 */

const BASE = process.env.BASE || "http://localhost:3000";

const SEED_ROUTES = [
  "/", "/home-care", "/senior-living", "/skilled-nursing", "/pharma",
  "/about", "/meet-the-team", "/contact", "/demo", "/customers", "/partners", "/news",
  "/privacy", "/terms", "/cookies", "/security", "/faqs", "/careers",
  "/solutions/able-assess", "/solutions/able-strength", "/solutions/falls-prevention",
  "/solutions/functional-health", "/solutions/grip-strength", "/solutions/population-health",
  "/solutions/remote-monitoring", "/solutions/sensor",
  "/resources", "/resources/buyers-guide", "/resources/case-studies",
  "/resources/research-library", "/resources/evidence", "/resources/walkthrough",
  "/resources/downloads", "/resources/guides", "/resources/roi-calculator",
  "/resources/technical-documentation", "/resources/webinars", "/resources/1-pagers",
  "/resources/ccrc-guide", "/resources/hhvbp-guide",
  "/blog", "/knowledge-base", "/knowledge-base/buyers-guides",
  "/knowledge-base/research-summaries", "/knowledge-base/white-papers",
];

function extractHrefs(html) {
  const hrefs = new Set();
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const h = m[1];
    if (h.startsWith("#") || h.startsWith("mailto:") || h.startsWith("tel:") || h.startsWith("javascript:")) continue;
    if (h.startsWith("http") && !h.startsWith(BASE) && !h.startsWith("http://localhost")) continue;
    // Normalize absolute-local urls
    const rel = h.startsWith(BASE) ? h.slice(BASE.length) : h.startsWith("http") ? null : h;
    if (!rel) continue;
    // Drop fragments and query for status check
    const clean = rel.split("#")[0].split("?")[0];
    if (clean) hrefs.add(clean);
  }
  return [...hrefs];
}

async function fetchPage(path) {
  try {
    const r = await fetch(BASE + path, { redirect: "manual" });
    return { status: r.status, body: r.status >= 200 && r.status < 300 ? await r.text() : "" };
  } catch (e) {
    return { status: "ERR:" + e.message, body: "" };
  }
}

async function headCheck(path) {
  try {
    // Next.js doesn't always respond to HEAD; use GET with no body read
    const r = await fetch(BASE + path, { redirect: "manual" });
    return r.status;
  } catch (e) {
    return "ERR:" + e.message;
  }
}

async function main() {
  // Stage 1: fetch every seed, collect internal hrefs
  const linksBySource = new Map(); // srcPath -> Set<href>
  const allTargets = new Set();

  for (const p of SEED_ROUTES) {
    const { status, body } = await fetchPage(p);
    if (status !== 200) {
      console.log(`[seed] ${p} -> ${status}`);
    }
    const hrefs = extractHrefs(body);
    linksBySource.set(p, new Set(hrefs));
    for (const h of hrefs) allTargets.add(h);
  }

  // Stage 2: check each target once
  const targetStatus = new Map();
  const sorted = [...allTargets].sort();
  for (const t of sorted) {
    targetStatus.set(t, await headCheck(t));
  }

  // Stage 3: report non-200 targets and who points to them
  const broken = [...targetStatus.entries()].filter(([, s]) => s !== 200 && s !== 301 && s !== 302 && s !== 307 && s !== 308);
  if (broken.length === 0) {
    console.log("✓ no broken internal links");
    return;
  }

  console.log(`\n=== ${broken.length} broken/redirect targets ===`);
  for (const [t, s] of broken) {
    const sources = [];
    for (const [src, set] of linksBySource) if (set.has(t)) sources.push(src);
    console.log(`\n  ${s}  ${t}`);
    for (const src of sources.slice(0, 10)) console.log(`         ← from ${src}`);
    if (sources.length > 10) console.log(`         ... +${sources.length - 10} more`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
