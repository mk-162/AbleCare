import { TagBadge } from "./TagBadge";
import { tagDimension } from "@/lib/tags";

interface TagListProps {
  tags: string[];
  linked?: boolean;
  compact?: boolean;
}

const DIMENSION_ORDER = ["topic", "segment", "solution", "type"] as const;
const DIMENSION_LABELS: Record<string, string> = {
  topic: "Topics",
  segment: "Settings",
  solution: "Products",
  type: "Content Type",
};

export function TagList({ tags, linked = true, compact = false }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <TagBadge key={tag} tag={tag} linked={linked} size="sm" />
        ))}
      </div>
    );
  }

  // Group by dimension
  const grouped: Record<string, string[]> = {};
  for (const tag of tags) {
    const dim = tagDimension(tag);
    if (!grouped[dim]) grouped[dim] = [];
    grouped[dim].push(tag);
  }

  return (
    <div className="space-y-3">
      {DIMENSION_ORDER.map((dim) => {
        const dimTags = grouped[dim];
        if (!dimTags || dimTags.length === 0) return null;
        return (
          <div key={dim}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ac-black/35 block mb-1.5">
              {DIMENSION_LABELS[dim]}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dimTags.map((tag) => (
                <TagBadge key={tag} tag={tag} linked={linked} size="sm" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
