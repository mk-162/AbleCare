import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPage, extractPageData } from "@/lib/tina-client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await fetchPage("solutions", slug);
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
    return { title: "Page Not Found" };
  }
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let result;
  try {
    result = await fetchPage("solutions", slug);
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      notFound();
    }
    console.error(`[solutions/[slug]] fetchPage failed for slug="${slug}"`, err);
    throw err;
  }
  const { query, variables, data } = result;

  return <EditorialPageClient query={query} variables={variables} data={data} />;
}

export async function generateStaticParams() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "content/solutions");
    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
    return files.map((f: string) => ({ slug: f.replace(".json", "") }));
  } catch {
    return [];
  }
}
