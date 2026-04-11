"use client";

import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { BlockRenderer } from "./BlockRenderer";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EditorialPageClientProps {
  query: string;
  variables: Record<string, any>;
  data: any;
}

export function EditorialPageClient({ query, variables, data: initialData }: EditorialPageClientProps) {
  const tinaResult = useTina({ query: query || "", variables, data: initialData });
  const data = tinaResult.data;

  // Navigate the data object to find the first collection result
  const collectionKey = Object.keys(data).find(
    (k) => k !== "__typename" && data[k]
  );
  const page = collectionKey ? data[collectionKey] : null;
  const blocks = page?.blocks || [];

  // Markdown utility pages have a body field instead of blocks
  if (blocks.length === 0 && page?.body) {
    return (
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {page.title && (
            <h1 className="text-4xl md:text-5xl font-bold text-ac-black mb-8">
              {page.title}
            </h1>
          )}
          <div className="article-prose">
            <TinaMarkdown content={page.body} />
          </div>
        </div>
      </article>
    );
  }

  return <BlockRenderer blocks={blocks} />;
}
