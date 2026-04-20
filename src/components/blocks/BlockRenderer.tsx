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
import { RelatedKnowledgeBase } from "./RelatedKnowledgeBase";
import { RelatedPages } from "./RelatedPages";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";

/* eslint-disable @typescript-eslint/no-explicit-any */

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

  // featureComparison: ableAssess/paper → col1/col2
  if (b.rows && Array.isArray(b.rows) && b.rows.length > 0 && b.rows[0]?.ableAssess !== undefined) {
    b.rows = b.rows.map((r: any) => ({
      feature: r.feature,
      col1: r.ableAssess ?? r.col1,
      col2: r.paper ?? r.col2,
    }));
  }

  // featureComparison: columns/values format → col1Header/col2Header/col1/col2
  if (b.columns && Array.isArray(b.columns) && b.rows && !b.col1Header) {
    b.col1Header = b.columns[0] || "Able Assess";
    b.col2Header = b.columns[1] || "Traditional";
    b.rows = b.rows.map((r: any) => ({
      feature: r.feature,
      col1: r.values?.[0] ?? r.col1,
      col2: r.values?.[1] ?? r.col2,
    }));
    delete b.columns;
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
  /** Page-level tags, injected into relatedKnowledgeBase/relatedPages blocks. */
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
        const typename = block.__typename;

        // Extract collection prefix: "PagesBlocksHero" → "hero"
        // TinaCMS __typename pattern: {Collection}Blocks{BlockName}
        // Also support _template field (used by JSON content files)
        const blockType = typename
          ? typename.replace(/^.*Blocks/, "").charAt(0).toLowerCase() +
            typename.replace(/^.*Blocks/, "").slice(1)
          : block._template || null;

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
          case "currentKnowledgeCard":
            return <KnowledgeBaseCard key={i} {...block} />;
          case "relatedKnowledgeBase":
            return <RelatedKnowledgeBase key={i} items={block._resolvedItems} heading={block.heading} scheme={block.scheme} />;
          case "relatedPages":
            return <RelatedPages key={i} items={block._resolvedItems} pageTags={pageTags} heading={block.heading} scheme={block.scheme} />;
          case "breadcrumb":
            // breadcrumb blocks are handled by the hero component or skipped
            return null;
          default:
            if (process.env.NODE_ENV === "development") {
              return (
                <div key={i} className="py-8 px-4 bg-yellow-50 border border-yellow-200 text-center">
                  <p className="text-sm text-yellow-800 font-mono">
                    Unknown block type: <strong>{typename || "undefined"}</strong>
                  </p>
                </div>
              );
            }
            return null;
        }
      })}
    </>
  );
}
