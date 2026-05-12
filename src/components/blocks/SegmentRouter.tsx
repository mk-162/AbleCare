"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSchemeClasses, type ColorScheme } from "@/lib/color-schemes";

interface SegmentRouterProps {
  scheme?: string;
  heading?: string;
  subheading?: string;
  segments?: Array<{
    title: string;
    description?: string;
    ctaText?: string;
    link: string;
  }>;
}

export function SegmentRouter({ scheme = "light", heading, subheading, segments }: SegmentRouterProps) {
  const defaultSegments: Array<{ title: string; description?: string; ctaText?: string; link: string }> = [
    { title: "Home Care", description: "Empower care workers to spot decline before a fall occurs.", link: "/home-care" },
    { title: "Senior Living", description: "Manage population risk proactively across your facilities.", link: "/senior-living" },
    { title: "Pharma & CROs", description: "Deploy decentralized functional endpoints for clinical trials.", link: "/pharma" },
  ];
  const items = segments && segments.length > 0 ? segments : defaultSegments;

  return (
    <section className={`py-20 md:py-32 relative overflow-hidden ${getSchemeClasses(scheme as ColorScheme)}`}>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ac-black mb-4">{heading || "Where do you work?"}</h2>
          <p className="text-lg text-ac-black/70 font-light max-w-2xl">
            {subheading || "Able Assess adapts to your environment, providing the right insights for your specific care model."}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((segment, i) => (
            <Link key={i} href={segment.link}>
              <div className="group cursor-pointer h-full p-8 rounded-2xl relative overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col" style={{ background: "linear-gradient(145deg, #1432FF 0%, #1432FF 65%, #00FFD2 100%)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-15 -mr-8 -mt-8 pointer-events-none" style={{ background: "radial-gradient(circle, white, transparent)" }} />
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{segment.title}</h3>
                <p className="text-white/80 font-light mb-8 flex-grow relative z-10">{segment.description}</p>
                <div className="flex items-center text-white font-bold group-hover:translate-x-2 transition-transform relative z-10">
                  {segment.ctaText || "Explore"} <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
