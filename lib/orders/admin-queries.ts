import { createServerSupabaseAdmin } from "@/lib/supabase";
import type { FulfillmentStatus, OrderRow } from "@/lib/types/orders";

export type AdminSummary = {
  newOrderCount: number;
  paidRevenue: number;
};

export type OrderListFilters = {
  city?: string;
  state?: string;
};

export type OrderFilterOptions = {
  cities: string[];
  states: string[];
};

function uniqueSorted(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v?.trim())))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export async function fetchAdminSummary(): Promise<AdminSummary> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return { newOrderCount: 0, paidRevenue: 0 };
  }

  const supabase = createServerSupabaseAdmin();

  const { count, error: newErr } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("fulfillment_status", "new");

  const { data: paidOrders, error: paidErr } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("payment_status", "paid");

  if (newErr || paidErr) {
    console.error("[admin] summary fetch failed:", newErr ?? paidErr);
    return { newOrderCount: 0, paidRevenue: 0 };
  }

  const paidRevenue =
    paidOrders?.reduce((sum, row) => sum + (row.total_amount ?? 0), 0) ?? 0;

  return {
    newOrderCount: count ?? 0,
    paidRevenue,
  };
}

export async function fetchOrderFilterOptions(): Promise<OrderFilterOptions> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return { cities: [], states: [] };
  }

  const supabase = createServerSupabaseAdmin();

  const { data, error } = await supabase
    .from("orders")
    .select("address_city, address_state");

  if (error || !data) {
    console.error("[admin] filter options fetch failed:", error);
    return { cities: [], states: [] };
  }

  return {
    cities: uniqueSorted(data.map((row) => row.address_city)),
    states: uniqueSorted(data.map((row) => row.address_state)),
  };
}

export async function fetchAllOrders(
  filters: OrderListFilters = {},
): Promise<OrderRow[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return [];
  }

  const supabase = createServerSupabaseAdmin();

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.city) {
    query = query.eq("address_city", filters.city);
  }

  if (filters.state) {
    query = query.eq("address_state", filters.state);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[admin] fetch orders failed:", error);
    return [];
  }

  return (data ?? []) as OrderRow[];
}

export async function fetchOrderById(id: string): Promise<OrderRow | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }

  const supabase = createServerSupabaseAdmin();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as OrderRow;
}

export async function updateOrderFulfillment(
  id: string,
  fulfillment_status: FulfillmentStatus,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseAdmin();

  const { error } = await supabase
    .from("orders")
    .update({ fulfillment_status })
    .eq("id", id);

  if (error) {
    console.error("[admin] update fulfillment failed:", error);
    return { success: false, error: "Could not update status." };
  }

  return { success: true };
}
