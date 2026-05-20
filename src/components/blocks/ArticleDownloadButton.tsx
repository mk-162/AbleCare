import Link from "next/link";

interface ArticleDownloadButtonProps {
  href: string;
  label?: string;
}

function filenameFromPath(path: string): string {
  const last = path.split("/").pop() || path;
  return last.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ");
}

export function ArticleDownloadButton({ href, label }: ArticleDownloadButtonProps) {
  const displayName = filenameFromPath(href);
  return (
    <div className="my-8 rounded-2xl border border-ac-blue/15 bg-gradient-to-br from-ac-blue/5 to-ac-aqua/5 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-start gap-4 min-w-0">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-ac-blue/10 text-ac-blue flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-ac-blue mb-1">PDF Resource</p>
          <p className="text-sm md:text-base font-bold text-ac-black leading-snug truncate">{displayName}</p>
          <p className="text-xs text-ac-black/60 font-light mt-0.5">Save or share this guide</p>
        </div>
      </div>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ac-blue text-white text-sm font-bold hover:bg-ac-aqua transition-colors"
      >
        {label || "Download PDF"}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
      </Link>
    </div>
  );
}
