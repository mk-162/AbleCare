/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Sample data for every block that BlockRenderer knows how to render.
 * Keep the `_template` field aligned with the switch in BlockRenderer.tsx —
 * if a block is added there, add a corresponding sample here.
 */
export interface BlockSample {
  label: string;
  name: string;
  block: Record<string, any>;
}

export const blockSamples: BlockSample[] = [
  {
    name: "hero",
    label: "Hero",
    block: {
      _template: "hero",
      scheme: "blue",
      wave: "crest",
      waveFill: "light",
      eyebrow: "Falls prevention",
      headline: "Identify fall risk early. Act before a fall happens.",
      subtitle: "A quick, objective falls assessment in under five minutes. Evidence-based. Standardized.",
      primaryCtaText: "Book a demo",
      primaryCtaLink: "/demo/",
      secondaryCtaText: "Watch it work",
      secondaryCtaLink: "#",
      backgroundImage: "/images/photos/home/gentleman-child-couch.jpg",
      backgroundImageAlt: "Able Care hero example",
    },
  },
  {
    name: "trustBar",
    label: "Trust Bar",
    block: {
      _template: "trustBar",
      items: [
        { text: "FDA Listed" },
        { text: "CE Marked" },
        { text: "ISO 27001" },
        { text: "HIPAA Aligned" },
      ],
    },
  },
  {
    name: "statsBar",
    label: "Stats Bar",
    block: {
      _template: "statsBar",
      scheme: "light",
      heading: "The platform in numbers",
      stats: [
        { value: "4", label: "Validated metrics", sublabel: "Grip, sit-to-stand, gait, TUG" },
        { value: "< 5 min", label: "Per assessment", sublabel: "Usable by non-clinical staff" },
        { value: "1,000+", label: "Assessments delivered", sublabel: "Across care settings" },
        { value: "12", label: "Peer-reviewed studies", sublabel: "Backing the protocol" },
      ],
    },
  },
  {
    name: "segmentRouter",
    label: "Segment Router",
    block: {
      _template: "segmentRouter",
      scheme: "grey",
      heading: "Where do you work?",
      segments: [
        { title: "Home Care", description: "Reduce client falls and improve standardization across caregivers.", ctaText: "Explore", link: "/home-care/" },
        { title: "Senior Living", description: "Protect residents and reduce falls-related liability.", ctaText: "Explore", link: "/senior-living/" },
        { title: "Pharma & CROs", description: "Grip strength as a clinical trial endpoint.", ctaText: "Explore", link: "/pharma/" },
      ],
    },
  },
  {
    name: "processSteps",
    label: "Process Steps",
    block: {
      _template: "processSteps",
      scheme: "light",
      heading: "Assessment in four simple steps",
      steps: [
        { number: 1, title: "Capture", description: "Run the five-minute Able Assess protocol on any tablet." },
        { number: 2, title: "Score", description: "Instant risk score against age- and sex-matched normative data." },
        { number: 3, title: "Act", description: "Risk report available immediately for quick referrals." },
        { number: 4, title: "Track", description: "Longitudinal trends surface decline early." },
      ],
    },
  },
  {
    name: "metricsBlock",
    label: "Metrics Block",
    block: {
      _template: "metricsBlock",
      scheme: "aqua",
      heading: "Four metrics. One complete picture of function.",
      metrics: [
        { name: "Grip strength", whatItMeasures: "Full body strength proxy.", whyItMatters: "Predicts all-cause mortality more reliably than systolic blood pressure." },
        { name: "Sit-to-stand", whatItMeasures: "Lower-limb power and balance. 30-second timed test.", whyItMatters: "Independently predicts falls in older adults." },
        { name: "Gait speed", whatItMeasures: "Walking speed over a standardized 4-meter distance.", whyItMatters: "Predictor of hospitalization, disability and mortality." },
        { name: "Timed Up and Go", whatItMeasures: "Time to rise, walk three meters, turn, walk back and sit.", whyItMatters: "The most widely used clinical falls risk screen." },
      ],
    },
  },
  {
    name: "featureComparison",
    label: "Feature Comparison",
    block: {
      _template: "featureComparison",
      scheme: "light",
      heading: "Able Assess vs paper-based tools",
      tldr: "Able Assess replaces subjective paper screens with four objective, peer-reviewed metrics scored automatically against normative data.",
      columns: ["Able Assess", "Paper Screens"],
      rows: [
        { feature: "Time per assessment", values: ["< 5 minutes", "15-25 minutes"] },
        { feature: "Required training", values: ["Non-clinical staff", "Clinical qualification"] },
        { feature: "Scoring", values: ["Automatic, age/sex normed", "Manual, subjective"] },
        { feature: "Longitudinal tracking", values: ["Built in", "Paper records"] },
      ],
    },
  },
  {
    name: "evidenceBlock",
    label: "Evidence Block",
    block: {
      _template: "evidenceBlock",
      scheme: "light",
      heading: "Backed by the research",
      pulledStat: "Grip strength predicts all-cause mortality more reliably than systolic blood pressure.",
      pulledStatSource: "Lancet, 2015",
      citations: [
        { title: "Prognostic value of grip strength (PURE study)", journal: "The Lancet", year: "2015", finding: "Grip strength was a stronger predictor of all-cause and cardiovascular mortality than systolic blood pressure across 17 countries." },
        { title: "Multifactorial falls risk screening outperforms single-test approaches", journal: "BMJ", year: "2022", finding: "Multifactorial assessment identified significantly more at-risk adults than any single tool." },
        { title: "Objective screening reduces falls incidence by 25%", journal: "Age and Ageing", year: "2023", finding: "Standardized screening programs reduced falls incidence by approximately 25%." },
      ],
    },
  },
  {
    name: "testimonialCarousel",
    label: "Testimonial Carousel",
    block: {
      _template: "testimonialCarousel",
      scheme: "aqua",
      wave: "fold",
      waveFill: "light",
      heading: "What our customers say",
      testimonials: [
        { quote: "We caught decline six weeks earlier than we would have with our old process.", role: "Clinical Director", organization: "US home care agency" },
        { quote: "It paid for itself in the first quarter.", role: "Operations Lead", organization: "UK CCRC" },
      ],
    },
  },
  {
    name: "caseStudyCards",
    label: "Case Study Cards",
    block: {
      _template: "caseStudyCards",
      scheme: "grey",
      heading: "Proven outcomes",
      caseStudies: [
        { title: "Home care: earlier intervention, fewer hospitalizations", metric: "25%", metricLabel: "reduction in falls-related hospitalizations", summary: "A PE-backed home care operator rolled out Able Assess across 12 branches.", sector: "Home Care", link: "/home-care/" },
        { title: "Senior living: protecting occupancy through prevention", metric: "32%", metricLabel: "fewer falls per resident per year", summary: "A CCRC with 200 IL and AL units adopted Able Assess in their wellness program.", sector: "Senior Living", link: "/senior-living/" },
        { title: "Clinical research: objective endpoints", metric: "4", metricLabel: "validated functional endpoints", summary: "A CRO-led trial captured grip strength remotely.", sector: "Pharma & CROs", link: "/pharma/" },
      ],
    },
  },
  {
    name: "caseStudyCustomerCard",
    label: "Case Study Customer Card",
    block: {
      _template: "caseStudyCustomerCard",
      scheme: "light",
      eyebrow: "Customer story",
      heading: "Cypress Home Care Solutions",
      body: "Cypress rolled out Able Assess across their Phoenix and Tucson branches, replacing their paper Morse Fall Scale workflow.",
      highlightQuote: "It paid for itself in the first quarter.",
      name: "Bob Roth",
      role: "Managing Partner, Cypress Home Care",
      portraitSrc: "/images/team/bob-roth.jpg",
      portraitAlt: "Bob Roth headshot",
    },
  },
  {
    name: "faqAccordion",
    label: "FAQ Accordion",
    block: {
      _template: "faqAccordion",
      scheme: "light",
      heading: "Frequently asked questions",
      faqs: [
        { question: "What hardware does Able Assess require?", answer: "Able Assess runs on any iOS or Android tablet paired with the grip strength sensor kit." },
        { question: "How much training do staff need?", answer: "Minimal. Able Assess was built for non-clinical staff. Most teams are running assessments confidently within a single onboarding session." },
        { question: "Does Able Assess integrate with our EHR?", answer: "Yes. Able Assess is integration ready with EHRs and other risk monitoring platforms." },
      ],
    },
  },
  {
    name: "ctaBanner",
    label: "CTA Banner",
    block: {
      _template: "ctaBanner",
      scheme: "blue",
      wave: "ribbon",
      waveFill: "light",
      heading: "See Able Assess in your workflow.",
      bodyText: "Book a 20-minute demo with a clinician who has run it in the field.",
      primaryCtaText: "Book a demo",
      primaryCtaLink: "/demo/",
    },
  },
  {
    name: "ctaInline",
    label: "CTA Inline",
    block: {
      _template: "ctaInline",
      scheme: "grey",
      heading: "Ready to see the numbers?",
      bodyText: "Download the HHVBP ROI model.",
      primaryCtaText: "Get the model",
      primaryCtaLink: "/resources/roi-calculator/",
    },
  },
  {
    name: "imageFeature",
    label: "Image Feature",
    block: {
      _template: "imageFeature",
      scheme: "light",
      imagePosition: "right",
      image: "/images/product/gripable-sensor-with-tablets-1054x722-min.png",
      imageAlt: "Able Assess on a tablet",
      headline: "Technology built for the frontline",
      description: "Purpose-built for the bedside, the kitchen table and the resident's living room. Runs on any tablet, needs no clinical training.",
      bulletPoints: [
        { text: "Works on any iOS or Android tablet" },
        { text: "No internet required during assessment" },
        { text: "Results sync automatically when connected" },
        { text: "Integration ready with EHRs" },
      ],
      ctaText: "See how it works",
      ctaLink: "/solutions/able-assess/",
    },
  },
  {
    name: "videoSection",
    label: "Video Section",
    block: {
      _template: "videoSection",
      heading: "See Able Assess in action",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      caption: "A 90-second walkthrough with Dr Paul Rinne.",
    },
  },
  {
    name: "teamGrid",
    label: "Team Grid",
    block: {
      _template: "teamGrid",
      heading: "Our clinical team",
      team: [
        { name: "Dr Paul Rinne", role: "Chief Clinical Officer", credentials: "PhD, PT", bio: "Neuroscience and rehabilitation specialist.", photo: "/images/team/dr-paul-rinne.jpg" },
        { name: "Danielle Richards", role: "Head of Customer Success", credentials: "MS, OTR/L", bio: "Occupational therapist with 12 years clinical experience.", photo: "/images/team/danielle-richards.jpg" },
        { name: "Jeff Welsh", role: "VP Sales", credentials: "", bio: "Healthcare SaaS veteran.", photo: "/images/team/jeff-welsh.jpg" },
        { name: "Dr Mike Mace", role: "Clinical Advisor", credentials: "PhD", bio: "Biomedical engineering and signal processing.", photo: "/images/team/dr-mike-mace.jpg" },
      ],
    },
  },
  {
    name: "teamShowcase",
    label: "Team Showcase",
    block: {
      _template: "teamShowcase",
      heading: "Meet the team",
      subtitle: "Clinicians, scientists and engineers building the future of functional assessment.",
      layout: "featured",
      team: [
        { name: "Dr Paul Rinne", role: "Chief Clinical Officer", credentials: "PhD, PT", bio: "Neuroscience and rehabilitation specialist.", photo: "/images/team/dr-paul-rinne.jpg", tier: "leadership" },
        { name: "Danielle Richards", role: "Head of Customer Success", credentials: "MS, OTR/L", bio: "Occupational therapist with 12 years clinical experience.", photo: "/images/team/danielle-richards.jpg", tier: "leadership" },
        { name: "Jeff Welsh", role: "VP Sales", bio: "Healthcare SaaS veteran.", photo: "/images/team/jeff-welsh.jpg", tier: "team" },
        { name: "Dr Mike Mace", role: "Clinical Advisor", credentials: "PhD", bio: "Biomedical engineering and signal processing.", photo: "/images/team/dr-mike-mace.jpg", tier: "advisory" },
      ],
    },
  },
  {
    name: "trustCertBlock",
    label: "Trust & Certification Block",
    block: {
      _template: "trustCertBlock",
      badges: [
        { label: "FDA Listed" },
        { label: "CE Marked" },
        { label: "ISO 27001" },
        { label: "HIPAA Aligned" },
      ],
    },
  },
  {
    name: "alertBanner",
    label: "Alert Banner",
    block: {
      _template: "alertBanner",
      type: "info",
      text: "New: Able Assess is now integration-ready with Axxess and HomeCare HomeBase.",
      ctaText: "See details",
      ctaLink: "/integrations/",
    },
  },
  {
    name: "prose",
    label: "Prose",
    block: {
      _template: "prose",
      scheme: "light",
      align: "left",
      eyebrow: "Introduction",
      heading: "What functional assessment really means",
      body: "<p>Functional assessment is the objective measurement of the physical capacities that predict independence — strength, balance, mobility and endurance.</p><p>Traditional paper-based tools capture some of this, but they depend on <strong>subjective observation</strong> and inter-rater variability. Digital, instrumented assessment replaces judgement with numbers.</p>",
    },
  },
  {
    name: "richText",
    label: "Rich Text",
    block: {
      _template: "richText",
      scheme: "light",
      heading: "A note on methodology",
      body: "<p>All four metrics in the Able Assess protocol have been validated against published normative data spanning adults aged 40-90.</p><p>Scores are produced against age- and sex-matched cohorts drawn from the PURE, NHANES and Dunedin studies.</p>",
    },
  },
  {
    name: "roiCalculatorPromo",
    label: "ROI Calculator Promo",
    block: {
      _template: "roiCalculatorPromo",
      scheme: "aqua",
      eyebrow: "Free tool",
      heading: "How much could you save?",
      promoBody: "Model HHVBP upside in 60 seconds.",
      ctaText: "Open the ROI calculator",
      ctaLink: "/resources/roi-calculator/",
    },
  },
  {
    name: "leadMagnetPromo",
    label: "Lead Magnet Promo",
    block: {
      _template: "leadMagnetPromo",
      heading: "The Home Health Buyers Guide",
      promoBody: "Everything you need to brief procurement, in 24 pages.",
      ctaText: "Download free",
      ctaLink: "/resources/guides/",
    },
  },
  {
    name: "contactForm",
    label: "Contact Form",
    block: {
      _template: "contactForm",
      heading: "Let's talk about functional health.",
      subtitle: "See how Able Assess can help your organization spot decline, prevent falls, and empower your care teams.",
      salesEmail: "hello@able-care.co",
      supportEmail: "hello@able-care.co",
    },
  },
  {
    name: "partnerLogoCarousel",
    label: "Partner Logo Carousel",
    block: {
      _template: "partnerLogoCarousel",
      scheme: "light",
      heading: "Trusted by leading organizations",
    },
  },
  {
    name: "segmentCards",
    label: "Segment Cards",
    block: {
      _template: "segmentCards",
      scheme: "light",
      heading: "Who we work with",
      cards: [
        { title: "Home care agencies", body: "Reduce falls, standardize screening, and improve conversion rates.", link: "/home-care/" },
        { title: "Senior living operators", body: "Protect residents and occupancy with quarterly objective screening.", link: "/senior-living/" },
        { title: "Skilled nursing facilities", body: "Support rehab and discharge planning with functional data.", link: "/skilled-nursing/" },
        { title: "Pharma & CROs", body: "Remote, objective, defensible endpoints for trials.", link: "/pharma/" },
      ],
    },
  },
  {
    name: "valueProps",
    label: "Value Props",
    block: {
      _template: "valueProps",
      scheme: "light",
      heading: "Why teams choose Able Assess",
      items: [
        { title: "Objective", body: "Four peer-reviewed metrics, scored against normative data — no subjective judgement." },
        { title: "Fast", body: "Under five minutes, with any iOS or Android tablet." },
        { title: "Accessible", body: "Non-clinical staff can run a full assessment after a single training session." },
        { title: "Actionable", body: "Risk reports delivered immediately with recommended next steps." },
      ],
    },
  },
  {
    name: "currentKnowledgeCard",
    label: "Current Knowledge Card",
    block: {
      _template: "currentKnowledgeCard",
      question: "What is grip strength testing?",
      directAnswer: "Grip strength testing measures the maximum force a person can generate when squeezing a dynamometer. It is used as a proxy for overall muscle strength, frailty, and functional health — and predicts falls, hospitalization and all-cause mortality in older adults.",
      tldrBullets: [
        { text: "Objective, validated biomarker of strength and frailty." },
        { text: "Predicts mortality more reliably than systolic blood pressure (Lancet, 2015)." },
        { text: "Takes under a minute to administer with a calibrated dynamometer." },
      ],
      expandedAnswer: "Grip strength has been used as a functional biomarker since the 1940s. Modern digital dynamometers make the measurement instant, repeatable, and comparable across age- and sex-matched normative data.",
      sources: [
        { title: "Prognostic value of grip strength (PURE study)", url: "https://www.thelancet.com/", year: "2015" },
        { title: "Grip Strength: An Indispensable Biomarker For Older Adults", url: "https://pubmed.ncbi.nlm.nih.gov/31631989/", year: "2019" },
      ],
      reviewedBy: "Dr Paul Rinne, PhD",
      lastReviewed: "2026-03-15",
    },
  },
  {
    name: "timeline",
    label: "Timeline",
    block: {
      _template: "timeline",
      scheme: "light",
      heading: "Able Care through the years",
      entries: [
        { year: "2018", body: "Able Care founded at Imperial College London." },
        { year: "2021", body: "FDA listing and first US pilots in home care." },
        { year: "2023", body: "Able Assess platform launched with four validated metrics." },
        { year: "2026", body: "Deployments across 1,000+ care sites in the US and UK." },
      ],
    },
  },
  {
    name: "relatedKnowledgeBase",
    label: "Related Knowledge Base Articles",
    block: {
      _template: "relatedKnowledgeBase",
      scheme: "grey",
      heading: "Related articles",
      _resolvedItems: [
        { id: "1", slug: "grip-strength-testing", href: "/knowledge-base/grip-strength-testing", title: "What is grip strength testing?", description: "A validated biomarker of strength, frailty and falls risk.", tags: ["grip-strength", "assessment"], category: "Assessments", readTime: 6 },
        { id: "2", slug: "hhvbp-falls-measure", href: "/knowledge-base/hhvbp-falls-measure", title: "The HHVBP falls measure, explained", description: "How CMS scores home health agencies on falls outcomes.", tags: ["home-care", "hhvbp"], category: "Reimbursement", readTime: 8 },
        { id: "3", slug: "tug-test", href: "/knowledge-base/tug-test", title: "The Timed Up and Go test", description: "The most widely used clinical falls risk screen.", tags: ["falls-prevention"], category: "Assessments", readTime: 4 },
      ],
    },
  },
  {
    name: "relatedPages",
    label: "Related Pages",
    block: {
      _template: "relatedPages",
      scheme: "light",
      heading: "Explore further",
      _resolvedItems: [
        { id: "s1", collection: "solutions", slug: "able-assess", href: "/solutions/able-assess/", title: "Able Assess", description: "Five-minute objective falls risk screening.", tags: ["able-assess"] },
        { id: "s2", collection: "segments", slug: "home-care", href: "/home-care/", title: "For home care", description: "Reduce client falls and standardize screening.", tags: ["home-care"] },
        { id: "s3", collection: "compare", slug: "morse-fall-scale", href: "/compare/morse-fall-scale/", title: "Able Assess vs Morse Fall Scale", description: "Objective digital screening vs subjective paper.", tags: ["falls-prevention"] },
        { id: "s4", collection: "resources", slug: "roi-calculator", href: "/resources/roi-calculator/", title: "HHVBP ROI calculator", description: "Model your falls-prevention upside.", tags: ["hhvbp"] },
      ],
    },
  },
  {
    name: "breadcrumb",
    label: "Breadcrumb",
    block: {
      _template: "breadcrumb",
      scheme: "light",
      items: [
        { label: "Home", href: "/" },
        { label: "Knowledge Base", href: "/knowledge-base/" },
        { label: "Grip strength testing" },
      ],
    },
  },
];
