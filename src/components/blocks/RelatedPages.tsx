"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSchemeClasses } from "@/lib/color-schemes";

interface RelatedItem {
  id: string;
  collection: string;
  slug: string;
  href: string;
  title: string;
  description?: string;
  tags?: string[];
}

interface RelatedPagesProps {
  /** Pre-resolved content items (resolved server-side by the page template). */
  items?: RelatedItem[];
  /** Tags from the current page (used to highlight shared tags). */
  pageTags?: string[];
  /** Section heading override. */
  heading?: string;
  /** Colour scheme. */
  scheme?: string;
}

const COLLECTION_LABELS: Record<string, string> = {
  solutions: "Solution",
  segments: "Who We Help",
  compare: "Comparison",
  resources: "Resource",
};

const COLLECTION_COLORS: Record<string, string> = {
  solutions: "bg-ac-blue text-white",
  segments: "bg-ac-aqua text-ac-black",
  compare: "bg-ac-black text-white",
  resources: "bg-ac-blue/10 text-ac-blue",
};

/** Human-readable label for a tag slug. */
function tagLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Renders links to relevant segment, solution, compare, and resource
 * pages from a KB article. The inverse of RelatedKnowledgeBase.
 * Items must be pre-resolved server-side.
 */
export function RelatedPages({
  items,
  pageTags = [],
  heading,
  scheme = "light",
}: RelatedPagesProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`py-16 md:py-24 ${getSchemeClasses(scheme as any)}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-8">
          {heading || "Explore further"}
        </h2>

        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-start gap-4 p-5 rounded-xl border border-black/10 bg-white hover:border-ac-blue/20 hover:shadow-md transition-all duration-300"
            >
              {/* Collection badge */}
              <span
                className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  COLLECTION_COLORS[item.collection] || "bg-gray-100 text-gray-600"
                }`}
              >
                {COLLECTION_LABELS[item.collection] || item.collection}
              </span>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <h3 className="text-base font-bold text-ac-black group-hover:text-ac-blue transition-colors leading-snug">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-ac-black/50 font-light mt-1 line-clamp-1">
                    {item.description}
                  </p>
                )}
                {/* Shared tags */}
                {item.tags && item.tags.length > 0 && pageTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags
                      .filter((t) => pageTags.includes(t))
                      .slice(0, 4)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium text-ac-black/40 bg-black/5 px-1.5 py-0.5 rounded"
                        >
                          {tagLabel(tag)}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <ArrowRight className="shrink-0 w-4 h-4 text-ac-black/30 group-hover:text-ac-blue transition-colors mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
