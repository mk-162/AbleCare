#!/usr/bin/env node
/**
 * Convert nested `primaryCta: { label, href }` / `secondaryCta: { label, href }`
 * to flat `primaryCtaText` / `primaryCtaLink` / `secondaryCtaText` / `secondaryCtaLink`.
 *
 * Tina's GraphQL query schema for content/pages requests only the flat fields,
 * so any nested CTA objects are dropped before BlockRenderer receives the data.
 * That left hero/ctaBanner CTAs invisible on production. This script normalizes
 * the source JSON so the CTAs render under the existing query.
 *
 * Pre-existing flat fields (where set) are preserved and take precedence —
 * nested values only fill in gaps.
 */
import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

function flattenCta(node, ctaKey, textKey, linkKey) {
  const cta = node[ctaKey];
  if (!cta || typeof cta !== "object" || Array.isArray(cta)) return false;
  let mutated = false;
  if (cta.label && node[textKey] == null) {
    node[textKey] = cta.label;
    mutated = true;
  }
  if (cta.href && node[linkKey] == null) {
    node[linkKey] = cta.href;
    mutated = true;
  }
  delete node[ctaKey];
  return mutated || true;
}

function walk(node) {
  let mutated = false;
  if (Array.isArray(node)) {
    for (const item of node) {
      if (walk(item)) mutated = true;
    }
    return mutated;
  }
  if (node && typeof node === "object") {
    if (flattenCta(node, "primaryCta", "primaryCtaText", "primaryCtaLink")) mutated = true;
    if (flattenCta(node, "secondaryCta", "secondaryCtaText", "secondaryCtaLink")) mutated = true;
    for (const key of Object.keys(node)) {
      if (walk(node[key])) mutated = true;
    }
  }
  return mutated;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const root = process.cwd();
  const files = [];
  for await (const f of glob("content/**/*.json", { cwd: root })) {
    files.push(f);
  }
  let changed = 0;
  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const data = JSON.parse(raw);
    const mutated = walk(data);
    if (!mutated) continue;
    const out = JSON.stringify(data, null, 2) + (raw.endsWith("\n") ? "\n" : "");
    if (out === raw) continue;
    if (!dryRun) await writeFile(file, out, "utf8");
    changed += 1;
    console.log(`${dryRun ? "would update" : "updated"}  ${file}`);
  }
  console.log(`\n${changed} file(s) ${dryRun ? "would change" : "changed"} of ${files.length} scanned`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
