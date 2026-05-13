"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Cpu,
  FileText,
  Receipt,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SENSOR_PRICE = 199;
const ANNUAL_SUB_PRICE = 499;
const SHIPPING_COST = 39.95;

const FREE_SENSOR_REFERRAL_CODES = ["SGFreeSensor", "LLFreeSensor"] as const;
const FREE_SENSOR_CODES_NORMALIZED = new Set(
  FREE_SENSOR_REFERRAL_CODES.map((code) => code.toLowerCase()),
);

function isFreeSensorCode(code: string): boolean {
  return FREE_SENSOR_CODES_NORMALIZED.has(code.trim().toLowerCase());
}

const CONTACT_EMAIL = "hello@able-care.co";
const CONTACT_PHONE = "+1 406 318 9624";

type DocumentType = "estimate" | "invoice";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.max(0, value));
}

export function OrderForm() {
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
              Tell us how many sensors you need and we&rsquo;ll email a formal estimate or
              invoice. Our team will follow up to confirm and ship.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <UnifiedOrderForm />
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

function UnifiedOrderForm() {
  const router = useRouter();
  const [sensorCountInput, setSensorCountInput] = useState<string>("1");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [documentType, setDocumentType] = useState<DocumentType>("estimate");
  const [referralCode, setReferralCode] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sensorFree = isFreeSensorCode(referralCode);
  const sensorUnitPrice = sensorFree ? 0 : SENSOR_PRICE;

  const totals = useMemo(() => {
    const qty = Math.max(0, Math.floor(Number(sensorCountInput) || 0));
    const sensorListLine = SENSOR_PRICE * qty;
    const sensorsLine = sensorUnitPrice * qty;
    const subscriptionLine = ANNUAL_SUB_PRICE * qty;
    const shipping = qty > 0 ? SHIPPING_COST : 0;
    const total = sensorsLine + subscriptionLine + shipping;
    return {
      qty,
      sensorListLine,
      sensorsLine,
      subscriptionLine,
      shipping,
      total,
    };
  }, [sensorCountInput, sensorUnitPrice]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setErrorMessage(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") payload[key] = value;
    });

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let serverError: string | undefined;
        try {
          const data = (await response.json()) as { error?: string };
          serverError = data.error;
        } catch (parseErr) {
          console.error("[order] response not JSON", response.status, parseErr);
        }
        setErrorMessage(
          serverError ||
            (response.status >= 500
              ? `Our server hit an error (${response.status}). Please try again or email hello@able-care.co.`
              : `Request failed (${response.status}). Please check your details and try again.`),
        );
        setSubmitting(false);
        return;
      }
      router.push("/thank-you");
    } catch (err) {
      console.error("[order] submit failed", err);
      setErrorMessage(
        "We couldn't reach our server. Check your connection and try again, or email hello@able-care.co.",
      );
      setSubmitting(false);
    }
  }

  const submitLabel =
    documentType === "estimate" ? "Request a formal estimate" : "Request an invoice";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl p-8 md:p-10 border border-ac-grey shadow-sm"
    >
      <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-2">
        Place your order
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-2">
        Tell us where to ship and what to send.
      </h2>
      <p className="text-sm text-ac-black/60 font-light mb-8">
        Submit the form and we&rsquo;ll email a formal estimate or invoice &mdash; whichever you
        choose &mdash; to confirm. Have a referral code? Enter it below.
      </p>

      <form className="space-y-10" onSubmit={handleSubmit}>
        <input type="hidden" name="documentType" value={documentType} />

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
              <span className="text-ac-blue ml-1">*</span>
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
                  <span className="text-ac-blue ml-1">*</span>
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
              <span className="text-ac-blue ml-1">*</span>
            </label>
            <input
              id="invoiceSensorCount"
              name="sensorCount"
              type="number"
              inputMode="numeric"
              min={1}
              required
              value={sensorCountInput}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => {
                const raw = e.target.value;
                const cleaned = raw === "" ? "" : raw.replace(/^0+(?=\d)/, "");
                setSensorCountInput(cleaned);
              }}
              className="flex h-12 w-full sm:w-48 rounded-xl border border-black/10 bg-ac-grey/30 px-4 text-base font-semibold text-ac-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
            />
          </div>

          <ReferralCodeField
            value={referralCode}
            onChange={setReferralCode}
            sensorFree={sensorFree}
          />

          {sensorFree ? (
            <PriceTable totals={totals} sensorFree={sensorFree} />
          ) : (
            <PricingHiddenNote />
          )}

          <p className="text-xs text-ac-black/60 italic">
            Price also includes applicable state tax which will be reflected on estimate/invoice.
          </p>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-base font-bold text-ac-black mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ac-blue text-white text-xs font-bold">
              4
            </span>
            What should we email you?
          </legend>
          <p className="text-sm text-ac-black/60 font-light -mt-2 mb-2">
            Choose how you&rsquo;d like us to confirm your order in writing.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <DocumentTypeOption
              value="estimate"
              checked={documentType === "estimate"}
              onChange={setDocumentType}
              icon={<FileText className="w-5 h-5" />}
              title="Send me a formal estimate"
              description="A signed, dated estimate emailed to you for approval — no obligation to buy yet."
            />
            <DocumentTypeOption
              value="invoice"
              checked={documentType === "invoice"}
              onChange={setDocumentType}
              icon={<Receipt className="w-5 h-5" />}
              title="I’m ready — send me an invoice"
              description="An invoice for the total above, ready to pay so we can ship."
            />
          </div>
        </fieldset>

        {errorMessage && (
          <p
            role="alert"
            className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2"
          >
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold text-lg h-13 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending…" : submitLabel}
          {!submitting && <ArrowRight className="w-5 h-5 ml-1" />}
        </Button>
      </form>
    </motion.div>
  );
}

