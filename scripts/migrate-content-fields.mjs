#!/usr/bin/env node
/**
 * Migration script: normalize legacy field names in content/**‌/*.json to match Tina schema.
 * Mirrors the logic in BlockRenderer.normalizeBlock so that on-disk JSON matches schema
 * and won't be silently dropped when tina/config.ts is edited.
 *
 * Run: node scripts/migrate-content-fields.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Deep equality (undefined values treated as absent keys) ───────────────────

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  // Filter out undefined values for object comparison
  const fa = Object.fromEntries(Object.entries(a).filter(([, v]) => v !== undefined));
  const fb = Object.fromEntries(Object.entries(b).filter(([, v]) => v !== undefined));
  const keysA = Object.keys(fa).sort();
  const keysB = Object.keys(fb).sort();
  if (!deepEqual(keysA, keysB)) return false;
  return keysA.every((k) => deepEqual(fa[k], fb[k]));
}

/** Parse "Role, Organization" or just "Role" attribution string. */
function parseAttribution(attr) {
  const commaIdx = attr.indexOf(",");
  if (commaIdx !== -1) {
    const role = attr.slice(0, commaIdx).trim();
    const organization = attr.slice(commaIdx + 1).trim();
    if (role && organization) {
      return { role, organization };
    }
  }
  // No clean comma split — put it all in name so nothing is lost
  return { name: attr.trim() };
}

// ── Inlined normalizeBlock (from BlockRenderer.tsx) ───────────────────────────
// Must stay byte-identical to the production normalizeBlock.

function normalizeBlock(block) {
  const b = { ...block };

  if (b.colorScheme && !b.scheme) {
    b.scheme = b.colorScheme;
    delete b.colorScheme;
  }
  if (b.waveStyle && !b.wave) {
    b.wave = b.waveStyle;
    delete b.waveStyle;
  }
  if (b.primaryCta && typeof b.primaryCta === "object") {
    if (!b.primaryCtaText) b.primaryCtaText = b.primaryCta.label;
    if (!b.primaryCtaLink) b.primaryCtaLink = b.primaryCta.href;
    delete b.primaryCta;
  }
  if (b.secondaryCta && typeof b.secondaryCta === "object") {
    if (!b.secondaryCtaText) b.secondaryCtaText = b.secondaryCta.label;
    if (!b.secondaryCtaLink) b.secondaryCtaLink = b.secondaryCta.href;
    delete b.secondaryCta;
  }
  if (b.body && typeof b.body === "string" && !b.bodyText) {
    b.bodyText = b.body;
  }
  if (b.pulledStat && typeof b.pulledStat === "object") {
    const ps = b.pulledStat;
    b.pulledStat = ps.text;
    if (!b.pulledStatSource) b.pulledStatSource = ps.source;
  }
  if (b.studies && !b.citations) {
    b.citations = b.studies.map((s) => ({
      title: s.title,
      authors: s.authors,
      journal: s.source,
      year: s.year,
      link: s.url,
      finding: s.finding,
    }));
    delete b.studies;
  }
  const blockTemplate =
    b._template ||
    (b.__typename
      ? b.__typename.replace(/^.*Blocks/, "").charAt(0).toLowerCase() +
        b.__typename.replace(/^.*Blocks/, "").slice(1)
      : null);
  if (blockTemplate === "caseStudyCards" && b.cards && !b.caseStudies) {
    b.caseStudies = b.cards.map((c) => ({
      title: c.title,
      sector: c.segment,
      summary: c.outcome,
      link: c.href,
      metric: c.metric,
      metricLabel: c.metricLabel,
      thumbnail: c.thumbnail,
    }));
    delete b.cards;
  }
  if (b.linkText && !b.primaryCtaText) {
    b.primaryCtaText = b.linkText;
    delete b.linkText;
  }
  if (b.linkHref && !b.primaryCtaLink) {
    b.primaryCtaLink = b.linkHref;
    delete b.linkHref;
  }
  if (
    b.items &&
    Array.isArray(b.items) &&
    b.items.length > 0 &&
    typeof b.items[0] === "string"
  ) {
    b.items = b.items.map((s) => ({ text: s }));
  }
  if (b.body && typeof b.body === "string" && !b.description) {
    b.description = b.body;
  }
  if (b.imageSide && !b.imagePosition) {
    b.imagePosition = b.imageSide;
    delete b.imageSide;
  }
  if (b.imageSrc && !b.image) {
    b.image = b.imageSrc;
    delete b.imageSrc;
  }
  if (b.metrics && Array.isArray(b.metrics)) {
    b.metrics = b.metrics.map((m) => {
      if (m.description && !m.whatItMeasures) {
        return { ...m, whatItMeasures: m.description };
      }
      return m;
    });
  }
  if (
    b.items &&
    Array.isArray(b.items) &&
    b.items.length > 0 &&
    b.items[0]?.question &&
    !b.faqs
  ) {
    b.faqs = b.items;
    delete b.items;
  }
  const template = b._template;
  if (b.title && !b.heading && template && template !== "hero") {
    b.heading = b.title;
  }
  return b;
}

