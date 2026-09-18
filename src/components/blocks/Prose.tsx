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
  // Headings and quote rules sit at full contrast against the body text.
  const headingColor = isBlue
    ? "[&_h2]:text-white [&_h3]:text-white"
    : "[&_h2]:text-ac-black [&_h3]:text-ac-black";
  const quoteBorder = isBlue
    ? "[&_blockquote]:border-ac-aqua"
    : "[&_blockquote]:border-ac-blue";
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
              className={[
                "text-lg font-light leading-relaxed",
                bodyColor,
                "[&_p]:mb-5 [&_p:last-child]:mb-0 [&_strong]:font-semibold",
                "[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-ac-blue",
                // Long-form bodies: one prose block can carry a whole article,
                // so headings, lists, quotes and figures need real typography
                // rather than browser defaults.
                headingColor,
                "[&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:leading-snug",
                "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3",
                "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:mb-6 [&_ol]:mb-6 [&_li]:mb-2",
                quoteBorder,
                "[&_blockquote]:border-l-4 [&_blockquote]:pl-5 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote_p:last-child]:mb-0",
                "[&_figure]:my-10 [&_img]:w-full [&_img]:rounded-2xl",
                "[&_figcaption]:text-sm [&_figcaption]:mt-3 [&_figcaption]:not-italic",
                "[&>*:first-child]:mt-0",
              ].join(" ")}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
