-- 果物キング — Row Level Security policies
-- Public can read active listings + public profiles.
-- Authenticated users can write only their own data.
-- Admins (profiles.is_admin = true) can do everything.

------------------------------------------------------------------------------
-- profiles
------------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin"
  on public.profiles for delete
  to authenticated
  using (public.is_admin());

------------------------------------------------------------------------------
-- listings
------------------------------------------------------------------------------
alter table public.listings enable row level security;

drop policy if exists "listings_select_public_or_owner" on public.listings;
create policy "listings_select_public_or_owner"
  on public.listings for select
  to anon, authenticated
  using (
    status = 'active'
    or seller_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "listings_insert_own" on public.listings;
create policy "listings_insert_own"
  on public.listings for insert
  to authenticated
  with check (seller_id = auth.uid());

drop policy if exists "listings_update_own_or_admin" on public.listings;
create policy "listings_update_own_or_admin"
  on public.listings for update
  to authenticated
  using (seller_id = auth.uid() or public.is_admin())
  with check (seller_id = auth.uid() or public.is_admin());

drop policy if exists "listings_delete_own_or_admin" on public.listings;
create policy "listings_delete_own_or_admin"
  on public.listings for delete
  to authenticated
  using (seller_id = auth.uid() or public.is_admin());

------------------------------------------------------------------------------
-- listing_images
------------------------------------------------------------------------------
alter table public.listing_images enable row level security;

drop policy if exists "listing_images_select_visible" on public.listing_images;
create policy "listing_images_select_visible"
  on public.listing_images for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.listings l
      where l.id = listing_images.listing_id
        and (l.status = 'active' or l.seller_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "listing_images_insert_owner" on public.listing_images;
create policy "listing_images_insert_owner"
  on public.listing_images for insert
  to authenticated
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id
        and (l.seller_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "listing_images_update_owner" on public.listing_images;
create policy "listing_images_update_owner"
  on public.listing_images for update
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id
        and (l.seller_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id
        and (l.seller_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "listing_images_delete_owner" on public.listing_images;
create policy "listing_images_delete_owner"
  on public.listing_images for delete
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id
        and (l.seller_id = auth.uid() or public.is_admin())
    )
  );

------------------------------------------------------------------------------
-- inquiries
------------------------------------------------------------------------------
alter table public.inquiries enable row level security;

drop policy if exists "inquiries_select_party_or_admin" on public.inquiries;
create policy "inquiries_select_party_or_admin"
  on public.inquiries for select
  to authenticated
  using (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "inquiries_insert_buyer" on public.inquiries;
create policy "inquiries_insert_buyer"
  on public.inquiries for insert
  to authenticated
  with check (buyer_id = auth.uid());

drop policy if exists "inquiries_update_party_or_admin" on public.inquiries;
create policy "inquiries_update_party_or_admin"
  on public.inquiries for update
  to authenticated
  using (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
    or public.is_admin()
  )
  with check (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
    or public.is_admin()
  );

------------------------------------------------------------------------------
-- favorites
------------------------------------------------------------------------------
alter table public.favorites enable row level security;

drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own"
  on public.favorites for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own"
  on public.favorites for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own"
  on public.favorites for delete
  to authenticated
  using (user_id = auth.uid());
