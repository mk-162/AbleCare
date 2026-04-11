// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var heroBlock = {
  name: "hero",
  label: "Hero Section",
  ui: {
    itemProps: (item) => ({
      label: item?.headline ? `Hero: ${item.headline}` : "Hero (no headline)"
    }),
    defaultItem: {
      scheme: "blue",
      wave: "crest",
      eyebrow: "Functional assessment, reimagined",
      headline: "New hero headline",
      subtitle: "Supporting copy goes here.",
      primaryCtaText: "Book a demo",
      primaryCtaLink: "/demo/"
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "blue" } },
    { type: "string", name: "wave", label: "Wave Style", options: ["ribbon", "crest", "fold", "pulse", "arc", "none"], ui: { defaultValue: "crest" } },
    { type: "string", name: "waveFill", label: "Wave Fill (colour of section below)", options: ["light", "grey", "blue", "aqua"], description: "Set this to the colour scheme of the next section to avoid a white gap." },
    { type: "string", name: "eyebrow", label: "Eyebrow (small caps label above headline)" },
    { type: "string", name: "headline", label: "Headline" },
    { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
    { type: "string", name: "primaryCtaText", label: "Primary CTA Text" },
    { type: "string", name: "primaryCtaLink", label: "Primary CTA Link" },
    { type: "string", name: "secondaryCtaText", label: "Secondary CTA Text" },
    { type: "string", name: "secondaryCtaLink", label: "Secondary CTA Link" },
    { type: "image", name: "backgroundImage", label: "Hero Image (right side)" },
    { type: "string", name: "backgroundImageAlt", label: "Image Alt Text" },
    {
      type: "object",
      name: "breadcrumb",
      label: "Breadcrumb",
      list: true,
      fields: [
        { type: "string", name: "label", label: "Label", required: true },
        { type: "string", name: "href", label: "Link URL" }
      ]
    }
  ]
};
var trustBarBlock = {
  name: "trustBar",
  label: "Trust Bar",
  ui: {
    itemProps: (item) => {
      const first = item?.items?.[0]?.text;
      const count = item?.items?.length ?? 0;
      return { label: first ? `Trust Bar: ${first}${count > 1 ? ` (+${count - 1} more)` : ""}` : "Trust Bar" };
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    {
      type: "object",
      name: "items",
      label: "Items",
      list: true,
      ui: { itemProps: (item) => ({ label: item.text || "Item" }) },
      fields: [
        { type: "string", name: "text", label: "Text", required: true },
        { type: "image", name: "logo", label: "Logo (optional)" }
      ]
    }
  ]
};
var statsBarBlock = {
  name: "statsBar",
  label: "Stats Bar",
  ui: {
    itemProps: (item) => ({
      label: `Stats Bar (${item?.stats?.length ?? 0} stats)`
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "stats",
      label: "Stats",
      list: true,
      ui: { itemProps: (item) => ({ label: [item.value, item.label].filter(Boolean).join(" ") || "Stat" }) },
      fields: [
        { type: "string", name: "value", label: "Value (e.g. 1,000+)", required: true },
        { type: "string", name: "label", label: "Label", required: true },
        { type: "string", name: "sublabel", label: "Sub-label" }
      ]
    }
  ]
};
var segmentRouterBlock = {
  name: "segmentRouter",
  label: "Segment Router",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Segments: ${item.heading}` : "Segment Router"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "grey" } },
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "segments",
      label: "Segments",
      list: true,
      ui: { itemProps: (item) => ({ label: item.title || "Segment" }) },
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
        { type: "string", name: "ctaText", label: "CTA Text" },
        { type: "string", name: "link", label: "Link URL", required: true }
      ]
    }
  ]
};
var solutionCardsBlock = {
  name: "solutionCards",
  label: "Solution Cards",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Solutions: ${item.heading}` : `Solution Cards (${item?.cards?.length ?? 0} cards)`
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "string", name: "subheading", label: "Subheading" },
    {
      type: "object",
      name: "cards",
      label: "Cards",
      list: true,
      ui: { itemProps: (item) => ({ label: item.title || "Card" }) },
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
        { type: "string", name: "link", label: "Link URL" },
        { type: "string", name: "iconHint", label: "Icon Hint" },
        { type: "image", name: "image", label: "Card Image" }
      ]
    }
  ]
};
var processStepsBlock = {
  name: "processSteps",
  label: "Process Steps",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Process: ${item.heading}` : `Process Steps (${item?.steps?.length ?? 0} steps)`
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "steps",
      label: "Steps",
      list: true,
      ui: { itemProps: (item) => ({ label: item.title || "Step" }) },
      fields: [
        { type: "number", name: "number", label: "Step Number", required: true },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "description", label: "Description", ui: { component: "textarea" } }
      ]
    },
    { type: "string", name: "ctaText", label: "CTA Text" },
    { type: "string", name: "ctaLink", label: "CTA Link" }
  ]
};
var metricsBlockBlock = {
  name: "metricsBlock",
  label: "Metrics Block",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Metrics: ${item.heading}` : "Metrics Block"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "metrics",
      label: "Metrics",
      list: true,
      ui: { itemProps: (item) => ({ label: item.name || "Metric" }) },
      fields: [
        { type: "string", name: "name", label: "Metric Name", required: true },
        { type: "string", name: "whatItMeasures", label: "What It Measures", ui: { component: "textarea" } },
        { type: "string", name: "whyItMatters", label: "Why It Matters", ui: { component: "textarea" } }
      ]
    }
  ]
};
var featureComparisonBlock = {
  name: "featureComparison",
  label: "Feature Comparison",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Comparison: ${item.heading}` : "Feature Comparison"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "string", name: "tldr", label: "TL;DR Verdict", ui: { component: "textarea" }, description: "40-80 word direct verdict for GEO." },
    { type: "string", name: "col1Header", label: "Column 1 Header", ui: { defaultValue: "Able Assess" } },
    { type: "string", name: "col2Header", label: "Column 2 Header", ui: { defaultValue: "Alternative" } },
    {
      type: "object",
      name: "rows",
      label: "Rows",
      list: true,
      ui: { itemProps: (item) => ({ label: item.feature || "Feature" }) },
      fields: [
        { type: "string", name: "feature", label: "Feature", required: true },
        { type: "string", name: "col1", label: "Column 1 Value" },
        { type: "string", name: "col2", label: "Column 2 Value" }
      ]
    }
  ]
};
var evidenceBlockBlock = {
  name: "evidenceBlock",
  label: "Evidence Block",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Evidence: ${item.heading}` : "Evidence Block"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "string", name: "pulledStat", label: "Pulled Stat (headline number)", ui: { component: "textarea" } },
    { type: "string", name: "pulledStatSource", label: "Pulled Stat Source" },
    {
      type: "object",
      name: "citations",
      label: "Citations",
      list: true,
      ui: { itemProps: (item) => ({ label: item.title || "Citation" }) },
      fields: [
        { type: "string", name: "title", label: "Study Title", required: true },
        { type: "string", name: "authors", label: "Authors" },
        { type: "string", name: "journal", label: "Journal" },
        { type: "string", name: "year", label: "Year" },
        { type: "string", name: "finding", label: "Key Finding", ui: { component: "textarea" } },
        { type: "string", name: "link", label: "Link URL" }
      ]
    }
  ]
};
var testimonialCarouselBlock = {
  name: "testimonialCarousel",
  label: "Testimonial Carousel",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Testimonials: ${item.heading}` : `Testimonials (${item?.testimonials?.length ?? 0} quotes)`
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "aqua" } },
    { type: "string", name: "wave", label: "Wave Style", options: ["ribbon", "crest", "fold", "pulse", "arc", "none"], ui: { defaultValue: "fold" } },
    { type: "string", name: "waveFill", label: "Wave Fill (colour of section above)", options: ["light", "grey", "blue", "aqua"], description: "Set this to the colour scheme of the previous section to avoid a white gap." },
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "testimonials",
      label: "Testimonials",
      list: true,
      ui: { itemProps: (item) => ({ label: item.quote ? item.quote.slice(0, 40) + "..." : "Testimonial" }) },
      fields: [
        { type: "string", name: "quote", label: "Quote", required: true, ui: { component: "textarea" } },
        { type: "string", name: "name", label: "Author Name" },
        { type: "string", name: "role", label: "Author Role" },
        { type: "string", name: "organization", label: "Organisation" },
        { type: "image", name: "photo", label: "Author Photo" }
      ]
    }
  ]
};
var caseStudyCardsBlock = {
  name: "caseStudyCards",
  label: "Case Study Cards",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Case Studies: ${item.heading}` : "Case Study Cards"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "caseStudies",
      label: "Case Studies",
      list: true,
      ui: { itemProps: (item) => ({ label: item.title || "Case Study" }) },
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "metric", label: "Headline Metric (e.g. 32%)" },
        { type: "string", name: "metricLabel", label: "Metric Label (e.g. reduction in falls)" },
        { type: "string", name: "summary", label: "Summary", ui: { component: "textarea" } },
        { type: "string", name: "sector", label: "Sector Tag" },
        { type: "string", name: "link", label: "Link URL" },
        { type: "image", name: "thumbnail", label: "Thumbnail" }
      ]
    }
  ]
};
var faqAccordionBlock = {
  name: "faqAccordion",
  label: "FAQ Accordion",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `FAQs: ${item.heading}` : `FAQ Accordion (${item?.faqs?.length ?? 0} questions)`
    }),
    defaultItem: {
      heading: "Frequently asked questions",
      emitSchema: true,
      faqs: [{ question: "First question?", answer: "First answer." }]
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "boolean", name: "emitSchema", label: "Emit FAQPage Schema", description: "When true, outputs JSON-LD FAQPage structured data." },
    {
      type: "object",
      name: "faqs",
      label: "FAQ Items",
      list: true,
      ui: { itemProps: (item) => ({ label: item.question || "Q&A" }) },
      fields: [
        { type: "string", name: "question", label: "Question", required: true },
        { type: "string", name: "answer", label: "Answer", required: true, ui: { component: "textarea" } }
      ]
    }
  ]
};
var ctaBannerBlock = {
  name: "ctaBanner",
  label: "CTA Banner (full-width)",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `CTA Banner: ${item.heading}` : "CTA Banner"
    }),
    defaultItem: {
      scheme: "blue",
      wave: "ribbon",
      heading: "See Able Assess in your workflow.",
      bodyText: "A 20-minute demo with a clinician who has run it in the field.",
      primaryCtaText: "Book a demo",
      primaryCtaLink: "/demo/"
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "blue" } },
    { type: "string", name: "wave", label: "Wave Style", options: ["ribbon", "crest", "fold", "pulse", "arc", "none"], ui: { defaultValue: "ribbon" } },
    { type: "string", name: "waveFill", label: "Wave Fill (colour of section above)", options: ["light", "grey", "blue", "aqua"], description: "Set this to the colour scheme of the previous section to avoid a white gap." },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "string", name: "primaryCtaText", label: "Primary CTA Text" },
    { type: "string", name: "primaryCtaLink", label: "Primary CTA Link" },
    { type: "string", name: "secondaryCtaText", label: "Secondary CTA Text" },
    { type: "string", name: "secondaryCtaLink", label: "Secondary CTA Link" }
  ]
};
var ctaInlineBlock = {
  name: "ctaInline",
  label: "CTA Inline (compact)",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Inline CTA: ${item.heading}` : "Inline CTA"
    }),
    defaultItem: {
      heading: "Ready to see the numbers?",
      bodyText: "Download the HHVBP ROI model.",
      primaryCtaText: "Get the model",
      primaryCtaLink: "/resources/roi-calculator/"
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "string", name: "primaryCtaText", label: "Primary CTA Text" },
    { type: "string", name: "primaryCtaLink", label: "Primary CTA Link" },
    { type: "string", name: "secondaryCtaText", label: "Secondary CTA Text" },
    { type: "string", name: "secondaryCtaLink", label: "Secondary CTA Link" }
  ]
};
var imageFeatureBlock = {
  name: "imageFeature",
  label: "Image Feature",
  ui: {
    itemProps: (item) => ({
      label: item?.headline ? `Image Feature (${item.imagePosition ?? "right"}): ${item.headline}` : "Image Feature"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "imagePosition", label: "Image Position", options: ["left", "right"], ui: { defaultValue: "right" } },
    { type: "image", name: "image", label: "Image" },
    { type: "string", name: "imageAlt", label: "Image Alt Text" },
    { type: "string", name: "headline", label: "Heading" },
    { type: "string", name: "description", label: "Body Text", ui: { component: "textarea" } },
    {
      type: "object",
      name: "bulletPoints",
      label: "Bullet Points",
      list: true,
      fields: [
        { type: "string", name: "text", label: "Text", required: true }
      ]
    },
    { type: "string", name: "ctaText", label: "CTA Text" },
    { type: "string", name: "ctaLink", label: "CTA Link" }
  ]
};
var videoSectionBlock = {
  name: "videoSection",
  label: "Video Section",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Video: ${item.heading}` : "Video Section"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "videoUrl", label: "Video URL (YouTube or embed)" },
    { type: "string", name: "caption", label: "Caption" },
    { type: "image", name: "thumbnail", label: "Thumbnail" }
  ]
};
var teamGridBlock = {
  name: "teamGrid",
  label: "Team Grid",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Team: ${item.heading}` : "Team Grid"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "team",
      label: "Team Members",
      list: true,
      ui: { itemProps: (item) => ({ label: item.name || "Team Member" }) },
      fields: [
        { type: "string", name: "name", label: "Name", required: true },
        { type: "string", name: "role", label: "Role/Title", required: true },
        { type: "string", name: "credentials", label: "Credentials" },
        { type: "string", name: "bio", label: "Bio (1 sentence)" },
        { type: "image", name: "photo", label: "Photo" }
      ]
    }
  ]
};
var teamShowcaseBlock = {
  name: "teamShowcase",
  label: "Team Showcase",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Team: ${item.heading}` : "Team Showcase"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "string", name: "subtitle", label: "Subtitle" },
    {
      type: "string",
      name: "layout",
      label: "Layout",
      options: ["featured", "grid", "compact"]
    },
    {
      type: "object",
      name: "team",
      label: "Team Members",
      list: true,
      ui: { itemProps: (item) => ({ label: item.name || "Team Member" }) },
      fields: [
        { type: "string", name: "name", label: "Name", required: true },
        { type: "string", name: "role", label: "Role/Title", required: true },
        { type: "string", name: "credentials", label: "Credentials" },
        { type: "string", name: "bio", label: "Bio" },
        { type: "image", name: "photo", label: "Photo" },
        { type: "string", name: "linkedin", label: "LinkedIn URL" },
        {
          type: "string",
          name: "tier",
          label: "Tier",
          options: ["leadership", "team", "advisory"]
        }
      ]
    }
  ]
};
var trustCertBlock = {
  name: "trustCertBlock",
  label: "Trust & Certification Block",
  ui: {
    itemProps: () => ({ label: "Trust & Certification Badges" })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    {
      type: "object",
      name: "badges",
      label: "Badges",
      list: true,
      ui: { itemProps: (item) => ({ label: item.label || "Badge" }) },
      fields: [
        { type: "string", name: "label", label: "Label (e.g. FDA, CE, ISO 27001)", required: true },
        { type: "image", name: "icon", label: "Badge Icon" }
      ]
    }
  ]
};
var alertBannerBlock = {
  name: "alertBanner",
  label: "Alert Banner",
  ui: {
    itemProps: (item) => ({
      label: item?.text ? `Alert: ${item.text.slice(0, 40)}` : "Alert Banner"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string", name: "type", label: "Type", options: ["info", "warning", "success"], ui: { defaultValue: "info" } },
    { type: "string", name: "text", label: "Text", required: true },
    { type: "string", name: "ctaText", label: "CTA Text" },
    { type: "string", name: "ctaLink", label: "CTA Link" }
  ]
};
var richTextBlock = {
  name: "richText",
  label: "Rich Text",
  ui: {
    itemProps: (item) => {
      return { label: item?.heading ? `Rich Text: ${item.heading}` : item?.body ? `Rich Text: ${item.body.slice(0, 40)}` : "Rich Text" };
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Color Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Body (HTML)", ui: { component: "textarea" } }
  ]
};
var relatedKnowledgeBaseBlock = {
  name: "relatedKnowledgeBase",
  label: "Related Knowledge Base Articles",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Related KB: ${item.heading}` : "Related Knowledge Base Articles"
    }),
    defaultItem: {
      scheme: "grey",
      heading: "Related articles",
      limit: 4
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "grey" } },
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "number", name: "limit", label: "Max Articles", description: "Maximum number of articles to show (default 4)." },
    {
      type: "string",
      name: "filterTags",
      label: "Filter Tags (override)",
      list: true,
      description: "Manually specify tags to filter by. Leave empty to use the page's own tags."
    }
  ]
};
var relatedPagesBlock = {
  name: "relatedPages",
  label: "Related Pages",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Related Pages: ${item.heading}` : "Related Pages"
    }),
    defaultItem: {
      scheme: "light",
      heading: "Explore further",
      limit: 6
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "number", name: "limit", label: "Max Pages", description: "Maximum number of pages to show (default 6)." },
    {
      type: "string",
      name: "filterTags",
      label: "Filter Tags (override)",
      list: true,
      description: "Manually specify tags to filter by. Leave empty to use the page's own tags."
    }
  ]
};
var currentKnowledgeCardBlock = {
  name: "currentKnowledgeCard",
  label: "Current Knowledge Card",
  ui: {
    itemProps: (item) => ({
      label: item?.question ? `KB: ${item.question}` : "Current Knowledge Card"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string", name: "question", label: "Question (H1)", required: true },
    { type: "string", name: "directAnswer", label: "Direct Answer (40-60 words)", required: true, ui: { component: "textarea" } },
    {
      type: "object",
      name: "tldrBullets",
      label: "TL;DR Bullets",
      list: true,
      fields: [
        { type: "string", name: "text", label: "Bullet point", required: true }
      ]
    },
    { type: "string", name: "expandedAnswer", label: "Expanded Answer", ui: { component: "textarea" } },
    {
      type: "object",
      name: "sources",
      label: "Sources",
      list: true,
      fields: [
        { type: "string", name: "title", label: "Source Title", required: true },
        { type: "string", name: "url", label: "URL" },
        { type: "string", name: "year", label: "Year" }
      ]
    },
    { type: "string", name: "reviewedBy", label: "Reviewed By (named clinician)" },
    { type: "string", name: "lastReviewed", label: "Last Reviewed Date (YYYY-MM-DD)" }
  ]
};
var roiCalculatorPromoBlock = {
  name: "roiCalculatorPromo",
  label: "ROI Calculator Promo",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `ROI Promo: ${item.heading}` : "ROI Calculator Promo"
    }),
    defaultItem: {
      scheme: "aqua",
      heading: "How much could you save?",
      promoBody: "Model HHVBP upside in 60 seconds.",
      ctaText: "Open the ROI calculator",
      ctaLink: "/resources/roi-calculator/"
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "aqua" } },
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "promoBody", label: "Body", ui: { component: "textarea" } },
    { type: "string", name: "ctaText", label: "CTA Text" },
    { type: "string", name: "ctaLink", label: "CTA Link" }
  ]
};
var leadMagnetPromoBlock = {
  name: "leadMagnetPromo",
  label: "Lead Magnet Promo",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Lead Magnet: ${item.heading}` : "Lead Magnet Promo"
    }),
    defaultItem: {
      heading: "The Home Health Buyers Guide",
      promoBody: "Everything you need to brief procurement, in 24 pages.",
      ctaText: "Download free",
      ctaLink: "/resources/guides/"
    }
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "promoBody", label: "Body", ui: { component: "textarea" } },
    { type: "string", name: "ctaText", label: "CTA Text" },
    { type: "string", name: "ctaLink", label: "CTA Link" },
    { type: "image", name: "coverImage", label: "Cover Image" }
  ]
};
var partnerLogoCarouselBlock = {
  name: "partnerLogoCarousel",
  label: "Partner Logo Carousel",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Logos: ${item.heading}` : "Partner Logo Carousel"
    })
  },
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "subheading", label: "Subheading" },
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"], ui: { defaultValue: "light" } },
    {
      type: "object",
      name: "logos",
      label: "Logos",
      list: true,
      ui: { itemProps: (item) => ({ label: item.alt || "Logo" }) },
      fields: [
        { type: "image", name: "src", label: "Logo Image", required: true },
        { type: "string", name: "alt", label: "Alt Text", required: true }
      ]
    }
  ]
};
var contactFormBlock = {
  name: "contactForm",
  label: "Contact Form",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Contact: ${item.heading}` : "Contact Form"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
    { type: "string", name: "salesEmail", label: "Sales Email" },
    { type: "string", name: "supportEmail", label: "Support Email" }
  ]
};
var segmentCardsBlock = {
  name: "segmentCards",
  label: "Segment Cards",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Segments: ${item.heading}` : "Segment Cards"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "cards",
      label: "Cards",
      list: true,
      ui: { itemProps: (item) => ({ label: item.title || "Card" }) },
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
        { type: "string", name: "icon", label: "Icon Hint" },
        { type: "string", name: "link", label: "Link URL" }
      ]
    }
  ]
};
var valuePropsBlock = {
  name: "valueProps",
  label: "Value Props",
  ui: {
    itemProps: (item) => ({
      label: item?.heading ? `Value Props: ${item.heading}` : "Value Props"
    })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "items",
      label: "Items",
      list: true,
      ui: { itemProps: (item) => ({ label: item.title || "Item" }) },
      fields: [
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "body", label: "Body", ui: { component: "textarea" } }
      ]
    }
  ]
};
var breadcrumbBlock = {
  name: "breadcrumb",
  label: "Breadcrumb",
  ui: {
    itemProps: () => ({ label: "Breadcrumb" })
  },
  fields: [
    { type: "string", name: "scheme", label: "Colour Scheme", options: ["light", "grey", "blue", "aqua"] },
    {
      type: "object",
      name: "items",
      label: "Breadcrumb Items",
      list: true,
      fields: [
        { type: "string", name: "label", label: "Label", required: true },
        { type: "string", name: "href", label: "Link URL" }
      ]
    }
  ]
};
var seoFields = [
  { type: "string", name: "title", label: "Page Title", isTitle: true, required: true, description: "Browser tab + Google title. Aim for ~60 chars." },
  { type: "string", name: "description", label: "Meta Description", ui: { component: "textarea" }, description: "Google snippet. 140-160 chars." },
  { type: "string", name: "url", label: "Canonical URL (display only)" },
  { type: "string", name: "keywords", label: "SEO Keywords", list: true },
  { type: "string", name: "primaryKeyword", label: "Primary Keyword" },
  { type: "string", name: "h1", label: "H1 Override", description: "Override the hero headline as H1 if needed." },
  {
    type: "string",
    name: "tags",
    label: "Content Tags",
    list: true,
    description: "Tags for cross-referencing content across the site. Use slugs from the tag taxonomy: topic (falls-prevention, grip-strength, etc.), segment (home-care, senior-living, etc.), solution (able-assess, etc.), type (guide, evidence, etc.)."
  }
];
var allBlocks = [
  heroBlock,
  trustBarBlock,
  statsBarBlock,
  segmentRouterBlock,
  solutionCardsBlock,
  processStepsBlock,
  metricsBlockBlock,
  featureComparisonBlock,
  evidenceBlockBlock,
  testimonialCarouselBlock,
  caseStudyCardsBlock,
  faqAccordionBlock,
  ctaBannerBlock,
  ctaInlineBlock,
  imageFeatureBlock,
  videoSectionBlock,
  teamGridBlock,
  teamShowcaseBlock,
  trustCertBlock,
  alertBannerBlock,
  richTextBlock,
  currentKnowledgeCardBlock,
  relatedKnowledgeBaseBlock,
  relatedPagesBlock,
  roiCalculatorPromoBlock,
  leadMagnetPromoBlock,
  breadcrumbBlock,
  partnerLogoCarouselBlock,
  contactFormBlock,
  segmentCardsBlock,
  valuePropsBlock
];
var blockPageFields = [
  {
    type: "object",
    name: "blocks",
    label: "Page Blocks",
    list: true,
    templates: allBlocks
  },
  ...seoFields
];
var articleFields = [
  { type: "string", name: "title", label: "Title", isTitle: true, required: true },
  { type: "string", name: "excerpt", label: "Excerpt", ui: { component: "textarea" } },
  { type: "string", name: "content", label: "Body Content (HTML)", ui: { component: "textarea" } },
  { type: "string", name: "category", label: "Category" },
  { type: "string", name: "tags", label: "Tags", list: true },
  { type: "string", name: "author", label: "Author Name" },
  { type: "string", name: "authorRole", label: "Author Role" },
  { type: "string", name: "reviewer", label: "Clinical Reviewer" },
  { type: "string", name: "publishedDate", label: "Published Date (YYYY-MM-DD)" },
  { type: "number", name: "readTime", label: "Read Time (minutes)" },
  { type: "image", name: "image", label: "Featured Image" },
  { type: "boolean", name: "featured", label: "Featured" },
  { type: "string", name: "description", label: "Meta Description" },
  { type: "string", name: "primaryKeyword", label: "Primary Keyword" },
  { type: "string", name: "keywords", label: "SEO Keywords", list: true },
  {
    type: "object",
    name: "blocks",
    label: "Page Blocks (optional, for rich article layouts)",
    list: true,
    templates: allBlocks
  }
];
var markdownPageFields = [
  { type: "string", name: "title", label: "Title", isTitle: true, required: true },
  { type: "string", name: "description", label: "Meta Description" },
  { type: "rich-text", name: "body", label: "Body", isBody: true },
  { type: "string", name: "keywords", label: "SEO Keywords", list: true }
];
var tinaApiUrl = process.env.NEXT_PUBLIC_TINA_API_URL || void 0;
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  contentApiUrlOverride: tinaApiUrl,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      // ── Main Pages (homepage, contact, demo, faqs, etc.) ────────────────
      {
        name: "pages",
        label: "Pages",
        path: "content/pages",
        format: "json",
        ui: {
          router: ({ document }) => document._sys.filename === "homepage" ? "/" : `/${document._sys.filename}/`
        },
        fields: blockPageFields
      },
      // ── Solutions ───────────────────────────────────────────────────────
      {
        name: "solutions",
        label: "Solutions",
        path: "content/solutions",
        format: "json",
        ui: {
          router: ({ document }) => `/solutions/${document._sys.filename}/`
        },
        fields: blockPageFields
      },
      // ── Segments (Home Care, Senior Living, Skilled Nursing, Clinicians) ─
      {
        name: "segments",
        label: "Segment Landing Pages",
        path: "content/segments",
        format: "json",
        ui: {
          router: ({ document }) => `/${document._sys.filename}/`
        },
        fields: blockPageFields
      },
      // ── Compare ─────────────────────────────────────────────────────────
      {
        name: "compare",
        label: "Compare Pages",
        path: "content/compare",
        format: "json",
        ui: {
          router: ({ document }) => `/compare/${document._sys.filename}/`
        },
        fields: blockPageFields
      },
      // ── Learn (Blog / Pillars / Articles) ───────────────────────────────
      {
        name: "learn",
        label: "Learn (Blog & Articles)",
        path: "content/learn",
        format: "json",
        ui: {
          router: ({ document }) => `/blog/${document._sys.filename}/`
        },
        fields: articleFields
      },
      // ── Resources ───────────────────────────────────────────────────────
      {
        name: "resources",
        label: "Resources",
        path: "content/resources",
        format: "json",
        ui: {
          router: ({ document }) => document._sys.filename === "overview" ? "/resources/" : `/resources/${document._sys.filename}/`
        },
        fields: blockPageFields
      },
      // ── Company ─────────────────────────────────────────────────────────
      {
        name: "company",
        label: "Company Pages",
        path: "content/company",
        format: "json",
        ui: {
          router: ({ document }) => {
            const map = {
              about: "/about/",
              "meet-the-team": "/meet-the-team/",
              customers: "/customers/",
              partners: "/partners/",
              news: "/news/",
              contact: "/contact/",
              demo: "/demo/"
            };
            return map[document._sys.filename] || `/${document._sys.filename}/`;
          }
        },
        fields: blockPageFields
      },
      // ── Knowledge Base ────────────────────────────────────────────────
      {
        name: "knowledgeBase",
        label: "Knowledge Base",
        path: "content/knowledge-base",
        format: "json",
        ui: {
          router: ({ document }) => `/knowledge-base/${document._sys.filename}/`
        },
        fields: [
          { type: "string", name: "title", label: "Title (H1)", isTitle: true, required: true },
          { type: "string", name: "description", label: "Meta Description", ui: { component: "textarea" } },
          { type: "string", name: "category", label: "Category", options: ["Falls Prevention", "Grip Strength", "Assessments", "Care Settings", "Regulations", "Technology"], required: true },
          { type: "string", name: "pillar", label: "Pillar Hub Slug", description: "Parent hub article slug (e.g. falls-risk-assessment)" },
          { type: "string", name: "primaryKeyword", label: "Primary Keyword" },
          { type: "string", name: "keywords", label: "SEO Keywords", list: true },
          {
            type: "string",
            name: "tags",
            label: "Content Tags",
            list: true,
            description: "Tags for cross-referencing: topic, segment, solution, type slugs."
          },
          { type: "string", name: "author", label: "Author Name" },
          { type: "string", name: "authorRole", label: "Author Role" },
          { type: "string", name: "reviewer", label: "Clinical Reviewer" },
          { type: "string", name: "reviewerRole", label: "Reviewer Role" },
          { type: "string", name: "publishedDate", label: "Published Date (YYYY-MM-DD)" },
          { type: "string", name: "lastReviewed", label: "Last Reviewed Date (YYYY-MM-DD)" },
          { type: "number", name: "readTime", label: "Read Time (minutes)" },
          { type: "image", name: "image", label: "Featured Image" },
          { type: "string", name: "imageAlt", label: "Featured Image Alt Text" },
          {
            type: "string",
            name: "schemaTypes",
            label: "Schema Types",
            list: true,
            options: ["Article", "MedicalWebPage", "FAQPage", "HowTo"],
            description: "JSON-LD schema types to emit."
          },
          {
            type: "object",
            name: "blocks",
            label: "Article Blocks",
            list: true,
            templates: allBlocks
          }
        ]
      },
      // ── Utility (privacy, terms, cookies, thank-you) ────────────────────
      {
        name: "utility",
        label: "Utility Pages",
        path: "content/utility",
        format: "md",
        ui: {
          router: ({ document }) => `/${document._sys.filename}/`
        },
        fields: markdownPageFields
      },
      // ── Global Settings ─────────────────────────────────────────────────
      {
        name: "global",
        label: "Global Settings",
        path: "content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: { create: false, delete: false }
        },
        match: { include: "global" },
        fields: [
          {
            type: "object",
            name: "site",
            label: "Site Information",
            fields: [
              { type: "string", name: "name", label: "Site Name" },
              { type: "string", name: "tagline", label: "Tagline" },
              { type: "image", name: "logo", label: "Header Logo" },
              { type: "string", name: "phone", label: "Phone Number" },
              { type: "string", name: "email", label: "Email Address" },
              { type: "string", name: "canonicalDomain", label: "Canonical Domain" }
            ]
          },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            fields: [
              { type: "string", name: "linkedin", label: "LinkedIn URL" },
              { type: "string", name: "twitter", label: "Twitter/X URL" },
              { type: "string", name: "instagram", label: "Instagram URL" }
            ]
          }
        ]
      },
      // ── Navigation ──────────────────────────────────────────────────────
      {
        name: "navigation",
        label: "Navigation Menu",
        path: "content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: { create: false, delete: false }
        },
        match: { include: "navigation" },
        fields: [
          {
            type: "object",
            name: "mainNav",
            label: "Main Navigation",
            list: true,
            ui: { itemProps: (item) => ({ label: item.label || "Item" }) },
            fields: [
              { type: "string", name: "label", label: "Label", required: true },
              { type: "string", name: "url", label: "URL", required: true },
              {
                type: "object",
                name: "columns",
                label: "Mega-menu Columns",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Column Title" },
                  {
                    type: "object",
                    name: "links",
                    label: "Links",
                    list: true,
                    fields: [
                      { type: "string", name: "label", label: "Label", required: true },
                      { type: "string", name: "url", label: "URL", required: true },
                      { type: "string", name: "description", label: "Description" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "footerNav",
            label: "Footer Navigation",
            list: true,
            ui: { itemProps: (item) => ({ label: item.title || "Column" }) },
            fields: [
              { type: "string", name: "title", label: "Column Title", required: true },
              {
                type: "object",
                name: "links",
                label: "Links",
                list: true,
                fields: [
                  { type: "string", name: "label", label: "Label", required: true },
                  { type: "string", name: "url", label: "URL", required: true }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
