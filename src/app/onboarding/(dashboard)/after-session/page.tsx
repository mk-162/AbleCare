"use client";

import Link from "next/link";
import { CalendarCheck, CheckCircle2, Download, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCardStates, useOnboarding } from "@/components/onboarding/OnboardingState";
import { afterSessionResources, sessionHosts } from "@/components/onboarding/demo-data";
import { PageIntro, Panel, StatusPill, primaryButton, secondaryButton } from "@/components/onboarding/ui";

const checkIns = [
  { n: 1, title: "Check-in 1", when: "Two weeks after your session", text: "15 minutes to review your first screenings and answer questions." },
  { n: 2, title: "Check-in 2", when: "Two weeks after Check-in 1", text: "15 minutes to make sure screening is part of your team's routine." },
];

export default function AfterSessionPage() {
  const { data, update } = useOnboarding();
  const cards = useCardStates();
  const salesManager = sessionHosts.standard[0];

  if (data.session !== "done") {
    return (
      <div className="container mx-auto px-4 py-10 md:px-6">
        <PageIntro
          eyebrow="Step 5 · After your session"
          title="This step opens after your session"
          aside={<StatusPill status={cards.after.status} label={cards.after.label} />}
        />
        <Panel className="max-w-2xl">
          <Lock className="mb-4 h-10 w-10 text-ac-black/30" aria-hidden="true" />
          <p className="font-light text-ac-black/70">
            Once your onboarding session has happened, your recording, resources for clients and families, and your
            check-in calls will appear here.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding/book" className={secondaryButton}>
              View your booking
            </Link>
            <button type="button" onClick={() => update({ session: "done" })} className={secondaryButton}>
              Demo: mark the session as done
            </button>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <PageIntro
        eyebrow="Step 5 · After your session"
        title={data.checkIns >= 2 ? "You're all set" : "Great to meet you all"}
        description="Everything from your onboarding session is here, along with two short check-ins over the next month."
        aside={<StatusPill status={cards.after.status} label={cards.after.label} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-xl font-bold">Your session recording</h2>
          <a
            href="#"
            className="flex items-center gap-4 rounded-xl bg-ac-blue p-5 text-white transition-opacity hover:opacity-90"
          >
            <PlayCircle className="h-12 w-12 shrink-0 text-ac-aqua" aria-hidden="true" />
            <span>
              <span className="block font-bold">Onboarding session · {data.booking?.day ?? "Nov 10"}</span>
              <span className="block text-sm text-white/70">Recording, 45 minutes</span>
            </span>
          </a>

          <h2 className="mb-4 mt-8 text-xl font-bold">Resources</h2>
          <ul className="space-y-3">
            {afterSessionResources.map((r) => (
              <li key={r.title}>
                <a href="#" className="flex items-center gap-4 rounded-xl border border-black/10 p-4 transition-colors hover:border-ac-blue">
                  <Download className="h-5 w-5 shrink-0 text-ac-blue" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold">{r.title}</span>
                    <span className="block text-sm text-ac-black/60">{r.description}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          {checkIns.map((c) => {
            const booked = data.checkIns >= c.n;
            const available = data.checkIns >= c.n - 1;
            return (
              <Panel key={c.n} className={cn(!available && "opacity-60")}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold">{c.title}</h2>
                  {booked ? (
                    <StatusPill status="done" label="Done" />
                  ) : available ? (
                    <StatusPill status="todo" label="To book" />
                  ) : (
                    <StatusPill status="locked" label={c.when} />
                  )}
                </div>
                <p className="font-light text-ac-black/70">{c.text}</p>
                <p className="mt-1 text-sm text-ac-black/50">{c.when}</p>
                {available && !booked && (
                  <button type="button" onClick={() => update({ checkIns: c.n })} className={`${primaryButton} mt-5`}>
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" /> Book a 15-minute call
                  </button>
                )}
              </Panel>
            );
          })}

          {data.checkIns >= 2 && (
            <Panel className="ring-2 ring-ac-aqua">
              <CheckCircle2 className="mb-3 h-8 w-8 text-ac-blue" aria-hidden="true" />
              <h2 className="mb-2 text-xl font-bold">Onboarding complete</h2>
              <p className="font-light text-ac-black/70">
                {salesManager.name}, your Sales Manager, is your main contact from here. For product questions, use Help
                or email support@able-care.co any time.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
