import Link from "next/link";

interface ArticleFooterCtaProps {
  heading?: string;
  bodyText?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
}

export function ArticleFooterCta({
  heading = "See how Able Assess fits your workflow.",
  bodyText = "Book a walkthrough with a clinician who has run it in the field.",
  primaryCtaText = "Book a demo",
  primaryCtaLink = "/demo/",
}: ArticleFooterCtaProps) {
  return (
    <aside className="mt-12 mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1432FF] to-[#0f28cc] relative">
      {/* Subtle decorative glow */}
      <div
        className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, #00FFD2, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at bottom left, #ffffff, transparent 70%)",
        }}
      />

      <div className="relative z-10 px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        {/* Text */}
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-snug">
            {heading}
          </h3>
          {bodyText && (
            <p className="text-white/75 font-light text-base">{bodyText}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          {primaryCtaText && primaryCtaLink && (
            <Link
              href={primaryCtaLink}
              className="inline-flex items-center justify-center rounded-full bg-ac-aqua text-ac-black font-bold px-7 py-3 text-sm hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              {primaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
