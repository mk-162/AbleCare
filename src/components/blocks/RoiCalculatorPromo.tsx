"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RoiCalculatorPromoProps {
  scheme?: string;
  eyebrow?: string;
  heading?: string;
  promoBody?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function RoiCalculatorPromo({
  scheme = "aqua",
  eyebrow = "ROI Calculator",
  heading = "What would fewer falls mean for your bottom line?",
  promoBody: body = "See how reducing hospitalizations and streamlining assessments translates to significant savings across your organization.",
  ctaText = "Open the calculator",
  ctaLink = "/roi-calculator",
}: RoiCalculatorPromoProps) {
  const isBlue = scheme === "blue";
  const bgClass = isBlue ? "bg-ac-blue" : scheme === "aqua" ? "bg-ac-aqua" : scheme === "grey" ? "bg-ac-grey" : "bg-white";

  return (
    <section className={`py-20 md:py-28 ${bgClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl p-10 md:p-16 max-w-5xl mx-auto text-center relative overflow-hidden ${
            isBlue ? "bg-white/10 border border-white/20" : "bg-white shadow-xl border border-ac-aqua/30"
          }`}
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-ac-aqua/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-ac-blue/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            {eyebrow && (
              <div className={`text-xs font-bold uppercase tracking-[0.25em] mb-4 ${isBlue ? "text-ac-aqua" : "text-ac-blue"}`}>
                {eyebrow}
              </div>
            )}
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isBlue ? "text-white" : "text-ac-black"}`}>{heading}</h2>
            {body && <p className={`text-lg font-light max-w-2xl mx-auto mb-10 ${isBlue ? "text-white/80" : "text-ac-black/70"}`}>{body}</p>}
            {ctaText && ctaLink && (
              <Link href={ctaLink}>
                <Button
                  size="lg"
                  className={`rounded-full px-10 font-bold text-base h-13 ${
                    isBlue ? "bg-ac-aqua text-ac-black hover:bg-white hover:text-ac-black" : "bg-ac-blue hover:bg-ac-blue/90 text-white"
                  }`}
                >
                  {ctaText}
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
