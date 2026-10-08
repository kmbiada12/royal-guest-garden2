-- =====================================================================
-- Royal Guest Garden 2 — 0001 Schema
-- Content tables shaped like js/config.js (RGG_CONFIG) and js/data.js
-- (RGG_DATA); personal-data and system tables; validation, integrity
-- and audit triggers.
-- Translatable text is jsonb { "fr": "…", "en": "…" } (fr required).
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
-- VALIDATION HELPERS (used by CHECK constraints)
-- ---------------------------------------------------------------------

-- { "fr": non-empty string, "en"?: string } and nothing else.
create or replace function public.is_i18n_text(v jsonb) returns boolean
language plpgsql immutable as $$
begin
  if v is null or jsonb_typeof(v) <> 'object' then
    return false;
  end if;
  if jsonb_typeof(v -> 'fr') is distinct from 'string' or btrim(v ->> 'fr') = '' then
    return false;
  end if;
  if v ? 'en' and jsonb_typeof(v -> 'en') <> 'string' then
    return false;
  end if;
  return not exists (select 1 from jsonb_object_keys(v) k where k not in ('fr', 'en'));
end;
$$;

-- [ i18n_text, … ]
create or replace function public.is_i18n_list(v jsonb) returns boolean
language plpgsql immutable as $$
begin
  if v is null or jsonb_typeof(v) <> 'array' then
    return false;
  end if;
  return not exists (
    select 1 from jsonb_array_elements(v) e where not public.is_i18n_text(e)
  );
end;
$$;

-- https://… only (used in href attributes: no javascript:, data:, …).
create or replace function public.is_safe_https_url(u text) returns boolean
language sql immutable as $$
  select u is not null and u ~ '^https://[^\s"''<>]+$';
$$;

-- Image source: https URL or a path inside the site's img/ folder.
create or replace function public.is_safe_image(u text) returns boolean
language sql immutable as $$
  select public.is_safe_https_url(u)
      or (u ~ '^img/[^"<>]+$' and u !~ '\.\.' and u !~ '[\\\n\r]');
$$;

create or replace function public.are_safe_images(list text[]) returns boolean
language sql immutable as $$
  select coalesce(bool_and(public.is_safe_image(u)), true) from unnest(list) as u;
$$;

