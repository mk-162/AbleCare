"use client";

import Image from "next/image";

interface PartnerLogo {
  src: string;
  alt: string;
}

interface PartnerLogoCarouselProps {
  heading?: string;
  subheading?: string;
  logos?: PartnerLogo[];
  scheme?: "white" | "grey" | "blue";
}

const defaultLogos: PartnerLogo[] = [
  { src: "/images/logos/harvard-medical-school.png", alt: "Harvard Medical School" },
  { src: "/images/logos/johns-hopkins-medicine.png", alt: "Johns Hopkins Medicine" },
  { src: "/images/logos/university-of-oxford.png", alt: "University of Oxford" },
  { src: "/images/logos/mt-sinai.png", alt: "Mount Sinai" },
  { src: "/images/logos/imperial-college-NHS-trust.png", alt: "Imperial College NHS Trust" },
  { src: "/images/logos/massachusetts-general-hospital.png", alt: "Massachusetts General Hospital" },
  { src: "/images/logos/md-anderson.png", alt: "MD Anderson" },
  { src: "/images/logos/right-at-home.png", alt: "Right at Home" },
  { src: "/images/logos/caring-hands-caregivers.png", alt: "Caring Hands Caregivers" },
  { src: "/images/logos/cypress-homecare-solutions.png", alt: "Cypress Homecare Solutions" },
  { src: "/images/logos/eskaton.png", alt: "Eskaton" },
  { src: "/images/logos/consonus.png", alt: "Consonus" },
  { src: "/images/logos/shore-homecare-services.png", alt: "Shore Homecare Services" },
  { src: "/images/logos/us-physical-therapy.png", alt: "US Physical Therapy" },
];

const schemeStyles = {
  white: "bg-white",
  grey: "bg-ac-grey/30",
  blue: "bg-ac-blue",
};

const textStyles = {
  white: "text-ac-black",
  grey: "text-ac-black",
  blue: "text-white",
};

export function PartnerLogoCarousel({
  heading = "Trusted by Leading Organizations",
  subheading,
  logos = defaultLogos,
  scheme = "white",
}: PartnerLogoCarouselProps) {
  // Double the logos array for seamless infinite scroll
  const scrollLogos = [...logos, ...logos];

  return (
    <section className={`py-16 md:py-20 overflow-hidden ${schemeStyles[scheme]}`}>
      <div className="container mx-auto px-4 md:px-6 mb-10">
        {heading && (
          <h2 className={`text-2xl md:text-3xl font-bold text-center ${textStyles[scheme]}`}>
            {heading}
          </h2>
        )}
        {subheading && (
          <p className={`text-center mt-3 font-light max-w-2xl mx-auto ${scheme === "blue" ? "text-white/70" : "text-ac-black/60"}`}>
            {subheading}
          </p>
        )}
      </div>

      {/* Scrolling track */}
      <div className="relative">
        {/* Fade edges */}
        <div className={`absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-r ${scheme === "blue" ? "from-ac-blue" : scheme === "grey" ? "from-[#f0f0f0]" : "from-white"} to-transparent`} />
        <div className={`absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-l ${scheme === "blue" ? "from-ac-blue" : scheme === "grey" ? "from-[#f0f0f0]" : "from-white"} to-transparent`} />

        <div className="flex animate-scroll-left">
          {scrollLogos.map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center h-16 md:h-20"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={60}
                className={`h-10 md:h-14 w-auto object-contain ${scheme === "blue" ? "brightness-0 invert opacity-70" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"} transition-all duration-300`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
