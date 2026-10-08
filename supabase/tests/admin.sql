-- =====================================================================
-- Royal Guest Garden 2 — Back-office support (pgTAP)
-- current_staff_role(), two-factor enforcement in is_admin/is_editor,
-- site-images bucket + policies, uploaded image URLs accepted.
-- Run: supabase test db
-- =====================================================================

BEGIN;
SELECT plan(15);

DELETE FROM auth.users WHERE id IN (
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);
INSERT INTO auth.users (id, email) VALUES
  ('66666666-6666-6666-6666-666666666666', 'admin-2fa@test.local'),
  ('77777777-7777-7777-7777-777777777777', 'editor@test.local'),
  ('88888888-8888-8888-8888-888888888888', 'visitor@test.local');
INSERT INTO public.staff (user_id, role) VALUES
  ('66666666-6666-6666-6666-666666666666', 'admin'),
  ('77777777-7777-7777-7777-777777777777', 'editor');
INSERT INTO auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at)
VALUES (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 'test', 'totp', 'verified', now(), now());

-- ---------------------------------------------------------------------
-- Roles and two-factor
-- ---------------------------------------------------------------------
SET ROLE authenticated;

SELECT set_config('request.jwt.claims', '{"sub":"66666666-6666-6666-6666-666666666666","role":"authenticated","aal":"aal1"}', true);
SELECT is(public.current_staff_role(), 'admin', 'current_staff_role: admin is reported even before the code');
SELECT is(public.is_admin(), false, 'two-factor: admin with a verified factor has no rights at aal1');
SELECT is(public.is_editor(), false, 'two-factor: … nor editor rights at aal1');
SELECT is((SELECT count(*) FROM public.staff), 0::bigint, 'two-factor: RLS hides staff rows at aal1');

SELECT set_config('request.jwt.claims', '{"sub":"66666666-6666-6666-6666-666666666666","role":"authenticated","aal":"aal2"}', true);
SELECT is(public.is_admin(), true, 'two-factor: admin rights once the code is passed (aal2)');

SELECT set_config('request.jwt.claims', '{"sub":"77777777-7777-7777-7777-777777777777","role":"authenticated","aal":"aal1"}', true);
SELECT is(public.current_staff_role(), 'editor', 'current_staff_role: editor');
SELECT is(public.is_editor(), true, 'two-factor: editor without a factor keeps rights at aal1');

SELECT set_config('request.jwt.claims', '{"sub":"88888888-8888-8888-8888-888888888888","role":"authenticated"}', true);
SELECT is(public.current_staff_role(), NULL, 'current_staff_role: null for a non-staff login');

RESET ROLE;
SELECT throws_matching($$SET ROLE anon; SELECT public.current_staff_role()$$, 'permission denied',
  'anon: cannot call current_staff_role()');
RESET ROLE;

-- ---------------------------------------------------------------------
-- Storage bucket
-- ---------------------------------------------------------------------
SELECT is(
  (SELECT public AND file_size_limit = 8388608 AND allowed_mime_types = array['image/jpeg','image/png','image/webp']
   FROM storage.buckets WHERE id = 'site-images'),
  true, 'storage: site-images is public, 8 MB, images only');

SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"77777777-7777-7777-7777-777777777777","role":"authenticated"}', true);
SELECT lives_ok(
  $$INSERT INTO storage.objects (bucket_id, name, owner_id) VALUES ('site-images', 'rooms/test.webp', '77777777-7777-7777-7777-777777777777')$$,
  'storage: an editor can upload to site-images');
SELECT set_config('request.jwt.claims', '{"sub":"88888888-8888-8888-8888-888888888888","role":"authenticated"}', true);
SELECT throws_matching(
  $$INSERT INTO storage.objects (bucket_id, name, owner_id) VALUES ('site-images', 'rooms/evil.webp', '88888888-8888-8888-8888-888888888888')$$,
  'row-level security', 'storage: a non-staff login cannot upload');
RESET ROLE;

-- ---------------------------------------------------------------------
-- Uploaded image URLs
-- ---------------------------------------------------------------------
SELECT ok(public.is_safe_image('http://127.0.0.1:54321/storage/v1/object/public/site-images/rooms/a1b2.webp'),
  'images: local storage URL accepted');
SELECT ok(NOT public.is_safe_image('http://127.0.0.1:54321/storage/v1/object/public/other-bucket/a.webp'),
  'images: other buckets refused');
SELECT ok(NOT public.is_safe_image('http://evil.test/site-images/a.webp'),
  'images: other http hosts refused');

SELECT * FROM finish();
ROLLBACK;
