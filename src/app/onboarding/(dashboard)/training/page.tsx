"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Play, RotateCcw, Share2, Trophy } from "lucide-react";
import { useCardStates, useOnboarding } from "@/components/onboarding/OnboardingState";
import { customer, formatLength, trainingModules, trainingSections } from "@/components/onboarding/demo-data";
import { PageIntro, Panel, StatusPill, aquaButton, secondaryButton } from "@/components/onboarding/ui";
import { VideoCard, VideoThumbnail } from "@/components/onboarding/VideoCard";

function ProgressRing({ done, total }: { done: number; total: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-white/20" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - done / total)}
          className="text-ac-aqua transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">
          {done}/{total}
        </span>
        <span className="text-xs text-white/70">watched</span>
      </div>
    </div>
  );
}

export default function TrainingPage() {
  const { data } = useOnboarding();
  const cards = useCardStates();
  const [copied, setCopied] = useState(false);

  const nextIndex = trainingModules.findIndex((m) => !data.training.includes(m.slug));
  const allDone = nextIndex === -1;
  const featured = trainingModules[allDone ? 0 : nextIndex];
  const secondsLeft = trainingModules
    .filter((m) => !data.training.includes(m.slug))
    .reduce((total, m) => total + (m.end - m.start), 0);
  const teamLink = "able-care.co/onboarding/maple-grove/training";

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <PageIntro
        eyebrow="Step 4 · Team training"
        title="Learn Able Assess in eight short videos"
        description="About 20 minutes in all. Watch them in order, and practice each test on a colleague as you go."
        aside={<StatusPill status={cards.training.status} label={cards.training.label} />}
      />

      <div className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl bg-ac-blue p-6 text-white md:p-8 lg:col-span-2">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-ac-aqua/30 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
            {allDone ? (
              <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-ac-aqua text-ac-black">
                <Trophy className="h-12 w-12" aria-hidden="true" />
              </span>
            ) : (
              <ProgressRing done={cards.modulesDone} total={trainingModules.length} />
            )}
            <div className="flex-1">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-ac-aqua">
                {allDone ? "Course complete" : cards.modulesDone > 0 ? "Continue where you left off" : "Start here"}
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">
                {allDone ? `Nice work, ${customer.firstName}.` : featured.title}
              </h2>
              <p className="mt-2 font-light text-white/80">
                {allDone
                  ? "You've watched every module. Share the course with new staff whenever they join."
                  : `Module ${nextIndex + 1} · ${formatLength(featured.end - featured.start)} · About ${Math.ceil(secondsLeft / 60)} minutes left in the course`}
              </p>
              <Link href={`/onboarding/training/${featured.slug}`} className={`${aquaButton} mt-5`}>
                {allDone ? (
                  <>
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> Watch again
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" aria-hidden="true" /> Play module {nextIndex + 1}
                  </>
                )}
              </Link>
            </div>
            {!allDone && (
              <Link href={`/onboarding/training/${featured.slug}`} className="group hidden w-56 shrink-0 xl:block" tabIndex={-1}>
                <VideoThumbnail module={featured} number={nextIndex + 1} state="next" className="ring-2 ring-white/30" />
              </Link>
            )}
          </div>
        </div>

        <Panel className="flex flex-col">
          <Share2 className="mb-3 h-8 w-8 text-ac-blue" aria-hidden="true" />
          <h2 className="mb-2 text-lg font-bold">Share with your team</h2>
          <p className="mb-4 flex-1 text-sm text-ac-black/60">
            Send this link to every staff member who will run screenings. They don&apos;t need to log in to watch.
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

      {trainingSections.map((section) => {
        const modules = trainingModules.filter((m) => m.section === section.key);
        const watched = modules.filter((m) => data.training.includes(m.slug)).length;
        return (
          <section key={section.key} className="mb-14">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="font-light text-ac-black/60">{section.description}</p>
              </div>
              <span className="text-sm font-semibold text-ac-black/50">
                {watched} of {modules.length} watched
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {modules.map((m) => {
                const index = trainingModules.indexOf(m);
                const state = data.training.includes(m.slug) ? "done" : index === nextIndex ? "next" : "todo";
                return <VideoCard key={m.slug} module={m} number={index + 1} state={state} />;
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
