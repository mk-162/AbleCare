#!/usr/bin/env node
/**
 * One-off script: convert UK English to US English across content/ and src/.
 * Run with: node scripts/uk-to-us.mjs
 *
 * Uses word-boundary regexes so "specialist" / "analysis" / "emphasis" are left
 * alone — only the UK-specific verb forms ("specialise", "analyse", "emphasise")
 * get rewritten.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const targetDirs = [
  path.join(repoRoot, "content"),
  path.join(repoRoot, "src"),
];

const extensions = new Set([".json", ".md", ".mdx", ".ts", ".tsx", ".js", ".mjs", ".css"]);

// Skip this script so the replacement words in the map below don't get rewritten.
const skipFiles = new Set([
  path.resolve(__dirname, "uk-to-us.mjs"),
]);

// Each entry is [UK word, US word]. Anchored with \b on both sides to avoid
// partial-word hits. Case preserved by producing lower/upper/capitalised variants.
const pairs = [
  // -ise/-ised/-ising → -ize/-ized/-izing
  ["organise", "organize"],
  ["organised", "organized"],
  ["organising", "organizing"],
  ["organisation", "organization"],
  ["organisations", "organizations"],
  ["organisational", "organizational"],
  ["standardise", "standardize"],
  ["standardised", "standardized"],
  ["standardising", "standardizing"],
  ["standardisation", "standardization"],
  ["centralise", "centralize"],
  ["centralised", "centralized"],
  ["centralising", "centralizing"],
  ["centralisation", "centralization"],
  ["specialise", "specialize"],
  ["specialised", "specialized"],
  ["specialising", "specializing"],
  ["specialisation", "specialization"],
  ["emphasise", "emphasize"],
  ["emphasised", "emphasized"],
  ["emphasising", "emphasizing"],
  ["realise", "realize"],
  ["realised", "realized"],
  ["realising", "realizing"],
  ["analyse", "analyze"],
  ["analysed", "analyzed"],
  ["analysing", "analyzing"],
  ["recognise", "recognize"],
  ["recognised", "recognized"],
  ["recognising", "recognizing"],
  ["prioritise", "prioritize"],
  ["prioritised", "prioritized"],
  ["prioritising", "prioritizing"],
  ["optimise", "optimize"],
  ["optimised", "optimized"],
  ["optimising", "optimizing"],
  ["optimisation", "optimization"],
  ["utilise", "utilize"],
  ["utilised", "utilized"],
  ["utilising", "utilizing"],
  ["utilisation", "utilization"],
  ["hospitalise", "hospitalize"],
  ["hospitalised", "hospitalized"],
  ["hospitalising", "hospitalizing"],
  ["hospitalisation", "hospitalization"],
  ["hospitalisations", "hospitalizations"],
  ["categorise", "categorize"],
  ["categorised", "categorized"],
  ["categorising", "categorizing"],
  ["characterise", "characterize"],
  ["characterised", "characterized"],
  ["characterising", "characterizing"],
  ["formalise", "formalize"],
  ["formalised", "formalized"],
  ["formalising", "formalizing"],
  ["familiarise", "familiarize"],
  ["familiarised", "familiarized"],
  ["familiarising", "familiarizing"],
  ["finalise", "finalize"],
  ["finalised", "finalized"],
  ["finalising", "finalizing"],
  ["summarise", "summarize"],
  ["summarised", "summarized"],
  ["summarising", "summarizing"],
  ["minimise", "minimize"],
  ["minimised", "minimized"],
  ["minimising", "minimizing"],
  ["maximise", "maximize"],
  ["maximised", "maximized"],
  ["maximising", "maximizing"],
  ["customise", "customize"],
  ["customised", "customized"],
  ["customising", "customizing"],
  ["customisation", "customization"],
  ["initialise", "initialize"],
  ["initialised", "initialized"],
  ["initialising", "initializing"],
  ["normalise", "normalize"],
  ["normalised", "normalized"],
  ["normalising", "normalizing"],
  ["normalisation", "normalization"],
  ["synthesise", "synthesize"],
  ["synthesised", "synthesized"],
  ["synthesising", "synthesizing"],
  ["civilise", "civilize"],
  ["civilised", "civilized"],
  ["criticise", "criticize"],
  ["criticised", "criticized"],

  // -lling → -ling (American doesn't double the l before -ing/-ed suffix on unstressed)
  ["modelling", "modeling"],
  ["modelled", "modeled"],
  ["travelling", "traveling"],
  ["travelled", "traveled"],
  ["labelling", "labeling"],
  ["labelled", "labeled"],
  ["cancelling", "canceling"],
  ["cancelled", "canceled"],
  ["fuelled", "fueled"],
  ["fuelling", "fueling"],
  ["counselling", "counseling"],
  ["counselled", "counseled"],
  ["counsellor", "counselor"],
  ["counsellors", "counselors"],

  // -our → -or
  ["colour", "color"],
  ["colours", "colors"],
  ["coloured", "colored"],
  ["colouring", "coloring"],
  ["labour", "labor"],
  ["labours", "labors"],
  ["laboured", "labored"],
  ["behaviour", "behavior"],
  ["behaviours", "behaviors"],
  ["behavioural", "behavioral"],
  ["favour", "favor"],
  ["favours", "favors"],
  ["favoured", "favored"],
  ["favourite", "favorite"],
  ["favourites", "favorites"],
  ["honour", "honor"],
  ["honoured", "honored"],
  ["neighbour", "neighbor"],
  ["neighbours", "neighbors"],
  ["neighbouring", "neighboring"],

  // -re → -er
  ["centre", "center"],
  ["centres", "centers"],
  ["centred", "centered"],
  ["centring", "centering"],
  ["metre", "meter"],
  ["metres", "meters"],
  ["kilometre", "kilometer"],
  ["kilometres", "kilometers"],
  ["fibre", "fiber"],
  ["fibres", "fibers"],
  ["litre", "liter"],
  ["litres", "liters"],
  ["theatre", "theater"],
  ["theatres", "theaters"],

  // -ce (noun) → -se (verb stays, but noun form shifts)
  ["defence", "defense"],
  ["offence", "offense"],
  ["licence", "license"],
  ["licences", "licenses"],
  ["practise", "practice"],
  ["practised", "practiced"],
  ["practising", "practicing"],

  // Misc
  ["judgement", "judgment"],
  ["judgements", "judgments"],
  ["acknowledgement", "acknowledgment"],
  ["acknowledgements", "acknowledgments"],
  ["programme", "program"],
  ["programmes", "programs"],
  ["manoeuvre", "maneuver"],
  ["manoeuvres", "maneuvers"],
  ["whilst", "while"],
  ["amongst", "among"],
  ["per cent", "percent"],
  ["aeroplane", "airplane"],
  ["aeroplanes", "airplanes"],
  ["enrol", "enroll"],
  ["enrolled", "enrolled"],
  ["enrolling", "enrolling"],
  ["fulfil", "fulfill"],
  ["fulfilled", "fulfilled"],
  ["fulfilling", "fulfilling"],
  ["fulfilment", "fulfillment"],
  ["skilful", "skillful"],
  ["wilful", "willful"],
  ["instalment", "installment"],
  ["instalments", "installments"],

  // Healthcare / everyday term swaps appropriate for a US home-care site
  ["carers", "caregivers"],
  ["carer", "caregiver"],
  ["GP", "primary care physician"],
  ["GPs", "primary care physicians"],
  ["physiotherapist", "physical therapist"],
  ["physiotherapists", "physical therapists"],
  ["physiotherapy", "physical therapy"],

  // Additional -ise conjugations my earlier list missed
  ["organises", "organizes"],
  ["standardises", "standardizes"],
  ["centralises", "centralizes"],
  ["specialises", "specializes"],
  ["emphasises", "emphasizes"],
  ["realises", "realizes"],
  ["analyses", "analyzes"],
  ["recognises", "recognizes"],
  ["prioritises", "prioritizes"],
  ["optimises", "optimizes"],
  ["utilises", "utilizes"],
  ["hospitalises", "hospitalizes"],
  ["categorises", "categorizes"],
  ["characterises", "characterizes"],
  ["formalises", "formalizes"],
  ["familiarises", "familiarizes"],
  ["finalises", "finalizes"],
  ["summarises", "summarizes"],
  ["minimises", "minimizes"],
  ["maximises", "maximizes"],
  ["customises", "customizes"],
  ["initialises", "initializes"],
  ["normalises", "normalizes"],
  ["synthesises", "synthesizes"],
  ["criticises", "criticizes"],
];

function toRegex(word) {
  // Word boundary on both sides; use [^A-Za-z] lookarounds so that "per cent" works.
  // For multi-word UK forms (only "per cent"), we rely on the boundary at the whole token.
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`, "g");
}

function capitalizedVariants(pair) {
  const [uk, us] = pair;
  const variants = [[uk, us]];
  // Capitalized first letter
  if (uk[0] !== uk[0].toUpperCase()) {
    const ukCap = uk[0].toUpperCase() + uk.slice(1);
    const usCap = us[0].toUpperCase() + us.slice(1);
    variants.push([ukCap, usCap]);
  }
  // All caps (only for short multi-letter tokens)
  if (uk.length <= 15 && /^[a-z ]+$/.test(uk)) {
    variants.push([uk.toUpperCase(), us.toUpperCase()]);
  }
  return variants;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "__generated__") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (extensions.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

const files = targetDirs.flatMap((dir) => (fs.existsSync(dir) ? walk(dir) : []));

const results = [];
for (const file of files) {
  if (skipFiles.has(path.resolve(file))) continue;
  const original = fs.readFileSync(file, "utf-8");
  let updated = original;
  const hits = [];
  for (const pair of pairs) {
    for (const [uk, us] of capitalizedVariants(pair)) {
      const re = toRegex(uk);
      const matches = updated.match(re);
      if (matches) {
        hits.push({ uk, us, count: matches.length });
        updated = updated.replace(re, us);
      }
    }
  }
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    results.push({ file: path.relative(repoRoot, file), hits });
  }
}

if (results.length === 0) {
  console.log("No UK English found.");
} else {
  console.log(`Updated ${results.length} files:`);
  for (const r of results) {
    const summary = r.hits.map((h) => `${h.uk}→${h.us}(${h.count})`).join(", ");
    console.log(`  ${r.file}: ${summary}`);
  }
}
