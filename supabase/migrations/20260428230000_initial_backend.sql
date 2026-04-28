-- 18 Sitters v4 production backend foundation.
-- Run this in Supabase SQL editor or with `supabase db push`.

create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('family', 'sitter', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.verification_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.booking_status as enum ('requested', 'confirmed', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'family',
  full_name text,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  city text,
  neighbourhood text,
  verification_status public.verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.family_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  children_count int,
  children_ages text,
  observance_level text,
  kosher_home text,
  synagogue_attendance text,
  care_needs text[],
  languages_preferred text[],
  family_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.caregiver_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  date_of_birth date,
  occupation text,
  education text,
  observance_level text,
  kosher_status text,
  synagogue_attendance text,
  languages text[],
  skills text[],
  availability text[],
  bio text,
  hourly_rate numeric(8,2),
  years_experience text,
  age_groups text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  family_profile_id uuid not null references public.profiles(id) on delete cascade,
  caregiver_profile_id uuid not null references public.profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status public.booking_status not null default 'requested',
  location_label text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id) on delete cascade,
  recipient_profile_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  reviewer_profile_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_profile_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  unique (booking_id, reviewer_profile_id)
);

create table if not exists public.subscription_entitlements (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  platform text not null check (platform in ('apple', 'google', 'manual')),
  product_id text,
  revenuecat_customer_id text,
  status text not null default 'trialing',
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_profile_id uuid not null references public.profiles(id) on delete cascade,
  referred_profile_id uuid references public.profiles(id) on delete set null,
  code text not null,
  reward text,
  created_at timestamptz not null default now(),
  redeemed_at timestamptz
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  provider text,
  provider_reference text,
  status public.verification_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, first_name, last_name, phone)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'family'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists family_profiles_set_updated_at on public.family_profiles;
create trigger family_profiles_set_updated_at before update on public.family_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists caregiver_profiles_set_updated_at on public.caregiver_profiles;
create trigger caregiver_profiles_set_updated_at before update on public.caregiver_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

drop trigger if exists subscription_entitlements_set_updated_at on public.subscription_entitlements;
create trigger subscription_entitlements_set_updated_at before update on public.subscription_entitlements
  for each row execute function public.set_updated_at();

drop trigger if exists verification_requests_set_updated_at on public.verification_requests;
create trigger verification_requests_set_updated_at before update on public.verification_requests
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.family_profiles enable row level security;
alter table public.caregiver_profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.subscription_entitlements enable row level security;
alter table public.referrals enable row level security;
alter table public.verification_requests enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.family_profiles to authenticated;
grant select, insert, update, delete on public.caregiver_profiles to authenticated;
grant select, insert, update, delete on public.bookings to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant select, insert, update, delete on public.reviews to authenticated;
grant select on public.subscription_entitlements to authenticated;
grant select, insert, update on public.referrals to authenticated;
grant select, insert on public.verification_requests to authenticated;

drop policy if exists "profiles own select" on public.profiles;
create policy "profiles own select" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "family own all" on public.family_profiles;
create policy "family own all" on public.family_profiles
  for all to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

drop policy if exists "caregiver own all" on public.caregiver_profiles;
create policy "caregiver own all" on public.caregiver_profiles
  for all to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

drop policy if exists "approved caregivers visible to authenticated users" on public.caregiver_profiles;
create policy "approved caregivers visible to authenticated users" on public.caregiver_profiles
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = caregiver_profiles.profile_id
        and p.role = 'sitter'
        and p.verification_status = 'approved'
    )
  );

drop policy if exists "booking participants read" on public.bookings;
create policy "booking participants read" on public.bookings
  for select to authenticated
  using ((select auth.uid()) in (family_profile_id, caregiver_profile_id));

drop policy if exists "families create bookings" on public.bookings;
create policy "families create bookings" on public.bookings
  for insert to authenticated
  with check ((select auth.uid()) = family_profile_id);

drop policy if exists "booking participants update" on public.bookings;
create policy "booking participants update" on public.bookings
  for update to authenticated
  using ((select auth.uid()) in (family_profile_id, caregiver_profile_id))
  with check ((select auth.uid()) in (family_profile_id, caregiver_profile_id));

drop policy if exists "message participants read" on public.messages;
create policy "message participants read" on public.messages
  for select to authenticated
  using ((select auth.uid()) in (sender_profile_id, recipient_profile_id));

drop policy if exists "message sender insert" on public.messages;
create policy "message sender insert" on public.messages
  for insert to authenticated
  with check ((select auth.uid()) = sender_profile_id);

drop policy if exists "reviews participants read" on public.reviews;
create policy "reviews participants read" on public.reviews
  for select to authenticated
  using ((select auth.uid()) in (reviewer_profile_id, reviewee_profile_id));

drop policy if exists "reviews reviewer insert" on public.reviews;
create policy "reviews reviewer insert" on public.reviews
  for insert to authenticated
  with check ((select auth.uid()) = reviewer_profile_id);

drop policy if exists "entitlements own select" on public.subscription_entitlements;
create policy "entitlements own select" on public.subscription_entitlements
  for select to authenticated
  using ((select auth.uid()) = profile_id);

drop policy if exists "referrals participants read" on public.referrals;
create policy "referrals participants read" on public.referrals
  for select to authenticated
  using ((select auth.uid()) in (referrer_profile_id, referred_profile_id));

drop policy if exists "referrals referrer insert" on public.referrals;
create policy "referrals referrer insert" on public.referrals
  for insert to authenticated
  with check ((select auth.uid()) = referrer_profile_id);

drop policy if exists "verification own read" on public.verification_requests;
create policy "verification own read" on public.verification_requests
  for select to authenticated
  using ((select auth.uid()) = profile_id);

drop policy if exists "verification own insert" on public.verification_requests;
create policy "verification own insert" on public.verification_requests
  for insert to authenticated
  with check ((select auth.uid()) = profile_id);
