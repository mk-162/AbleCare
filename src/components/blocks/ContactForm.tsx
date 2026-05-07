"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ContactFormProps {
  heading?: string;
  subtitle?: string;
  salesEmail?: string;
  supportEmail?: string;
}

export function ContactForm({
  heading = "Let's talk about functional health.",
  subtitle = "See how Able Assess can help your organization spot decline, prevent falls, and empower your care teams.",
  salesEmail = "hello@able-care.co",
  supportEmail: _supportEmail = "hello@able-care.co",
}: ContactFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setErrorMessage(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = { source: pathname || "/demo" };
    formData.forEach((value, key) => {
      if (typeof value === "string") payload[key] = value;
    });

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push("/thank-you");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section className="pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {heading}
            </h1>
            <p className="text-lg font-light text-ac-black/70 mb-10">
              {subtitle}
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <a href={`mailto:${salesEmail}`} className="text-ac-black/70 font-light hover:text-ac-blue transition-colors">{salesEmail}</a>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Phone</h3>
                <a href="tel:+14063189624" className="text-ac-black/70 font-light hover:text-ac-blue transition-colors">+1 406 318 9624</a>
              </div>
              <div className="flex gap-3 pt-2">
                <a
                  href="https://www.linkedin.com/company/ablecarecompany/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-ac-blue/10 hover:bg-ac-blue/20 flex items-center justify-center text-ac-blue transition-all"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a
                  href="https://www.instagram.com/gripable_rehab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-ac-blue/10 hover:bg-ac-blue/20 flex items-center justify-center text-ac-blue transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-black/5">
              <h2 className="text-2xl font-bold mb-6">Book a demo</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium leading-none">First name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      placeholder="Jane"
                      className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium leading-none">Last name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none">Work email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium leading-none">Company</label>
                  <input
                    id="company"
                    name="company"
                    placeholder="Acme Care"
                    className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="referralCode" className="text-sm font-medium leading-none">Referral code</label>
                  <input
                    id="referralCode"
                    name="referralCode"
                    placeholder="Optional"
                    className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="demoInterest" className="text-sm font-medium leading-none">I would like to see a demo of</label>
                  <select
                    id="demoInterest"
                    name="demoInterest"
                    defaultValue=""
                    className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                  >
                    <option value="" disabled>Select a product</option>
                    <option value="Able Assess Falls">Able Assess Falls</option>
                    <option value="Able Assess Grip Strength">Able Assess Grip Strength</option>
                    <option value="Able Rehab">Able Rehab</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium leading-none">How can we help?</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your functional assessment needs..."
                    className="flex min-h-32 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2 resize-none"
                  />
                </div>

                {errorMessage && (
                  <p
                    role="alert"
                    className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
                  >
                    {errorMessage}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold text-lg h-12 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending…" : "Request Demo"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
