import Link from "next/link";
import { tagLabel, tagDimension, type ContentTag } from "@/lib/tags";

interface TagBadgeProps {
  tag: string;
  linked?: boolean;
  size?: "sm" | "md";
}

const dimensionStyles: Record<string, string> = {
  topic: "bg-ac-blue/8 text-ac-blue border-ac-blue/15",
  segment: "bg-ac-aqua/10 text-ac-black border-ac-aqua/20",
  solution: "bg-gradient-to-r from-ac-blue/8 to-ac-aqua/8 text-ac-blue border-ac-blue/15",
  type: "bg-ac-grey/40 text-ac-black/60 border-black/8",
  unknown: "bg-ac-grey/30 text-ac-black/50 border-black/5",
};

export function TagBadge({ tag, linked = true, size = "sm" }: TagBadgeProps) {
  const dimension = tagDimension(tag);
  const label = tagLabel(tag as ContentTag);
  const style = dimensionStyles[dimension];

  const sizeClass =
    size === "sm"
      ? "text-[10px] px-2 py-0.5"
      : "text-xs px-2.5 py-1";

  const className = `inline-block rounded-full border font-medium tracking-wide ${style} ${sizeClass}`;

  if (linked) {
    return (
      <Link
        href={`/knowledge-base?tag=${tag}`}
        className={`${className} hover:opacity-80 transition-opacity`}
      >
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}
