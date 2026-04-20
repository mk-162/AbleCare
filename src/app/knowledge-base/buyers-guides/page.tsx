import Link from "next/link";
import { Metadata } from "next";
import { ShoppingBag, ArrowRight, Clock } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Buyers Guides | Able Care Knowledge Base",
  description:
    "Procurement-ready guides for evaluating falls prevention technology. Feature comparison, integration requirements, pricing models and rollout timelines.",
};

interface BuyerGuide {
  slug: string;
  title: string;
  description: string;
  href: string;
  eyebrow: string;
  readTime?: number;
  featured?: boolean;
}

const GUIDES: BuyerGuide[] = [
  {
    slug: "falls-prevention-buyers-guide",
    title: "The Falls Prevention Buyers Guide",
    description:
      "Everything procurement needs to brief a falls-prevention purchase: evidence base, feature comparison, integration requirements, pricing models and rollout timelines. 24 pages, written for operators, approved by clinicians.",
    href: "/resources/buyers-guide",
    eyebrow: "Procurement Guide",
    featured: true,
  },
  {
    slug: "hand-dynamometry-guide",
    title: "Digital Hand Dynamometers: The Complete Guide",
    description:
      "Everything you need to know about digital, Bluetooth and connected hand dynamometers for clinical and research use. How they work, how they compare to analogue devices, and what to look for when procuring.",
    href: "/blog/hand-dynamometers",
    eyebrow: "Device Guide",
    readTime: 9,
  },
];

export default function BuyersGuidesPage() {
  const featured = GUIDES.find((g) => g.featured);
  const rest = GUIDES.filter((g) => !g.featured);

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
              { label: "Buyers Guides" },
            ]}
          />
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-ac-aqua" />
              <span className="text-xs font-bold uppercase tracking-widest text-ac-aqua">
                Buyers Guides
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Procurement-ready guides for falls prevention technology
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl">
              Feature comparison, integration requirements, pricing models and
              rollout timelines. Everything your team needs to evaluate, brief
              and procure with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="container mx-auto px-4 md:px-6 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-ac-blue">
                Featured
              </span>
            </div>
            <Link
              href={featured.href}
              className="group block rounded-2xl border-2 border-ac-blue/15 bg-gradient-to-br from-ac-blue/[0.03] to-transparent p-8 md:p-10 hover:border-ac-blue/30 transition-all duration-300"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-ac-aqua mb-3">
                {featured.eyebrow}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-ac-black group-hover:text-ac-blue transition-colors leading-tight mb-3">
                {featured.title}
              </h2>
              <p className="text-ac-black/60 font-light leading-relaxed mb-5">
                {featured.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ac-blue">
                Read the guide
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Other guides */}
      {rest.length > 0 && (
        <section className="py-12 bg-ac-aqua/[0.06]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-8">
                More guides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rest.map((g) => (
                  <Link
                    key={g.slug}
                    href={g.href}
                    className="group rounded-xl border border-black/10 bg-white p-6 hover:shadow-md hover:border-ac-blue/20 transition-all duration-300"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ac-blue mb-2">
                      {g.eyebrow}
                    </div>
                    <h3 className="text-base font-bold text-ac-black group-hover:text-ac-blue transition-colors leading-snug mb-2">
                      {g.title}
                    </h3>
                    <p className="text-sm text-ac-black/50 font-light leading-relaxed mb-4 line-clamp-3">
                      {g.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-ac-black/40">
                      {g.readTime ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {g.readTime} min read
                        </span>
                      ) : (
                        <span />
                      )}
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
    </div>
  );
}
