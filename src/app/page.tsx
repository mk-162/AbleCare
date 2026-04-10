import { Metadata } from "next";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Able Care | Falls Prevention Technology",
  description: "Digital, objective falls risk screening in under 5 minutes. Trusted by home care, senior living and clinicians across the US and UK.",
  openGraph: {
    title: "Able Care | Falls Prevention Technology",
    description: "Digital, objective falls risk screening in under 5 minutes. Trusted by home care, senior living and clinicians across the US and UK.",
    type: "website",
  },
};

async function getPageData() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "content/pages/homepage.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const data = await getPageData();

  if (!data?.blocks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-ac-black mb-4">Able Care</h1>
          <p className="text-ac-black/60">Content is being generated. Run the TinaCMS build to populate pages.</p>
        </div>
      </div>
    );
  }

  // Add __typename prefix for BlockRenderer
  const blocks = data.blocks.map((block: any) => ({
    ...block,
    __typename: `PagesBlocks${block._template.charAt(0).toUpperCase() + block._template.slice(1)}`,
  }));

  return <BlockRenderer blocks={blocks} />;
}
