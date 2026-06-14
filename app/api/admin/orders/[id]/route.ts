import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateOrderFulfillment } from "@/lib/orders/admin-queries";
import type { FulfillmentStatus } from "@/lib/types/orders";

const FULFILLMENT_STATUSES: FulfillmentStatus[] = [
  "new",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
];

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: { fulfillment_status?: string };
  try {
    body = (await request.json()) as { fulfillment_status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const status = body.fulfillment_status;
  if (!status || !FULFILLMENT_STATUSES.includes(status as FulfillmentStatus)) {
    return NextResponse.json(
      { error: "Invalid fulfillment status." },
      { status: 400 },
    );
  }

  const result = await updateOrderFulfillment(id, status as FulfillmentStatus);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error ?? "Update failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, fulfillment_status: status });
}
