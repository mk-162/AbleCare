"use client";

import { usePathname } from "next/navigation";

// The onboarding dashboard has its own header and footer, so the marketing
// site's chrome is hidden on those routes.
export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/onboarding")) return null;
  return <>{children}</>;
}
