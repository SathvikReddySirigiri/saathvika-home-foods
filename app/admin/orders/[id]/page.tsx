export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { FulfillmentSelect } from "@/components/admin/FulfillmentSelect";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  formatCustomizationLine,
  formatINR,
  formatOrderDate,
  formatOrderMethod,
  formatPaymentStatus,
} from "@/lib/admin-format";
import { fetchOrderById } from "@/lib/orders/admin-queries";
import type { OrderRow } from "@/lib/types/orders";

type PageProps = { params: Promise<{ id: string }> };

function StructuredAddress({ order }: { order: OrderRow }) {
  if (order.address_flat) {
    return (
      <dl className="mt-3 space-y-2 font-sans text-sm">
        <div>
          <dt className="text-brand-green/55">Flat / House</dt>
          <dd className="text-brand-green/85">{order.address_flat}</dd>
        </div>
        <div>
          <dt className="text-brand-green/55">Street / Area</dt>
          <dd className="text-brand-green/85">{order.address_street}</dd>
        </div>
        <div>
          <dt className="text-brand-green/55">City</dt>
          <dd className="text-brand-green/85">{order.address_city}</dd>
        </div>
        <div>
          <dt className="text-brand-green/55">State</dt>
          <dd className="text-brand-green/85">{order.address_state}</dd>
        </div>
        <div>
          <dt className="text-brand-green/55">Pincode</dt>
          <dd className="text-brand-green/85">{order.address_pincode}</dd>
        </div>
      </dl>
    );
  }

  return (
    <p className="mt-3 font-sans text-sm leading-relaxed text-brand-green/80">
      {order.delivery_address}
    </p>
  );
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await fetchOrderById(id);

  if (!order) notFound();

  return (
    <AdminShell title="Order detail">
      <Link
        href="/admin"
        className="mb-6 inline-block font-sans text-sm text-brand-green/70 hover:text-brand-gold"
      >
        ← All orders
      </Link>

      <div className="space-y-6">
        <section className="rounded-xl border border-brand-gold/25 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-brand-green">
                {order.customer_name}
              </h1>
              <p className="mt-1 font-sans text-brand-green/70">
                {order.customer_phone}
              </p>
              <StructuredAddress order={order} />
            </div>
            <div className="text-left sm:text-right">
              <p className="font-serif text-3xl font-semibold text-brand-green">
                {formatINR(order.total_amount)}
              </p>
              <p className="mt-1 font-sans text-sm text-brand-green/60">
                {formatOrderDate(order.created_at)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-green/10 px-3 py-1 font-sans text-xs font-medium text-brand-green">
              {formatOrderMethod(order.order_method)}
            </span>
            <StatusBadge type="payment" value={order.payment_status} />
            <StatusBadge type="fulfillment" value={order.fulfillment_status} />
          </div>

          <div className="mt-6 border-t border-brand-gold/15 pt-6">
            <FulfillmentSelect
              orderId={order.id}
              current={order.fulfillment_status}
            />
          </div>
        </section>

        {order.order_method === "online" && (
          <section className="rounded-xl border border-brand-gold/25 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-lg font-semibold text-brand-green">
              Online payment
            </h2>
            <dl className="mt-3 space-y-2 font-sans text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-brand-green/60">Payment status</dt>
                <dd className="font-medium text-brand-green">
                  {formatPaymentStatus(order.payment_status)}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <dt className="text-brand-green/60">Razorpay payment ID</dt>
                <dd className="break-all font-mono text-xs text-brand-green">
                  {order.payment_id ?? "—"}
                </dd>
              </div>
            </dl>
            <p className="mt-3 font-sans text-xs text-brand-green/55">
              Card and UPI details are never stored — only Razorpay&apos;s
              payment reference.
            </p>
          </section>
        )}

        <section className="rounded-xl border border-brand-gold/25 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-lg font-semibold text-brand-green">
            Items ({order.items.length})
          </h2>
          <ul className="mt-4 divide-y divide-brand-gold/15">
            {order.items.map((item, index) => (
              <li key={`${item.productId}-${index}`} className="py-4 first:pt-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <div>
                    <p className="font-sans font-medium text-brand-green">
                      {item.productName}
                    </p>
                    <p className="mt-1 font-sans text-sm text-brand-green/70">
                      {item.packSize.label} · {formatCustomizationLine(item)} ·
                      Qty {item.quantity}
                    </p>
                    {item.customizations.length > 0 && (
                      <ul className="mt-2 font-sans text-xs text-brand-green/55">
                        {item.customizations.map((c) => (
                          <li key={`${c.type}-${c.value}`}>{c.label}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p className="font-sans font-semibold text-brand-green sm:text-right">
                    {formatINR(item.lineTotal)}
                    <span className="block text-xs font-normal text-brand-green/55">
                      {formatINR(item.unitPrice)} each
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="font-sans text-xs text-brand-green/50">
          Order ID: <span className="font-mono">{order.id}</span>
        </p>
      </div>
    </AdminShell>
  );
}
