/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Server-side block enrichment.
 *
 * Resolves relatedPages blocks by querying the content index and injecting
 * the results as serialisable props. Call this in page templates BEFORE
 * passing blocks to BlockRenderer.
 *
 * This module reads the filesystem (via the content index), so it is
 * server-only. The pure parts live in ./normalize-blocks, which client
 * components use for live preview.
 *
 * Usage:
 *   import { resolveBlocks } from "@/lib/resolve-blocks";
 *   const blocks = resolveBlocks(data.blocks, data.tags, slug, "Solutions");
 *   return <BlockRenderer blocks={blocks} pageTags={data.tags} pageSlug={slug} />;
 */

import { getRelatedPages } from "./content-index";
import { blockTemplate, normalizeBlockTypenames } from "./normalize-blocks";

export function resolveBlocks(
  blocks: any[],
  pageTags: string[] | undefined,
  pageSlug: string,
  collectionPrefix: string
): any[] {
  if (!blocks) return [];

  return normalizeBlockTypenames(blocks, collectionPrefix).map(
    (block: any, i: number) => {
      if (blockTemplate(blocks[i]) !== "relatedPages") return block;

      const source = blocks[i];
      const tags = source.filterTags?.length ? source.filterTags : pageTags || [];
      const limit = source.limit || 6;
      return { ...block, _resolvedItems: getRelatedPages(tags, pageSlug, limit) };
    }
  );
}
