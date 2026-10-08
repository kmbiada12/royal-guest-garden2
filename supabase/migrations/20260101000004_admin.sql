-- =====================================================================
-- Royal Guest Garden 2 — 0005 Back-office support
--   • current_staff_role(): lets the admin app know the caller's role
--     (staff rows themselves stay admin-only under RLS).
--   • Two-factor: once a staff member has a verified TOTP factor, their
--     role only counts in sessions that passed it (aal2).
--   • Storage bucket `site-images` for uploads from the back-office:
--     public read, staff-only write, images only, 8 MB max.
--   • Image URLs from that bucket are accepted by the content checks.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Two-factor aware role helpers
-- ---------------------------------------------------------------------
create or replace function public.mfa_satisfied() returns boolean
security definer set search_path = public
stable language sql as $$
  select coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
      or not exists (
        select 1 from auth.mfa_factors f
        where f.user_id = auth.uid() and f.status = 'verified'
      );
$$;

create or replace function public.is_admin() returns boolean
security definer set search_path = public
stable language sql as $$
  select exists (
    select 1 from public.staff
    where user_id = auth.uid() and role = 'admin'
  ) and public.mfa_satisfied();
$$;

create or replace function public.is_editor() returns boolean
security definer set search_path = public
stable language sql as $$
  select exists (
    select 1 from public.staff
    where user_id = auth.uid() and role in ('admin', 'editor')
  ) and public.mfa_satisfied();
$$;

-- Role of the caller ('admin' | 'editor' | null), whatever the session's
-- assurance level: the app uses it to decide whether to ask for the code.
create or replace function public.current_staff_role() returns text
security definer set search_path = public
stable language sql as $$
  select role from public.staff where user_id = auth.uid();
$$;

revoke execute on function public.mfa_satisfied() from public, anon, authenticated;
revoke execute on function public.current_staff_role() from public, anon;
grant execute on function public.current_staff_role() to authenticated;

-- ---------------------------------------------------------------------
-- Uploaded images: allow the project's own storage URLs
-- (local: http://127.0.0.1:54321/…, hosted: https://… already allowed)
-- ---------------------------------------------------------------------
create or replace function public.is_safe_image(u text) returns boolean
language sql immutable as $$
  select public.is_safe_https_url(u)
      or (u ~ '^img/[^"<>]+$' and u !~ '\.\.' and u !~ '[\\\n\r]')
      or u ~ '^http://(127\.0\.0\.1|localhost):54321/storage/v1/object/public/site-images/[A-Za-z0-9/_.-]+$';
$$;

-- ---------------------------------------------------------------------
-- Storage bucket for back-office uploads
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images', 'site-images', true, 8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy site_images_staff_read on storage.objects
  for select to authenticated
  using (bucket_id = 'site-images' and public.is_editor());
create policy site_images_staff_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-images' and public.is_editor());
create policy site_images_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'site-images' and public.is_editor())
  with check (bucket_id = 'site-images' and public.is_editor());
create policy site_images_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-images' and public.is_editor());
