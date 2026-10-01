import Link from "next/link";
import Image from "next/image";
import type { BlogArticle } from "@/lib/blog";

/**
 * The width of the card's image column at each breakpoint, so the browser
 * picks the smallest variant that covers it. The column is half the card;
 * below lg the card is full width, from lg it shares the row with the 320px
 * sidebar and a 48px gap, inside the container's 24px side padding.
 */
const THUMBNAIL_SIZES =
  "(min-width: 1536px) 560px, (min-width: 1280px) 432px, (min-width: 1024px) 304px, (min-width: 768px) 360px, 100vw";

/**
 * Blog card image, resized by the Next image optimiser.
 *
 * Editors upload full-resolution photos through Tina (some over 5 MB), and a
 * raw <img> made every visitor download all of them at full size. This sends
 * a copy sized to the card instead, and lazy-loads cards below the fold.
 *
 * width/height are not the photo's real size. They only reserve a 4:3 box
 * until the image arrives, which stops cards jumping as lazy images load;
 * once loaded, the photo's own proportions set the card height, as before.
 */
export function ArticleThumbnail({
  src,
  alt,
  eager = false,
}: {
  src: string;
  alt: string;
  /** Above-the-fold card: load straight away, at high priority. */
  eager?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={900}
      sizes={THUMBNAIL_SIZES}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      // Tina stores local /images/... paths; anything else is served as-is
      // rather than failing the optimiser's remote-host allowlist.
      unoptimized={!src.startsWith("/")}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
}

export function ArticleCard({
  article,
  eager = false,
}: {
  article: BlogArticle;
  /** Pass for the first card on a page, which is likely the largest image in view. */
  eager?: boolean;
}) {
  return (
    <Link href={`/blog/${article.slug}`} className="block group">
      <article className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-lg hover:border-ac-blue/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-56 md:h-auto relative overflow-hidden">
            {article.image ? (
              <ArticleThumbnail src={article.image} alt={article.title} eager={eager} />
            ) : (
              <div className="w-full h-full min-h-[224px] bg-gradient-to-br from-ac-blue/10 to-ac-aqua/10" />
            )}
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            {article.category && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-ac-blue mb-3">
                {article.category}
              </span>
            )}
            <h3 className="text-lg md:text-xl font-bold text-ac-black mb-3 group-hover:text-ac-blue transition-colors leading-snug">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="text-sm text-ac-black/60 font-light mb-4 line-clamp-3">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-ac-black/40">
              {article.author && (
                <span className="font-medium text-ac-black/60">{article.author}</span>
              )}
              {article.publishedDate && <span>{article.publishedDate}</span>}
              {article.readTime > 0 && <span>{article.readTime} min read</span>}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
