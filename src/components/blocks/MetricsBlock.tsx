"use client";

import { getSchemeClasses } from "@/lib/color-schemes";
import { motion } from "framer-motion";

interface MetricsBlockProps {
  scheme?: string;
  heading?: string;
  eyebrow?: string;
  metrics?: Array<{
    name: string;
    whatItMeasures?: string;
    image?: string;
  }>;
}

export function MetricsBlock({ scheme = "light", heading, eyebrow, metrics }: MetricsBlockProps) {
  const eyebrowText = (eyebrow ?? "What we measure").trim();
  const defaultMetrics: Array<{ name: string; whatItMeasures?: string; image?: string }> = [
    { name: "Grip Strength", whatItMeasures: "A powerful biomarker of overall vitality. Predicts all-cause mortality more reliably than systolic blood pressure." },
    { name: "Sit-to-Stand", whatItMeasures: "Lower-limb power and balance. Five repetitions tell you more about fall risk than a lengthy clinical interview." },
    { name: "Gait Speed", whatItMeasures: "The 'sixth vital sign' for older adults. Slowing gait predicts cognitive decline, hospitalization, and mortality." },
    { name: "Timed Up and Go", whatItMeasures: "A composite of balance, agility, and mobility. Falls risk in under a minute — without specialist training." },
  ];
  const items = metrics && metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <section className={`relative py-24 md:py-32 overflow-hidden ${getSchemeClasses((scheme as any) || "light")}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          {eyebrowText && (
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-ac-blue mb-4">{eyebrowText}</div>
          )}
          <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl">
            {heading || "Four metrics. One complete picture of function."}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:border-ac-blue/20 transition-all p-8 group"
            >
              <div className="text-5xl font-bold text-ac-blue/10 group-hover:text-ac-blue/20 transition-colors absolute top-6 right-6 leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              {metric.image && (
                <div className="flex justify-center mb-6 py-4 select-none">
                  <div className="relative w-32 rotate-[30deg] transition-transform duration-500 group-hover:rotate-0">
                    {/* phone shell */}
                    <div className="bg-ac-black rounded-[2rem] p-1.5 shadow-2xl">
                      {/* screen */}
                      <div className="relative bg-white rounded-[1.65rem] overflow-hidden aspect-[9/19]">
                        {/* notch */}
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-ac-black rounded-full z-10" />
                        {/* screen content — contain so the whole illustration fits */}
                        <img
                          src={metric.image}
                          alt={metric.name}
                          className="absolute inset-0 w-full h-full object-contain p-1.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="w-10 h-1 bg-ac-blue rounded-full mb-5" />
              <h3 className="text-xl font-bold mb-3 text-ac-black">{metric.name}</h3>
              <p className="text-ac-black/65 font-light text-sm leading-relaxed">
                {metric.whatItMeasures}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
