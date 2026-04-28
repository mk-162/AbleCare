"use client";

import { Hero } from "./Hero";
import { TrustBar } from "./TrustBar";
import { StatsBar } from "./StatsBar";
import { SegmentRouter } from "./SegmentRouter";
import { ProcessSteps } from "./ProcessSteps";
import { MetricsBlock } from "./MetricsBlock";
import { FeatureComparison } from "./FeatureComparison";
import { EvidenceBlock } from "./EvidenceBlock";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { CaseStudyCards } from "./CaseStudyCards";
import { CaseStudyCustomerCard } from "./CaseStudyCustomerCard";
import { FaqAccordion } from "./FaqAccordion";
import { CtaBanner } from "./CtaBanner";
import { CtaInline } from "./CtaInline";
import { ImageFeature } from "./ImageFeature";
import { VideoSection } from "./VideoSection";
import { TeamGrid } from "./TeamGrid";
import { AlertBanner } from "./AlertBanner";
import { RichText } from "./RichText";
import { Prose } from "./Prose";
import { RoiCalculatorPromo } from "./RoiCalculatorPromo";
import { LeadMagnetPromo } from "./LeadMagnetPromo";
import { ContactForm } from "./ContactForm";
import { TeamShowcase } from "./TeamShowcase";
import { PartnerLogoCarousel } from "./PartnerLogoCarousel";
import { SegmentCards } from "./SegmentCards";
import { ValueProps } from "./ValueProps";
import { RelatedPages } from "./RelatedPages";
import { Timeline } from "./Timeline";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { resolveBlockScheme } from "@/lib/resolve-scheme";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Blocks whose wave sits at the TOP of the section — the rectangle
 * above the wave curve must match the block that renders ABOVE them.
 */
const TOP_WAVE_BLOCKS = new Set(["ctaBanner", "testimonialCarousel"]);

/**
 * Blocks whose wave sits at the BOTTOM of the section — the rectangle
 * below the wave curve must match the block that renders BELOW them.
 */
const BOTTOM_WAVE_BLOCKS = new Set(["hero"]);

function getBlockType(block: any): string | null {
  const typename = block.__typename;
  if (typename) {
    const stripped = typename.replace(/^.*Blocks/, "");
    return stripped.charAt(0).toLowerCase() + stripped.slice(1);
  }
  return block._template || null;
}

/**
 * Normalize content JSON field names to component prop names.
 * Handles two patterns used across content files:
 *   - `colorScheme` → `scheme`, `waveStyle` → `wave`
 *   - `primaryCta: { label, href }` → `primaryCtaText` + `primaryCtaLink`
 *   - `body` (on ctaBanner) → `bodyText`
 *   - `studies` → `citations` (evidenceBlock)
 *   - `cards` → `caseStudies` (caseStudyCards)
 */
