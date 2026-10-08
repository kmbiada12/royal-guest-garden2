import { useEffect, useState } from 'react';

/**
 * Two-step destructive button (no browser dialog): first click arms it,
 * second click within 5 s confirms.
 */
export function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  disabled
}: {
  label: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 5000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      type="button"
      className={`btn btn--small ${armed ? 'btn--danger' : 'btn--ghost-danger'}`}
      disabled={disabled}
      onClick={() => {
        if (!armed) return setArmed(true);
        setArmed(false);
        void onConfirm();
      }}
    >
      {armed ? confirmLabel : label}
    </button>
  );
}
