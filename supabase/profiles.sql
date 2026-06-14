-- Run in Supabase Dashboard → SQL Editor → New query → Run
-- https://supabase.com/dashboard/project/_/sql
--
-- Prerequisite (Dashboard, not SQL):
--   Authentication → Providers → Phone → Enable
--   Leave Twilio credentials empty for now — OTP sending will be handled
--   in app code (dev fake OTP now, MSG91 later). Phone provider must be
--   enabled so Supabase can issue sessions after we verify OTPs ourselves.

-- ---------------------------------------------------------------------------
-- profiles — business data for authenticated customers (mirrors auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text not null unique,
  name text,
  default_address text,
  has_password boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Customer profile linked 1:1 with auth.users (phone OTP login)';
comment on column public.profiles.phone is 'E.164 phone — also stored on auth.users.phone';
comment on column public.profiles.has_password is 'True once user sets an optional password';

create index if not exists profiles_phone_idx on public.profiles (phone);

-- Auto-update updated_at on row changes
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

-- Create profile row when a new auth.users row is inserted (phone signup / OTP verify)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, phone, has_password)
  values (
    new.id,
    coalesce(new.phone, ''),
    false
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Authenticated users: read own profile
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Authenticated users: update own profile
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Anon: explicit deny (no access)
create policy "profiles_deny_anon"
  on public.profiles
  for all
  to anon
  using (false)
  with check (false);

-- service_role bypasses RLS by default — full access for server admin routes
