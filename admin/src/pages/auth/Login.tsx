import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { friendlyError } from '@/lib/errors';
import { useAuth } from '@/auth/AuthProvider';
import { AuthCard } from './AuthCard';
import { ErrorNotice, Spinner } from '@/components/ui';

export default function Login() {
  const { session, role, needsSecondFactor, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && session && needsSecondFactor) return <Navigate to="/connexion/code" replace state={{ from }} />;
  if (!loading && session && role) return <Navigate to={from} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setError(friendlyError(signInError));
      setBusy(false);
      return;
    }
    await refresh();
    setBusy(false);
    navigate(from, { replace: true });
  }

  return (
    <AuthCard title="Connexion" subtitle="Back-office du Royal Guest Garden">
      <form onSubmit={onSubmit} className="stack">
        <ErrorNotice error={error} />
        {session && !role && !loading && (
          <div className="notice notice--error">Ce compte ne fait pas partie du personnel.</div>
        )}
        <label className="field">
          <span className="field__label">Adresse e-mail</span>
          <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="btn btn--primary btn--block" disabled={busy}>
          {busy && <Spinner />} Se connecter
        </button>
        <p className="center small">
          <Link to="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
        </p>
      </form>
    </AuthCard>
  );
}
