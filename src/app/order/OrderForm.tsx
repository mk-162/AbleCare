"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Receipt, Truck, Cpu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const SENSOR_PRICE = 199;
const ANNUAL_SUB_PRICE = 360;
const SHIPPING_COST = 39.95;
const PER_SENSOR_TOTAL = SENSOR_PRICE + ANNUAL_SUB_PRICE;

const CONTACT_EMAIL = "hello@able-care.co";
const CONTACT_PHONE = "+1 406 318 9624";

type Mode = "estimate" | "invoice";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.max(0, value));
}

export function OrderForm() {
  const [mode, setMode] = useState<Mode>("estimate");

  return (
    <>
      <section className="bg-ac-blue text-white pt-20 pb-8 md:pt-24 md:pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ac-aqua mb-3">
              <ShoppingCart className="w-3.5 h-3.5" />
              Order Form
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
              Order Able Assess.
            </h1>
            <p className="text-sm md:text-base font-light text-white/85 leading-relaxed">
              Request a price estimate or send a purchase invoice request. Our team will follow up
              to confirm and ship.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col items-center mb-10">
            <div
              role="tablist"
              aria-label="Choose how you'd like to proceed"
              className="inline-flex p-1.5 bg-ac-grey/60 rounded-full"
            >
              <button
                role="tab"
                aria-selected={mode === "estimate"}
                onClick={() => setMode("estimate")}
                className={`flex items-center gap-2 px-5 md:px-7 py-3 rounded-full text-sm md:text-base font-bold transition-all ${
                  mode === "estimate"
                    ? "bg-ac-blue text-white shadow-md"
                    : "text-ac-black/70 hover:text-ac-black"
                }`}
              >
                <FileText className="w-4 h-4" />
                I would like a price estimate
              </button>
              <button
                role="tab"
                aria-selected={mode === "invoice"}
                onClick={() => setMode("invoice")}
                className={`flex items-center gap-2 px-5 md:px-7 py-3 rounded-full text-sm md:text-base font-bold transition-all ${
                  mode === "invoice"
                    ? "bg-ac-blue text-white shadow-md"
                    : "text-ac-black/70 hover:text-ac-black"
                }`}
              >
                <Receipt className="w-4 h-4" />
                I am ready to purchase, please send an invoice
              </button>
            </div>
          </div>

          {mode === "estimate" ? <EstimateForm /> : <InvoiceForm />}
        </div>
      </section>

      <section className="bg-ac-grey/40 py-12 md:py-16 border-t border-ac-grey">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold text-ac-black mb-3">
              Need help with your order?
            </h2>
            <p className="text-base font-light text-ac-black/70 mb-1">
              Email{" "}
              <a className="text-ac-blue font-semibold" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>{" "}
              or call{" "}
              <a className="text-ac-blue font-semibold" href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>
                {CONTACT_PHONE}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function EstimateForm() {
  const [naSensors, setNaSensors] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl p-8 md:p-10 border border-ac-grey shadow-sm"
    >
      <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-2">
        Price estimate
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-2">
        Tell us a little about your organization
      </h2>
      <p className="text-sm text-ac-black/60 font-light mb-8">
        We&rsquo;ll come back to you with pricing tailored to your order.
      </p>

      <form className="space-y-6" action="/thank-you" method="GET">
        <input type="hidden" name="form" value="order-estimate" />

        <Field
          id="customerName"
          name="customerName"
          label="Organization Name"
          placeholder="e.g. Acme Home Care"
          required
        />

        <Field
          id="individualName"
          name="individualName"
          label="Individual Name"
          placeholder="Jane Doe"
          required
        />

        <div className="grid md:grid-cols-2 gap-6">
          <Field
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            placeholder="(555) 123-4567"
            required
          />
          <Field
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="jane@acmehomecare.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sensorCount" className="block text-sm font-bold text-ac-black">
            Number of sensors I could potentially be interested in
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              id="sensorCount"
              name="sensorCount"
              type="number"
              min={0}
              disabled={naSensors}
              placeholder="e.g. 5"
              className="flex h-12 w-full sm:w-48 rounded-xl border border-black/10 bg-ac-grey/30 px-4 text-base font-semibold text-ac-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label className="inline-flex items-center gap-2 text-sm text-ac-black/80 cursor-pointer select-none">
              <input
                type="checkbox"
                name="sensorCountNA"
                checked={naSensors}
                onChange={(e) => setNaSensors(e.target.checked)}
                className="w-4 h-4 rounded border-ac-black/20 text-ac-blue focus:ring-ac-aqua"
              />
              I&rsquo;m not sure yet (N/A)
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold text-lg h-13"
        >
          Request a price estimate
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </form>
    </motion.div>
  );
}

function InvoiceForm() {
  const [sensorCount, setSensorCount] = useState<number>(1);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const totals = useMemo(() => {
    const qty = Math.max(0, Math.floor(sensorCount || 0));
    const sensorsLine = SENSOR_PRICE * qty;
    const subscriptionLine = ANNUAL_SUB_PRICE * qty;
    const shipping = qty > 0 ? SHIPPING_COST : 0;
    const total = sensorsLine + subscriptionLine + shipping;
    return { qty, sensorsLine, subscriptionLine, shipping, total };
  }, [sensorCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl p-8 md:p-10 border border-ac-grey shadow-sm"
    >
      <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-2">
        Request an invoice
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-2">
        Ready to purchase
      </h2>
      <p className="text-sm text-ac-black/60 font-light mb-8">
        Provide your billing and shipping details and we&rsquo;ll send an invoice to your inbox.
      </p>

      <form className="space-y-10" action="/thank-you" method="GET">
        <input type="hidden" name="form" value="order-invoice" />

        <fieldset className="space-y-6">
          <legend className="text-base font-bold text-ac-black mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ac-blue text-white text-xs font-bold">
              1
            </span>
            Bill To
          </legend>

          <Field
            id="billCustomer"
            name="billCustomer"
            label="Customer Name (Organization)"
            placeholder="Acme Home Care"
            required
          />
          <Field
            id="billIndividual"
            name="billIndividual"
            label="Individual Name"
            placeholder="Jane Doe"
            required
          />
          <div className="space-y-2">
            <label htmlFor="billAddress" className="block text-sm font-bold text-ac-black">
              Mailing Address
            </label>
            <textarea
              id="billAddress"
              name="billAddress"
              rows={3}
              required
              placeholder={"Street\nCity, State ZIP"}
              className="flex w-full rounded-xl border border-black/10 bg-ac-grey/30 px-4 py-3 text-base text-ac-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2 resize-y"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Field
              id="billPhone"
              name="billPhone"
              type="tel"
              label="Phone Number"
              placeholder="(555) 123-4567"
              required
            />
            <Field
              id="billEmail"
              name="billEmail"
              type="email"
              label="Email"
              placeholder="jane@acmehomecare.com"
              required
            />
          </div>
        </fieldset>

        <fieldset className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <legend className="text-base font-bold text-ac-black flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ac-blue text-white text-xs font-bold">
                2
              </span>
              Ship To
            </legend>
            <label className="inline-flex items-center gap-2 text-sm text-ac-black/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(e) => setSameAsBilling(e.target.checked)}
                className="w-4 h-4 rounded border-ac-black/20 text-ac-blue focus:ring-ac-aqua"
              />
              Same as billing
            </label>
          </div>

          {!sameAsBilling && (
            <>
              <Field
                id="shipCustomer"
                name="shipCustomer"
                label="Customer Name (Organization)"
                placeholder="Acme Home Care"
                required
              />
              <Field
                id="shipIndividual"
                name="shipIndividual"
                label="Individual Name"
                placeholder="Jane Doe"
                required
              />
              <div className="space-y-2">
                <label htmlFor="shipAddress" className="block text-sm font-bold text-ac-black">
                  Mailing Address
                </label>
                <textarea
                  id="shipAddress"
                  name="shipAddress"
                  rows={3}
                  required
                  placeholder={"Street\nCity, State ZIP"}
                  className="flex w-full rounded-xl border border-black/10 bg-ac-grey/30 px-4 py-3 text-base text-ac-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2 resize-y"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Field
                  id="shipPhone"
                  name="shipPhone"
                  type="tel"
                  label="Phone Number"
                  placeholder="(555) 123-4567"
                  required
                />
                <Field
                  id="shipEmail"
                  name="shipEmail"
                  type="email"
                  label="Email"
                  placeholder="jane@acmehomecare.com"
                  required
                />
              </div>
            </>
          )}
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="text-base font-bold text-ac-black mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ac-blue text-white text-xs font-bold">
              3
            </span>
            Sensors &amp; Total
          </legend>

          <div className="space-y-2">
            <label htmlFor="invoiceSensorCount" className="block text-sm font-bold text-ac-black">
              Number of sensors
            </label>
            <input
              id="invoiceSensorCount"
              name="sensorCount"
              type="number"
              min={1}
              required
              value={sensorCount}
              onChange={(e) => setSensorCount(Number(e.target.value))}
              className="flex h-12 w-full sm:w-48 rounded-xl border border-black/10 bg-ac-grey/30 px-4 text-base font-semibold text-ac-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
            />
          </div>

          <PriceTable totals={totals} />

          <div className="pt-4">
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-ac-blue/20 bg-ac-blue/5 cursor-pointer">
              <input
                type="checkbox"
                name="confirmInvoice"
                required
                className="mt-1 w-5 h-5 rounded border-ac-black/20 text-ac-blue focus:ring-ac-aqua"
              />
              <span className="text-sm md:text-base text-ac-black font-medium leading-snug">
                Please send me an invoice for{" "}
                <span className="font-bold text-ac-blue">
                  {formatCurrency(totals.total)}
                </span>
                .
              </span>
            </label>
          </div>
        </fieldset>

        <Button
          type="submit"
          className="w-full bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold text-lg h-13"
        >
          Request invoice
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </form>
    </motion.div>
  );
}

function PriceTable({
  totals,
}: {
  totals: { qty: number; sensorsLine: number; subscriptionLine: number; shipping: number; total: number };
}) {
  const { qty, sensorsLine, subscriptionLine, shipping, total } = totals;

  return (
    <div className="rounded-2xl border border-ac-grey overflow-hidden">
      <table className="w-full text-sm md:text-base">
        <thead className="bg-ac-grey/40 text-ac-black">
          <tr>
            <th className="text-left font-bold px-4 py-3">Item</th>
            <th className="text-left font-bold px-4 py-3 hidden sm:table-cell">Description</th>
            <th className="text-right font-bold px-4 py-3 w-16">Qty</th>
            <th className="text-right font-bold px-4 py-3 w-24">Price</th>
            <th className="text-right font-bold px-4 py-3 w-28">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ac-grey">
          <tr>
            <td className="px-4 py-3 align-top">
              <div className="flex items-center gap-2 font-semibold text-ac-black">
                <Cpu className="w-4 h-4 text-ac-blue" />
                Able Assess Sensor
              </div>
            </td>
            <td className="px-4 py-3 align-top text-ac-black/70 hidden sm:table-cell">
              Hardware sensor for falls screening
            </td>
            <td className="px-4 py-3 align-top text-right tabular-nums">{qty}</td>
            <td className="px-4 py-3 align-top text-right tabular-nums">
              {formatCurrency(SENSOR_PRICE)}
            </td>
            <td className="px-4 py-3 align-top text-right tabular-nums font-semibold">
              {formatCurrency(sensorsLine)}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 align-top">
              <div className="flex items-center gap-2 font-semibold text-ac-black">
                <FileText className="w-4 h-4 text-ac-blue" />
                Able Assess Data Sub
              </div>
            </td>
            <td className="px-4 py-3 align-top text-ac-black/70 hidden sm:table-cell">
              Annual subscription &mdash; 1 year
            </td>
            <td className="px-4 py-3 align-top text-right tabular-nums">{qty}</td>
            <td className="px-4 py-3 align-top text-right tabular-nums">
              {formatCurrency(ANNUAL_SUB_PRICE)}
            </td>
            <td className="px-4 py-3 align-top text-right tabular-nums font-semibold">
              {formatCurrency(subscriptionLine)}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 align-top">
              <div className="flex items-center gap-2 font-semibold text-ac-black">
                <Truck className="w-4 h-4 text-ac-blue" />
                Shipping
              </div>
            </td>
            <td className="px-4 py-3 align-top text-ac-black/70 hidden sm:table-cell">
              Standard shipping (flat fee)
            </td>
            <td className="px-4 py-3 align-top text-right tabular-nums">1</td>
            <td className="px-4 py-3 align-top text-right tabular-nums">
              {formatCurrency(SHIPPING_COST)}
            </td>
            <td className="px-4 py-3 align-top text-right tabular-nums font-semibold">
              {formatCurrency(shipping)}
            </td>
          </tr>
        </tbody>
        <tfoot className="bg-ac-blue/5">
          <tr>
            <td colSpan={4} className="px-4 py-4 text-right font-bold text-ac-black">
              Total Due
            </td>
            <td className="px-4 py-4 text-right font-bold text-ac-blue tabular-nums text-lg">
              {formatCurrency(total)}
            </td>
          </tr>
        </tfoot>
      </table>
      <p className="text-xs text-ac-black/60 px-4 py-3 bg-white border-t border-ac-grey">
        Per sensor: {formatCurrency(PER_SENSOR_TOTAL)} (hardware + 1-year subscription). Shipping is
        a flat {formatCurrency(SHIPPING_COST)} regardless of quantity.
      </p>
    </div>
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
        className="flex h-12 w-full rounded-xl border border-black/10 bg-ac-grey/30 px-4 text-base text-ac-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
      />
    </div>
  );
}
