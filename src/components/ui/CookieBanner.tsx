"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  function handleAccept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    (window as unknown as { __loadZoomInfo?: () => void }).__loadZoomInfo?.();
    setVisible(false);
  }

  function handleReject() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-4 md:p-6 pointer-events-none">
      <div className="pointer-events-auto max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-black/8 p-5 md:p-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-ac-black leading-relaxed">
              We use cookies to improve your experience and analyze site usage.{" "}
              <Link
                href="/cookies"
                className="text-ac-blue underline underline-offset-2 hover:text-ac-blue/80 transition-colors"
              >
                Cookie Policy
              </Link>
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleAccept}
                className="px-5 py-2 text-sm font-bold text-white bg-ac-blue rounded-full hover:bg-ac-blue/90 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2 text-sm font-bold text-ac-black bg-ac-grey/50 rounded-full hover:bg-ac-grey transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
          <button
            onClick={handleReject}
            className="shrink-0 p-1.5 rounded-full text-ac-black/40 hover:text-ac-black hover:bg-ac-grey/40 transition-colors"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
