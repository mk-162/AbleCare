// Password gate for the onboarding dashboard demo. The gate is only active when
// ONBOARDING_DEMO_PASSWORD is set, which happens only on the demo branch's
// Vercel preview. Without it, the /onboarding routes are not served at all.

export const DEMO_ACCESS_COOKIE = "ac_demo_access";

export function demoPassword(): string | undefined {
  return process.env.ONBOARDING_DEMO_PASSWORD?.trim() || undefined;
}

// The cookie holds a hash of the password, never the password itself.
export async function demoAccessToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`ac-onboarding-demo:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Only allow redirects back to a path on this site. Backslashes are rejected
// because browsers treat "/\host" like "//host".
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/onboarding";
  return value;
}
