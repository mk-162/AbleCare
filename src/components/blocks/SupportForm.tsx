"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SupportFormProps {
  heading?: string;
  subtitle?: string;
  supportEmail?: string;
}

export function SupportForm({
  heading = "Need help with your GripAble device?",
  subtitle = "Tell us a little about the issue and our support team will get back to you within one business day.",
  supportEmail = "hello@able-care.co",
}: SupportFormProps) {
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
    const payload: Record<string, string> = { source: pathname || "/support" };
    formData.forEach((value, key) => {
      if (typeof value === "string") payload[key] = value;
    });

    try {
      const response = await fetch("/api/support", {
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
                <h3 className="font-bold text-lg mb-2">Email support</h3>
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-ac-black/70 font-light hover:text-ac-blue transition-colors"
                >
                  {supportEmail}
                </a>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Where to find your serial number</h3>
                <p className="text-ac-black/70 font-light">
                  Your GripAble serial number starts with <span className="font-mono">FLEX000</span> and is printed on the underside of the device. If you have multiple sensors, separate them with commas.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-black/5">
              <h2 className="text-2xl font-bold mb-6">Submit a support request</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium leading-none">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-medium leading-none">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    required
                    placeholder="Acme Care"
                    autoComplete="organization"
                    className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    autoComplete="email"
                    className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="serialNumbers" className="text-sm font-medium leading-none">
                    GripAble serial number(s)
                  </label>
                  <input
                    id="serialNumbers"
                    name="serialNumbers"
                    placeholder="FLEX000123, FLEX000456"
                    pattern="^(FLEX\d{3,}\s*)(,\s*FLEX\d{3,}\s*)*$"
                    title="Enter one or more serial numbers in the form FLEX000_ _ _, separated by commas"
                    className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                  />
                  <p className="text-xs text-ac-black/50">
                    Format: FLEX000_ _ _. Separate multiple devices with commas.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium leading-none">
                    Telephone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 555 123 4567"
                    autoComplete="tel"
                    className="flex h-10 w-full rounded-md border border-black/10 bg-ac-grey/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium leading-none">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Tell us what is happening. Include error messages, the steps you took, and any screenshots if you have them."
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
                  {submitting ? "Sending…" : "Submit support request"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
