"use client";

import { getSchemeClasses } from "@/lib/color-schemes";
import { Check, X } from "lucide-react";

interface FeatureComparisonProps {
  scheme?: string;
  heading?: string;
  tldr?: string;
  col1Header?: string;
  col2Header?: string;
  rows?: Array<{ feature: string; col1?: string; col2?: string }>;
}

export function FeatureComparison({
  scheme = "light",
  heading,
  tldr,
  col1Header = "Able Assess",
  col2Header = "Traditional Methods",
  rows,
}: FeatureComparisonProps) {
  const defaultRows: Array<{ feature: string; col1?: string; col2?: string }> = [
    { feature: "Clinical-grade accuracy", col1: "yes", col2: "no" },
    { feature: "No specialized training required", col1: "yes", col2: "no" },
    { feature: "Continuous risk monitoring", col1: "yes", col2: "no" },
    { feature: "EHR Integration", col1: "yes", col2: "yes" },
    { feature: "Portable hardware", col1: "yes", col2: "yes" },
  ];
  const items = rows && rows.length > 0 ? rows : defaultRows;

  const renderCheck = (val?: string) => {
    const isYes = val?.toLowerCase() === "yes" || val === "true" || val === "✓";
    return isYes ? <Check className="text-ac-blue w-6 h-6" /> : <X className="text-red-500/60 w-6 h-6" />;
  };

  return (
    <section className={`py-20 md:py-32 ${getSchemeClasses((scheme as any) || "light")}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading || "Why Able Assess?"}</h2>
          {tldr && <p className="text-lg text-ac-black/70 font-light max-w-2xl mx-auto">{tldr}</p>}
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
          <div className="grid grid-cols-3 bg-ac-grey/30 border-b border-black/5 p-6">
            <div className="font-bold text-lg">Feature</div>
            <div className="font-bold text-lg text-center text-ac-blue">{col1Header}</div>
            <div className="font-bold text-lg text-center opacity-60">{col2Header}</div>
          </div>
          <div className="divide-y divide-black/5">
            {items.map((f, i) => (
              <div key={i} className="grid grid-cols-3 p-6 items-center">
                <div className="font-medium opacity-90">{f.feature}</div>
                <div className="flex justify-center">{renderCheck(f.col1)}</div>
                <div className="flex justify-center opacity-40">{renderCheck(f.col2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
