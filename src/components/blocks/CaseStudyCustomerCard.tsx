"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getSchemeClasses, type ColorScheme } from "@/lib/color-schemes";

interface CaseStudyCustomerCardProps {
  scheme?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  portraitSrc?: string;
  portraitAlt?: string;
  name?: string;
  role?: string;
  logoSrc?: string;
  logoAlt?: string;
  highlightQuote?: string;
}

export function CaseStudyCustomerCard({
  scheme = "light",
  eyebrow,
  heading,
  body,
  portraitSrc,
  portraitAlt,
  name,
  role,
  logoSrc,
  logoAlt,
  highlightQuote,
}: CaseStudyCustomerCardProps) {
  const portraitAltText = portraitAlt || name || "";
  const logoAltText = logoAlt || (name ? `${name} company logo` : "Customer logo");
  const isBlue = scheme === "blue";
  const bg = getSchemeClasses((scheme as ColorScheme) || "light");
  const bodyColor = isBlue ? "text-white/80" : "text-ac-black/70";
  const eyebrowColor = isBlue ? "text-ac-aqua" : "text-ac-blue";
  const cardBg = isBlue ? "bg-white/8" : "bg-white";
  const cardBorder = isBlue ? "border-white/15" : "border-black/6";
  const nameColor = isBlue ? "text-white" : "text-ac-black";
  const roleColor = isBlue ? "text-white/70" : "text-ac-black/55";
  const dividerColor = isBlue ? "border-white/15" : "border-black/8";
  const quoteColor = isBlue ? "text-white/90" : "text-ac-black/80";

  return (
    <section className={`py-20 md:py-28 ${bg}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 order-2 lg:order-1"
          >
            {eyebrow && (
              <div className={`text-xs font-bold uppercase tracking-[0.25em] mb-4 ${eyebrowColor}`}>
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
                {heading}
              </h2>
            )}
            {body && (
              <div
                className={`text-lg font-light leading-relaxed ${bodyColor} [&_p]:mb-5 [&_p:last-child]:mb-0 [&_strong]:font-semibold`}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`lg:col-span-5 order-1 lg:order-2 rounded-3xl border shadow-sm p-8 md:p-10 ${cardBg} ${cardBorder} lg:sticky lg:top-28`}
          >
            <div className="flex flex-col items-center text-center">
              {portraitSrc && (
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-ac-aqua/30 mb-5 bg-ac-grey">
                  <Image
                    src={portraitSrc}
                    alt={portraitAltText}
                    fill
                    sizes="128px"
                    className="object-cover object-top"
                  />
                </div>
              )}
              {name && <div className={`text-lg font-bold ${nameColor}`}>{name}</div>}
              {role && <div className={`text-sm mt-1 ${roleColor}`}>{role}</div>}

              {logoSrc && (
                <div className={`mt-6 pt-6 border-t ${dividerColor} w-full flex items-center justify-center`}>
                  <div className="relative h-10 w-48">
                    <Image src={logoSrc} alt={logoAltText} fill className="object-contain" sizes="192px" />
                  </div>
                </div>
              )}

              {highlightQuote && (
                <blockquote className={`mt-6 pt-6 border-t ${dividerColor} text-sm italic leading-relaxed ${quoteColor}`}>
                  &ldquo;{highlightQuote}&rdquo;
                </blockquote>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
