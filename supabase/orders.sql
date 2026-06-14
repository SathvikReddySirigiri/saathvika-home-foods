-- Run this in Supabase Dashboard → SQL Editor → New query → Run
-- https://supabase.com/dashboard/project/_/sql

-- ---------------------------------------------------------------------------
-- orders table
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,

  -- Full cart snapshot: product name, customizations, pack size, qty, line price per row
  items jsonb not null,

  total_amount integer not null check (total_amount >= 0),

  order_method text not null check (order_method in ('whatsapp', 'online')),

  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),

  payment_id text,

  fulfillment_status text not null default 'new'
    check (fulfillment_status in ('new', 'confirmed', 'packed', 'shipped', 'delivered'))
);

comment on table public.orders is 'Customer orders from Saathvika Home Foods shop';
comment on column public.orders.items is 'JSON array of cart line items at checkout time';
comment on column public.orders.total_amount is 'Order total in INR (whole rupees)';
comment on column public.orders.payment_id is 'Razorpay payment id only — never store card data';

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_payment_status_idx on public.orders (payment_status);
create index if not exists orders_fulfillment_status_idx on public.orders (fulfillment_status);

-- ---------------------------------------------------------------------------
-- Row Level Security — anon/authenticated cannot read or write orders
-- Service role (server API routes) bypasses RLS and has full access
-- ---------------------------------------------------------------------------
alter table public.orders enable row level security;

-- Explicit deny for anon (public website key)
create policy "orders_deny_anon"
  on public.orders
  for all
  to anon
  using (false)
  with check (false);

-- Explicit deny for authenticated users (if you add auth later)
create policy "orders_deny_authenticated"
  on public.orders
  for all
  to authenticated
  using (false)
  with check (false);

-- No policy needed for service_role — it bypasses RLS by default in Supabase
