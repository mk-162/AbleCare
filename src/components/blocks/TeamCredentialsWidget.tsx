import Link from "next/link";

export function TeamCredentialsWidget() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-ac-black/40 mb-4">
        Our team
      </h3>

      <p className="text-xs text-ac-black/60 font-light leading-relaxed mb-4">
        Written and reviewed by researchers from Imperial College London.
      </p>

      <ul className="space-y-3 mb-5">
        <li className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-ac-blue/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-ac-blue">
            PR
          </div>
          <div>
            <div className="text-sm font-bold text-ac-black leading-tight">
              Dr Paul Rinne
            </div>
            <div className="text-[11px] text-ac-black/50 font-light">
              CEO · PhD Neuroscience
            </div>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-ac-blue/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-ac-blue">
            MM
          </div>
          <div>
            <div className="text-sm font-bold text-ac-black leading-tight">
              Dr Mike Mace
            </div>
            <div className="text-[11px] text-ac-black/50 font-light">
              CTO · PhD Bioengineering, Imperial
            </div>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-ac-blue/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-ac-blue">
            DR
          </div>
          <div>
            <div className="text-sm font-bold text-ac-black leading-tight">
              Danielle Richards
            </div>
            <div className="text-[11px] text-ac-black/50 font-light">
              Commercial Director · MBA, Cambridge Judge
            </div>
          </div>
        </li>
      </ul>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-medium text-ac-black/30 uppercase tracking-wider border-t border-black/5 pt-4 mb-3">
        <span>FDA Listed</span>
        <span>·</span>
        <span>CE Marked</span>
        <span>·</span>
        <span>ISO 27001</span>
      </div>

      <Link
        href="/meet-the-team"
        className="inline-flex items-center gap-1 text-xs font-bold text-ac-blue hover:text-ac-aqua transition-colors"
      >
        Meet the team
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
