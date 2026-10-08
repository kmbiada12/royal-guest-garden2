import { useState } from 'react';
import { imagePreviewUrl, isAcceptableImage } from '@/lib/images';
import { UploadButton } from './ImageInput';

interface Props {
  label: string;
  hint?: string;
  value: string[];
  onChange: (value: string[]) => void;
  folder: string;
  error?: string;
}

/** Ordered photo gallery: the first image is the cover. */
export function ImageListInput({ label, hint, value, onChange, folder, error }: Props) {
  const [draft, setDraft] = useState('');
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const copy = value.slice();
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };
  const addDraft = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft('');
  };

  return (
    <fieldset className={`field${error ? ' field--error' : ''}`}>
      <legend className="field__label">
        {label} <span className="muted">({value.length})</span>
      </legend>
      <ul className="gallery-input">
        {value.map((src, index) => (
          <li key={`${src}-${index}`} className={`gallery-input__item${isAcceptableImage(src) ? '' : ' is-invalid'}`}>
            <img src={imagePreviewUrl(src, 320)} alt="" loading="lazy" />
            {index === 0 && <span className="badge badge--gold gallery-input__cover">Couverture</span>}
            <span className="gallery-input__path" title={src}>
              {src.split('/').pop()}
            </span>
            <div className="gallery-input__actions">
              <button type="button" className="icon-btn" aria-label="Avancer" onClick={() => move(index, -1)} disabled={index === 0}>←</button>
              <button type="button" className="icon-btn" aria-label="Reculer" onClick={() => move(index, 1)} disabled={index === value.length - 1}>→</button>
              <button type="button" className="icon-btn icon-btn--danger" aria-label="Retirer la photo" onClick={() => onChange(value.filter((_, i) => i !== index))}>✕</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="row">
        <input
          value={draft}
          placeholder="Ajouter par chemin img/… ou https://…"
          aria-label="Chemin de l’image à ajouter"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addDraft();
            }
          }}
        />
        <button type="button" className="btn btn--small" onClick={addDraft}>
          Ajouter
        </button>
        <UploadButton folder={folder} multiple label="Envoyer des photos" onUploaded={(url) => onChange([...value, url])} />
      </div>
      {error ? <span className="field__error">{error}</span> : hint && <span className="field__hint">{hint}</span>}
    </fieldset>
  );
}
