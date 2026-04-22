import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export const revalidate = 60;

const CASE_STUDY_DIR = path.join(process.cwd(), "data/case-studies");

/**
 * Case studies are authored in data/case-studies/*.json (outside content/)
 * so TinaCloud does not try to seed them. They use legacy field shapes
 * that BlockRenderer.normalizeBlock handles at render time.
 */
function readCaseStudy(slug: string): Record<string, unknown> | null {
  const filePath = path.join(CASE_STUDY_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = readCaseStudy(slug) as
    | { title?: string; description?: string; seo?: { title?: string; description?: string; ogImage?: string } }
    | null;
  if (!page) return { title: "Case Study Not Found" };
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.description,
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.description,
      ...(page.seo?.ogImage && { images: [{ url: page.seo.ogImage }] }),
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = readCaseStudy(slug);
  if (!page) return null;

  const data = { caseStudies: page };
  return <EditorialPageClient query="" variables={{}} data={data} />;
}

export async function generateStaticParams() {
  if (!fs.existsSync(CASE_STUDY_DIR)) return [];
  const files = fs.readdirSync(CASE_STUDY_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) => ({ slug: f.replace(".json", "") }));
}
