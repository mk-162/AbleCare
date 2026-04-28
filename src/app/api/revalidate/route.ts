import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const buckets = new Map<string, { count: number; windowStart: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= RATE_LIMIT_MAX;
}

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

type WebhookBody = {
  collection?: string;
  document?: { sys?: { filename?: string } };
};

const COMPANY_PATHS: Record<string, string> = {
  about: "/about",
  "meet-the-team": "/meet-the-team",
  customers: "/customers",
  partners: "/partners",
  news: "/news",
  contact: "/contact",
  demo: "/demo",
};

function pathsFor(collection: string, filename: string): string[] {
  switch (collection) {
    case "pages":
      return filename === "homepage" ? ["/"] : [`/${filename}`];
    case "solutions":
      return [`/solutions/${filename}`];
    case "segments":
      return [`/${filename}`];
    case "compare":
      return [`/compare/${filename}`];
    case "learn":
      return [`/blog/${filename}`, "/blog"];
    case "resources":
      return filename === "overview"
        ? ["/resources"]
        : [`/resources/${filename}`, "/resources"];
    case "company":
      return [COMPANY_PATHS[filename] ?? `/${filename}`];
    case "utility":
      return [`/${filename}`];
    default:
      return [];
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !safeCompare(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  let body: WebhookBody = {};
  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    // ignore; body may be empty on some events
  }

  const collection = body.collection;
  const filename = body.document?.sys?.filename;

  // Globals (site settings, nav) → revalidate layout so header/footer refresh.
  if (collection === "global" || collection === "navigation") {
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: ["/"], layout: true });
  }

  if (!collection || !filename) {
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: ["/"], layout: true, fallback: true });
  }

  const paths = pathsFor(collection, filename);
  if (paths.length === 0) {
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: ["/"], layout: true, fallback: true });
  }

  paths.forEach((p) => revalidatePath(p));
  return NextResponse.json({ revalidated: paths });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
