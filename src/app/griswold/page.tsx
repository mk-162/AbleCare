import type { Metadata } from "next";
import { GriswoldForm } from "./GriswoldForm";

export const metadata: Metadata = {
  title: "Griswold Strength Score | Franchise Pricing",
  description:
    "Preferential Able Assess pricing for Griswold franchises. Request a price estimate or invoice.",
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
