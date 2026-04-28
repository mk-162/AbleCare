import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─── Rate limiting ─────────────────────────────────────────────────────── */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
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

/* ─── Payload shape ─────────────────────────────────────────────────────── */

type EmailGateLead = {
  firstName?: string;
  email?: string;
  organization?: string;
  subscribe?: boolean;
  resourceTitle?: string;
  resourceUrl?: string;
  source?: string;
};

const REQUIRED_FIELDS: Array<keyof EmailGateLead> = ["firstName", "email"];

/* ─── Email rendering ───────────────────────────────────────────────────── */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value?: string): string {
  if (!value || !value.trim()) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#666;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(
    label
  )}</td><td style="padding:6px 0;color:#191919;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`;
}

function renderEmail(lead: EmailGateLead): { html: string; text: string } {
  const subscribed = lead.subscribe ? "Yes" : "No";

  const html = `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#191919;">
      <h1 style="font-size:22px;margin:0 0 4px;">New gated download</h1>
      <p style="color:#666;margin:0 0 20px;font-size:14px;">Submitted via ${escapeHtml(
        lead.source || "/resources"
      )}</p>

      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Lead</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Name", lead.firstName)}
        ${row("Email", lead.email)}
        ${row("Organization", lead.organization)}
        ${row("Newsletter opt-in", subscribed)}
      </table>

      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Resource</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Title", lead.resourceTitle)}
        ${row("File", lead.resourceUrl)}
      </table>
    </div>
  `;

  const lines: string[] = [
    "New gated download",
    "",
    `Source:        ${lead.source || "/resources"}`,
    "",
    "LEAD",
    `Name:          ${lead.firstName ?? ""}`,
    `Email:         ${lead.email ?? ""}`,
    `Organization:  ${lead.organization ?? ""}`,
    `Newsletter:    ${subscribed}`,
    "",
    "RESOURCE",
    `Title:         ${lead.resourceTitle ?? ""}`,
    `File:          ${lead.resourceUrl ?? ""}`,
  ];

  return { html, text: lines.join("\n") };
}

/* ─── Handler ───────────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_GATE_FROM_EMAIL || "Able Care <hello@able-care.co>";
  const toEmail =
    process.env.EMAIL_GATE_TO_EMAIL ||
    process.env.GRISWOLD_TO_EMAIL ||
    "hello@able-care.co";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured." },
      { status: 500 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions, try again shortly." },
      { status: 429 }
    );
  }

  let lead: EmailGateLead;
  try {
    lead = (await request.json()) as EmailGateLead;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!lead[field] || !String(lead[field]).trim()) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const { html, text } = renderEmail(lead);
  const resend = new Resend(apiKey);

  const subjectName = lead.organization?.trim() || lead.firstName?.trim() || lead.email || "lead";
  const subjectResource = lead.resourceTitle?.trim() || "resource";

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: lead.email,
      subject: `Able Care download — ${subjectResource} — ${subjectName}`,
      html,
      text,
    });
    if (error) {
      console.error("[email-gate] resend error", error);
      return NextResponse.json(
        { error: "Could not send email. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[email-gate] resend exception", err);
    return NextResponse.json(
      { error: "Could not send email. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
