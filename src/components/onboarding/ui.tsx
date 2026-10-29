import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CardStatus } from "./OnboardingState";

const pillStyles: Record<CardStatus, string> = {
  todo: "bg-ac-blue/10 text-ac-blue",
  progress: "bg-amber-100 text-amber-900",
  done: "bg-ac-aqua/40 text-ac-black",
  locked: "bg-ac-grey/70 text-ac-black/60",
};

const pillIcons: Record<CardStatus, React.ElementType> = {
  todo: Circle,
  progress: Clock,
  done: CheckCircle2,
  locked: Lock,
};

export function StatusPill({ status, label }: { status: CardStatus; label: string }) {
  const Icon = pillIcons[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", pillStyles[status])}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-xs font-bold uppercase tracking-[0.25em] text-ac-blue", className)}>{children}</div>;
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8", className)}>{children}</div>;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <Link
        href="/onboarding"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ac-black/60 transition-colors hover:text-ac-blue"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to your dashboard
      </Link>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          {description && <p className="mt-3 text-lg font-light text-ac-black/70">{description}</p>}
        </div>
        {aside}
      </div>
    </div>
  );
}

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ac-blue px-6 py-3 text-sm font-bold text-white transition-all hover:bg-ac-blue/90 hover:shadow-lg disabled:pointer-events-none disabled:opacity-40";

export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-ac-black/15 bg-white px-6 py-3 text-sm font-bold text-ac-black transition-colors hover:border-ac-blue hover:text-ac-blue disabled:pointer-events-none disabled:opacity-40";

export const aquaButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ac-aqua px-6 py-3 text-sm font-bold text-ac-black transition-all hover:bg-ac-blue hover:text-white";
