import Link from "next/link";
import { getPromoForTags } from "@/lib/promo-config";

const variantAccent: Record<string, string> = {
  whitepaper: "bg-ac-blue",
  tool: "bg-ac-aqua",
  landing: "bg-gradient-to-r from-ac-blue to-ac-aqua",
};

const variantBadge: Record<string, string> = {
  whitepaper: "bg-ac-blue/10 text-ac-blue",
  tool: "bg-ac-aqua/20 text-ac-black",
  landing: "bg-ac-black/5 text-ac-black",
};

interface ContextualPromoWidgetProps {
  tags: string[];
}

export function ContextualPromoWidget({ tags }: ContextualPromoWidgetProps) {
  const promo = getPromoForTags(tags);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-black/5">
      <div className={`h-1 ${variantAccent[promo.variant]}`} />
      <div className="p-5">
        <span
          className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${variantBadge[promo.variant]}`}
        >
          {promo.badge}
        </span>
        <h3 className="text-sm font-bold text-ac-black leading-snug mb-2">
          {promo.heading}
        </h3>
        <p className="text-xs text-ac-black/60 font-light leading-relaxed mb-4">
          {promo.body}
        </p>
        <Link
          href={promo.ctaLink}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ac-blue hover:text-ac-aqua transition-colors"
        >
          {promo.ctaText}
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
