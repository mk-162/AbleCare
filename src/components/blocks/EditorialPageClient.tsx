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

// Filesystem-fallback path in tina-client.ts returns query="" because there is
// no GraphQL query to subscribe to. Forwarding that empty string to useTina
// causes the admin iframe to post an empty query to TinaCloud, which the
// GraphQL parser rejects with "Syntax Error: Unexpected <EOF>" — surfacing as
// the "Unexpected error querying content" modal in the visual editor. Render
// the static data directly in that case; live preview is only meaningful when
// a real query is present anyway.
export function EditorialPageClient(props: EditorialPageClientProps) {
  if (!props.query) return <EditorialPageView data={props.data} />;
  return <EditorialPageLive {...props} />;
}

function EditorialPageLive({ query, variables, data: initialData }: EditorialPageClientProps) {
  const { data } = useTina({ query, variables, data: initialData });
  return <EditorialPageView data={data} />;
}

function EditorialPageView({ data }: { data: any }) {
  const collectionKey = Object.keys(data).find(
    (k) => k !== "__typename" && data[k]
  );
  const page = collectionKey ? data[collectionKey] : null;
  const blocks = page?.blocks || [];

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
