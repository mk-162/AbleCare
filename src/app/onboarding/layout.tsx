import type { Metadata } from "next";

// Demo only: not linked from the site and kept out of search.
export const metadata: Metadata = {
  title: "Your onboarding dashboard (demo)",
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
