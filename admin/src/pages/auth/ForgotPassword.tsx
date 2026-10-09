import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';
import { friendlyError } from '@/lib/errors';
import { AuthCard } from './AuthCard';
import { ErrorNotice, Spinner } from '@/components/ui';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}${env.baseUrl}mot-de-passe`
    });
    setBusy(false);
    // Same message whether or not the address exists (no account probing).
    if (resetError && !/rate limit/i.test(resetError.message)) setError(friendlyError(resetError));
    else if (resetError) setError('Trop de demandes : réessayez dans quelques minutes.');
    else setSent(true);
  }

  return (
    <AuthCard title="Mot de passe oublié" subtitle="Recevez un lien pour choisir un nouveau mot de passe.">
      {sent ? (
        <div className="stack">
          <div className="notice notice--ok">
            Si cette adresse correspond à un compte, un e-mail vient d’être envoyé. Le lien est valable une heure.
          </div>
          <Link to="/connexion">Retour à la connexion</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="stack">
          <ErrorNotice error={error} />
          <label className="field">
            <span className="field__label">Adresse e-mail</span>
            <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button className="btn btn--primary btn--block" disabled={busy}>
            {busy && <Spinner />} Envoyer le lien
          </button>
          <p className="center small">
            <Link to="/connexion">Retour à la connexion</Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}
