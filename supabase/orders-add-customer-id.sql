-- Run in Supabase Dashboard → SQL Editor (after profiles.sql)
-- Links logged-in customers to orders; guest checkout leaves customer_id NULL.

alter table public.orders
  add column if not exists customer_id uuid references public.profiles (id) on delete set null;

comment on column public.orders.customer_id is
  'Optional link to profiles.id for logged-in customers; NULL for guest orders';

create index if not exists orders_customer_id_idx on public.orders (customer_id);
