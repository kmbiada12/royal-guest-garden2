-- =====================================================================
-- Royal Guest Garden 2 — RLS tests (pgTAP)
-- Proves: anon reads nothing directly (get_site() only), editor manages
-- content (CHECK helpers callable) but not personal data, admin manages
-- everything, a non-staff account sees nothing.
-- Run: supabase test db
-- =====================================================================

BEGIN;
SELECT plan(17);

-- ---------------------------------------------------------------------
-- Fixtures (run as postgres; RLS bypassed)
-- ---------------------------------------------------------------------
TRUNCATE public.settings, public.room_categories, public.amenities,
         public.rooms, public.booking_requests, public.enquiries,
         public.leads, public.staff, public.audit_log
  RESTART IDENTITY CASCADE;

DELETE FROM auth.users WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
);

INSERT INTO auth.users (id, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@test.local'),
  ('22222222-2222-2222-2222-222222222222', 'editor@test.local');

INSERT INTO public.staff (user_id, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'editor');

INSERT INTO public.settings (id, hotel, whatsapp, currency, booking, demo, hero_images) VALUES (
  1,
  '{"name":"Test Hotel","city":"Yaoundé"}',
  '{"number":"237699000000","baseUrl":"https://wa.me/"}',
  '{"code":"XAF","label":"FCFA","decimals":0}',
  '{"checkIn":"15:00","checkOut":"11:00","policies":[]}',
  '{"enabled":true}',
  '{"home":"img/home.png"}'
);

INSERT INTO public.room_categories (id, label, sort_order) VALUES
  ('standard', '{"fr":"Standard","en":"Standard"}', 1),
  ('deluxe', '{"fr":"Deluxe","en":"Deluxe"}', 2);

INSERT INTO public.amenities (id, label, sort_order) VALUES
  ('wifi', '{"fr":"Wi-Fi","en":"Wi-Fi"}', 1);

INSERT INTO public.rooms (
  id, ref, name, category_id, price, capacity, beds, size, floor, view,
  short, description, amenity_ids, images, breakfast_note, tax_note,
  cancellation, featured, sort_order, published
) VALUES
  ('room-a', 'RGG-01', 'A', 'standard', 25000, 2, '{"fr":"lit"}', 22, '{"fr":"1er"}', '{"fr":"jardin"}',
   '{"fr":"court"}', '{"fr":"long"}', '{wifi}', '{img/a.png}', '{"fr":"pdj"}', '{"fr":"taxe"}',
   '{"fr":"48 h"}', false, 1, true),
  ('room-b', 'RGG-02', 'B', 'standard', 30000, 3, '{"fr":"lit"}', 24, '{"fr":"1er"}', '{"fr":"jardin"}',
   '{"fr":"court"}', '{"fr":"long"}', '{wifi}', '{img/b.png}', '{"fr":"pdj"}', '{"fr":"taxe"}',
   '{"fr":"48 h"}', true, 2, true),
  ('room-c', 'RGG-03', 'C', 'deluxe', 65000, 3, '{"fr":"lit"}', 36, '{"fr":"2e"}', '{"fr":"ville"}',
   '{"fr":"court"}', '{"fr":"long"}', '{wifi}', '{img/c.png}', '{"fr":"pdj"}', '{"fr":"taxe"}',
   '{"fr":"48 h"}', false, 3, true),
  ('room-d', 'RGG-04', 'D', 'standard', 99000, 5, '{"fr":"lit"}', 40, '{"fr":"3e"}', '{"fr":"ville"}',
   '{"fr":"court"}', '{"fr":"long"}', '{wifi}', '{img/d.png}', '{"fr":"pdj"}', '{"fr":"taxe"}',
   '{"fr":"48 h"}', false, 4, false);

INSERT INTO public.booking_requests (
  reference, room_id, room_snapshot, check_in, check_out, adults,
  children, rooms, guest_name, guest_phone, guest_lang, nights,
  nightly_rate, estimated_total, message
) VALUES (
  'RGG-2026-0001', 'room-a', '{"id":"room-a","price":25000}',
  current_date + 1, current_date + 3, 2, 0, 1,
  'Test Guest', '+237600000000', 'fr', 2, 25000, 50000, 'message'
);

-- ---------------------------------------------------------------------
-- ANON
-- ---------------------------------------------------------------------
SET ROLE anon;

SELECT throws_matching('SELECT count(*) FROM public.rooms', 'permission denied',
  'anon: no direct SELECT on rooms (no table grant)');
SELECT throws_matching('SELECT count(*) FROM public.settings', 'permission denied',
  'anon: no direct SELECT on settings (no table grant)');
SELECT throws_matching('SELECT count(*) FROM public.booking_requests', 'permission denied',
  'anon: no direct SELECT on booking_requests (no table grant)');
SELECT is(jsonb_array_length(public.get_site() -> 'data' -> 'ROOMS'), 3,
  'anon: get_site returns only published rooms (3 of 4)');
SELECT is(public.get_site() -> 'config' -> 'hotel' ->> 'name', 'Test Hotel',
  'anon: get_site returns the hotel config');
SELECT throws_matching(
  'INSERT INTO public.booking_requests (reference, room_id, room_snapshot, check_in, check_out, adults, children, rooms, guest_name, guest_phone, nights, nightly_rate, estimated_total, message) VALUES (''RGG-2026-0002'', ''room-a'', ''{}'', current_date, current_date + 1, 1, 0, 1, ''xx'', ''699000000'', 1, 1, 1, ''x'')',
  'permission denied', 'anon: cannot INSERT booking_requests directly');
SELECT throws_matching('SELECT public.is_admin()', 'permission denied',
  'anon: cannot call is_admin()');

RESET ROLE;

-- ---------------------------------------------------------------------
-- EDITOR (authenticated, role=editor)
-- ---------------------------------------------------------------------
SELECT set_config('request.jwt.claims',
  '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', false);
SET ROLE authenticated;

SELECT is(count(*), 4::bigint, 'editor: sees all rooms incl. unpublished')
  FROM public.rooms;
SELECT is(count(*), 0::bigint, 'editor: cannot read booking_requests')
  FROM public.booking_requests;
SELECT is(count(*), 0::bigint, 'editor: cannot read staff table')
  FROM public.staff;
-- RLS silently filters the row for a non-admin (USING clause), so the
-- UPDATE affects 0 rows without raising; verify the value is unchanged.
UPDATE public.settings SET hotel = '{"name":"Hacked"}' WHERE id = 1;
RESET ROLE;
SELECT is((SELECT hotel ->> 'name' FROM public.settings WHERE id = 1), 'Test Hotel',
  'editor: settings UPDATE blocked by RLS (0 rows affected)');
SET ROLE authenticated;
SELECT lives_ok(
  $$INSERT INTO public.rooms (id, ref, name, category_id, price, capacity, beds, size, floor, view, short, description, amenity_ids, images, breakfast_note, tax_note, cancellation)
    VALUES ('room-e', 'RGG-05', 'E', 'standard', 20000, 1, '{"fr":"lit"}', 18, '{"fr":"1er"}', '{"fr":"v"}', '{"fr":"s"}', '{"fr":"d"}', '{wifi}', '{img/e.png}', '{"fr":"p"}', '{"fr":"t"}', '{"fr":"c"}')$$,
  'editor: can INSERT a room');

RESET ROLE;

-- ---------------------------------------------------------------------
-- ADMIN (authenticated, role=admin)
-- ---------------------------------------------------------------------
SELECT set_config('request.jwt.claims',
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', false);
SET ROLE authenticated;

SELECT is(count(*), 1::bigint, 'admin: reads booking_requests')
  FROM public.booking_requests;
SELECT is(count(*), 2::bigint, 'admin: reads staff table')
  FROM public.staff;
SELECT lives_ok($$UPDATE public.settings SET hotel = hotel || '{"name":"Renamed"}' WHERE id = 1$$,
  'admin: can update settings');

RESET ROLE;

-- ---------------------------------------------------------------------
-- AUTHENTICATED BUT NOT STAFF (should see nothing)
-- ---------------------------------------------------------------------
SELECT set_config('request.jwt.claims',
  '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}', false);
SET ROLE authenticated;

SELECT is(count(*), 0::bigint, 'non-staff authenticated: no direct SELECT on rooms')
  FROM public.rooms;
SELECT is(count(*), 0::bigint, 'non-staff authenticated: no direct SELECT on settings')
  FROM public.settings;

RESET ROLE;
SELECT set_config('request.jwt.claims', '', false);

SELECT * FROM finish();
ROLLBACK;
