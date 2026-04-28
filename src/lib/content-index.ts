/**
 * Content index: reads all JSON content across every collection, builds a
 * tag-to-content map, and exposes query functions for cross-referencing.
 *
 * This runs at build time (server components, generateStaticParams, etc.)
 * and is cached per request via Next.js module-level caching.
 *
 * Usage:
 *   import { getRelatedContent, getRelatedPages } from "@/lib/content-index";
 *   const related = getRelatedContent(["grip-strength", "home-care"], "current-slug");
 */

import type { ContentTag } from "./tags";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ContentItem {
  /** Unique ID: "{collection}/{filename}" e.g. "learn/grip-strength" */
  id: string;
  /** The collection this item belongs to */
  collection: CollectionName;
  /** Filename without .json */
  slug: string;
  /** Resolved URL path */
  href: string;
  /** Page/article title */
  title: string;
  /** Short description or excerpt */
  description: string;
  /** All tags from every dimension */
  tags: string[];
  /** Category (learn articles only) */
  category?: string;
  /** Featured image path */
  image?: string;
  /** Published date (learn articles only) */
  publishedDate?: string;
  /** Read time in minutes (learn articles only) */
  readTime?: number;
}

type CollectionName =
  | "learn"
  | "solutions"
  | "segments"
  | "compare"
  | "resources"
  | "company"
  | "pages";

interface CollectionConfig {
  path: string;
  hrefPrefix: string;
  /** Override href resolution for special cases */
  hrefMap?: Record<string, string>;
}

// ── Collection registry ──────────────────────────────────────────────────────

const COLLECTIONS: Record<CollectionName, CollectionConfig> = {
  learn: {
    path: "content/learn",
    hrefPrefix: "/blog/",
  },
  solutions: {
    path: "content/solutions",
    hrefPrefix: "/solutions/",
  },
  segments: {
    path: "content/segments",
    hrefPrefix: "/",
  },
  compare: {
    path: "content/compare",
    hrefPrefix: "/compare/",
  },
  resources: {
    path: "content/resources",
    hrefPrefix: "/resources/",
  },
  company: {
    path: "content/company",
    hrefPrefix: "/",
    hrefMap: {
      about: "/about/",
      "meet-the-team": "/meet-the-team/",
      customers: "/customers/",
      partners: "/partners/",
      news: "/news/",
      contact: "/contact/",
      demo: "/demo/",
    },
  },
  pages: {
    path: "content/pages",
    hrefPrefix: "/",
    hrefMap: { homepage: "/" },
  },
};

// ── Index builder ────────────────────────────────────────────────────────────

let _cache: ContentItem[] | null = null;

function resolveHref(
  collection: CollectionName,
  slug: string,
  config: CollectionConfig
): string {
  if (config.hrefMap?.[slug]) return config.hrefMap[slug];
  return `${config.hrefPrefix}${slug}/`;
}

function buildIndex(): ContentItem[] {
  if (_cache) return _cache;

  /* eslint-disable @typescript-eslint/no-require-imports */
  const fs = require("fs");
  const path = require("path");
  /* eslint-enable @typescript-eslint/no-require-imports */

  const items: ContentItem[] = [];

  for (const [collectionName, config] of Object.entries(COLLECTIONS)) {
    const dir = path.join(process.cwd(), config.path);

    let files: string[];
    try {
      files = fs
        .readdirSync(dir)
        .filter((f: string) => f.endsWith(".json"));
    } catch {
      continue; // directory doesn't exist yet
    }

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const data = JSON.parse(raw);
        const slug = file.replace(".json", "");

        items.push({
          id: `${collectionName}/${slug}`,
          collection: collectionName as CollectionName,
          slug,
          href: resolveHref(
            collectionName as CollectionName,
            slug,
            config
          ),
          title: data.title || slug,
          description: data.description || data.excerpt || "",
          tags: data.tags || [],
          category: data.category,
          image: data.image || data.featuredImage,
          publishedDate: data.publishedDate,
          readTime: data.readTime,
        });
      } catch {
        continue; // skip unparseable files
      }
    }
  }

  _cache = items;
  return items;
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Get every content item in the index. */
export function getAllContent(): ContentItem[] {
  return buildIndex();
}

/** Get all items in a specific collection. */
export function getCollectionItems(collection: CollectionName): ContentItem[] {
  return buildIndex().filter((item) => item.collection === collection);
}

/** Get all items that carry a specific tag. */
export function getContentByTag(tag: string): ContentItem[] {
  return buildIndex().filter((item) => item.tags.includes(tag));
}

/** Get all items that match ANY of the given tags. */
export function getContentByAnyTag(tags: string[]): ContentItem[] {
  if (tags.length === 0) return [];
  const tagSet = new Set(tags);
  return buildIndex().filter((item) =>
    item.tags.some((t) => tagSet.has(t))
  );
}

/**
 * Get related content, ranked by number of shared tags.
 * Excludes the item itself (matched by slug).
 * Optionally filter to specific collections.
 */
export function getRelatedContent(
  tags: string[],
  excludeSlug: string,
  options?: {
    collections?: CollectionName[];
    limit?: number;
  }
): ContentItem[] {
  if (tags.length === 0) return [];

  const tagSet = new Set(tags);
  const limit = options?.limit ?? 6;
  const collections = options?.collections
    ? new Set(options.collections)
    : null;

  return buildIndex()
    .filter((item) => {
      if (item.slug === excludeSlug) return false;
      if (collections && !collections.has(item.collection)) return false;
      return item.tags.some((t) => tagSet.has(t));
    })
    .map((item) => ({
      item,
      score: item.tags.filter((t) => tagSet.has(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}

/**
 * Get pages (segments, solutions, compare, resources) relevant to the
 * given tags, excluding the current slug. Used by the relatedPages block.
 */
export function getRelatedPages(
  tags: string[],
  excludeSlug: string,
  limit = 6
): ContentItem[] {
  return getRelatedContent(tags, excludeSlug, {
    collections: ["solutions", "segments", "compare", "resources"],
    limit,
  });
}

/**
 * Get all unique tags currently in use across all content.
 * Useful for rendering tag clouds or filter UIs.
 */
export function getActiveTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of buildIndex()) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Invalidate the in-memory cache. Call this if content changes at runtime
 * (e.g. Tina CMS webhook triggers ISR revalidation).
 */
export function invalidateIndex(): void {
  _cache = null;
}
