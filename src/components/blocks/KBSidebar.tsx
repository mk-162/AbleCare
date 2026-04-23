import { TagList } from "./TagList";
import { TeamCredentialsWidget } from "./TeamCredentialsWidget";
import { ContextualPromoWidget } from "./ContextualPromoWidget";
import { LeadMagnetWidget } from "./LeadMagnetWidget";
import { getSidebarWidgets } from "@/lib/sidebar-widgets";

interface KBSidebarProps {
  tags: string[];
}

export function KBSidebar({ tags }: KBSidebarProps) {
  const { kbSidebar } = getSidebarWidgets();
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      {/* Article tags */}
      {tags && tags.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-ac-black/40 mb-3">
            Topics
          </h3>
          <TagList tags={tags} linked compact />
        </div>
      )}

      {/* Team credentials */}
      <TeamCredentialsWidget />

      {/* Contextual product promo */}
      <ContextualPromoWidget tags={tags} />

      {/* Lead magnet widgets */}
      {kbSidebar.widgets.map((widget, idx) => (
        <LeadMagnetWidget
          key={`${widget.ctaLink}-${idx}`}
          title={widget.title}
          description={widget.description}
          ctaText={widget.ctaText}
          ctaLink={widget.ctaLink}
          variant={widget.variant}
        />
      ))}
    </aside>
  );
}
