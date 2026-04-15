"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  Heart,
  Users,
  DollarSign,
  Activity,
  ShieldCheck,
  Scale,
  Gavel,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Starting figures drawn from published fall-risk research and industry benchmarks.
// They are conservative estimates — every home is different, so please adjust to
// reflect the people in your own care.
const DEFAULTS = {
  residents: 1000,
  savingsPerFall: 100,
  fallRatePct: 50, // roughly half of care-home residents experience a fall each year
  preventionRatePct: 25, // share of those falls that early screening can help avoid
  lawsuitRatePct: 3, // proportion of serious falls that lead to legal action
  lawsuitCost: 250000, // combined settlement, legal defence and indirect costs
  moveOutRatePct: 20, // residents who leave care after a significant fall / injury
  replacementCost: 60000, // revenue lost while a room is empty + onboarding a new resident
};

function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value)));
}

export function RoiCalculator() {
  const [residents, setResidents] = useState<number>(DEFAULTS.residents);
  const [savingsPerFall, setSavingsPerFall] = useState<number>(DEFAULTS.savingsPerFall);
  const [fallRatePct, setFallRatePct] = useState<number>(DEFAULTS.fallRatePct);
  const [preventionRatePct, setPreventionRatePct] = useState<number>(DEFAULTS.preventionRatePct);
  const [lawsuitRatePct, setLawsuitRatePct] = useState<number>(DEFAULTS.lawsuitRatePct);
  const [lawsuitCost, setLawsuitCost] = useState<number>(DEFAULTS.lawsuitCost);
  const [moveOutRatePct, setMoveOutRatePct] = useState<number>(DEFAULTS.moveOutRatePct);
  const [replacementCost, setReplacementCost] = useState<number>(DEFAULTS.replacementCost);

  const metrics = useMemo(() => {
    const r = Math.max(0, residents);
    const fallRate = Math.max(0, Math.min(100, fallRatePct)) / 100;
    const prevRate = Math.max(0, Math.min(100, preventionRatePct)) / 100;
    const suitRate = Math.max(0, Math.min(100, lawsuitRatePct)) / 100;
    const moveRate = Math.max(0, Math.min(100, moveOutRatePct)) / 100;

    const expectedFalls = r * fallRate;
    const fallsPrevented = expectedFalls * prevRate;
    const careCostSavings = fallsPrevented * Math.max(0, savingsPerFall);
    const lawsuitsPrevented = fallsPrevented * suitRate;
    const lawsuitSavings = lawsuitsPrevented * Math.max(0, lawsuitCost);
    const residentsRetained = fallsPrevented * moveRate;
    const retentionSavings = residentsRetained * Math.max(0, replacementCost);
    const totalSavings = careCostSavings + lawsuitSavings + retentionSavings;

    return {
      expectedFalls,
      fallsPrevented,
      careCostSavings,
      lawsuitsPrevented,
      lawsuitSavings,
      residentsRetained,
      retentionSavings,
      totalSavings,
      monthlySavings: totalSavings / 12,
      perResidentSavings: r > 0 ? totalSavings / r : 0,
    };
  }, [
    residents,
    savingsPerFall,
    fallRatePct,
    preventionRatePct,
    lawsuitRatePct,
    lawsuitCost,
    moveOutRatePct,
    replacementCost,
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-ac-blue text-white pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-ac-aqua/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-ac-aqua mb-5">
              <Calculator className="w-4 h-4" />
              Impact Calculator
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Keeping loved ones safer — and the home stronger
            </h1>
            <p className="text-lg md:text-xl font-light text-white/80">
              A single fall can change a resident&rsquo;s life overnight, and ripple through a
              family and a home for years afterwards. Use the assumptions below to picture the
              difference early screening could make for the people in your care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-10 border border-ac-grey shadow-sm"
            >
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-3">
                Your home, your people
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-2">
                The residents you look after
              </h2>
              <p className="text-sm text-ac-black/60 font-light mb-8">
                Every care home is unique. The figures below are gentle starting points drawn from
                published research — please adjust them to reflect the grandparents, parents and
                loved ones you care for.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <NumberField
                  id="residents"
                  label="Residents in your care"
                  icon={<Users className="w-5 h-5 text-ac-blue" />}
                  value={residents}
                  onChange={setResidents}
                  min={0}
                  max={100000}
                  sliderMax={5000}
                  step={50}
                  hint="The people who call your home, home."
                />

                <NumberField
                  id="savings"
                  label="Additional care cost per fall"
                  icon={<DollarSign className="w-5 h-5 text-ac-blue" />}
                  value={savingsPerFall}
                  onChange={setSavingsPerFall}
                  min={0}
                  max={1000000}
                  sliderMax={5000}
                  step={25}
                  prefix="$"
                  hint="Extra support a resident typically needs after a fall — dressings, physio, one-to-one care, hospital transfers."
                />

                <NumberField
                  id="fallRate"
                  label="Residents who experience a fall each year"
                  icon={<Activity className="w-5 h-5 text-ac-blue" />}
                  value={fallRatePct}
                  onChange={setFallRatePct}
                  min={0}
                  max={100}
                  sliderMax={100}
                  step={1}
                  suffix="%"
                  hint="The CDC finds around half of older adults in care settings have a fall each year."
                />

                <NumberField
                  id="preventionRate"
                  label="Falls we can help you prevent"
                  icon={<ShieldCheck className="w-5 h-5 text-ac-blue" />}
                  value={preventionRatePct}
                  onChange={setPreventionRatePct}
                  min={0}
                  max={100}
                  sliderMax={100}
                  step={1}
                  suffix="%"
                  hint="The share of expected falls avoided by spotting risk early and acting on it."
                />

                <NumberField
                  id="lawsuitRate"
                  label="Serious falls that lead to legal action"
                  icon={<Scale className="w-5 h-5 text-ac-blue" />}
                  value={lawsuitRatePct}
                  onChange={setLawsuitRatePct}
                  min={0}
                  max={100}
                  sliderMax={20}
                  step={0.5}
                  suffix="%"
                  hint="When a family is hurting, some turn to the courts. This is a difficult conversation, but an important one to plan for."
                />

                <NumberField
                  id="lawsuitCost"
                  label="Typical cost of a lawsuit"
                  icon={<Gavel className="w-5 h-5 text-ac-blue" />}
                  value={lawsuitCost}
                  onChange={setLawsuitCost}
                  min={0}
                  max={10000000}
                  sliderMax={1000000}
                  step={5000}
                  prefix="$"
                  hint="Settlement, legal defence and the wider toll on the home."
                />

                <NumberField
                  id="moveOutRate"
                  label="Residents who move on after a fall"
                  icon={<Home className="w-5 h-5 text-ac-blue" />}
                  value={moveOutRatePct}
                  onChange={setMoveOutRatePct}
                  min={0}
                  max={100}
                  sliderMax={100}
                  step={1}
                  suffix="%"
                  hint="Some residents leave for hospital-level care, or a family chooses to move them closer to home after an injury."
                />

                <NumberField
                  id="replacementCost"
                  label="Cost when a resident leaves"
                  icon={<DollarSign className="w-5 h-5 text-ac-blue" />}
                  value={replacementCost}
                  onChange={setReplacementCost}
                  min={0}
                  max={1000000}
                  sliderMax={200000}
                  step={1000}
                  prefix="$"
                  hint="Revenue lost while a room sits empty, plus the time and care it takes to welcome someone new."
                />
              </div>

              <div className="mt-10 pt-8 border-t border-ac-grey/60 space-y-2 text-sm text-ac-black/70 font-light">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-ac-blue mb-3">
                  What this means in a year
                </div>
                <div>
                  <span className="font-semibold text-ac-black">Falls we&rsquo;d expect:</span>{" "}
                  {formatNumber(metrics.expectedFalls)}
                </div>
                <div>
                  <span className="font-semibold text-ac-black">Falls avoided:</span>{" "}
                  {formatNumber(metrics.fallsPrevented)}
                </div>
                <div>
                  <span className="font-semibold text-ac-black">Families spared a lawsuit:</span>{" "}
                  {formatNumber(metrics.lawsuitsPrevented)}
                </div>
                <div>
                  <span className="font-semibold text-ac-black">
                    Residents who get to stay home:
                  </span>{" "}
                  {formatNumber(metrics.residentsRetained)}
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 rounded-3xl p-8 md:p-10 bg-ac-black text-white relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-ac-aqua/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-ac-blue/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-ac-aqua mb-3">
                  <Heart className="w-4 h-4" />
                  The difference it makes
                </div>

                <div className="mb-8">
                  <motion.div
                    key={metrics.totalSavings}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl md:text-6xl font-bold text-ac-aqua leading-none mb-3 break-words"
                  >
                    {formatCurrency(metrics.totalSavings)}
                  </motion.div>
                  <p className="text-white/70 font-light">
                    could be reinvested into care for the {formatNumber(residents)} residents you
                    look after — alongside the injuries, upset and upheaval your team helps avoid.
                  </p>
                </div>

                <div className="space-y-2 mb-8">
                  <BreakdownRow
                    label="Kinder, calmer care days"
                    value={metrics.careCostSavings}
                    icon={<ShieldCheck className="w-4 h-4" />}
                  />
                  <BreakdownRow
                    label="Legal action avoided"
                    value={metrics.lawsuitSavings}
                    icon={<Gavel className="w-4 h-4" />}
                  />
                  <BreakdownRow
                    label="Residents who stay with you"
                    value={metrics.retentionSavings}
                    icon={<Home className="w-4 h-4" />}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-10">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-ac-aqua mb-1">
                      Each month
                    </div>
                    <div className="text-xl md:text-2xl font-bold">
                      {formatCurrency(metrics.monthlySavings)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-ac-aqua mb-1">
                      Per resident
                    </div>
                    <div className="text-xl md:text-2xl font-bold">
                      {formatCurrency(metrics.perResidentSavings)}
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <p className="text-white/80 font-light mb-5 leading-relaxed text-sm">
                    We&rsquo;d love to walk through these numbers with your team — and, more
                    importantly, hear about the people behind them.
                  </p>
                  <Link href="/contact" className="block">
                    <Button
                      size="lg"
                      className="w-full rounded-full bg-ac-aqua text-ac-black hover:bg-white hover:text-ac-black font-bold text-base h-13 group"
                    >
                      Start the conversation
                      <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-ac-grey/40 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-ac-black mb-4">
              Every fall prevented is a grandparent who gets to keep their independence.
            </h2>
            <p className="text-lg font-light text-ac-black/70 mb-8">
              The numbers matter — but they&rsquo;re really about mums, dads and grandparents
              staying steady on their feet for longer. We&rsquo;d be grateful to share how
              Able Care can support your team, your residents and their families.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="rounded-full px-10 font-bold text-base h-13 bg-ac-blue hover:bg-ac-blue/90 text-white"
              >
                Talk with our team
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function BreakdownRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-white/10 last:border-b-0">
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span className="text-ac-aqua">{icon}</span>
        {label}
      </div>
      <div className="text-base md:text-lg font-bold text-white">{formatCurrency(value)}</div>
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  sliderMax: number;
  step: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
}

function NumberField({
  id,
  label,
  icon,
  value,
  onChange,
  min,
  max,
  sliderMax,
  step,
  prefix,
  suffix,
  hint,
}: NumberFieldProps) {
  const handleChange = (raw: string) => {
    const parsed = raw === "" ? 0 : Number(raw.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
  };

  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-bold text-ac-black mb-3">
        {icon}
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ac-black/50 font-semibold pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => handleChange(e.target.value)}
          className={`w-full h-12 rounded-xl border border-ac-grey bg-white text-ac-black text-xl font-bold focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20 focus:outline-none transition-colors ${
            prefix ? "pl-9 pr-4" : "px-4"
          } ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ac-black/50 font-semibold pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={Math.max(sliderMax, value)}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-3 accent-ac-blue cursor-pointer"
        aria-label={`${label} slider`}
      />
      {hint && <p className="text-xs text-ac-black/60 font-light mt-2 leading-snug">{hint}</p>}
    </div>
  );
}
