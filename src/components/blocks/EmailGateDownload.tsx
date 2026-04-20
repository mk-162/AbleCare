"use client";

import { useState } from "react";
import { Download, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailGateDownloadProps {
  title: string;
  description: string;
  fileUrl: string;
  fileLabel?: string;
  coverImage?: string;
  eyebrow?: string;
  pageCount?: number;
  fileSizeMb?: number;
}

export function EmailGateDownload({
  title,
  description,
  fileUrl,
  fileLabel = "Download the PDF",
  coverImage,
  eyebrow = "Gated Download",
  pageCount,
  fileSizeMb,
}: EmailGateDownloadProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [subscribe, setSubscribe] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !firstName) return;

    setSubmitting(true);
    // TODO: POST to newsletter/email-capture endpoint when backend is wired.
    // Payload shape: { firstName, email, organization, subscribe, resource: fileUrl }
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    setUnlocked(true);
  }

  return (
    <section className="py-16 md:py-24 bg-ac-grey">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 flex flex-col md:flex-row max-w-5xl mx-auto">
          {/* Left — form / success */}
          <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
            <div className="text-xs font-bold uppercase tracking-widest text-ac-blue mb-3">
              {eyebrow}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-ac-black/70 font-light mb-8 leading-relaxed">
              {description}
            </p>

            {(pageCount || fileSizeMb) && (
              <div className="flex items-center gap-4 text-xs text-ac-black/50 mb-8">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  PDF{pageCount ? ` · ${pageCount} pages` : ""}
                </span>
                {fileSizeMb && <span>· {fileSizeMb} MB</span>}
              </div>
            )}

            {unlocked ? (
              <div className="rounded-xl border border-ac-aqua/40 bg-ac-aqua/5 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-ac-blue" />
                  <span className="font-bold text-ac-black">You're in.</span>
                </div>
                <p className="text-sm text-ac-black/70 font-light mb-5">
                  Your download is ready. We've sent a copy to {email}.
                </p>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold px-8"
                  >
                    <Download className="w-4 h-4" />
                    {fileLabel}
                  </Button>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="eg-first-name"
                    className="block text-xs font-bold uppercase tracking-widest text-ac-black/60 mb-1.5"
                  >
                    First name
                  </label>
                  <input
                    id="eg-first-name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ac-blue/40 focus:border-ac-blue/40 transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="eg-email"
                    className="block text-xs font-bold uppercase tracking-widest text-ac-black/60 mb-1.5"
                  >
                    Work email
                  </label>
                  <input
                    id="eg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ac-blue/40 focus:border-ac-blue/40 transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="eg-org"
                    className="block text-xs font-bold uppercase tracking-widest text-ac-black/60 mb-1.5"
                  >
                    Organization <span className="text-ac-black/30 font-light normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    id="eg-org"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ac-blue/40 focus:border-ac-blue/40 transition"
                  />
                </div>
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribe}
                    onChange={(e) => setSubscribe(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-black/20 text-ac-blue focus:ring-ac-blue/40"
                  />
                  <span className="text-xs text-ac-black/60 font-light leading-relaxed">
                    Send me the Able Care newsletter — new research, product updates and falls-prevention insights, once a month. Unsubscribe anytime.
                  </span>
                </label>
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold px-8 mt-2"
                >
                  {submitting ? "Preparing your download…" : fileLabel}
                </Button>
                <p className="text-[11px] text-ac-black/40 font-light pt-1">
                  We'll email a copy to you. No spam, ever. See our{" "}
                  <a href="/privacy" className="underline hover:text-ac-blue">
                    privacy policy
                  </a>
                  .
                </p>
              </form>
            )}
          </div>

          {/* Right — cover art */}
          <div className="w-full md:w-1/2 bg-ac-blue p-8 md:p-10 flex items-center justify-center relative overflow-hidden min-h-[420px]">
            <div className="absolute inset-0 bg-gradient-to-br from-ac-blue to-ac-aqua opacity-50" />
            <div className="relative z-10 w-64 md:w-72 lg:w-[22rem] aspect-[8.5/11] bg-white shadow-2xl rounded-sm transform rotate-3 transition-transform hover:rotate-0 duration-500 flex flex-col border border-white/20 overflow-hidden">
              {coverImage ? (
                <div className="w-full h-full p-3 md:p-4">
                  <img
                    src={coverImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <>
                  <div className="p-4 flex-grow border-b border-black/10">
                    <div className="w-8 h-2 bg-ac-blue mb-4" />
                    <div className="w-full h-3 bg-black/10 mb-2" />
                    <div className="w-3/4 h-3 bg-black/10 mb-8" />
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-black/5" />
                      <div className="w-full h-2 bg-black/5" />
                      <div className="w-5/6 h-2 bg-black/5" />
                    </div>
                  </div>
                  <div className="p-4 bg-ac-grey text-[8px] font-bold text-ac-black">
                    ABLE CARE RESEARCH
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
