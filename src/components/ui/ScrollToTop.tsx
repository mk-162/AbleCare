"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      // Use requestAnimationFrame to ensure scroll happens after render
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    }
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
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
