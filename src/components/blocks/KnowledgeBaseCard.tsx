"use client";

import { CheckCircle } from "lucide-react";

interface KnowledgeBaseCardProps {
  question?: string;
  directAnswer?: string;
  tldrBullets?: Array<{ text: string }>;
  expandedAnswer?: string;
  sources?: Array<{ title: string; url?: string; year?: string }>;
  reviewedBy?: string;
  lastReviewed?: string;
}

/**
 * The TL;DR answer card at the top of every KB article.
 * Designed for GEO: definition-first, stat-dense, with Speakable markup.
 */
export function KnowledgeBaseCard({
  question,
  directAnswer,
  tldrBullets,
  expandedAnswer,
  sources,
  reviewedBy,
  lastReviewed,
}: KnowledgeBaseCardProps) {
  if (!directAnswer) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {/* Direct answer box */}
        <div className="rounded-2xl border-2 border-ac-blue/15 bg-gradient-to-br from-ac-blue/[0.03] to-transparent p-8 md:p-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-ac-blue" />
            <span className="text-xs font-bold uppercase tracking-widest text-ac-blue">
              Quick answer
            </span>
          </div>

          <p className="text-lg md:text-xl font-medium text-ac-black leading-relaxed mb-6">
            {directAnswer}
          </p>

          {/* TL;DR bullets */}
          {tldrBullets && tldrBullets.length > 0 && (
            <ul className="space-y-3 mb-6">
              {tldrBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-ac-aqua shrink-0 mt-0.5" />
                  <span className="text-sm text-ac-black/80 font-light leading-relaxed">
                    {bullet.text}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Expanded answer */}
          {expandedAnswer && (
            <p className="text-sm text-ac-black/60 font-light leading-relaxed border-t border-black/10 pt-5 mt-5">
              {expandedAnswer}
            </p>
          )}

          {/* Sources */}
          {sources && sources.length > 0 && (
            <div className="border-t border-black/10 pt-5 mt-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ac-black/40 mb-3 block">
                Sources
              </span>
              <ul className="space-y-1">
                {sources.map((source, i) => (
                  <li key={i} className="text-xs text-ac-black/50 font-light">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-ac-blue transition-colors underline underline-offset-2"
                      >
                        {source.title}
                      </a>
                    ) : (
                      <span>{source.title}</span>
                    )}
                    {source.year && <span className="text-ac-black/30"> ({source.year})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviewer + date */}
          {(reviewedBy || lastReviewed) && (
            <div className="flex items-center gap-4 border-t border-black/10 pt-4 mt-5 text-[11px] text-ac-black/40">
              {reviewedBy && <span>Reviewed by {reviewedBy}</span>}
              {lastReviewed && <span>Last reviewed {lastReviewed}</span>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
