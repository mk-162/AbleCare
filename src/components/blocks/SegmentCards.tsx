"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSchemeClasses } from "@/lib/color-schemes";

interface SegmentCardsProps {
  scheme?: string;
  heading?: string;
  centered?: boolean;
  cards?: Array<{
    title: string;
    body?: string;
    image?: string;
    icon?: string;
    link?: string;
    linkText?: string;
    logos?: string[];
  }>;
}

export function SegmentCards({ scheme = "light", heading, centered, cards }: SegmentCardsProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <section className={`py-20 md:py-28 ${getSchemeClasses((scheme as any) || "light")}`}>
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-12">{heading}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const content = (
              <div className="group h-full rounded-2xl bg-white border border-black/5 hover:border-ac-blue/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                {card.image && (
                  <div className="relative w-full aspect-[4/3] bg-ac-grey/40 overflow-hidden">
                    <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                <h3 className={`text-xl font-bold text-ac-black mb-3${centered ? " text-center" : ""}`}>{card.title}</h3>
                {card.body && (
                  <p className="text-ac-black/70 font-light text-sm leading-relaxed mb-6 flex-grow">{card.body}</p>
                )}
                {card.link && (
                  <div className="flex items-center text-ac-blue font-medium group-hover:translate-x-2 transition-transform text-sm">
                    {card.linkText || "Learn more"} <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                )}
                {card.logos && card.logos.length > 0 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    {card.logos.map((logo, j) => (
                      <img key={j} src={logo} alt={card.title} className="h-16 w-auto object-contain" />
                    ))}
                  </div>
                )}
                </div>
              </div>
            );
            const opensInNewTab = !!card.link && (/^https?:\/\//.test(card.link) || card.link.endsWith(".pdf"));
            return card.link ? (
              opensInNewTab ? (
                <a key={i} href={card.link} target="_blank" rel="noopener noreferrer">{content}</a>
              ) : (
                <Link key={i} href={card.link}>{content}</Link>
              )
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
