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

type GriswoldLead = {
  franchiseName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  sensorCount?: string;
  sensorCountNA?: string;
  documentType?: string;
  shipName?: string;
  shipCompany?: string;
  shipAddress1?: string;
  shipAddress2?: string;
  shipCity?: string;
  shipState?: string;
  shipZip?: string;
  shipCountry?: string;
  shipPhone?: string;
};

const REQUIRED_FIELDS: Array<keyof GriswoldLead> = [
  "franchiseName",
  "contactName",
  "email",
  "phone",
];

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
  )}</td><td style="padding:6px 0;color:#191919;">${escapeHtml(value)}</td></tr>`;
}

function renderEmail(lead: GriswoldLead): { html: string; text: string } {
  const sensors = lead.sensorCountNA === "on" ? "Not sure yet" : lead.sensorCount || "";
  const hasShipping =
    lead.shipName ||
    lead.shipAddress1 ||
    lead.shipCity ||
    lead.shipState ||
    lead.shipZip;

  const html = `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#191919;">
      <h1 style="font-size:22px;margin:0 0 4px;">New Griswold conference lead</h1>
      <p style="color:#666;margin:0 0 20px;font-size:14px;">Submitted via /griswold</p>

      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Contact</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Franchise", lead.franchiseName)}
        ${row("Contact", lead.contactName)}
        ${row("Email", lead.email)}
        ${row("Phone", lead.phone)}
        ${row("Sensors", sensors)}
        ${row("Document", lead.documentType || "(not specified)")}
      </table>

      ${
        hasShipping
          ? `<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Shipping address</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Name", lead.shipName)}
        ${row("Company", lead.shipCompany)}
        ${row("Address 1", lead.shipAddress1)}
        ${row("Address 2", lead.shipAddress2)}
        ${row("City", lead.shipCity)}
        ${row("State", lead.shipState)}
        ${row("ZIP", lead.shipZip)}
        ${row("Country", lead.shipCountry)}
        ${row("Phone", lead.shipPhone)}
      </table>`
          : `<p style="color:#666;font-size:14px;margin:24px 0 0;"><em>No shipping address provided.</em></p>`
      }
    </div>
  `;

  const lines: string[] = [
    "New Griswold conference lead",
    "",
    "CONTACT",
    `Franchise: ${lead.franchiseName ?? ""}`,
    `Contact:   ${lead.contactName ?? ""}`,
    `Email:     ${lead.email ?? ""}`,
    `Phone:     ${lead.phone ?? ""}`,
    `Sensors:   ${sensors}`,
    `Document:  ${lead.documentType ?? ""}`,
  ];
  if (hasShipping) {
    lines.push(
      "",
      "SHIPPING ADDRESS",
      `Name:      ${lead.shipName ?? ""}`,
      `Company:   ${lead.shipCompany ?? ""}`,
      `Address 1: ${lead.shipAddress1 ?? ""}`,
      `Address 2: ${lead.shipAddress2 ?? ""}`,
      `City:      ${lead.shipCity ?? ""}`,
      `State:     ${lead.shipState ?? ""}`,
      `ZIP:       ${lead.shipZip ?? ""}`,
      `Country:   ${lead.shipCountry ?? ""}`,
      `Phone:     ${lead.shipPhone ?? ""}`
    );
  } else {
    lines.push("", "No shipping address provided.");
  }

  return { html, text: lines.join("\n") };
}

/* ─── Handler ───────────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = "Able Care <hello@able-care.co>";
  const toEmail = "hello@able-care.co";

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
    return NextResponse.json({ error: "Too many submissions, try again shortly." }, { status: 429 });
  }

  let lead: GriswoldLead;
  try {
    lead = (await request.json()) as GriswoldLead;
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

  const subjectName = lead.franchiseName?.trim() || lead.contactName?.trim() || "lead";
  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: lead.email,
      subject: `Griswold conference lead — ${subjectName}`,
      html,
      text,
    });
    if (error) {
      console.error("[griswold] resend error", error);
      return NextResponse.json(
        { error: "Could not send email. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[griswold] resend exception", err);
    return NextResponse.json(
      { error: "Could not send email. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
