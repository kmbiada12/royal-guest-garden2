-- =====================================================================
-- Royal Guest Garden 2 — 0003 Public read API
-- get_site() → { config: {hotel, whatsapp, currency, booking, demo},
--                data:   {CATEGORIES, AMENITIES, ROOMS, SERVICES, BENEFITS,
--                         TESTIMONIALS, VALUES, GUEST_EXPERIENCE, TEAM,
--                         GALLERY: {items}, HERO_IMAGES} }
-- Exact shapes of RGG_CONFIG / RGG_DATA (both languages: the site picks).
-- Published rows only; rooms of an unpublished category are hidden.
-- Returns null when settings are missing (the site keeps its static data).
-- Callable with GET /rest/v1/rpc/get_site; responses may be cached 60 s.
-- =====================================================================

create or replace function public.get_site() returns jsonb
security definer set search_path = public
stable language plpgsql as $$
declare
  s public.settings%rowtype;
begin
  select * into s from public.settings where id = 1;
  if not found then
    return null;
  end if;

  -- HTTP caching hint for browsers / CDNs (PostgREST response header).
  perform set_config(
    'response.headers',
    '[{"Cache-Control": "public, max-age=60, stale-while-revalidate=300"}]',
    true
  );

  return jsonb_build_object(
    'config', jsonb_build_object(
      'hotel', s.hotel,
      'whatsapp', s.whatsapp,
      'currency', s.currency,
      'booking', s.booking,
      'demo', s.demo
    ),
    'data', jsonb_build_object(
      'CATEGORIES', (
        select coalesce(jsonb_agg(
          jsonb_build_object('id', c.id) || c.label
          order by c.sort_order, c.id), '[]'::jsonb)
        from public.room_categories c where c.published
      ),
      'AMENITIES', (
        select coalesce(jsonb_agg(
          jsonb_build_object('id', a.id) || a.label
          order by a.sort_order, a.id), '[]'::jsonb)
        from public.amenities a where a.published
      ),
      'ROOMS', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'id', r.id,
          'ref', r.ref,
          'name', r.name,
          'category', r.category_id,
          'price', r.price,
          'capacity', r.capacity,
          'beds', r.beds,
          'size', r.size,
          'floor', r.floor,
          'view', r.view,
          'short', r.short,
          'description', r.description,
          -- unpublished amenities are dropped so no raw id ever shows
          'amenities', to_jsonb(array(
            select a from unnest(r.amenity_ids) with ordinality as x (a, ord)
            where exists (select 1 from public.amenities m where m.id = x.a and m.published)
            order by x.ord
          )),
          'images', to_jsonb(r.images),
          'breakfastIncluded', r.breakfast_included,
          'breakfastNote', r.breakfast_note,
          'taxes', jsonb_build_object('included', r.tax_included, 'note', r.tax_note),
          'cancellation', r.cancellation,
          'featured', r.featured
        ) order by r.sort_order, r.id), '[]'::jsonb)
        from public.rooms r
        join public.room_categories c on c.id = r.category_id and c.published
        where r.published
      ),
      'SERVICES', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'id', v.id,
          'icon', v.icon,
          'image', v.image,
          'title', v.title,
          'short', v.short,
          'details', v.details,
          'hours', v.hours,
          'pricing', v.pricing,
          'inquiry', v.inquiry
        ) order by v.sort_order, v.id), '[]'::jsonb)
        from public.services v where v.published
      ),
      'BENEFITS', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'title', g.title,
          'items', (
            select coalesce(jsonb_agg(jsonb_build_object(
              'icon', b.icon, 'title', b.title, 'text', b.text
            ) order by b.sort_order, b.id), '[]'::jsonb)
            from public.benefits b where b.group_id = g.id and b.published
          )
        ) order by g.sort_order, g.id), '[]'::jsonb)
        from public.benefit_groups g where g.published
      ),
      'TESTIMONIALS', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'quote', t.quote, 'author', t.author, 'meta', t.meta, 'rating', t.rating
        ) order by t.sort_order, t.id), '[]'::jsonb)
        from public.testimonials t where t.published
      ),
      'VALUES', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'title', hv.title, 'text', hv.text
        ) order by hv.sort_order, hv.id), '[]'::jsonb)
        from public.hotel_values hv where hv.published
      ),
      'GUEST_EXPERIENCE', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'audience', ge.audience, 'icon', ge.icon, 'text', ge.text
        ) order by ge.sort_order, ge.id), '[]'::jsonb)
        from public.guest_experiences ge where ge.published
      ),
      'TEAM', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'name', m.name, 'role', m.role, 'bio', m.bio, 'image', m.image
        ) order by m.sort_order, m.id), '[]'::jsonb)
        from public.team_members m where m.published
      ),
      'GALLERY', jsonb_build_object('items', (
        select coalesce(jsonb_agg(jsonb_build_object(
          'image', gi.image, 'caption', gi.caption
        ) order by gi.sort_order, gi.id), '[]'::jsonb)
        from public.gallery_items gi where gi.published
      )),
      'HERO_IMAGES', s.hero_images
    )
  );
end;
$$;

revoke execute on function public.get_site() from public;
grant execute on function public.get_site() to anon, authenticated;
