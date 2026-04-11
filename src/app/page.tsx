import { Metadata } from "next";
import { fetchPage } from "@/lib/tina-client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

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

export default async function HomePage() {
  const { query, variables, data } = await fetchPage("pages", "homepage");

  return <EditorialPageClient query={query} variables={variables} data={data} />;
}
