import { NextResponse } from "next/server";
import type { CartItem } from "@/lib/cart-context";
import { CONFIG } from "@/lib/config";
import { buildOrderMessage, formatDeliveryAddressLine, getOrderTotal, validateDeliveryDetails } from "@/lib/order-message";
import type { DeliveryDetails } from "@/lib/order-message";
import { getRazorpayInstance, isRazorpayConfigured } from "@/lib/razorpay-server";
import type { CreateRazorpayOrderRequest } from "@/lib/razorpay-types";

function recalculateTotalPaise(items: CartItem[]): number {
  return getOrderTotal(items) * 100;
}

export async function POST(request: Request) {
  if (!CONFIG.paymentsEnabled) {
    return NextResponse.json(
      { error: "Online payments are not enabled." },
      { status: 403 },
    );
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payment service is not configured." },
      { status: 503 },
    );
  }

  let body: CreateRazorpayOrderRequest;
  try {
    body = (await request.json()) as CreateRazorpayOrderRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { amount, delivery, items, dbOrderId } = body;

  if (!dbOrderId || typeof dbOrderId !== "string") {
    return NextResponse.json(
      { error: "Missing order reference. Please try again." },
      { status: 400 },
    );
  }

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const deliveryError = validateDeliveryDetails(delivery as DeliveryDetails);
  if (deliveryError) {
    return NextResponse.json({ error: deliveryError }, { status: 400 });
  }

  const expectedPaise = recalculateTotalPaise(items);
  if (typeof amount !== "number" || amount !== expectedPaise || amount < 100) {
    return NextResponse.json(
      { error: "Order amount mismatch. Please refresh and try again." },
      { status: 400 },
    );
  }

  try {
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: expectedPaise,
      currency: "INR",
      receipt: `shf_${dbOrderId.slice(0, 8)}`,
      notes: {
        supabase_order_id: dbOrderId,
        customer_name: delivery.name.trim(),
        customer_phone: delivery.phone.trim(),
        delivery_address: formatDeliveryAddressLine(delivery as DeliveryDetails),
        item_count: String(items.length),
        order_summary: buildOrderMessage(items, delivery).slice(0, 500),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not start payment. Please try again or order on WhatsApp.",
      },
      { status: 500 },
    );
  }
}
