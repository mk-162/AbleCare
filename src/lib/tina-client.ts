/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Tina CMS client helpers.
 *
 * Wraps the generated client to provide a clean API for page components.
 * The generated client is created after running `tinacms dev` or `tinacms build`.
 */

import { client } from "../../tina/__generated__/client";

export { client };

/**
 * Extract the page document from a Tina GraphQL response.
 * Tina nests data under the collection key, e.g. { pages: { title, blocks, ... } }
 */
export function extractPageData(data: any): any {
  const collectionKey = Object.keys(data).find(
    (k) => k !== "__typename" && data[k]
  );
  return collectionKey ? data[collectionKey] : null;
}

/**
 * Fetch a page from a Tina collection by filename.
 * Returns { query, variables, data } for use with useTina().
 */
export async function fetchPage(
  collection: string,
  filename: string
): Promise<{ query: string; variables: any; data: any }> {
  const result = await (client.queries as any)[collection]({
    relativePath: `${filename}.json`,
  });
  return {
    query: result.query,
    variables: result.variables,
    data: result.data,
  };
}

/**
 * Fetch a markdown page by filename.
 */
export async function fetchMarkdownPage(
  collection: string,
  filename: string
): Promise<{ query: string; variables: any; data: any }> {
  const result = await (client.queries as any)[collection]({
    relativePath: `${filename}.md`,
  });
  return {
    query: result.query,
    variables: result.variables,
    data: result.data,
  };
}

/**
 * Fetch a list of documents from a collection.
 */
export async function fetchCollection(
  collection: string
): Promise<{ query: string; variables: any; data: any }> {
  const listQuery = `${collection}Connection`;
  const result = await (client.queries as any)[listQuery]();
  return {
    query: result.query,
    variables: result.variables,
    data: result.data,
  };
}
