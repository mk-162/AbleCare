"use client";

import { getSchemeClasses } from "@/lib/color-schemes";

interface EvidenceBlockProps {
  scheme?: string;
  heading?: string;
  pulledStat?: string;
  pulledStatSource?: string;
  citations?: Array<{
    title: string;
    authors?: string;
    journal?: string;
    year?: string;
    finding?: string;
    link?: string;
  }>;
}

export function EvidenceBlock({ scheme = "light", heading, pulledStat, pulledStatSource, citations }: EvidenceBlockProps) {
  const defaultCitations: Array<{ title: string; authors?: string; journal?: string; year?: string; finding?: string; link?: string }> = [
    { title: "Prognostic value of grip strength: findings from the PURE study", authors: "Leong et al.", journal: "The Lancet", year: "2015" },
    { title: "Gait speed and survival in older adults", authors: "Studenski et al.", journal: "JAMA", year: "2011" },
    { title: "Is the Timed Up and Go test a useful predictor of risk of falls", authors: "Barry et al.", journal: "BMC Geriatrics", year: "2014" },
  ];
  const items = citations && citations.length > 0 ? citations : defaultCitations;

  return (
    <section className={`py-20 md:py-32 ${getSchemeClasses((scheme as any) || "light")} border-y border-black/5`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="w-full lg:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading || "Backed by the research"}</h2>
            {pulledStat && (
              <div className="p-8 bg-ac-blue text-white rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-ac-aqua/20 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-ac-aqua mb-4 leading-snug">{pulledStat}</div>
                {pulledStatSource && <p className="text-sm font-medium opacity-80">— {pulledStatSource}</p>}
              </div>
            )}
          </div>
          <div className="w-full lg:w-2/3 flex flex-col justify-center">
            <div className="space-y-4">
              {items.map((citation, i) => {
                const inner = (
                  <div className="flex gap-4 p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:shadow-md hover:border-ac-blue/20 transition-all">
                    {citation.year && <div className="text-ac-blue font-bold text-sm min-w-14 pt-0.5">{citation.year}</div>}
                    <div className="min-w-0">
                      <h4 className="font-bold mb-1 text-ac-black text-sm leading-snug">{citation.title}</h4>
                      <p className="text-ac-black/55 text-xs font-light">
                        {citation.authors && <span className="font-medium">{citation.authors}</span>}
                        {citation.journal && <> · {citation.journal}</>}
                      </p>
                      {citation.finding && <p className="text-ac-black/70 text-xs mt-2 leading-relaxed">{citation.finding}</p>}
                    </div>
                  </div>
                );
                return citation.link ? (
                  <a key={i} href={citation.link} target="_blank" rel="noopener noreferrer" className="block">
                    {inner}
                  </a>
                ) : (
                  <div key={i}>{inner}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
