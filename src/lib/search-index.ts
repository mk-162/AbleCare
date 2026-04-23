import fs from "fs";
import path from "path";

export type SearchScope = "blog" | "knowledge-base" | "all";

export interface SearchDoc {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  type: "blog" | "knowledge-base";
  url: string;
}

function readJsonDir(dir: string): Array<{ slug: string; data: Record<string, unknown> }> {
  try {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    return files.map((f) => ({
      slug: f.replace(".json", ""),
      data: JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")),
    }));
  } catch {
    return [];
  }
}

export function getSearchDocs(scope: SearchScope = "all"): SearchDoc[] {
  const docs: SearchDoc[] = [];

  if (scope === "blog" || scope === "all") {
    const entries = readJsonDir(path.join(process.cwd(), "content/learn"));
    for (const { slug, data } of entries) {
      docs.push({
        id: `blog:${slug}`,
        slug,
        title: String(data.title ?? ""),
        excerpt: String(data.excerpt ?? data.description ?? ""),
        category: String(data.category ?? ""),
        type: "blog",
        url: `/blog/${slug}`,
      });
    }
  }

  if (scope === "knowledge-base" || scope === "all") {
    const entries = readJsonDir(path.join(process.cwd(), "content/knowledge-base"));
    for (const { slug, data } of entries) {
      docs.push({
        id: `kb:${slug}`,
        slug,
        title: String(data.title ?? ""),
        excerpt: String(data.description ?? ""),
        category: String(data.category ?? ""),
        type: "knowledge-base",
        url: `/knowledge-base/${slug}`,
      });
    }
  }

  return docs;
}
