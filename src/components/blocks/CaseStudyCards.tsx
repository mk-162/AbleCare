"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSchemeClasses } from "@/lib/color-schemes";

interface CaseStudyCardsProps {
  scheme?: string;
  heading?: string;
  caseStudies?: Array<{
    title: string;
    metric?: string;
    metricLabel?: string;
    summary?: string;
    sector?: string;
    link?: string;
    thumbnail?: string;
  }>;
}

export function CaseStudyCards({ scheme = "light", heading, caseStudies }: CaseStudyCardsProps) {
  const defaultCases: Array<{ title: string; metric?: string; metricLabel?: string; summary?: string; sector?: string; link?: string; thumbnail?: string }> = [
    { title: "Reducing falls by 32% in community settings", sector: "Home Care", metric: "32%", metricLabel: "Reduction in falls", link: "/case-studies/home-care" },
    { title: "Standardizing assessments across 40 facilities", sector: "Senior Living", metric: "100%", metricLabel: "Compliance rate", link: "/case-studies/senior-living" },
    { title: "Accelerating physical therapy discharge decisions", sector: "Clinicians", metric: "2.4x", metricLabel: "Faster decision making", link: "/case-studies/clinicians" },
  ];
  const items = caseStudies && caseStudies.length > 0 ? caseStudies : defaultCases;
  const colors = ["bg-ac-blue", "bg-ac-aqua text-ac-black", "bg-ac-black"];
  const gridCols = items.length === 1 ? "md:grid-cols-1" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <section className={`py-20 md:py-32 ${getSchemeClasses((scheme as any) || "light")}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading || "Proven outcomes"}</h2>
            <p className="text-lg text-ac-black/70 font-light max-w-xl">
              See how organizations are using Able Assess to improve care quality and operational efficiency.
            </p>
          </div>
        </div>
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {items.map((c, i) => {
            const color = colors[i % colors.length];
            const isAqua = color.includes("bg-ac-aqua");
            const textColor = isAqua ? "text-ac-black" : "text-white";
            return (
              <div key={i} className="group rounded-2xl overflow-hidden border border-black/10 hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
                {c.link ? (
                  <Link href={c.link} className="flex flex-col h-full">
                    <div className={`p-8 ${color} h-40 flex flex-col justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {c.metric && <div className={`text-4xl font-bold mb-1 ${textColor}`}>{c.metric}</div>}
                      {c.metricLabel && <div className={`text-sm font-medium opacity-80 ${textColor}`}>{c.metricLabel}</div>}
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                      {c.sector && <div className="text-xs font-bold uppercase tracking-widest text-ac-blue mb-3">{c.sector}</div>}
                      <h3 className="text-xl font-bold text-ac-black mb-6">{c.title}</h3>
                      <div className="mt-auto flex items-center text-sm font-medium text-ac-black/60 group-hover:text-ac-blue transition-colors">
                        Read study <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <>
                    <div className={`p-8 ${color} h-40 flex flex-col justify-center`}>
                      {c.metric && <div className={`text-4xl font-bold mb-1 ${textColor}`}>{c.metric}</div>}
                      {c.metricLabel && <div className={`text-sm font-medium opacity-80 ${textColor}`}>{c.metricLabel}</div>}
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                      {c.sector && <div className="text-xs font-bold uppercase tracking-widest text-ac-blue mb-3">{c.sector}</div>}
                      <h3 className="text-xl font-bold text-ac-black">{c.title}</h3>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
