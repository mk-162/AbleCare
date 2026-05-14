"use client";

import { motion } from "framer-motion";

interface StatsBarProps {
  scheme?: string;
  heading?: string;
  eyebrow?: string;
  stats?: Array<{ value: string; label: string; sublabel?: string }>;
}

function StatValue({ value }: { value: string }) {
  const match = value.match(/^([<>≤≥]?\s*\d[\d,.]*)(\s*)(\D+)$/);
  if (!match) return <>{value}</>;
  const [, num, , unit] = match;
  return (
    <>
      {num}
      <span className="text-[0.45em] ml-1 align-baseline font-bold">{unit}</span>
    </>
  );
}

export function StatsBar({ scheme = "light", heading, eyebrow, stats }: StatsBarProps) {
  const eyebrowText = (eyebrow ?? "About Able Assess").trim();
  const isBlue = scheme === "blue";
  const bgClass = isBlue ? "bg-ac-blue" : scheme === "aqua" ? "bg-ac-aqua" : scheme === "grey" ? "bg-ac-grey" : "bg-white";
  const labelClass = isBlue ? "text-ac-aqua" : "text-ac-blue";
  const valueClass = isBlue ? "text-white" : "text-ac-black";
  const subClass = isBlue ? "text-white/60" : "text-ac-black/50";
  const metaClass = isBlue ? "text-white/80" : "text-ac-black/80";

  const displayStats = stats && stats.length > 0
    ? stats
    : [
        { value: "4", label: "Validated metrics", sublabel: "gold-standard clinical tools" },
        { value: "< 5 min", label: "Per assessment", sublabel: "in any care setting" },
        { value: "1,000+", label: "Assessments delivered", sublabel: "and growing" },
        { value: "12", label: "Peer-reviewed studies", sublabel: "backing our approach" },
      ];

  return (
    <section className={`relative pt-8 pb-12 md:pb-16 ${bgClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <div className="text-center mb-14">
            {eyebrowText && (
              <div className={`text-xs font-bold uppercase tracking-[0.25em] mb-4 ${labelClass}`}>
                {eyebrowText}
              </div>
            )}
            <h2 className={`text-3xl md:text-4xl font-bold ${valueClass}`}>{heading}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {displayStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center flex flex-col items-center"
            >
              <span className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-none mb-2 ${valueClass}`}>
                <StatValue value={stat.value} />
              </span>
              <span className={`text-base font-bold mb-1 ${metaClass}`}>{stat.label}</span>
              {stat.sublabel && <span className={`text-xs font-light ${subClass}`}>{stat.sublabel}</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
