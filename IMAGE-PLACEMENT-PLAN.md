# Image Placement Plan — CRO-Optimised

> Maps every available image to specific pages/blocks on the new site.
> Led by old-site placement (proven CRO), filling every empty slot.

---

## Priority 1 — Fix Broken References (Immediate)

These JSON files reference images that don't exist or have wrong names.

### Team Photo Fixes

| Content File | Current Reference | Fix | Available Image |
|---|---|---|---|
| `content/company/meet-the-team.json` | `/images/team/paul-rinne.jpg` | Rename to match | `/images/team/dr-paul-rinne.jpg` |
| `content/company/meet-the-team.json` | `/images/team/mike-mace.jpg` | Rename to match | `/images/team/dr-mike-mace.jpg` |
| `content/company/about.json` | `/images/team/paul-rinne.jpg` | Rename to match | `/images/team/dr-paul-rinne.jpg` |
| `content/company/about.json` | `/images/team/nabil-belbachir.jpg` | **No image available** | Need headshot or use initials fallback |
| `content/company/about.json` | `/images/team/catriona-kelly.jpg` | **No image available** | Need headshot or use initials fallback |
| `content/company/about.json` | `/images/team/advisory-board.jpg` | **No image available** | Use initials fallback |
| `content/company/meet-the-team.json` | `/images/team/danielle-richards.jpg` | **No image available** | Need headshot or use initials fallback |

**Action**: Update JSON refs from `paul-rinne.jpg` → `dr-paul-rinne.jpg` and `mike-mace.jpg` → `dr-mike-mace.jpg` in both files.

---

## Priority 2 — ImageFeature Blocks (High-Impact CRO)

These are full-width image+text sections. On the old site, every one had a real image. On the new site, they all show gradient placeholders. This is the single biggest visual gap.

### Homepage (`content/pages/homepage.json`)

| Block | Headline | Recommended Image | Why (CRO) |
|---|---|---|---|
| `imageFeature` | "Technology built for the frontline" | `/images/product/gripable-sensor-with-tablets-1054x722-min.png` | Old site used this exact shot — tablet + sensor ecosystem. Shows the product in context. Highest-impact placement on the page. |

### About (`content/company/about.json`)

| Block | Headline | Recommended Image | Why (CRO) |
|---|---|---|---|
| `imageFeature` #1 | "From Imperial College to the frontline" | `/images/product/gripable-on-platform-min.jpg` | Old site used this on the About page. Professional product shot signals credibility and origin story. |
| `imageFeature` #2 | "The problem we solve" | `/images/features/Able-Care-Product-Continuum-2-min.png` | Old site used this diagram on About. Shows the product range and upstream prevention positioning. |

### Home Care (`content/segments/home-care.json`)

| Block | Headline | Recommended Image | Why (CRO) |
|---|---|---|---|
| `imageFeature` | "Technology built for the frontline" | `/images/product/two-people-using-gripable-and-the-app-resized-v2-min.jpg` | Shows a real care setting with the product in use — matches "frontline" messaging. Old site used similar clinical-setting images on solutions pages. |

### Senior Living (`content/segments/senior-living.json`)

| Block | Headline | Recommended Image | Why (CRO) |
|---|---|---|---|
| `imageFeature` | "Technology built for the frontline" | `/images/product/elderly-man-holding-gripable-resized.jpg` | Senior user holding the device — directly relevant to the senior living audience. Mirrors old site About page placement. |

### Clinicians (`content/segments/clinicians.json`)

| Block | Headline | Recommended Image | Why (CRO) |
|---|---|---|---|
| `imageFeature` | "Clinical-grade data, captured digitally" | `/images/features/health-data-platform-min.png` | Dashboard/data platform screenshot. Clinicians want to see the data output. Old site used similar platform screenshots on solutions pages. |

### Able Assess (`content/solutions/able-assess.json`)

| Block | Headline | Recommended Image | Why (CRO) |
|---|---|---|---|
| `imageFeature` | "Clinical-grade, tablet-simple" | `/images/heroes/devices-hero-new-min.png` | Multi-device hero showing the app on tablet — directly matches "tablet-simple" headline. Old site's main Able Assess hero. |

