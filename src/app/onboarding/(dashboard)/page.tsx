"use client";

import Link from "next/link";
import { ArrowRight, Building2, CalendarCheck, PlayCircle, Sparkles, Truck, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCardStates, useOnboarding, type CardState } from "@/components/onboarding/OnboardingState";
import { checklist, customer, order, sessionHosts } from "@/components/onboarding/demo-data";
import { Eyebrow, StatusPill, aquaButton } from "@/components/onboarding/ui";

type CardKey = "delivery" | "setup" | "book" | "training" | "after";

const hrefs: Record<CardKey, string> = {
  delivery: "/onboarding/delivery",
  setup: "/onboarding/setup",
  book: "/onboarding/book",
  training: "/onboarding/training",
  after: "/onboarding/after-session",
};

export default function DashboardHome() {
  const { data } = useOnboarding();
  const cards = useCardStates();
  const hosts = sessionHosts[data.tier].map((h) => h.name).join(" and ");
  const allDone = cards.next.card === "none";

  const items: { key: CardKey; icon: React.ElementType; title: string; text: string; state: CardState; cta: string }[] = [
    {
      key: "delivery",
      icon: Truck,
      title: "Your delivery",
      text:
        data.delivery === "delivered"
          ? `Your ${order.kits} GripAble kits have arrived. Finish the get-ready checklist (${cards.checksDone} of ${checklist.length} done).`
          : `${order.kits} GripAble kits are on the way with ${order.carrier}. Get ready while you wait: ${cards.checksDone} of ${checklist.length} done.`,
      state: cards.delivery,
      cta: data.delivery === "delivered" ? "Open checklist" : "Track your order",
    },
    {
      key: "setup",
      icon: Building2,
      title: "Set up your organization",
      text:
        data.setup === "ready"
          ? "Your admin account is ready. Next, add your staff in the Able Portal."
          : data.setup === "submitted"
            ? "Thanks. We're creating your organization and admin account, usually within one business day."
            : "Name your Champion and confirm your details, and we'll create your admin account.",
      state: cards.setup,
      cta: data.setup === "ready" ? "Add your staff" : data.setup === "submitted" ? "View details" : "Start setup",
    },
    {
      key: "book",
      icon: CalendarCheck,
      title: "Book your onboarding session",
      text: data.booking
        ? `${data.booking.day} at ${data.booking.time} ET with ${hosts}.`
        : `A 45-minute session for your team with ${hosts}.`,
      state: cards.book,
      cta: data.booking ? "View booking" : "Choose a time",
    },
    {
      key: "training",
      icon: PlayCircle,
      title: "Team training",
      text: "Eight short videos, about 20 minutes in all. Share them with every staff member who will run screenings.",
      state: cards.training,
      cta: cards.modulesDone > 0 ? "Continue training" : "Start training",
    },
    {
      key: "after",
      icon: Video,
      title: "After your session",
      text: "Your session recording, resources for clients and families, and two short check-in calls.",
      state: cards.after,
      cta: "Open",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-ac-blue text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-ac-aqua/30 blur-3xl" aria-hidden="true" />
        <div className="container relative mx-auto px-4 py-12 md:px-6 md:py-16">
          <Eyebrow className="mb-4 text-ac-aqua">{customer.organization} · Onboarding</Eyebrow>
          <h1 className="text-4xl font-bold md:text-5xl">
            {allDone ? `You're all set, ${customer.firstName}.` : `Welcome to Able Care, ${customer.firstName}.`}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-light text-white/85">
            This dashboard is the one place for everything you need to get your team screening with Able Assess. We&apos;ll
            email you whenever there&apos;s something new here, so there&apos;s nothing to keep track of in your inbox.
          </p>
          <div className="mt-8 max-w-md">
            <div className="mb-2 flex justify-between text-sm font-medium">
              <span>Your progress</span>
              <span>
                {cards.completed} of {cards.total} steps complete
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-ac-aqua transition-all"
                style={{ width: `${(cards.completed / cards.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="mb-10 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-2 ring-ac-aqua md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ac-aqua text-ac-black">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <Eyebrow className="mb-1">What to do next</Eyebrow>
              <p className="text-lg font-medium">{cards.next.text}</p>
            </div>
          </div>
          {cards.next.card !== "none" && (
            <Link href={hrefs[cards.next.card]} className={cn(aquaButton, "shrink-0")}>
              Go to this step <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <h2 className="mb-6 text-2xl font-bold">Your steps</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, i) => {
            const locked = item.state.status === "locked";
            const isNext = cards.next.card === item.key;
            const Icon = item.icon;
            const body = (
              <>
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      locked ? "bg-ac-grey/60 text-ac-black/40" : "bg-ac-blue/10 text-ac-blue"
                    )}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <StatusPill status={item.state.status} label={item.state.label} />
                </div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-ac-black/40">Step {i + 1}</div>
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="flex-1 font-light text-ac-black/70">{item.text}</p>
                {!locked && (
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ac-blue">
                    {item.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                )}
              </>
            );
            const classes = cn(
              "group relative flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all",
              locked ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-lg",
              isNext && "ring-2 ring-ac-blue"
            );
            return locked ? (
              <div key={item.key} className={classes} aria-disabled="true">
                {body}
              </div>
            ) : (
              <Link key={item.key} href={hrefs[item.key]} className={classes}>
                {isNext && (
                  <span className="absolute -top-3 left-6 rounded-full bg-ac-blue px-3 py-0.5 text-xs font-bold text-white">
                    Next step
                  </span>
                )}
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
