"use client";

import { getSchemeClasses, type ColorScheme } from "@/lib/color-schemes";

type Accent = "blue" | "aqua" | "indigo" | "graphite";

interface AppItem {
  name: string;
  category?: string;
  description?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  accent?: Accent;
}

interface AppDownloadCardsProps {
  scheme?: ColorScheme;
  eyebrow?: string;
  heading?: string;
  subtitle?: string;
  apps?: AppItem[];
}

const ACCENT_STYLES: Record<Accent, { tile: string; chipBg: string; chipText: string }> = {
  blue: {
    tile: "bg-gradient-to-br from-ac-blue via-ac-blue to-[#0d1faa]",
    chipBg: "bg-ac-blue/10",
    chipText: "text-ac-blue",
  },
  aqua: {
    tile: "bg-gradient-to-br from-ac-aqua via-[#3df0c8] to-ac-blue",
    chipBg: "bg-ac-aqua/20",
    chipText: "text-ac-black",
  },
  indigo: {
    tile: "bg-gradient-to-br from-[#2A1A6A] via-ac-blue to-[#0d1faa]",
    chipBg: "bg-[#2A1A6A]/10",
    chipText: "text-[#2A1A6A]",
  },
  graphite: {
    tile: "bg-gradient-to-br from-ac-black via-[#333] to-ac-black",
    chipBg: "bg-ac-black/10",
    chipText: "text-ac-black",
  },
};

// Apple logo + Google Play triangle, drawn as single monochrome paths so the
// badges stay self-contained (no external badge image assets to ship).
const APPLE_PATH =
  "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z";
const GOOGLE_PLAY_PATH =
  "M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z";

export function AppDownloadCards({
  scheme = "light",
  eyebrow,
  heading,
  subtitle,
  apps,
}: AppDownloadCardsProps) {
  if (!apps || apps.length === 0) return null;

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {apps.map((app, i) => (
            <AppCard key={i} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppCard({ app }: { app: AppItem }) {
  const accent = app.accent || "blue";
  const styles = ACCENT_STYLES[accent];

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-6 md:p-8 hover:shadow-[0_10px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-4 md:gap-5">
        <div
          className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.375rem] ${styles.tile} flex items-center justify-center shadow-[0_8px_20px_rgba(20,30,80,0.18)] group-hover:scale-[1.04] transition-transform duration-300`}
        >
          <DeviceGlyph />
        </div>
        <div className="min-w-0 pt-1">
          {app.category && (
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full mb-2 ${styles.chipBg} ${styles.chipText}`}>
              {app.category}
            </span>
          )}
          <h3 className="text-xl md:text-2xl font-bold text-ac-black leading-snug">
            {app.name}
          </h3>
        </div>
      </div>

      {app.description && (
        <p className="mt-5 text-sm md:text-[15px] text-ac-black/60 font-light leading-relaxed">
          {app.description}
        </p>
      )}

      <div className="mt-auto pt-7 flex flex-col sm:flex-row gap-3">
        {app.appStoreUrl && <StoreButton href={app.appStoreUrl} kind="ios" />}
        {app.googlePlayUrl && <StoreButton href={app.googlePlayUrl} kind="android" />}
      </div>
    </div>
  );
}

function StoreButton({ href, kind }: { href: string; kind: "ios" | "android" }) {
  const isIos = kind === "ios";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={isIos ? "Download on the App Store" : "Get it on Google Play"}
      className="flex flex-1 items-center justify-center gap-2.5 bg-ac-black text-white px-4 py-3 rounded-xl border border-white/10 hover:bg-black hover:shadow-lg transition-all"
    >
      <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={isIos ? APPLE_PATH : GOOGLE_PLAY_PATH} />
      </svg>
      <span className="text-left">
        <span className="block text-[9px] font-light tracking-wide text-white/75 leading-none mb-0.5">
          {isIos ? "Download on the" : "Get it on"}
        </span>
        <span className="block text-sm font-bold leading-none">
          {isIos ? "App Store" : "Google Play"}
        </span>
      </span>
    </a>
  );
}

function DeviceGlyph() {
  return (
    <svg
      className="w-8 h-8 md:w-9 md:h-9 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <path d="M7.4 13.1h2.3l1.3-3.1 1.9 5.2 1.2-2.9h1.5" />
    </svg>
  );
}
