import type { Metadata } from "next";
import { GriswoldForm } from "./GriswoldForm";

export const metadata: Metadata = {
  title: "Griswold Strength Score | Conference Pricing",
  description:
    "Special Annual Conference pricing on Able Assess for Griswold franchises. Request a price estimate or invoice through May 7, 2026.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function GriswoldPage() {
  return <GriswoldForm />;
}
