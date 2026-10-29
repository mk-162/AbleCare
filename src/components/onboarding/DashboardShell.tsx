"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Inbox, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { HelpPanel } from "./HelpPanel";
import { OnboardingProvider, useOnboarding } from "./OnboardingState";
import { PORTAL_URL, customer, stages } from "./demo-data";

function DemoBar() {
  const { data, update, applyStage } = useOnboarding();
  return (
    <div className="bg-ac-black text-white">
      <div className="container mx-auto flex flex-col gap-3 px-4 py-3 text-xs md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 rounded bg-ac-aqua px-2 py-0.5 font-bold uppercase tracking-wider text-ac-black">Demo</span>
          <span className="text-white/60">Jump to:</span>
          {stages.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => applyStage(s.key)}
              className="rounded-full border border-white/20 px-3 py-1 transition-colors hover:border-ac-aqua hover:text-ac-aqua"
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-white/60">Account:</span>
          {(["standard", "enterprise"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => update({ tier })}
              aria-pressed={data.tier === tier}
              className={cn(
                "rounded-full px-3 py-1 capitalize transition-colors",
                data.tier === tier ? "bg-white text-ac-black" : "border border-white/20 hover:border-white"
              )}
            >
              {tier}
            </button>
          ))}
          <Link href="/onboarding/email" className="ml-2 inline-flex items-center gap-1 text-white/80 hover:text-ac-aqua">
            <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
            Emails
          </Link>
          <button
            type="button"
            onClick={() => applyStage("ordered")}
            className="inline-flex items-center gap-1 text-white/80 hover:text-ac-aqua"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-black/5 bg-white">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/onboarding" aria-label="Your onboarding dashboard">
            <Image src="/images/able-care-logo-horizontal.svg" alt="Able Care" width={150} height={32} priority />
          </Link>
          <span className="hidden border-l border-black/10 pl-4 text-sm font-medium text-ac-black/60 sm:block">
            {customer.organization}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-sm font-semibold text-ac-black/70 hover:text-ac-blue sm:inline-flex"
          >
            Able Portal <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ac-aqua text-sm font-bold text-ac-black"
            title={customer.fullName}
          >
            DW
          </span>
        </div>
      </div>
    </header>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
        <DemoBar />
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-black/5 bg-white">
          <div className="container mx-auto flex flex-col gap-2 px-4 pb-24 pt-8 text-sm text-ac-black/60 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <Image src="/images/able-care-logo-horizontal.svg" alt="Able Care" width={120} height={26} />
              <div className="mt-1 text-xs">by GripAble Inc</div>
            </div>
            <div>
              Questions? <a href="mailto:support@able-care.co" className="font-semibold text-ac-blue">support@able-care.co</a>
            </div>
          </div>
        </footer>
        <HelpPanel />
      </div>
    </OnboardingProvider>
  );
}
