import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Research Summaries | Able Care Knowledge Base",
  description:
    "Plain-language summaries of the peer-reviewed research behind Able Assess. Grip strength across disease areas and the multifactorial evidence base for falls risk.",
};

interface ResearchSummary {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime?: number;
  publishedDate?: string;
}

const SOURCE_DIR = "learn";

// Articles that belong in Research Summaries:
// - every Grip Strength summary from the old site (now in /blog/)
// - the multifactorial evidence base document
const INCLUDE_SLUGS = new Set([
  "grip-strength-and-frailty",
  "grip-strength-and-heart-disease",
  "grip-strength-and-longevity",
  "grip-strength-and-gastrointestinal-disease",
  "grip-strength-and-metabolic-diseases",
  "grip-strength-and-oncology",
  "grip-strength-and-renal-disease",
  "grip-strength-and-respiratory-disease",
  "grip-strength-and-sport",
  "grip-strength-and-surgery",
  "grip-strength-glp-1",
  "grip-strength-sports-medicine-use-cases",
  "able-assess-multifactorial-evidence-falls-risk-screening",
]);

async function getResearchSummaries(): Promise<ResearchSummary[]> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), `content/${SOURCE_DIR}`);
    const files = fs
      .readdirSync(dir)
      .filter(
        (f: string) => f.endsWith(".json") && INCLUDE_SLUGS.has(f.replace(".json", ""))
      );
    return files
      .map((f: string) => {
        const raw = fs.readFileSync(path.join(dir, f), "utf-8");
        const data = JSON.parse(raw);
        return {
          slug: f.replace(".json", ""),
          title: data.title || "",
          description: data.description || data.excerpt || "",
          category: data.category || "",
          readTime: data.readTime,
          publishedDate: data.publishedDate,
        };
      })
      .sort((a, b) => {
        // Multifactorial evidence first, then alphabetical by disease area
        if (a.slug.startsWith("able-assess-multifactorial")) return -1;
        if (b.slug.startsWith("able-assess-multifactorial")) return 1;
        return a.title.localeCompare(b.title);
      });
  } catch {
    return [];
  }
}

export default async function ResearchSummariesPage() {
  const summaries = await getResearchSummaries();

  const multifactorial = summaries.find((s) =>
    s.slug.startsWith("able-assess-multifactorial")
  );
  const gripSummaries = summaries.filter(
    (s) => !s.slug.startsWith("able-assess-multifactorial")
  );

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-ac-blue pt-32 pb-16 mb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumb
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Knowledge Base", href: "/knowledge-base" },
              { label: "Research Summaries" },
            ]}
          />
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-ac-aqua" />
              <span className="text-xs font-bold uppercase tracking-widest text-ac-aqua">
                Research Summaries
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              The evidence base, in plain English
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl">
              Plain-language summaries of the peer-reviewed research behind Able
              Assess. Grip strength across every major disease area, and the
              multifactorial evidence base for falls risk.
            </p>
          </div>
        </div>
      </section>

      {/* Multifactorial (featured) */}
      {multifactorial && (
        <section className="container mx-auto px-4 md:px-6 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-ac-blue">
                Featured
              </span>
            </div>
            <Link
              href={`/blog/${multifactorial.slug}`}
              className="group block rounded-2xl border-2 border-ac-blue/15 bg-gradient-to-br from-ac-blue/[0.03] to-transparent p-8 md:p-10 hover:border-ac-blue/30 transition-all duration-300"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-ac-aqua mb-3">
                Multifactorial Evidence Base
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-ac-black group-hover:text-ac-blue transition-colors leading-tight mb-3">
                {multifactorial.title}
              </h2>
              <p className="text-ac-black/60 font-light leading-relaxed mb-5">
                {multifactorial.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ac-blue">
                Read the summary
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Grip strength summaries */}
      {gripSummaries.length > 0 && (
        <section className="py-12 bg-ac-aqua/[0.06]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-ac-black">
                  Grip strength by disease area
                </h2>
              </div>
              <p className="text-ac-black/50 font-light mb-8 max-w-2xl">
                Each summary covers the clinical evidence linking grip strength
                to a specific disease area, with thresholds, cohort data and
                practical implications.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {gripSummaries.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/blog/${s.slug}`}
                    className="group rounded-xl border border-black/10 bg-white p-6 hover:shadow-md hover:border-ac-blue/20 transition-all duration-300"
                  >
                    <h3 className="text-base font-bold text-ac-black group-hover:text-ac-blue transition-colors leading-snug mb-2">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="text-sm text-ac-black/50 font-light leading-relaxed mb-4 line-clamp-2">
                        {s.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-ac-black/40">
                      <span>{s.readTime ? `${s.readTime} min read` : ""}</span>
                      <span className="flex items-center gap-1 text-ac-black/40 group-hover:text-ac-blue transition-colors">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {summaries.length === 0 && (
        <section className="container mx-auto px-4 md:px-6 py-20 text-center">
          <p className="text-ac-black/50 font-light">
            Research summaries are being indexed. Check back shortly.
          </p>
        </section>
      )}
    </div>
  );
}
