"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Reset scroll to the top on every client-side navigation.
 *
 * Next's App Router scroll behaviour is unreliable in this codebase because
 * `next.config.ts` sets `experimental.scrollRestoration: false`, and the
 * built-in `<Link>` scroll-to-top occasionally races with page transitions —
 * users were reporting that footer links would land them at the bottom of
 * the new page. This component force-scrolls to (0, 0) whenever the
 * pathname changes, and again after the next animation frame and a
 * follow-up microtask, so it survives any late layout shifts from
 * hero/wave SVGs or hydration-driven height changes.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // Bail if the user clicked a same-page anchor (e.g. #section) — the
    // browser is in charge of that scroll target.
    if (typeof window !== "undefined" && window.location.hash) return;

    // Scroll immediately (covers the common case), then again after the next
    // frame and a short timeout to outrun any late layout shifts.
    const reset = () => window.scrollTo(0, 0);
    reset();
    requestAnimationFrame(reset);
    const timer = setTimeout(reset, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Clicks on internal links pointing to the current pathname don't fire the
  // pathname-change effect above, so scroll position would otherwise stay put.
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.hash) return;
      if (url.pathname !== window.location.pathname) return;
      window.scrollTo(0, 0);
    }
    // Use the capture phase so this runs before Next.js's <Link> onClick
    // bubbles and calls preventDefault — otherwise event.defaultPrevented is
    // already true by the time the listener fires and we skip the scroll
    // reset (the original bug: clicking the footer Compliance link while
    // already on /compliance left you stuck at the bottom of the page).
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
