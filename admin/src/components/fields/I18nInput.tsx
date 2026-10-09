import type { I18nForm } from '@/lib/i18n';

interface Props {
  id: string;
  label: string;
  hint?: string;
  value: I18nForm;
  onChange: (value: I18nForm) => void;
  multiline?: boolean;
  rows?: number;
  error?: string;
}

/** French and English side by side; flags a missing English translation. */
export function I18nInput({ id, label, hint, value, onChange, multiline, rows = 4, error }: Props) {
  const missingEn = value.fr.trim() !== '' && value.en.trim() === '';
  const Control = multiline ? 'textarea' : 'input';
  return (
    <fieldset className={`field field--i18n${error ? ' field--error' : ''}`}>
      <legend className="field__label">
        {label}
        {missingEn && <span className="badge badge--warn">traduction anglaise manquante</span>}
      </legend>
      <div className="i18n-grid">
        <label className="i18n-grid__col">
          <span className="lang-tag">FR</span>
          <Control
            id={`${id}-fr`}
            aria-label={`${label} (français)`}
            value={value.fr}
            rows={multiline ? rows : undefined}
            onChange={(e) => onChange({ ...value, fr: e.target.value })}
          />
        </label>
        <label className="i18n-grid__col">
          <span className="lang-tag lang-tag--en">EN</span>
          <Control
            id={`${id}-en`}
            aria-label={`${label} (anglais)`}
            value={value.en}
            rows={multiline ? rows : undefined}
            placeholder={value.fr ? 'English version…' : ''}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
          />
        </label>
      </div>
      {error ? <span className="field__error">{error}</span> : hint && <span className="field__hint">{hint}</span>}
    </fieldset>
  );
}
