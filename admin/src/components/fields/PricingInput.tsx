import { emptyI18n, type I18nForm } from '@/lib/i18n';
import { I18nInput } from './I18nInput';

export interface PricingForm {
  included: 'true' | 'false' | 'partial';
  note: I18nForm;
  items: { label: I18nForm; price: string }[];
  quoteOnly: boolean;
}

interface Props {
  label: string;
  value: PricingForm;
  onChange: (value: PricingForm) => void;
  error?: string;
}

/** Service pricing: inclusion, note, price lines, quote-only flag. */
export function PricingInput({ label, value, onChange, error }: Props) {
  const setItem = (index: number, patch: Partial<PricingForm['items'][number]>) =>
    onChange({ ...value, items: value.items.map((it, i) => (i === index ? { ...it, ...patch } : it)) });

  return (
    <fieldset className={`field${error ? ' field--error' : ''}`}>
      <legend className="field__label">{label}</legend>
      <div className="row">
        <label className="field field--inline">
          <span className="field__label">Inclus dans le tarif de la chambre</span>
          <select value={value.included} onChange={(e) => onChange({ ...value, included: e.target.value as PricingForm['included'] })}>
            <option value="true">Oui</option>
            <option value="partial">En partie</option>
            <option value="false">Non</option>
          </select>
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={value.quoteOnly} onChange={(e) => onChange({ ...value, quoteOnly: e.target.checked })} />
          Sur devis uniquement
        </label>
      </div>
      <I18nInput id="pricing-note" label="Note tarifaire" multiline rows={2} value={value.note} onChange={(note) => onChange({ ...value, note })} />
      <table className="table table--compact">
        <thead>
          <tr>
            <th>Libellé (FR / EN)</th>
            <th style={{ width: '9rem' }}>Prix (FCFA)</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {value.items.map((item, index) => (
            <tr key={index}>
              <td>
                <div className="i18n-grid">
                  <input aria-label={`Libellé ${index + 1} (français)`} value={item.label.fr} onChange={(e) => setItem(index, { label: { ...item.label, fr: e.target.value } })} />
                  <input aria-label={`Libellé ${index + 1} (anglais)`} placeholder="English" value={item.label.en} onChange={(e) => setItem(index, { label: { ...item.label, en: e.target.value } })} />
                </div>
              </td>
              <td>
                <input inputMode="numeric" aria-label={`Prix ${index + 1}`} value={item.price} onChange={(e) => setItem(index, { price: e.target.value.replace(/[^\d]/g, '') })} />
              </td>
              <td>
                <button type="button" className="icon-btn icon-btn--danger" aria-label="Supprimer la ligne" onClick={() => onChange({ ...value, items: value.items.filter((_, i) => i !== index) })}>
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn--small" onClick={() => onChange({ ...value, items: [...value.items, { label: emptyI18n(), price: '' }] })}>
        + Ajouter un tarif
      </button>
      {error && <span className="field__error">{error}</span>}
    </fieldset>
  );
}
