import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Able Assess User Guide & Quick Start",
  description:
    "Download the Able Assess User Guide and Quick Start Guide. Step-by-step setup, sensor pairing, the five-minute screening workflow, and reporting — for caregivers, assessors, and care staff.",
  openGraph: {
    title: "Able Assess User Guide & Quick Start | Able Care",
    description:
      "Download the Able Assess User Guide and Quick Start Guide. Setup, screening workflow, and reporting in PDF.",
    images: ["/images/resources/able-assess-user-guide-cover.png"],
  },
};

type GuideCard = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
  pdfHref: string;
  pdfFilename: string;
  version: string;
  audience: string;
  bestFor: string;
};

const guides: GuideCard[] = [
  {
    title: "Able Assess User Guide",
    eyebrow: "Full Manual",
    description:
      "The complete operator manual for Able Assess. Covers sensor setup, pairing, the four-metric screening workflow, interpreting results, sharing reports, and day-to-day operations for any team member running assessments.",
    image: "/images/resources/able-assess-user-guide-cover.png",
    imageAlt: "Cover of the Able Assess User Guide v1.10.1",
    pdfHref: "/downloads/Able-Assess-User-Guide-V1.10.1.pdf",
    pdfFilename: "Able-Assess-User-Guide-V1.10.1.pdf",
    version: "v1.10.1",
    audience: "Caregivers, assessors, and care staff",
    bestFor: "End-to-end reference for everyday use",
  },
  {
    title: "Able Assess Quick Start Guide",
    eyebrow: "5-Minute Setup",
    description:
      "Set up Able Assess and run your first standardized falls-risk screening. The fastest path from box to first assessment — pair the GripAble sensor, launch the app, and complete a screening in under five minutes.",
    image: "/images/resources/able-assess-quick-start-cover.png",
    imageAlt: "Cover of the Able Assess Quick Start Guide v1.10.1",
    pdfHref: "/downloads/Able-Assess-Quick-Start-V1.10.1.pdf",
    pdfFilename: "Able-Assess-Quick-Start-V1.10.1.pdf",
    version: "v1.10.1",
    audience: "New users running their first screening",
    bestFor: "First-day onboarding and quick reference",
  },
];

export default function UserGuidePage() {
  return (
    <div className="bg-ac-grey min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="text-xs font-medium text-ac-black/60 mb-6">
            <Link href="/" className="hover:text-ac-blue transition-colors">Home</Link>
            <span className="mx-2 text-ac-black/30">/</span>
            <Link href="/resources" className="hover:text-ac-blue transition-colors">Resources</Link>
            <span className="mx-2 text-ac-black/30">/</span>
            <span className="text-ac-black">User Guide</span>
          </nav>
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-4">Resources</div>
          <h1 className="text-4xl md:text-5xl font-bold text-ac-black mb-4">
            Able Assess User Guide
          </h1>
          <p className="text-lg text-ac-black/70 font-light max-w-2xl">
            Everything you need to set up Able Assess, pair the GripAble sensor, and run standardized falls-risk
            screenings from day one. Download the full User Guide or the Quick Start Guide as PDFs.
          </p>
        </div>
      </section>

      {/* Download cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {guides.map((g) => (
              <article
                key={g.pdfFilename}
                className="group bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-xl hover:border-ac-blue/30 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <a
                  href={g.pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block bg-ac-grey/60 overflow-hidden"
                  aria-label={`Open ${g.title} PDF in a new tab`}
                >
                  <div className="aspect-[17/22] relative w-full">
                    <Image
                      src={g.image}
                      alt={g.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-6 md:p-10 transition-transform duration-500 group-hover:scale-[1.02]"
                      priority
                    />
                  </div>
                </a>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-ac-blue mb-3">
                    {g.eyebrow}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-3">{g.title}</h2>
                  <p className="text-ac-black/70 font-light text-sm md:text-base leading-relaxed mb-6">
                    {g.description}
                  </p>

                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
                    <div>
                      <dt className="font-bold uppercase tracking-wider text-ac-black/50 mb-1">Version</dt>
                      <dd className="text-ac-black font-medium">{g.version}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase tracking-wider text-ac-black/50 mb-1">Audience</dt>
                      <dd className="text-ac-black font-medium">{g.audience}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase tracking-wider text-ac-black/50 mb-1">Best for</dt>
                      <dd className="text-ac-black font-medium">{g.bestFor}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <a
                      href={g.pdfHref}
                      download={g.pdfFilename}
                      className="inline-flex items-center justify-center gap-2 bg-ac-blue text-white rounded-full px-6 py-3 font-bold text-sm hover:bg-ac-aqua hover:text-ac-black hover:shadow-lg transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                    <a
                      href={g.pdfHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white text-ac-black border border-ac-black/10 rounded-full px-6 py-3 font-bold text-sm hover:border-ac-blue hover:text-ac-blue transition-all duration-200"
                    >
                      Open in browser
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Support callout */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative bg-gradient-to-br from-ac-blue to-ac-aqua rounded-2xl p-8 md:p-12 overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Need a hand with setup?
                </h2>
                <p className="text-white/90 font-light text-base md:text-lg">
                  The Able Care team can walk you through pairing, your first screening, and integrating Able Assess
                  into your existing workflow. Get in touch and we will help you go live.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center gap-2 bg-white text-ac-blue rounded-full px-6 py-3 font-bold text-sm hover:bg-ac-black hover:text-white transition-all duration-200"
                >
                  Contact Support
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 bg-ac-black text-white rounded-full px-6 py-3 font-bold text-sm hover:bg-white hover:text-ac-black transition-all duration-200"
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
