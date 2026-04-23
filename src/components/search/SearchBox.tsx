"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import MiniSearch from "minisearch";
import type { SearchDoc } from "@/lib/search-index";

interface SearchBoxProps {
  documents: SearchDoc[];
  placeholder?: string;
  variant?: "light" | "dark";
}

interface SearchResult extends SearchDoc {
  score: number;
}

export function SearchBox({
  documents,
  placeholder = "Search articles...",
  variant = "light",
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const mini = useMemo(() => {
    const instance = new MiniSearch<SearchDoc>({
      fields: ["title", "excerpt", "category"],
      storeFields: ["id", "slug", "title", "excerpt", "category", "type", "url"],
      searchOptions: {
        boost: { title: 3, category: 1.5 },
        prefix: true,
        fuzzy: 0.2,
      },
    });
    instance.addAll(documents);
    return instance;
  }, [documents]);

  const results = useMemo<SearchResult[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return mini.search(trimmed).slice(0, 8) as unknown as SearchResult[];
  }, [query, mini]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      window.location.href = results[activeIndex].url;
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  const inputClasses =
    variant === "dark"
      ? "w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur py-3 pl-11 pr-10 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-colors"
      : "w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-10 text-sm text-ac-black placeholder:text-ac-black/40 focus:outline-none focus:border-ac-blue/40 focus:ring-2 focus:ring-ac-blue/10 transition-colors";

  const iconClasses =
    variant === "dark"
      ? "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none"
      : "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ac-black/40 pointer-events-none";

  const clearClasses =
    variant === "dark"
      ? "absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
      : "absolute right-3 top-1/2 -translate-y-1/2 text-ac-black/40 hover:text-ac-black";

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className={iconClasses} />
        <input
          type="search"
          role="combobox"
          aria-expanded={isOpen && query.trim().length > 0}
          aria-controls="search-results-listbox"
          aria-autocomplete="list"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={inputClasses}
        />
        {query && (
          <button
            type="button"
            onClick={close}
            className={clearClasses}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div
          id="search-results-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-black/10 bg-white shadow-xl overflow-hidden z-30"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-ac-black/50">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto py-1">
              {results.map((r, i) => (
                <li key={r.id} role="option" aria-selected={i === activeIndex}>
                  <Link
                    href={r.url}
                    onClick={close}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`block px-4 py-3 border-b border-black/5 last:border-b-0 transition-colors ${
                      i === activeIndex ? "bg-ac-blue/5" : "hover:bg-ac-grey/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-sm font-bold text-ac-black leading-snug flex-1">
                        {r.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ac-blue/70 flex-shrink-0 mt-0.5">
                        {r.type === "blog" ? "Blog" : "KB"}
                      </span>
                    </div>
                    {r.category && (
                      <div className="text-[11px] text-ac-black/40 mb-1">
                        {r.category}
                      </div>
                    )}
                    {r.excerpt && (
                      <p className="text-xs text-ac-black/55 font-light line-clamp-2">
                        {r.excerpt}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
