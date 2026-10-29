import { NextResponse } from "next/server";
import { DEMO_ACCESS_COOKIE, demoAccessToken, demoPassword, safeNextPath } from "@/lib/onboarding-access";

export async function POST(request: Request) {
  const form = await request.formData();
  const attempt = String(form.get("password") ?? "");
  const next = safeNextPath(String(form.get("next") ?? ""));
  const expected = demoPassword();

  if (!expected || (await demoAccessToken(attempt)) !== (await demoAccessToken(expected))) {
    const retry = new URL("/onboarding/access", request.url);
    retry.searchParams.set("error", "1");
    retry.searchParams.set("next", next);
    return NextResponse.redirect(retry, 303);
  }

  let target = new URL(next, request.url);
  if (target.origin !== new URL(request.url).origin) target = new URL("/onboarding", request.url);
  const response = NextResponse.redirect(target, 303);
  response.cookies.set(DEMO_ACCESS_COOKIE, await demoAccessToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
