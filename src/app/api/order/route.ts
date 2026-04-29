import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─── Pricing constants (mirror OrderForm.tsx) ──────────────────────────── */

const SENSOR_PRICE = 199;
const ANNUAL_SUB_PRICE = 360;
const ANNUAL_SUB_RRP = 499;
const SHIPPING_COST = 39.95;

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

/* ─── Payload shapes ────────────────────────────────────────────────────── */

type OrderRequest = {
  documentType?: "estimate" | "invoice";
  billCustomer?: string;
  billIndividual?: string;
  billAddress?: string;
  billPhone?: string;
  billEmail?: string;
  shipCustomer?: string;
  shipIndividual?: string;
  shipAddress?: string;
  shipPhone?: string;
  shipEmail?: string;
  sensorCount?: string;
};

const ORDER_REQUIRED: Array<keyof OrderRequest> = [
  "billCustomer",
  "billIndividual",
  "billAddress",
  "billPhone",
  "billEmail",
  "sensorCount",
];

/* ─── Helpers ───────────────────────────────────────────────────────────── */

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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.max(0, value));
}

function computeInvoiceTotals(sensorCountRaw?: string) {
  const qty = Math.max(0, Math.floor(Number(sensorCountRaw) || 0));
  const sensorsLine = SENSOR_PRICE * qty;
  const subscriptionLine = ANNUAL_SUB_PRICE * qty;
  const shipping = qty > 0 ? SHIPPING_COST : 0;
  const total = sensorsLine + subscriptionLine + shipping;
  return { qty, sensorsLine, subscriptionLine, shipping, total };
}

/* ─── Email rendering ───────────────────────────────────────────────────── */

function renderOrderEmail(
  lead: OrderRequest,
  documentType: "estimate" | "invoice"
): { html: string; text: string; subject: string } {
  const totals = computeInvoiceTotals(lead.sensorCount);
  const sameAsBilling = !lead.shipAddress;
  const docLabel = documentType === "estimate" ? "estimate" : "invoice";
  const headline = documentType === "estimate" ? "estimate request" : "invoice request";
  const subscriptionLineLabel = `Able Assess Data Sub (1 year, show price — RRP ${formatCurrency(
    ANNUAL_SUB_RRP
  )})`;

  const lineItemsHtml = `
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="text-align:left;padding:8px;border-bottom:1px solid #e0e0e0;">Item</th>
          <th style="text-align:right;padding:8px;border-bottom:1px solid #e0e0e0;">Qty</th>
          <th style="text-align:right;padding:8px;border-bottom:1px solid #e0e0e0;">Unit</th>
          <th style="text-align:right;padding:8px;border-bottom:1px solid #e0e0e0;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;">Able Assess Sensor</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${totals.qty}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${formatCurrency(SENSOR_PRICE)}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${formatCurrency(totals.sensorsLine)}</td>
        </tr>
        <tr>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;">${subscriptionLineLabel}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${totals.qty}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${formatCurrency(ANNUAL_SUB_PRICE)}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${formatCurrency(totals.subscriptionLine)}</td>
        </tr>
        <tr>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;">Shipping (flat fee)</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">1</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${formatCurrency(SHIPPING_COST)}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${formatCurrency(totals.shipping)}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:10px;text-align:right;font-weight:700;background:#eef0ff;">Total Due</td>
          <td style="padding:10px;text-align:right;font-weight:700;color:#1432FF;background:#eef0ff;">${formatCurrency(totals.total)}</td>
        </tr>
      </tfoot>
    </table>
  `;

  const html = `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#191919;">
      <h1 style="font-size:22px;margin:0 0 4px;">New order — ${headline}</h1>
      <p style="color:#666;margin:0 0 20px;font-size:14px;">Submitted via /order &mdash; customer asked for an ${docLabel}</p>

      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Bill to</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Organization", lead.billCustomer)}
        ${row("Contact", lead.billIndividual)}
        ${row("Address", lead.billAddress)}
        ${row("Phone", lead.billPhone)}
        ${row("Email", lead.billEmail)}
      </table>

      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Ship to</h2>
      ${
        sameAsBilling
          ? `<p style="color:#666;font-size:14px;margin:0;"><em>Same as billing address.</em></p>`
          : `<table style="width:100%;border-collapse:collapse;font-size:14px;">
              ${row("Organization", lead.shipCustomer)}
              ${row("Contact", lead.shipIndividual)}
              ${row("Address", lead.shipAddress)}
              ${row("Phone", lead.shipPhone)}
              ${row("Email", lead.shipEmail)}
            </table>`
      }

      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Order summary</h2>
      ${lineItemsHtml}
    </div>
  `;

  const text = [
    `New order — ${headline}`,
    "",
    "BILL TO",
    `Organization: ${lead.billCustomer ?? ""}`,
    `Contact:      ${lead.billIndividual ?? ""}`,
    `Address:      ${lead.billAddress ?? ""}`,
    `Phone:        ${lead.billPhone ?? ""}`,
    `Email:        ${lead.billEmail ?? ""}`,
    "",
    "SHIP TO",
    sameAsBilling
      ? "(same as billing)"
      : [
          `Organization: ${lead.shipCustomer ?? ""}`,
          `Contact:      ${lead.shipIndividual ?? ""}`,
          `Address:      ${lead.shipAddress ?? ""}`,
          `Phone:        ${lead.shipPhone ?? ""}`,
          `Email:        ${lead.shipEmail ?? ""}`,
        ].join("\n"),
    "",
    "ORDER",
    `Sensors x${totals.qty} @ ${formatCurrency(SENSOR_PRICE)} = ${formatCurrency(totals.sensorsLine)}`,
    `Data Sub x${totals.qty} @ ${formatCurrency(ANNUAL_SUB_PRICE)} = ${formatCurrency(totals.subscriptionLine)}`,
    `Shipping = ${formatCurrency(totals.shipping)}`,
    `TOTAL DUE: ${formatCurrency(totals.total)}`,
  ].join("\n");

  const subjectName = lead.billCustomer?.trim() || lead.billIndividual?.trim() || "lead";
  const subject = `Able Care order — ${headline} from ${subjectName} (${formatCurrency(totals.total)})`;
  return { html, text, subject };
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
    return NextResponse.json(
      { error: "Too many submissions, try again shortly." },
      { status: 429 }
    );
  }

  let payload: OrderRequest;
  try {
    payload = (await request.json()) as OrderRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (payload.documentType !== "estimate" && payload.documentType !== "invoice") {
    return NextResponse.json(
      { error: "documentType must be 'estimate' or 'invoice'." },
      { status: 400 }
    );
  }
  const documentType = payload.documentType;

  for (const field of ORDER_REQUIRED) {
    if (!payload[field] || !String(payload[field]).trim()) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }
  const parsedQty = Number(payload.sensorCount);
  if (!Number.isInteger(parsedQty) || parsedQty < 1) {
    return NextResponse.json(
      { error: "Sensor count must be a whole number of 1 or more." },
      { status: 400 }
    );
  }

  const { html, text, subject } = renderOrderEmail(payload, documentType);
  const replyTo = payload.billEmail;

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[order] resend error", error);
      return NextResponse.json(
        { error: "Could not send email. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[order] resend exception", err);
    return NextResponse.json(
      { error: "Could not send email. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