function PricingHiddenNote() {
  return (
    <div className="rounded-2xl border border-ac-grey bg-ac-grey/20 p-4 md:p-5 text-sm text-ac-black/70 font-light">
      We&rsquo;ll confirm your pricing in the formal estimate or invoice once we receive your
      request.
    </div>
  );
}

function ReferralCodeField({
  value,
  onChange,
  sensorFree,
}: {
  value: string;
  onChange: (value: string) => void;
  sensorFree: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor="referralCode" className="block text-sm font-bold text-ac-black">
        Referral code{" "}
        <span className="text-ac-black/50 font-normal">(optional)</span>
      </label>
      <input
        id="referralCode"
        name="referralCode"
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a referral code if you have one"
        className="flex h-12 w-full sm:max-w-md rounded-xl border border-black/10 bg-ac-grey/30 px-4 text-base text-ac-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ac-aqua focus-visible:ring-offset-2"
      />
      {sensorFree && (
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-ac-blue">
          <BadgeCheck className="w-4 h-4" />
          Referral applied &mdash; sensor hardware is free.
        </div>
      )}
    </div>
  );
}

function PriceTable({
  totals,
  sensorFree,
}: {
  totals: {
    qty: number;
    sensorListLine: number;
    sensorsLine: number;
    subscriptionLine: number;
    shipping: number;
    total: number;
  };
  sensorFree: boolean;
}) {
  const { qty, sensorListLine, sensorsLine, subscriptionLine, shipping, total } = totals;

  return (
    <div className="rounded-2xl border border-ac-grey overflow-hidden">
      <table className="w-full text-sm md:text-base">
        <thead className="bg-ac-grey/40 text-ac-black">
          <tr>
            <th className="text-left font-bold px-4 py-3">Item</th>
            <th className="text-left font-bold px-4 py-3 hidden sm:table-cell">Description</th>
            <th className="text-right font-bold px-4 py-3 w-16">Qty</th>
            <th className="text-right font-bold px-4 py-3 w-28">Price</th>
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
              {sensorFree && (
                <span className="block text-xs text-ac-blue font-semibold mt-0.5">
                  Free with referral code
                </span>
              )}
            </td>
            <td className="px-4 py-3 align-top text-right tabular-nums">{qty}</td>
            <td className="px-4 py-3 align-top text-right tabular-nums">
              {sensorFree ? (
                <>
                  <span className="block text-xs text-ac-black/50 line-through">
                    {formatCurrency(SENSOR_PRICE)}
                  </span>
                  <span className="block">{formatCurrency(0)}</span>
                </>
              ) : (
                formatCurrency(SENSOR_PRICE)
              )}
            </td>
            <td className="px-4 py-3 align-top text-right tabular-nums font-semibold">
              {sensorFree ? (
                <>
                  <span className="block text-xs text-ac-black/50 line-through font-normal">
                    {formatCurrency(sensorListLine)}
                  </span>
                  <span className="block">{formatCurrency(sensorsLine)}</span>
                </>
              ) : (
                formatCurrency(sensorsLine)
              )}
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
    </div>
  );
}

interface DocumentTypeOptionProps {
  value: DocumentType;
  checked: boolean;
  onChange: (value: DocumentType) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function DocumentTypeOption({
  value,
  checked,
  onChange,
  icon,
  title,
  description,
}: DocumentTypeOptionProps) {
  return (
    <label
      className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
        checked
          ? "border-ac-blue bg-ac-blue/5 ring-2 ring-ac-blue/30"
          : "border-ac-grey bg-white hover:border-ac-blue/40"
      }`}
    >
      <input
        type="radio"
        name="documentTypeChoice"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 w-4 h-4 border-ac-black/20 text-ac-blue focus:ring-ac-aqua"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 font-bold text-ac-black mb-1">
          <span className="text-ac-blue">{icon}</span>
          <span>{title}</span>
        </div>
        <p className="text-sm text-ac-black/70 font-light leading-snug">{description}</p>
      </div>
    </label>
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
