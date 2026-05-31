# TinaCMS Cloud — "indexing branch failed" runbook & handover

> **Audience:** engineers and AI agents working on **any** TinaCMS + Tina Cloud
> project (not just AbleCare). This is a portable runbook for diagnosing and
> permanently fixing the most common Tina Cloud indexing failure. AbleCare is
> used as the worked example; everything generalizes.

---

## 0. TL;DR

If Tina Cloud says **"indexing branch failed"** (with no detail) on one branch
while another branch indexes fine, and **`npx tinacms audit` passes locally**,
the cause is almost always a **stale committed `tina/tina-lock.json`**:

- Tina Cloud reads the **committed** `tina-lock.json` from your repo as its
  schema. **It does not run `tinacms build` server-side.**
- If `tina/config.ts` changed (e.g. a new block/field) **without regenerating
  and committing the lock**, the cloud indexes content against an outdated
  schema. Any document using the new block fails to seed →
  `TinaFetchError: Unable to seed <path>.json` → "indexing branch failed".
- Local `tinacms audit` passes because **audit builds a fresh schema from
  `config.ts`** and never reads the committed lock.

**Fix:** regenerate `tina/tina-lock.json`, commit it, push to the broken
branch. Tina Cloud reindexes on push.

**Prevent:** add the CI guard in §6 so the lock can never silently drift again.

---

## 1. Failure signature (how to recognize this)

You are very likely looking at this bug if **several** of these are true:

- Tina Cloud dashboard log shows only **"indexing branch failed"** — no detail.
- The editor shows a persistent **"GraphQL Schema Mismatch — Editing may not
  work"** banner.
- **One branch indexes, another fails** (commonly: a feature/`dev` branch is
  fine, `main` is broken — or vice-versa). The failing branch is the one whose
  `config.ts` has a block/field the committed lock lacks.
- **`npx tinacms audit` passes** locally (content + schema validate).
- The trouble started right after a commit that **added a new block or field**
  to `tina/config.ts` (and content that uses it).
- Things that look related but are usually **red herrings**: rapid field
  renames / "GraphQL collision" churn, `tina/__generated__/` staleness, the
  app deploying or not deploying to Vercel. (Tina Cloud indexes from **GitHub**
  via webhook, independent of any host deploy.)

---

## 2. The key technique: get Tina Cloud's REAL error

The dashboard hides the real error behind "indexing branch failed". There is no
public "view logs" button and no per-job-ID API. Get the real error from the
**branch status endpoint** the dashboard itself calls:

```
GET https://content-v2.tinajs.io/db/<CLIENT_ID>/status?limit=25&offset=0
Authorization: Bearer <dashboard token>
```

**How to obtain `<dashboard token>` (no server secrets needed):**

1. Open the Tina Cloud dashboard (`https://app.tina.io/...`) in a browser, logged in.
2. DevTools → **Network**. Trigger/observe a reindex.
3. Find the request named **`status?limit=25&offset=0`** (host
   `content-v2.tinajs.io`). Either:
   - read its **Response** body directly, **or**
   - copy its `authorization: Bearer …` request header and call the endpoint
     yourself (curl / `fetch`) to get the full JSON.

> The token is a **short-lived (~1h) Cognito ID token** from the dashboard
> session. It is **not** your `TINA_TOKEN` (that one is typically marked
> *Sensitive* on Vercel and **cannot** be pulled via `vercel env pull`).

**What the response tells you** — a `statuses[]` array, one entry per indexed branch:

```json
{
  "name": "main",
  "indexStatus": {
    "status": "failed",
    "error": "TinaFetchError: Unable to seed content/resources/documents.json",
    "sha": "..."
  }
}
```

`status: "complete"` = healthy. The `error` string on a failed branch is the
real cause. **`Unable to seed <path>.json`** points at the exact document the
cloud choked on — that document uses a block/field missing from the cloud's
(stale) schema.

