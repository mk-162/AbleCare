import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Knowledge Base | Able Care",
  description:
    "Evidence-based guides on falls prevention, grip strength testing, functional assessments, and care setting implementation. Written by clinicians, reviewed by experts.",
};

interface KBArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  readTime?: number;
  publishedDate?: string;
  lastReviewed?: string;
}

const CATEGORIES = [
  {
    name: "Falls Prevention",
    slug: "falls-prevention",
    description: "Falls risk screening, prevention programmes, and evidence-based strategies.",
  },
  {
    name: "Grip Strength",
    slug: "grip-strength",
    description: "Grip strength as a biomarker, testing protocols, and clinical applications.",
  },
  {
    name: "Assessments",
    slug: "assessments",
    description: "Functional assessment methods: TUG, sit-to-stand, gait speed, and more.",
  },
  {
    name: "Care Settings",
    slug: "care-settings",
    description: "Implementation guides for home care, senior living, and skilled nursing.",
  },
  {
    name: "Regulations",
    slug: "regulations",
    description: "STEADI, NICE guidelines, HHVBP, SAFE Act, and compliance frameworks.",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Digital screening tools, EHR integration, data security, and product guides.",
  },
];

const SECTION_SCHEMES = ["bg-white", "bg-ac-blue/[0.03]", "bg-ac-aqua/[0.06]", "bg-white", "bg-ac-blue/[0.03]", "bg-ac-aqua/[0.06]"];

async function getKBArticles(): Promise<KBArticle[]> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "content/knowledge-base");
    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
    return files
      .map((f: string) => {
        const raw = fs.readFileSync(path.join(dir, f), "utf-8");
        const data = JSON.parse(raw);
        return {
          slug: f.replace(".json", ""),
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          tags: data.tags || [],
          readTime: data.readTime,
          publishedDate: data.publishedDate,
          lastReviewed: data.lastReviewed,
        };
      })
      .sort((a, b) => {
        if (!a.publishedDate || !b.publishedDate) return 0;
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      });
  } catch {
    return [];
  }
}

export default async function KnowledgeBaseHub() {
  const articles = await getKBArticles();

  // Group by category
  const byCategory = new Map<string, KBArticle[]>();
  for (const article of articles) {
    const existing = byCategory.get(article.category) || [];
    existing.push(article);
    byCategory.set(article.category, existing);
  }

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-ac-blue pt-32 pb-16 mb-16">
        <div className="container mx-auto px-4 md:px-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Knowledge Base" }]} variant="light" />

        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-ac-aqua" />
            <span className="text-xs font-bold uppercase tracking-widest text-ac-aqua">
              Knowledge Base
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Evidence-based answers for falls prevention
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl">
            Clinical guides, assessment protocols, and implementation resources.
            Written by our team, reviewed by experts, and backed by peer-reviewed evidence.
          </p>
        </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="container mx-auto px-4 md:px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const count = byCategory.get(cat.name)?.length || 0;
            return (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="group rounded-2xl border border-black/10 bg-white p-6 hover:shadow-lg hover:border-ac-blue/20 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <Image src="/images/able-care-gradient-icon.svg" alt="" width={22} height={22} className="opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  <h2 className="text-lg font-bold text-ac-black group-hover:text-ac-blue transition-colors">
                    {cat.name}
                  </h2>
                </div>
                <p className="text-sm text-ac-black/50 font-light leading-relaxed mb-3">
                  {cat.description}
                </p>
                <span className="text-xs font-medium text-ac-blue/60">
                  {count} {count === 1 ? "article" : "articles"}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Articles by category */}
      {CATEGORIES.map((cat, catIndex) => {
        const catArticles = byCategory.get(cat.name) || [];
        if (catArticles.length === 0) return null;

        return (
          <section
            key={cat.slug}
            id={cat.slug}
            className={`py-12 ${SECTION_SCHEMES[catIndex % SECTION_SCHEMES.length]}`}
          >
            <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/images/able-care-gradient-icon.svg" alt="" width={24} height={24} className="opacity-60" />
              <h2 className="text-2xl md:text-3xl font-bold text-ac-black">
                {cat.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {catArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/knowledge-base/${article.slug}/`}
                  className="group rounded-xl border border-black/10 bg-white p-6 hover:shadow-md hover:border-ac-blue/20 transition-all duration-300"
                >
                  <h3 className="text-base font-bold text-ac-black group-hover:text-ac-blue transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-sm text-ac-black/50 font-light leading-relaxed mb-4 line-clamp-2">
                      {article.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-ac-black/40">
                    <span>{article.readTime ? `${article.readTime} min read` : ""}</span>
                    <span className="flex items-center gap-1 text-ac-black/40 group-hover:text-ac-blue transition-colors">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            </div>
          </section>
        );
      })}

      {/* Empty state */}
      {articles.length === 0 && (
        <section className="container mx-auto px-4 md:px-6 py-20 text-center">
          <BookOpen className="w-12 h-12 text-ac-black/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-ac-black mb-2">
            Knowledge base launching soon
          </h2>
          <p className="text-ac-black/50 font-light max-w-md mx-auto">
            We are building evidence-based guides on falls prevention, grip strength, and functional assessments. Check back shortly.
          </p>
        </section>
      )}
    </div>
  );
}
