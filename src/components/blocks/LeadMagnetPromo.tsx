"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LeadMagnetPromoProps {
  heading?: string;
  promoBody?: string;
  ctaText?: string;
  ctaLink?: string;
  coverImage?: string;
  /** Eyebrow label above the heading. */
  eyebrow?: string;
}

/**
 * Returns true when the link points to a static file asset (PDF, DOC, etc.)
 * rather than an internal route. Used to swap <Link> for a native <a target="_blank">
 * so the browser opens the file inline in a new tab instead of navigating to it.
 */
function isStaticFile(href: string): boolean {
  return /\.(pdf|docx?|xlsx?|pptx?|zip|csv)(\?|#|$)/i.test(href);
}

export function LeadMagnetPromo({
  heading = "The Buyer's Guide to Functional Assessment",
  promoBody: body = "A 24-page comprehensive resource for evaluating, procuring, and implementing objective functional measurement in community care.",
  ctaText = "Download the guide",
  ctaLink = "/resources/buyers-guide",
  eyebrow = "Free Guide",
}: LeadMagnetPromoProps) {
  const isFile = ctaLink ? isStaticFile(ctaLink) : false;
  const button = (
    <Button size="lg" className="w-full sm:w-auto bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold px-8">
      {ctaText}
    </Button>
  );
  return (
    <section className="py-20 md:py-32 bg-ac-grey">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="text-sm font-bold uppercase tracking-widest text-ac-blue mb-4">{eyebrow}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            <p className="text-ac-black/70 font-light mb-8 text-lg">{body}</p>
            {ctaText && ctaLink && (
              isFile ? (
                <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                  {button}
                </a>
              ) : (
                <Link href={ctaLink}>{button}</Link>
              )
            )}
          </div>
          <div className="w-full md:w-1/2 bg-ac-blue p-10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ac-blue to-ac-aqua opacity-50" />
            <div className="relative z-10 w-48 h-64 bg-white shadow-2xl rounded-sm transform rotate-3 transition-transform hover:rotate-0 duration-500 flex flex-col border border-white/20">
              <div className="p-4 flex-grow border-b border-black/10">
                <div className="w-8 h-2 bg-ac-blue mb-4" />
                <div className="w-full h-3 bg-black/10 mb-2" />
                <div className="w-3/4 h-3 bg-black/10 mb-8" />
                <div className="space-y-2">
                  <div className="w-full h-2 bg-black/5" />
                  <div className="w-full h-2 bg-black/5" />
                  <div className="w-5/6 h-2 bg-black/5" />
                </div>
              </div>
              <div className="p-4 bg-ac-grey text-[8px] font-bold text-ac-black">ABLE CARE RESEARCH</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
