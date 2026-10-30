"use client";

import { Check, ExternalLink, Lock, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCardStates, useOnboarding } from "@/components/onboarding/OnboardingState";
import { SUPPORT_EMAIL, checklist, order, type ChecklistItem } from "@/components/onboarding/demo-data";
import { PageIntro, Panel, StatusPill } from "@/components/onboarding/ui";

function ChecklistGroup({
  title,
  subtitle,
  items,
  checked,
  onToggle,
  locked = false,
}: {
  title: string;
  subtitle: string;
  items: ChecklistItem[];
  checked: string[];
  onToggle: (id: string) => void;
  locked?: boolean;
}) {
  const done = items.filter((i) => checked.includes(i.id)).length;
  return (
    <section>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            {locked && <Lock className="h-4 w-4 text-ac-black/40" aria-hidden="true" />}
            {title}
          </h2>
          <p className="text-sm text-ac-black/60">{subtitle}</p>
        </div>
        {!locked && (
          <span className="shrink-0 text-sm font-bold text-ac-blue">
            {done} of {items.length} done
          </span>
        )}
      </div>
      <ul className="space-y-3">
        {items.map((item) => {
          const isChecked = checked.includes(item.id);
          return (
            <li key={item.id}>
              <div
                className={cn(
                  "flex gap-4 rounded-xl border p-4 transition-colors",
                  locked ? "border-dashed border-black/15 bg-ac-grey/20" : isChecked ? "border-ac-aqua bg-ac-aqua/10" : "border-black/10"
                )}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  aria-label={item.title}
                  disabled={locked}
                  onClick={() => onToggle(item.id)}
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                    isChecked ? "border-ac-blue bg-ac-blue text-white" : "border-ac-black/25 hover:border-ac-blue"
                  )}
                >
                  {isChecked && <Check className="h-4 w-4" aria-hidden="true" />}
                </button>
                <div className={cn(locked && "opacity-60")}>
                  <div className={cn("font-semibold", isChecked && "text-ac-black/50 line-through")}>{item.title}</div>
                  <p className="text-sm text-ac-black/60">{item.detail}</p>
                  {item.link && !locked && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-ac-blue"
                    >
                      {item.link.label} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function DeliveryPage() {
  const { data, toggleCheck } = useOnboarding();
  const cards = useCardStates();
  const inTransit = data.delivery === "in_transit";
  const reached = inTransit ? 3 : order.timeline.length;

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <PageIntro
        eyebrow="Step 1 · Your delivery"
        title={inTransit ? "Your kit is on its way" : "Your kit has arrived"}
        description="Track your order here, and use the time before it arrives to get your devices and team ready."
        aside={<StatusPill status={cards.delivery.status} label={cards.delivery.label} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold">Order tracking</h2>
          <ol className="relative mb-8 space-y-6 border-l-2 border-ac-grey pl-6">
            {order.timeline.map((step, i) => {
              const done = i < reached;
              const current = i === reached - 1;
              return (
                <li key={step.key} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[33px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white",
                      done ? "bg-ac-blue" : "bg-ac-grey"
                    )}
                    aria-hidden="true"
                  />
                  <div className={cn("font-semibold", !done && "text-ac-black/40", current && "text-ac-blue")}>
                    {step.label}
                  </div>
                  <div className="text-sm text-ac-black/50">
                    {done ? step.date : `Expected ${step.date}`}
                  </div>
                </li>
              );
            })}
          </ol>

          <dl className="space-y-4 border-t border-black/5 pt-6 text-sm">
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-ac-blue" aria-hidden="true" />
              <div>
                <dt className="font-semibold">
                  {order.kits} × Able Assess kit · {order.reference}
                </dt>
                <dd className="text-ac-black/60">
                  {order.carrier} tracking{" "}
                  <a
                    href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-ac-blue underline underline-offset-2"
                  >
                    {order.trackingNumber} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ac-blue" aria-hidden="true" />
              <div>
                <dt className="font-semibold">Delivering to</dt>
                <dd className="text-ac-black/60">{order.address}</dd>
              </div>
            </div>
          </dl>
          <p className="mt-6 rounded-xl bg-ac-grey/40 p-4 text-sm text-ac-black/70">
            Something missing or damaged? Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-ac-blue">
              {SUPPORT_EMAIL}
            </a>{" "}
            with your GripAble serial number (it starts with FLEX and is printed underneath).
          </p>
        </Panel>

        <Panel className="space-y-8 lg:col-span-3">
          <ChecklistGroup
            title="Get ready while you wait"
            subtitle="About 15 minutes. You can do these before your kit arrives."
            items={checklist.filter((c) => c.when === "before")}
            checked={data.checked}
            onToggle={toggleCheck}
          />
          <ChecklistGroup
            title="When your kit arrives"
            subtitle={
              inTransit
                ? `These unlock when your kit is delivered (expected ${order.timeline[order.timeline.length - 1].date}).`
                : "Do these as soon as you unpack, ideally the day before your session."
            }
            items={checklist.filter((c) => c.when === "arrival")}
            checked={data.checked}
            onToggle={toggleCheck}
            locked={inTransit}
          />
          <p className="mt-6 rounded-xl border border-ac-blue/20 bg-ac-blue/5 p-4 text-sm">
            <strong>Tell your staff:</strong> tap <strong>Sign in</strong> in the app with the email your admin adds for
            them. &quot;Create new account&quot; makes a separate account that can&apos;t see your clients.
          </p>
        </Panel>
      </div>
    </div>
  );
}
