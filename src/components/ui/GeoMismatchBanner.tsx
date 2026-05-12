"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

const DISMISSED_KEY = "geo-banner-dismissed";

/**
 * Top-of-page banner shown when the visitor's IP-derived country matches
 * the OTHER region's site (e.g. visitor in US lands on UK site).
 *
 * Reads the `visitor-country` cookie set by `src/middleware.ts`. Dismissal
 * is persisted in localStorage so the banner stays gone across navigations
 * and sessions until the user clears storage.
 */
export function GeoMismatchBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already dismissed?
    try {
      if (localStorage.getItem(DISMISSED_KEY) === "yes") return;
    } catch {
      // localStorage unavailable (Safari private mode etc.) — fall through and show
    }

    // Read visitor-country cookie set by middleware
    const cookieMatch = document.cookie.match(/(?:^|;\s*)visitor-country=([A-Z]{2})/);
    const country = cookieMatch?.[1] || "";

    // Show only if the visitor is from the OTHER site's country
    if (country && country === SITE_CONFIG.otherCountry) {
      setVisible(true);
    }
  }, []);

  function handleDismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, "yes");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bg-ac-blue text-white py-2.5 px-4 relative">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium pr-8">
        <span>
          Looks like you&rsquo;re in {SITE_CONFIG.otherLabel}. We have a site tailored to you.
        </span>
        <a
          href={SITE_CONFIG.otherHref}
          className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-ac-black bg-ac-aqua rounded-full hover:bg-white transition-colors"
        >
          <img
            src={SITE_CONFIG.otherFlag}
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
          Go to Able Care {SITE_CONFIG.otherCountry}
        </a>
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 p-1"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
