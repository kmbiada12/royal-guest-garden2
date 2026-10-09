-- =====================================================================
-- Royal Guest Garden 2 — get_site() tests (pgTAP)
-- Shapes match js/config.js + js/data.js; published rows only; order.
-- Run: supabase test db
-- =====================================================================

BEGIN;
SELECT plan(20);

-- ---------------------------------------------------------------------
-- Fixtures
-- ---------------------------------------------------------------------
TRUNCATE public.settings, public.room_categories, public.amenities,
         public.rooms, public.services, public.benefit_groups,
         public.benefits, public.testimonials, public.hotel_values,
         public.guest_experiences, public.team_members, public.gallery_items
  RESTART IDENTITY CASCADE;

SELECT is(public.get_site(), NULL, 'get_site: null when settings are missing');

INSERT INTO public.settings (id, hotel, whatsapp, currency, booking, demo, hero_images) VALUES (
  1,
  '{"name":"Hotel","phoneTel":"+237699"}',
  '{"number":"237699000000","bookingNumber":null}',
  '{"code":"XAF","label":"FCFA","decimals":0}',
  '{"checkIn":"15:00","policies":[{"key":"arrival","fr":"Arrivée","en":"Arrival"}]}',
  '{"enabled":true}',
  '{"home":"img/home.png","rooms":"img/rooms.png"}'
);

INSERT INTO public.room_categories (id, label, sort_order, published) VALUES
  ('standard', '{"fr":"Standard","en":"Standard"}', 2, true),
  ('suite', '{"fr":"Suite","en":"Suite"}', 1, true),
  ('hidden', '{"fr":"Cachée","en":"Hidden"}', 3, false);

INSERT INTO public.amenities (id, label, sort_order, published) VALUES
  ('wifi', '{"fr":"Wi-Fi","en":"Wi-Fi"}', 1, true),
  ('old', '{"fr":"Ancien","en":"Old"}', 2, false);

INSERT INTO public.rooms (
  id, ref, name, category_id, price, capacity, beds, size, floor, view,
  short, description, amenity_ids, images, breakfast_included, breakfast_note,
  tax_included, tax_note, cancellation, featured, sort_order, published
) VALUES
  ('waza', 'RGG-01', 'Waza', 'standard', 25000, 2, '{"fr":"lit","en":"bed"}', 24,
   '{"fr":"2e","en":"2nd"}', '{"fr":"jardin","en":"garden"}', '{"fr":"c","en":"s"}',
   '{"fr":"d","en":"d"}', '{wifi,old}', '{img/w1.png,img/w2.png}', true,
   '{"fr":"pdj","en":"bkf"}', true, '{"fr":"taxe","en":"tax"}', '{"fr":"48 h","en":"48 h"}', true, 2, true),
  ('oku', 'RGG-12', 'Oku', 'suite', 150000, 4, '{"fr":"lit"}', 80,
   '{"fr":"7e"}', '{"fr":"ville"}', '{"fr":"c"}', '{"fr":"d"}', '{wifi}', '{img/o.png}', false,
   '{"fr":"pdj"}', false, '{"fr":"taxe"}', '{"fr":"48 h"}', false, 1, true),
  ('draft', 'RGG-98', 'Draft', 'standard', 1000, 1, '{"fr":"lit"}', 10,
   '{"fr":"x"}', '{"fr":"x"}', '{"fr":"x"}', '{"fr":"x"}', '{}', '{img/x.png}', false,
   '{"fr":"x"}', false, '{"fr":"x"}', '{"fr":"x"}', false, 3, false),
  ('secret', 'RGG-99', 'Secret', 'hidden', 1000, 1, '{"fr":"lit"}', 10,
   '{"fr":"x"}', '{"fr":"x"}', '{"fr":"x"}', '{"fr":"x"}', '{}', '{img/x.png}', false,
   '{"fr":"x"}', false, '{"fr":"x"}', '{"fr":"x"}', false, 4, true);

INSERT INTO public.services (id, icon, image, title, short, details, hours, pricing, inquiry, sort_order, published) VALUES
  ('spa', 'spa', 'img/spa.png', '{"fr":"Spa"}', '{"fr":"s"}', '[{"fr":"a","en":"a"}]', '{"fr":"9h"}',
   '{"included":false,"note":{"fr":"n"},"items":[{"label":{"fr":"Massage"},"price":15000}],"quoteOnly":true}',
   'quote', 1, true),
  ('off', 'x', 'img/x.png', '{"fr":"Off"}', '{"fr":"s"}', '[]', '{"fr":"x"}', '{"included":true}', 'info', 2, false);

INSERT INTO public.benefit_groups (title, sort_order, published) VALUES
  ('{"fr":"Groupe 1"}', 1, true),
  ('{"fr":"Groupe caché"}', 2, false);
INSERT INTO public.benefits (group_id, icon, title, text, sort_order, published) VALUES
  (1, 'bell', '{"fr":"B2"}', '{"fr":"t"}', 2, true),
  (1, 'shield', '{"fr":"B1"}', '{"fr":"t"}', 1, true),
  (1, 'x', '{"fr":"Off"}', '{"fr":"t"}', 3, false);

