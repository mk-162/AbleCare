"use client";

import { useEffect, useRef } from "react";

const COOKIEBOT_CBID = "3c14f1df-dfe7-4186-905a-26da0626afc1";

// Cookiebot's cd.js renders the declaration into the DOM adjacent to its own
// <script> tag, so it must be injected imperatively at the spot where the
// declaration should appear — next/script would hoist it out of position.
export function CookieDeclaration() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const script = document.createElement("script");
    script.id = "CookieDeclaration";
    script.src = `https://consent.cookiebot.com/${COOKIEBOT_CBID}/cd.js`;
    script.async = true;
    script.setAttribute("data-cookieconsent", "ignore");
    container.appendChild(script);
    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} />;
}
