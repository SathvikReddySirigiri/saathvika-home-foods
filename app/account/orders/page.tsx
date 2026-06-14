import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatINR, formatOrderDate, formatOrderMethod } from "@/lib/admin-format";
import { createServerSupabaseClient, getCurrentUser } from "@/lib/supabase/server";
import type { OrderRow } from "@/lib/types/orders";

export default async function MyOrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in?next=/account/orders");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as OrderRow[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-serif text-2xl font-semibold text-brand-green sm:text-3xl">
        My Orders
      </h1>
      <p className="mt-2 font-sans text-sm text-brand-green/70">
        Orders placed while signed in to your account.
      </p>

      {error && (
        <p className="mt-6 font-sans text-sm text-brand-red" role="alert">
          Could not load your orders. Please try again later.
        </p>
      )}

      {!error && orders.length === 0 && (
        <div className="mt-8 rounded-2xl border border-brand-gold/25 bg-white/60 p-8 text-center">
          <p className="font-sans text-brand-green/75">No orders linked to your account yet.</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-brand-gold px-5 font-sans text-sm font-semibold text-brand-green-deep hover:bg-brand-gold/90"
          >
            Start shopping
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border border-brand-gold/25 bg-white/60 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-sans text-sm text-brand-green/60">
                    {formatOrderDate(order.created_at)} ·{" "}
                    {formatOrderMethod(order.order_method)}
                  </p>
                  <p className="mt-1 font-sans text-sm text-brand-green/80">
                    {order.address_city
                      ? `${order.address_city}${order.address_state ? `, ${order.address_state}` : ""}`
                      : order.delivery_address}
                  </p>
                  <p className="mt-1 font-sans text-xs text-brand-green/55">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-serif text-xl font-semibold text-brand-green">
                    {formatINR(order.total_amount)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 sm:justify-end">
                    <StatusBadge type="payment" value={order.payment_status} />
                    <StatusBadge
                      type="fulfillment"
                      value={order.fulfillment_status}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
