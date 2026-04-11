"use client";

import { TinaMarkdown } from "tinacms/dist/rich-text";
import { getSchemeClasses } from "@/lib/color-schemes";

interface RichTextProps {
  scheme?: string;
  heading?: string;
  body?: any;
}

/**
 * Extract raw HTML from a Tina rich-text AST that wraps an HTML string.
 * When JSON stores body as `"<p>hello</p>"`, Tina's rich-text field wraps it
 * into an AST where the HTML becomes literal text inside paragraph nodes.
 * This recursively extracts all text and checks if it contains HTML tags.
 */
function extractHtmlFromAst(node: any): string | null {
  if (!node) return null;
  const text = collectText(node);
  return /<[a-z][\s\S]*?>/i.test(text) ? text : null;
}

function collectText(node: any): string {
  if (typeof node === "string") return node;
  if (typeof node.text === "string") return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(collectText).join("");
  }
  return "";
}

export function RichText({ scheme = "light", heading, body }: RichTextProps) {
  if (!body) return null;

  // Determine the HTML to render
  let html: string | null = null;
  if (typeof body === "string") {
    html = body;
  } else {
    html = extractHtmlFromAst(body);
  }

  return (
    <section className={`py-16 md:py-20 ${getSchemeClasses((scheme as any) || "light")}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-ac-black mb-8">{heading}</h2>
        )}
        <div className="article-prose">
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : body?.children ? (
            <TinaMarkdown content={body} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
