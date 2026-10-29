import Link from "next/link";
import {
  Armchair,
  BatteryCharging,
  Bluetooth,
  CheckCircle2,
  ClipboardCheck,
  Footprints,
  Hand,
  Play,
  Smartphone,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatLength, type TrainingModule, type TrainingSection } from "./demo-data";

const icons: Record<string, React.ElementType> = {
  Smartphone,
  Bluetooth,
  UserPlus,
  Hand,
  Armchair,
  Footprints,
  ClipboardCheck,
  BatteryCharging,
};

// One brand gradient per course section, so the grid reads as three groups.
const sectionBackgrounds: Record<TrainingSection, string> = {
  setup: "bg-gradient-to-br from-ac-blue via-ac-blue to-[#0A1A8C]",
  tests: "bg-gradient-to-br from-ac-blue via-[#1060E8] to-[#00C9B8]",
  care: "bg-gradient-to-br from-ac-black via-[#1B2470] to-ac-blue",
};

export type VideoCardState = "done" | "next" | "todo";

export function VideoThumbnail({
  module,
  number,
  state,
  className,
}: {
  module: TrainingModule;
  number: number;
  state: VideoCardState;
  className?: string;
}) {
  const Icon = icons[module.icon] ?? Play;
  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-2xl", sectionBackgrounds[module.section], className)}>
      <span
        className="absolute -bottom-6 -right-2 select-none text-[7rem] font-bold leading-none text-white/10"
        aria-hidden="true"
      >
        {String(number).padStart(2, "0")}
      </span>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>
        <span className="absolute flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-ac-aqua text-ac-black opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
          <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
        </span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
        Module {number}
      </span>
      {state === "done" && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-ac-aqua px-2.5 py-1 text-xs font-bold text-ac-black">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Watched
        </span>
      )}
      {state === "next" && (
        <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-ac-blue">Up next</span>
      )}
      <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-xs font-semibold text-white">
        {formatLength(module.end - module.start)}
      </span>
      {state === "done" && <div className="absolute inset-x-0 bottom-0 h-1 bg-ac-aqua" aria-hidden="true" />}
    </div>
  );
}

export function VideoCard({
  module,
  number,
  state,
}: {
  module: TrainingModule;
  number: number;
  state: VideoCardState;
}) {
  return (
    <Link
      href={`/onboarding/training/${module.slug}`}
      className={cn(
        "group flex flex-col rounded-3xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        state === "next" && "ring-2 ring-ac-blue"
      )}
    >
      <VideoThumbnail module={module} number={number} state={state} />
      <div className="px-2 pb-2 pt-4">
        <h3 className="font-bold leading-snug transition-colors group-hover:text-ac-blue">{module.title}</h3>
        <p className="mt-1 text-sm font-light text-ac-black/60">{module.summary}</p>
      </div>
    </Link>
  );
}
