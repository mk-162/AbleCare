import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BlogSidebar } from "@/components/blocks/BlogSidebar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCategories, slugifyCategory } from "@/lib/blog";
import { ArticleFooterCta } from "@/components/blocks/ArticleFooterCta";
import { ArticleBody } from "@/components/blocks/ArticleBody";
import { ArticleDownloadButton } from "@/components/blocks/ArticleDownloadButton";
import { resolveBlocks } from "@/lib/resolve-blocks";
import { fetchPage, extractPageData } from "@/lib/tina-client";
import { notFound } from "next/navigation";

export const revalidate = 60;

async function getArticle(slug: string) {
  try {
    const result = await fetchPage("learn", slug);
    const data = extractPageData(result.data);
    if (!data) return null;
    return { query: result.query, variables: result.variables, raw: result.data, data };
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
  const article = await getArticle(slug);
  if (!article) return { title: "Article Not Found" };
  const data = article.data;
  return {
    title: data.title,
    description: data.description || data.excerpt,
    openGraph: {
      title: data.title,
      description: data.description || data.excerpt,
      type: "article",
      ...(data.featuredImage && { images: [{ url: data.featuredImage }] }),
      ...(data.publishedDate && { publishedTime: data.publishedDate }),
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const { query, variables, raw, data } = article;
  const hasBlocks = data.blocks && data.blocks.length > 0;
  const hasBody = Array.isArray(data.body?.children) && data.body.children.length > 0;
  const featuredImage = data.featuredImage || data.image;
  const categories = getCategories();
  const categorySlug = data.category ? slugifyCategory(data.category) : null;

  // Truncate title for breadcrumb
  const breadcrumbTitle =
    data.title.length > 40 ? data.title.slice(0, 40) + "…" : data.title;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    ...(data.description && { description: data.description }),
    ...(featuredImage && { image: `https://www.able-care.co${featuredImage}` }),
    ...(data.author && { author: { "@type": "Person", name: data.author } }),
    ...(data.publishedDate && { datePublished: data.publishedDate }),
    publisher: {
      "@type": "Organization",
      name: "Able Care",
      logo: { "@type": "ImageObject", url: "https://www.able-care.co/images/able-care-logo.svg" },
    },
  };

  return (
    <article className="pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              ...(data.category && categorySlug
                ? [
                    {
                      label: data.category,
                      href: `/blog/category/${categorySlug}`,
                    },
                  ]
                : []),
              { label: breadcrumbTitle },
            ]}
          />

          {/* Category + Title */}
          <div className="mb-8 max-w-3xl">
            {data.category && categorySlug && (
              <Link
                href={`/blog/category/${categorySlug}`}
                className="text-xs font-bold uppercase tracking-widest text-ac-blue mb-4 block hover:text-ac-aqua transition-colors"
              >
                {data.category}
              </Link>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ac-black leading-tight">
              {data.title}
            </h1>
          </div>

          {/* Split: Featured image (left) + Excerpt & meta (right) */}
          <div className="flex flex-col md:flex-row gap-8 mb-12 max-w-5xl">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-ac-blue/10 to-ac-aqua/10">
                {featuredImage ? (
                  <Image
                    src={featuredImage}
                    alt={data.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-ac-blue/10 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-ac-blue/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              {data.excerpt && (
                <p className="text-lg md:text-xl text-ac-black/70 font-light leading-relaxed mb-6">
                  {data.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-ac-black/50 border-t border-black/10 pt-6">
                {data.author && (
                  <span className="font-medium text-ac-black">
                    {data.author}
                  </span>
                )}
                {data.publishedDate && <span>{data.publishedDate}</span>}
                {data.readTime && <span>{data.readTime} min read</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column: Article body + Right rail */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Main content — rich-text body. Blocks render full-width below. */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {data.downloadPdf && (
              <ArticleDownloadButton
                href={data.downloadPdf}
                label={data.downloadPdfLabel}
              />
            )}

            {hasBody && (
              <ArticleBody
                query={query}
                variables={variables}
                data={raw}
                collectionKey="learn"
              />
            )}

            {/* Article footer CTA */}
            <ArticleFooterCta />
          </div>

          {/* Sidebar with categories + lead magnets */}
          <BlogSidebar categories={categories} activeCategory={categorySlug || undefined} />
        </div>
      </div>

      {hasBlocks && (
        <BlockRenderer
          blocks={resolveBlocks(data.blocks, data.tags, slug, "Learn")}
          pageTags={data.tags}
          pageSlug={slug}
        />
      )}
    </article>
  );
}

export async function generateStaticParams() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "content/learn");
    const files = fs
      .readdirSync(dir)
      .filter((f: string) => f.endsWith(".json"));
    return files.map((f: string) => ({ slug: f.replace(".json", "") }));
  } catch {
    return [];
  }
}

