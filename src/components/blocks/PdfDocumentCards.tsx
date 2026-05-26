"use client";

import { getSchemeClasses, type ColorScheme } from "@/lib/color-schemes";

type Accent = "blue" | "aqua" | "indigo" | "graphite";

interface PdfDocumentItem {
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink: string;
  pdfLabel?: string;
  accent?: Accent;
  category?: string;
}

interface PdfDocumentCardsProps {
  scheme?: ColorScheme;
  eyebrow?: string;
  heading?: string;
  subtitle?: string;
  columnCount?: 2 | 3;
  items?: PdfDocumentItem[];
}

const ACCENT_STYLES: Record<Accent, { band: string; ribbon: string; chipBg: string; chipText: string; dot: string }> = {
  blue: {
    band: "bg-ac-blue",
    ribbon: "bg-gradient-to-br from-ac-blue via-ac-blue to-[#0d1faa]",
    chipBg: "bg-ac-blue/10",
    chipText: "text-ac-blue",
    dot: "bg-ac-blue",
  },
  aqua: {
    band: "bg-ac-aqua",
    ribbon: "bg-gradient-to-br from-ac-aqua via-[#3df0c8] to-ac-blue",
    chipBg: "bg-ac-aqua/20",
    chipText: "text-ac-black",
    dot: "bg-ac-aqua",
  },
  indigo: {
    band: "bg-[#2A1A6A]",
    ribbon: "bg-gradient-to-br from-[#2A1A6A] via-ac-blue to-[#0d1faa]",
    chipBg: "bg-[#2A1A6A]/10",
    chipText: "text-[#2A1A6A]",
    dot: "bg-[#2A1A6A]",
  },
  graphite: {
    band: "bg-ac-black",
    ribbon: "bg-gradient-to-br from-ac-black via-[#333] to-ac-black",
    chipBg: "bg-ac-black/10",
    chipText: "text-ac-black",
    dot: "bg-ac-black",
  },
};

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function isPdf(href: string): boolean {
  return /\.pdf(\?|#|$)/i.test(href);
}

export function PdfDocumentCards({
  scheme = "light",
  eyebrow,
  heading,
  subtitle,
  columnCount = 2,
  items,
}: PdfDocumentCardsProps) {
  if (!items || items.length === 0) return null;

  const gridCols = columnCount === 3
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-1 md:grid-cols-2";

  const isDark = scheme === "blue" || scheme === "aqua";
  const subtitleColor = isDark ? (scheme === "aqua" ? "text-ac-black/70" : "text-white/80") : "text-ac-black/65";
  const eyebrowColor = isDark
    ? scheme === "aqua"
      ? "text-ac-black/70"
      : "text-ac-aqua"
    : "text-ac-blue";

  return (
    <section className={`py-20 md:py-28 ${getSchemeClasses(scheme)}`}>
      <div className="container mx-auto px-4 md:px-6">
        {(eyebrow || heading || subtitle) && (
          <div className="max-w-3xl mb-12 md:mb-16">
            {eyebrow && (
              <div className={`text-xs md:text-sm font-bold uppercase tracking-[0.18em] mb-3 ${eyebrowColor}`}>
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {heading}
              </h2>
            )}
            {subtitle && (
              <p className={`mt-4 text-base md:text-lg font-light leading-relaxed ${subtitleColor}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridCols} gap-6 md:gap-8`}>
          {items.map((item, i) => (
            <PdfCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PdfCard({ item }: { item: PdfDocumentItem }) {
  const accent = item.accent || "blue";
  const styles = ACCENT_STYLES[accent];
  const ctaText = item.ctaText || "Open PDF";
  const external = isExternal(item.ctaLink);
  const pdf = isPdf(item.ctaLink);
  const openInNew = external || pdf;

  return (
    <a
      href={item.ctaLink}
      target={openInNew ? "_blank" : undefined}
      rel={openInNew ? "noopener noreferrer" : undefined}
      className="group relative flex flex-col bg-white rounded-3xl border border-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_10px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300"
    >
      <DocumentMockup item={item} accent={accent} />

      <div className="p-6 md:p-7 flex flex-col grow">
        {item.category && (
          <span className={`inline-flex self-start items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full mb-3 ${styles.chipBg} ${styles.chipText}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
            {item.category}
          </span>
        )}
        <h3 className="text-lg md:text-xl font-bold text-ac-black leading-snug mb-2">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm text-ac-black/60 font-light leading-relaxed mb-5">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-ac-blue group-hover:text-ac-aqua transition-colors">
            {ctaText}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          {item.pdfLabel && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-ac-black/40">
              {item.pdfLabel}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

function DocumentMockup({ item, accent }: { item: PdfDocumentItem; accent: Accent }) {
  const styles = ACCENT_STYLES[accent];
  const titleWords = item.title.split(/\s+/);
  const previewTitle = titleWords.length > 4 ? titleWords.slice(0, 4).join(" ") + "…" : item.title;
  const showPdfFlag = isPdf(item.ctaLink);

  return (
    <div className="relative h-[230px] md:h-[260px] overflow-hidden bg-gradient-to-br from-[#f4f6fb] via-[#eef1f8] to-[#dfe5f3]">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,50,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,50,255,0.04) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Back document (peeking behind) */}
      <div
        aria-hidden="true"
        className="absolute left-[28%] top-[14%] w-[58%] h-[80%] bg-white rounded-sm shadow-[0_8px_20px_rgba(20,30,80,0.10)] rotate-[7deg] origin-bottom-left border border-black/5"
      />

      {/* Front document */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[62%] h-[88%] bg-white rounded-sm shadow-[0_12px_28px_rgba(20,30,80,0.15)] rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500 ease-out border border-black/5 flex flex-col overflow-hidden">
        {/* Letterhead band */}
        <div className={`h-[26%] ${styles.ribbon} relative overflow-hidden`}>
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-white/90" />
              <div className="text-[6px] font-black uppercase tracking-[0.2em] text-white/90">Able Care</div>
            </div>
            {showPdfFlag && (
              <div className="text-[5px] font-bold uppercase tracking-widest text-white/70">PDF</div>
            )}
          </div>
          {/* Decorative wave */}
          <svg className="absolute bottom-0 left-0 w-full text-white/15" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,5 Q25,9 50,5 T100,5 L100,10 L0,10 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Body */}
        <div className="px-2.5 pt-2 pb-2 flex-1 flex flex-col gap-1">
          {/* Document title */}
          <div className="text-[6.5px] font-bold leading-tight text-ac-black/85 line-clamp-2">
            {previewTitle}
          </div>
          <div className={`w-6 h-[2px] rounded-full mt-0.5 ${styles.dot}`} />

          {/* Faux text lines */}
          <div className="mt-1.5 space-y-[3px]">
            {[100, 92, 96, 78, 90, 88, 70].map((w, idx) => (
              <div
                key={idx}
                className="h-[2px] rounded-full bg-ac-black/10"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>

          {/* Faux figure / pull-quote block */}
          <div className="mt-1.5 rounded-[2px] bg-ac-black/[0.04] flex-1 flex items-center justify-center">
            <div className="flex gap-0.5 items-end h-3">
              <div className={`w-1 h-1.5 rounded-sm ${styles.dot} opacity-70`} />
              <div className={`w-1 h-2.5 rounded-sm ${styles.dot}`} />
              <div className={`w-1 h-2 rounded-sm ${styles.dot} opacity-80`} />
              <div className={`w-1 h-3 rounded-sm ${styles.dot}`} />
            </div>
          </div>

          {/* Footer with page count */}
          <div className="flex items-center justify-between mt-1">
            <div className="text-[5px] font-bold uppercase tracking-widest text-ac-black/35">
              Able Care
            </div>
            <div className="text-[5px] font-bold text-ac-black/35">01</div>
          </div>
        </div>

        {/* Page corner fold */}
        <div className="absolute top-0 right-0 w-3 h-3" aria-hidden="true">
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-l-[12px] border-t-white border-l-transparent" />
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-l-[12px] border-t-black/10 border-l-transparent translate-x-[0.5px] -translate-y-[0.5px]" />
        </div>
      </div>

      {/* Floating format badge — PDF for downloads, Web for external links */}
      <div className="absolute bottom-3 right-3 bg-white rounded-full pl-2 pr-3 py-1 flex items-center gap-1.5 shadow-md border border-black/5">
        {showPdfFlag ? (
          <>
            <svg className="w-3.5 h-3.5 text-ac-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ac-black/70">PDF</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 text-ac-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14L21 3m0 0h-7m7 0v7M5 21h10a2 2 0 002-2v-5M3 5a2 2 0 012-2h5" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ac-black/70">Web</span>
          </>
        )}
      </div>
    </div>
  );
}
