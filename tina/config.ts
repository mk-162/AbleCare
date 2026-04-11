import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

// ─── Block Templates ──────────────────────────────────────────────────────────

const heroBlock = {
  name: "hero",
  label: "Hero Section",
  ui: {
    itemProps: (item: { headline?: string }) => ({
      label: item?.headline ? `Hero: ${item.headline}` : "Hero (no headline)",
    }),
    defaultItem: {
      scheme: "blue",
      wave: "crest",
      eyebrow: "Functional assessment, reimagined",
      headline: "New hero headline",
      subtitle: "Supporting copy goes here.",
      primaryCtaText: "Book a demo",
      primaryCtaLink: "/demo/",
    },
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "blue" } },
    { type: "string" as const, name: "wave", label: "Wave Style", options: ["ribbon", "crest", "fold", "pulse", "arc", "none"], ui: { defaultValue: "crest" } },
    { type: "string" as const, name: "waveFill", label: "Wave Fill (colour of section below)", options: ["light", "grey", "blue", "aqua"], description: "Set this to the colour scheme of the next section to avoid a white gap." },
    { type: "string" as const, name: "eyebrow", label: "Eyebrow (small caps label above headline)" },
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "string" as const, name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
    { type: "string" as const, name: "primaryCtaText", label: "Primary CTA Text" },
    { type: "string" as const, name: "primaryCtaLink", label: "Primary CTA Link" },
    { type: "string" as const, name: "secondaryCtaText", label: "Secondary CTA Text" },
    { type: "string" as const, name: "secondaryCtaLink", label: "Secondary CTA Link" },
    { type: "image" as const, name: "backgroundImage", label: "Hero Image (right side)" },
    { type: "string" as const, name: "backgroundImageAlt", label: "Image Alt Text" },
    {
      type: "object" as const,
      name: "breadcrumb",
      label: "Breadcrumb",
      list: true,
      fields: [
        { type: "string" as const, name: "label", label: "Label", required: true },
        { type: "string" as const, name: "href", label: "Link URL" },
      ],
    },
  ],
};

const trustBarBlock = {
  name: "trustBar",
  label: "Trust Bar",
  ui: {
    itemProps: (item: { items?: { text?: string }[] }) => {
      const first = item?.items?.[0]?.text;
      const count = item?.items?.length ?? 0;
      return { label: first ? `Trust Bar: ${first}${count > 1 ? ` (+${count - 1} more)` : ""}` : "Trust Bar" };
    },
  },
  fields: [
    {
      type: "object" as const,
      name: "items",
      label: "Items",
      list: true,
      ui: { itemProps: (item: { text?: string }) => ({ label: item.text || "Item" }) },
      fields: [
        { type: "string" as const, name: "text", label: "Text", required: true },
        { type: "image" as const, name: "logo", label: "Logo (optional)" },
      ],
    },
  ],
};

const statsBarBlock = {
  name: "statsBar",
  label: "Stats Bar",
  ui: {
    itemProps: (item: { stats?: unknown[] }) => ({
      label: `Stats Bar (${item?.stats?.length ?? 0} stats)`,
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "stats",
      label: "Stats",
      list: true,
      ui: { itemProps: (item: { value?: string; label?: string }) => ({ label: [item.value, item.label].filter(Boolean).join(" ") || "Stat" }) },
      fields: [
        { type: "string" as const, name: "value", label: "Value (e.g. 1,000+)", required: true },
        { type: "string" as const, name: "label", label: "Label", required: true },
        { type: "string" as const, name: "sublabel", label: "Sub-label" },
      ],
    },
  ],
};

const segmentRouterBlock = {
  name: "segmentRouter",
  label: "Segment Router",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Segments: ${item.heading}` : "Segment Router",
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "grey" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "segments",
      label: "Segments",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Segment" }) },
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description", ui: { component: "textarea" } },
        { type: "string" as const, name: "ctaText", label: "CTA Text" },
        { type: "string" as const, name: "link", label: "Link URL", required: true },
      ],
    },
  ],
};

const solutionCardsBlock = {
  name: "solutionCards",
  label: "Solution Cards",
  ui: {
    itemProps: (item: { heading?: string; cards?: unknown[] }) => ({
      label: item?.heading ? `Solutions: ${item.heading}` : `Solution Cards (${item?.cards?.length ?? 0} cards)`,
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    { type: "string" as const, name: "subheading", label: "Subheading" },
    {
      type: "object" as const,
      name: "cards",
      label: "Cards",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Card" }) },
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description", ui: { component: "textarea" } },
        { type: "string" as const, name: "link", label: "Link URL" },
        { type: "string" as const, name: "iconHint", label: "Icon Hint" },
        { type: "image" as const, name: "image", label: "Card Image" },
      ],
    },
  ],
};

const processStepsBlock = {
  name: "processSteps",
  label: "Process Steps",
  ui: {
    itemProps: (item: { heading?: string; steps?: unknown[] }) => ({
      label: item?.heading ? `Process: ${item.heading}` : `Process Steps (${item?.steps?.length ?? 0} steps)`,
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "steps",
      label: "Steps",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Step" }) },
      fields: [
        { type: "number" as const, name: "number", label: "Step Number", required: true },
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description", ui: { component: "textarea" } },
      ],
    },
    { type: "string" as const, name: "ctaText", label: "CTA Text" },
    { type: "string" as const, name: "ctaLink", label: "CTA Link" },
  ],
};

const metricsBlockBlock = {
  name: "metricsBlock",
  label: "Metrics Block",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Metrics: ${item.heading}` : "Metrics Block",
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "metrics",
      label: "Metrics",
      list: true,
      ui: { itemProps: (item: { name?: string }) => ({ label: item.name || "Metric" }) },
      fields: [
        { type: "string" as const, name: "name", label: "Metric Name", required: true },
        { type: "string" as const, name: "whatItMeasures", label: "What It Measures", ui: { component: "textarea" } },
        { type: "string" as const, name: "whyItMatters", label: "Why It Matters", ui: { component: "textarea" } },
      ],
    },
  ],
};

