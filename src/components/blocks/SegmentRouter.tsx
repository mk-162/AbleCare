"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SegmentRouterProps {
  scheme?: string;
  heading?: string;
  segments?: Array<{
    title: string;
    description?: string;
    ctaText?: string;
    link: string;
  }>;
}

export function SegmentRouter({ scheme = "grey", heading, segments }: SegmentRouterProps) {
  const defaultSegments: Array<{ title: string; description?: string; ctaText?: string; link: string }> = [
    { title: "Home Care", description: "Empower care workers to spot decline before a fall occurs.", link: "/home-care" },
    { title: "Senior Living", description: "Manage population risk proactively across your facilities.", link: "/senior-living" },
    { title: "Clinicians", description: "Capture clinical-grade functional data in any setting.", link: "/clinicians" },
    { title: "Pharma & CROs", description: "Deploy decentralized functional endpoints for clinical trials.", link: "/pharma" },
  ];
  const items = segments && segments.length > 0 ? segments : defaultSegments;

  return (
    <section className="py-20 md:py-32 bg-ac-grey relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ac-black mb-4">{heading || "Where do you work?"}</h2>
          <p className="text-lg text-ac-black/70 font-light max-w-2xl">
            Able Assess adapts to your environment, providing the right insights for your specific care model.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((segment, i) => (
            <Link key={i} href={segment.link}>
              <div className="group cursor-pointer h-full p-8 rounded-2xl bg-white border border-black/5 hover:border-ac-blue/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <h3 className="text-xl font-bold text-ac-black mb-3">{segment.title}</h3>
                <p className="text-ac-black/70 font-light mb-8 flex-grow">{segment.description}</p>
                <div className="flex items-center text-ac-blue font-medium group-hover:translate-x-2 transition-transform">
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
