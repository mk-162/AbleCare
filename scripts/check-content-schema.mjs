// Verifies that every field stored in content/ is declared in the Tina schema.
//
// WHY THIS EXISTS
// Tina writes back only the fields its schema declares. Any key sitting in a
// content file that `tina/config.ts` does not define is invisible to the editor
// and is SILENTLY DROPPED the first time somebody saves that document in Tina.
// If the site reads that key, the page breaks — and the culprit looks like an
// innocent content edit, days later, by someone who only changed a headline.
//
// This bit us with `slug`: all 26 content/learn/*.json carried a `slug` field
// the schema never declared. It happened to be dead (the site derives slugs
// from filenames), so removing it was safe — but nothing would have warned us
// if it hadn't been.
//
// HOW
// The committed tina/tina-lock.json holds the compiled schema (the same one
// Tina Cloud indexes against). Walk each collection's files and compare their
// keys to the declared fields, recursing through object fields and block
// templates. Keys beginning with "_" are Tina's own (_template, _sys) and are
// ignored.
//
//   node scripts/check-content-schema.mjs
//
// Run `npm run tina:lock:check` alongside this: it guarantees the lock this
// script reads is actually in sync with tina/config.ts.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const LOCK_PATH = path.join(ROOT, 'tina', 'tina-lock.json');

const FIX_HINT = [
  '',
  'Each field above exists in a content file but NOT in tina/config.ts.',
  'Tina will silently delete it the next time that document is saved in the editor.',
  '',
  'Fix, whichever is true:',
  '  • the field is still needed  -> declare it in tina/config.ts,',
  '                                  then `npm run tina:lock` and commit the lock',
  '  • the field is dead          -> delete it from the content file(s) deliberately,',
  '                                  after checking nothing in src/ reads it',
  '',
].join('\n');

if (!existsSync(LOCK_PATH)) {
  console.error('✗ tina/tina-lock.json is missing — run `npm run tina:lock` first.');
  process.exit(2);
}

const { schema } = JSON.parse(readFileSync(LOCK_PATH, 'utf8'));
const collections = schema?.collections ?? [];
if (collections.length === 0) {
  console.error('✗ No collections found in tina/tina-lock.json.');
  process.exit(2);
}

// `match.include` is a glob naming which files in a shared directory belong to
// this collection (content/settings hosts three collections this way).
function matcher(include) {
  if (!include) return null;
  const rx = new RegExp(
    '^' + include.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$'
  );
  return (basename) => rx.test(basename);
}

// ── Known debt (a ratchet, not a mute button) ────────────────────────────────
// Fields that were already undeclared when this check was introduced
// (2026-09-03). Listed explicitly so the check can go green today while still
// failing on anything NEW, and so the debt stays visible instead of dissolving
// into a passing build.
//
// The list only shrinks. Removing a field from content, or declaring it in
// tina/config.ts, means deleting its line here too — the check fails on a stale
// entry as well as on a new one, so this cannot quietly rot.
//
// RESOLVED so far:
//   • `.seo` (19 documents) — was the dangerous one: read by the site
//     (page.seo?.title / .description / .ogImage in app/[slug], solutions,
//     home-care, senior-living) yet undeclared, so saving any of those pages
//     in Tina deleted its title, meta description and OG image. Now declared
//     in tina/config.ts as an object on seoFields, plus SEO Defaults on the
//     global collection. This check flagged the stale entries the moment the
//     schema changed, which is the ratchet doing its job.
//
// SEVERITY of what remains, highest first:
//   • `content/settings/navigation.json` header/footer — the schema declares
//     mainNav/footerNav, so the whole document is undeclared. Nothing in src/
//     reads it, but an editor opening Navigation in Tina sees empty fields and
//     saving would wipe the file.
//   • `global.json` seo/analytics/alertBanner — same shape, also unread.
//   • `.slug` — dead everywhere (slugs come from filenames); safe to delete,
//     as was already done for content/learn.
//   • `meet-the-team.json.blocks[2].heading` — not a field on that block's
//     template; would be dropped on save.
const KNOWN_UNDECLARED = new Set([
  'content/solutions/able-assess.json.slug',
  'content/solutions/able-rehab.json.slug',
  'content/solutions/grip-strength.json.slug',
  'content/solutions/sensor.json.slug',
  'content/segments/area-agencies-on-aging.json.slug',
  'content/segments/home-care.json.slug',
  'content/segments/home-health-agencies.json.slug',
  'content/segments/hospital-systems.json.slug',
  'content/segments/pharma.json.slug',
  'content/segments/senior-living.json.slug',
  'content/segments/skilled-nursing.json.slug',
  'content/resources/case-studies.json.slug',
  'content/resources/documents.json.slug',
  'content/resources/research-library.json.slug',
  'content/company/about.json.slug',
  'content/company/contact.json.slug',
  'content/company/demo.json.slug',
  'content/company/meet-the-team.json.slug',
  'content/company/meet-the-team.json.blocks[2].heading',
  'content/company/support.json.slug',
  'content/settings/global.json.analytics',
  'content/settings/global.json.alertBanner',
  'content/settings/navigation.json.header',
  'content/settings/navigation.json.footer',
]);