function normalizeBlock(block: any): any {
  const b = { ...block };

  // colorScheme → scheme
  if (b.colorScheme && !b.scheme) {
    b.scheme = b.colorScheme;
    delete b.colorScheme;
  }

  // waveStyle → wave
  if (b.waveStyle && !b.wave) {
    b.wave = b.waveStyle;
    delete b.waveStyle;
  }

  // primaryCta object → flat
  if (b.primaryCta && typeof b.primaryCta === "object") {
    if (!b.primaryCtaText) b.primaryCtaText = b.primaryCta.label;
    if (!b.primaryCtaLink) b.primaryCtaLink = b.primaryCta.href;
    delete b.primaryCta;
  }

  // secondaryCta object → flat
  if (b.secondaryCta && typeof b.secondaryCta === "object") {
    if (!b.secondaryCtaText) b.secondaryCtaText = b.secondaryCta.label;
    if (!b.secondaryCtaLink) b.secondaryCtaLink = b.secondaryCta.href;
    delete b.secondaryCta;
  }

  // body → bodyText (ctaBanner uses bodyText)
  if (b.body && typeof b.body === "string" && !b.bodyText) {
    b.bodyText = b.body;
  }

  // pulledStat as object → flat strings
  if (b.pulledStat && typeof b.pulledStat === "object") {
    const ps = b.pulledStat;
    b.pulledStat = ps.text;
    if (!b.pulledStatSource) b.pulledStatSource = ps.source;
  }

  // studies → citations (evidenceBlock)
  if (b.studies && !b.citations) {
    b.citations = b.studies.map((s: any) => ({
      title: s.title,
      authors: s.authors,
      journal: s.source,
      year: s.year,
      link: s.url,
      finding: s.finding,
    }));
    delete b.studies;
  }

  // cards → caseStudies (caseStudyCards)
  if (b.cards && !b.caseStudies) {
    b.caseStudies = b.cards.map((c: any) => ({
      title: c.title,
      sector: c.segment,
      summary: c.outcome,
      link: c.href,
      metric: c.metric,
      metricLabel: c.metricLabel,
      thumbnail: c.thumbnail,
    }));
    delete b.cards;
  }

  // linkText/linkHref → primaryCtaText/primaryCtaLink (ctaInline)
  if (b.linkText && !b.primaryCtaText) {
    b.primaryCtaText = b.linkText;
    delete b.linkText;
  }
  if (b.linkHref && !b.primaryCtaLink) {
    b.primaryCtaLink = b.linkHref;
    delete b.linkHref;
  }

  // trustBar: string items → { text } objects
  if (b.items && Array.isArray(b.items) && b.items.length > 0 && typeof b.items[0] === "string") {
    b.items = b.items.map((s: string) => ({ text: s }));
  }

  // imageFeature: body → description, imageSide → imagePosition, imageSrc → image
  if (b.body && typeof b.body === "string" && !b.description) {
    b.description = b.body;
  }
  if (b.imageSide && !b.imagePosition) {
    b.imagePosition = b.imageSide;
    delete b.imageSide;
  }
  if (b.imageSrc && !b.image) {
    b.image = b.imageSrc;
    delete b.imageSrc;
  }

  // metricsBlock: description → whatItMeasures
  if (b.metrics && Array.isArray(b.metrics)) {
    b.metrics = b.metrics.map((m: any) => {
      if (m.description && !m.whatItMeasures) {
        return { ...m, whatItMeasures: m.description };
      }
      return m;
    });
  }

  // faqAccordion: items → faqs
  if (b.items && Array.isArray(b.items) && b.items.length > 0 && b.items[0]?.question && !b.faqs) {
    b.faqs = b.items;
    delete b.items;
  }

  // title → heading for block types that use heading prop
  // (ctaInline, ctaBanner, etc. — most blocks use "heading" not "title")
  const template = b._template;
  if (b.title && !b.heading && template && template !== "hero") {
    b.heading = b.title;
  }

  return b;
}

interface BlockRendererProps {
  blocks: any[];
  /** Page-level tags, injected into relatedPages blocks. */
  pageTags?: string[];
  /** Page slug, injected into relatedPages blocks to exclude self. */
  pageSlug?: string;
}

