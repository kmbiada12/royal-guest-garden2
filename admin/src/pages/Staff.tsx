import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffApi, type StaffRole } from '@/lib/staffApi';
import { friendlyError } from '@/lib/errors';
import { formatDateTime } from '@/lib/format';
import { Badge, ErrorNotice, Loading, PageHeader, Spinner, useToast } from '@/components/ui';
import { ConfirmButton } from '@/components/ConfirmButton';

const ROLE_LABEL: Record<StaffRole, string> = { admin: 'Administrateur', editor: 'Éditeur' };

export default function Staff() {
  const qc = useQueryClient();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('editor');

  const query = useQuery({ queryKey: ['staff'], queryFn: staffApi.list });
  const refresh = () => qc.invalidateQueries({ queryKey: ['staff'] });

  const invite = useMutation({ mutationFn: () => staffApi.invite(email.trim(), role), onSuccess: refresh });
  const setRoleMutation = useMutation({
    mutationFn: ({ userId, next }: { userId: string; next: StaffRole }) => staffApi.setRole(userId, next),
    onSuccess: refresh
  });
  const remove = useMutation({ mutationFn: (userId: string) => staffApi.remove(userId), onSuccess: refresh });

  const run = async (fn: () => Promise<unknown>, done: string) => {
    setError(null);
    try {
      await fn();
      toast(done);
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  async function onInvite(e: FormEvent) {
    e.preventDefault();
    await run(async () => {
      const res = await invite.mutateAsync();
      setEmail('');
      return res;
    }, 'Invitation envoyée par e-mail.');
  }

  return (
    <div className="page">
      <PageHeader
        title="Personnel"
        subtitle="Éditeur : contenu du site. Administrateur : tout (réglages, demandes des clients, personnel, journal)."
      />
      <ErrorNotice error={error ?? (query.error ? friendlyError(query.error) : null)} />

      <form className="card row row--wrap" onSubmit={onInvite}>
        <label className="field field--grow">
          <span className="field__label">Inviter par e-mail</span>
          <input type="email" required placeholder="prenom.nom@exemple.cm" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field field--inline">
          <span className="field__label">Rôle</span>
          <select value={role} onChange={(e) => setRole(e.target.value as StaffRole)}>
            <option value="editor">Éditeur</option>
            <option value="admin">Administrateur</option>
          </select>
        </label>
        <button className="btn btn--primary" disabled={invite.isPending}>
          {invite.isPending && <Spinner />} Envoyer l’invitation
        </button>
        <p className="field__hint field--full">
          La personne reçoit un lien pour choisir son mot de passe (en local : boîte Mailpit, http://127.0.0.1:54324).
        </p>
      </form>

      {query.isLoading ? (
        <Loading />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Compte</th>
                <th>Rôle</th>
                <th>Sécurité</th>
                <th>Dernière connexion</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {(query.data ?? []).map((m) => (
                <tr key={m.userId}>
                  <td>
                    <strong>{m.email}</strong> {m.isMe && <Badge tone="gold">vous</Badge>}
                    {m.invitedBy && <div className="muted small">invité par {m.invitedBy}</div>}
                  </td>
                  <td>
                    <select
                      aria-label={`Rôle de ${m.email}`}
                      value={m.role}
                      disabled={setRoleMutation.isPending}
                      onChange={(e) =>
                        void run(() => setRoleMutation.mutateAsync({ userId: m.userId, next: e.target.value as StaffRole }), 'Rôle modifié.')
                      }
                    >
                      <option value="editor">{ROLE_LABEL.editor}</option>
                      <option value="admin">{ROLE_LABEL.admin}</option>
                    </select>
                  </td>
                  <td className="badges">
                    {m.confirmed ? <Badge tone="ok">compte activé</Badge> : <Badge tone="warn">invitation en attente</Badge>}
                    {m.twoFactor ? <Badge tone="ok">double authentification</Badge> : <Badge>sans double authentification</Badge>}
                  </td>
                  <td>{formatDateTime(m.lastSignInAt)}</td>
                  <td className="actions">
                    {!m.isMe && (
                      <ConfirmButton
                        label="Retirer l’accès"
                        confirmLabel="Confirmer (supprime le compte)"
                        onConfirm={() => run(() => remove.mutateAsync(m.userId), 'Accès retiré.')}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
