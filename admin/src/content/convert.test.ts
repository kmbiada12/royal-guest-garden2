import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/env', () => ({ env: { supabaseUrl: 'http://x', supabaseAnonKey: 'k', siteUrl: 'http://site.test' } }));
vi.mock('@/lib/supabase', () => ({ supabase: {} }));

import { COLLECTIONS, collectionBySlug } from './collections';
import { buildSchema, formToRow, fromPricingForm, missingTranslations, rowToForm, toPricingForm } from './convert';

const rooms = collectionBySlug('chambres')!;
const services = collectionBySlug('services')!;

/** Shape of a seeded room (js/data.js → seed.sql). */
const waza = {
  id: 'waza',
  ref: 'RGG-01',
  name: 'Waza',
  category_id: 'standard',
  price: 25000,
  capacity: 2,
  size: 24,
  beds: { fr: '1 lit double', en: '1 double bed' },
  floor: { fr: '2ᵉ étage', en: '2nd floor' },
  view: { fr: 'Jardin', en: 'Garden' },
  short: { fr: 'Court', en: 'Short' },
  description: { fr: 'Long' },
  amenity_ids: ['wifi', 'salon'],
  images: ['img/chambres/wazabon/wazab.png', 'img/chambres/wazabon/Warm wood luxury bedroom retreat-2.png'],
  breakfast_included: true,
  breakfast_note: { fr: 'Inclus', en: 'Included' },
  tax_included: true,
  tax_note: { fr: 'TVA', en: 'VAT' },
  cancellation: { fr: '48 h', en: '48 h' },
  featured: true,
  published: true
};

describe('collections config', () => {
  it('has unique slugs and a slug field for text primary keys', () => {
    expect(new Set(COLLECTIONS.map((c) => c.slug)).size).toBe(COLLECTIONS.length);
    for (const c of COLLECTIONS) {
      expect(c.fields.some((f) => f.kind === 'slug')).toBe(c.pkKind === 'slug');
      expect(c.fields.some((f) => f.key === 'published')).toBe(true);
    }
  });
});

describe('row ⇄ form', () => {
  it('round-trips a room without changing it', () => {
    const back = formToRow(rooms, rowToForm(rooms, waza), true);
    expect(back).toEqual(waza);
  });

  it('never sends the primary key on update', () => {
    expect(formToRow(rooms, rowToForm(rooms, waza), false)).not.toHaveProperty('id');
  });

  it('round-trips service pricing (partial inclusion, quote only)', () => {
    const pricing = {
      included: 'partial',
      note: { fr: 'Note', en: 'Note' },
      items: [{ label: { fr: 'Massage' }, price: 15000 }],
      quoteOnly: true
    };
    expect(fromPricingForm(toPricingForm(pricing))).toEqual(pricing);
    expect(fromPricingForm(toPricingForm({ included: false }))).toEqual({ included: false });
  });

  it('counts missing English translations', () => {
    expect(missingTranslations(rooms, waza)).toBe(1); // description
    expect(
      missingTranslations(services, {
        details: [{ fr: 'a' }, { fr: 'b', en: 'b' }],
        pricing: { included: true, items: [{ label: { fr: 'x' }, price: 1 }] }
      })
    ).toBe(2);
  });
});

describe('validation', () => {
  const schema = buildSchema(rooms);
  it('accepts a valid room', () => {
    expect(schema.safeParse(rowToForm(rooms, waza)).success).toBe(true);
  });
  it('rejects what the database would reject', () => {
    const bad = rowToForm(rooms, {
      ...waza,
      id: 'Bad Id',
      short: { fr: '  ' },
      images: [],
      capacity: 0
    });
    const result = schema.safeParse(bad);
    expect(result.success).toBe(false);
    const paths = result.success ? [] : result.error.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(['id', 'short', 'images', 'capacity']));
  });
  it('rejects an unsafe image in a service', () => {
    const svc = buildSchema(services);
    const form = rowToForm(services, {
      id: 'spa',
      title: { fr: 'Spa' },
      short: { fr: 's' },
      details: [],
      hours: { fr: '9h' },
      pricing: { included: false },
      inquiry: 'info',
      icon: 'bell',
      image: 'javascript:alert(1)',
      published: true
    });
    const result = svc.safeParse(form);
    expect(result.success).toBe(false);
  });
});
