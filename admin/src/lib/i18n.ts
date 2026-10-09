/** Bilingual text as stored in the database: French required, English optional. */
export interface I18nText {
  fr: string;
  en?: string;
}

/** Form-side shape: both keys always present (empty string = not filled). */
export interface I18nForm {
  fr: string;
  en: string;
}

export const emptyI18n = (): I18nForm => ({ fr: '', en: '' });

export function isI18n(value: unknown): value is I18nText {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof (value as I18nText).fr === 'string'
  );
}

/** Database value → form value. */
export function toI18nForm(value: unknown): I18nForm {
  if (!isI18n(value)) return emptyI18n();
  return { fr: value.fr ?? '', en: typeof value.en === 'string' ? value.en : '' };
}

/** Form value → database value: trimmed; English dropped when empty. */
export function fromI18nForm(value: I18nForm): I18nText {
  const fr = value.fr.trim();
  const en = value.en.trim();
  return en ? { fr, en } : { fr };
}

/** True when the English version is missing or blank. */
export function missingEnglish(value: unknown): boolean {
  if (!isI18n(value)) return false;
  return !value.en || !value.en.trim();
}

/** French text for display in lists (falls back to an em dash). */
export function frText(value: unknown): string {
  return isI18n(value) && value.fr.trim() ? value.fr : '—';
}
