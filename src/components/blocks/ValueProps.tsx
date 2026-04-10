"use client";

import { getSchemeClasses } from "@/lib/color-schemes";

interface ValuePropsProps {
  scheme?: string;
  heading?: string;
  items?: Array<{
    title: string;
    body?: string;
  }>;
}

export function ValueProps({ scheme = "light", heading, items }: ValuePropsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`py-20 md:py-28 ${getSchemeClasses((scheme as any) || "light")}`}>
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-12">{heading}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
              <div className="w-10 h-1 bg-ac-blue rounded-full mb-5" />
              <h3 className="text-lg font-bold text-ac-black mb-2">{item.title}</h3>
              {item.body && (
                <p className="text-ac-black/65 font-light text-sm leading-relaxed">{item.body}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
