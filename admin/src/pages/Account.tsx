import { useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { friendlyError } from '@/lib/errors';
import { passwordProblem } from '@/lib/format';
import { useAuth } from '@/auth/AuthProvider';
import { Badge, ErrorNotice, Loading, PageHeader, Spinner, useToast } from '@/components/ui';
import { ConfirmButton } from '@/components/ConfirmButton';

export default function Account() {
  const { session, role } = useAuth();
  return (
    <div className="page page--form">
      <PageHeader title="Mon compte" subtitle={`${session?.user.email ?? ''} · ${role === 'admin' ? 'Administrateur' : 'Éditeur'}`} />
      <ChangePassword />
      <TwoFactor />
    </div>
  );
}

function ChangePassword() {
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setPassword('');
    setConfirm('');
    toast('Mot de passe modifié.');
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <h2>Mot de passe</h2>
      <ErrorNotice error={error} />
      <div className="grid-2">
        <label className="field">
          <span className="field__label">Nouveau mot de passe</span>
          <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="field__hint">12 caractères minimum, avec minuscules, majuscules et chiffres.</span>
        </label>
        <label className="field">
          <span className="field__label">Confirmer</span>
          <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
      </div>
      <span>
        <button className="btn btn--primary" disabled={busy || !password}>
          {busy && <Spinner />} Changer le mot de passe
        </button>
      </span>
    </form>
  );
}

interface Enrollment {
  factorId: string;
  qr: string;
  secret: string;
}

function TwoFactor() {
  const qc = useQueryClient();
  const toast = useToast();
  const { refresh } = useAuth();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const factors = useQuery({
    queryKey: ['mfa-factors'],
    queryFn: async () => {
      const { data, error: e } = await supabase.auth.mfa.listFactors();
      if (e) throw e;
      return data.totp;
    }
  });
  const verified = (factors.data ?? []).filter((f) => f.status === 'verified');

  async function start() {
    setBusy(true);
    setError(null);
    // Drop unfinished attempts first (only one pending TOTP factor is allowed).
    const { data: all } = await supabase.auth.mfa.listFactors();
    for (const f of all?.all ?? []) {
      if (f.status === 'unverified') await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error: e } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: `RGG ${new Date().toISOString().slice(0, 10)}` });
    setBusy(false);
    if (e || !data) return setError(friendlyError(e));
    setEnrollment({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    if (!enrollment) return;
    setBusy(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollment.factorId, code: code.trim() });
    setBusy(false);
    if (verifyError) return setError(friendlyError(verifyError));
    setEnrollment(null);
    setCode('');
    await qc.invalidateQueries({ queryKey: ['mfa-factors'] });
    await refresh();
    toast('Double authentification activée.');
  }

  async function disable(factorId: string) {
    setError(null);
    const { error: e } = await supabase.auth.mfa.unenroll({ factorId });
    if (e) return setError(friendlyError(e));
    await qc.invalidateQueries({ queryKey: ['mfa-factors'] });
    await supabase.auth.refreshSession();
    await refresh();
    toast('Double authentification désactivée.');
  }

  return (
    <section className="card stack">
      <h2>Double authentification</h2>
      <p className="muted">
        Une application (Google Authenticator, Microsoft Authenticator, Aegis…) donne un code à 6 chiffres demandé à chaque connexion.
        Recommandé pour les administrateurs.
      </p>
      <ErrorNotice error={error} />
      {factors.isLoading ? (
        <Loading />
      ) : verified.length > 0 ? (
        <div className="row">
          <Badge tone="ok">activée</Badge>
          <ConfirmButton label="Désactiver" confirmLabel="Confirmer la désactivation" onConfirm={() => disable(verified[0].id)} />
        </div>
      ) : enrollment ? (
        <form className="stack" onSubmit={verify}>
          <p>1. Scannez ce code avec l’application :</p>
          <img className="qr" src={enrollment.qr} alt="QR code de configuration" width={180} height={180} />
          <p className="small">
            Ou saisissez la clé : <code className="mono">{enrollment.secret}</code>
          </p>
          <label className="field">
            <span className="field__label">2. Code affiché par l’application</span>
            <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
          </label>
          <span>
            <button className="btn btn--primary" disabled={busy || code.length !== 6}>
              {busy && <Spinner />} Activer
            </button>
          </span>
        </form>
      ) : (
        <span>
          <Badge>désactivée</Badge>{' '}
          <button type="button" className="btn" disabled={busy} onClick={() => void start()}>
            {busy && <Spinner />} Configurer
          </button>
        </span>
      )}
    </section>
  );
}