const issues = [];

/** Fields for one item of an object field: either fixed fields or a block template. */
function fieldsForItem(field, item, where) {
  if (field.templates) {
    const template = item?._template;
    const found = field.templates.find((t) => t.name === template);
    if (!found) {
      issues.push(
        `${where}: unknown block template ${template ? `"${template}"` : '(missing _template)'}`
      );
      return null;
    }
    return found.fields ?? [];
  }
  return field.fields ?? [];
}

function walk(value, fields, where) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;

  const declared = new Map((fields ?? []).map((f) => [f.name, f]));

  for (const key of Object.keys(value)) {
    // Tina's own bookkeeping (_template, _sys, …) is never part of the schema.
    if (key.startsWith('_')) continue;
    if (!declared.has(key)) issues.push(`${where}.${key}`);
  }

  for (const field of fields ?? []) {
    if (field.type !== 'object') continue;
    const child = value[field.name];
    if (child == null) continue;

    const items = field.list ? (Array.isArray(child) ? child : []) : [child];
    items.forEach((item, i) => {
      const at = field.list ? `${where}.${field.name}[${i}]` : `${where}.${field.name}`;
      const nested = fieldsForItem(field, item, at);
      if (nested) walk(item, nested, at);
    });
  }
}

function readDoc(file, format) {
  const raw = readFileSync(file, 'utf8');
  if (format === 'md' || format === 'markdown' || format === 'mdx') return matter(raw).data;
  return JSON.parse(raw);
}

let filesChecked = 0;

for (const collection of collections) {
  const dir = path.join(ROOT, collection.path);
  if (!existsSync(dir)) continue;

  const format = collection.format ?? 'md';
  const ext = format === 'json' ? '.json' : `.${format === 'markdown' ? 'md' : format}`;
  const include = matcher(collection.match?.include);

  for (const name of readdirSync(dir)) {
    if (!name.endsWith(ext)) continue;
    const base = name.slice(0, -ext.length);
    if (include && !include(base)) continue;

    const file = path.join(dir, name);
    let doc;
    try {
      doc = readDoc(file, format);
    } catch (err) {
      issues.push(`${collection.path}/${name}: unreadable (${err.message})`);
      continue;
    }
    filesChecked += 1;
    walk(doc, collection.fields, `${collection.path}/${name}`);
  }
}

const fresh = issues.filter((i) => !KNOWN_UNDECLARED.has(i));
const seen = new Set(issues);
const stale = [...KNOWN_UNDECLARED].filter((i) => !seen.has(i));

if (fresh.length === 0 && stale.length === 0) {
  const known = issues.length;
  console.log(
    `\u2713 Checked ${filesChecked} content files \u2014 no new undeclared fields` +
      (known ? ` (${known} known, see KNOWN_UNDECLARED in this script)` : '')
  );
  process.exit(0);
}

if (fresh.length) {
  console.error(
    `\u2717 Found ${fresh.length} NEW field(s) in content/ that the Tina schema does not declare:\n`
  );
  for (const issue of fresh) console.error(`  ${issue}`);
  console.error(FIX_HINT);
}

if (stale.length) {
  console.error(
    `\u2717 ${stale.length} entr(y/ies) in KNOWN_UNDECLARED no longer occur \u2014 delete them from` +
      ' scripts/check-content-schema.mjs so the list keeps shrinking:\n'
  );
  for (const issue of stale) console.error(`  ${issue}`);
  console.error('');
}

process.exit(1);
