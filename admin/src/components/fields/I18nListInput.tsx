import { emptyI18n, type I18nForm } from '@/lib/i18n';

interface Props {
  label: string;
  hint?: string;
  value: I18nForm[];
  onChange: (value: I18nForm[]) => void;
  error?: string;
  addLabel?: string;
}

/** Ordered list of bilingual lines (service details, policies…). */
export function I18nListInput({ label, hint, value, onChange, error, addLabel = 'Ajouter une ligne' }: Props) {
  const update = (index: number, next: I18nForm) => onChange(value.map((v, i) => (i === index ? next : v)));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const copy = value.slice();
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };
  return (
    <fieldset className={`field${error ? ' field--error' : ''}`}>
      <legend className="field__label">{label}</legend>
      <ol className="line-list">
        {value.map((line, index) => (
          <li key={index} className="line-list__item">
            <div className="i18n-grid">
              <label className="i18n-grid__col">
                <span className="lang-tag">FR</span>
                <textarea rows={2} aria-label={`${label} ${index + 1} (français)`} value={line.fr} onChange={(e) => update(index, { ...line, fr: e.target.value })} />
              </label>
              <label className="i18n-grid__col">
                <span className="lang-tag lang-tag--en">EN</span>
                <textarea rows={2} aria-label={`${label} ${index + 1} (anglais)`} value={line.en} onChange={(e) => update(index, { ...line, en: e.target.value })} />
              </label>
            </div>
            <div className="line-list__actions">
              <button type="button" className="icon-btn" title="Monter" aria-label="Monter" onClick={() => move(index, -1)} disabled={index === 0}>↑</button>
              <button type="button" className="icon-btn" title="Descendre" aria-label="Descendre" onClick={() => move(index, 1)} disabled={index === value.length - 1}>↓</button>
              <button type="button" className="icon-btn icon-btn--danger" title="Supprimer" aria-label="Supprimer la ligne" onClick={() => onChange(value.filter((_, i) => i !== index))}>✕</button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn--small" onClick={() => onChange([...value, emptyI18n()])}>
        + {addLabel}
      </button>
      {error ? <span className="field__error">{error}</span> : hint && <span className="field__hint">{hint}</span>}
    </fieldset>
  );
}
