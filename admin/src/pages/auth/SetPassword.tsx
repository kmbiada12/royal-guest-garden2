import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { friendlyError } from '@/lib/errors';
import { passwordProblem } from '@/lib/format';
import { useAuth } from '@/auth/AuthProvider';
import { AuthCard } from './AuthCard';
import { ErrorNotice, Loading, Spinner } from '@/components/ui';

/**
 * Target of the invitation and password-reset e-mails: the link signs the
 * person in (token in the URL, handled by supabase-js), then they choose a
 * password here.
 */
export default function SetPassword() {
  const { session, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <AuthCard title="Nouveau mot de passe"><Loading label="Vérification du lien…" /></AuthCard>;

  if (!session) {
    return (
      <AuthCard title="Lien invalide ou expiré">
        <p>Demandez un nouveau lien depuis la page « Mot de passe oublié ».</p>
        <Link to="/mot-de-passe-oublie">Recevoir un nouveau lien</Link>
      </AuthCard>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== confirm) return setError('Les deux mots de passe ne correspondent pas.');
    setBusy(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) return setError(friendlyError(updateError));
    await refresh();
    navigate('/', { replace: true });
  }

  return (
    <AuthCard title="Choisir un mot de passe" subtitle={session.user.email}>
      <form onSubmit={onSubmit} className="stack">
        <ErrorNotice error={error} />
        <label className="field">
          <span className="field__label">Nouveau mot de passe</span>
          <input type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="field__hint">12 caractères minimum, avec minuscules, majuscules et chiffres.</span>
        </label>
        <label className="field">
          <span className="field__label">Confirmer</span>
          <input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <button className="btn btn--primary btn--block" disabled={busy}>
          {busy && <Spinner />} Enregistrer
        </button>
      </form>
    </AuthCard>
  );
}