const featureComparisonBlock = {
  name: "featureComparison",
  label: "Feature Comparison",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Comparison: ${item.heading}` : "Feature Comparison",
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    { type: "string" as const, name: "tldr", label: "TL;DR Verdict", ui: { component: "textarea" }, description: "40-80 word direct verdict for GEO." },
    { type: "string" as const, name: "col1Header", label: "Column 1 Header", ui: { defaultValue: "Able Assess" } },
    { type: "string" as const, name: "col2Header", label: "Column 2 Header", ui: { defaultValue: "Alternative" } },
    {
      type: "object" as const,
      name: "rows",
      label: "Rows",
      list: true,
      ui: { itemProps: (item: { feature?: string }) => ({ label: item.feature || "Feature" }) },
      fields: [
        { type: "string" as const, name: "feature", label: "Feature", required: true },
        { type: "string" as const, name: "col1", label: "Column 1 Value" },
        { type: "string" as const, name: "col2", label: "Column 2 Value" },
      ],
    },
  ],
};

const evidenceBlockBlock = {
  name: "evidenceBlock",
  label: "Evidence Block",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Evidence: ${item.heading}` : "Evidence Block",
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    { type: "string" as const, name: "pulledStat", label: "Pulled Stat (headline number)", ui: { component: "textarea" } },
    { type: "string" as const, name: "pulledStatSource", label: "Pulled Stat Source" },
    {
      type: "object" as const,
      name: "citations",
      label: "Citations",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Citation" }) },
      fields: [
        { type: "string" as const, name: "title", label: "Study Title", required: true },
        { type: "string" as const, name: "authors", label: "Authors" },
        { type: "string" as const, name: "journal", label: "Journal" },
        { type: "string" as const, name: "year", label: "Year" },
        { type: "string" as const, name: "finding", label: "Key Finding", ui: { component: "textarea" } },
        { type: "string" as const, name: "link", label: "Link URL" },
      ],
    },
  ],
};

const testimonialCarouselBlock = {
  name: "testimonialCarousel",
  label: "Testimonial Carousel",
  ui: {
    itemProps: (item: { heading?: string; testimonials?: unknown[] }) => ({
      label: item?.heading ? `Testimonials: ${item.heading}` : `Testimonials (${item?.testimonials?.length ?? 0} quotes)`,
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "aqua" } },
    { type: "string" as const, name: "wave", label: "Wave Style", options: ["ribbon", "crest", "fold", "pulse", "arc", "none"], ui: { defaultValue: "fold" } },
    { type: "string" as const, name: "waveFill", label: "Wave Fill (colour of section above)", options: ["light", "grey", "blue", "aqua"], description: "Set this to the colour scheme of the previous section to avoid a white gap." },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "testimonials",
      label: "Testimonials",
      list: true,
      ui: { itemProps: (item: { quote?: string }) => ({ label: item.quote ? item.quote.slice(0, 40) + "..." : "Testimonial" }) },
      fields: [
        { type: "string" as const, name: "quote", label: "Quote", required: true, ui: { component: "textarea" } },
        { type: "string" as const, name: "name", label: "Author Name" },
        { type: "string" as const, name: "role", label: "Author Role" },
        { type: "string" as const, name: "organization", label: "Organisation" },
        { type: "image" as const, name: "photo", label: "Author Photo" },
      ],
    },
  ],
};

