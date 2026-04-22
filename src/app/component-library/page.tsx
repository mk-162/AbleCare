import type { Metadata } from "next";
import { ComponentLibrary } from "./ComponentLibrary";

export const metadata: Metadata = {
  title: "Component Library",
  description: "Internal admin reference of every page block.",
  robots: { index: false, follow: false },
};

export default function ComponentLibraryPage() {
  return <ComponentLibrary />;
}