-- { "key": image, … } (hero images)
create or replace function public.are_safe_image_values(v jsonb) returns boolean
language plpgsql immutable as $$
begin
  if v is null or jsonb_typeof(v) <> 'object' then
    return false;
  end if;
  return not exists (
    select 1 from jsonb_each(v) e
    where jsonb_typeof(e.value) <> 'string' or not public.is_safe_image(e.value #>> '{}')
  );
end;
$$;

-- Service pricing: { included, note?: i18n, items?: [{label: i18n, price: int ≥ 0}], quoteOnly? }
create or replace function public.is_valid_pricing(v jsonb) returns boolean
language plpgsql immutable as $$
begin
  if v is null or jsonb_typeof(v) <> 'object' then
    return false;
  end if;
  if v ? 'note' and not public.is_i18n_text(v -> 'note') then
    return false;
  end if;
  if v ? 'items' then
    if jsonb_typeof(v -> 'items') <> 'array' then
      return false;
    end if;
    if exists (
      select 1 from jsonb_array_elements(v -> 'items') it
      where not public.is_i18n_text(it -> 'label')
         or jsonb_typeof(it -> 'price') is distinct from 'number'
         or (it ->> 'price')::numeric < 0
    ) then
      return false;
    end if;
  end if;
  return true;
end;
$$;

-- ---------------------------------------------------------------------
-- SETTINGS (single row, id = 1) — RGG_CONFIG sections + hero images.
-- `site` (languages, storage key) stays static: i18n.js needs it first.
-- ---------------------------------------------------------------------
create table public.settings (
  id smallint primary key default 1 check (id = 1),
  hotel jsonb not null,
  whatsapp jsonb not null,
  currency jsonb not null,
  booking jsonb not null,
  demo jsonb not null,
  hero_images jsonb not null,
  updated_at timestamptz not null default now(),
  constraint settings_hotel_chk check (
    jsonb_typeof(hotel) = 'object'
    and jsonb_typeof(hotel -> 'name') = 'string' and btrim(hotel ->> 'name') <> ''
    and (not hotel ? 'mapUrl' or public.is_safe_https_url(hotel ->> 'mapUrl'))
  ),
  constraint settings_whatsapp_chk check (
    jsonb_typeof(whatsapp) = 'object'
    and (whatsapp ->> 'number') ~ '^[0-9]{8,15}$'
    and (not whatsapp ? 'numberAlt' or (whatsapp ->> 'numberAlt') ~ '^[0-9]{8,15}$')
    and (not whatsapp ? 'baseUrl' or public.is_safe_https_url(whatsapp ->> 'baseUrl'))
  ),
  constraint settings_currency_chk check (jsonb_typeof(currency) = 'object'),
  constraint settings_booking_chk check (jsonb_typeof(booking) = 'object'),
  constraint settings_demo_chk check (jsonb_typeof(demo) = 'object'),
  constraint settings_hero_images_chk check (
    jsonb_typeof(hero_images) = 'object'
    and public.are_safe_image_values(hero_images)
  )
);

-- ---------------------------------------------------------------------
-- CONTENT (RGG_DATA). Every table: sort_order + published.
-- ---------------------------------------------------------------------
create table public.room_categories (          -- CATEGORIES
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  label jsonb not null check (public.is_i18n_text(label)),
  sort_order int not null default 0,
  published boolean not null default true
);

create table public.amenities (                 -- AMENITIES
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  label jsonb not null check (public.is_i18n_text(label)),
  sort_order int not null default 0,
  published boolean not null default true
);

create table public.rooms (                     -- ROOMS
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  ref text not null unique check (btrim(ref) <> ''),
  name text not null check (btrim(name) <> ''),
  category_id text not null references public.room_categories (id),
  price int not null check (price >= 0),
  capacity int not null check (capacity >= 1),
  beds jsonb not null check (public.is_i18n_text(beds)),
  size int not null check (size > 0),
  floor jsonb not null check (public.is_i18n_text(floor)),
  view jsonb not null check (public.is_i18n_text(view)),
  short jsonb not null check (public.is_i18n_text(short)),
  description jsonb not null check (public.is_i18n_text(description)),
  amenity_ids text[] not null default '{}',
  images text[] not null
    check (cardinality(images) >= 1 and public.are_safe_images(images)),  -- first = cover
  breakfast_included boolean not null default false,
  breakfast_note jsonb not null check (public.is_i18n_text(breakfast_note)),
  tax_included boolean not null default false,
  tax_note jsonb not null check (public.is_i18n_text(tax_note)),
  cancellation jsonb not null check (public.is_i18n_text(cancellation)),
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true
);
create unique index idx_rooms_id_lower on public.rooms (lower(id));
create index idx_rooms_category on public.rooms (category_id);

create table public.services (                  -- SERVICES
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  icon text not null,
  image text not null check (public.is_safe_image(image)),
  title jsonb not null check (public.is_i18n_text(title)),
  short jsonb not null check (public.is_i18n_text(short)),
  details jsonb not null default '[]' check (public.is_i18n_list(details)),
  hours jsonb not null check (public.is_i18n_text(hours)),
  pricing jsonb not null check (public.is_valid_pricing(pricing)),
  inquiry text not null check (inquiry in ('info', 'quote')),
  sort_order int not null default 0,
  published boolean not null default true
);

create table public.benefit_groups (            -- BENEFITS[]
  id bigint generated always as identity primary key,
  title jsonb not null check (public.is_i18n_text(title)),
  sort_order int not null default 0,
  published boolean not null default true
);

create table public.benefits (                  -- BENEFITS[].items[]
  id bigint generated always as identity primary key,
  group_id bigint not null references public.benefit_groups (id) on delete cascade,
  icon text not null,
  title jsonb not null check (public.is_i18n_text(title)),
  text jsonb not null check (public.is_i18n_text(text)),
  sort_order int not null default 0,
  published boolean not null default true
);
create index idx_benefits_group on public.benefits (group_id, sort_order);

create table public.testimonials (              -- TESTIMONIALS
  id bigint generated always as identity primary key,
  quote jsonb not null check (public.is_i18n_text(quote)),
  author jsonb not null check (public.is_i18n_text(author)),
  meta jsonb not null check (public.is_i18n_text(meta)),
  rating int not null check (rating between 0 and 5),
  sort_order int not null default 0,
  published boolean not null default true
);

create table public.hotel_values (              -- VALUES
  id bigint generated always as identity primary key,
  title jsonb not null check (public.is_i18n_text(title)),
  text jsonb not null check (public.is_i18n_text(text)),
  sort_order int not null default 0,
  published boolean not null default true
);

create table public.guest_experiences (         -- GUEST_EXPERIENCE
  id bigint generated always as identity primary key,
  audience jsonb not null check (public.is_i18n_text(audience)),
  icon text not null,
  text jsonb not null check (public.is_i18n_text(text)),
  sort_order int not null default 0,
  published boolean not null default true
);

create table public.team_members (              -- TEAM
  id bigint generated always as identity primary key,
  name jsonb not null check (public.is_i18n_text(name)),
  role jsonb not null check (public.is_i18n_text(role)),
  bio jsonb not null check (public.is_i18n_text(bio)),
  image text not null check (public.is_safe_image(image)),
  sort_order int not null default 0,
  published boolean not null default true
);

create table public.gallery_items (             -- GALLERY.items
  id bigint generated always as identity primary key,
  image text not null check (public.is_safe_image(image)),
  caption jsonb not null check (public.is_i18n_text(caption)),
  sort_order int not null default 0,
  published boolean not null default true
);

-- ---------------------------------------------------------------------
-- PERSONAL DATA (written only by Edge Functions with the service role)
-- Phone rule: 8–15 digits, whatever the formatting.
-- ---------------------------------------------------------------------
create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  room_id text references public.rooms (id) on delete set null,  -- room_snapshot keeps the data
  room_snapshot jsonb not null,
  check_in date not null,
  check_out date not null,
  adults int not null check (adults >= 1),
  children int not null default 0 check (children >= 0),
  rooms int not null default 1 check (rooms >= 1),
  guest_name text not null,
  guest_phone text not null,
  special_requests text,
  guest_lang text not null default 'fr' check (guest_lang in ('fr', 'en')),
  nights int not null check (nights >= 0),
  nightly_rate int not null check (nightly_rate >= 0),
  estimated_total int not null check (estimated_total >= 0),
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'confirmed', 'declined', 'cancelled')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_requests_dates_chk check (check_out > check_in),
  constraint booking_requests_nights_chk check (nights = check_out - check_in),
  constraint booking_requests_total_chk
    check (estimated_total::bigint = nightly_rate::bigint * nights * rooms),
  constraint booking_requests_name_chk check (char_length(btrim(guest_name)) between 2 and 120),
  constraint booking_requests_phone_chk
    check (char_length(regexp_replace(guest_phone, '\D', '', 'g')) between 8 and 15
           and char_length(guest_phone) <= 30),
  constraint booking_requests_requests_chk check (char_length(special_requests) <= 2000),
  constraint booking_requests_message_chk check (char_length(message) <= 8000),
  constraint booking_requests_notes_chk check (char_length(internal_notes) <= 5000)
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  subject text not null,
  message text not null,
  guest_lang text not null default 'fr' check (guest_lang in ('fr', 'en')),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enquiries_name_chk check (char_length(btrim(name)) between 2 and 120),
  constraint enquiries_phone_chk
    check (char_length(regexp_replace(phone, '\D', '', 'g')) between 8 and 15
           and char_length(phone) <= 30),
  constraint enquiries_email_chk
    check (email is null or (char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  constraint enquiries_subject_chk check (char_length(subject) between 1 and 200),
  constraint enquiries_message_chk check (char_length(btrim(message)) between 10 and 5000)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  question text,
  guest_lang text not null default 'fr' check (guest_lang in ('fr', 'en')),
  source text not null default 'chat',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_name_chk check (char_length(btrim(name)) between 2 and 120),
  constraint leads_phone_chk
    check (char_length(regexp_replace(phone, '\D', '', 'g')) between 8 and 15
           and char_length(phone) <= 30),
  constraint leads_question_chk check (char_length(question) <= 2000),
  constraint leads_source_chk check (char_length(source) <= 50)
);

-- ---------------------------------------------------------------------
-- SYSTEM
-- ---------------------------------------------------------------------
create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  invited_by uuid references public.staff (user_id) on delete set null
);

