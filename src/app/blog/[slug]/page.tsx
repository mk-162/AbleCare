import { Metadata } from "next";
import { BlogSidebar } from "@/components/blocks/BlogSidebar";
import { BlogArticleClient } from "@/components/blocks/BlogArticleClient";
import { getCategories, slugifyCategory } from "@/lib/blog";
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
      ...(data.image && { images: [{ url: data.image }] }),
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
  const categories = getCategories();
  const categorySlug = data.category ? slugifyCategory(data.category) : null;

  // relatedPages blocks need the filesystem-backed content index, so they are
  // resolved here and handed to the client component, which carries them across
  // live edits. No learn article uses blocks today, but the path is wired.
  const serverBlocks = resolveBlocks(data.blocks, data.tags, slug, "Learn");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    ...(data.description && { description: data.description }),
    ...(data.image && { image: `https://www.able-care.co${data.image}` }),
    ...(data.author && { author: { "@type": "Person", name: data.author } }),
    ...(data.publishedDate && { datePublished: data.publishedDate }),
    publisher: {
      "@type": "Organization",
      name: "Able Care",
      logo: { "@type": "ImageObject", url: "https://www.able-care.co/images/able-care-logo.svg" },
    },
  };

  return (
    <>
      {/* Built from the server snapshot: crawlers read the published document,
          not whatever is currently open in the Tina form. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogArticleClient
        query={query}
        variables={variables}
        data={raw}
        collectionKey="learn"
        slug={slug}
        serverBlocks={serverBlocks}
        sidebar={
          <BlogSidebar
            categories={categories}
            activeCategory={categorySlug || undefined}
          />
        }
      />
    </>
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
