"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checklist, trainingModules, type AccountTier, type StageKey } from "./demo-data";

// Demo-only state, saved in the browser. In the pilot each field maps to
// Salesforce: delivery from the asset record, setup from the form task,
// booking from a Calendly webhook, the session and check-ins from Pedro.
export interface OnboardingData {
  tier: AccountTier;
  delivery: "in_transit" | "delivered";
  checked: string[];
  setup: "todo" | "submitted" | "ready";
  champion?: { name: string; email: string };
  booking?: { day: string; time: string };
  session: "upcoming" | "done";
  training: string[];
  checkIns: number;
}

const STORAGE_KEY = "ac-onboarding-demo-v2";
const allChecks = checklist.map((c) => c.id);
const beforeChecks = checklist.filter((c) => c.when === "before").map((c) => c.id);
const allModules = trainingModules.map((m) => m.slug);
const demoChampion = { name: "Dana Whitfield", email: "dana.whitfield@maplegrovehomecare.com" };
const demoBooking = { day: "Tue, Nov 10", time: "11:00 AM" };

const presets: Record<StageKey, Omit<OnboardingData, "tier">> = {
  ordered: { delivery: "in_transit", checked: [], setup: "todo", session: "upcoming", training: [], checkIns: 0 },
  delivered: {
    delivery: "delivered",
    checked: ["install", "security", "whitelist"],
    setup: "submitted",
    champion: demoChampion,
    session: "upcoming",
    training: [],
    checkIns: 0,
  },
  booked: {
    delivery: "delivered",
    checked: allChecks,
    setup: "ready",
    champion: demoChampion,
    booking: demoBooking,
    session: "upcoming",
    training: allModules.slice(0, 2),
    checkIns: 0,
  },
  after: {
    delivery: "delivered",
    checked: allChecks,
    setup: "ready",
    champion: demoChampion,
    booking: demoBooking,
    session: "done",
    training: allModules.slice(0, 5),
    checkIns: 0,
  },
  done: {
    delivery: "delivered",
    checked: allChecks,
    setup: "ready",
    champion: demoChampion,
    booking: demoBooking,
    session: "done",
    training: allModules,
    checkIns: 2,
  },
};

const initial: OnboardingData = { tier: "standard", ...presets.ordered };

interface OnboardingContextValue {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  applyStage: (stage: StageKey) => void;
  toggleCheck: (id: string) => void;
  completeModule: (slug: string) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initial);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData({ ...initial, ...JSON.parse(saved) });
    } catch {
      // Storage can be blocked (private windows); the demo still works without it.
    }
  }, []);

  const save = (next: OnboardingData) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const value: OnboardingContextValue = {
    data,
    update: (patch) => save({ ...data, ...patch }),
    applyStage: (stage) => save({ tier: data.tier, ...presets[stage] }),
    toggleCheck: (id) =>
      save({
        ...data,
        checked: data.checked.includes(id) ? data.checked.filter((c) => c !== id) : [...data.checked, id],
      }),
    completeModule: (slug) =>
      save({ ...data, training: data.training.includes(slug) ? data.training : [...data.training, slug] }),
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}

export type CardStatus = "todo" | "progress" | "done" | "locked";

export interface CardState {
  status: CardStatus;
  label: string;
}

export function useCardStates() {
  const { data } = useOnboarding();
  const checksDone = data.checked.filter((id) => allChecks.includes(id)).length;
  const beforeDone = data.checked.filter((id) => beforeChecks.includes(id)).length;
  const modulesDone = data.training.filter((s) => allModules.includes(s)).length;
  const inTransit = data.delivery === "in_transit";

  const delivery: CardState =
    !inTransit && checksDone === allChecks.length
      ? { status: "done", label: "Delivered and ready" }
      : !inTransit
        ? { status: "progress", label: `Delivered · ${checksDone} of ${allChecks.length} done` }
        : { status: "progress", label: `In transit · ${beforeDone} of ${beforeChecks.length} ready` };

  const setup: CardState =
    data.setup === "ready"
      ? { status: "done", label: "Account ready" }
      : data.setup === "submitted"
        ? { status: "progress", label: "We're setting up your account" }
        : { status: "todo", label: "To do" };

  const book: CardState = data.booking
    ? data.session === "done"
      ? { status: "done", label: "Session complete" }
      : { status: "done", label: `Booked · ${data.booking.day}, ${data.booking.time}` }
    : { status: "todo", label: "To do" };

  const training: CardState =
    modulesDone === allModules.length
      ? { status: "done", label: "All modules complete" }
      : modulesDone > 0
        ? { status: "progress", label: `${modulesDone} of ${allModules.length} modules` }
        : { status: "todo", label: `${allModules.length} short modules` };

  const after: CardState =
    data.session !== "done"
      ? { status: "locked", label: "Unlocks after your session" }
      : data.checkIns >= 2
        ? { status: "done", label: "Check-ins complete" }
        : { status: "progress", label: data.checkIns === 1 ? "Check-in 2 to book" : "Check-in 1 to book" };

  const completed = [delivery, setup, book, training, after].filter((c) => c.status === "done").length;

  // The one step we point the customer at, in priority order.
  let next: { card: "delivery" | "setup" | "book" | "training" | "after" | "none"; text: string };
  if (data.setup === "todo") {
    next = { card: "setup", text: "Tell us who will lead Able Assess at your organization, so we can create their account." };
  } else if (!data.booking) {
    next = { card: "book", text: "Book your 45-minute onboarding session. Pick a time that suits your team." };
  } else if (inTransit ? beforeDone < beforeChecks.length : checksDone < allChecks.length) {
    next = {
      card: "delivery",
      text: inTransit
        ? "Get ready while your kit is on its way: install the app and ask IT to allow our login emails."
        : "Your kit has arrived. Check the bag and charge the GripAble before your session.",
    };
  } else if (data.session !== "done") {
    next = { card: "training", text: "Get a head start: work through the short training modules with your team." };
  } else if (data.checkIns < 2) {
    next = { card: "after", text: "Watch your session recording and book your next check-in call." };
  } else if (modulesDone < allModules.length) {
    next = { card: "training", text: "Finish the training modules, and share them with any new staff." };
  } else {
    next = { card: "none", text: "You're all set. Your Sales Manager is your contact from here." };
  }

  return {
    delivery,
    setup,
    book,
    training,
    after,
    completed,
    total: 5,
    next,
    checksDone,
    beforeDone,
    beforeTotal: beforeChecks.length,
    modulesDone,
  };
}