create table public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  recipient text not null,
  reply_to text,
  template text not null,
  payload jsonb not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  attempts int not null default 0,
  last_error text,
  resend_message_id text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_user_id uuid,
  table_name text not null,
  record_id text not null default '',
  action text not null check (action in ('insert', 'update', 'delete')),
  diff jsonb,
  created_at timestamptz not null default now()
);

create table public.rate_limits (
  key text primary key,
  count int not null default 0,
  window_start timestamptz not null default now()
);

create table public.reference_counters (
  year int primary key,
  last_value int not null default 0
);

-- ---------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------
create index idx_booking_requests_status on public.booking_requests (status, created_at desc);
create index idx_booking_requests_room on public.booking_requests (room_id);
create index idx_enquiries_status on public.enquiries (status, created_at desc);
create index idx_leads_status on public.leads (status, created_at desc);
create index idx_email_outbox_status on public.email_outbox (status, created_at);
create index idx_audit_log_table on public.audit_log (table_name, record_id);
create index idx_audit_log_created on public.audit_log (created_at);

-- ---------------------------------------------------------------------
-- TRIGGERS: updated_at
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['settings', 'booking_requests', 'enquiries', 'leads'] loop
    execute format(
      'create trigger trg_%1$s_updated before update on public.%1$I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- TRIGGERS: amenity references (rooms.amenity_ids ⊆ amenities.id)
-- ---------------------------------------------------------------------
create or replace function public.check_room_amenities() returns trigger
security definer set search_path = public
language plpgsql as $$
declare
  unknown text;
begin
  select string_agg(a, ', ') into unknown
  from unnest(new.amenity_ids) as a
  where not exists (select 1 from public.amenities m where m.id = a);
  if unknown is not null then
    raise exception 'Unknown amenity id(s) for room %: %', new.id, unknown
      using errcode = '23503';
  end if;
  return new;
end;
$$;

create trigger trg_rooms_amenities
  before insert or update of amenity_ids on public.rooms
  for each row execute function public.check_room_amenities();

create or replace function public.protect_used_amenity() returns trigger
security definer set search_path = public
language plpgsql as $$
begin
  if (tg_op = 'DELETE' or new.id <> old.id)
     and exists (select 1 from public.rooms r where old.id = any (r.amenity_ids)) then
    raise exception 'Amenity % is still used by a room', old.id
      using errcode = '23503';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger trg_amenities_in_use
  before update of id or delete on public.amenities
  for each row execute function public.protect_used_amenity();

-- ---------------------------------------------------------------------
-- TRIGGER: there is always at least one admin once one exists
-- (also blocks deleting the last admin's auth user, via the cascade)
-- ---------------------------------------------------------------------
create or replace function public.protect_last_admin() returns trigger
security definer set search_path = public
language plpgsql as $$
begin
  if old.role = 'admin'
     and (tg_op = 'DELETE' or new.role <> 'admin')
     and not exists (
       select 1 from public.staff s
       where s.role = 'admin' and s.user_id <> old.user_id
     ) then
    raise exception 'Cannot remove or demote the last admin'
      using errcode = '23514';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger trg_staff_last_admin
  before update of role or delete on public.staff
  for each row execute function public.protect_last_admin();

-- ---------------------------------------------------------------------
-- TRIGGERS: audit trail
-- Personal-data tables log only changed field names (+ status) — never
-- values. Content and staff tables log the full row.
-- ---------------------------------------------------------------------
create or replace function public.audit_row_change() returns trigger
security definer set search_path = public
language plpgsql as $$
declare
  old_row jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end;
  new_row jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end;
  payload jsonb := coalesce(new_row, old_row);
  audit_diff jsonb := payload;
begin
  if tg_table_name in ('booking_requests', 'enquiries', 'leads') then
    audit_diff := jsonb_build_object(
      'fields', (
        select coalesce(jsonb_agg(k order by k), '[]'::jsonb)
        from jsonb_object_keys(payload) as k
        where tg_op <> 'UPDATE' or old_row -> k is distinct from new_row -> k
      ),
      'status', payload ->> 'status'
    );
  end if;

  insert into public.audit_log (actor_user_id, table_name, record_id, action, diff)
  values (
    auth.uid(),
    tg_table_name,
    coalesce(payload ->> 'id', payload ->> 'user_id', ''),
    lower(tg_op),
    audit_diff
  );
  return coalesce(new, old);
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'settings', 'room_categories', 'amenities', 'rooms', 'services',
    'benefit_groups', 'benefits', 'testimonials', 'hotel_values',
    'guest_experiences', 'team_members', 'gallery_items',
    'booking_requests', 'enquiries', 'leads', 'staff'
  ] loop
    execute format(
      'create trigger trg_audit_%1$s after insert or update or delete on public.%1$I
         for each row execute function public.audit_row_change()', t);
  end loop;
end;
$$;
