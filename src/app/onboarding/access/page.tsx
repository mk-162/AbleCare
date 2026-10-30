import Image from "next/image";
import { Lock } from "lucide-react";
import { safeNextPath } from "@/lib/onboarding-access";

export default async function DemoAccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : undefined);
  const failed = params.error === "1";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ac-blue px-4 py-16">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-ac-aqua/30 blur-3xl" aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl md:p-10">
        <Image src="/images/able-care-logo-horizontal.svg" alt="Able Care" width={150} height={32} className="mb-8" priority />
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-ac-blue">Onboarding dashboard · Demo</div>
        <h1 className="mb-2 text-3xl font-bold">Enter the password</h1>
        <p className="mb-8 font-light text-ac-black/70">This preview is private. Use the password you were sent with the link.</p>

        <form method="post" action="/api/onboarding-access" className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              aria-describedby={failed ? "password-error" : undefined}
              aria-invalid={failed || undefined}
              className="w-full rounded-xl border border-black/15 px-4 py-3 text-base outline-none transition-colors focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
            />
            {failed && (
              <p id="password-error" className="mt-2 text-sm font-medium text-red-700">
                That password didn&apos;t work. Check it and try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ac-blue px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-ac-blue/90 hover:shadow-lg"
          >
            <Lock className="h-4 w-4" aria-hidden="true" /> View the demo
          </button>
        </form>
      </div>
    </div>
  );
}
