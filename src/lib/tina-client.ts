/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Tina CMS client helpers.
 *
 * In development (with Tina server running), uses the Tina GraphQL client.
 * In production builds (Vercel), reads JSON/MD files directly from the filesystem.
 */

import { client } from "../../tina/__generated__/client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export { client };

const CONTENT_DIR = path.join(process.cwd(), "content");

/** True when the Tina dev server is likely running (local dev). */
const useTinaClient = process.env.NODE_ENV === "development";

/**
 * Extract the page document from a Tina GraphQL response or filesystem data.
 */
export function extractPageData(data: any): any {
  const collectionKey = Object.keys(data).find(
    (k) => k !== "__typename" && data[k]
  );
  return collectionKey ? data[collectionKey] : null;
}

/**
 * Read a JSON content file directly from the filesystem.
 */
function readJsonFile(collection: string, filename: string): any {
  const filePath = path.join(CONTENT_DIR, collection, `${filename}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

/**
 * Read a Markdown content file directly from the filesystem.
 */
function readMarkdownFile(collection: string, filename: string): any {
  const filePath = path.join(CONTENT_DIR, collection, `${filename}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);
  return {
    ...frontmatter,
    body: content,
  };
}

/**
 * Wrap filesystem data in the shape that useTina / EditorialPageClient expects.
 */
function wrapData(collection: string, pageData: any): { query: string; variables: any; data: any } {
  return {
    query: "",
    variables: {},
    data: { [collection]: pageData },
  };
}

/**
 * Fetch a page from a Tina collection by filename.
 *
 * In dev, try the Tina GraphQL client first (for live preview support).
 * If the Tina sidecar isn't running or the request fails, fall back to a
 * direct filesystem read — the same path prod uses — so pages still render.
 */
export async function fetchPage(
  collection: string,
  filename: string
): Promise<{ query: string; variables: any; data: any }> {
  if (useTinaClient) {
    try {
      const result = await (client.queries as any)[collection]({
        relativePath: `${filename}.json`,
      });
      return { query: result.query, variables: result.variables, data: result.data };
    } catch {
      // Tina sidecar unavailable — fall through to filesystem read.
    }
  }
  const pageData = readJsonFile(collection, filename);
  return wrapData(collection, pageData);
}

/**
 * Fetch a markdown page by filename.
 */
export async function fetchMarkdownPage(
  collection: string,
  filename: string
): Promise<{ query: string; variables: any; data: any }> {
  if (useTinaClient) {
    try {
      const result = await (client.queries as any)[collection]({
        relativePath: `${filename}.md`,
      });
      return { query: result.query, variables: result.variables, data: result.data };
    } catch {
      // Tina sidecar unavailable — fall through to filesystem read.
    }
  }
  const pageData = readMarkdownFile(collection, filename);
  return wrapData(collection, pageData);
}

/**
 * Fetch a list of documents from a collection.
 */
export async function fetchCollection(
  collection: string
): Promise<{ query: string; variables: any; data: any }> {
  if (useTinaClient) {
    try {
      const listQuery = `${collection}Connection`;
      const result = await (client.queries as any)[listQuery]();
      return { query: result.query, variables: result.variables, data: result.data };
    } catch {
      // Tina sidecar unavailable — fall through to filesystem read.
    }
  }
  // Read all JSON files from the collection directory
  const dir = path.join(CONTENT_DIR, collection);
  const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
  const edges = files.map((f: string) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8");
    const data = JSON.parse(raw);
    return { node: { ...data, _sys: { filename: f.replace(".json", "") } } };
  });
  return {
    query: "",
    variables: {},
    data: { [`${collection}Connection`]: { edges } },
  };
}
