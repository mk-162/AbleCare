import fs from "fs";
import path from "path";

export type SearchScope = "blog" | "all";

export interface SearchDoc {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  type: "blog";
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

  return docs;
}
