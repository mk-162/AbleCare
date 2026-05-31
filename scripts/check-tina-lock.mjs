// Verifies (or rewrites) tina/tina-lock.json so it never goes stale again.
//
// WHY THIS EXISTS
// Tina Cloud reads the COMMITTED tina/tina-lock.json from the repo as its
// schema — it does NOT run `tinacms build` server-side. If config.ts changes
// (e.g. a new block) without regenerating the committed lock, Tina Cloud
// indexes content against an outdated schema and branch indexing fails with
// errors like "TinaFetchError: Unable to seed <doc>.json" — even though local
// `tinacms audit` passes (audit builds a fresh schema and never reads the
// committed lock). This bit `main` for days (see commit 655aef6). Unlike
// tina/__generated__/ (gitignored; Vercel regenerates it), the lock MUST stay
// committed and current.
//
// HOW
// The lock is just a bundle of the three generated schema files — exactly as
// @tinacms/cli writes it: JSON.stringify({ schema, lookup, graphql }) of
// tina/__generated__/{_schema,_lookup,_graphql}.json (compact, no trailing
// newline). So: regenerate __generated__ (the npm scripts do this via
// `tinacms build --local`), then run this script.
//
//   node scripts/check-tina-lock.mjs           -> CHECK: exit 1 if lock is stale
//   node scripts/check-tina-lock.mjs --write    -> FIX:   rewrite the lock
//
// The generated schema files (_schema/_lookup/_graphql.json) are build-mode
// independent, so a lock written here is identical to one from `tinacms dev`
// or a production build.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const GEN = path.join(ROOT, 'tina', '__generated__');
const LOCK_PATH = path.join(ROOT, 'tina', 'tina-lock.json');
const SOURCES = { schema: '_schema.json', lookup: '_lookup.json', graphql: '_graphql.json' };

const FIX_HINT = [
  '',
  'tina/tina-lock.json is OUT OF SYNC with tina/config.ts.',
  '',
  'Tina Cloud reads the committed tina-lock.json as its schema, so a stale lock',
  'breaks branch indexing on TinaCloud (e.g. "Unable to seed <doc>.json") even',
  'though local `tinacms audit` passes.',
  '',
  'Fix:   npm run tina:lock       (regenerates and rewrites the lock)',
  'then:  git add tina/tina-lock.json && commit',
  '',
].join('\n');

function readJSON(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

// Build the lock object exactly as @tinacms/cli does (key order schema/lookup/graphql).
function buildLockObject() {
  const missing = Object.values(SOURCES)
    .map((f) => path.join(GEN, f))
    .filter((p) => !existsSync(p));
  if (missing.length) {
    console.error(
      `✗ Missing generated schema files:\n  ${missing.join('\n  ')}\n\n` +
        'Run a Tina schema build first, e.g.:\n' +
        '  npx tinacms build --local --skip-cloud-checks --skip-indexing --skip-search-index\n' +
        '(the `tina:lock` / `tina:lock:check` npm scripts do this for you)',
    );
    process.exit(2);
  }
  return {
    schema: readJSON(path.join(GEN, SOURCES.schema)),
    lookup: readJSON(path.join(GEN, SOURCES.lookup)),
    graphql: readJSON(path.join(GEN, SOURCES.graphql)),
  };
}

// Canonical, order-stable JSON: sort object keys recursively, preserve array order.
// Lets us detect real schema drift while ignoring incidental key-ordering noise.
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = canonical(value[key]);
    return out;
  }
  return value;
}
const stable = (value) => JSON.stringify(canonical(value));

const fresh = buildLockObject();

if (process.argv.includes('--write')) {
  // Match the CLI byte-for-byte: compact JSON, no spacing, no trailing newline.
  writeFileSync(LOCK_PATH, JSON.stringify(fresh));
  console.log('✓ Wrote regenerated tina/tina-lock.json');
  process.exit(0);
}

if (!existsSync(LOCK_PATH)) {
  console.error('✗ tina/tina-lock.json is missing.');
  console.error(FIX_HINT);
  process.exit(1);
}

let committed;
try {
  committed = readJSON(LOCK_PATH);
} catch (err) {
  console.error(`✗ tina/tina-lock.json is not valid JSON: ${err.message}`);
  console.error(FIX_HINT);
  process.exit(1);
}

const drift = Object.keys(SOURCES).filter((section) => stable(committed[section]) !== stable(fresh[section]));

if (drift.length === 0) {
  console.log('✓ tina/tina-lock.json is in sync with tina/config.ts');
  process.exit(0);
}

console.error(`✗ tina/tina-lock.json is STALE — drift detected in: ${drift.join(', ')}`);
console.error(FIX_HINT);
process.exit(1);
