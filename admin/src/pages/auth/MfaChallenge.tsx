import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { friendlyError } from '@/lib/errors';
import { useAuth } from '@/auth/AuthProvider';
import { AuthCard } from './AuthCard';
import { ErrorNotice, Spinner } from '@/components/ui';

export default function MfaChallenge() {
  const { session, needsSecondFactor, loading, refresh, signOut } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && !session) return <Navigate to="/connexion" replace />;
  if (!loading && session && !needsSecondFactor) return <Navigate to={from} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp.find((f) => f.status === 'verified');
    if (listError || !factor) {
      setError(friendlyError(listError ?? 'Aucune application d’authentification enregistrée.'));
      setBusy(false);
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.trim() });
    if (verifyError) {
      setError(friendlyError(verifyError));
      setBusy(false);
      return;
    }
    await refresh();
    navigate(from, { replace: true });
  }

  return (
    <AuthCard title="Double authentification" subtitle="Saisissez le code à 6 chiffres de votre application.">
      <form onSubmit={onSubmit} className="stack">
        <ErrorNotice error={error} />
        <label className="field">
          <span className="field__label">Code</span>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
        </label>
        <button className="btn btn--primary btn--block" disabled={busy || code.length !== 6}>
          {busy && <Spinner />} Valider
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={() => void signOut()}>
          Annuler et se déconnecter
        </button>
      </form>
    </AuthCard>
  );
}
