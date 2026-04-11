import { User, ShieldCheck, Calendar, Clock, BookOpen } from "lucide-react";

interface ArticleMetaBarProps {
  author?: string;
  authorRole?: string;
  reviewer?: string;
  reviewerRole?: string;
  publishedDate?: string;
  lastReviewed?: string;
  readTime?: number;
  category?: string;
  sourceCount?: number;
}

/**
 * Metadata bar for KB articles showing author, clinical reviewer,
 * dates, and read time. Signals E-E-A-T for both SEO and GEO.
 */
export function ArticleMetaBar({
  author,
  authorRole,
  reviewer,
  reviewerRole,
  publishedDate,
  lastReviewed,
  readTime,
  category,
  sourceCount,
}: ArticleMetaBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ac-black/50 border-y border-black/10 py-5 mb-10">
      {author && (
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5" />
          <span>
            <span className="font-medium text-ac-black/70">{author}</span>
            {authorRole && <span className="text-ac-black/40"> · {authorRole}</span>}
          </span>
        </div>
      )}

      {reviewer && (
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-ac-blue/60" />
          <span>
            Reviewed by{" "}
            <span className="font-medium text-ac-black/70">{reviewer}</span>
            {reviewerRole && <span className="text-ac-black/40"> · {reviewerRole}</span>}
          </span>
        </div>
      )}

      {publishedDate && (
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(publishedDate)}</span>
        </div>
      )}

      {lastReviewed && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ac-blue/60 bg-ac-blue/5 px-2 py-0.5 rounded-full">
            Updated {formatDate(lastReviewed)}
          </span>
        </div>
      )}

      {readTime && (
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>{readTime} min read</span>
        </div>
      )}

      {sourceCount && sourceCount > 0 && (
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-ac-blue/50" />
          <span className="text-ac-black/50">{sourceCount} sources cited</span>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
