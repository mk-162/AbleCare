import type { Metadata } from "next";
import { AotaForm } from "./AotaForm";

export const metadata: Metadata = {
  title: "Able Assess for AOTA Attendees | Conference Pricing",
  description:
    "Special AOTA Annual Conference pricing on Able Assess — 20% off the annual subscription. Request a price estimate or invoice through April 8, 2026.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AotaPage() {
  return <AotaForm />;
}
