"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

type Step = "details" | "payment" | "confirmation";

export function CheckoutPageClient() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>("details");

  const shipping = subtotal >= 250 ? 0 : 14.99;
  const total = subtotal + shipping;

  // Simple form state — no validation needed for templates
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  function handleField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmitDetails(e: React.FormEvent) {
    e.preventDefault();
    setStep("payment");
  }

  function handleSubmitPayment(e: React.FormEvent) {
    e.preventDefault();
    clearCart();
    setStep("confirmation");
  }

  // Step indicator
  const steps: { key: Step; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "payment", label: "Payment" },
    { key: "confirmation", label: "Confirmation" },
  ];

  if (items.length === 0 && step !== "confirmation") {
    return (
      <section className="pt-36 pb-20">
        <div className="max-w-lg mx-auto text-center px-4">
          <h1 className="text-2xl font-bold text-ac-black mb-3">
            Nothing to check out
          </h1>
          <p className="text-ac-black/50 mb-6">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link href="/shop">
            <Button className="rounded-full bg-ac-blue text-white hover:bg-ac-blue/90 font-bold px-8">
              Browse products
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white pt-32 pb-6">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          {/* Progress steps */}
          <nav className="flex items-center justify-center gap-2 mb-8" aria-label="Checkout progress">
            {steps.map((s, i) => {
              const stepIndex = steps.findIndex((x) => x.key === step);
              const done = i < stepIndex;
              const active = s.key === step;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  {i > 0 && (
                    <ChevronRight className="w-4 h-4 text-ac-black/20" />
                  )}
                  <span
                    className={`flex items-center gap-1.5 text-sm font-medium ${
                      active
                        ? "text-ac-blue"
                        : done
                        ? "text-green-600"
                        : "text-ac-black/30"
                    }`}
                  >
                    {done && <Check className="w-4 h-4" />}
                    {s.label}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {step === "confirmation" ? (
            <Confirmation />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Form column */}
              <div className="lg:col-span-3">
                {step === "details" && (
                  <motion.form
                    key="details"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleSubmitDetails}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold text-ac-black">
                      Shipping details
                    </h2>

                    <div className="space-y-4">
                      <InputField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(v) => handleField("email", v)}
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="First name"
                          value={form.firstName}
                          onChange={(v) => handleField("firstName", v)}
                          required
                        />
                        <InputField
                          label="Last name"
                          value={form.lastName}
                          onChange={(v) => handleField("lastName", v)}
                          required
                        />
                      </div>
                      <InputField
                        label="Address"
                        value={form.address}
                        onChange={(v) => handleField("address", v)}
                        required
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <InputField
                          label="City"
                          value={form.city}
                          onChange={(v) => handleField("city", v)}
                          required
                        />
                        <InputField
                          label="State"
                          value={form.state}
                          onChange={(v) => handleField("state", v)}
                          required
                        />
                        <InputField
                          label="ZIP code"
                          value={form.zip}
                          onChange={(v) => handleField("zip", v)}
                          required
                        />
                      </div>
                      <InputField
                        label="Phone (optional)"
                        type="tel"
                        value={form.phone}
                        onChange={(v) => handleField("phone", v)}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-full bg-ac-blue text-white hover:bg-ac-blue/90 font-bold h-12 px-10"
                    >
                      Continue to payment
                    </Button>
                  </motion.form>
                )}

                {step === "payment" && (
                  <motion.form
                    key="payment"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleSubmitPayment}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="text-ac-blue hover:underline text-sm flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                      </button>
                    </div>

                    <h2 className="text-xl font-bold text-ac-black">
                      Payment
                    </h2>

                    <div className="bg-ac-grey/15 rounded-2xl p-6 border border-black/5">
                      <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-4 h-4 text-ac-blue" />
                        <span className="text-sm font-medium text-ac-black/70">
                          Secure payment
                        </span>
                      </div>

                      <div className="space-y-4">
                        <InputField
                          label="Card number"
                          placeholder="1234 5678 9012 3456"
                          value=""
                          onChange={() => {}}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            label="Expiry"
                            placeholder="MM / YY"
                            value=""
                            onChange={() => {}}
                          />
                          <InputField
                            label="CVC"
                            placeholder="123"
                            value=""
                            onChange={() => {}}
                          />
                        </div>
                        <InputField
                          label="Name on card"
                          value=""
                          onChange={() => {}}
                        />
                      </div>

                      <p className="text-xs text-ac-black/35 mt-4">
                        This is a template checkout. No payment will be processed.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-full bg-ac-blue text-white hover:bg-ac-blue/90 font-bold h-12 px-10 gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Place order — ${total.toFixed(2)}
                    </Button>
                  </motion.form>
                )}
              </div>

              {/* Order summary sidebar */}
              <div className="lg:col-span-2">
                <div className="bg-ac-grey/15 rounded-2xl p-6 sticky top-28">
                  <h3 className="font-bold text-ac-black mb-4 text-sm uppercase tracking-wider">
                    Order summary
                  </h3>
                  <ul className="space-y-3 mb-4">
                    {items.map((item) => (
                      <li
                        key={item.slug}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-ac-black/70">
                          {item.name}
                          {item.quantity > 1 && (
                            <span className="text-ac-black/40">
                              {" "}
                              × {item.quantity}
                            </span>
                          )}
                        </span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <dl className="space-y-2 pt-3 border-t border-black/10 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ac-black/60">Subtotal</dt>
                      <dd className="font-medium">${subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ac-black/60">Shipping</dt>
                      <dd className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-black/10 text-base">
                      <dt className="font-bold">Total</dt>
                      <dd className="font-bold">${total.toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ── Reusable input field ────────────────────────────────────────────── */

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ac-black/60 mb-1 block">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-11 px-4 rounded-xl border border-black/10 bg-white text-sm text-ac-black placeholder:text-ac-black/30 focus:outline-none focus:ring-2 focus:ring-ac-blue/30 focus:border-ac-blue/40 transition-all"
      />
    </label>
  );
}

/* ── Order confirmation ──────────────────────────────────────────────── */

function Confirmation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center py-12"
    >
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-ac-black mb-3">
        Order confirmed
      </h1>
      <p className="text-ac-black/60 mb-2 leading-relaxed">
        Thank you for your order. You&apos;ll receive a confirmation email
        shortly with tracking details.
      </p>
      <p className="text-xs text-ac-black/35 mb-8">
        This is a template confirmation. No real order was placed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/shop">
          <Button className="rounded-full bg-ac-blue text-white hover:bg-ac-blue/90 font-bold px-8">
            Continue shopping
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant="outline"
            className="rounded-full border-ac-black/15 text-ac-black hover:bg-ac-grey/30 font-bold px-8"
          >
            Back to home
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
