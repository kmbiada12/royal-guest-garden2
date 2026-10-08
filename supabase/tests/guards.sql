-- =====================================================================
-- Royal Guest Garden 2 — Data guards (pgTAP)
-- Audit log without personal data + retention, delete rules, last-admin
-- protection, personal-data checks, content validation (bilingual text,
-- safe URLs/images, amenity references), case-insensitive room ids.
-- Run: supabase test db
-- =====================================================================

BEGIN;
SELECT plan(33);

-- ---------------------------------------------------------------------
-- Fixtures (run as postgres; RLS bypassed)
-- ---------------------------------------------------------------------
TRUNCATE public.settings, public.room_categories, public.amenities,
         public.rooms, public.services, public.booking_requests,
         public.enquiries, public.leads, public.staff, public.audit_log
  RESTART IDENTITY CASCADE;

DELETE FROM auth.users WHERE id IN (
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);
INSERT INTO auth.users (id, email) VALUES
  ('33333333-3333-3333-3333-333333333333', 'inviter@test.local'),
  ('44444444-4444-4444-4444-444444444444', 'invitee@test.local'),
  ('55555555-5555-5555-5555-555555555555', 'editor@test.local');

INSERT INTO public.room_categories (id, label, sort_order) VALUES
  ('standard', '{"fr":"Standard","en":"Standard"}', 1);
INSERT INTO public.amenities (id, label, sort_order) VALUES
  ('wifi', '{"fr":"Wi-Fi","en":"Wi-Fi"}', 1),
  ('salon', '{"fr":"Salon","en":"Lounge"}', 2);

-- Valid room column list / values reused below.
INSERT INTO public.rooms (
  id, ref, name, category_id, price, capacity, beds, size, floor, view,
  short, description, amenity_ids, images, breakfast_note, tax_note, cancellation, sort_order
) VALUES
  ('room-a', 'RGG-A', 'A', 'standard', 30000, 2, '{"fr":"lit"}', 20, '{"fr":"1er"}', '{"fr":"v"}',
   '{"fr":"s"}', '{"fr":"d"}', '{wifi,salon}', '{"img/chambres/a/Room view, 1.png"}',
   '{"fr":"p"}', '{"fr":"t"}', '{"fr":"c"}', 1);

INSERT INTO public.booking_requests (
  reference, room_id, room_snapshot, check_in, check_out, adults, children,
  rooms, guest_name, guest_phone, nights, nightly_rate, estimated_total, message
) VALUES (
  'RGG-2026-0100', 'room-a', '{"id":"room-a"}', current_date + 1, current_date + 3,
  2, 0, 1, 'Jean Dupont', '+237 6 99 00 00 00', 2, 30000, 60000, 'message'
);

-- ---------------------------------------------------------------------
-- Audit log: no personal data, retention
-- ---------------------------------------------------------------------
UPDATE public.booking_requests SET guest_name = 'Jean Martin' WHERE reference = 'RGG-2026-0100';

SELECT is(
  (SELECT count(*) FROM public.audit_log
   WHERE table_name = 'booking_requests' AND diff::text LIKE '%Jean%'),
  0::bigint, 'audit_log: no guest values logged for booking_requests');
SELECT is(
  (SELECT diff -> 'fields' FROM public.audit_log
   WHERE table_name = 'booking_requests' AND action = 'update'),
  '["guest_name"]'::jsonb, 'audit_log: update logs changed field names only');
SELECT is(
  (SELECT diff ->> 'name' FROM public.audit_log
   WHERE table_name = 'rooms' AND record_id = 'room-a' AND action = 'insert'),
  'A', 'audit_log: content tables still log full rows');

INSERT INTO public.audit_log (table_name, action, created_at)
  VALUES ('rooms', 'update', now() - interval '25 months');
SELECT is(public.purge_audit_log(), 1::bigint, 'purge_audit_log: deletes entries older than 24 months');
SELECT is((SELECT count(*) FROM cron.job WHERE jobname = 'purge-audit-log'), 1::bigint,
  'pg_cron: purge job scheduled');

-- ---------------------------------------------------------------------
-- Staff: delete rules + last admin
-- ---------------------------------------------------------------------
INSERT INTO public.staff (user_id, role) VALUES ('33333333-3333-3333-3333-333333333333', 'admin');
INSERT INTO public.staff (user_id, role, invited_by) VALUES
  ('44444444-4444-4444-4444-444444444444', 'admin', '33333333-3333-3333-3333-333333333333'),
  ('55555555-5555-5555-5555-555555555555', 'editor', '33333333-3333-3333-3333-333333333333');

