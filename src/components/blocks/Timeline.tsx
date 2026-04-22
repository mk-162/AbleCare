"use client";

import { motion } from "framer-motion";

interface TimelineEntry {
  year: string;
  body?: string;
}

interface TimelineProps {
  scheme?: string;
  heading?: string;
  entries?: TimelineEntry[];
}

export function Timeline({ scheme = "light", heading, entries }: TimelineProps) {
  const isBlue = scheme === "blue";
  const bgClass = isBlue ? "bg-ac-blue" : scheme === "grey" ? "bg-ac-grey" : scheme === "aqua" ? "bg-ac-aqua" : "bg-white";
  const textClass = isBlue ? "text-white" : "text-ac-black";
  const bodyClass = isBlue ? "text-white/80" : "text-ac-black/70";
  const yearClass = isBlue ? "text-ac-aqua" : "text-ac-blue";
  const railClass = isBlue ? "bg-white/20" : "bg-ac-blue/20";

  const items = entries && entries.length > 0 ? entries : [];
  if (items.length === 0) return null;

  return (
    <section className={`relative py-20 md:py-28 ${bgClass} ${textClass}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {heading && (
          <h2 className={`text-3xl md:text-4xl font-bold mb-14 text-center ${textClass}`}>
            {heading}
          </h2>
        )}
        <div className="relative">
          <div className={`absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px ${railClass} -translate-x-0 md:-translate-x-1/2`} />
          {items.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-10 mb-12 last:mb-0"
            >
              <div className={`absolute left-[21px] md:left-1/2 top-2 w-3 h-3 rounded-full -translate-x-0 md:-translate-x-1/2 ${isBlue ? "bg-ac-aqua" : "bg-ac-blue"} ring-4 ${isBlue ? "ring-ac-blue" : "ring-white"}`} />
              <div className={`md:text-right md:pr-10 ${i % 2 === 1 ? "md:order-2 md:text-left md:pr-0 md:pl-10" : ""}`}>
                <div className={`text-2xl md:text-3xl font-bold ${yearClass}`}>{entry.year}</div>
              </div>
              <div className={`md:pl-10 ${i % 2 === 1 ? "md:order-1 md:pl-0 md:pr-10 md:text-right" : ""}`}>
                {entry.body && (
                  <p className={`text-base leading-relaxed font-light ${bodyClass}`}>{entry.body}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
