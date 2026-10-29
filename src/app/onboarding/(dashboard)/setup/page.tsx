"use client";

import { useState } from "react";
import { CheckCircle2, Clock, ExternalLink, FileText } from "lucide-react";
import { useCardStates, useOnboarding } from "@/components/onboarding/OnboardingState";
import { PORTAL_QUICK_START, PORTAL_URL, customer, order } from "@/components/onboarding/demo-data";
import { PageIntro, Panel, StatusPill, primaryButton, secondaryButton } from "@/components/onboarding/ui";

const inputClass =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20";

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ac-black/50">{hint}</p>}
    </div>
  );
}

function SetupForm() {
  const { update } = useOnboarding();
  const [name, setName] = useState(customer.fullName);
  const [email, setEmail] = useState(customer.email);

  return (
    <form
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        update({ setup: "submitted", champion: { name, email } });
      }}
    >
      <Panel className="space-y-8 lg:col-span-2">
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Your organization</h2>
          <Field id="org" label="Organization name" hint="As it should appear in the app and on reports.">
            <input id="org" className={inputClass} defaultValue={customer.organization} required />
          </Field>
          <Field
            id="facilities"
            label="Facilities (optional)"
            hint="One per line, for example each branch or location. You can add these later in the Able Portal."
          >
            <textarea id="facilities" rows={3} className={inputClass} placeholder={"Columbus North\nColumbus South"} />
          </Field>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Your Champion</h2>
            <p className="text-sm text-ac-black/60">
              The person who will lead Able Assess. We&apos;ll make them your admin, so they can add the rest of your team.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field id="champion-name" label="Full name">
              <input id="champion-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field id="champion-role" label="Job title">
              <input id="champion-role" className={inputClass} defaultValue="Director of Care" />
            </Field>
          </div>
          <Field id="champion-email" label="Work email" hint="They'll sign in to the app and the Able Portal with this email.">
            <input
              id="champion-email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Your onboarding session</h2>
          <Field id="invitees" label="Who else should we invite?" hint="Work emails, one per line. Anyone who will run screenings.">
            <textarea id="invitees" rows={3} className={inputClass} placeholder="name@maplegrovehomecare.com" />
          </Field>
          <Field
            id="alerts"
            label="Falls risk alert email (optional)"
            hint="If you'd like an email when a screening result needs follow-up."
          >
            <input id="alerts" type="email" className={inputClass} placeholder="clinical-lead@maplegrovehomecare.com" />
          </Field>
        </section>

        <button type="submit" className={primaryButton}>
          Send to Able Care
        </button>
      </Panel>

      <Panel className="h-fit bg-ac-grey/30">
        <h2 className="mb-1 text-lg font-bold">Agreed in your order</h2>
        <p className="mb-4 text-sm text-ac-black/60">We&apos;ll set these up for you. Reply in Help if anything looks wrong.</p>
        <dl className="space-y-3 text-sm">
          {order.settings.map((s) => (
            <div key={s.label}>
              <dt className="font-semibold">{s.label}</dt>
              <dd className="text-ac-black/70">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </form>
  );
}

export default function SetupPage() {
  const { data, update } = useOnboarding();
  const cards = useCardStates();

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <PageIntro
        eyebrow="Step 2 · Organization and team"
        title="Set up your organization"
        description="Tell us a few details and who will lead Able Assess. We'll create your organization and their admin account."
        aside={<StatusPill status={cards.setup.status} label={cards.setup.label} />}
      />

      {data.setup === "todo" && <SetupForm />}

      {data.setup === "submitted" && (
        <Panel className="max-w-2xl">
          <Clock className="mb-4 h-10 w-10 text-ac-blue" aria-hidden="true" />
          <h2 className="mb-2 text-2xl font-bold">Thanks, we&apos;ve got your details</h2>
          <p className="font-light text-ac-black/70">
            We&apos;re creating {customer.organization} and an admin account for {data.champion?.name ?? "your Champion"}.
            This usually takes one business day. We&apos;ll email you when it&apos;s ready, and this step will update.
          </p>
          <div className="mt-6 rounded-xl border border-dashed border-ac-black/20 p-4 text-sm text-ac-black/60">
            <strong className="text-ac-black">Demo:</strong> in the pilot, this sends a task to Customer Success in
            Salesforce. When the account is created, the card moves on.
            <button type="button" onClick={() => update({ setup: "ready" })} className={`${secondaryButton} mt-3 w-full`}>
              Mark the account as ready
            </button>
          </div>
        </Panel>
      )}

      {data.setup === "ready" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel>
            <CheckCircle2 className="mb-4 h-10 w-10 text-ac-blue" aria-hidden="true" />
            <h2 className="mb-2 text-2xl font-bold">Your account is ready</h2>
            <p className="font-light text-ac-black/70">
              {data.champion?.name ?? "Your Champion"} can now sign in to the Able Assess app and the Able Portal with{" "}
              <strong className="font-semibold text-ac-black">{data.champion?.email ?? customer.email}</strong>. A one-time
              passcode is emailed each time you log in to the Able Portal.
            </p>
          </Panel>
          <Panel>
            <h2 className="mb-4 text-xl font-bold">Next: add your staff</h2>
            <ol className="mb-6 space-y-3">
              {[
                "Log in to the Able Portal with your admin email.",
                "Add your Facilities (optional), one per branch or group.",
                "Add each staff member as a Provider, using their work email.",
                'Ask your staff to tap Sign in in the app, not "Create new account".',
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ac-blue text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-3">
              <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={primaryButton}>
                Open the Able Portal <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={PORTAL_QUICK_START} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                <FileText className="h-4 w-4" aria-hidden="true" /> Able Portal Quick Start
              </a>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
