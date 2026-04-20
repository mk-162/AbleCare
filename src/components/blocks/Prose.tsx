"use client";

import { getSchemeClasses } from "@/lib/color-schemes";

interface ProseProps {
  scheme?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  align?: "left" | "center";
}

export function Prose({ scheme = "light", eyebrow, heading, body, align = "left" }: ProseProps) {
  if (!heading && !body) return null;

  const isBlue = scheme === "blue";
  const bgClass = getSchemeClasses((scheme as "light" | "grey" | "blue" | "aqua") || "light");
  const bodyColor = isBlue ? "text-white/80" : "text-ac-black/70";
  const eyebrowColor = isBlue ? "text-ac-aqua" : "text-ac-blue";
  const alignClass = align === "center" ? "mx-auto text-center" : "";

  return (
    <section className={`py-20 md:py-28 ${bgClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`max-w-3xl ${alignClass}`}>
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
              className={`text-lg font-light leading-relaxed ${bodyColor} [&_p]:mb-5 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-ac-blue`}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
