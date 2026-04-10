"use client";

import { motion } from "framer-motion";

interface TrustBarProps {
  items?: Array<{ text: string; logo?: string }>;
}

export function TrustBar({ items }: TrustBarProps) {
  const certs = items && items.length > 0
    ? items
    : [
        { text: "FDA Listed" },
        { text: "CE Marked" },
        { text: "ISO 27001" },
        { text: "HIPAA Aligned" },
        { text: "Imperial College Origin" },
      ];

  return (
    <section className="relative bg-ac-grey">
      <div className="py-10 border-b border-black/5">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-ac-black/40 mb-8">
            Trusted credentials
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
            {certs.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-ac-blue/10 border border-ac-blue/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-black text-ac-blue leading-none tracking-tight">
                    {cert.text.split(" ").map(w => w[0]).join("").slice(0, 4)}
                  </span>
                </div>
                <span className="text-sm font-medium text-ac-black/70 tracking-wide">{cert.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
