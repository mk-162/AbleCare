import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─── Pricing constants (mirror OrderForm.tsx) ──────────────────────────── */

const SENSOR_PRICE = 199;
const ANNUAL_SUB_PRICE = 499;
const SHIPPING_COST = 39.95;

const FREE_SENSOR_REFERRAL_CODES = ["SGFreeSensor", "LLFreeSensor"] as const;
const FREE_SENSOR_CODES_NORMALIZED = new Set(
  FREE_SENSOR_REFERRAL_CODES.map((code) => code.toLowerCase()),
);

function isFreeSensorCode(code: string | undefined): boolean {
  if (!code) return false;
  return FREE_SENSOR_CODES_NORMALIZED.has(code.trim().toLowerCase());
}

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
  billStreet1?: string;
  billStreet2?: string;
  billCity?: string;
  billState?: string;
  billZip?: string;
  billPhone?: string;
  billEmail?: string;
  shipCustomer?: string;
  shipIndividual?: string;
  shipStreet1?: string;
  shipStreet2?: string;
  shipCity?: string;
  shipState?: string;
  shipZip?: string;
  shipPhone?: string;
  shipEmail?: string;
  sensorCount?: string;
  referralCode?: string;
};

const ORDER_REQUIRED: Array<keyof OrderRequest> = [
  "billCustomer",
  "billIndividual",
  "billStreet1",
  "billCity",
  "billState",
  "billZip",
  "billPhone",
  "billEmail",
  "sensorCount",
];

const SHIP_REQUIRED_IF_PRESENT: Array<keyof OrderRequest> = [
  "shipCustomer",
  "shipIndividual",
  "shipStreet1",
  "shipCity",
  "shipState",
  "shipZip",
  "shipPhone",
  "shipEmail",
];

const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;

function formatAddress(parts: {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
}): string {
  const street1 = parts.street1?.trim();
  const street2 = parts.street2?.trim();
  const city = parts.city?.trim();
  const state = parts.state?.trim();
  const zip = parts.zip?.trim();

  const lines: string[] = [];
  if (street1) lines.push(street1);
  if (street2) lines.push(street2);

  const cityState = city && state ? `${city}, ${state}` : city || state || "";
  const cityStateZip = [cityState, zip].filter(Boolean).join(" ");
  if (cityStateZip) lines.push(cityStateZip);

  return lines.join("\n");
}

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

function computeInvoiceTotals(sensorCountRaw?: string, referralCode?: string) {
  const qty = Math.max(0, Math.floor(Number(sensorCountRaw) || 0));
  const sensorFree = isFreeSensorCode(referralCode);
  const sensorUnitPrice = sensorFree ? 0 : SENSOR_PRICE;
  const sensorListLine = SENSOR_PRICE * qty;
  const sensorsLine = sensorUnitPrice * qty;
  const subscriptionLine = ANNUAL_SUB_PRICE * qty;
  const shipping = qty > 0 ? SHIPPING_COST : 0;
  const total = sensorsLine + subscriptionLine + shipping;
  return {
    qty,
    sensorFree,
    sensorUnitPrice,
    sensorListLine,
    sensorsLine,
    subscriptionLine,
    shipping,
    total,
  };
}

/* ─── Email rendering ───────────────────────────────────────────────────── */

