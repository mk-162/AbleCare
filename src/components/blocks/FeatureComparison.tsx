"use client";

import { getSchemeClasses } from "@/lib/color-schemes";

interface FeatureComparisonProps {
  scheme?: string;
  heading?: string;
  tldr?: string;
  columns?: string[];
  rows?: Array<{ feature: string; values?: string[] }>;
}

export function FeatureComparison({
  scheme = "light",
  heading,
  tldr,
  columns,
  rows,
}: FeatureComparisonProps) {
  const headers = columns && columns.length > 0 ? columns : ["Able Assess", "Traditional Methods"];
  const items = rows ?? [];
  const gridStyle = {
    gridTemplateColumns: `minmax(9rem, 1.3fr) repeat(${headers.length}, minmax(0, 1fr))`,
  };

  return (
    <section className={`py-20 md:py-32 ${getSchemeClasses((scheme as any) || "light")}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading || "Why Able Assess?"}</h2>
          {tldr && <p className="text-lg text-ac-black/70 font-light max-w-3xl mx-auto">{tldr}</p>}
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div style={gridStyle} className="grid bg-ac-grey/30 border-b border-black/5 p-6 gap-4">
            <div className="font-bold text-base md:text-lg">Feature</div>
            {headers.map((h, i) => (
              <div
                key={i}
                className={`font-bold text-base md:text-lg text-center ${i === 0 ? "text-ac-blue" : "opacity-70"}`}
              >
                {h}
              </div>
            ))}
          </div>
          <div className="divide-y divide-black/5">
            {items.map((row, i) => (
              <div key={i} style={gridStyle} className="grid p-6 gap-4 items-start">
                <div className="font-medium opacity-90">{row.feature}</div>
                {headers.map((_, ci) => (
                  <div
                    key={ci}
                    className={`text-sm leading-relaxed ${ci === 0 ? "text-ac-black" : "text-ac-black/70"}`}
                  >
                    {row.values?.[ci] || "—"}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