### Able Strength (`content/solutions/able-strength.json`)

| Block | Headline | Recommended Image | Why (CRO) |
|---|---|---|---|
| `imageFeature` | "Clinical-grade, patient-simple" | `/images/features/phone-trimmed-min.png` | Phone showing the app — matches patient-facing product. Old site used this on the Grip Strength solutions page. |

### Falls Prevention (`content/solutions/falls-prevention.json`)

| Block | Headline | Recommended Image | Why (CRO) |
|---|---|---|---|
| `imageFeature` | "We sit upstream of detection and response" | `/images/features/Able-Care-Product-Continuum-2-min.png` | Product continuum diagram — visually explains "upstream" positioning. Old site used this diagram to illustrate the prevention-vs-detection narrative. |

### Population Health (`content/solutions/population-health.json`)

| Block | Headline | Recommended Image | Why (CRO) |
|---|---|---|---|
| `imageFeature` | "From individual screening to population insight" | `/images/features/health-data-platform-min.png` | Dashboard screenshot showing population-level data. Matches the "population insight" headline directly. |

---

## Priority 3 — Hero Background Images

The Hero component supports `backgroundImage`. Currently all heroes use gradient-only. Adding background images increases visual impact and trust.

| Page | Current Hero | Recommended Image | Why |
|---|---|---|---|
| Homepage | Gradient only | `/images/heroes/homepage-hero-image-trimmed-min-new-min-1.png` | Old site's main hero — product overlay with laptop and sensor. Immediately shows what the product is. |
| About | Gradient only | `/images/heroes/hero-image-gray-hair-min.jpg` | Old site used this as the About hero. Humanises the brand — a real person in the care context. |
| Home Care | Gradient only | `/images/heroes/parallax-image-1-min.jpg` | Warm care-setting lifestyle image. Old site used parallax images for segment pages. |
| Senior Living | Gradient only | `/images/heroes/parallax-image-2-min.jpg` | Second parallax image — different care setting for variety. |
| Clinicians | Gradient only | `/images/heroes/long-hair-back-hero-min.jpg` | Professional care context image. Old site used this for clinical/contact pages. |
| Meet the Team | Gradient only | `/images/features/holding-hands-solid-bg-min.jpg` | Emotional care image — "our team cares" subtext. Old site used this on About. |

---

## Priority 4 — Blog Featured Images

Most blog articles have no `featuredImage`. The old site had images on key articles.

| Article | Recommended `featuredImage` | Source |
|---|---|---|
| `able-assess-multifactorial-evidence-falls-risk-screening.json` | `/images/blog/able-assess-fall-risk-screening.jpg` | Old site used this image on the Able Assess article |
| `next-steps-for-older-adults-flagged-as-having-a-fall-risk.json` | `/images/blog/older-adults-fall-risk-next-steps.png` | Old site used this on the next-steps article |
| `pharma-and-cros.json` | `/images/blog/pharma-research.png` | Old site used this on the pharma article |
| `falls-risk-assessment.json` | `/images/blog/fall-risk-assessment-tool.jpg` | Old site used this on the falls risk assessment article |
| `hand-dynamometers.json` | `/images/product/hand-holding-gripable-w-bg-resized-min.jpg` | Product in-use shot matches hand dynamometer guide content |
| `grip-strength.json` | `/images/product/gripable-in-hand-trimmed-min.png` | Product shot — relevant to grip strength explainer |
| `what-is-grip-strength-testing.json` | `/images/product/gripable-sensor-arch-v2-min.jpg` | Device detail shot for testing explainer |
| `functional-assessments.json` | `/images/product/two-people-using-gripable-resized-min.jpg` | Clinical assessment context |

---

## Priority 5 — Partner Logo Carousel Placement

The `PartnerLogoCarousel` component has 14 logos hardcoded. Currently placed on Homepage. Old site showed logos on Homepage, About, and Solutions pages.

