import { Metadata } from "next";
import { fetchPage, fetchMarkdownPage, extractPageData } from "@/lib/tina-client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Map of slug -> Tina collection + filename
const SLUG_MAP: Record<string, { collection: string; filename: string }> = {
  "home-care": { collection: "segments", filename: "home-care" },
  "senior-living": { collection: "segments", filename: "senior-living" },
  "skilled-nursing": { collection: "segments", filename: "skilled-nursing" },
  "pharma": { collection: "segments", filename: "pharma" },
  "clinicians": { collection: "segments", filename: "clinicians" },
  "about": { collection: "company", filename: "about" },
  "meet-the-team": { collection: "company", filename: "meet-the-team" },
  "contact": { collection: "company", filename: "contact" },
  "demo": { collection: "company", filename: "demo" },
  "support": { collection: "company", filename: "support" },
  "customers": { collection: "company", filename: "customers" },
  "partners": { collection: "company", filename: "partners" },
  "news": { collection: "company", filename: "news" },
  "privacy": { collection: "utility", filename: "privacy" },
  "terms": { collection: "utility", filename: "terms" },
  "terms-of-sale": { collection: "utility", filename: "terms-of-sale" },
  "cookies": { collection: "utility", filename: "cookies" },
  "security": { collection: "utility", filename: "security" },
  "thank-you": { collection: "utility", filename: "thank-you" },
  "faqs": { collection: "pages", filename: "faqs" },
  "careers": { collection: "company", filename: "careers" },
  "falls-risk-tests": { collection: "pages", filename: "falls-risk-tests" },
  "low-and-at-risk": { collection: "pages", filename: "low-and-at-risk" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mapping = SLUG_MAP[slug];
  if (!mapping) return { title: "Page Not Found" };

  try {
    const fetcher = mapping.collection === "utility" ? fetchMarkdownPage : fetchPage;
    const { data } = await fetcher(mapping.collection, mapping.filename);
    const page = extractPageData(data);
    const title = page?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    return {
      title,
      description: page?.description,
      openGraph: {
        title,
        description: page?.description,
        ...(page?.seo?.ogImage && { images: [{ url: page.seo.ogImage }] }),
      },
    };
  } catch {
    return { title: slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) };
  }
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mapping = SLUG_MAP[slug];

  if (!mapping) {
    notFound();
  }

  const fetcher = mapping.collection === "utility" ? fetchMarkdownPage : fetchPage;
  const { query, variables, data } = await fetcher(mapping.collection, mapping.filename);

  return <EditorialPageClient query={query} variables={variables} data={data} />;
}

export async function generateStaticParams() {
  return Object.keys(SLUG_MAP).map((slug) => ({ slug }));
}
