/**
 * Server-side block enrichment.
 *
 * Resolves relatedKnowledgeBase and relatedPages blocks by querying
 * the content index and injecting the results as serialisable props.
 * Call this in page templates BEFORE passing blocks to BlockRenderer.
 *
 * Usage:
 *   import { resolveBlocks } from "@/lib/resolve-blocks";
 *   const blocks = resolveBlocks(data.blocks, data.tags, slug, "Solutions");
 *   return <BlockRenderer blocks={blocks} pageTags={data.tags} pageSlug={slug} />;
 */

import { getKBForPage, getPagesForKB } from "./content-index";

export function resolveBlocks(
  blocks: any[],
  pageTags: string[] | undefined,
  pageSlug: string,
  collectionPrefix: string
): any[] {
  if (!blocks) return [];

  return blocks.map((block: any) => {
    const template = block._template;
    const enriched = {
      ...block,
      __typename: `${collectionPrefix}Blocks${template.charAt(0).toUpperCase() + template.slice(1)}`,
    };

    if (template === "relatedKnowledgeBase") {
      const tags = block.filterTags?.length ? block.filterTags : pageTags || [];
      const limit = block.limit || 4;
      enriched._resolvedItems = getKBForPage(tags, limit);
    }

    if (template === "relatedPages") {
      const tags = block.filterTags?.length ? block.filterTags : pageTags || [];
      const limit = block.limit || 6;
      enriched._resolvedItems = getPagesForKB(tags, pageSlug, limit);
    }

    return enriched;
  });
}
