import { Metadata } from "next";
import { FileText } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmailGateDownload } from "@/components/blocks/EmailGateDownload";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "White Papers | Able Care Knowledge Base",
  description:
    "In-depth research papers from the Able Care clinical team. Evidence, data and analysis on grip strength, functional assessment and falls prevention.",
};

interface WhitePaper {
  title: string;
  description: string;
  fileUrl: string;
  coverImage?: string;
  pageCount?: number;
  fileSizeMb?: number;
  eyebrow?: string;
}

const WHITE_PAPERS: WhitePaper[] = [
  {
    title: "Grip Strength: The Essential Biomarker for Longevity",
    description:
      "A clinical review of the evidence linking grip strength to mortality, frailty and functional decline — and why it belongs in every falls-prevention workflow. Includes normative data, clinical cut-offs and implementation guidance.",
    fileUrl: "/downloads/Grip-Strength-The-Essential-Biomarker-for-Longevity.pdf",
    eyebrow: "White Paper",
    pageCount: 18,
    fileSizeMb: 2.4,
  },
];

export default function WhitePapersPage() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-ac-blue pt-32 pb-16 mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumb
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Knowledge Base", href: "/knowledge-base" },
              { label: "White Papers" },
            ]}
          />
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-ac-aqua" />
              <span className="text-xs font-bold uppercase tracking-widest text-ac-aqua">
                White Papers
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Original research from the Able Care clinical team
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl">
              Evidence, data and analysis on grip strength, functional assessment
              and falls prevention. Written for clinicians, operators and
              research teams.
            </p>
          </div>
        </div>
      </section>

      {/* Papers list */}
      {WHITE_PAPERS.map((paper, i) => (
        <EmailGateDownload
          key={i}
          title={paper.title}
          description={paper.description}
          fileUrl={paper.fileUrl}
          fileLabel="Get the white paper"
          eyebrow={paper.eyebrow}
          coverImage={paper.coverImage}
          pageCount={paper.pageCount}
          fileSizeMb={paper.fileSizeMb}
        />
      ))}

      {/* Coming-soon footnote */}
      <section className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-ac-black/50 font-light">
            More white papers publishing through 2026. Want to be notified when
            new research is released?{" "}
            <a href="/contact" className="underline hover:text-ac-blue">
              Get in touch
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
