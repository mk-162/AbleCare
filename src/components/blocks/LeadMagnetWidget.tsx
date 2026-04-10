import Image from "next/image";
import Link from "next/link";

interface LeadMagnetWidgetProps {
  image?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink: string;
  variant?: "whitepaper" | "tool" | "landing";
}

const variantStyles = {
  whitepaper: {
    accent: "bg-ac-blue",
    badge: "White Paper",
    badgeColor: "bg-ac-blue/10 text-ac-blue",
  },
  tool: {
    accent: "bg-ac-aqua",
    badge: "Free Tool",
    badgeColor: "bg-ac-aqua/20 text-ac-black",
  },
  landing: {
    accent: "bg-gradient-to-r from-ac-blue to-ac-aqua",
    badge: "Featured",
    badgeColor: "bg-ac-black/5 text-ac-black",
  },
};

export function LeadMagnetWidget({
  image,
  title,
  description,
  ctaText = "Learn More",
  ctaLink,
  variant = "whitepaper",
}: LeadMagnetWidgetProps) {
  const style = variantStyles[variant];

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-black/5">
      {/* Accent bar */}
      <div className={`h-1 ${style.accent}`} />

      {image && (
        <div className="relative aspect-[16/9] bg-ac-grey/20">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-5">
        <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${style.badgeColor}`}>
          {style.badge}
        </span>
        <h3 className="text-sm font-bold text-ac-black leading-snug mb-2">{title}</h3>
        <p className="text-xs text-ac-black/60 font-light leading-relaxed mb-4">{description}</p>
        <Link
          href={ctaLink}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ac-blue hover:text-ac-aqua transition-colors"
        >
          {ctaText}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
