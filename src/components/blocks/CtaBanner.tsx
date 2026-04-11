"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BrandmarkWatermark } from "@/components/ui/BrandmarkWatermark";

const schemeToHex = (s: string): string => {
  const map: Record<string, string> = { blue: "#1432FF", light: "#ffffff", white: "#ffffff", aqua: "#00FFD2", grey: "#DCDCDC" };
  return map[s] || "#ffffff";
};

interface CtaBannerProps {
  scheme?: string;
  wave?: string;
  heading?: string;
  bodyText?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  waveFill?: string;
}

export function CtaBanner({
  scheme = "blue",
  wave = "ribbon",
  heading = "See Able Assess in your workflow.",
  bodyText = "A 20-minute demo with a clinician who has run it in the field.",
  primaryCtaText = "Book a demo",
  primaryCtaLink = "/contact",
  secondaryCtaText,
  secondaryCtaLink,
  waveFill,
}: CtaBannerProps) {
  const isBlue = scheme === "blue";
  const bgColor = isBlue ? "#1432FF" : scheme === "grey" ? "#DCDCDC" : scheme === "aqua" ? "#00FFD2" : "#ffffff";
  const waveTop = waveFill ? schemeToHex(waveFill) : "#ffffff";

  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 102" preserveAspectRatio="none" className="block w-full" style={{ height: "102px" }}>
          <rect width="1440" height="102" fill={waveTop} />
          {wave === "ribbon" && <path fill={bgColor} d="M0,60 C360,100 720,20 1080,60 C1260,80 1380,40 1440,60 L1440,102 L0,102 Z" />}
          {wave === "fold" && <path fill={bgColor} d="M1440,0 L1440,102 L0,102 Z" />}
          {wave === "arc" && <path fill={bgColor} d="M0,102 C480,0 960,0 1440,102 Z" />}
          {(wave === "crest" || wave === "pulse" || wave === "none") && <path fill={bgColor} d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,102 L0,102 Z" />}
        </svg>
      </div>

      <div className="relative -mt-px" style={{ backgroundColor: bgColor }}>
        {isBlue && (
          <>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle at top right, #00FFD2, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle at bottom left, #ffffff, transparent 70%)" }} />
          </>
        )}

        <BrandmarkWatermark color="white" opacity={0.06} className="absolute -right-16 top-1/2 -translate-y-1/2 w-[440px]" />
        <BrandmarkWatermark color="white" opacity={0.035} className="absolute -left-20 bottom-[-30px] w-[280px] rotate-180" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center py-20 md:py-28 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight ${isBlue ? "text-white" : "text-ac-black"}`}>
              {heading}
            </h2>
            {bodyText && (
              <p className={`text-lg font-light mb-10 ${isBlue ? "text-white/80" : "text-ac-black/70"}`}>
                {bodyText}
              </p>
            )}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {primaryCtaText && primaryCtaLink && (
                <Link href={primaryCtaLink}>
                  <Button
                    size="lg"
                    className={`w-full sm:w-auto rounded-full font-bold px-8 text-base h-12 ${
                      isBlue
                        ? "bg-ac-aqua text-ac-black hover:bg-white hover:text-ac-black"
                        : "bg-ac-blue text-white hover:bg-ac-blue/90"
                    }`}
                  >
                    {primaryCtaText}
                  </Button>
                </Link>
              )}
              {secondaryCtaText && secondaryCtaLink && (
                <Link href={secondaryCtaLink}>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full sm:w-auto rounded-full font-bold px-8 text-base h-12 border-2 ${
                      isBlue
                        ? "border-white/30 text-white bg-transparent hover:bg-white/10"
                        : "border-ac-blue/30 text-ac-blue hover:bg-ac-blue/5"
                    }`}
                  >
                    {secondaryCtaText}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
