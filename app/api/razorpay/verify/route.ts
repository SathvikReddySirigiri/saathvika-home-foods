import { NextResponse } from "next/server";
import { CONFIG } from "@/lib/config";
import { markOrderPaid } from "@/lib/orders/insert-order";
import { verifyPaymentSignature } from "@/lib/razorpay-verify";
import { isRazorpayConfigured } from "@/lib/razorpay-server";
import type { VerifyRazorpayPaymentRequest } from "@/lib/razorpay-types";

export async function POST(request: Request) {
  if (!CONFIG.paymentsEnabled) {
    return NextResponse.json(
      { error: "Online payments are not enabled." },
      { status: 403 },
    );
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!isRazorpayConfigured() || !secret) {
    return NextResponse.json(
      { error: "Payment service is not configured." },
      { status: 503 },
    );
  }

  let body: VerifyRazorpayPaymentRequest;
  try {
    body = (await request.json()) as VerifyRazorpayPaymentRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    dbOrderId,
  } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing payment verification fields." },
      { status: 400 },
    );
  }

  if (!dbOrderId || typeof dbOrderId !== "string") {
    return NextResponse.json(
      { error: "Missing order reference." },
      { status: 400 },
    );
  }

  const verified = verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    secret,
  );

  if (!verified) {
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 400 },
    );
  }

  const updated = await markOrderPaid(dbOrderId, razorpay_payment_id);

  if (!updated.success) {
    return NextResponse.json(
      {
        error:
          "Payment received but order could not be updated. Please contact us on WhatsApp with your payment ID.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    verified: true,
    paymentId: razorpay_payment_id,
    dbOrderId,
  });
}
