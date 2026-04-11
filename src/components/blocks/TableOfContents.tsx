"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  /** HTML content to extract headings from. */
  html?: string;
  /** Or pass pre-built items. */
  items?: TocItem[];
}

/**
 * Auto-generated table of contents from article HTML.
 * Extracts H2 and H3 headings, renders anchor links,
 * and highlights the active section on scroll.
 */
export function TableOfContents({ html, items: preBuilt }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  const items: TocItem[] = preBuilt ?? extractHeadings(html || "");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="mb-10">
      <div className="rounded-xl border border-black/10 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-4 h-4 text-ac-blue" />
          <span className="text-xs font-bold uppercase tracking-widest text-ac-black/50">
            In this article
          </span>
        </div>
        <ol className="space-y-1.5">
          {items.map((item) => (
            <li
              key={item.id}
              className={item.level === 3 ? "pl-4" : ""}
            >
              <a
                href={`#${item.id}`}
                className={`block text-sm py-1 transition-colors leading-snug ${
                  activeId === item.id
                    ? "text-ac-blue font-medium"
                    : "text-ac-black/50 hover:text-ac-blue font-light"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

/** Extract H2/H3 headings from HTML string. */
function extractHeadings(html: string): TocItem[] {
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  const items: TocItem[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    items.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ""), // strip inner HTML tags
    });
  }

  return items;
}
