import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Resources | Guides, Evidence & Tools",
  description: "Access clinical evidence, buyer's guides, case studies, and tools to evaluate and implement objective functional assessment.",
};

export default function ResourcesPage() {
  return (
    <div className="pt-32 pb-20 bg-ac-grey min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-4">Resources</div>
          <h1 className="text-4xl md:text-5xl font-bold text-ac-black mb-4">Guides, Evidence & Tools</h1>
          <p className="text-lg text-ac-black/70 font-light max-w-2xl">
            Everything you need to evaluate, procure, and implement objective functional assessment in your organisation.
          </p>
        </div>
        <p className="text-ac-black/60">Resource pages are being built. Check back soon.</p>
      </div>
    </div>
  );
}
