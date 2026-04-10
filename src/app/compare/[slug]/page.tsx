import { Metadata } from "next";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export const revalidate = 60;

async function getPageData(slug: string) {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), `content/compare/${slug}.json`);
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
  const data = await getPageData(slug);
  const title = data?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    title,
    description: data?.description,
    openGraph: {
      title,
      description: data?.description,
      ...(data?.seo?.ogImage && { images: [{ url: data.seo.ogImage }] }),
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPageData(slug);

  if (!data?.blocks) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-ac-black mb-4">
            {data?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </h1>
          <p className="text-ac-black/60">Comparison page content coming soon.</p>
        </div>
      </div>
    );
  }

  const blocks = data.blocks.map((block: any) => ({
    ...block,
    __typename: `CompareBlocks${block._template.charAt(0).toUpperCase() + block._template.slice(1)}`,
  }));

  return <BlockRenderer blocks={blocks} />;
}

export async function generateStaticParams() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "content/compare");
    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
    return files.map((f: string) => ({ slug: f.replace(".json", "") }));
  } catch {
    return [];
  }
}
