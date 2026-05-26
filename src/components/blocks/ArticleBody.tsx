"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import MarkdownIt from "markdown-it";
import { useMemo } from "react";

interface ArticleBodyProps {
  query: string;
  variables: Record<string, any>;
  data: any;
  collectionKey: string;
}

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

/**
 * Detect whether a body field came back as a plain markdown string.
 *
 * Two ways this can happen even though the schema declares `body` as rich-text:
 *  - Local dev without the Tina sidecar reads JSON straight from disk and the
 *    `body` field is still the legacy markdown string.
 *  - Tina Cloud occasionally returns the field as an unparsed string when its
 *    cached schema for a collection drifts (e.g. after a schema change). The
 *    AST safety net in tina-client.ts uses Tina's strict MDX parser, which
 *    wraps standard markdown in `invalid_markdown` nodes — TinaMarkdown then
 *    renders those as <pre> blocks. This util catches both cases.
 */
function getStringBody(body: any): string | null {
  if (typeof body === "string") return body;
  // AST shape from parseMDX falling back to invalid_markdown wrapping.
  if (
    body &&
    typeof body === "object" &&
    Array.isArray(body.children) &&
    body.children.length === 1 &&
    body.children[0]?.type === "invalid_markdown" &&
    typeof body.children[0]?.value === "string"
  ) {
    return body.children[0].value;
  }
  return null;
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
  const body = article?.body;
  const stringBody = useMemo(() => getStringBody(body), [body]);
  const html = useMemo(() => (stringBody ? md.render(stringBody) : null), [stringBody]);

  if (!body) return null;

  if (html) {
    return (
      <div className="article-prose">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

  return (
    <div className="article-prose">
      <TinaMarkdown content={body} />
    </div>
  );
}
