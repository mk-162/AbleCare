import type { Metadata } from "next";
import { GripableRotate } from "@/components/blocks/GripableRotate";

export const metadata: Metadata = {
  title: "GripAble Sensor — Interactive Banner Preview",
  description:
    "Interactive product viewer for the GripAble sensor. Drag to rotate, click a feature to focus.",
  // Experimental preview — keep it out of search indexes while on dev.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function GripablePage() {
  return <GripableRotate />;
}