const caseStudyCardsBlock = {
  name: "caseStudyCards",
  label: "Case Study Cards",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Case Studies: ${item.heading}` : "Case Study Cards",
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "caseStudies",
      label: "Case Studies",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Case Study" }) },
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "metric", label: "Headline Metric (e.g. 32%)" },
        { type: "string" as const, name: "metricLabel", label: "Metric Label (e.g. reduction in falls)" },
        { type: "string" as const, name: "summary", label: "Summary", ui: { component: "textarea" } },
        { type: "string" as const, name: "sector", label: "Sector Tag" },
        { type: "string" as const, name: "link", label: "Link URL" },
        { type: "image" as const, name: "thumbnail", label: "Thumbnail" },
      ],
    },
  ],
};

const faqAccordionBlock = {
  name: "faqAccordion",
  label: "FAQ Accordion",
  ui: {
    itemProps: (item: { heading?: string; faqs?: unknown[] }) => ({
      label: item?.heading ? `FAQs: ${item.heading}` : `FAQ Accordion (${item?.faqs?.length ?? 0} questions)`,
    }),
    defaultItem: {
      heading: "Frequently asked questions",
      emitSchema: true,
      faqs: [{ question: "First question?", answer: "First answer." }],
    },
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    { type: "boolean" as const, name: "emitSchema", label: "Emit FAQPage Schema", description: "When true, outputs JSON-LD FAQPage structured data." },
    {
      type: "object" as const,
      name: "faqs",
      label: "FAQ Items",
      list: true,
      ui: { itemProps: (item: { question?: string }) => ({ label: item.question || "Q&A" }) },
      fields: [
        { type: "string" as const, name: "question", label: "Question", required: true },
        { type: "string" as const, name: "answer", label: "Answer", required: true, ui: { component: "textarea" } },
      ],
    },
  ],
};

const ctaBannerBlock = {
  name: "ctaBanner",
  label: "CTA Banner (full-width)",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `CTA Banner: ${item.heading}` : "CTA Banner",
    }),
    defaultItem: {
      scheme: "blue",
      wave: "ribbon",
      heading: "See Able Assess in your workflow.",
      bodyText: "A 20-minute demo with a clinician who has run it in the field.",
      primaryCtaText: "Book a demo",
      primaryCtaLink: "/demo/",
    },
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "blue" } },
    { type: "string" as const, name: "wave", label: "Wave Style", options: ["ribbon", "crest", "fold", "pulse", "arc", "none"], ui: { defaultValue: "ribbon" } },
    { type: "string" as const, name: "waveFill", label: "Wave Fill (colour of section above)", options: ["light", "grey", "blue", "aqua"], description: "Set this to the colour scheme of the previous section to avoid a white gap." },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "string" as const, name: "primaryCtaText", label: "Primary CTA Text" },
    { type: "string" as const, name: "primaryCtaLink", label: "Primary CTA Link" },
    { type: "string" as const, name: "secondaryCtaText", label: "Secondary CTA Text" },
    { type: "string" as const, name: "secondaryCtaLink", label: "Secondary CTA Link" },
  ],
};

const ctaInlineBlock = {
  name: "ctaInline",
  label: "CTA Inline (compact)",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Inline CTA: ${item.heading}` : "Inline CTA",
    }),
    defaultItem: {
      heading: "Ready to see the numbers?",
      bodyText: "Download the HHVBP ROI model.",
      primaryCtaText: "Get the model",
      primaryCtaLink: "/resources/roi-calculator/",
    },
  },
  fields: [
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "string" as const, name: "primaryCtaText", label: "Primary CTA Text" },
    { type: "string" as const, name: "primaryCtaLink", label: "Primary CTA Link" },
    { type: "string" as const, name: "secondaryCtaText", label: "Secondary CTA Text" },
    { type: "string" as const, name: "secondaryCtaLink", label: "Secondary CTA Link" },
  ],
};

