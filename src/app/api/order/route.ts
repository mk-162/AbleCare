import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─── Pricing constants (mirror OrderForm.tsx) ──────────────────────────── */

const SENSOR_PRICE = 199;
const ANNUAL_SUB_PRICE = 360;
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

type OrderEstimate = {
  formId: "order-estimate";
  customerName?: string;
  individualName?: string;
  phone?: string;
  email?: string;
  sensorCount?: string;
  sensorCountNA?: string;
};

type OrderInvoice = {
  formId: "order-invoice";
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
  confirmInvoice?: string;
};

type OrderPayload = OrderEstimate | OrderInvoice;

const ESTIMATE_REQUIRED: Array<keyof OrderEstimate> = [
  "customerName",
  "individualName",
  "phone",
  "email",
];

const INVOICE_REQUIRED: Array<keyof OrderInvoice> = [
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

function renderEstimateEmail(lead: OrderEstimate): { html: string; text: string; subject: string } {
  const sensors = lead.sensorCountNA === "on" ? "Not sure yet" : lead.sensorCount || "";
  const html = `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#191919;">
      <h1 style="font-size:22px;margin:0 0 4px;">New order — estimate request</h1>
      <p style="color:#666;margin:0 0 20px;font-size:14px;">Submitted via /order</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Organization", lead.customerName)}
        ${row("Contact", lead.individualName)}
        ${row("Phone", lead.phone)}
        ${row("Email", lead.email)}
        ${row("Sensors", sensors)}
      </table>
    </div>
  `;
  const text = [
    "New order — estimate request",
    "",
    `Organization: ${lead.customerName ?? ""}`,
    `Contact:      ${lead.individualName ?? ""}`,
    `Phone:        ${lead.phone ?? ""}`,
    `Email:        ${lead.email ?? ""}`,
    `Sensors:      ${sensors}`,
  ].join("\n");

  const subjectName = lead.customerName?.trim() || lead.individualName?.trim() || "lead";
  return { html, text, subject: `Able Care order — estimate request from ${subjectName}` };
}

function renderInvoiceEmail(lead: OrderInvoice): { html: string; text: string; subject: string } {
  const totals = computeInvoiceTotals(lead.sensorCount);
  const sameAsBilling = !lead.shipAddress;

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
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;">Able Assess Data Sub (1 year)</td>
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
      <h1 style="font-size:22px;margin:0 0 4px;">New order — invoice request</h1>
      <p style="color:#666;margin:0 0 20px;font-size:14px;">Submitted via /order</p>

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
    "New order — invoice request",
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
  const subject = `Able Care order — invoice request from ${subjectName} (${formatCurrency(totals.total)})`;
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

  let payload: OrderPayload;
  try {
    payload = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let html: string;
  let text: string;
  let subject: string;
  let replyTo: string | undefined;

  if (payload.formId === "order-estimate") {
    for (const field of ESTIMATE_REQUIRED) {
      if (!payload[field] || !String(payload[field]).trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    const rendered = renderEstimateEmail(payload);
    html = rendered.html;
    text = rendered.text;
    subject = rendered.subject;
    replyTo = payload.email;
  } else if (payload.formId === "order-invoice") {
    for (const field of INVOICE_REQUIRED) {
      if (!payload[field] || !String(payload[field]).trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    if (Number(payload.sensorCount) <= 0) {
      return NextResponse.json(
        { error: "Sensor count must be at least 1." },
        { status: 400 }
      );
    }
    const rendered = renderInvoiceEmail(payload);
    html = rendered.html;
    text = rendered.text;
    subject = rendered.subject;
    replyTo = payload.billEmail;
  } else {
    return NextResponse.json(
      { error: "Unknown form type." },
      { status: 400 }
    );
  }

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