> Programmatic read (Node 18+), prints each branch's status:
> ```js
> const CLIENT_ID = "<your client id>";
> const AUTH = "Bearer <dashboard token>";
> const r = await fetch(`https://content-v2.tinajs.io/db/${CLIENT_ID}/status?limit=25&offset=0`,
>   { headers: { authorization: AUTH, origin: "https://app.tina.io", "x-tina-area": "cloud-dashboard" } });
> for (const s of (await r.json()).statuses) console.log(s.name, JSON.stringify(s.indexStatus));
> ```

---

## 3. Confirm it's the stale-lock cause

Once the error is `Unable to seed <doc>.json` (or you just suspect schema drift):

1. **Find what the doc uses.** Open `<doc>.json`; note its `_template` (block
   name) and any field added recently (e.g. `pdfDocumentCards` / `columnCount`).
2. **Check the committed lock for that block/field:**
   ```bash
   grep -c pdfDocumentCards tina/tina-lock.json   # 0  => lock is missing it
   grep -c pdfDocumentCards tina/config.ts        # >0 => config has it
   ```
   Lock has **0**, config has **>0** ⇒ **stale lock confirmed.**
3. **Cross-check dates** (optional but convincing):
   ```bash
   git log -1 --format='%h %ad' -- tina/tina-lock.json   # last lock regen
   git log -1 --format='%h %ad' -S 'pdfDocumentCards' -- tina/config.ts  # block added
   ```
   If the lock predates the config change, that's the smoking gun.
4. **Compare the working vs failing branch** to see exactly what's unique:
   ```bash
   git diff --stat origin/<good-branch> origin/<bad-branch> -- tina/config.ts content
   ```

---

## 4. The fix

Regenerate `tina/tina-lock.json` so it includes the current schema, then commit
and push to the **broken branch**.

### Why it's fiddly to regenerate

The lock is the bundle `JSON.stringify({ schema, lookup, graphql })` of the
three generated files `tina/__generated__/{_schema,_lookup,_graphql}.json`
(compact, no trailing newline — see `@tinacms/cli` `BuildCommand`). But:

- `tinacms build` (production, no `--local`) **needs** `clientId` + `token` and
  errors out (`Missing clientId, token` / 401) before writing anything.
- `tinacms build --local …` regenerates `tina/__generated__/` but, on its own,
  **does not rewrite the committed `tina-lock.json`**.
- `tinacms audit` regenerates `__generated__/` too but doesn't touch the lock.
- `tinacms dev` **does** write the lock canonically (start it, let it compile,
  stop it).

### Recommended: use the repo's npm scripts (see §6)

```bash
npm run tina:lock            # regenerates schema + rewrites tina-lock.json
git add tina/tina-lock.json
git commit -m "fix(tina): regenerate tina-lock.json"
git push origin <broken-branch>
```

### Or regenerate manually (no Tina Cloud credentials needed)

```bash
# 1) regenerate tina/__generated__/ locally (no creds, exits 0):
npx tinacms build --local --skip-cloud-checks --skip-indexing --skip-search-index

# 2) bundle the three generated files into the committed lock (exact CLI logic):
node -e 'const fs=require("fs"),p="tina/__generated__/";fs.writeFileSync("tina/tina-lock.json",JSON.stringify({schema:JSON.parse(fs.readFileSync(p+"_schema.json")),lookup:JSON.parse(fs.readFileSync(p+"_lookup.json")),graphql:JSON.parse(fs.readFileSync(p+"_graphql.json"))}))'
```

The generated schema files are **build-mode independent**, so a lock built this
way is identical to one from `tinacms dev` or a production build.

### Confirm the fix

After pushing, Tina Cloud reindexes via webhook (or click **Reindex** in the
dashboard; click **Refresh Webhooks** first if a commit storm disrupted it).
Re-poll the status endpoint from §2 — the branch should flip to
`status: "complete"` at your new SHA, and the editor's schema-mismatch banner
clears.

If the branch **still** fails after a correct lock lands (uncommon), its cloud
index may be independently wedged from prior failed jobs. Options: push a
trivial change to retrigger, cut a **freshly-named branch** off it and index
that (clean = the original was wedged), or escalate to Tina (Discord `#help`
/ `support@tina.io`) with the branch + failed-job context.

---

## 5. What NOT to waste time on (ruled out the hard way)

- **Field-name "collisions" / renaming** (`columns` ↔ `columnCount`, etc.).
  A transient GraphQL collision can be the *original* trigger, but once the
  schema is internally consistent (audit passes) the renames are noise. Don't
  flip-flop names.
- **Re-committing `tina/__generated__/`.** That folder should be **gitignored**
  — your host (Vercel) regenerates it at build. (See the sibling gotcha below.)
- **Document-count quotas.** If both branches have similar doc counts and one
  works, it isn't a flat quota.
- **Image/media field formats.** Absolute `/images/...` values index fine; the
  indexer stores the string and doesn't fetch the asset.
- **"It didn't deploy to Vercel."** Irrelevant to indexing — Tina Cloud indexes
  the **GitHub** branch via webhook, not the host build.
- **Trusting `tinacms audit` as proof the cloud will index.** Audit uses a fresh
  schema; the cloud uses the committed lock. They can disagree — that gap *is*
  this bug.

