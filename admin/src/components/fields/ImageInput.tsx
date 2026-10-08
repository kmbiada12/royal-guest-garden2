import { useRef, useState } from 'react';
import { imagePreviewUrl, isAcceptableImage, uploadImage, ACCEPTED_TYPES } from '@/lib/images';
import { friendlyError } from '@/lib/errors';
import { Spinner } from '@/components/ui';

interface UploadButtonProps {
  folder: string;
  onUploaded: (url: string) => void;
  multiple?: boolean;
  label?: string;
}

export function UploadButton({ folder, onUploaded, multiple, label = 'Envoyer une image' }: UploadButtonProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) onUploaded(await uploadImage(file, folder));
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <span className="upload">
      <input
        ref={input}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple={multiple}
        hidden
        onChange={(e) => void onFiles(e.target.files)}
      />
      <button type="button" className="btn btn--small" disabled={busy} onClick={() => input.current?.click()}>
        {busy ? <Spinner /> : '⬆'} {label}
      </button>
      {error && <span className="field__error">{error}</span>}
    </span>
  );
}

interface Props {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  error?: string;
}

/** One image: path (img/…) or URL, upload button, preview. */
export function ImageInput({ id, label, hint, value, onChange, folder, error }: Props) {
  const invalid = value !== '' && !isAcceptableImage(value);
  return (
    <div className={`field${error || invalid ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="image-input">
        {value && isAcceptableImage(value) ? (
          <img className="thumb thumb--lg" src={imagePreviewUrl(value, 400)} alt="" />
        ) : (
          <span className="thumb thumb--lg thumb--empty">aucune</span>
        )}
        <div className="image-input__controls">
          <input id={id} value={value} placeholder="img/… ou https://…" onChange={(e) => onChange(e.target.value.trim())} />
          <UploadButton folder={folder} onUploaded={onChange} />
        </div>
      </div>
      {error || invalid ? (
        <span className="field__error">{error ?? 'Chemin img/… ou adresse https:// attendu.'}</span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
}
