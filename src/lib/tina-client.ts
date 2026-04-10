/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Tina CMS client helpers.
 *
 * The generated client (tina/__generated__/client) is created after running
 * `tinacms build`. Until then, these helpers are stubs — pages read JSON
 * directly from the filesystem instead.
 */

let client: any;
try {
  // Dynamic require so the build doesn't fail before `tinacms build` runs.
  client = require("../../tina/__generated__/client").client;
} catch {
  client = null;
}

export { client };

/**
 * Fetch a page from a Tina collection by filename.
 * Returns { query, variables, data } for use with useTina().
 */
export async function fetchPage(
  collection: string,
  filename: string
): Promise<{ query: string; variables: any; data: any }> {
  if (!client) throw new Error("Tina client not generated yet. Run `tinacms build` first.");
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
  if (!client) throw new Error("Tina client not generated yet. Run `tinacms build` first.");
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
  if (!client) throw new Error("Tina client not generated yet. Run `tinacms build` first.");
  const listQuery = `${collection}Connection`;
  const result = await (client.queries as any)[listQuery]();
  return {
    query: result.query,
    variables: result.variables,
    data: result.data,
  };
}
