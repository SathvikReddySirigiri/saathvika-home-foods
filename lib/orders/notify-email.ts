import { Resend } from "resend";
import { CONFIG } from "@/lib/config";
import { formatINR } from "@/lib/pricing";
import type { OrderItemSnapshot, OrderMethod } from "@/lib/types/orders";

type NotifyOrderEmailParams = {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItemSnapshot[];
  totalAmount: number;
  orderMethod: OrderMethod;
  paymentStatus: string;
};

function formatItemLine(item: OrderItemSnapshot, index: number): string {
  const custom =
    item.customizations.length > 0
      ? item.customizations
          .map((c) => c.label.replace(/\s*\(default\)\s*/i, ""))
          .join(", ")
      : "Standard preparation";

  return `${index + 1}. ${item.productName} — ${item.packSize.label} — ${custom} — Qty ${item.quantity} — ${formatINR(item.lineTotal)}`;
}

function buildEmailHtml(params: NotifyOrderEmailParams): string {
  const methodLabel =
    params.orderMethod === "whatsapp" ? "WhatsApp" : "Online payment";
  const itemRows = params.items
    .map(
      (item, i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${formatItemLine(item, i)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:560px;color:#1C3A2E">
      <h2 style="color:#1C3A2E;margin:0 0 8px">New order — ${CONFIG.businessName}</h2>
      <p style="margin:0 0 16px;color:#666">Order ID: <strong>${params.orderId}</strong></p>
      <table style="width:100%;margin-bottom:16px">
        <tr><td><strong>Customer</strong></td><td>${escapeHtml(params.customerName)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(params.customerPhone)}</td></tr>
        <tr><td valign="top"><strong>Address</strong></td><td>${escapeHtml(params.deliveryAddress)}</td></tr>
        <tr><td><strong>Method</strong></td><td>${methodLabel}</td></tr>
        <tr><td><strong>Payment</strong></td><td>${params.paymentStatus}</td></tr>
        <tr><td><strong>Total</strong></td><td>${formatINR(params.totalAmount)}</td></tr>
      </table>
      <h3 style="margin:16px 0 8px">Items</h3>
      <table style="width:100%">${itemRows}</table>
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends order notification email. Never throws — logs on failure.
 */
export async function sendOrderNotificationEmail(
  params: NotifyOrderEmailParams,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ??
    `${CONFIG.businessName} <onboarding@resend.dev>`;

  if (!apiKey || !notifyEmail) {
    console.error(
      "[orders] Email skipped: RESEND_API_KEY or NOTIFY_EMAIL not set",
    );
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const methodLabel =
      params.orderMethod === "whatsapp" ? "WhatsApp" : "Online";

    await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `New ${methodLabel} order — ${params.customerName} — ${formatINR(params.totalAmount)}`,
      html: buildEmailHtml(params),
    });
  } catch (err) {
    console.error("[orders] Failed to send notification email:", err);
  }
}
