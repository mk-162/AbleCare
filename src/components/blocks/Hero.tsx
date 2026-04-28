"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BrandmarkWatermark } from "@/components/ui/BrandmarkWatermark";
import { ChevronRight } from "lucide-react";

const schemeToHex = (s: string): string => {
  const map: Record<string, string> = { blue: "#1432FF", light: "#ffffff", white: "#ffffff", aqua: "#00FFD2", grey: "#DCDCDC" };
  return map[s] || "#ffffff";
};

interface HeroPortrait {
  src: string;
  alt: string;
}

interface HeroProps {
  scheme?: string;
  wave?: string;
  eyebrow?: string;
  headline: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  heroPortraits?: HeroPortrait[];
  breadcrumb?: Array<{ label: string; href?: string }>;
  waveFill?: string;
  /** Demo-only: if set, renders an iframe in the right-side visual slot. Intended to be swapped for a native <video> once the final MP4 render is ready. */
  videoIframe?: string;
}

export function Hero({
  scheme = "blue",
  wave = "crest",
  eyebrow,
  headline,
  subtitle,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
  backgroundImage,
  backgroundImageAlt,
  heroPortraits,
  breadcrumb,
  waveFill,
  videoIframe,
}: HeroProps) {
  const altText = backgroundImageAlt || "Functional health assessment in action";
  const isBlue = scheme === "blue";
  const isLight = scheme === "light" || scheme === "grey";
  const bgClass = isBlue ? "bg-ac-blue" : scheme === "grey" ? "bg-ac-grey" : scheme === "aqua" ? "bg-ac-aqua/10" : "bg-white";
  const textClass = isBlue ? "text-white" : "text-ac-black";
  const heroBg = isBlue ? "#1432FF" : scheme === "grey" ? "#DCDCDC" : scheme === "aqua" ? "#00FFD2" : "#ffffff";
  const waveBottom = waveFill ? schemeToHex(waveFill) : "#ffffff";

  return (
    <div className="relative">
    <section className={`relative overflow-hidden ${bgClass} ${textClass}`}>
      <BrandmarkWatermark
        color="white"
        opacity={0.07}
        className="absolute bottom-[-60px] left-[-40px] w-[520px] z-[1]"
      />

      <div className="relative max-w-[1440px] mx-auto w-full min-h-[88vh] flex items-stretch">
      <div className="relative z-20 flex items-center w-full lg:w-[52%] pt-36 pb-24 px-6 md:px-12 lg:pl-16 lg:pr-0">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="flex items-center flex-wrap gap-y-1 text-xs font-light mb-6" aria-label="Breadcrumb">
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center">
                  {i > 0 && <ChevronRight className={`w-3 h-3 mx-1.5 opacity-40 ${isBlue ? "text-white" : "text-ac-black"}`} />}
                  {crumb.href ? (
                    <Link href={crumb.href} className={`opacity-50 hover:opacity-100 transition-opacity ${isBlue ? "text-white" : "text-ac-black hover:text-ac-blue"}`}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={`opacity-70 ${isBlue ? "text-white" : "text-ac-black"}`}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && (
            <div className={`text-xs font-bold uppercase tracking-[0.2em] mb-5 ${isBlue ? "text-ac-aqua" : "text-ac-blue"}`}>
              {eyebrow}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-6">
            {headline}
          </h1>
          {subtitle && (
            <p className={`text-lg md:text-xl font-light mb-10 max-w-[55ch] leading-relaxed ${isBlue ? "text-white/85" : "text-ac-black/75"}`}>
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
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
                      ? "border-white/30 text-white bg-white/5 hover:bg-white/15 hover:text-white"
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

      <div className={`hidden lg:block absolute right-0 w-[55%] z-10 ${videoIframe ? "top-24 bottom-[82px]" : "top-0 h-full"}`}>
        {!videoIframe && (
          <div className="absolute top-0 left-0 h-full z-10 pointer-events-none" style={{ width: "18%" }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" fill="currentColor"
              style={{ color: isBlue ? "#1432FF" : isLight ? "#ffffff" : "#00FFD2" }}>
              <polygon points="0,0 100,0 0,100" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 overflow-hidden">
          {videoIframe ? (
            <iframe
              src={videoIframe}
              title={altText}
              className="absolute inset-0 w-full h-full"
              style={{ border: 0, background: "#1432FF" }}
              loading="eager"
              allow="autoplay"
            />
          ) : heroPortraits && heroPortraits.length > 0 ? (
            <div className="relative w-full h-full flex items-end justify-center gap-0" style={{ background: "linear-gradient(145deg, #0b1fd4 0%, #1432FF 35%, #00a896 75%, #00FFD2 100%)" }}>
              <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 70% 30%, white, transparent 60%)" }} />
              {heroPortraits.map((portrait, i) => (
                <div
                  key={i}
                  className="relative flex-1 h-[85%] max-w-[240px]"
                  style={{ zIndex: i === 1 ? 3 : 1 }}
                >
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    fill
                    className={`object-cover object-top ${i === 1 ? "scale-105" : ""}`}
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b1fd4]/40 to-transparent" />
                </div>
              ))}
            </div>
          ) : backgroundImage ? (
            <>
              <div className={`absolute inset-0 z-[1] ${isBlue ? "bg-gradient-to-r from-ac-blue/55 via-black/20 to-black/5" : "bg-black/10"}`} />
              <Image
                src={backgroundImage}
                alt={altText}
                fill
                className="object-cover object-[center_25%]"
                priority
              />
            </>
          ) : (
            <div className="w-full h-full" style={{ background: "linear-gradient(145deg, #0b1fd4 0%, #1432FF 35%, #00a896 75%, #00FFD2 100%)" }}>
              <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #00FFD2, transparent)" }} />
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, white, transparent)" }} />
            </div>
          )}
        </div>
      </div>

      {(backgroundImage || heroPortraits) && (
        <div className="lg:hidden absolute inset-0 z-0">
          <div className={`absolute inset-0 z-10 ${isBlue ? "bg-ac-blue/88" : "bg-white/88"}`} />
          {backgroundImage && <Image src={backgroundImage} alt={altText} fill className="object-cover" />}
          {!backgroundImage && heroPortraits && (
            <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, #0b1fd4 0%, #1432FF 50%, #00a896 100%)" }} />
          )}
        </div>
      )}
      </div>

    </section>

      <div className="absolute left-0 -bottom-px w-full z-30 leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 82" preserveAspectRatio="none" className="block w-full" style={{ height: "82px", marginBottom: "-1px" }}>
          <rect width="1440" height="82" fill={waveBottom} />
          {wave === "crest" && <path fill={heroBg} d="M0,0 L0,40 C240,80 480,0 720,30 C960,60 1200,20 1440,40 L1440,0 Z" />}
          {wave === "ribbon" && <path fill={heroBg} d="M0,0 L0,60 C360,0 720,80 1080,40 C1260,20 1380,50 1440,60 L1440,0 Z" />}
          {wave === "fold" && <path fill={heroBg} d="M0,0 L1440,0 L0,82 Z" />}
          {wave === "arc" && <path fill={heroBg} d="M0,0 L0,82 C480,0 960,0 1440,82 L1440,0 Z" />}
          {(wave === "pulse" || wave === "none") && <path fill={heroBg} d="M0,0 L0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 C1320,60 1400,50 1440,40 L1440,0 Z" />}
        </svg>
      </div>
    </div>
  );
}