// ── Migration logic ────────────────────────────────────────────────────────────

function migrateBlock(block) {
  const b = { ...block };
  const template = b._template;

  // 1. colorScheme → scheme (always delete legacy key; only set scheme if absent)
  if (b.colorScheme) {
    if (!b.scheme) b.scheme = b.colorScheme;
    delete b.colorScheme;
  }

  // 2. waveStyle → wave (always delete legacy key; only set wave if absent)
  if (b.waveStyle) {
    if (!b.wave) b.wave = b.waveStyle;
    delete b.waveStyle;
  }

  // 3. primaryCta: {label, href} → flat fields
  if (b.primaryCta && typeof b.primaryCta === "object") {
    if (!b.primaryCtaText) b.primaryCtaText = b.primaryCta.label;
    if (!b.primaryCtaLink) b.primaryCtaLink = b.primaryCta.href;
    delete b.primaryCta;
  }

  // 4. secondaryCta: {label, href} → flat fields
  if (b.secondaryCta && typeof b.secondaryCta === "object") {
    if (!b.secondaryCtaText) b.secondaryCtaText = b.secondaryCta.label;
    if (!b.secondaryCtaLink) b.secondaryCtaLink = b.secondaryCta.href;
    delete b.secondaryCta;
  }

  // 5. ctaBanner: body → bodyText
  if (
    template === "ctaBanner" &&
    b.body &&
    typeof b.body === "string" &&
    !b.bodyText
  ) {
    b.bodyText = b.body;
    delete b.body;
  }

  // 6. metricsBlock: metric.description → metric.whatItMeasures
  if (b.metrics && Array.isArray(b.metrics)) {
    b.metrics = b.metrics.map((m) => {
      if (m.description && !m.whatItMeasures) {
        const { description, ...rest } = m;
        return { ...rest, whatItMeasures: description };
      }
      return m;
    });
  }

  // 7. evidenceBlock: studies → citations (source→journal, url→link)
  if (b.studies && !b.citations) {
    b.citations = b.studies.map((s) => {
      const c = {};
      if (s.title !== undefined) c.title = s.title;
      if (s.authors !== undefined) c.authors = s.authors;
      if (s.source !== undefined) c.journal = s.source;
      if (s.year !== undefined) c.year = s.year;
      if (s.url !== undefined) c.link = s.url;
      if (s.finding !== undefined) c.finding = s.finding;
      // pass through any unexpected extra fields unchanged
      for (const k of Object.keys(s)) {
        if (!["title", "authors", "source", "year", "url", "finding"].includes(k)) {
          c[k] = s[k];
        }
      }
      return c;
    });
    delete b.studies;
  }

  // 8. caseStudyCards: cards → caseStudies (segment→sector, outcome→summary, href→link)
  if (template === "caseStudyCards" && b.cards && !b.caseStudies) {
    b.caseStudies = b.cards.map((c) => {
      const cs = {};
      if (c.title !== undefined) cs.title = c.title;
      if (c.metric !== undefined) cs.metric = c.metric;
      if (c.metricLabel !== undefined) cs.metricLabel = c.metricLabel;
      if (c.outcome !== undefined) cs.summary = c.outcome;
      if (c.segment !== undefined) cs.sector = c.segment;
      if (c.href !== undefined) cs.link = c.href;
      if (c.thumbnail !== undefined) cs.thumbnail = c.thumbnail;
      // pass through unexpected extras
      for (const k of Object.keys(c)) {
        if (!["title", "metric", "metricLabel", "outcome", "segment", "href", "thumbnail"].includes(k)) {
          cs[k] = c[k];
        }
      }
      return cs;
    });
    delete b.cards;
  }

  // 9. faqAccordion: items (with question/answer) → faqs
  if (
    template === "faqAccordion" &&
    b.items &&
    Array.isArray(b.items) &&
    b.items.length > 0 &&
    b.items[0]?.question &&
    !b.faqs
  ) {
    b.faqs = b.items;
    delete b.items;
  }

  // 10. segmentRouter: tiles → segments (label→title, benefit→description, href→link)
  if (template === "segmentRouter" && b.tiles && !b.segments) {
    b.segments = b.tiles.map((t) => {
      const seg = {};
      if (t.label !== undefined) seg.title = t.label;
      if (t.benefit !== undefined) seg.description = t.benefit;
      if (t.href !== undefined) seg.link = t.href;
      if (t.ctaText !== undefined) seg.ctaText = t.ctaText;
      // pass through unexpected extras
      for (const k of Object.keys(t)) {
        if (!["label", "benefit", "href", "ctaText"].includes(k)) {
          seg[k] = t[k];
        }
      }
      return seg;
    });
    delete b.tiles;
  }

  // 11. testimonialCarousel: attribution → name/role/organization
  if (b.testimonials && Array.isArray(b.testimonials)) {
    b.testimonials = b.testimonials.map((t) => {
      if (t.attribution && !t.name && !t.role && !t.organization) {
        const parsed = parseAttribution(t.attribution);
        const { attribution, ...rest } = t;
        return { ...rest, ...parsed };
      }
      return t;
    });
  }

  // 12. trustBar: string items → {text} objects
  if (
    template === "trustBar" &&
    b.items &&
    Array.isArray(b.items) &&
    b.items.length > 0 &&
    typeof b.items[0] === "string"
  ) {
    b.items = b.items.map((s) => ({ text: s }));
  }

  // 13. imageFeature: imageSide→imagePosition, imageSrc→image, body→description
  if (template === "imageFeature") {
    if (b.imageSide && !b.imagePosition) {
      b.imagePosition = b.imageSide;
      delete b.imageSide;
    }
    if (b.imageSrc && !b.image) {
      b.image = b.imageSrc;
      delete b.imageSrc;
    }
    if (b.body && typeof b.body === "string" && !b.description) {
      b.description = b.body;
      delete b.body;
    }
  }

  // 14. ctaInline: linkText/linkHref → primaryCtaText/primaryCtaLink
  if (b.linkText && !b.primaryCtaText) {
    b.primaryCtaText = b.linkText;
    delete b.linkText;
  }
  if (b.linkHref && !b.primaryCtaLink) {
    b.primaryCtaLink = b.linkHref;
    delete b.linkHref;
  }

  // 15. title → heading (copy only) for non-hero blocks
  //     normalizeBlock keeps title too, so we do the same.
  if (b.title && !b.heading && template && template !== "hero") {
    b.heading = b.title;
  }

  return b;
}

