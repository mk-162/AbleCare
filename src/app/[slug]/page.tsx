import { Metadata } from "next";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Map of slug -> collection + filename
const SLUG_MAP: Record<string, { collection: string; filename: string }> = {
  "home-care": { collection: "segments", filename: "home-care" },
  "senior-living": { collection: "segments", filename: "senior-living" },
  "skilled-nursing": { collection: "segments", filename: "skilled-nursing" },
  "clinicians": { collection: "segments", filename: "clinicians" },
  "pharma": { collection: "segments", filename: "pharma" },
  "about": { collection: "company", filename: "about" },
  "meet-the-team": { collection: "company", filename: "meet-the-team" },
  "contact": { collection: "company", filename: "contact" },
  "demo": { collection: "company", filename: "demo" },
  "customers": { collection: "company", filename: "customers" },
  "partners": { collection: "company", filename: "partners" },
  "news": { collection: "company", filename: "news" },
  "privacy": { collection: "utility", filename: "privacy" },
  "terms": { collection: "utility", filename: "terms" },
  "cookies": { collection: "utility", filename: "cookies" },
  "security": { collection: "utility", filename: "security" },
  "thank-you": { collection: "utility", filename: "thank-you" },
  "faqs": { collection: "pages", filename: "faqs" },
};

async function getPageData(slug: string) {
  const mapping = SLUG_MAP[slug];
  if (!mapping) return null;

  try {
    const fs = await import("fs");
    const path = await import("path");
    const ext = mapping.collection === "utility" ? "md" : "json";
    const filePath = path.join(
      process.cwd(),
      `content/${mapping.collection === "segments" ? "segments" : mapping.collection === "company" ? "company" : mapping.collection === "utility" ? "utility" : "pages"}/${mapping.filename}.${ext}`
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    return ext === "json" ? JSON.parse(raw) : { title: slug, body: raw };
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
  const data = await getPageData(slug);
  return {
    title: data?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    description: data?.description,
  };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!SLUG_MAP[slug]) {
    notFound();
  }

  const data = await getPageData(slug);

  if (!data?.blocks) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-ac-black mb-4">
            {data?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </h1>
          <p className="text-ac-black/60">This page is being built. Content coming soon.</p>
        </div>
      </div>
    );
  }

  const blocks = data.blocks.map((block: any) => ({
    ...block,
    __typename: `PagesBlocks${block._template.charAt(0).toUpperCase() + block._template.slice(1)}`,
  }));

  return <BlockRenderer blocks={blocks} />;
}

export async function generateStaticParams() {
  return Object.keys(SLUG_MAP).map((slug) => ({ slug }));
}
