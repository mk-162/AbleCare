/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Tina CMS client helpers.
 *
 * Always queries the Tina GraphQL client first so server payloads carry the
 * query + variables that `useTina()` needs to subscribe for live preview
 * inside the Tina admin iframe. Falls back to a direct filesystem read if the
 * client is unavailable (e.g. tinacms dev sidecar down, or generated client
 * still pointing at localhost at build time).
 */

import { client } from "../../tina/__generated__/client";
import { parseMDX } from "@tinacms/mdx";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export { client };

const CONTENT_DIR = path.join(process.cwd(), "content");

const RICH_TEXT_FIELD: any = { type: "rich-text", name: "body" };

/**
 * Convert a raw markdown string into the Plate AST that <TinaMarkdown> expects.
 *
 * The Tina sidecar does this automatically on its GraphQL response, but the
 * filesystem-fallback path used in dev (when the sidecar isn't running) and at
 * build time returns body fields as raw strings. Schema changes in Tina have
 * also been observed to re-serialize content files to strings — see memory
 * note "Tina rewrites on schema change". Normalizing here keeps article body
 * rendering resilient to both paths.
 */
function normalizeRichText(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return parseMDX(value, RICH_TEXT_FIELD, (s) => s);
  } catch {
    return { type: "root", children: [] };
  }
}

/**
 * Walk a content document and convert string rich-text fields to AST.
 *
 * Only known rich-text field names are touched. The blog ("learn") collection
 * uses `body`. Other collections store `body` as plain markup strings on some
 * blocks (e.g. the prose block), so we whitelist field names rather than
 * coercing every string-typed `body` we encounter.
 */
function normalizeArticleDoc(doc: any): any {
  if (!doc || typeof doc !== "object") return doc;
  if (typeof doc.body === "string") {
    doc.body = normalizeRichText(doc.body);
  }
  return doc;
}

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
 *
 * Article-style collections (learn) store the body as a markdown string in
 * JSON. Normalize it to the Plate AST so `<TinaMarkdown>` renders correctly
 * even when the Tina sidecar isn't proxying the GraphQL response.
 */
function readJsonFile(collection: string, filename: string): any {
  const filePath = path.join(CONTENT_DIR, collection, `${filename}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const doc = JSON.parse(raw);
  return normalizeArticleDoc(doc);
}

/**
 * Read a Markdown content file directly from the filesystem.
 *
 * Normalizes the body field (markdown content after frontmatter) into the
 * Plate AST so `<TinaMarkdown>` renders correctly.
 */
function readMarkdownFile(collection: string, filename: string): any {
  const filePath = path.join(CONTENT_DIR, collection, `${filename}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);
  return normalizeArticleDoc({
    ...frontmatter,
    body: content,
  });
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
  try {
    const result = await (client.queries as any)[collection]({
      relativePath: `${filename}.json`,
    });
    const doc = result.data?.[collection];
    if (doc) normalizeArticleDoc(doc);
    return { query: result.query, variables: result.variables, data: result.data };
  } catch {
    // Tina client unavailable — fall through to filesystem read.
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
  try {
    const result = await (client.queries as any)[collection]({
      relativePath: `${filename}.md`,
    });
    const doc = result.data?.[collection];
    if (doc) normalizeArticleDoc(doc);
    return { query: result.query, variables: result.variables, data: result.data };
  } catch {
    // Tina client unavailable — fall through to filesystem read.
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
  try {
    const listQuery = `${collection}Connection`;
    const result = await (client.queries as any)[listQuery]();
    return { query: result.query, variables: result.variables, data: result.data };
  } catch {
    // Tina client unavailable — fall through to filesystem read.
  }
  // Read all JSON files from the collection directory
  const dir = path.join(CONTENT_DIR, collection);
  const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
  const edges = files.map((f: string) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8");
    const data = normalizeArticleDoc(JSON.parse(raw));
    return { node: { ...data, _sys: { filename: f.replace(".json", "") } } };
  });
  return {
    query: "",
    variables: {},
    data: { [`${collection}Connection`]: { edges } },
  };
}
