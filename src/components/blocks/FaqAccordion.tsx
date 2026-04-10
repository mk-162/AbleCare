"use client";

import { getSchemeClasses } from "@/lib/color-schemes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqAccordionProps {
  scheme?: string;
  heading?: string;
  emitSchema?: boolean;
  faqs?: Array<{ question: string; answer: string }>;
}

export function FaqAccordion({ scheme = "light", heading, emitSchema, faqs }: FaqAccordionProps) {
  const defaultFaqs: Array<{ question: string; answer: string }> = [
    { question: "What hardware is required for Able Assess?", answer: "Able Assess uses a specialized, clinical-grade dynamometer and an iPad or Android tablet. The hardware is provided as part of your subscription and comes pre-configured and ready to use." },
    { question: "How long does training take for care workers?", answer: "Most care workers become proficient in under 15 minutes. The app guides the user step-by-step through each assessment with clear visual instructions and voice prompts." },
    { question: "Does it integrate with our existing EHR?", answer: "Yes, Able Assess offers HL7 and FHIR compliant APIs to integrate seamlessly with major electronic health record systems including PointClickCare, MatrixCare, and Epic." },
    { question: "Where is the patient data stored?", answer: "All data is encrypted end-to-end and stored in ISO 27001-certified, HIPAA and GDPR compliant regional data centers." },
    { question: "How does the pricing model work?", answer: "We offer a straightforward annual SaaS subscription based on the number of active users or patient census. Hardware, training, and support are included." },
  ];
  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const schemaMarkup = emitSchema ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <section className={`py-20 md:py-32 ${getSchemeClasses((scheme as any) || "light")}`}>
      {schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      )}
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading || "Frequently Asked Questions"}</h2>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
          {items.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-black/10">
              <AccordionTrigger className="text-left text-lg font-bold py-6 hover:no-underline hover:text-ac-blue transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-ac-black/70 font-light text-base leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
