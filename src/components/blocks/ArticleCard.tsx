import Link from "next/link";
import type { BlogArticle } from "@/lib/blog";

/**
 * Horizontal blog card — image on the left, title + teaser on the right.
 * Mirrors the featured hero card on the blog index so every article card
 * shares the same two-column format. The wide image column lets rectangular
 * source images sit in a natural rectangle instead of a cropped letterbox.
 */
export function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link href={`/blog/${article.slug}`} className="block group">
      <article className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-lg hover:border-ac-blue/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-56 md:h-auto relative overflow-hidden">
            {article.image ? (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
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
