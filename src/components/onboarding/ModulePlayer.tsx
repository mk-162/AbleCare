"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnboarding } from "./OnboardingState";
import { FAQ_BASE, TRAINING_VIDEO_ID, formatLength, trainingModules } from "./demo-data";
import { Eyebrow, Panel, primaryButton, secondaryButton } from "./ui";

export function ModulePlayer({ index }: { index: number }) {
  const router = useRouter();
  const { data, completeModule } = useOnboarding();
  const mod = trainingModules[index];
  const prev = trainingModules[index - 1];
  const next = trainingModules[index + 1];
  const done = data.training.includes(mod.slug);
  const embed = `https://www.youtube-nocookie.com/embed/${TRAINING_VIDEO_ID}?start=${mod.start}&end=${mod.end}&rel=0&modestbranding=1`;

  const finish = () => {
    completeModule(mod.slug);
    router.push(next ? `/onboarding/training/${next.slug}` : "/onboarding/training");
  };

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <Link
        href="/onboarding/training"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ac-black/60 transition-colors hover:text-ac-blue"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All modules
      </Link>

      <div className="mb-6">
        <Eyebrow className="mb-3">
          Module {index + 1} of {trainingModules.length} · {formatLength(mod.end - mod.start)}
        </Eyebrow>
        <h1 className="text-3xl font-bold md:text-4xl">{mod.title}</h1>
        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {trainingModules.map((m, i) => (
            <span
              key={m.slug}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i === index ? "bg-ac-blue" : data.training.includes(m.slug) ? "bg-ac-aqua" : "bg-ac-grey"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded-2xl bg-ac-black shadow-lg">
            <iframe
              key={mod.slug}
              src={embed}
              title={mod.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {mod.note && (
            <p className="mt-4 flex gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {mod.note}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            {prev ? (
              <Link href={`/onboarding/training/${prev.slug}`} className={secondaryButton}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </Link>
            ) : (
              <span />
            )}
            <button type="button" onClick={finish} className={primaryButton}>
              {done ? (next ? "Next module" : "Back to all modules") : next ? "Mark complete and continue" : "Mark complete and finish"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <Panel>
            <h2 className="mb-4 text-lg font-bold">Key points</h2>
            <ul className="space-y-3">
              {mod.points.map((p) => (
                <li key={p} className="flex gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ac-blue" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h2 className="mb-4 text-lg font-bold">Related questions</h2>
            <ul className="space-y-2">
              {mod.faqs.map((f) => (
                <li key={f.anchor}>
                  <a
                    href={`${FAQ_BASE}${f.anchor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-sm font-medium text-ac-blue hover:underline"
                  >
                    {f.label} <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