const imageFeatureBlock: any = {
  name: "imageFeature",
  label: "Image Feature",
  ui: {
    itemProps: (item: { headline?: string; imagePosition?: string }) => ({
      label: item?.headline ? `Image Feature (${item.imagePosition ?? "right"}): ${item.headline}` : "Image Feature",
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "imagePosition", label: "Image Position", options: ["left", "right"], ui: { defaultValue: "right" } },
    { type: "image" as const, name: "image", label: "Image" },
    { type: "string" as const, name: "imageAlt", label: "Image Alt Text" },
    { type: "string" as const, name: "headline", label: "Heading" },
    { type: "string" as const, name: "description", label: "Body Text", ui: { component: "textarea" } },
    {
      type: "object" as const,
      name: "bulletPoints",
      label: "Bullet Points",
      list: true,
      fields: [
        { type: "string" as const, name: "text", label: "Text", required: true },
      ],
    },
    { type: "string" as const, name: "ctaText", label: "CTA Text" },
    { type: "string" as const, name: "ctaLink", label: "CTA Link" },
  ],
};

const videoSectionBlock = {
  name: "videoSection",
  label: "Video Section",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Video: ${item.heading}` : "Video Section",
    }),
  },
  fields: [
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "videoUrl", label: "Video URL (YouTube or embed)" },
    { type: "string" as const, name: "caption", label: "Caption" },
    { type: "image" as const, name: "thumbnail", label: "Thumbnail" },
  ],
};

const teamGridBlock = {
  name: "teamGrid",
  label: "Team Grid",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Team: ${item.heading}` : "Team Grid",
    }),
  },
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "team",
      label: "Team Members",
      list: true,
      ui: { itemProps: (item: { name?: string }) => ({ label: item.name || "Team Member" }) },
      fields: [
        { type: "string" as const, name: "name", label: "Name", required: true },
        { type: "string" as const, name: "role", label: "Role/Title", required: true },
        { type: "string" as const, name: "credentials", label: "Credentials" },
        { type: "string" as const, name: "bio", label: "Bio (1 sentence)" },
        { type: "image" as const, name: "photo", label: "Photo" },
      ],
    },
  ],
};

const teamShowcaseBlock = {
  name: "teamShowcase",
  label: "Team Showcase",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Team: ${item.heading}` : "Team Showcase",
    }),
  },
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    { type: "string" as const, name: "subtitle", label: "Subtitle" },
    {
      type: "string" as const,
      name: "layout",
      label: "Layout",
      options: ["featured", "grid", "compact"],
    },
    {
      type: "object" as const,
      name: "team",
      label: "Team Members",
      list: true,
      ui: { itemProps: (item: { name?: string }) => ({ label: item.name || "Team Member" }) },
      fields: [
        { type: "string" as const, name: "name", label: "Name", required: true },
        { type: "string" as const, name: "role", label: "Role/Title", required: true },
        { type: "string" as const, name: "credentials", label: "Credentials" },
        { type: "string" as const, name: "bio", label: "Bio" },
        { type: "image" as const, name: "photo", label: "Photo" },
        { type: "string" as const, name: "linkedin", label: "LinkedIn URL" },
        {
          type: "string" as const,
          name: "tier",
          label: "Tier",
          options: ["leadership", "team", "advisory"],
        },
      ],
    },
  ],
};

const trustCertBlock = {
  name: "trustCertBlock",
  label: "Trust & Certification Block",
  ui: {
    itemProps: () => ({ label: "Trust & Certification Badges" }),
  },
  fields: [
    {
      type: "object" as const,
      name: "badges",
      label: "Badges",
      list: true,
      ui: { itemProps: (item: { label?: string }) => ({ label: item.label || "Badge" }) },
      fields: [
        { type: "string" as const, name: "label", label: "Label (e.g. FDA, CE, ISO 27001)", required: true },
        { type: "image" as const, name: "icon", label: "Badge Icon" },
      ],
    },
  ],
};

const alertBannerBlock = {
  name: "alertBanner",
  label: "Alert Banner",
  ui: {
    itemProps: (item: { text?: string }) => ({
      label: item?.text ? `Alert: ${item.text.slice(0, 40)}` : "Alert Banner",
    }),
  },
  fields: [
    { type: "string" as const, name: "type", label: "Type", options: ["info", "warning", "success"], ui: { defaultValue: "info" } },
    { type: "string" as const, name: "text", label: "Text", required: true },
    { type: "string" as const, name: "ctaText", label: "CTA Text" },
    { type: "string" as const, name: "ctaLink", label: "CTA Link" },
  ],
};

const richTextBlock = {
  name: "richText",
  label: "Rich Text",
  ui: {
    itemProps: (item: { heading?: string; body?: string }) => {
      return { label: item?.heading ? `Rich Text: ${item.heading}` : item?.body ? `Rich Text: ${item.body.slice(0, 40)}` : "Rich Text" };
    },
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Color Scheme", options: ["light", "grey", "blue", "aqua"] },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "body", label: "Body (HTML)", ui: { component: "textarea" } },
  ],
};

const relatedKnowledgeBaseBlock = {
  name: "relatedKnowledgeBase",
  label: "Related Knowledge Base Articles",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Related KB: ${item.heading}` : "Related Knowledge Base Articles",
    }),
    defaultItem: {
      scheme: "grey",
      heading: "Related articles",
      limit: 4,
    },
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "grey" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    { type: "number" as const, name: "limit", label: "Max Articles", description: "Maximum number of articles to show (default 4)." },
    {
      type: "string" as const,
      name: "filterTags",
      label: "Filter Tags (override)",
      list: true,
      description: "Manually specify tags to filter by. Leave empty to use the page's own tags.",
    },
  ],
};

