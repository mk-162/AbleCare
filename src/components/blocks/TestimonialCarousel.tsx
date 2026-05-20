"use client";

import { motion } from "framer-motion";

const schemeToHex = (s: string): string => {
  const map: Record<string, string> = { blue: "#1432FF", light: "#ffffff", white: "#ffffff", aqua: "#00FFD2", grey: "#DCDCDC" };
  return map[s] || "#ffffff";
};

interface TestimonialCarouselProps {
  scheme?: string;
  wave?: string;
  waveFill?: string;
  heading?: string;
  eyebrow?: string;
  testimonials?: Array<{
    quote: string;
    name?: string;
    role?: string;
    organization?: string;
    /** Alternative to role/organization — used by content authored before the structured fields existed. */
    attribution?: string;
    photo?: string;
  }>;
}

export function TestimonialCarousel({ scheme = "aqua", wave = "fold", waveFill, heading, eyebrow, testimonials }: TestimonialCarouselProps) {
  const eyebrowText = (eyebrow ?? "What they say").trim();
  const defaultTestimonials: Array<{ quote: string; name?: string; role?: string; organization?: string; attribution?: string; photo?: string }> = [
    {
      quote: "We caught decline six weeks earlier than we would have with our old process. The data gave us the confidence to act — and the resident avoided a hospitalization.",
      name: "Dr Sarah Jenkins",
      role: "Clinical Director, Horizon Senior Living",
    },
    {
      quote: "It paid for itself in the first quarter. Our HHVBP scores improved, our rehospitalisation rate dropped, and our care workers love using it.",
      name: "Marcus Thorne",
      role: "Operations Lead, City Home Health",
    },
  ];
  const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
  const bg = scheme === "aqua" ? "#00FFD2" : scheme === "blue" ? "#1432FF" : scheme === "grey" ? "#DCDCDC" : "#ffffff";

  return (
    <section className="relative py-24 md:py-32 overflow-visible" style={{ backgroundColor: bg }}>
      <div className="absolute left-0 right-0 leading-none z-20 pointer-events-none" style={{ top: "-69px" }} aria-hidden="true">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block w-full" style={{ height: "70px" }}>
          <rect width="1440" height="70" fill={waveFill ? schemeToHex(waveFill) : "#ffffff"} />
          {wave === "fold" && <path fill={bg} d="M0,60 C180,52 360,62 720,44 C1080,30 1440,40 1440,40 L1440,70 L0,70 Z" />}
          {wave !== "fold" && <path fill={bg} d="M0,55 C480,32 960,68 1440,35 L1440,70 L0,70 Z" />}
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-8">
        <div className="text-center mb-14">
          {eyebrowText && (
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-4">{eyebrowText}</div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-ac-black">{heading || "From the people using it"}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((t, i) => {
            const initials = t.name
              ? t.name.split(" ").map(w => w[0]).filter(Boolean).join("").slice(0, 2)
              : "";
            const hasAvatar = !!t.photo || !!initials;
            const structuredMeta = [t.role, t.organization].filter(Boolean).join(", ");
            const meta = structuredMeta || t.attribution || "";
            const hasMeta = !!t.name || !!meta;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-ac-aqua/20 flex flex-col"
              >
                <div className="w-10 h-10 rounded-full bg-ac-blue/10 flex items-center justify-center mb-6 flex-shrink-0">
                  <svg className="w-5 h-5 text-ac-blue" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.78-3 .53-.79 1.23-1.43 2.1-1.92L9.6 6c-1.45.76-2.65 1.83-3.6 3.21-.95 1.38-1.42 2.86-1.42 4.44 0 1.3.37 2.42 1.1 3.38.73.96 1.65 1.43 2.76 1.43.92 0 1.69-.31 2.31-.93.62-.62.93-1.39.93-2.31v-.44zm7.992 0c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.78-3 .53-.79 1.23-1.43 2.1-1.92l-.91-1.78c-1.45.76-2.65 1.83-3.6 3.21-.95 1.38-1.42 2.86-1.42 4.44 0 1.3.37 2.42 1.1 3.38.73.96 1.65 1.43 2.76 1.43.92 0 1.69-.31 2.31-.93.62-.62.93-1.39.93-2.31v-.44z" />
                  </svg>
                </div>
                <p className="text-xl md:text-2xl font-light text-ac-black leading-snug flex-grow mb-8">{t.quote}</p>
                {(hasAvatar || hasMeta) && (
                  <div className="flex items-center gap-4 mt-auto">
                    {t.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.photo}
                        alt={t.name || ""}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : initials ? (
                      <div className="w-10 h-10 rounded-full bg-ac-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {initials}
                      </div>
                    ) : null}
                    {hasMeta && (
                      <div>
                        {t.name && <div className="font-bold text-ac-black text-sm">{t.name}</div>}
                        {meta && <div className="text-xs text-ac-black/55 font-light">{meta}</div>}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute left-0 right-0 leading-none z-20 pointer-events-none" style={{ bottom: "-69px" }} aria-hidden="true">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block w-full" style={{ height: "70px" }}>
          <path fill={bg} d="M0,0 L1440,0 C1080,30 720,55 360,30 C180,18 60,42 0,32 L0,0 Z" />
        </svg>
      </div>
    </section>
  );
}
