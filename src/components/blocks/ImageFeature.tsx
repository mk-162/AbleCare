"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ImageFeatureProps {
  scheme?: string;
  headline?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  ctaText?: string;
  ctaLink?: string;
  bulletPoints?: Array<{ text: string }>;
}

export function ImageFeature({
  scheme = "light",
  headline,
  description,
  image,
  imageAlt,
  imagePosition = "right",
  ctaText,
  ctaLink,
  bulletPoints,
}: ImageFeatureProps) {
  const altText = imageAlt || "Able Assess in use";
  const isRight = imagePosition === "right";
  const isBlue = scheme === "blue";
  const bgClass = isBlue ? "bg-ac-blue" : scheme === "aqua" ? "bg-ac-aqua" : scheme === "grey" ? "bg-ac-grey" : "bg-white";
  const textClass = isBlue ? "text-white" : "text-ac-black";
  const descClass = isBlue ? "text-white/80" : "text-ac-black/70";
  const bulletBg = isBlue ? "bg-white/20" : "bg-ac-blue/15";
  const bulletIcon = isBlue ? "text-ac-aqua" : "text-ac-blue";
  const checkBorder = isBlue ? "border-white/20" : "border-ac-blue/10";
  const ctaClass = isBlue ? "text-ac-aqua hover:text-white" : "text-ac-blue hover:text-ac-blue/80";

  return (
    <section className={`py-20 md:py-28 ${bgClass} ${textClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${!isRight ? "lg:flex-row-reverse" : ""}`}>
          <motion.div
            initial={{ opacity: 0, x: isRight ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            {headline && (
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight ${textClass}`}>
                {headline}
              </h2>
            )}
            {description && (
              <p className={`text-lg font-light leading-relaxed mb-6 ${descClass}`}>{description}</p>
            )}
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="space-y-3 mb-8">
                {bulletPoints.map((point, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm font-medium ${isBlue ? "text-white/90" : "text-ac-black/80"}`}>
                    <span className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${bulletBg} ${checkBorder}`}>
                      <svg className={`w-3 h-3 ${bulletIcon}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {point.text}
                  </li>
                ))}
              </ul>
            )}
            {ctaText && ctaLink && (
              <Link href={ctaLink} className={`inline-flex items-center gap-2 font-bold hover:gap-3 transition-all duration-200 text-sm ${ctaClass}`}>
                {ctaText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRight ? 24 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-1/2"
          >
            <div className={`relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] ${isBlue ? "bg-white/10" : "bg-ac-grey"}`}>
              {image ? (
                /\.(mp4|webm|mov)$/i.test(image) ? (
                  <video
                    src={image}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={altText}
                  />
                ) : (
                  <Image src={image} alt={altText} fill className="object-cover" />
                )
              ) : (
                <div className="absolute inset-0 w-full h-full" style={{ background: "linear-gradient(135deg, #1432FF 0%, #0a2bcc 40%, #00a896 80%, #00FFD2 100%)" }} />
              )}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-ac-aqua/30 blur-2xl pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
