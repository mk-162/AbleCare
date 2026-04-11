import { Metadata } from "next";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArticleMetaBar } from "@/components/blocks/ArticleMetaBar";
import { ArticleFooterCta } from "@/components/blocks/ArticleFooterCta";
import { TableOfContents } from "@/components/blocks/TableOfContents";
import { KBSidebar } from "@/components/blocks/KBSidebar";
import { RelatedPages } from "@/components/blocks/RelatedPages";
import { resolveBlocks } from "@/lib/resolve-blocks";
import { getPagesForKB } from "@/lib/content-index";
import { notFound } from "next/navigation";

export const revalidate = 60;

const CATEGORY_SLUGS: Record<string, string> = {
  "Falls Prevention": "falls-prevention",
  "Grip Strength": "grip-strength",
  "Assessments": "assessments",
  "Care Settings": "care-settings",
  "Regulations": "regulations",
  "Technology": "technology",
};

async function getArticle(slug: string) {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), `content/knowledge-base/${slug}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticle(slug);
  if (!data) return { title: "Article Not Found" };
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      ...(data.image && { images: [{ url: data.image }] }),
      ...(data.publishedDate && { publishedTime: data.publishedDate }),
    },
  };
}

export default async function KnowledgeBaseArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getArticle(slug);

  if (!data) notFound();

  const categorySlug = data.category ? CATEGORY_SLUGS[data.category] || "" : "";
  const breadcrumbTitle =
    data.title.length > 50 ? data.title.slice(0, 50) + "…" : data.title;

  // Resolve blocks server-side (handles relatedKnowledgeBase, relatedPages, etc.)
  const blocks = data.blocks
    ? resolveBlocks(data.blocks, data.tags, slug, "KnowledgeBase")
    : [];

  // Resolve related pages for the footer
  const relatedPages = data.tags?.length
    ? getPagesForKB(data.tags, slug, 6)
    : [];

  // Extract the first currentKnowledgeCard block for the TL;DR header
  const kbCardBlock = blocks.find(
    (b: any) => b._template === "currentKnowledgeCard"
  );

  // Remaining blocks (everything except the KB card, rendered below the article body)
  const bodyBlocks = blocks.filter(
    (b: any) => b._template !== "currentKnowledgeCard"
  );

  // Build JSON-LD schemas
  const schemas: object[] = [];

  // Article schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": data.schemaTypes?.includes("MedicalWebPage")
      ? "MedicalWebPage"
      : "Article",
    headline: data.title,
    ...(data.description && { description: data.description }),
    ...(data.image && {
      image: `https://www.able-care.co${data.image}`,
    }),
    ...(data.author && {
      author: {
        "@type": "Person",
        name: data.author,
        ...(data.authorRole && { jobTitle: data.authorRole }),
        affiliation: { "@type": "Organization", name: "Able Care" },
      },
    }),
    ...(data.reviewer && {
      reviewedBy: {
        "@type": "Person",
        name: data.reviewer,
        ...(data.reviewerRole && { jobTitle: data.reviewerRole }),
      },
    }),
    ...(data.publishedDate && { datePublished: data.publishedDate }),
    ...(data.lastReviewed && { dateModified: data.lastReviewed }),
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: "Able Care",
      foundingLocation: "Imperial College London",
      logo: {
        "@type": "ImageObject",
        url: "https://www.able-care.co/images/able-care-logo.svg",
      },
    },
  });

  // Speakable schema (for the TL;DR block)
  if (kbCardBlock?.directAnswer) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".kb-quick-answer"],
      },
    });
  }

  return (
    <article className="pb-20">
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero */}
      <section className="relative bg-ac-blue pt-32 pb-16 mb-12 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #00FFD2, transparent)" }} />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, white, transparent)" }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <Breadcrumb
              variant="light"
              items={[
                { label: "Home", href: "/" },
                { label: "Knowledge Base", href: "/knowledge-base" },
                ...(data.category
                  ? [
                      {
                        label: data.category,
                        href: `/knowledge-base?category=${categorySlug}`,
                      },
                    ]
                  : []),
                { label: breadcrumbTitle },
              ]}
            />

            {data.category && (
              <span className="text-xs font-bold uppercase tracking-widest text-ac-aqua mb-4 block">
                {data.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {data.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Left column — article content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* Meta bar */}
            <ArticleMetaBar
              author={data.author}
              authorRole={data.authorRole}
              reviewer={data.reviewer}
              reviewerRole={data.reviewerRole}
              publishedDate={data.publishedDate}
              lastReviewed={data.lastReviewed}
              readTime={data.readTime}
              category={data.category}
              sourceCount={kbCardBlock?.sources?.length}
            />

            {/* Quick Answer (TL;DR) */}
            {kbCardBlock && (
              <div className="kb-quick-answer mb-10">
                <div className="rounded-2xl border-2 border-ac-blue/15 bg-gradient-to-br from-ac-blue/[0.03] to-transparent p-8 md:p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-ac-blue" />
                    <span className="text-xs font-bold uppercase tracking-widest text-ac-blue">
                      Quick answer
                    </span>
                  </div>
                  <p className="text-lg md:text-xl font-medium text-ac-black leading-relaxed mb-6">
                    {kbCardBlock.directAnswer}
                  </p>
                  {kbCardBlock.tldrBullets?.length > 0 && (
                    <ul className="space-y-3">
                      {kbCardBlock.tldrBullets.map((b: any, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg className="w-4 h-4 text-ac-aqua shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-sm text-ac-black/80 font-light leading-relaxed">{b.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {kbCardBlock.sources?.length > 0 && (
                    <div className="border-t border-black/10 pt-5 mt-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ac-black/40 mb-2 block">Sources</span>
                      <ul className="space-y-1">
                        {kbCardBlock.sources.map((s: any, i: number) => (
                          <li key={i} className="text-xs text-ac-black/50 font-light">
                            {s.url ? (
                              <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-ac-blue transition-colors underline underline-offset-2">{s.title}</a>
                            ) : (
                              <span>{s.title}</span>
                            )}
                            {s.year && <span className="text-ac-black/30"> ({s.year})</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Trust line */}
                  <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-ac-black/25">
                    Developed by researchers from Imperial College London. FDA Listed. CE Marked.
                  </div>
                </div>
              </div>
            )}

            {/* Table of Contents */}
            <TableOfContents items={extractTocFromBlocks(bodyBlocks)} />
          </div>

          {/* Right column — sidebar */}
          <KBSidebar tags={data.tags || []} />
        </div>
      </div>

      {/* Article body blocks (full-width) */}
      {bodyBlocks.length > 0 && (
        <BlockRenderer
          blocks={bodyBlocks}
          pageTags={data.tags}
          pageSlug={slug}
        />
      )}

      {/* Article footer CTA */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <ArticleFooterCta />
        </div>
      </div>

      {/* Related pages */}
      {relatedPages.length > 0 && (
        <RelatedPages
          items={relatedPages}
          pageTags={data.tags}
          heading="Explore further"
          scheme="grey"
        />
      )}
    </article>
  );
}

/** Extract TOC items from richText blocks that contain headings with IDs. */
function extractTocFromBlocks(blocks: any[]): Array<{ id: string; text: string; level: number }> {
  const items: Array<{ id: string; text: string; level: number }> = [];

  for (const block of blocks) {
    // richText blocks with body containing HTML
    if (block._template === "richText" && block.body) {
      // body might be rich-text object or string
      const html = typeof block.body === "string" ? block.body : "";
      const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        items.push({
          level: parseInt(match[1]),
          id: match[2],
          text: match[3].replace(/<[^>]+>/g, ""),
        });
      }
    }

    // Also grab headings from evidence, FAQ, process, metrics blocks
    if (block._template === "evidenceBlock" && block.heading) {
      const id = block.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      items.push({ level: 2, id, text: block.heading });
    }
    if (block._template === "faqAccordion" && block.heading) {
      const id = block.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      items.push({ level: 2, id, text: block.heading });
    }
  }

  return items;
}

export async function generateStaticParams() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "content/knowledge-base");
    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
    return files.map((f: string) => ({ slug: f.replace(".json", "") }));
  } catch {
    return [];
  }
}
