import Link from "next/link";
import { LeadMagnetWidget } from "./LeadMagnetWidget";

interface CategoryCount {
  name: string;
  slug: string;
  count: number;
}

interface BlogSidebarProps {
  categories: CategoryCount[];
  activeCategory?: string;
}

function slugifyCategory(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function BlogSidebar({ categories, activeCategory }: BlogSidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      <div className="lg:sticky lg:top-28 space-y-6">
        {/* Categories */}
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ac-black/40 mb-4">
            Categories
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/blog"
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  !activeCategory
                    ? "bg-ac-blue/5 text-ac-blue font-bold"
                    : "text-ac-black/70 hover:bg-ac-grey/40 hover:text-ac-black font-light"
                }`}
              >
                <span>All Articles</span>
                <span className={`text-xs ${!activeCategory ? "text-ac-blue/60" : "text-ac-black/30"}`}>
                  {categories.reduce((sum, c) => sum + c.count, 0)}
                </span>
              </Link>
            </li>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <li key={cat.slug}>
                  <Link
                    href={`/blog/category/${cat.slug}`}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-ac-blue/5 text-ac-blue font-bold"
                        : "text-ac-black/70 hover:bg-ac-grey/40 hover:text-ac-black font-light"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-xs ${isActive ? "text-ac-blue/60" : "text-ac-black/30"}`}>
                      {cat.count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Lead Magnets */}
        <LeadMagnetWidget
          title="Falls Prevention Buyer's Guide"
          description="Compare the leading falls prevention tools side-by-side. Download the free guide."
          ctaText="Download Guide"
          ctaLink="/resources/buyers-guide"
          variant="whitepaper"
        />
        <LeadMagnetWidget
          title="Book a 30-Minute Demo"
          description="See Able Assess in action, tailored to your care setting. No slides, no fluff."
          ctaText="Book a Demo"
          ctaLink="/demo"
          variant="landing"
        />
      </div>
    </aside>
  );
}

export { slugifyCategory };
export type { CategoryCount };
