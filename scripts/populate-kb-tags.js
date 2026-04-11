/**
 * One-time script to auto-derive tags for KB articles that don't have them.
 * Run: node scripts/populate-kb-tags.js
 */

const fs = require("fs");
const path = require("path");

const KB_DIR = path.join(__dirname, "..", "content", "knowledge-base");

// Category → base topic tags
const CATEGORY_TAGS = {
  "Falls Prevention": ["falls-prevention"],
  "Grip Strength": ["grip-strength"],
  "Assessments": ["functional-assessments"],
  "Care Settings": [],
  "Regulations": [],
  "Technology": ["digital-screening"],
};

// Keyword → tag mapping (checked against title + description)
const KEYWORD_MAP = [
  // Topic tags
  [/falls?\s*risk\s*assess/i, "falls-risk-assessment"],
  [/falls?\s*prevent/i, "falls-prevention"],
  [/falls?\s*screen/i, "falls-prevention"],
  [/grip\s*strength/i, "grip-strength"],
  [/hand\s*dynamomet/i, "hand-dynamometers"],
  [/tug\b|timed\s*up\s*and\s*go/i, "tug-test"],
  [/sit.to.stand|chair\s*stand|30.second\s*chair/i, "sit-to-stand"],
  [/gait\s*speed/i, "gait-speed"],
  [/frailty/i, "frailty"],
  [/sarcopenia/i, "sarcopenia"],
  [/longevity/i, "longevity"],
  [/glp.1/i, "glp-1"],
  [/oncology|cancer/i, "oncology"],
  [/cardio/i, "cardiovascular"],
  [/respiratory/i, "respiratory"],
  [/renal|kidney/i, "renal"],
  [/metabolic/i, "metabolic"],
  [/surg(ery|ical)/i, "surgery"],
  [/sports?\s*med/i, "sports-medicine"],
  [/normative\s*data/i, "normative-data"],
  [/steadi/i, "steadi"],
  [/nice\s*guideline/i, "nice-guidelines"],
  [/safe\s*act/i, "safe-act"],
  [/hhvbp/i, "hhvbp"],
  [/oasis/i, "oasis"],
  [/five.star|5.star/i, "five-star"],
  [/\broi\b|return\s*on\s*invest/i, "roi"],
  [/remote\s*monitor/i, "remote-monitoring"],
  [/ehr\b|electronic\s*health\s*record/i, "ehr-integration"],
  [/data\s*secur|hipaa|gdpr/i, "data-security"],
  [/population\s*health/i, "population-health"],
  // Segment tags
  [/home\s*care|home\s*health|hhvbp/i, "home-care"],
  [/senior\s*living|assisted\s*living|ccrc|life\s*plan|independent\s*living/i, "senior-living"],
  [/skilled\s*nurs/i, "skilled-nursing"],
  [/clinician|researcher|clinical\s*trial/i, "clinicians"],
  [/pharma|cro\b/i, "pharma"],
  [/famil(y|ies)|caregiver|loved\s*one/i, "families"],
];

// Block templates → type tags
const BLOCK_TYPE_MAP = {
  processSteps: "guide",
  evidenceBlock: "evidence",
  faqAccordion: "guide",
};

function deriveTagsForArticle(data, slug) {
  const tags = new Set();

  // 1. Category → base tags
  const catTags = CATEGORY_TAGS[data.category] || [];
  catTags.forEach((t) => tags.add(t));

  // 2. Keyword scan on title + description + slug
  const searchText = [data.title || "", data.description || "", slug].join(" ");
  for (const [regex, tag] of KEYWORD_MAP) {
    if (regex.test(searchText)) {
      tags.add(tag);
    }
  }

  // 3. All articles get able-assess as solution tag
  tags.add("able-assess");

  // 4. Type tags from block structure
  const templates = (data.blocks || []).map((b) => b._template);
  for (const [template, typeTag] of Object.entries(BLOCK_TYPE_MAP)) {
    if (templates.includes(template)) {
      tags.add(typeTag);
    }
  }

  // 5. Slug-specific overrides for comparison articles
  if (slug.includes("vs-") || slug.includes("compared")) {
    tags.add("comparison");
  }
  if (slug.includes("buyer") || slug.includes("guide")) {
    tags.add("buyer-guide");
  }
  if (slug.includes("regulation") || slug.includes("compliance") || slug.includes("fda")) {
    tags.add("regulation");
  }

  return [...tags];
}

// Main
const files = fs.readdirSync(KB_DIR).filter((f) => f.endsWith(".json"));
let updated = 0;

for (const file of files) {
  const filePath = path.join(KB_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const slug = file.replace(".json", "");

  // Skip articles that already have tags
  if (data.tags && data.tags.length > 0) {
    console.log(`SKIP ${slug} (already has ${data.tags.length} tags)`);
    continue;
  }

  const tags = deriveTagsForArticle(data, slug);
  data.tags = tags;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`SET  ${slug} → [${tags.join(", ")}]`);
  updated++;
}

console.log(`\nDone. Updated ${updated} of ${files.length} articles.`);