| Page | Add carousel? | Rationale |
|---|---|---|
| Homepage | Already present | Social proof above CTA — standard CRO |
| About | **Yes — add** | Old site had logos here. Reinforces credibility after the origin story. |
| Able Assess | **Yes — add** | Old site's main solutions page had logos. Trust signals near conversion point. |
| Home Care | **Yes — add** | Segment pages benefit from showing relevant partners |
| Senior Living | **Yes — add** | Same rationale |

---

## Priority 6 — Trust Badge Images

The `trustBar` block currently uses text-only items ("FDA Listed", "CE Marked", etc.). The old site displayed visual badge images alongside text. Consider upgrading the trustBar component to render badge images.

Available badges:
- `/images/badges/fda-trimmed.svg`
- `/images/badges/ce-4.svg`
- `/images/badges/hipaa-trimmed.svg`
- `/images/badges/iso-31.svg`
- `/images/badges/apta-dhpp-badge-darker-shadow-min.png`
- `/images/badges/gdpr-trimmed-min.png`

These would go on: Homepage, About, Able Assess, and all segment pages (wherever a `trustBar` block exists).

---

## Priority 7 — Meet the Team `imageFeature`

The meet-the-team.json has an imageFeature block ("Born at Imperial College London") with no image path set.

| Block | Recommended Image | Why |
|---|---|---|
| "Born at Imperial College London" | `/images/product/sensor-on-podium-min.jpg` | Professional product showcase shot. Old site used this on About page — connects the "Imperial College origin" narrative to the physical product. |

---

## Priority 8 — Contact & Demo Pages

| Page | Recommended Image | Placement | Why |
|---|---|---|---|
| Contact | `/images/product/gripable-sensor-cutout-min.png` | Alongside the contact form | Old site had sensor cutout on contact page. Keeps the product visible during conversion. |
| Demo | `/images/heroes/devices-hero-new-min.png` | Hero background | Shows what they're booking a demo of. Reduces form abandonment. |

---

## Images NOT Mapped (Low Priority / Reserve)

These images exist but aren't assigned to a specific slot. They can be used for future content or A/B testing.

| Image | Potential Use |
|---|---|
| `/images/product/67c85bbd...jpg` | Studio product shot — hero variant or press kit |
| `/images/product/spinning-sensor.png` | Animation frame — could build CSS animation |
| `/images/product/gripable-sensor-cutout-theme-min.png` | Duplicate of cutout — theme variant |
| `/images/product/lady-holding-gripable-sensor-min.jpg` | User-with-product — About page alternative |
| `/images/features/grip-strength-metrics-logos-min.png` | Metrics viz — could use on Research Library page |
| `/images/features/payers-icon-min.png` | Icon — payer section if built |
| `/images/editorial/social-media-post-v1–v6.jpg` | Social proof gallery — Resources page or footer |
| `/images/team/Woman-Gray-Hair-at-Table-with-Therapist...png` | Therapist interaction — About or testimonial sections |
| `/images/badges/app-store-badge.svg` | App download CTA — Able Assess or Able Strength page |
| `/images/badges/google-play-badge.svg` | App download CTA — same |
| `/images/badges/iso-iec-27001-mark-of-trust.png` | Compliance section or sidebar badge |
| `/images/badges/one-trust.jpeg` | Privacy section |

---

## OG Images (SEO)

9 pages reference OG images that don't exist. These are lower priority but matter for social sharing. They'd need to be generated (e.g. via a template with the page title on a branded background). Not blocking — social platforms fall back to page content.

---

## Execution Order

1. **Fix team photo refs** — 2 JSON edits, immediate fix
2. **Fill imageFeature blocks** — 10 JSON edits, biggest visual improvement
3. **Add hero backgrounds** — 6 JSON edits, second biggest visual impact
4. **Add blog featured images** — 8 JSON edits, improves blog listing appearance
5. **Add partner carousels** — 4 JSON edits, extends social proof
6. **Meet-the-team imageFeature** — 1 JSON edit
7. **Contact/Demo images** — 2 JSON edits
8. **Trust badge upgrade** — component change (later sprint)
9. **OG image generation** — design task (later sprint)
