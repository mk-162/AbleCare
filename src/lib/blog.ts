export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedDate: string;
  readTime: number;
  image?: string;
  featured?: boolean;
  author?: string;
}

export interface CategoryCount {
  name: string;
  slug: string;
  count: number;
}

export function slugifyCategory(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function unslugifyCategory(slug: string): string | null {
  const map: Record<string, string> = {};
  const articles = getArticles();
  for (const a of articles) {
    if (a.category) {
      map[slugifyCategory(a.category)] = a.category;
    }
  }
  return map[slug] || null;
}

export function getArticles(): BlogArticle[] {
  try {
    const fs = require("fs");
    const path = require("path");
    const dir = path.join(process.cwd(), "content/learn");
    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
    return files
      .map((f: string) => {
        const raw = fs.readFileSync(path.join(dir, f), "utf-8");
        const data = JSON.parse(raw);
        return {
          slug: f.replace(".json", ""),
          title: data.title || "",
          excerpt: data.excerpt || "",
          category: data.category || "",
          publishedDate: data.publishedDate || "",
          readTime: data.readTime || 0,
          image: data.image || data.featuredImage || undefined,
          featured: data.featured || false,
          author: data.author || undefined,
        };
      })
      .sort((a: BlogArticle, b: BlogArticle) => {
        if (!a.publishedDate || !b.publishedDate) return 0;
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      });
  } catch {
    return [];
  }
}

export function getCategories(articles?: BlogArticle[]): CategoryCount[] {
  const items = articles || getArticles();
  const map = new Map<string, { name: string; count: number }>();
  for (const a of items) {
    if (!a.category) continue;
    const slug = slugifyCategory(a.category);
    const existing = map.get(slug);
    if (existing) {
      existing.count++;
    } else {
      map.set(slug, { name: a.category, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count);
}
