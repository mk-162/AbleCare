/**
 * Contextual product promo rules.
 * First matching rule wins — order matters.
 */

export interface PromoRule {
  matchTags: string[];
  badge: string;
  heading: string;
  body: string;
  ctaText: string;
  ctaLink: string;
  variant: "whitepaper" | "tool" | "landing";
}

const PROMO_RULES: PromoRule[] = [
  {
    matchTags: ["home-care"],
    badge: "Home Care",
    heading: "Falls screening built for home care",
    body: "Standardize screening across every branch. Protect HHVBP scores and reduce hospitalizations with Able Assess.",
    ctaText: "Learn more",
    ctaLink: "/home-care",
    variant: "landing",
  },
  {
    matchTags: ["senior-living"],
    badge: "Senior Living",
    heading: "Reduce falls across your community",
    body: "Screen every resident in under five minutes. Protect occupancy, reduce liability, and demonstrate quality of care.",
    ctaText: "Learn more",
    ctaLink: "/senior-living",
    variant: "landing",
  },
  {
    matchTags: ["skilled-nursing"],
    badge: "Skilled Nursing",
    heading: "Five-star quality starts with screening",
    body: "Objective, repeatable falls risk data that flows straight into your quality program.",
    ctaText: "Learn more",
    ctaLink: "/skilled-nursing",
    variant: "landing",
  },
  {
    matchTags: ["pharma"],
    badge: "Clinical Trials",
    heading: "Grip strength as a trial endpoint",
    body: "FDA-listed digital dynamometry for decentralised and site-based clinical trials.",
    ctaText: "Learn more",
    ctaLink: "/pharma",
    variant: "tool",
  },
  {
    matchTags: ["grip-strength", "hand-dynamometers"],
    badge: "Grip Strength",
    heading: "Smart grip strength assessment",
    body: "Clinical-grade digital dynamometry that replaces the Jamar. Connected, calibrated, and ready for any setting.",
    ctaText: "Explore",
    ctaLink: "/solutions/grip-strength",
    variant: "tool",
  },
  {
    matchTags: ["hhvbp", "roi"],
    badge: "Business Case",
    heading: "The ROI of digital screening",
    body: "See how falls prevention technology pays for itself through reduced hospitalizations and improved star ratings.",
    ctaText: "Read the guide",
    ctaLink: "/resources/roi-calculator",
    variant: "whitepaper",
  },
  {
    matchTags: ["steadi", "nice-guidelines", "safe-act", "oasis", "five-star"],
    badge: "Compliance",
    heading: "Stay ahead of regulations",
    body: "Able Assess aligns with STEADI, NICE, SAFE Act, and CMS quality frameworks out of the box.",
    ctaText: "Learn more",
    ctaLink: "/solutions/able-assess",
    variant: "whitepaper",
  },
];

const FALLBACK_PROMO: PromoRule = {
  matchTags: [],
  badge: "Featured",
  heading: "See Able Assess in action",
  body: "Book a walkthrough with a clinician who has run it in the field. No slides, no fluff.",
  ctaText: "Book a demo",
  ctaLink: "/demo",
  variant: "landing",
};

/** Returns the first matching promo rule for the given tags, or the fallback. */
export function getPromoForTags(tags: string[]): PromoRule {
  if (!tags || tags.length === 0) return FALLBACK_PROMO;

  for (const rule of PROMO_RULES) {
    if (rule.matchTags.some((mt) => tags.includes(mt))) {
      return rule;
    }
  }

  return FALLBACK_PROMO;
}
