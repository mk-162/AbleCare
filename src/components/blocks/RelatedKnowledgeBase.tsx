"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getSchemeClasses } from "@/lib/color-schemes";

interface RelatedItem {
  id: string;
  slug: string;
  href: string;
  title: string;
  description?: string;
  tags?: string[];
  category?: string;
  readTime?: number;
}

interface RelatedKnowledgeBaseProps {
  /** Pre-resolved content items (resolved server-side by the page template). */
  items?: RelatedItem[];
  /** Section heading override. */
  heading?: string;
  /** Color scheme. */
  scheme?: string;
}

/** Human-readable label for a tag slug. */
function tagLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Renders a grid of related KB/blog articles on segment, solution,
 * compare, and resource pages. Items must be pre-resolved server-side
 * (content-index.ts runs on the server only).
 */
export function RelatedKnowledgeBase({
  items,
  heading,
  scheme = "grey",
}: RelatedKnowledgeBaseProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`py-20 md:py-28 ${getSchemeClasses(scheme as any)}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-ac-blue" />
            <span className="text-xs font-bold uppercase tracking-widest text-ac-blue">
              Knowledge Base
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ac-black">
            {heading || "Related articles"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group rounded-2xl border border-black/10 bg-white p-6 hover:shadow-lg hover:border-ac-blue/20 transition-all duration-300 flex flex-col"
            >
              {/* Tag pills */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold uppercase tracking-wider text-ac-blue/70 bg-ac-blue/5 px-2 py-0.5 rounded-full"
                    >
                      {tagLabel(tag)}
                    </span>
                  ))}
                </div>
              )}

              {/* Category badge */}
              {item.category && (
                <span className="text-xs font-bold uppercase tracking-widest text-ac-blue mb-2 block">
                  {item.category}
                </span>
              )}

              {/* Title */}
              <h3 className="text-lg font-bold text-ac-black mb-3 group-hover:text-ac-blue transition-colors leading-snug flex-grow">
                {item.title}
              </h3>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-ac-black/60 font-light leading-relaxed mb-4 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Read time + arrow */}
              <div className="mt-auto flex items-center justify-between text-sm">
                {item.readTime && (
                  <span className="text-ac-black/40">{item.readTime} min read</span>
                )}
                <span className="flex items-center text-ac-black/50 group-hover:text-ac-blue transition-colors ml-auto">
                  Read <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
