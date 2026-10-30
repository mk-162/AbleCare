import { DashboardShell } from "@/components/onboarding/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
