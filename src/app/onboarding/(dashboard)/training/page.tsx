"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Copy, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCardStates, useOnboarding } from "@/components/onboarding/OnboardingState";
import { formatLength, trainingModules } from "@/components/onboarding/demo-data";
import { PageIntro, Panel, StatusPill, primaryButton, secondaryButton } from "@/components/onboarding/ui";

export default function TrainingPage() {
  const { data } = useOnboarding();
  const cards = useCardStates();
  const [copied, setCopied] = useState(false);
  const nextModule = trainingModules.find((m) => !data.training.includes(m.slug)) ?? trainingModules[0];
  const teamLink = "able-care.co/onboarding/maple-grove/training";

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <PageIntro
        eyebrow="Step 4 · Team training"
        title="Learn Able Assess in eight short videos"
        description="About 20 minutes in all. Practice each test on a colleague as you go."
        aside={<StatusPill status={cards.training.status} label={cards.training.label} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-ac-black/60">
                {cards.modulesDone} of {trainingModules.length} complete
              </div>
              <div className="mt-2 h-2 w-48 rounded-full bg-ac-grey">
                <div
                  className="h-2 rounded-full bg-ac-blue transition-all"
                  style={{ width: `${(cards.modulesDone / trainingModules.length) * 100}%` }}
                />
              </div>
            </div>
            <Link href={`/onboarding/training/${nextModule.slug}`} className={primaryButton}>
              {cards.modulesDone > 0 ? "Continue" : "Start the course"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ol className="divide-y divide-black/5">
            {trainingModules.map((m, i) => {
              const done = data.training.includes(m.slug);
              return (
                <li key={m.slug}>
                  <Link
                    href={`/onboarding/training/${m.slug}`}
                    className="group flex items-center gap-4 py-4 transition-colors hover:text-ac-blue"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                        done ? "bg-ac-aqua text-ac-black" : "bg-ac-blue/10 text-ac-blue"
                      )}
                    >
                      {done ? <CheckCircle2 className="h-5 w-5" aria-label="Complete" /> : i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold">{m.title}</span>
                      <span className="block text-sm font-light text-ac-black/60">{m.summary}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 text-sm text-ac-black/50">
                      <PlayCircle className="h-4 w-4" aria-hidden="true" />
                      {formatLength(m.end - m.start)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Panel>

        <Panel className="h-fit">
          <h2 className="mb-2 text-lg font-bold">Share with your team</h2>
          <p className="mb-4 text-sm text-ac-black/60">
            Send this link to every staff member who will run screenings. They don&apos;t need to log in to watch, and you
            can see who has finished.
          </p>
          <div className="mb-3 truncate rounded-xl bg-ac-grey/40 px-4 py-3 font-mono text-xs">{teamLink}</div>
          <button
            type="button"
            className={`${secondaryButton} w-full`}
            onClick={() => {
              navigator.clipboard?.writeText(`https://${teamLink}`).catch(() => {});
              setCopied(true);
            }}
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            {copied ? "Link copied" : "Copy link"}
          </button>
        </Panel>
      </div>
    </div>
  );
}