const relatedPagesBlock = {
  name: "relatedPages",
  label: "Related Pages",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Related Pages: ${item.heading}` : "Related Pages",
    }),
    defaultItem: {
      scheme: "light",
      heading: "Explore further",
      limit: 6,
    },
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    { type: "number" as const, name: "limit", label: "Max Pages", description: "Maximum number of pages to show (default 6)." },
    {
      type: "string" as const,
      name: "filterTags",
      label: "Filter Tags (override)",
      list: true,
      description: "Manually specify tags to filter by. Leave empty to use the page's own tags.",
    },
  ],
};

const currentKnowledgeCardBlock = {
  name: "currentKnowledgeCard",
  label: "Current Knowledge Card",
  ui: {
    itemProps: (item: { question?: string }) => ({
      label: item?.question ? `KB: ${item.question}` : "Current Knowledge Card",
    }),
  },
  fields: [
    { type: "string" as const, name: "question", label: "Question (H1)", required: true },
    { type: "string" as const, name: "directAnswer", label: "Direct Answer (40-60 words)", required: true, ui: { component: "textarea" } },
    {
      type: "object" as const,
      name: "tldrBullets",
      label: "TL;DR Bullets",
      list: true,
      fields: [
        { type: "string" as const, name: "text", label: "Bullet point", required: true },
      ],
    },
    { type: "string" as const, name: "expandedAnswer", label: "Expanded Answer", ui: { component: "textarea" } },
    {
      type: "object" as const,
      name: "sources",
      label: "Sources",
      list: true,
      fields: [
        { type: "string" as const, name: "title", label: "Source Title", required: true },
        { type: "string" as const, name: "url", label: "URL" },
        { type: "string" as const, name: "year", label: "Year" },
      ],
    },
    { type: "string" as const, name: "reviewedBy", label: "Reviewed By (named clinician)" },
    { type: "string" as const, name: "lastReviewed", label: "Last Reviewed Date (YYYY-MM-DD)" },
  ],
};

const roiCalculatorPromoBlock = {
  name: "roiCalculatorPromo",
  label: "ROI Calculator Promo",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `ROI Promo: ${item.heading}` : "ROI Calculator Promo",
    }),
    defaultItem: {
      scheme: "aqua",
      heading: "How much could you save?",
      promoBody: "Model HHVBP upside in 60 seconds.",
      ctaText: "Open the ROI calculator",
      ctaLink: "/resources/roi-calculator/",
    },
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "aqua" } },
    { type: "string" as const, name: "eyebrow", label: "Eyebrow" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "promoBody", label: "Body", ui: { component: "textarea" } },
    { type: "string" as const, name: "ctaText", label: "CTA Text" },
    { type: "string" as const, name: "ctaLink", label: "CTA Link" },
  ],
};

const leadMagnetPromoBlock = {
  name: "leadMagnetPromo",
  label: "Lead Magnet Promo",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Lead Magnet: ${item.heading}` : "Lead Magnet Promo",
    }),
    defaultItem: {
      heading: "The Home Health Buyers Guide",
      promoBody: "Everything you need to brief procurement, in 24 pages.",
      ctaText: "Download free",
      ctaLink: "/resources/guides/",
    },
  },
  fields: [
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "promoBody", label: "Body", ui: { component: "textarea" } },
    { type: "string" as const, name: "ctaText", label: "CTA Text" },
    { type: "string" as const, name: "ctaLink", label: "CTA Link" },
    { type: "image" as const, name: "coverImage", label: "Cover Image" },
  ],
};

