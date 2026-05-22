"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

interface ArticleBodyProps {
  query: string;
  variables: Record<string, any>;
  data: any;
  collectionKey: string;
}

// See EditorialPageClient for why an empty query is rendered without useTina.
export function ArticleBody(props: ArticleBodyProps) {
  if (!props.query) return <ArticleBodyView data={props.data} collectionKey={props.collectionKey} />;
  return <ArticleBodyLive {...props} />;
}

function ArticleBodyLive({ query, variables, data: initialData, collectionKey }: ArticleBodyProps) {
  const { data } = useTina({ query, variables, data: initialData });
  return <ArticleBodyView data={data} collectionKey={collectionKey} />;
}

function ArticleBodyView({ data, collectionKey }: { data: any; collectionKey: string }) {
  const article = data?.[collectionKey];
  if (!article?.body) return null;
  return (
    <div className="article-prose">
      <TinaMarkdown content={article.body} />
    </div>
  );
}