### Sibling gotcha: two files, opposite rules

| File | Gitignore? | Who regenerates it | Failure if stale |
|---|---|---|---|
| `tina/__generated__/` | **Yes** (gitignore it) | Host build (Vercel) on every deploy | Local "Schema Mismatch" if you commit it and it drifts |
| `tina/tina-lock.json` | **No** (must stay committed) | You, locally, then commit | **Tina Cloud branch indexing fails** |

Same staleness class, **opposite remedy**. Don't gitignore the lock; don't
commit `__generated__`.

---

## 6. Prevention: the CI guard (port this to every Tina repo)

Two files + three npm scripts make the lock impossible to silently break. They
regenerate the schema and fail CI if the committed lock is out of date — and
they run on **pushes to `main`/`dev`**, which catches edits made through the
**GitHub web UI** (a common way the lock goes stale, since web edits never run
a local build).

**`scripts/check-tina-lock.mjs`** — rebuilds the lock object from
`tina/__generated__/` and compares (semantically) to the committed
`tina/tina-lock.json`; `--write` rewrites it. (Copy from this repo.)

**`package.json` scripts:**
```jsonc
"tina:schema": "tinacms build --local --skip-cloud-checks --skip-indexing --skip-search-index",
"tina:lock":   "npm run tina:schema && node scripts/check-tina-lock.mjs --write",
"tina:lock:check": "npm run tina:schema && node scripts/check-tina-lock.mjs"
```

**`.github/workflows/tina-lock-check.yml`:**
```yaml
name: Tina lock check
on:
  pull_request:
  push:
    branches: [main, dev]
jobs:
  tina-lock:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run tina:lock:check
```

**Porting checklist for another repo:**
- Copy `scripts/check-tina-lock.mjs` and `.github/workflows/tina-lock-check.yml`.
- Add the three npm scripts. Adjust the package manager (`npm ci` → `pnpm i
  --frozen-lockfile` / `yarn --immutable`) and `node-version` to match the repo.
- If the repo uses a different lockfile or `tina/` location, adjust paths in the
  script (`ROOT`, `GEN`, `LOCK_PATH`).
- (Optional) make the check a **required** status check in branch protection so
  stale locks can't merge.
- Local fix when it fails: `npm run tina:lock && git add tina/tina-lock.json`.

> Determinism note: the check regenerates the schema and compares **parsed**
> JSON with sorted keys, so it's robust to key-ordering/whitespace and is OS-
> independent (verified passing on Linux CI). Keep dependency versions pinned
> (`npm ci`) so the `@tinacms/graphql` version in the lock stays consistent.

---

## 7. AbleCare worked example (reference)

- **Symptom:** `main` failed to index for ~4 days; `dev` fine; "Schema Mismatch"
  banner; `tinacms audit` passed.
- **Real error (via §2):** `TinaFetchError: Unable to seed content/resources/documents.json`.
- **Cause:** `documents.json` uses the `pdfDocumentCards` block, added to
  `config.ts` in `f5ee6de` (2026-05-26). The committed `tina-lock.json` was last
  regenerated in `b446593` (2026-05-22, *"regenerate tina-lock.json to sync
  TinaCloud schema"* — the team had hit this once before). So the cloud's schema
  had no `pdfDocumentCards`; seeding that doc failed.
- **Fix:** regenerated the lock (`pdfDocumentCards` ×0 → ×126), committed
  `655aef6`, pushed to `main`. Status API then showed `main: complete`.
- **Prevention:** the CI guard in §6 (`82d7b9e`), verified to fail on the exact
  historical stale lock.

---

## 8. Quick reference

| Thing | Value / command |
|---|---|
| Real error endpoint | `GET content-v2.tinajs.io/db/<clientId>/status?limit=25&offset=0` (+ dashboard Bearer token) |
| Validate content locally | `npx tinacms audit` |
| Regenerate `__generated__` (no creds) | `npx tinacms build --local --skip-cloud-checks --skip-indexing --skip-search-index` |
| Regenerate the committed lock | `npm run tina:lock` (or `tinacms dev`, or bundle the 3 `__generated__/_*.json`) |
| Check lock freshness | `npm run tina:lock:check` |
| Lock = | `JSON.stringify({ schema, lookup, graphql })` of `tina/__generated__/{_schema,_lookup,_graphql}.json` |
| Cloud reads schema from | **committed `tina/tina-lock.json`** (not a server-side build) |
| `tina/__generated__/` | **gitignored**; host regenerates at build |
| `tina/tina-lock.json` | **committed**; you must keep it current |
