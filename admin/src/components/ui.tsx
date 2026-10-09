import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

export function FullPageMessage({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="full-page">
      <div className="full-page__card">
        {title && <h1>{title}</h1>}
        <div className="full-page__body">{children}</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

export function ErrorNotice({ error }: { error: string | null | undefined }) {
  if (!error) return null;
  return (
    <div className="notice notice--error" role="alert">
      {error}
    </div>
  );
}

export function Loading({ label = 'Chargement…' }: { label?: string }) {
  return (
    <p className="loading">
      <Spinner /> {label}
    </p>
  );
}

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'ok' | 'warn' | 'danger' | 'gold'; children: ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

/* ---------------------------------------------------------------------
   Toasts (save confirmations)
   --------------------------------------------------------------------- */
interface Toast {
  id: number;
  text: string;
  tone: 'ok' | 'error';
}
const ToastContext = createContext<(text: string, tone?: 'ok' | 'error') => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: 'ok' | 'error' = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, text, tone }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
