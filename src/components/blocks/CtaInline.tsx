"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CtaInlineProps {
  heading?: string;
  bodyText?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export function CtaInline({
  heading = "Ready to see the numbers?",
  bodyText,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: CtaInlineProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-ac-blue/5 border border-ac-blue/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-ac-black mb-2">{heading}</h3>
            {bodyText && <p className="text-ac-black/70 font-light">{bodyText}</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            {primaryCtaText && primaryCtaLink && (
              <Link href={primaryCtaLink}>
                <Button className="bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold px-6">
                  {primaryCtaText}
                </Button>
              </Link>
            )}
            {secondaryCtaText && secondaryCtaLink && (
              <Link href={secondaryCtaLink}>
                <Button variant="outline" className="rounded-full font-bold px-6 border-ac-blue/30 text-ac-blue">
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