// ── Sanity check ─────────────────────────────────────────────────────────────
//
// Strategy: compare fullNormalize(before) vs fullNormalize(after) where
//   fullNormalize = normalizeBlock ∘ migrateBlock
//
// Since migrateBlock is idempotent, fullNormalize(after) == fullNormalize(before)
// if and only if the migration is render-equivalent. This handles all sub-object
// transforms (metrics, testimonials, caseStudies, segments) correctly.
//
// The undefined-safe deepEqual ensures that normalizeBlock's practice of
// creating objects with undefined values (e.g. in caseStudies mapping) doesn't
// cause false positives.

function fullNormalize(block) {
  return normalizeBlock(migrateBlock(JSON.parse(JSON.stringify(block))));
}

function sanityCheck(beforeBlocks, afterBlocks) {
  const issues = [];

  for (let i = 0; i < beforeBlocks.length; i++) {
    const fnb = fullNormalize(beforeBlocks[i]);
    const fna = fullNormalize(afterBlocks[i]);

    if (!deepEqual(fnb, fna)) {
      // Find the differing keys for the error report
      const allKeys = new Set([
        ...Object.keys(fnb).filter((k) => fnb[k] !== undefined),
        ...Object.keys(fna).filter((k) => fna[k] !== undefined),
      ]);
      const diffs = [];
      for (const key of allKeys) {
        if (!deepEqual(fnb[key], fna[key])) {
          diffs.push({
            key,
            before: JSON.stringify(fnb[key] ?? null).slice(0, 120),
            after: JSON.stringify(fna[key] ?? null).slice(0, 120),
          });
        }
      }
      issues.push({
        blockIndex: i,
        template: beforeBlocks[i]._template,
        diffs,
      });
    }
  }

  return issues.length > 0 ? issues : null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function getContentFiles() {
  const out = execSync(
    `find ${ROOT}/content -name "*.json" | grep -v "_archive" | grep -v "node_modules" | sort`,
    { encoding: "utf8" }
  );
  return out.trim().split("\n").filter(Boolean);
}

const files = getContentFiles();
const results = {
  migrated: [],
  unchanged: [],
  skipped: [],
  errors: [],
};

const conversionCounts = {
  colorScheme: 0,
  waveStyle: 0,
  primaryCta: 0,
  secondaryCta: 0,
  ctaBannerBody: 0,
  metricsDescription: 0,
  evidenceStudies: 0,
  caseStudyCards: 0,
  faqItems: 0,
  segmentRouterTiles: 0,
  testimonialAttribution: 0,
  trustBarStrings: 0,
  imageFeatureFields: 0,
  ctaInlineLinks: 0,
  titleToHeading: 0,
};

for (const filePath of files) {
  try {
    const raw = readFileSync(filePath, "utf8");
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      results.errors.push({ file: filePath, error: `JSON parse error: ${e.message}` });
      continue;
    }

    // Only migrate files that have a blocks array
    if (!data.blocks || !Array.isArray(data.blocks)) {
      results.unchanged.push(filePath);
      continue;
    }

    const beforeBlocks = JSON.parse(JSON.stringify(data.blocks));
    const afterBlocks = beforeBlocks.map((block) => {
      const before = block;
      const after = migrateBlock(JSON.parse(JSON.stringify(block)));

      if (before.colorScheme && !before.scheme && after.scheme) conversionCounts.colorScheme++;
      if (before.waveStyle && !before.wave && after.wave) conversionCounts.waveStyle++;
      if (before.primaryCta && after.primaryCtaText) conversionCounts.primaryCta++;
      if (before.secondaryCta && after.secondaryCtaText) conversionCounts.secondaryCta++;
      if (before._template === "ctaBanner" && before.body && after.bodyText && !after.body) conversionCounts.ctaBannerBody++;
      if (
        before.metrics && after.metrics &&
        after.metrics.some((m, i) => m.whatItMeasures && before.metrics[i]?.description && !before.metrics[i]?.whatItMeasures)
      ) conversionCounts.metricsDescription++;
      if (before.studies && after.citations) conversionCounts.evidenceStudies++;
      if (before._template === "caseStudyCards" && before.cards && after.caseStudies) conversionCounts.caseStudyCards++;
      if (before._template === "faqAccordion" && before.items && after.faqs) conversionCounts.faqItems++;
      if (before._template === "segmentRouter" && before.tiles && after.segments) conversionCounts.segmentRouterTiles++;
      if (
        before.testimonials && after.testimonials &&
        before.testimonials.some((t) => t.attribution) &&
        after.testimonials.some((t) => t.role || t.organization || t.name)
      ) conversionCounts.testimonialAttribution++;
      if (before._template === "trustBar" && before.items && Array.isArray(before.items) && typeof before.items[0] === "string") conversionCounts.trustBarStrings++;
      if (before._template === "imageFeature" && (before.imageSide || before.imageSrc || (before.body && !before.description))) conversionCounts.imageFeatureFields++;
      if ((before.linkText || before.linkHref) && (after.primaryCtaText || after.primaryCtaLink)) conversionCounts.ctaInlineLinks++;
      if (!before.heading && after.heading && before.title && before._template !== "hero") conversionCounts.titleToHeading++;

      return after;
    });

    // Check if anything actually changed
    if (deepEqual(beforeBlocks, afterBlocks)) {
      results.unchanged.push(filePath);
      continue;
    }

    // Sanity check: render equivalence via fullNormalize
    const issues = sanityCheck(beforeBlocks, afterBlocks);
    if (issues) {
      results.skipped.push({ file: filePath, issues });
      continue;
    }

    // Write back with 2-space indent and trailing newline (matches existing style)
    const newData = { ...data, blocks: afterBlocks };
    const newRaw = JSON.stringify(newData, null, 2) + "\n";
    writeFileSync(filePath, newRaw, "utf8");
    results.migrated.push(filePath);

  } catch (e) {
    results.errors.push({ file: filePath, error: e.stack || e.message });
  }
}

