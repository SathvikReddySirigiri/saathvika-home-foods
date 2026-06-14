-- Allow logged-in customers to read their own orders (My Orders page).
-- Run after orders-add-customer-id.sql

drop policy if exists "orders_deny_authenticated" on public.orders;

create policy "orders_select_own"
  on public.orders
  for select
  to authenticated
  using (customer_id = auth.uid());
