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

export function ArticleBody({ query, variables, data: initialData, collectionKey }: ArticleBodyProps) {
  const { data } = useTina({ query: query || "", variables, data: initialData });
  const article = data?.[collectionKey];

  if (!article?.body) return null;

  return (
    <div className="article-prose">
      <TinaMarkdown content={article.body} />
    </div>
  );
}
