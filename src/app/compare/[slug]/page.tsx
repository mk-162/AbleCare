import { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { fetchPage, extractPageData } from "@/lib/tina-client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export const revalidate = 60;

const COMPARE_DIR = path.join(process.cwd(), "content/compare");

function isDraft(slug: string): boolean {
  const filePath = path.join(COMPARE_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return false;
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return data.draft === true;
  } catch {
    return false;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (isDraft(slug)) return { title: "Page Not Found" };
  try {
    const { data } = await fetchPage("compare", slug);
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

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (isDraft(slug)) notFound();
  let result;
  try {
    result = await fetchPage("compare", slug);
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      notFound();
    }
    console.error(`[compare/[slug]] fetchPage failed for slug="${slug}"`, err);
    throw err;
  }
  const { query, variables, data } = result;

  return <EditorialPageClient query={query} variables={variables} data={data} />;
}

export async function generateStaticParams() {
  try {
    const files = fs.readdirSync(COMPARE_DIR).filter((f: string) => f.endsWith(".json"));
    return files
      .map((f: string) => ({ slug: f.replace(".json", ""), file: f }))
      .filter(({ slug }) => !isDraft(slug))
      .map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}
