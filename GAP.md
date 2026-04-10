# Able Care Site — Gap Tracker

## Missing Pages

### Policy Pages (linked in footer)
- [ ] `/privacy` — Privacy Policy
- [ ] `/terms` — Terms of Service
- [ ] `/cookies` — Cookies Policy
- [ ] `/security` — Security page

### Company Pages
- [ ] `/careers` — Careers (linked from meet-the-team.json)

### Solution Pages
- [ ] `/solutions/grip-strength` — Grip Strength solution (linked from grip-strength.json, hand-dynamometers.json)

### Resource Pages
- [ ] `/resources/ccrc-guide` — CCRC guide (linked in content)
- [ ] `/resources/hhvbp-guide` — HHVBP guide (linked in content)
- [ ] `/resources/walkthrough` — Product walkthrough (linked in content)

---

## Missing Images

### Feature/Content Images
- [ ] `/images/able-assess-app.jpg`
- [ ] `/images/able-strength-app.jpg`
- [ ] `/images/buyers-guide-cover.jpg`
- [ ] `/images/clinicians-data.jpg`
- [ ] `/images/home-care-frontline.jpg`
- [ ] `/images/imperial-college-origin.jpg`
- [ ] `/images/population-health-dashboard.jpg`
- [ ] `/images/prevention-approach.jpg`
- [ ] `/images/senior-living-frontline.jpg`
- [ ] `/images/upstream-prevention.jpg`

### Team Photos
- [ ] `/images/team/nabil-belbachir.jpg`
- [ ] `/images/team/catriona-kelly.jpg`
- [ ] `/images/team/paul-rinne.jpg`
- [ ] `/images/team/advisory-board.jpg`

### Open Graph Images (24 total)
- [ ] All OG images (`/images/og-*.png`) — needed for social sharing/SEO

### Logo Variant
- [ ] `/images/able-care-logo.svg` — SVG version of logo

---

## Broken Internal Links

### Pharma Path Mismatch
Multiple content files link to `/for/pharma-and-cros/` but the page is at `/pharma`. Affected files:
- `content/pages/homepage.json`
- `content/segments/clinicians.json`
- `content/segments/home-care.json`
- `content/segments/pharma.json`
- `content/segments/senior-living.json`

### Other Dead Links
- `meet-the-team.json` links to `/careers` (page missing)
- `grip-strength.json` links to `/solutions/grip-strength/` (page missing)
- `hand-dynamometers.json` links to `/solutions/grip-strength/` (page missing)
- `customers.json` links to `/company/demo` (should be `/demo`)

---

## TODO Placeholders in Content

- [ ] `content/compare/vs-nymbl.json` line 73 — `[TODO: source needed]`
- [ ] `content/compare/vs-safelyyou.json` line 78 — `[TODO: source needed]`

---

## Blog Featured Images
No blog articles have `featuredImage` fields — the new split layout shows a placeholder gradient for all articles. Need featured images for:
- [ ] grip-strength
- [ ] falls-risk-assessment
- [ ] functional-assessments
- [ ] hand-dynamometers
- [ ] what-is-grip-strength-testing
- [ ] falls-prevention-home-health-2026
- [ ] nice-2025-falls-guidance-response