SELECT lives_ok(
  $$DELETE FROM public.staff WHERE user_id = '33333333-3333-3333-3333-333333333333'$$,
  'staff: an admin who invited others can be removed (another admin remains)');
SELECT is(
  (SELECT invited_by FROM public.staff WHERE user_id = '55555555-5555-5555-5555-555555555555'),
  NULL, 'staff: invitee kept, invited_by cleared');
SELECT throws_matching(
  $$DELETE FROM public.staff WHERE user_id = '44444444-4444-4444-4444-444444444444'$$,
  'last admin', 'staff: the last admin cannot be removed');
SELECT throws_matching(
  $$UPDATE public.staff SET role = 'editor' WHERE user_id = '44444444-4444-4444-4444-444444444444'$$,
  'last admin', 'staff: the last admin cannot be demoted');
SELECT throws_matching(
  $$DELETE FROM auth.users WHERE id = '44444444-4444-4444-4444-444444444444'$$,
  'last admin', 'staff: the last admin''s login cannot be deleted');
SELECT lives_ok(
  $$DELETE FROM public.staff WHERE user_id = '55555555-5555-5555-5555-555555555555'$$,
  'staff: an editor can be removed');

-- ---------------------------------------------------------------------
-- Rooms: delete rule, case-insensitive ids
-- ---------------------------------------------------------------------
SELECT lives_ok($$DELETE FROM public.rooms WHERE id = 'room-a'$$,
  'rooms: a room with bookings can be deleted');
SELECT is(
  (SELECT room_id FROM public.booking_requests WHERE reference = 'RGG-2026-0100'),
  NULL, 'booking_requests: booking kept, room_id cleared');

INSERT INTO public.rooms (id, ref, name, category_id, price, capacity, beds, size, floor, view, short, description, images, breakfast_note, tax_note, cancellation)
  VALUES ('room-b', 'RGG-B', 'B', 'standard', 1, 1, '{"fr":"l"}', 1, '{"fr":"f"}', '{"fr":"v"}', '{"fr":"s"}', '{"fr":"d"}', '{img/b.png}', '{"fr":"p"}', '{"fr":"t"}', '{"fr":"c"}');
SELECT throws_matching(
  $$INSERT INTO public.rooms (id, ref, name, category_id, price, capacity, beds, size, floor, view, short, description, images, breakfast_note, tax_note, cancellation)
    VALUES ('ROOM-B', 'RGG-B3', 'B', 'standard', 1, 1, '{"fr":"l"}', 1, '{"fr":"f"}', '{"fr":"v"}', '{"fr":"s"}', '{"fr":"d"}', '{img/b.png}', '{"fr":"p"}', '{"fr":"t"}', '{"fr":"c"}')$$,
  'rooms_id_check|idx_rooms_id_lower', 'rooms: upper-case / duplicate-by-case ids are rejected');

-- ---------------------------------------------------------------------
-- Content validation
-- ---------------------------------------------------------------------
SELECT throws_matching(
  $$UPDATE public.rooms SET short = '{}' WHERE id = 'room-b'$$,
  'rooms_short_check', 'content: bilingual text needs French');
SELECT throws_matching(
  $$UPDATE public.rooms SET short = '{"fr":"   "}' WHERE id = 'room-b'$$,
  'rooms_short_check', 'content: French text cannot be blank');
SELECT throws_matching(
  $$UPDATE public.rooms SET short = '{"fr":"ok","de":"nein"}' WHERE id = 'room-b'$$,
  'rooms_short_check', 'content: only fr/en keys allowed');
SELECT lives_ok(
  $$UPDATE public.rooms SET short = '{"fr":"Texte"}' WHERE id = 'room-b'$$,
  'content: English is optional');
SELECT throws_matching(
  $$UPDATE public.rooms SET images = '{}' WHERE id = 'room-b'$$,
  'rooms_images_check', 'content: a room needs at least one image');
SELECT throws_matching(
  $$UPDATE public.rooms SET images = '{javascript:alert(1)}' WHERE id = 'room-b'$$,
  'rooms_images_check', 'content: image must be https:// or img/…');
SELECT throws_matching(
  $$UPDATE public.rooms SET images = '{img/../../etc/passwd}' WHERE id = 'room-b'$$,
  'rooms_images_check', 'content: image path cannot climb out of img/');