export function BlockRenderer({ blocks, pageTags, pageSlug }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((rawBlock, i) => {
        const block = normalizeBlock(rawBlock);
        const blockType = getBlockType(block);

        // Auto-derive waveFill from the adjacent block's scheme so the flat
        // rectangle above/below the wave curve matches its neighbor. This
        // replaces the manual `waveFill` field, which was error-prone.
        if (blockType && BOTTOM_WAVE_BLOCKS.has(blockType)) {
          // Skip non-visual blocks (breadcrumb renders null) when looking down.
          let j = i + 1;
          while (j < blocks.length && getBlockType(normalizeBlock(blocks[j])) === "breadcrumb") j++;
          const next = j < blocks.length ? normalizeBlock(blocks[j]) : null;
          block.waveFill = resolveBlockScheme(next);
        }
        if (blockType && TOP_WAVE_BLOCKS.has(blockType)) {
          let j = i - 1;
          while (j >= 0 && getBlockType(normalizeBlock(blocks[j])) === "breadcrumb") j--;
          const prev = j >= 0 ? normalizeBlock(blocks[j]) : null;
          block.waveFill = resolveBlockScheme(prev);
        }

        switch (blockType) {
          case "hero":
            return <Hero key={i} {...block} />;
          case "trustBar":
            return <TrustBar key={i} {...block} />;
          case "statsBar":
            return <StatsBar key={i} {...block} />;
          case "segmentRouter":
            return <SegmentRouter key={i} {...block} />;
          case "processSteps":
            return <ProcessSteps key={i} {...block} />;
          case "metricsBlock":
            return <MetricsBlock key={i} {...block} />;
          case "featureComparison":
            return <FeatureComparison key={i} {...block} />;
          case "evidenceBlock":
            return <EvidenceBlock key={i} {...block} />;
          case "testimonialCarousel":
            return <TestimonialCarousel key={i} {...block} />;
          case "caseStudyCards":
            return <CaseStudyCards key={i} {...block} />;
          case "caseStudyCustomerCard":
            return <CaseStudyCustomerCard key={i} {...block} />;
          case "faqAccordion":
            return <FaqAccordion key={i} {...block} />;
          case "ctaBanner":
            return <CtaBanner key={i} {...block} />;
          case "ctaInline":
            return <CtaInline key={i} {...block} />;
          case "imageFeature":
            return <ImageFeature key={i} {...block} />;
          case "videoSection":
            return <VideoSection key={i} {...block} />;
          case "teamGrid":
            return <TeamGrid key={i} {...block} />;
          case "alertBanner":
            return <AlertBanner key={i} {...block} />;
          case "richText":
            return <RichText key={i} {...block} />;
          case "prose":
            return <Prose key={i} {...block} />;
          case "roiCalculatorPromo":
            return <RoiCalculatorPromo key={i} {...block} />;
          case "leadMagnetPromo":
            return <LeadMagnetPromo key={i} {...block} />;
          case "trustCertBlock":
            // trustCertBlock maps to TrustBar — normalize badges to items
            return <TrustBar key={i} items={block.badges?.map((b: any) => ({ text: b.label || b.text })) || block.items} />;
          case "contactForm":
            return <ContactForm key={i} {...block} />;
          case "teamShowcase":
            return <TeamShowcase key={i} {...block} />;
          case "partnerLogoCarousel":
            return <PartnerLogoCarousel key={i} {...block} />;
          case "segmentCards":
            return <SegmentCards key={i} {...block} />;
          case "valueProps":
            return <ValueProps key={i} {...block} />;
          case "timeline":
            return <Timeline key={i} {...block} />;
          case "relatedPages":
            return <RelatedPages key={i} items={block._resolvedItems} pageTags={pageTags} heading={block.heading} scheme={block.scheme} />;
          case "breadcrumb": {
            const items = Array.isArray(block.items) ? block.items : [];
            if (items.length === 0) return null;
            const variant = block.scheme === "blue" ? "light" : "dark";
            return (
              <div key={i} className="container mx-auto px-4 md:px-6 pt-24 md:pt-28">
                <Breadcrumb items={items} variant={variant} />
              </div>
            );
          }
          default:
            if (process.env.NODE_ENV === "development") {
              return (
                <div key={i} className="py-8 px-4 bg-yellow-50 border border-yellow-200 text-center">
                  <p className="text-sm text-yellow-800 font-mono">
                    Unknown block type: <strong>{block.__typename || blockType || "undefined"}</strong>
                  </p>
                </div>
              );
            }
            return null;
        }
      })}
      <FooterTransition
        scheme={resolveBlockScheme(normalizeBlock(blocks[blocks.length - 1]))}
      />
    </>
  );
}

function FooterTransition({ scheme }: { scheme: ReturnType<typeof resolveBlockScheme> }) {
  const schemeToHex: Record<string, string> = {
    light: "#ffffff",
    grey: "#DCDCDC",
    blue: "#1432FF",
    aqua: "#00FFD2",
    black: "#191919",
  };
  const topColor = schemeToHex[scheme] ?? "#ffffff";
  return (
    <div className="relative w-full leading-none -mt-px -mb-px" aria-hidden="true" style={{ marginBottom: "-1px", marginTop: "-1px" }}>
      <svg viewBox="-1 -1 1442 84" preserveAspectRatio="none" className="block w-full" style={{ height: "84px" }}>
        <rect x="-1" y="-1" width="1442" height="84" fill={topColor} />
        <path
          fill="#191919"
          d="M-1,41 C240,81 480,1 720,41 C960,81 1200,21 1441,41 L1441,83 L-1,83 Z"
        />
      </svg>
    </div>
  );
}
