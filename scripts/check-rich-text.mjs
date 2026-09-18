// Verifies that every rich-text field in content/ parses with Tina's own parser.
//
// WHY THIS EXISTS
// The site renders article bodies through a markdown fallback, so a body that
// Tina cannot parse still looks fine on the public page. The EDITOR is another
// matter: Tina shows "Unable to parse rich-text", empties the Body field, and
// disables Save for the whole document — an editor cannot change so much as a
// title on that page. Nothing in the build catches it, so it surfaces as "the
// save button doesn't work", days later, to whoever opens the page next.
//
// That is exactly how one blog article sat unsaveable for months: a quote
// attribution written as `> - Name` — a list inside a blockquote, which Tina's
// document model cannot hold. Its title, image and excerpt could not be saved
// either, because the body error invalidates the whole form.
//
// A lesson baked into this script: parse with the field definition from the
// schema, never a bare `{ type: "rich-text" }`. A bare field defaults to MDX,
// where `<10%` is a JSX error; both of this site's rich-text fields declare
// `parser: { type: "markdown" }`, where it is plain text. Diagnosing with the
// wrong mode produced five false positives before this check was written.
//
// HOW
// Read the compiled schema from the committed tina-lock.json, find every
// collection's rich-text fields, and run each value through @tinacms/mdx —
// the same parser the editor uses — reporting any `invalid_markdown` node with
// the file, field and parser message. Markdown collections' body (isBody) is
// the file content after the frontmatter.
//
//   node scripts/check-rich-text.mjs
//
// No baseline: this should always be green. A failure means an editor is
// locked out of that document until it is fixed.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { parseMDX } from '@tinacms/mdx';

const ROOT = process.cwd();
const LOCK_PATH = path.join(ROOT, 'tina', 'tina-lock.json');

if (!existsSync(LOCK_PATH)) {
  console.error('✗ tina/tina-lock.json is missing — run `npm run tina:lock` first.');
  process.exit(2);
}

const { schema } = JSON.parse(readFileSync(LOCK_PATH, 'utf8'));

function matcher(include) {
  if (!include) return null;
  const rx = new RegExp(
    '^' + include.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$'
  );
  return (basename) => rx.test(basename);
}

function invalidNodes(ast) {
  const out = [];
  (function walk(n) {
    if (!n || typeof n !== 'object') return;
    if (n.type === 'invalid_markdown') out.push(n);
    (n.children ?? []).forEach(walk);
  })(ast);
  return out;
}

const failures = [];
let fieldsChecked = 0;

for (const collection of schema?.collections ?? []) {
  const richText = (collection.fields ?? []).filter((f) => f.type === 'rich-text');
  if (richText.length === 0) continue;

  const dir = path.join(ROOT, collection.path);
  if (!existsSync(dir)) continue;

  const format = collection.format ?? 'md';
  const isJson = format === 'json';
  const ext = isJson ? '.json' : `.${format === 'markdown' ? 'md' : format}`;
  const include = matcher(collection.match?.include);

  for (const name of readdirSync(dir)) {
    if (!name.endsWith(ext)) continue;
    if (include && !include(name.slice(0, -ext.length))) continue;

    const file = `${collection.path}/${name}`;
    const raw = readFileSync(path.join(dir, name), 'utf8');
    let doc, mdBody;
    try {
      if (isJson) doc = JSON.parse(raw);
      else { const m = matter(raw); doc = m.data; mdBody = m.content; }
    } catch (err) {
      failures.push(`${file}: unreadable (${err.message})`);
      continue;
    }

    for (const field of richText) {
      const value = !isJson && field.isBody ? mdBody : doc?.[field.name];
      if (typeof value !== 'string' || value.trim() === '') continue; // empty / already-AST: nothing to parse
      fieldsChecked += 1;
      let ast;
      try {
        ast = parseMDX(value, field, (s) => s);
      } catch (err) {
        failures.push(`${file} › ${field.name}: parser threw — ${err.message.split('\n')[0]}`);
        continue;
      }
      for (const node of invalidNodes(ast)) {
        const line = node.position?.start?.line;
        failures.push(
          `${file} › ${field.name}${line ? ` (line ${line})` : ''}: ${(node.message ?? 'invalid markdown').split('\n')[0]}`
        );
      }
    }
  }
}

if (failures.length === 0) {
  console.log(`✓ ${fieldsChecked} rich-text fields parse cleanly with Tina's editor parser`);
  process.exit(0);
}

console.error(`✗ ${failures.length} rich-text field(s) will NOT open in the Tina editor:\n`);
for (const f of failures) console.error(`  ${f}`);
console.error(`
Each of these shows "Unable to parse rich-text" in Tina and disables Save for the
whole document, so an editor cannot change anything on that page until it is fixed.

Common causes:
  • a list inside a blockquote (e.g. a "> - Name" attribution) — move it out of the quote.
  • a block that Tina's document model cannot nest where it sits — the message names
    the node type; simplify the structure.
  • only if the field declares parser "mdx": \`<\` before a digit or curly braces read as
    JSX — escape them. Neither of this site's rich-text fields is mdx.
`);
process.exit(1);