INSERT INTO public.testimonials (quote, author, meta, rating, sort_order, published) VALUES
  ('{"fr":"Super"}', '{"fr":"Ami"}', '{"fr":"Mars"}', 5, 1, true),
  ('{"fr":"Off"}', '{"fr":"X"}', '{"fr":"X"}', 1, 2, false);
INSERT INTO public.hotel_values (title, text, sort_order) VALUES ('{"fr":"Accueil"}', '{"fr":"t"}', 1);
INSERT INTO public.guest_experiences (audience, icon, text, sort_order) VALUES ('{"fr":"Affaires"}', 'briefcase', '{"fr":"t"}', 1);
INSERT INTO public.team_members (name, role, bio, image, sort_order) VALUES ('{"fr":"Marie"}', '{"fr":"Directrice"}', '{"fr":"bio"}', 'img/m.png', 1);
INSERT INTO public.gallery_items (image, caption, sort_order) VALUES ('img/g.png', '{"fr":"Hall"}', 1);

-- ---------------------------------------------------------------------
-- config
-- ---------------------------------------------------------------------
SELECT is(public.get_site() -> 'config' -> 'hotel', '{"name":"Hotel","phoneTel":"+237699"}'::jsonb,
  'config.hotel returned as stored');
SELECT ok((public.get_site() -> 'config' -> 'whatsapp') ? 'bookingNumber',
  'config.whatsapp keeps null-valued keys');
SELECT is(public.get_site() -> 'config' -> 'booking' -> 'policies' -> 0 ->> 'en', 'Arrival',
  'config.booking.policies keep both languages');
SELECT ok(NOT ((public.get_site() -> 'config') ? 'site'),
  'config.site is not served (stays static for i18n.js)');

-- ---------------------------------------------------------------------
-- data
-- ---------------------------------------------------------------------
SELECT is(public.get_site() -> 'data' -> 'CATEGORIES',
  '[{"id":"suite","fr":"Suite","en":"Suite"},{"id":"standard","fr":"Standard","en":"Standard"}]'::jsonb,
  'CATEGORIES: flat {id, fr, en}, published only, by sort_order');
SELECT is(jsonb_array_length(public.get_site() -> 'data' -> 'AMENITIES'), 1,
  'AMENITIES: published only');
SELECT is(
  (SELECT jsonb_agg(r ->> 'id') FROM jsonb_array_elements(public.get_site() -> 'data' -> 'ROOMS') r),
  '["oku","waza"]'::jsonb,
  'ROOMS: published only, unpublished category hidden, by sort_order');

SELECT is(public.get_site() -> 'data' -> 'ROOMS' -> 1,
  '{"id":"waza","ref":"RGG-01","name":"Waza","category":"standard","price":25000,"capacity":2,
    "beds":{"fr":"lit","en":"bed"},"size":24,"floor":{"fr":"2e","en":"2nd"},
    "view":{"fr":"jardin","en":"garden"},"short":{"fr":"c","en":"s"},"description":{"fr":"d","en":"d"},
    "amenities":["wifi"],"images":["img/w1.png","img/w2.png"],
    "breakfastIncluded":true,"breakfastNote":{"fr":"pdj","en":"bkf"},
    "taxes":{"included":true,"note":{"fr":"taxe","en":"tax"}},
    "cancellation":{"fr":"48 h","en":"48 h"},"featured":true}'::jsonb,
  'ROOMS: exact js/data.js room shape (unpublished amenity dropped)');

SELECT is(jsonb_array_length(public.get_site() -> 'data' -> 'SERVICES'), 1, 'SERVICES: published only');
SELECT is(public.get_site() -> 'data' -> 'SERVICES' -> 0 -> 'pricing' ->> 'quoteOnly', 'true',
  'SERVICES: pricing kept whole (incl. optional quoteOnly)');
SELECT is(public.get_site() -> 'data' -> 'SERVICES' -> 0 ->> 'inquiry', 'quote', 'SERVICES: inquiry type');

SELECT is(jsonb_array_length(public.get_site() -> 'data' -> 'BENEFITS'), 1, 'BENEFITS: published groups only');
SELECT is(
  (SELECT jsonb_agg(b -> 'title' ->> 'fr') FROM jsonb_array_elements(public.get_site() -> 'data' -> 'BENEFITS' -> 0 -> 'items') b),
  '["B1","B2"]'::jsonb,
  'BENEFITS: items nested, published only, by sort_order');

SELECT is(jsonb_array_length(public.get_site() -> 'data' -> 'TESTIMONIALS'), 1, 'TESTIMONIALS: published only');
SELECT is(public.get_site() -> 'data' -> 'VALUES' -> 0 -> 'title' ->> 'fr', 'Accueil', 'VALUES served');
SELECT is(public.get_site() -> 'data' -> 'GUEST_EXPERIENCE' -> 0 ->> 'icon', 'briefcase', 'GUEST_EXPERIENCE served');
SELECT is(public.get_site() -> 'data' -> 'TEAM' -> 0 ->> 'image', 'img/m.png', 'TEAM served');
SELECT is(public.get_site() -> 'data' -> 'GALLERY' -> 'items' -> 0 ->> 'image', 'img/g.png',
  'GALLERY: {items: [...]} shape');
SELECT is(public.get_site() -> 'data' -> 'HERO_IMAGES' ->> 'rooms', 'img/rooms.png', 'HERO_IMAGES served');

SELECT * FROM finish();
ROLLBACK;
