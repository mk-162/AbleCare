"use client";

import { motion } from "framer-motion";

interface ProcessStepsProps {
  scheme?: string;
  heading?: string;
  eyebrow?: string;
  steps?: Array<{
    number?: number;
    title: string;
    subtitle?: string;
    description?: string;
  }>;
  ctaText?: string;
  ctaLink?: string;
}

export function ProcessSteps({ scheme = "light", heading, eyebrow, steps, ctaText, ctaLink }: ProcessStepsProps) {
  const eyebrowText = (eyebrow ?? "How it works").trim();
  const isBlue = scheme === "blue";
  const bgClass = isBlue ? "bg-ac-blue" : scheme === "aqua" ? "bg-ac-aqua" : scheme === "grey" ? "bg-ac-grey" : "bg-white";
  const textClass = isBlue ? "text-white" : "text-ac-black";
  const descClass = isBlue ? "text-white/70" : "text-ac-black/60";
  const lineClass = isBlue ? "bg-white/20" : "bg-ac-black/10";
  const circleClass = isBlue
    ? "bg-ac-blue border-white/50 text-white"
    : "bg-white border-ac-blue/30 text-ac-blue shadow-md";

  const defaultSteps: Array<{ number?: number; title: string; subtitle?: string; description?: string }> = [
    { title: "Select patient", description: "Scan a wristband or select from your census — Able Assess pulls demographics automatically." },
    { title: "Guide assessment", description: "Clear on-screen prompts walk the care worker through each step. No clinical training required." },
    { title: "Capture data", description: "The device syncs wirelessly and scores results against age-matched normative data in seconds." },
    { title: "Act on insights", description: "Risk alerts route to the right clinician, and trending data helps your team spot decline early." },
  ];
  const items = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <section id="how-it-works" className={`relative py-20 md:py-32 ${bgClass} ${textClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          {eyebrowText && (
            <div className={`text-xs font-bold uppercase tracking-[0.25em] mb-4 ${isBlue ? "text-ac-aqua" : "text-ac-blue"}`}>
              {eyebrowText}
            </div>
          )}
          <h2 className={`text-3xl md:text-4xl font-bold ${textClass}`}>
            {heading || "Assessment in four simple steps"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
          <div className={`hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px ${lineClass} z-0`} />
          {items.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className={`relative z-10 w-20 h-20 rounded-full border-2 flex items-center justify-center text-2xl font-bold mb-6 transition-transform hover:scale-105 ${circleClass}`}>
                {String(step.number || i + 1).padStart(2, "0")}
              </div>
              <h3 className={`text-lg font-bold mb-2 ${textClass}`}>{step.title}</h3>
              {step.subtitle && <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isBlue ? "text-ac-aqua" : "text-ac-blue"}`}>{step.subtitle}</p>}
              {step.description && <p className={`text-sm leading-relaxed font-light ${descClass}`}>{step.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
