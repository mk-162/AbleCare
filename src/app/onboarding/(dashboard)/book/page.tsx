"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Clock, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCardStates, useOnboarding } from "@/components/onboarding/OnboardingState";
import { sessionHosts, sessionSlots } from "@/components/onboarding/demo-data";
import { PageIntro, Panel, StatusPill, primaryButton, secondaryButton } from "@/components/onboarding/ui";

function Hosts() {
  const { data } = useOnboarding();
  const hosts = sessionHosts[data.tier];
  return (
    <Panel className="h-fit">
      <h2 className="mb-1 text-lg font-bold">You&apos;ll meet</h2>
      <p className="mb-5 text-sm text-ac-black/60">45 minutes on video, with your Champion and anyone who will run screenings.</p>
      <ul className="space-y-4">
        {hosts.map((h) => (
          <li key={h.name} className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ac-blue font-bold text-white">
              {h.initials}
            </span>
            <div>
              <div className="font-semibold">{h.name}</div>
              <div className="text-sm text-ac-black/60">{h.role}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 space-y-2 border-t border-black/5 pt-5 text-sm text-ac-black/70">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-ac-blue" aria-hidden="true" /> 45 minutes
        </div>
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-ac-blue" aria-hidden="true" /> Video call, link in your invite
        </div>
      </div>
      <p className="mt-5 rounded-xl border border-dashed border-ac-black/20 p-3 text-xs text-ac-black/60">
        <strong className="text-ac-black">Demo:</strong> the hosts follow the account type in Salesforce. Switch between
        Standard and Enterprise in the demo bar to see the change.
      </p>
    </Panel>
  );
}

export default function BookPage() {
  const { data, update } = useOnboarding();
  const cards = useCardStates();
  const [day, setDay] = useState(sessionSlots[0].day);
  const [time, setTime] = useState<string | null>(null);
  const times = sessionSlots.find((s) => s.day === day)?.times ?? [];

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <PageIntro
        eyebrow="Step 3 · Onboarding session"
        title="Book your onboarding session"
        description="We'll set up your GripAble together, walk through the app and the Able Portal, and run a practice screening."
        aside={<StatusPill status={cards.book.status} label={cards.book.label} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {data.booking ? (
          <Panel className="lg:col-span-2">
            <CalendarCheck className="mb-4 h-10 w-10 text-ac-blue" aria-hidden="true" />
            <h2 className="mb-2 text-2xl font-bold">You&apos;re booked</h2>
            <p className="text-lg">
              {data.booking.day} at {data.booking.time} ET
            </p>
            <p className="mt-2 font-light text-ac-black/70">
              {data.setup === "todo"
                ? "We've sent you a calendar invite. Anyone you name in step 2 will be invited too."
                : "We've sent a calendar invite to you and the people you named in step 2."}{" "}
              A recording of the session will appear on your dashboard afterwards.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className={primaryButton}>
                Add to calendar
              </button>
              <button type="button" onClick={() => update({ booking: undefined })} className={secondaryButton}>
                Change time
              </button>
            </div>
            <div className="mt-8 rounded-xl bg-ac-grey/40 p-5">
              <h3 className="mb-2 font-bold">Before your session</h3>
              <p className="text-sm text-ac-black/70">
                Install the app and charge the GripAble (your{" "}
                <Link href="/onboarding/delivery" className="font-semibold text-ac-blue underline underline-offset-2">
                  get-ready checklist
                </Link>
                ), and add your staff in the Able Portal once your account is ready (
                <Link href="/onboarding/setup" className="font-semibold text-ac-blue underline underline-offset-2">
                  step 2
                </Link>
                ).
              </p>
            </div>
          </Panel>
        ) : (
          <Panel className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Choose a time</h2>
              <span className="text-xs text-ac-black/50">Times shown in Eastern Time</span>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {sessionSlots.map((s) => (
                <button
                  key={s.day}
                  type="button"
                  onClick={() => {
                    setDay(s.day);
                    setTime(null);
                  }}
                  aria-pressed={day === s.day}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
                    day === s.day ? "border-ac-blue bg-ac-blue text-white" : "border-black/10 hover:border-ac-blue"
                  )}
                >
                  {s.day}
                </button>
              ))}
            </div>
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {times.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  aria-pressed={time === t}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
                    time === t ? "border-ac-blue bg-ac-blue/10 text-ac-blue" : "border-black/10 hover:border-ac-blue"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!time}
              onClick={() => time && update({ booking: { day, time } })}
              className={primaryButton}
            >
              {time ? `Book ${day} at ${time}` : "Pick a time"}
            </button>
            <p className="mt-6 text-xs text-ac-black/50">
              Demo: in the pilot this is the Calendly booking widget for the right hosts.
            </p>
          </Panel>
        )}
        <Hosts />
      </div>
    </div>
  );
}