const partnerLogoCarouselBlock = {
  name: "partnerLogoCarousel",
  label: "Partner Logo Carousel",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Logos: ${item.heading}` : "Partner Logo Carousel",
    }),
  },
  fields: [
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "subheading", label: "Subheading" },
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["white", "grey", "blue"], ui: { defaultValue: "white" } },
    {
      type: "object" as const,
      name: "logos",
      label: "Logos",
      list: true,
      ui: { itemProps: (item: { alt?: string }) => ({ label: item.alt || "Logo" }) },
      fields: [
        { type: "image" as const, name: "src", label: "Logo Image", required: true },
        { type: "string" as const, name: "alt", label: "Alt Text", required: true },
      ],
    },
  ],
};

const contactFormBlock = {
  name: "contactForm",
  label: "Contact Form",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Contact: ${item.heading}` : "Contact Form",
    }),
  },
  fields: [
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
    { type: "string" as const, name: "salesEmail", label: "Sales Email" },
    { type: "string" as const, name: "supportEmail", label: "Support Email" },
  ],
};

const segmentCardsBlock = {
  name: "segmentCards",
  label: "Segment Cards",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Segments: ${item.heading}` : "Segment Cards",
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "cards",
      label: "Cards",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Card" }) },
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "body", label: "Body", ui: { component: "textarea" } },
        { type: "string" as const, name: "icon", label: "Icon Hint" },
        { type: "string" as const, name: "link", label: "Link URL" },
      ],
    },
  ],
};

const valuePropsBlock = {
  name: "valueProps",
  label: "Value Props",
  ui: {
    itemProps: (item: { heading?: string }) => ({
      label: item?.heading ? `Value Props: ${item.heading}` : "Value Props",
    }),
  },
  fields: [
    { type: "string" as const, name: "scheme", label: "Colour Scheme", options: ["blue", "light", "aqua", "grey"], ui: { defaultValue: "light" } },
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "items",
      label: "Items",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Item" }) },
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "body", label: "Body", ui: { component: "textarea" } },
      ],
    },
  ],
};

const breadcrumbBlock = {
  name: "breadcrumb",
  label: "Breadcrumb",
  ui: {
    itemProps: () => ({ label: "Breadcrumb" }),
  },
  fields: [
    {
      type: "object" as const,
      name: "items",
      label: "Breadcrumb Items",
      list: true,
      fields: [
        { type: "string" as const, name: "label", label: "Label", required: true },
        { type: "string" as const, name: "href", label: "Link URL" },
      ],
    },
  ],
};

// ─── Shared SEO Fields ────────────────────────────────────────────────────────

const seoFields = [
  { type: "string" as const, name: "title", label: "Page Title", isTitle: true, required: true, description: "Browser tab + Google title. Aim for ~60 chars." },
  { type: "string" as const, name: "description", label: "Meta Description", ui: { component: "textarea" as const }, description: "Google snippet. 140-160 chars." },
  { type: "string" as const, name: "url", label: "Canonical URL (display only)" },
  { type: "string" as const, name: "keywords", label: "SEO Keywords", list: true },
  { type: "string" as const, name: "primaryKeyword", label: "Primary Keyword" },
  { type: "string" as const, name: "h1", label: "H1 Override", description: "Override the hero headline as H1 if needed." },
  {
    type: "string" as const,
    name: "tags",
    label: "Content Tags",
    list: true,
    description: "Tags for cross-referencing content across the site. Use slugs from the tag taxonomy: topic (falls-prevention, grip-strength, etc.), segment (home-care, senior-living, etc.), solution (able-assess, etc.), type (guide, evidence, etc.).",
  },
];

// ─── Block and Page Field Groups ──────────────────────────────────────────────

const allBlocks = [
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
  valuePropsBlock,
];

const blockPageFields: any[] = [
  {
    type: "object" as const,
    name: "blocks",
    label: "Page Blocks",
    list: true,
    templates: allBlocks,
  },
  ...seoFields,
];

// ─── Article Fields (blog, learn, news) ───────────────────────────────────────

const articleFields: any[] = [
  { type: "string" as const, name: "title", label: "Title", isTitle: true, required: true },
  { type: "string" as const, name: "excerpt", label: "Excerpt", ui: { component: "textarea" as const } },
  { type: "string" as const, name: "content", label: "Body Content (HTML)", ui: { component: "textarea" as const } },
  { type: "string" as const, name: "category", label: "Category" },
  { type: "string" as const, name: "tags", label: "Tags", list: true },
  { type: "string" as const, name: "author", label: "Author Name" },
  { type: "string" as const, name: "authorRole", label: "Author Role" },
  { type: "string" as const, name: "reviewer", label: "Clinical Reviewer" },
  { type: "string" as const, name: "publishedDate", label: "Published Date (YYYY-MM-DD)" },
  { type: "number" as const, name: "readTime", label: "Read Time (minutes)" },
  { type: "image" as const, name: "image", label: "Featured Image" },
  { type: "boolean" as const, name: "featured", label: "Featured" },
  { type: "string" as const, name: "description", label: "Meta Description" },
  { type: "string" as const, name: "primaryKeyword", label: "Primary Keyword" },
  { type: "string" as const, name: "keywords", label: "SEO Keywords", list: true },
  {
    type: "object" as const,
    name: "blocks",
    label: "Page Blocks (optional, for rich article layouts)",
    list: true,
    templates: allBlocks,
  },
];

// ─── Markdown Page Fields ─────────────────────────────────────────────────────

const markdownPageFields: any[] = [
  { type: "string" as const, name: "title", label: "Title", isTitle: true, required: true },
  { type: "string" as const, name: "description", label: "Meta Description" },
  { type: "rich-text" as const, name: "body", label: "Body", isBody: true },
  { type: "string" as const, name: "keywords", label: "SEO Keywords", list: true },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const tinaApiUrl = process.env.NEXT_PUBLIC_TINA_API_URL || undefined;

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  contentApiUrlOverride: tinaApiUrl,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
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
          router: ({ document }) =>
            document._sys.filename === "homepage" ? "/" : `/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── Solutions ───────────────────────────────────────────────────────
      {
        name: "solutions",
        label: "Solutions",
        path: "content/solutions",
        format: "json",
        ui: {
          router: ({ document }) => `/solutions/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── Segments (Home Care, Senior Living, Skilled Nursing, Clinicians) ─
      {
        name: "segments",
        label: "Segment Landing Pages",
        path: "content/segments",
        format: "json",
        ui: {
          router: ({ document }) => `/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── Compare ─────────────────────────────────────────────────────────
      {
        name: "compare",
        label: "Compare Pages",
        path: "content/compare",
        format: "json",
        ui: {
          router: ({ document }) => `/compare/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── Learn (Blog / Pillars / Articles) ───────────────────────────────
      {
        name: "learn",
        label: "Learn (Blog & Articles)",
        path: "content/learn",
        format: "json",
        ui: {
          router: ({ document }) => `/blog/${document._sys.filename}/`,
        },
        fields: articleFields,
      },

      // ── Resources ───────────────────────────────────────────────────────
      {
        name: "resources",
        label: "Resources",
        path: "content/resources",
        format: "json",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "overview" ? "/resources/" : `/resources/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── Company ─────────────────────────────────────────────────────────
      {
        name: "company",
        label: "Company Pages",
        path: "content/company",
        format: "json",
        ui: {
          router: ({ document }) => {
            const map: Record<string, string> = {
              about: "/about/",
              "meet-the-team": "/meet-the-team/",
              customers: "/customers/",
              partners: "/partners/",
              news: "/news/",
              contact: "/contact/",
              demo: "/demo/",
            };
            return map[document._sys.filename] || `/${document._sys.filename}/`;
          },
        },
        fields: blockPageFields,
      },

      // ── Knowledge Base ────────────────────────────────────────────────
      {
        name: "knowledgeBase",
        label: "Knowledge Base",
        path: "content/knowledge-base",
        format: "json",
        ui: {
          router: ({ document }) => `/knowledge-base/${document._sys.filename}/`,
        },
        fields: [
          { type: "string" as const, name: "title", label: "Title (H1)", isTitle: true, required: true },
          { type: "string" as const, name: "description", label: "Meta Description", ui: { component: "textarea" as const } },
          { type: "string" as const, name: "category", label: "Category", options: ["Falls Prevention", "Grip Strength", "Assessments", "Care Settings", "Regulations", "Technology"], required: true },
          { type: "string" as const, name: "pillar", label: "Pillar Hub Slug", description: "Parent hub article slug (e.g. falls-risk-assessment)" },
          { type: "string" as const, name: "primaryKeyword", label: "Primary Keyword" },
          { type: "string" as const, name: "keywords", label: "SEO Keywords", list: true },
          {
            type: "string" as const,
            name: "tags",
            label: "Content Tags",
            list: true,
            description: "Tags for cross-referencing: topic, segment, solution, type slugs.",
          },
          { type: "string" as const, name: "author", label: "Author Name" },
          { type: "string" as const, name: "authorRole", label: "Author Role" },
          { type: "string" as const, name: "reviewer", label: "Clinical Reviewer" },
          { type: "string" as const, name: "reviewerRole", label: "Reviewer Role" },
          { type: "string" as const, name: "publishedDate", label: "Published Date (YYYY-MM-DD)" },
          { type: "string" as const, name: "lastReviewed", label: "Last Reviewed Date (YYYY-MM-DD)" },
          { type: "number" as const, name: "readTime", label: "Read Time (minutes)" },
          { type: "image" as const, name: "image", label: "Featured Image" },
          { type: "string" as const, name: "imageAlt", label: "Featured Image Alt Text" },
          {
            type: "string" as const,
            name: "schemaTypes",
            label: "Schema Types",
            list: true,
            options: ["Article", "MedicalWebPage", "FAQPage", "HowTo"],
            description: "JSON-LD schema types to emit.",
          },
          {
            type: "object" as const,
            name: "blocks",
            label: "Article Blocks",
            list: true,
            templates: allBlocks,
          },
        ] as any,
      },

      // ── Utility (privacy, terms, cookies, thank-you) ────────────────────
      {
        name: "utility",
        label: "Utility Pages",
        path: "content/utility",
        format: "md",
        ui: {
          router: ({ document }) => `/${document._sys.filename}/`,
        },
        fields: markdownPageFields,
      },

      // ── Global Settings ─────────────────────────────────────────────────
      {
        name: "global",
        label: "Global Settings",
        path: "content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: { create: false, delete: false },
        },
        match: { include: "global" },
        fields: [
          {
            type: "object" as const,
            name: "site",
            label: "Site Information",
            fields: [
              { type: "string" as const, name: "name", label: "Site Name" },
              { type: "string" as const, name: "tagline", label: "Tagline" },
              { type: "image" as const, name: "logo", label: "Header Logo" },
              { type: "string" as const, name: "phone", label: "Phone Number" },
              { type: "string" as const, name: "email", label: "Email Address" },
              { type: "string" as const, name: "canonicalDomain", label: "Canonical Domain" },
            ] as any,
          },
          {
            type: "object" as const,
            name: "social",
            label: "Social Links",
            fields: [
              { type: "string" as const, name: "linkedin", label: "LinkedIn URL" },
              { type: "string" as const, name: "twitter", label: "Twitter/X URL" },
              { type: "string" as const, name: "instagram", label: "Instagram URL" },
            ] as any,
          },
        ] as any,
      },

      // ── Navigation ──────────────────────────────────────────────────────
      {
        name: "navigation",
        label: "Navigation Menu",
        path: "content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: { create: false, delete: false },
        },
        match: { include: "navigation" },
        fields: [
          {
            type: "object" as const,
            name: "mainNav",
            label: "Main Navigation",
            list: true,
            ui: { itemProps: (item: { label?: string }) => ({ label: item.label || "Item" }) },
            fields: [
              { type: "string" as const, name: "label", label: "Label", required: true },
              { type: "string" as const, name: "url", label: "URL", required: true },
              {
                type: "object" as const,
                name: "columns",
                label: "Mega-menu Columns",
                list: true,
                fields: [
                  { type: "string" as const, name: "title", label: "Column Title" },
                  {
                    type: "object" as const,
                    name: "links",
                    label: "Links",
                    list: true,
                    fields: [
                      { type: "string" as const, name: "label", label: "Label", required: true },
                      { type: "string" as const, name: "url", label: "URL", required: true },
                      { type: "string" as const, name: "description", label: "Description" },
                    ] as any,
                  },
                ] as any,
              },
            ] as any,
          },
          {
            type: "object" as const,
            name: "footerNav",
            label: "Footer Navigation",
            list: true,
            ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Column" }) },
            fields: [
              { type: "string" as const, name: "title", label: "Column Title", required: true },
              {
                type: "object" as const,
                name: "links",
                label: "Links",
                list: true,
                fields: [
                  { type: "string" as const, name: "label", label: "Label", required: true },
                  { type: "string" as const, name: "url", label: "URL", required: true },
                ] as any,
              },
            ] as any,
          },
        ] as any,
      },
    ],
  },
});