SELECT throws_matching(
  $$UPDATE public.rooms SET amenity_ids = '{wifi,salon-confortable}' WHERE id = 'room-b'$$,
  'Unknown amenity', 'content: room amenities must exist');
UPDATE public.rooms SET amenity_ids = '{salon}' WHERE id = 'room-b';
SELECT throws_matching(
  $$DELETE FROM public.amenities WHERE id = 'salon'$$,
  'still used', 'content: an amenity used by a room cannot be deleted');
SELECT throws_matching(
  $$INSERT INTO public.services (id, icon, image, title, short, hours, pricing, inquiry)
    VALUES ('spa', 'spa', 'img/spa.png', '{"fr":"Spa"}', '{"fr":"s"}', '{"fr":"9h"}',
            '{"included":false,"items":[{"label":{"fr":"Massage"},"price":-5}]}', 'quote')$$,
  'services_pricing_check', 'content: service prices cannot be negative');

-- ---------------------------------------------------------------------
-- Settings: safe links
-- ---------------------------------------------------------------------
SELECT throws_matching(
  $$INSERT INTO public.settings (id, hotel, whatsapp, currency, booking, demo, hero_images)
    VALUES (1, '{"name":"H","mapUrl":"javascript:alert(1)"}', '{"number":"237699000000"}', '{}', '{}', '{}', '{}')$$,
  'settings_hotel_chk', 'settings: map link must be https://');
SELECT throws_matching(
  $$INSERT INTO public.settings (id, hotel, whatsapp, currency, booking, demo, hero_images)
    VALUES (1, '{"name":"H"}', '{"number":"237699000000","baseUrl":"http://evil.test/"}', '{}', '{}', '{}', '{}')$$,
  'settings_whatsapp_chk', 'settings: WhatsApp base URL must be https://');
SELECT throws_matching(
  $$INSERT INTO public.settings (id, hotel, whatsapp, currency, booking, demo, hero_images)
    VALUES (1, '{"name":"H"}', '{"number":"12ab"}', '{}', '{}', '{}', '{}')$$,
  'settings_whatsapp_chk', 'settings: WhatsApp number must be 8–15 digits');
SELECT throws_matching(
  $$INSERT INTO public.settings (id, hotel, whatsapp, currency, booking, demo, hero_images)
    VALUES (1, '{"name":"H"}', '{"number":"237699000000"}', '{}', '{}', '{}', '{"home":"data:text/html,x"}')$$,
  'settings_hero_images_chk', 'settings: hero images must be https:// or img/…');

-- ---------------------------------------------------------------------
-- Personal data guards
-- ---------------------------------------------------------------------
SELECT throws_matching(
  $$INSERT INTO public.booking_requests (reference, room_snapshot, check_in, check_out, adults, rooms, guest_name, guest_phone, nights, nightly_rate, estimated_total, message)
    VALUES ('RGG-X1', '{}', current_date + 3, current_date + 1, 1, 1, 'Jean', '699000000', 0, 1, 0, 'm')$$,
  'booking_requests_dates_chk', 'booking: departure must be after arrival');
SELECT throws_matching(
  $$INSERT INTO public.booking_requests (reference, room_snapshot, check_in, check_out, adults, rooms, guest_name, guest_phone, nights, nightly_rate, estimated_total, message)
    VALUES ('RGG-X2', '{}', current_date + 1, current_date + 2, 1, 1, 'Jean', '1234567', 1, 1, 1, 'm')$$,
  'booking_requests_phone_chk', 'booking: phone needs 8–15 digits');
SELECT throws_matching(
  $$INSERT INTO public.booking_requests (reference, room_snapshot, check_in, check_out, adults, rooms, guest_name, guest_phone, nights, nightly_rate, estimated_total, message)
    VALUES ('RGG-X3', '{}', current_date + 1, current_date + 3, 1, 2, 'Jean', '699000000', 2, 10000, 20000, 'm')$$,
  'booking_requests_total_chk', 'booking: total = rate × nights × rooms');
SELECT throws_matching(
  $$INSERT INTO public.enquiries (name, phone, subject, message) VALUES ('Jean', '699000000', 'Info', 'court')$$,
  'enquiries_message_chk', 'enquiry: message needs at least 10 characters');
SELECT throws_matching(
  $$INSERT INTO public.leads (name, phone) VALUES ('J', '699000000')$$,
  'leads_name_chk', 'lead: name needs at least 2 characters');

SELECT * FROM finish();
ROLLBACK;
