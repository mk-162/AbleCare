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
    const { data } = await fetchPage("segments", slug);
    const page = extractPageData(data);
    if (!page) return { title: "Page Not Found" };
    return {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.description,
      openGraph: {
        title: page.seo?.title || page.title,
        description: page.seo?.description || page.description,
        ...(page.seo?.ogImage && { images: [{ url: page.seo.ogImage }] }),
      },
    };
  } catch {
    return { title: "Page Not Found" };
  }
}

export default async function SeniorLivingSubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let result;
  try {
    result = await fetchPage("segments", slug);
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      notFound();
    }
    console.error(`[senior-living/[slug]] fetchPage failed for slug="${slug}"`, err);
    throw err;
  }
  const { query, variables, data } = result;

  return <EditorialPageClient query={query} variables={variables} data={data} />;
}

export async function generateStaticParams() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "content/segments");
    const seniorLivingSubSlugs = ["ccrc-life-plan", "independent-living", "assisted-living", "rental-retirement"];
    return seniorLivingSubSlugs
      .filter((slug) => fs.existsSync(path.join(dir, `${slug}.json`)))
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}
