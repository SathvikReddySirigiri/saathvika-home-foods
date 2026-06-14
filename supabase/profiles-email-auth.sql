-- Run in Supabase Dashboard → SQL Editor (after profiles.sql)
-- Enables email/password auth profile fields and updates the signup trigger.
--
-- Dashboard (manual):
--   Authentication → Sign In / Providers → Email → Enable
--   Confirm email → ON
--   Redirect URLs: http://localhost:3000/auth/callback
--                  https://saathvikahomefoods.com/auth/callback

alter table public.profiles
  drop constraint if exists profiles_phone_key;

alter table public.profiles
  alter column phone drop not null;

alter table public.profiles
  add column if not exists email text unique;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, phone, name, has_password)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'name', ''),
    true
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
