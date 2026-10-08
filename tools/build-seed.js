/**
 * Génère supabase/seed.sql à partir du contenu statique du site.
 *
 *   node tools/build-seed.js
 *
 * Lit js/config.js (RGG_CONFIG) et js/data.js (RGG_DATA), puis écrit les
 * INSERT correspondants aux tables de la migration 20260101000000_schema.sql.
 * Les fichiers statiques restent la source du seed ET le contenu de
 * secours du site si Supabase ne répond pas.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'supabase', 'seed.sql');

/* Exécute config.js et data.js dans un bac à sable qui imite window. */
function loadSite() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  ['js/config.js', 'js/data.js'].forEach((file) => {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), sandbox, { filename: file });
  });
  return { config: sandbox.window.RGG_CONFIG, data: sandbox.window.RGG_DATA };
}

/* ------------------------------------------------------------------
   Littéraux SQL
   ------------------------------------------------------------------ */
const str = (value) => "'" + String(value).replace(/'/g, "''") + "'";
const json = (value) => str(JSON.stringify(value)) + '::jsonb';
const bool = (value) => (value ? 'true' : 'false');
const int = (value) => {
  if (!Number.isInteger(value)) throw new Error('Entier attendu, reçu : ' + value);
  return String(value);
};
const textArray = (list) =>
  list.length ? 'array[' + list.map(str).join(', ') + ']::text[]' : "'{}'::text[]";

function insert(table, columns, rows) {
  if (!rows.length) return '';
  return (
    'insert into public.' + table + ' (' + columns.join(', ') + ') values\n' +
    rows.map((row) => '  (' + row.join(', ') + ')').join(',\n') +
    ';\n'
  );
}

/* Libellé bilingue d'une entrée plate { id, fr, en }. */
const label = (entry) => json({ fr: entry.fr, en: entry.en });

function build({ config, data }) {
  const parts = [];

  parts.push(
    insert(
      'settings',
      ['id', 'hotel', 'whatsapp', 'currency', 'booking', 'demo', 'hero_images'],
      [[
        '1',
        json(config.hotel),
        json(config.whatsapp),
        json(config.currency),
        json(config.booking),
        json(config.demo),
        json(data.HERO_IMAGES)
      ]]
    )
  );

  parts.push(
    insert(
      'room_categories',
      ['id', 'label', 'sort_order'],
      data.CATEGORIES.map((c, i) => [str(c.id), label(c), int(i + 1)])
    )
  );

  parts.push(
    insert(
      'amenities',
      ['id', 'label', 'sort_order'],
      data.AMENITIES.map((a, i) => [str(a.id), label(a), int(i + 1)])
    )
  );

  parts.push(
    insert(
      'rooms',
      [
        'id', 'ref', 'name', 'category_id', 'price', 'capacity', 'beds', 'size',
        'floor', 'view', 'short', 'description', 'amenity_ids', 'images',
        'breakfast_included', 'breakfast_note', 'tax_included', 'tax_note',
        'cancellation', 'featured', 'sort_order'
      ],
      data.ROOMS.map((r, i) => [
        str(r.id), str(r.ref), str(r.name), str(r.category), int(r.price),
        int(r.capacity), json(r.beds), int(r.size), json(r.floor), json(r.view),
        json(r.short), json(r.description), textArray(r.amenities), textArray(r.images),
        bool(r.breakfastIncluded), json(r.breakfastNote), bool(r.taxes.included),
        json(r.taxes.note), json(r.cancellation), bool(r.featured), int(i + 1)
      ])
    )
  );

  parts.push(
    insert(
      'services',
      ['id', 'icon', 'image', 'title', 'short', 'details', 'hours', 'pricing', 'inquiry', 'sort_order'],
      data.SERVICES.map((s, i) => [
        str(s.id), str(s.icon), str(s.image), json(s.title), json(s.short),
        json(s.details), json(s.hours), json(s.pricing), str(s.inquiry), int(i + 1)
      ])
    )
  );

  /* Groupes d'avantages : ids explicites pour rattacher les éléments. */
  parts.push(
    'insert into public.benefit_groups (id, title, sort_order) overriding system value values\n' +
      data.BENEFITS.map((g, i) => '  (' + [int(i + 1), json(g.title), int(i + 1)].join(', ') + ')').join(',\n') +
      ';\n' +
      "select setval(pg_get_serial_sequence('public.benefit_groups', 'id'), " +
      int(data.BENEFITS.length) + ');\n'
  );
  parts.push(
    insert(
      'benefits',
      ['group_id', 'icon', 'title', 'text', 'sort_order'],
      data.BENEFITS.flatMap((g, gi) =>
        g.items.map((b, i) => [int(gi + 1), str(b.icon), json(b.title), json(b.text), int(i + 1)])
      )
    )
  );

  parts.push(
    insert(
      'testimonials',
      ['quote', 'author', 'meta', 'rating', 'sort_order'],
      data.TESTIMONIALS.map((t, i) => [json(t.quote), json(t.author), json(t.meta), int(t.rating), int(i + 1)])
    )
  );

  parts.push(
    insert(
      'hotel_values',
      ['title', 'text', 'sort_order'],
      data.VALUES.map((v, i) => [json(v.title), json(v.text), int(i + 1)])
    )
  );

  parts.push(
    insert(
      'guest_experiences',
      ['audience', 'icon', 'text', 'sort_order'],
      data.GUEST_EXPERIENCE.map((g, i) => [json(g.audience), str(g.icon), json(g.text), int(i + 1)])
    )
  );

  parts.push(
    insert(
      'team_members',
      ['name', 'role', 'bio', 'image', 'sort_order'],
      data.TEAM.map((m, i) => [json(m.name), json(m.role), json(m.bio), str(m.image), int(i + 1)])
    )
  );

  parts.push(
    insert(
      'gallery_items',
      ['image', 'caption', 'sort_order'],
      data.GALLERY.items.map((g, i) => [str(g.image), json(g.caption), int(i + 1)])
    )
  );

  return (
    '-- =====================================================================\n' +
    '-- Royal Guest Garden 2 — seed généré par tools/build-seed.js\n' +
    '-- Source : js/config.js + js/data.js. NE PAS MODIFIER À LA MAIN :\n' +
    '-- modifiez les fichiers du site puis relancez node tools/build-seed.js.\n' +
    '-- =====================================================================\n\n' +
    parts.filter(Boolean).join('\n')
  );
}

fs.writeFileSync(OUT, build(loadSite()), 'utf8');
console.log('Seed écrit : ' + path.relative(ROOT, OUT));
