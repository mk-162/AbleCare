"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

/**
 * Subtle flag-based country switcher for the site header. Shows the current
 * region's flag with a chevron; clicking opens a dropdown listing both
 * regions with the current one ticked. Selecting the other region navigates
 * to its absolute URL (external site).
 */
export function CountrySwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Region: ${SITE_CONFIG.thisLabel}. Click to switch site.`}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-full hover:bg-ac-grey/40 transition-colors"
      >
        <img
          src={SITE_CONFIG.thisFlag}
          alt=""
          width={22}
          height={22}
          className="shadow-sm"
          aria-hidden="true"
        />
        <ChevronDown
          className={`w-3 h-3 text-ac-black/60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-60 bg-white shadow-xl rounded-xl border border-black/5 p-1.5 z-50">
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ac-black/50">
            Region
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-ac-grey/40 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <img
                src={SITE_CONFIG.thisFlag}
                alt=""
                width={22}
                height={14}
                className="rounded-sm shadow-sm"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-ac-black">
                {SITE_CONFIG.thisLabel}
              </span>
            </span>
            <Check className="w-4 h-4 text-ac-blue" />
          </button>
          <a
            href={SITE_CONFIG.otherHref}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-ac-grey/40 transition-colors"
            onClick={() => setOpen(false)}
          >
            <img
              src={SITE_CONFIG.otherFlag}
              alt=""
              width={22}
              height={14}
              className="rounded-sm shadow-sm"
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-ac-black">
              {SITE_CONFIG.otherLabel}
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
