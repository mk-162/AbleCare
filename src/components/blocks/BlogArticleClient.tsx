"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTina, tinaField } from "tinacms/dist/react";
import { BlockRenderer } from "./BlockRenderer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArticleBody } from "./ArticleBody";
import { ArticleDownloadButton } from "./ArticleDownloadButton";
import { ArticleFooterCta } from "./ArticleFooterCta";
import { slugifyCategory } from "@/lib/category-slug";
import {
  normalizeBlockTypenames,
  withServerResolvedItems,
} from "@/lib/normalize-blocks";

interface BlogArticleClientProps {
  query: string;
  variables: Record<string, any>;
  data: any;
  collectionKey: string;
  slug: string;
  /** Server-resolved blocks, used to keep relatedPages results across live edits. */
  serverBlocks: any[];
  /** Rendered on the server (it reads the filesystem), passed through as a slot. */
  sidebar: ReactNode;
}

/**
 * Live-editable blog article.
 *
 * This owns the ONE `useTina` subscription for the whole document. Everything
 * an editor can change from the Tina sidebar — featured image, title, excerpt,
 * category, author, date, read time, body, blocks — renders from that live
 * data, so the preview pane tracks the form.
 *
 * Do not add a second `useTina` further down this tree: each call registers a
 * form keyed on (query, variables), so a duplicate would put two identical
 * forms in the sidebar.
 */
export function BlogArticleClient(props: BlogArticleClientProps) {
  // The filesystem fallback in tina-client.ts returns query="" because there is
  // no GraphQL query to subscribe to. Forwarding that empty string to useTina
  // makes the admin iframe post an empty query to TinaCloud, which the GraphQL
  // parser rejects with "Syntax Error: Unexpected <EOF>" — the "Unexpected
  // error querying content" modal in the visual editor. Render static instead.
  if (!props.query) return <BlogArticleView {...props} />;
  return <BlogArticleLive {...props} />;
}

function BlogArticleLive({
  query,
  variables,
  data: initialData,
  ...rest
}: BlogArticleClientProps) {
  const { data } = useTina({ query, variables, data: initialData });
  return <BlogArticleView {...rest} query={query} variables={variables} data={data} />;
}

/**
 * Field reference for Tina's click-to-edit overlays.
 *
 * `tinaField()` reads the metadata Tina attaches to documents it resolved. The
 * filesystem fallback path has none, so return undefined rather than let
 * tinacms warn once per field on every non-Tina render.
 */
function fieldRef(obj: any, name: string): string | undefined {
  if (!obj?._content_source) return undefined;
  return tinaField(obj, name as any);
}

function BlogArticleView({
  data,
  collectionKey,
  slug,
  serverBlocks,
  sidebar,
}: BlogArticleClientProps) {
  const article = data?.[collectionKey] ?? {};

  const title: string = article.title ?? "";
  const featuredImage: string | undefined = article.image;
  const category: string | undefined = article.category;
  const categorySlug = category ? slugifyCategory(category) : null;

  const liveBlocks = article.blocks
    ? withServerResolvedItems(
        normalizeBlockTypenames(article.blocks, "Learn"),
        serverBlocks
      )
    : [];

  const breadcrumbTitle = title.length > 40 ? title.slice(0, 40) + "…" : title;

  return (
    <article className="pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              ...(category && categorySlug
                ? [{ label: category, href: `/blog/category/${categorySlug}` }]
                : []),
              { label: breadcrumbTitle },
            ]}
          />

          {/* Category + Title */}
          <div className="mb-8 max-w-3xl">
            {category && categorySlug && (
              <Link
                href={`/blog/category/${categorySlug}`}
                data-tina-field={fieldRef(article, "category")}
                className="text-xs font-bold uppercase tracking-widest text-ac-blue mb-4 block hover:text-ac-aqua transition-colors"
              >
                {category}
              </Link>
            )}
            <h1
              data-tina-field={fieldRef(article, "title")}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-ac-black leading-tight"
            >
              {title}
            </h1>
          </div>

          {/* Split: Featured image (left) + Excerpt & meta (right) */}
          <div className="flex flex-col md:flex-row gap-8 mb-12 max-w-5xl">
            <div className="w-full md:w-1/2">
              <div
                data-tina-field={fieldRef(article, "image")}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-ac-blue/10 to-ac-aqua/10"
              >
                {featuredImage ? (
                  <Image
                    // Keyed on the path so swapping the image in Tina remounts
                    // the element instead of showing the previous file.
                    key={featuredImage}
                    src={featuredImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-ac-blue/10 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-ac-blue/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              {article.excerpt && (
                <p
                  data-tina-field={fieldRef(article, "excerpt")}
                  className="text-lg md:text-xl text-ac-black/70 font-light leading-relaxed mb-6"
                >
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-ac-black/50 border-t border-black/10 pt-6">
                {article.author && (
                  <span
                    data-tina-field={fieldRef(article, "author")}
                    className="font-medium text-ac-black"
                  >
                    {article.author}
                  </span>
                )}
                {article.publishedDate && (
                  <span data-tina-field={fieldRef(article, "publishedDate")}>
                    {article.publishedDate}
                  </span>
                )}
                {article.readTime && (
                  <span data-tina-field={fieldRef(article, "readTime")}>
                    {article.readTime} min read
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column: Article body + Right rail */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Main content — rich-text body. Blocks render full-width below. */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {article.downloadPdf && (
              <ArticleDownloadButton
                href={article.downloadPdf}
                label={article.downloadPdfLabel}
              />
            )}

            <ArticleBody article={article} tinaField={fieldRef(article, "body")} />

            {/* Article footer CTA */}
            <ArticleFooterCta />
          </div>

          {/* Sidebar with categories + lead magnets */}
          {sidebar}
        </div>
      </div>

      {liveBlocks.length > 0 && (
        <BlockRenderer
          blocks={liveBlocks}
          pageTags={article.tags}
          pageSlug={slug}
        />
      )}
    </article>
  );
}
