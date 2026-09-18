/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The client-safe half of block resolution.
 *
 * This lives in its own module rather than alongside `resolveBlocks` because
 * resolve-blocks.ts pulls in the filesystem-backed content index, which cannot
 * be bundled into a client component. Live-preview renderers import from here;
 * server templates import `resolveBlocks`, which layers the filesystem lookups
 * on top of these helpers.
 */

function deriveTemplateFromTypename(typename: unknown): string | null {
  if (typeof typename !== "string" || !typename) return null;
  const stripped = typename.replace(/^.*Blocks/, "");
  return stripped ? stripped.charAt(0).toLowerCase() + stripped.slice(1) : null;
}

/** The block's template name, whether it came from Tina or from disk. */
export function blockTemplate(block: any): string | null {
  return block?._template ?? deriveTemplateFromTypename(block?.__typename);
}

/**
 * Give every block the `__typename` that BlockRenderer dispatches on.
 *
 * Pure — no filesystem, no content index — so it is safe on both sides of the
 * server/client boundary.
 */
export function normalizeBlockTypenames(
  blocks: any[],
  collectionPrefix: string
): any[] {
  if (!blocks) return [];

  return blocks.map((block: any) => {
    const template = blockTemplate(block);
    if (!template) return block;
    return {
      ...block,
      __typename: `${collectionPrefix}Blocks${template.charAt(0).toUpperCase() + template.slice(1)}`,
    };
  });
}

/**
 * Carry the server's `relatedPages` results onto live-edited blocks.
 *
 * `_resolvedItems` comes from the filesystem-backed content index, which only
 * exists on the server. Without this, the related-pages list would empty out
 * the moment an editor touched any field in the Tina sidebar. Matching by
 * position is deliberate and good enough: reordering or inserting blocks just
 * means a related-pages list renders empty until the next save and reload,
 * which is also when the index would be re-queried anyway.
 */
export function withServerResolvedItems(
  liveBlocks: any[],
  serverBlocks: any[]
): any[] {
  if (!liveBlocks) return [];

  return liveBlocks.map((block: any, i: number) => {
    if (block?._resolvedItems || !serverBlocks?.[i]?._resolvedItems) return block;
    return { ...block, _resolvedItems: serverBlocks[i]._resolvedItems };
  });
}
