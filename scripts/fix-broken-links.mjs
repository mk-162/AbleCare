#!/usr/bin/env node
/**
 * One-shot sweep to address Xenu broken-link report findings in content/.
 *
 * 1. Strip the broken `/solutions` breadcrumb href (page does not exist).
 * 2. Strip trailing slashes from internal links (Next.js trailingSlash = false
 *    causes 308 redirects from `/foo/` to `/foo`).
 *
 * Run from the repo root:
 *   node scripts/fix-broken-links.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
      walk(full, out);
    } else if (s.isFile()) {
      out.push(full);
    }
  }
  return out;
}

const candidates = walk(path.join(ROOT, "content"))
  .concat(walk(path.join(ROOT, "data")))
  .filter((f) => /\.(json|md|mdx)$/i.test(f));

// Internal slugs that should NOT have trailing slashes.
// We restrict to known prefixes so we don't accidentally strip slashes from
// external URLs that share the same suffix shape.
const INTERNAL_PREFIXES = [
  "/blog",
  "/blog/category",
  "/solutions",
  "/resources",
  "/home-care",
  "/senior-living",
  "/skilled-nursing",
  "/pharma",
  "/clinicians",
  "/about",
  "/contact",
  "/demo",
  "/customers",
  "/careers",
  "/partners",
  "/news",
  "/privacy",
  "/terms",
  "/terms-of-sale",
  "/cookies",
  "/security",
  "/faqs",
  "/falls-risk-tests",
  "/low-and-at-risk",
  "/meet-the-team",
  "/compare",
  "/evidence",
  "/for",
  "/product",
  "/order",
  "/aota",
  "/griswold",
  "/roi-calculator",
];

let totalEdits = 0;
const editedFiles = new Map();

function record(file, before, after) {
  if (before === after) return;
  totalEdits++;
  if (!editedFiles.has(file)) editedFiles.set(file, []);
  editedFiles.get(file).push({ before, after });
}

const TRAILING_SLASH_RE = new RegExp(
  // (?:href|link|primaryCtaLink|secondaryCtaLink|url) optional - we just match the URL
  // We match string literals containing an internal path with a trailing slash.
  "(\"|\\(|>)" + // open delimiter: ", (, or >
    "(" +
    INTERNAL_PREFIXES.map((p) => p.replace(/\//g, "\\/")).join("|") +
    ")" +
    "([\\/a-zA-Z0-9_\\-]*)" + // path segment(s)
    "/" + // the offending trailing slash
    "(\"|\\)|#|\\?)", // close delimiter: ", ), #, or ?
  "g",
);

for (const file of candidates) {
  let text = readFileSync(file, "utf8");
  const original = text;

  // 1. Solutions breadcrumb: keep label, drop href (page does not exist).
  //    Matches both multi-line and inline JSON forms.
  text = text.replace(
    /("label"\s*:\s*"Solutions"),\s*"href"\s*:\s*"\/solutions"/g,
    "$1",
  );

  // 2. Strip trailing slashes from internal-prefix URLs.
  text = text.replace(TRAILING_SLASH_RE, (m, open, prefix, rest, close) => {
    const before = `${prefix}${rest}/`;
    const after = `${prefix}${rest}`;
    record(file, before, after);
    return `${open}${after}${close}`;
  });

  if (text !== original) {
    writeFileSync(file, text);
  }
}

console.log(`Edited files: ${editedFiles.size}`);
console.log(`Total replacements: ${totalEdits}`);
for (const [file, edits] of editedFiles) {
  console.log(`\n${path.relative(ROOT, file)}`);
  for (const { before, after } of edits.slice(0, 5)) {
    console.log(`  ${before}  →  ${after}`);
  }
  if (edits.length > 5) console.log(`  ... and ${edits.length - 5} more`);
}