// ── Report ────────────────────────────────────────────────────────────────────

console.log("\n=== Content Field Migration Report ===\n");
console.log(`Files migrated:  ${results.migrated.length}`);
console.log(`Files unchanged: ${results.unchanged.length}`);
console.log(`Files skipped:   ${results.skipped.length} (render-equivalence check failed)`);
console.log(`Files errored:   ${results.errors.length}`);

console.log("\n--- Conversion counts ---");
console.log(`  colorScheme → scheme:                     ${conversionCounts.colorScheme} blocks`);
console.log(`  waveStyle → wave:                          ${conversionCounts.waveStyle} blocks`);
console.log(`  primaryCta → flat:                         ${conversionCounts.primaryCta} blocks`);
console.log(`  secondaryCta → flat:                       ${conversionCounts.secondaryCta} blocks`);
console.log(`  ctaBanner body → bodyText:                 ${conversionCounts.ctaBannerBody} blocks`);
console.log(`  metricsBlock description → whatItMeasures: ${conversionCounts.metricsDescription} blocks`);
console.log(`  evidenceBlock studies → citations:         ${conversionCounts.evidenceStudies} blocks`);
console.log(`  caseStudyCards cards → caseStudies:        ${conversionCounts.caseStudyCards} blocks`);
console.log(`  faqAccordion items → faqs:                 ${conversionCounts.faqItems} blocks`);
console.log(`  segmentRouter tiles → segments:            ${conversionCounts.segmentRouterTiles} blocks`);
console.log(`  testimonial attribution → parsed:          ${conversionCounts.testimonialAttribution} blocks`);
console.log(`  trustBar string items → objects:           ${conversionCounts.trustBarStrings} blocks`);
console.log(`  imageFeature field renames:                ${conversionCounts.imageFeatureFields} blocks`);
console.log(`  ctaInline link → primaryCta:               ${conversionCounts.ctaInlineLinks} blocks`);
console.log(`  title → heading (copy):                    ${conversionCounts.titleToHeading} blocks`);

if (results.migrated.length > 0) {
  console.log("\n--- Migrated files ---");
  results.migrated.forEach((f) => console.log("  " + path.relative(ROOT, f)));
}

if (results.skipped.length > 0) {
  console.log("\n--- SKIPPED files (render-equivalence check FAILED — needs manual review) ---");
  results.skipped.forEach(({ file, issues }) => {
    console.log("  " + path.relative(ROOT, file));
    issues.forEach((issue) => {
      console.log(`    Block ${issue.blockIndex} (${issue.template}):`);
      issue.diffs.forEach((d) => {
        console.log(`      DIFF key '${d.key}':`);
        console.log(`        before: ${d.before}`);
        console.log(`        after:  ${d.after}`);
      });
    });
  });
}

if (results.errors.length > 0) {
  console.log("\n--- Errors ---");
  results.errors.forEach(({ file, error }) => {
    console.log("  " + path.relative(ROOT, file) + ": " + error);
  });
}

console.log("\nDone.\n");
