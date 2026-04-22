"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const AUTH_KEY = "ac-site-auth";

export function EditButton() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem(AUTH_KEY) === "1");
    try {
      setInIframe(window.self !== window.top);
    } catch {
      setInIframe(true);
    }
  }, []);

  if (!authed || pathname.startsWith("/admin")) return null;

  const path = pathname.replace(/^\/+|\/+$/g, "");
  const href = inIframe ? pathname : `/admin/index.html#/~/${path}`;
  const label = inIframe ? "Open live ↗" : "Edit in Tina";

  return (
    <a
      href={href}
      target={inIframe ? "_top" : undefined}
      className="fixed bottom-6 right-6 z-[9998] inline-flex items-center gap-2 rounded-full bg-ac-blue px-5 py-3 text-sm font-bold text-white shadow-xl ring-1 ring-white/10 hover:bg-ac-blue/90 focus:outline-none focus:ring-2 focus:ring-white"
      aria-label={label}
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 13.5V16h2.5l7.4-7.4-2.5-2.5L4 13.5Zm11.7-7.3a.7.7 0 0 0 0-1l-1.9-1.9a.7.7 0 0 0-1 0l-1.4 1.4 2.5 2.5 1.8-1Z" fill="currentColor" />
      </svg>
      {label}
    </a>
  );
}
