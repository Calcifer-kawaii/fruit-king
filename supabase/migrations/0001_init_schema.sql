-- 果物キング — Initial schema
-- Tables: profiles, listings, listing_images, inquiries, favorites
-- Enums: listing_status, inquiry_status

create extension if not exists "pgcrypto";

------------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  username text unique,
  avatar_url text,
  bio text,
  preferred_language text not null default 'ja' check (preferred_language in ('ja', 'en')),
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));
create index if not exists profiles_display_name_trgm_idx
  on public.profiles using gin (to_tsvector('simple', coalesce(display_name, '')));

------------------------------------------------------------------------------
-- listings
------------------------------------------------------------------------------
do $$ begin
  create type public.listing_status as enum ('draft', 'active', 'sold', 'removed');
exception when duplicate_object then null; end $$;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  fruit_type text not null,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'JPY',
  description text,
  stock integer not null default 1 check (stock >= 0),
  prefecture text,
  status public.listing_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_status_created_idx
  on public.listings (status, created_at desc);
create index if not exists listings_seller_idx
  on public.listings (seller_id);
create index if not exists listings_fruit_type_idx
  on public.listings (fruit_type);
create index if not exists listings_title_trgm_idx
  on public.listings using gin (to_tsvector('simple', title));

------------------------------------------------------------------------------
-- listing_images
------------------------------------------------------------------------------
create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists listing_images_listing_idx
  on public.listing_images (listing_id, sort_order);

------------------------------------------------------------------------------
-- inquiries
------------------------------------------------------------------------------
do $$ begin
  create type public.inquiry_status as enum ('open', 'closed');
exception when duplicate_object then null; end $$;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  subject text,
  message text not null,
  status public.inquiry_status not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists inquiries_seller_idx
  on public.inquiries (seller_id, created_at desc);
create index if not exists inquiries_buyer_idx
  on public.inquiries (buyer_id, created_at desc);
create index if not exists inquiries_listing_idx
  on public.inquiries (listing_id);

------------------------------------------------------------------------------
-- favorites (table reserved for future UI; included for completeness)
------------------------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

------------------------------------------------------------------------------
-- updated_at trigger
------------------------------------------------------------------------------
create or replace function public.set_updated_at()
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
  for each row execute function public.set_updated_at();

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

------------------------------------------------------------------------------
-- is_admin() helper used by RLS policies
------------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
