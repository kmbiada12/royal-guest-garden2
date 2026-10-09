-- =====================================================================
-- Royal Guest Garden 2 — 0002 Security
-- Role helpers + row-level security on every table + privileges.
--   anon          : no table access; reads go through get_site() (0003).
--   editor        : full CRUD on content; NO access to personal data.
--   admin         : everything (staff, settings, personal data, system).
--   other users   : nothing (sign-up is disabled; staff are invited).
-- The service role (Edge Functions, tools/create-admin.js) bypasses RLS.
-- =====================================================================

-- ---------------------------------------------------------------------
-- HELPERS (security definer, fixed search_path)
-- ---------------------------------------------------------------------
create or replace function public.is_admin() returns boolean
security definer set search_path = public
stable language sql as $$
  select exists (
    select 1 from public.staff
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_editor() returns boolean
security definer set search_path = public
stable language sql as $$
  select exists (
    select 1 from public.staff
    where user_id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- ---------------------------------------------------------------------
-- RLS ON EVERY TABLE
-- ---------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'settings', 'room_categories', 'amenities', 'rooms', 'services',
    'benefit_groups', 'benefits', 'testimonials', 'hotel_values',
    'guest_experiences', 'team_members', 'gallery_items',
    'booking_requests', 'enquiries', 'leads',
    'staff', 'email_outbox', 'audit_log', 'rate_limits', 'reference_counters'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- Content: editor+ full CRUD.
do $$
declare
  t text;
begin
  foreach t in array array[
    'room_categories', 'amenities', 'rooms', 'services', 'benefit_groups',
    'benefits', 'testimonials', 'hotel_values', 'guest_experiences',
    'team_members', 'gallery_items'
  ] loop
    execute format(
      'create policy content_%1$s on public.%1$I for all to authenticated
         using (public.is_editor()) with check (public.is_editor())', t);
  end loop;
end;
$$;

-- Settings: editor+ read, admin write.
create policy content_settings_read on public.settings
  for select to authenticated using (public.is_editor());
create policy content_settings_write on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Personal data + system: admin only (inserts happen via the service role).
do $$
declare
  t text;
begin
  foreach t in array array['booking_requests', 'enquiries', 'leads', 'staff', 'email_outbox'] loop
    execute format(
      'create policy admin_%1$s on public.%1$I for all to authenticated
         using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end;
$$;

create policy admin_audit_log on public.audit_log
  for select to authenticated using (public.is_admin());
-- rate_limits / reference_counters: no policy at all — service role only.

-- ---------------------------------------------------------------------
-- FUNCTION PRIVILEGES
-- Functions are EXECUTE-granted to PUBLIC by default (and Supabase also
-- grants anon/authenticated): revoke everything, then grant explicitly.
-- authenticated keeps the role helpers: RLS policies call them as the
-- invoking role (they only return a boolean about the caller).
-- ---------------------------------------------------------------------
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on all functions in schema public to service_role;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_editor() to authenticated;
-- CHECK constraints run with the writer's privileges: staff need the
-- (pure, data-free) validation helpers.
grant execute on function
  public.is_i18n_text(jsonb), public.is_i18n_list(jsonb),
  public.is_safe_https_url(text), public.is_safe_image(text),
  public.are_safe_images(text[]), public.are_safe_image_values(jsonb),
  public.is_valid_pricing(jsonb)
  to authenticated;

-- ---------------------------------------------------------------------
-- TABLE PRIVILEGES (RLS stays the real gatekeeper)
--   anon         : nothing.
--   authenticated: CRUD; RLS restricts rows (editor = content, admin = all).
--   service_role : full access.
-- ---------------------------------------------------------------------
revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant usage on all sequences in schema public to service_role;

alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke execute on functions from public, anon;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage on sequences to authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant usage on sequences to service_role;
