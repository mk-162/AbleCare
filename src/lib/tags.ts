/**
 * Shared tag taxonomy for cross-referencing content across the Able Care site.
 *
 * Tags are the glue between KB articles, segment pages, solution pages,
 * compare pages, and resources. Every content item can carry tags from
 * any dimension. The content index (content-index.ts) uses these to
 * resolve "related content" queries at build time.
 *
 * Dimensions:
 *   topic    – what the content is about
 *   segment  – which buyer segment it serves
 *   solution – which product it relates to
 *   type     – what kind of content it is
 */

// ── Topic tags ───────────────────────────────────────────────────────────────

export const TOPIC_TAGS = [
  "falls-prevention",
  "falls-risk-assessment",
  "grip-strength",
  "functional-assessments",
  "tug-test",
  "sit-to-stand",
  "gait-speed",
  "chair-stand",
  "frailty",
  "sarcopenia",
  "longevity",
  "glp-1",
  "oncology",
  "cardiovascular",
  "respiratory",
  "renal",
  "metabolic",
  "surgery",
  "sports-medicine",
  "hand-dynamometers",
  "normative-data",
  "steadi",
  "nice-guidelines",
  "safe-act",
  "hhvbp",
  "oasis",
  "five-star",
  "roi",
  "digital-screening",
  "remote-monitoring",
  "ehr-integration",
  "data-security",
  "population-health",
] as const;

// ── Segment tags ─────────────────────────────────────────────────────────────

export const SEGMENT_TAGS = [
  "home-care",
  "home-health-agencies",
  "senior-living",
  "skilled-nursing",
  "hospital-systems",
  "area-agencies-on-aging",
  "clinicians",
  "pharma",
  "families",
] as const;

// ── Solution tags ────────────────────────────────────────────────────────────

export const SOLUTION_TAGS = [
  "able-assess",
  "able-strength",
  "population-health",
  "gripable",
] as const;

// ── Content type tags ────────────────────────────────────────────────────────

export const TYPE_TAGS = [
  "guide",
  "evidence",
  "comparison",
  "regulation",
  "case-study",
  "product-walkthrough",
  "buyer-guide",
  "clinical-deep-dive",
] as const;

// ── Combined type ────────────────────────────────────────────────────────────

export type TopicTag = (typeof TOPIC_TAGS)[number];
export type SegmentTag = (typeof SEGMENT_TAGS)[number];
export type SolutionTag = (typeof SOLUTION_TAGS)[number];
export type TypeTag = (typeof TYPE_TAGS)[number];
export type ContentTag = TopicTag | SegmentTag | SolutionTag | TypeTag;

export const ALL_TAGS: readonly ContentTag[] = [
  ...TOPIC_TAGS,
  ...SEGMENT_TAGS,
  ...SOLUTION_TAGS,
  ...TYPE_TAGS,
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Human-readable label for a tag slug. */
export function tagLabel(tag: ContentTag): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Which dimension a tag belongs to. */
export function tagDimension(
  tag: string
): "topic" | "segment" | "solution" | "type" | "unknown" {
  if ((TOPIC_TAGS as readonly string[]).includes(tag)) return "topic";
  if ((SEGMENT_TAGS as readonly string[]).includes(tag)) return "segment";
  if ((SOLUTION_TAGS as readonly string[]).includes(tag)) return "solution";
  if ((TYPE_TAGS as readonly string[]).includes(tag)) return "type";
  return "unknown";
}
