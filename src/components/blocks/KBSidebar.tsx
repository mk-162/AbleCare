import { TagList } from "./TagList";
import { TeamCredentialsWidget } from "./TeamCredentialsWidget";
import { ContextualPromoWidget } from "./ContextualPromoWidget";
import { LeadMagnetWidget } from "./LeadMagnetWidget";

interface KBSidebarProps {
  tags: string[];
}

export function KBSidebar({ tags }: KBSidebarProps) {
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

      {/* Buyer's guide lead magnet */}
      <LeadMagnetWidget
        title="Falls Prevention Buyer's Guide"
        description="Compare the leading falls prevention tools side-by-side. Download the free guide."
        ctaText="Download Guide"
        ctaLink="/resources/buyers-guide"
        variant="whitepaper"
      />
    </aside>
  );
}
