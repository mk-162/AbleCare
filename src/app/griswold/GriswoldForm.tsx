"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Tag,
  Mail,
  Phone,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DEADLINE_LABEL = "May 7, 2026";
const CONTACT_EMAIL = "hello@able-care.co";
const CONTACT_PHONE = "+1 406 318 9624";
const CONTACT_PHONE_HREF = "+14063189624";

export function GriswoldForm() {
  return (
    <>
      <Hero />
      <Details />
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="bg-ac-blue text-white pt-20 pb-16 md:pt-24 md:pb-24 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-ac-aqua/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ac-aqua mb-4">
              <CalendarDays className="w-3.5 h-3.5" />
              Griswold Annual Conference 2026
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-[1.1]">
              Subscription discount for Griswold franchises.
            </h1>
            <p className="text-base md:text-lg font-light text-white/85 leading-relaxed mb-7">
              Add the Griswold Strength Score to your Care Assured offering at a conference-only
              rate on Able Assess subscriptions. Valid through {DEADLINE_LABEL}.
            </p>

            <ul className="space-y-2.5 text-sm md:text-base text-white/90">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ac-aqua shrink-0 mt-0.5" />
                <span>
                  Exclusive Griswold discount on the annual data subscription (standard rate
                  $360/yr per sensor)
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ac-aqua shrink-0 mt-0.5" />
                <span>Standard hardware ($199 per sensor) and shipping ($39.95 flat)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ac-aqua shrink-0 mt-0.5" />
                <span>
                  Your franchise rate confirmed once we connect &mdash; usually within 1 business
                  day
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <LeadForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LeadForm() {
  const [naSensors, setNaSensors] = useState(false);

  return (
    <div className="bg-white text-ac-black rounded-3xl p-7 md:p-9 shadow-2xl border border-white/10">
      <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ac-blue mb-2">
        <Tag className="w-3.5 h-3.5" />
        Claim your discount
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-2">Tell us about your franchise</h2>
      <p className="text-sm text-ac-black/60 font-light mb-6">
        We&rsquo;ll come back to you with your subscription rate and next steps.
      </p>

      <form className="space-y-5" action="/thank-you" method="GET">
        <input type="hidden" name="form" value="griswold-lead" />

        <Field
          id="franchiseName"
          name="franchiseName"
          label="Griswold Franchise Name"
          placeholder="e.g. Griswold Home Care of Doylestown"
          required
        />
        <Field
          id="contactName"
          name="contactName"
          label="Your Name"
          placeholder="Jane Doe"
          required
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="jane@griswoldhomecare.com"
            required
          />
          <Field
            id="phone"
            name="phone"
            type="tel"
            label="Phone"
            placeholder="(555) 123-4567"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sensorCount" className="block text-sm font-bold text-ac-black">
            Sensors of interest
            <span className="text-ac-black/50 font-normal ml-1">(optional)</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              id="sensorCount"
              name="sensorCount"
              type="number"
              min={0}
              disabled={naSensors}
              placeholder="e.g. 5"
              className="flex h-11 w-full sm:w-40 rounded-xl border border-black/10 bg-ac-grey/30 px-4 text-base font-semibold text-ac-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label className="inline-flex items-center gap-2 text-sm text-ac-black/70 cursor-pointer select-none">
              <input
                type="checkbox"
                name="sensorCountNA"
                checked={naSensors}
                onChange={(e) => setNaSensors(e.target.checked)}
                className="w-4 h-4 rounded border-ac-black/20 text-ac-blue focus:ring-ac-aqua"
              />
              Not sure yet
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold text-base h-12 mt-2"
        >
          Claim my Griswold discount
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

        <p className="text-xs text-ac-black/55 text-center font-light">
          Discount valid through {DEADLINE_LABEL}. No card required.
        </p>
      </form>
    </div>
  );
}

function Details() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="rounded-2xl border border-ac-grey bg-white p-6 md:p-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ac-blue mb-3">
              <Tag className="w-3.5 h-3.5" />
              What&rsquo;s included in the offer
            </div>
            <h3 className="text-lg md:text-xl font-bold text-ac-black mb-4">
              Subscription discount, applied once we&rsquo;ve spoken
            </h3>
            <ul className="space-y-3 text-sm md:text-base text-ac-black/80">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ac-blue shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ac-black">Conference discount</strong> applies to the
                  annual Able Assess data subscription.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ac-blue shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ac-black">Hardware</strong> at our standard rate
                  ($199 per sensor, one-time, reusable for 3+ years).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ac-blue shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ac-black">Shipping</strong> at our standard flat rate
                  ($39.95, regardless of quantity).
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-ac-grey bg-white p-6 md:p-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ac-blue mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              What to expect next
            </div>
            <h3 className="text-lg md:text-xl font-bold text-ac-black mb-4">
              A short call, then your invoice
            </h3>
            <ol className="space-y-3 text-sm md:text-base text-ac-black/80">
              <li className="flex items-start gap-3">
                <Step n={1} />
                <span>
                  Our team reaches out within <strong className="text-ac-black">1 business day</strong>{" "}
                  to confirm your franchise rate.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Step n={2} />
                <span>
                  We&rsquo;ll talk through your branches and recommend a sensor mix.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Step n={3} />
                <span>
                  We send a final invoice and ship sensors direct &mdash; staff are screening
                  clients within a week.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <section className="bg-ac-grey/40 py-12 md:py-16 border-t border-ac-grey">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ac-blue mb-3">
            Conference pricing ends {DEADLINE_LABEL}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-3">
            Prefer to talk first?
          </h2>
          <p className="text-base font-light text-ac-black/70 mb-6">
            Reach out directly &mdash; we&rsquo;ll have your franchise rate ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Griswold%20Conference%20Discount`}
              className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full bg-ac-blue text-white font-bold hover:bg-ac-blue/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={`tel:${CONTACT_PHONE_HREF}`}
              className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full border border-ac-black/20 text-ac-black font-bold hover:bg-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-ac-blue text-white text-xs font-bold">
      {n}
    </span>
  );
}

interface FieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function Field({ id, name, label, type = "text", placeholder, required }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-bold text-ac-black">
        {label}
        {required && <span className="text-ac-blue ml-1">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="flex h-11 w-full rounded-xl border border-black/10 bg-ac-grey/30 px-4 text-base text-ac-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-1"
      />
    </div>
  );
}
