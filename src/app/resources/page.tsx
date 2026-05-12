import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ClipboardList,
  Download,
  FileText,
  FlaskConical,
  Library,
  Microscope,
  PlayCircle,
  Quote,
  Video,
} from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Resources | Guides, Evidence & Tools",
  description:
    "Guides, evidence, case studies, webinars and tools to evaluate, procure and implement objective functional assessment with Able Care.",
};

type ResourceCard = {
  href: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  category: string;
};

const cards: ResourceCard[] = [
  {
    href: "/resources/buyers-guide",
    title: "Falls Prevention Buyers Guide",
    description:
      "Everything you need to brief procurement on falls prevention technology. Evaluate, pilot, deploy and scale.",
    Icon: ClipboardList,
    category: "Guide",
  },
  {
    href: "/resources/case-studies",
    title: "Case Studies & Testimonials",
    description:
      "Hear directly from home care operators, senior living communities and clinical teams using Able Assess.",
    Icon: Quote,
    category: "Customer Stories",
  },
  {
    href: "/resources/research-library",
    title: "Research Library",
    description:
      "Peer-reviewed research linking grip strength and functional health to falls, frailty, mortality and outcomes.",
    Icon: Library,
    category: "Evidence",
  },
  {
    href: "/resources/evidence",
    title: "The Science Behind Able Assess",
    description:
      "The clinical evidence base behind the four-metric screening protocol, written for clinicians and procurement.",
    Icon: Microscope,
    category: "Evidence",
  },
  {
    href: "/resources/guides",
    title: "Guides & Compliance Resources",
    description:
      "HHVBP compliance, CCRC best practices and operational rollout guides. Gated PDFs from the Able Care team.",
    Icon: BookOpen,
    category: "Guides",
  },
  {
    href: "/resources/hhvbp-guide",
    title: "HHVBP Compliance Guide",
    description:
      "Protect your HHVBP score with standardized falls screening. A compliance guide built for home health agencies.",
    Icon: FileText,
    category: "Home Care",
  },
  {
    href: "/resources/ccrc-guide",
    title: "CCRC Falls Prevention Guide",
    description:
      "Implement falls prevention in CCRCs and life plan communities. Best practices and compliance checklists.",
    Icon: FileText,
    category: "Senior Living",
  },
  {
    href: "/resources/technical-documentation",
    title: "Technical Documentation",
    description:
      "Integration guides, webhook specs and the compliance background that underpins Able Assess. Download the PDFs.",
    Icon: FlaskConical,
    category: "Technical",
  },
  {
    href: "/resources/webinars",
    title: "Webinars",
    description:
      "Live and on-demand webinars from the Able Care clinical and product team. Falls prevention, grip strength and rollout.",
    Icon: Video,
    category: "Webinars",
  },
  {
    href: "/resources/walkthrough",
    title: "Product Walkthrough",
    description:
      "See Able Assess in action. A video walkthrough and step-by-step guide to the screening workflow.",
    Icon: PlayCircle,
    category: "Video",
  },
  {
    href: "/resources/1-pagers",
    title: "Segment 1-Pagers",
    description:
      "One-page segment overviews for home care, CCRCs, independent living, skilled nursing and more.",
    Icon: FileText,
    category: "Downloads",
  },
  {
    href: "/roi-calculator",
    title: "ROI Calculator",
    description:
      "Model the financial impact of standardized falls screening. Segment-aware. Two minutes. Emailable report.",
    Icon: Calculator,
    category: "Tool",
  },
  {
    href: "/resources/downloads",
    title: "Downloads & Apps",
    description:
      "Download the Able Assess mobile apps for iOS and Android, the grip strength whitepaper and more collateral.",
    Icon: Download,
    category: "Downloads",
  },
];

export default function ResourcesPage() {
  return (
    <div className="bg-ac-grey min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-4">Resources</div>
          <h1 className="text-4xl md:text-5xl font-bold text-ac-black mb-4">Guides, Evidence & Tools</h1>
          <p className="text-lg text-ac-black/70 font-light max-w-2xl">
            Everything you need to evaluate, procure and implement objective functional assessment in your organization.
          </p>
        </div>
      </section>

      {/* Featured: User Guide */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/resources/user-guide"
            className="group relative block bg-gradient-to-br from-ac-blue to-ac-aqua rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-4">
                  Featured · For Customers
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Able Assess User Guide & Quick Start
                </h2>
                <p className="text-white/90 font-light text-base md:text-lg leading-relaxed mb-6 max-w-xl">
                  The complete operator manual and a five-minute quick start. Pair the GripAble sensor, run a
                  standardized falls screening and share results with your care team.
                </p>
                <div className="inline-flex items-center gap-2 text-white font-bold text-sm group-hover:translate-x-2 transition-transform">
                  Open the User Guide <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div className="relative min-h-[280px] md:min-h-[360px] bg-white/10">
                <Image
                  src="/images/resources/able-assess-user-guide-cover.png"
                  alt="Cover of the Able Assess User Guide"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-8 md:p-12"
                />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Grid of resources */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-8">Browse all resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(({ href, title, description, Icon, category }) => {
              const opensInNewTab = /^https?:\/\//.test(href) || href.endsWith(".pdf");
              const inner = (
                <article className="group h-full p-7 rounded-2xl bg-white border border-black/5 hover:border-ac-blue/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-ac-blue/10 text-ac-blue flex items-center justify-center group-hover:bg-ac-blue group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ac-black/40">
                      {category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-ac-black mb-2">{title}</h3>
                  <p className="text-ac-black/70 font-light text-sm leading-relaxed mb-6 flex-grow">{description}</p>
                  <div className="flex items-center text-ac-blue font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Open resource <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </article>
              );
              return opensInNewTab ? (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <Link key={href} href={href}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative bg-ac-black rounded-2xl p-8 md:p-12 overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Looking for something we have not listed?
                </h2>
                <p className="text-white/80 font-light text-base md:text-lg">
                  The team can share protocol templates, ROI models, integration specs and anything else you need to
                  evaluate Able Assess for your setting.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-ac-aqua text-ac-black rounded-full px-6 py-3 font-bold text-sm hover:bg-white hover:text-ac-black transition-all duration-200"
                >
                  Contact the Team
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 bg-ac-blue text-white rounded-full px-6 py-3 font-bold text-sm hover:bg-white hover:text-ac-blue transition-all duration-200"
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
