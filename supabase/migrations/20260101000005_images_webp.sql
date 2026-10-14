-- =====================================================================
-- Royal Guest Garden 2 — 0006 Images WebP
-- Bascule des chemins d'images statiques de .png vers .webp après la
-- conversion des fichiers (gain ~94 % de poids). Idempotent : replace()
-- sur des chemins déjà en .webp ne modifie rien.
-- =====================================================================

update public.services
   set image = replace(image, '.png', '.webp')
 where image like '%.png';

update public.team_members
   set image = replace(image, '.png', '.webp')
 where image like '%.png';

update public.gallery_items
   set image = replace(image, '.png', '.webp')
 where image like '%.png';

update public.rooms
   set images = array(select replace(x, '.png', '.webp') from unnest(images) as x);

update public.settings
   set hero_images = (
     select jsonb_object_agg(k, to_jsonb(replace(v, '.png', '.webp')))
     from jsonb_each_text(hero_images) as t(k, v)
   );
