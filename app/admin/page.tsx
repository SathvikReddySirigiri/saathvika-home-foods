export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderListFilters } from "@/components/admin/OrderListFilters";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  formatINR,
  formatOrderDate,
  formatOrderMethod,
} from "@/lib/admin-format";
import {
  fetchAdminSummary,
  fetchAllOrders,
  fetchOrderFilterOptions,
} from "@/lib/orders/admin-queries";

type PageProps = {
  searchParams: Promise<{ city?: string; state?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { city, state } = await searchParams;

  const [summary, orders, filterOptions] = await Promise.all([
    fetchAdminSummary(),
    fetchAllOrders({ city, state }),
    fetchOrderFilterOptions(),
  ]);

  return (
    <AdminShell title="Orders">
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl border border-brand-gold/25 bg-white p-4">
          <p className="font-sans text-xs font-medium uppercase tracking-wide text-brand-green/55">
            New orders
          </p>
          <p className="mt-1 font-serif text-3xl font-semibold text-brand-green">
            {summary.newOrderCount}
          </p>
        </div>
        <div className="rounded-xl border border-brand-gold/25 bg-white p-4">
          <p className="font-sans text-xs font-medium uppercase tracking-wide text-brand-green/55">
            Paid revenue
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold text-brand-green sm:text-3xl">
            {formatINR(summary.paidRevenue)}
          </p>
        </div>
      </div>

      <Suspense fallback={null}>
        <OrderListFilters
          cities={filterOptions.cities}
          states={filterOptions.states}
          selectedCity={city}
          selectedState={state}
        />
      </Suspense>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-brand-gold/20 bg-white p-8 text-center font-sans text-brand-green/70">
          {city || state ? "No orders match these filters." : "No orders yet."}
        </p>
      ) : (
        <>
          {/* Mobile: card list */}
          <ul className="space-y-3 md:hidden">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="block rounded-xl border border-brand-gold/25 bg-white p-4 transition-colors hover:border-brand-gold"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-sans text-sm font-semibold text-brand-green">
                        {order.customer_name}
                      </p>
                      <p className="font-sans text-xs text-brand-green/60">
                        {order.customer_phone}
                      </p>
                      {order.address_city && (
                        <p className="font-sans text-xs text-brand-green/55">
                          {order.address_city}
                          {order.address_state ? `, ${order.address_state}` : ""}
                        </p>
                      )}
                    </div>
                    <p className="font-serif text-lg font-semibold text-brand-green">
                      {formatINR(order.total_amount)}
                    </p>
                  </div>
                  <p className="mt-2 font-sans text-xs text-brand-green/55">
                    {formatOrderDate(order.created_at)} ·{" "}
                    {formatOrderMethod(order.order_method)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge type="payment" value={order.payment_status} />
                    <StatusBadge
                      type="fulfillment"
                      value={order.fulfillment_status}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="hidden overflow-x-auto rounded-xl border border-brand-gold/25 bg-white md:block">
            <table className="w-full min-w-[760px] text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-brand-gold/20 bg-brand-cream/80">
                  <th className="px-4 py-3 font-medium text-brand-green/70">
                    Date
                  </th>
                  <th className="px-4 py-3 font-medium text-brand-green/70">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-medium text-brand-green/70">
                    City
                  </th>
                  <th className="px-4 py-3 font-medium text-brand-green/70">
                    Method
                  </th>
                  <th className="px-4 py-3 font-medium text-brand-green/70">
                    Total
                  </th>
                  <th className="px-4 py-3 font-medium text-brand-green/70">
                    Payment
                  </th>
                  <th className="px-4 py-3 font-medium text-brand-green/70">
                    Fulfillment
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-brand-gold/10 last:border-0 hover:bg-brand-cream/50"
                  >
                    <td className="px-4 py-3 text-brand-green/80">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:text-brand-gold"
                      >
                        {formatOrderDate(order.created_at)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-brand-green hover:text-brand-gold"
                      >
                        {order.customer_name}
                      </Link>
                      <p className="text-xs text-brand-green/55">
                        {order.customer_phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-brand-green/80">
                      {order.address_city ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-brand-green/80">
                      {formatOrderMethod(order.order_method)}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-green">
                      {formatINR(order.total_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        type="payment"
                        value={order.payment_status}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        type="fulfillment"
                        value={order.fulfillment_status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