function renderOrderEmail(
  lead: OrderRequest,
  documentType: "estimate" | "invoice"
): { html: string; text: string; subject: string } {
  const totals = computeInvoiceTotals(lead.sensorCount, lead.referralCode);
  const sameAsBilling = !lead.shipStreet1;
  const billAddressDisplay = formatAddress({
    street1: lead.billStreet1,
    street2: lead.billStreet2,
    city: lead.billCity,
    state: lead.billState,
    zip: lead.billZip,
  });
  const shipAddressDisplay = formatAddress({
    street1: lead.shipStreet1,
    street2: lead.shipStreet2,
    city: lead.shipCity,
    state: lead.shipState,
    zip: lead.shipZip,
  });
  const docLabel = documentType === "estimate" ? "estimate" : "invoice";
  const headline = documentType === "estimate" ? "estimate request" : "invoice request";
  const referralRaw = lead.referralCode?.trim() ?? "";
  const referralValid = totals.sensorFree;

  const sensorPriceHtml = totals.sensorFree
    ? `<span style="color:#999;text-decoration:line-through;">${formatCurrency(
        SENSOR_PRICE,
      )}</span> ${formatCurrency(0)}`
    : formatCurrency(SENSOR_PRICE);
  const sensorAmountHtml = totals.sensorFree
    ? `<span style="color:#999;text-decoration:line-through;">${formatCurrency(
        totals.sensorListLine,
      )}</span> ${formatCurrency(totals.sensorsLine)}`
    : formatCurrency(totals.sensorsLine);
  const sensorLineLabel = totals.sensorFree
    ? "Able Assess Sensor (free with referral code)"
    : "Able Assess Sensor";

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
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;">${sensorLineLabel}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${totals.qty}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${sensorPriceHtml}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0;">${sensorAmountHtml}</td>
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
          <td colspan="3" style="padding:10px;text-align:right;font-weight:700;background:#eef0ff;">Subtotal <span style="font-weight:400;color:#666;font-size:11px;">(excludes applicable taxes)</span></td>
          <td style="padding:10px;text-align:right;font-weight:700;color:#1432FF;background:#eef0ff;">${formatCurrency(totals.total)}</td>
        </tr>
      </tfoot>
    </table>
  `;

  const referralDisplay = referralRaw
    ? referralValid
      ? `${referralRaw} (valid — sensor hardware free)`
      : `${referralRaw} (not recognized)`
    : "";

  const html = `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#191919;">
      <h1 style="font-size:22px;margin:0 0 4px;">New order — ${headline}</h1>
      <p style="color:#666;margin:0 0 20px;font-size:14px;">Submitted via /order &mdash; customer asked for an ${docLabel}</p>

      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Bill to</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Organization", lead.billCustomer)}
        ${row("Contact", lead.billIndividual)}
        ${row("Address", billAddressDisplay)}
        ${row("Phone", lead.billPhone)}
        ${row("Email", lead.billEmail)}
        ${row("Referral code", referralDisplay)}
      </table>

      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Ship to</h2>
      ${
        sameAsBilling
          ? `<p style="color:#666;font-size:14px;margin:0;"><em>Same as billing address.</em></p>`
          : `<table style="width:100%;border-collapse:collapse;font-size:14px;">
              ${row("Organization", lead.shipCustomer)}
              ${row("Contact", lead.shipIndividual)}
              ${row("Address", shipAddressDisplay)}
              ${row("Phone", lead.shipPhone)}
              ${row("Email", lead.shipEmail)}
            </table>`
      }

      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#1432FF;margin:24px 0 8px;">Order summary</h2>
      ${lineItemsHtml}
    </div>
  `;

  const sensorTextLine = totals.sensorFree
    ? `Sensors x${totals.qty} @ ${formatCurrency(SENSOR_PRICE)} → free with referral = ${formatCurrency(totals.sensorsLine)}`
    : `Sensors x${totals.qty} @ ${formatCurrency(SENSOR_PRICE)} = ${formatCurrency(totals.sensorsLine)}`;

  const text = [
    `New order — ${headline}`,
    "",
    "BILL TO",
    `Organization: ${lead.billCustomer ?? ""}`,
    `Contact:      ${lead.billIndividual ?? ""}`,
    `Address:`,
    billAddressDisplay
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n"),
    `Phone:        ${lead.billPhone ?? ""}`,
    `Email:        ${lead.billEmail ?? ""}`,
    `Referral:     ${referralDisplay || "(none)"}`,
    "",
    "SHIP TO",
    sameAsBilling
      ? "(same as billing)"
      : [
          `Organization: ${lead.shipCustomer ?? ""}`,
          `Contact:      ${lead.shipIndividual ?? ""}`,
          `Address:`,
          shipAddressDisplay
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n"),
          `Phone:        ${lead.shipPhone ?? ""}`,
          `Email:        ${lead.shipEmail ?? ""}`,
        ].join("\n"),
    "",
    "ORDER",
    sensorTextLine,
    `Data Sub x${totals.qty} @ ${formatCurrency(ANNUAL_SUB_PRICE)} = ${formatCurrency(totals.subscriptionLine)}`,
    `Shipping = ${formatCurrency(totals.shipping)}`,
    `SUBTOTAL: ${formatCurrency(totals.total)} (excludes applicable taxes)`,
  ].join("\n");

  const subjectName = lead.billCustomer?.trim() || lead.billIndividual?.trim() || "lead";
  const referralSubjectTag = referralValid ? ` [referral: ${referralRaw}]` : "";
  const subject = `Able Care order — ${headline} from ${subjectName} (${formatCurrency(totals.total)})${referralSubjectTag}`;
  return { html, text, subject };
}

function renderCustomerAutoReply(
  lead: OrderRequest,
  documentType: "estimate" | "invoice",
): { subject: string; html: string; text: string } {
  const docLabel = documentType === "estimate" ? "estimate" : "invoice";
  const firstName =
    (lead.billIndividual?.trim() || lead.billCustomer?.trim() || "there").split(/\s+/)[0] ?? "there";

  const subject = `Thanks — we've received your Able Care ${docLabel} request`;

  const html = `
    <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#191919;">
      <p style="font-size:16px;margin:0 0 16px;line-height:1.5;">Hi ${escapeHtml(firstName)},</p>
      <p style="font-size:16px;margin:0 0 16px;line-height:1.5;">
        Thank you for submitting a request for an ${docLabel}. Our team will be getting back to you shortly.
      </p>
      <p style="font-size:14px;color:#666;margin:24px 0 0;line-height:1.5;">
        If your inquiry is urgent, you can reach us directly at
        <a href="mailto:hello@able-care.co" style="color:#1432FF;text-decoration:none;">hello@able-care.co</a>
        or +1 406 318 9624.
      </p>
      <p style="font-size:14px;color:#666;margin:16px 0 0;">— The Able Care team</p>
    </div>
  `;

  const text = [
    `Hi ${firstName},`,
    "",
    `Thank you for submitting a request for an ${docLabel}. Our team will be getting back to you shortly.`,
    "",
    "If your inquiry is urgent, you can reach us directly at hello@able-care.co or +1 406 318 9624.",
    "",
    "— The Able Care team",
  ].join("\n");

  return { subject, html, text };
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
  if (payload.billZip && !ZIP_PATTERN.test(String(payload.billZip).trim())) {
    return NextResponse.json(
      { error: "Billing ZIP code must be 5 digits (optionally with -4)." },
      { status: 400 }
    );
  }

  // If any ship-to field came through, treat the customer as supplying a
  // distinct ship address and require the full set.
  const anyShipFieldPresent = SHIP_REQUIRED_IF_PRESENT.some((key) => {
    const value = payload[key];
    return typeof value === "string" && value.trim().length > 0;
  });
  if (anyShipFieldPresent) {
    for (const field of SHIP_REQUIRED_IF_PRESENT) {
      if (!payload[field] || !String(payload[field]).trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    if (payload.shipZip && !ZIP_PATTERN.test(String(payload.shipZip).trim())) {
      return NextResponse.json(
        { error: "Shipping ZIP code must be 5 digits (optionally with -4)." },
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

  // Best-effort customer auto-reply. We've already captured the lead via the
  // team email above, so a Resend hiccup here must not fail the customer's
  // submission — just log it.
  if (replyTo) {
    try {
      const autoReply = renderCustomerAutoReply(payload, documentType);
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: replyTo,
        replyTo: toEmail,
        subject: autoReply.subject,
        html: autoReply.html,
        text: autoReply.text,
      });
      if (error) {
        console.error("[order] auto-reply error", error);
      }
    } catch (err) {
      console.error("[order] auto-reply exception", err);
    }
  }

  return NextResponse.json({ ok: true });
}
