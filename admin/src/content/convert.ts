import { z } from 'zod';
import { fromI18nForm, missingEnglish, toI18nForm, type I18nForm } from '@/lib/i18n';
import { isAcceptableImage } from '@/lib/images';
import type { PricingForm } from '@/components/fields/PricingInput';
import type { CollectionDef, FieldDef, FormValues } from './types';

/* ---------------------------------------------------------------------
   Pricing (services.pricing jsonb)
   --------------------------------------------------------------------- */
export function toPricingForm(value: unknown): PricingForm {
  const p = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const included = p.included === true ? 'true' : p.included === 'partial' ? 'partial' : 'false';
  const items = Array.isArray(p.items) ? p.items : [];
  return {
    included,
    note: toI18nForm(p.note),
    items: items.map((it: { label?: unknown; price?: unknown }) => ({
      label: toI18nForm(it?.label),
      price: typeof it?.price === 'number' ? String(it.price) : ''
    })),
    quoteOnly: p.quoteOnly === true
  };
}

export function fromPricingForm(form: PricingForm): Record<string, unknown> {
  const out: Record<string, unknown> = {
    included: form.included === 'true' ? true : form.included === 'partial' ? 'partial' : false
  };
  if (form.note.fr.trim()) out.note = fromI18nForm(form.note);
  if (form.items.length) {
    out.items = form.items.map((it) => ({ label: fromI18nForm(it.label), price: Number(it.price) }));
  }
  if (form.quoteOnly) out.quoteOnly = true;
  return out;
}

/* ---------------------------------------------------------------------
   Row ⇄ form
   --------------------------------------------------------------------- */
export function fieldToForm(field: FieldDef, value: unknown): unknown {
  switch (field.kind) {
    case 'bool':
      return value === true;
    case 'int':
      return typeof value === 'number' ? String(value) : '';
    case 'i18n':
      return toI18nForm(value);
    case 'i18nList':
      return Array.isArray(value) ? value.map(toI18nForm) : [];
    case 'images':
    case 'amenities':
      return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
    case 'pricing':
      return toPricingForm(value);
    case 'ref':
      return value === null || value === undefined ? '' : String(value);
    default:
      return typeof value === 'string' ? value : '';
  }
}

export function fieldFromForm(field: FieldDef, value: unknown): unknown {
  switch (field.kind) {
    case 'bool':
      return value === true;
    case 'int':
      return Number(value);
    case 'i18n':
      return fromI18nForm(value as I18nForm);
    case 'i18nList':
      return (value as I18nForm[]).map(fromI18nForm);
    case 'images':
    case 'amenities':
      return value as string[];
    case 'pricing':
      return fromPricingForm(value as PricingForm);
    case 'ref':
      return field.numeric ? Number(value) : String(value);
    case 'slug':
    case 'text':
      return String(value).trim();
    default:
      return value;
  }
}

export function rowToForm(def: CollectionDef, row: Record<string, unknown> | null): FormValues {
  const source = row ?? def.defaults;
  const values: FormValues = {};
  for (const field of def.fields) values[field.key] = fieldToForm(field, source[field.key]);
  return values;
}

export function formToRow(def: CollectionDef, values: FormValues, isNew: boolean): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const field of def.fields) {
    if (field.kind === 'slug' && !isNew) continue; // primary key never changes
    row[field.key] = fieldFromForm(field, values[field.key]);
  }
  return row;
}

/* ---------------------------------------------------------------------
   Validation (mirrors the database CHECK constraints)
   --------------------------------------------------------------------- */
const i18nSchema = z.object({
  fr: z.string().trim().min(1, 'Le texte français est obligatoire.'),
  en: z.string()
});

function fieldSchema(field: FieldDef): z.ZodType {
  switch (field.kind) {
    case 'slug':
      return z
        .string()
        .trim()
        .min(1, 'Obligatoire.')
        .regex(/^[a-z0-9-]+$/, 'Lettres minuscules, chiffres et tirets uniquement (ex. suite-oku).');
    case 'text':
      return z.string().trim().min(1, 'Obligatoire.').max(field.maxLength ?? 200, 'Trop long.');
    case 'int': {
      const min = field.min ?? 0;
      return z
        .string()
        .regex(/^\d+$/, 'Nombre entier attendu.')
        .refine((v) => Number(v) >= min, `Minimum ${min}.`)
        .refine((v) => field.max === undefined || Number(v) <= field.max, `Maximum ${field.max}.`);
    }
    case 'bool':
      return z.boolean();
    case 'i18n':
      return i18nSchema;
    case 'i18nList':
      return z.array(i18nSchema);
    case 'image':
      return z.string().refine(isAcceptableImage, 'Chemin img/… ou adresse https:// attendu (ou envoyez une image).');
    case 'images':
      return z
        .array(z.string().refine(isAcceptableImage, 'Une photo a un chemin invalide.'))
        .min(1, 'Au moins une photo.');
    case 'select':
    case 'icon':
    case 'ref':
      return z.string().min(1, 'Choisissez une valeur.');
    case 'amenities':
      return z.array(z.string());
    case 'pricing':
      return z.object({
        included: z.enum(['true', 'false', 'partial']),
        note: z.object({ fr: z.string(), en: z.string() }),
        items: z.array(
          z.object({
            label: i18nSchema,
            price: z.string().regex(/^\d+$/, 'Prix en FCFA (nombre entier).')
          })
        ),
        quoteOnly: z.boolean()
      });
  }
}

export function buildSchema(def: CollectionDef) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of def.fields) shape[field.key] = fieldSchema(field);
  return z.object(shape);
}

/** First error message inside a (possibly nested) react-hook-form error object. */
export function firstError(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const e = error as Record<string, unknown>;
  if (typeof e.message === 'string' && e.message) return e.message;
  for (const value of Object.values(e)) {
    if (value && typeof value === 'object' && value !== e.ref) {
      const nested = firstError(value);
      if (nested) return nested;
    }
  }
  return undefined;
}

/* ---------------------------------------------------------------------
   Translation status
   --------------------------------------------------------------------- */
/** Number of bilingual fields of a row without an English version. */
export function missingTranslations(def: CollectionDef, row: Record<string, unknown>): number {
  let count = 0;
  for (const field of def.fields) {
    const value = row[field.key];
    if (field.kind === 'i18n' && missingEnglish(value)) count++;
    if (field.kind === 'i18nList' && Array.isArray(value)) count += value.filter(missingEnglish).length;
    if (field.kind === 'pricing' && value && typeof value === 'object') {
      const p = value as { note?: unknown; items?: { label?: unknown }[] };
      if (p.note && missingEnglish(p.note)) count++;
      (p.items ?? []).forEach((it) => missingEnglish(it.label) && count++);
    }
  }
  return count;
}
