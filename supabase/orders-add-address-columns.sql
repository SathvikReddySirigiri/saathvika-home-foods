-- Run in Supabase Dashboard → SQL Editor (after orders.sql)
-- Structured delivery address columns for sortable / filterable admin views.

alter table public.orders
  add column if not exists address_flat text,
  add column if not exists address_street text,
  add column if not exists address_city text,
  add column if not exists address_state text,
  add column if not exists address_pincode text;

comment on column public.orders.address_flat is 'Flat, house, or building number';
comment on column public.orders.address_street is 'Street, area, or locality';
comment on column public.orders.address_city is 'City';
comment on column public.orders.address_state is 'Indian state or union territory';
comment on column public.orders.address_pincode is '6-digit Indian postal code';

create index if not exists orders_city_idx on public.orders (address_city);
create index if not exists orders_pincode_idx on public.orders (address_pincode);
create index if not exists orders_state_idx on public.orders (address_state);
