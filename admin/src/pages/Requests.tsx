import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { friendlyError } from '@/lib/errors';
import { formatDate, formatDateTime, formatXaf, whatsappLink } from '@/lib/format';
import { Badge, ErrorNotice, Loading, PageHeader, useToast } from '@/components/ui';
import { ConfirmButton } from '@/components/ConfirmButton';

type RequestTable = 'booking_requests' | 'enquiries' | 'leads';
type AnyRow = Record<string, unknown> & { id: string; status: string; created_at: string };

interface KindDef {
  table: RequestTable;
  title: string;
  description: string;
  statuses: { value: string; label: string; tone: 'warn' | 'ok' | 'neutral' | 'danger' | 'gold' }[];
  name: (r: AnyRow) => string;
  phone: (r: AnyRow) => string;
  summary: (r: AnyRow) => string;
  details: (r: AnyRow) => [string, string][];
  notes?: boolean;
}

const KINDS: Record<string, KindDef> = {
  reservations: {
    table: 'booking_requests',
    title: 'Demandes de réservation',
    description: 'Enregistrées depuis le site. Une demande n’est pas une réservation confirmée.',
    statuses: [
      { value: 'new', label: 'Nouvelle', tone: 'warn' },
      { value: 'contacted', label: 'Contactée', tone: 'gold' },
      { value: 'confirmed', label: 'Confirmée', tone: 'ok' },
      { value: 'declined', label: 'Refusée', tone: 'danger' },
      { value: 'cancelled', label: 'Annulée', tone: 'neutral' }
    ],
    name: (r) => String(r.guest_name),
    phone: (r) => String(r.guest_phone),
    summary: (r) =>
      `${String(r.reference)} · ${(r.room_snapshot as { name?: string } | null)?.name ?? r.room_id ?? 'chambre supprimée'} · ${formatDate(r.check_in as string)} → ${formatDate(r.check_out as string)}`,
    details: (r) => [
      ['Référence', String(r.reference)],
      ['Séjour', `${formatDate(r.check_in as string)} → ${formatDate(r.check_out as string)} (${r.nights} nuit(s))`],
      ['Personnes', `${r.adults} adulte(s), ${r.children} enfant(s) · ${r.rooms} chambre(s)`],
      ['Estimation', `${formatXaf(r.estimated_total as number)} (${formatXaf(r.nightly_rate as number)} / nuit, hors taxes et extras)`],
      ['Langue', String(r.guest_lang).toUpperCase()],
      ['Demandes particulières', String(r.special_requests ?? '—')],
      ['Message envoyé', String(r.message)]
    ],
    notes: true
  },
  messages: {
    table: 'enquiries',
    title: 'Messages de contact',
    description: 'Messages envoyés depuis le formulaire de contact.',
    statuses: [
      { value: 'new', label: 'Nouveau', tone: 'warn' },
      { value: 'contacted', label: 'Répondu', tone: 'gold' },
      { value: 'closed', label: 'Clos', tone: 'neutral' }
    ],
    name: (r) => String(r.name),
    phone: (r) => String(r.phone),
    summary: (r) => String(r.subject),
    details: (r) => [
      ['Objet', String(r.subject)],
      ['E-mail', String(r.email ?? '—')],
      ['Langue', String(r.guest_lang).toUpperCase()],
      ['Message', String(r.message)]
    ]
  },
  prospects: {
    table: 'leads',
    title: 'Prospects (assistant)',
    description: 'Contacts laissés avant une conversation avec l’assistant du site.',
    statuses: [
      { value: 'new', label: 'Nouveau', tone: 'warn' },
      { value: 'contacted', label: 'Rappelé', tone: 'gold' },
      { value: 'closed', label: 'Clos', tone: 'neutral' }
    ],
    name: (r) => String(r.name),
    phone: (r) => String(r.phone),
    summary: (r) => String(r.question ?? 'sans question'),
    details: (r) => [
      ['Question', String(r.question ?? '—')],
      ['Source', String(r.source)],
      ['Langue', String(r.guest_lang).toUpperCase()]
    ]
  }
};

const PAGE = 50;

export default function Requests() {
  const { kind } = useParams();
  const def = KINDS[kind ?? ''];
  if (!def) return <div className="page"><ErrorNotice error="Rubrique inconnue." /></div>;
  return <RequestList key={kind} def={def} />;
}

function RequestList({ def }: { def: KindDef }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [status, setStatus] = useState<string>('');
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const key = ['requests', def.table, status, limit];

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      let q = supabase.from(def.table).select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(limit);
      if (status) q = q.eq('status', status);
      const { data, error: e, count } = await q;
      if (e) throw e;
      return { rows: (data ?? []) as unknown as AnyRow[], count: count ?? 0 };
    }
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error: e } = await supabase.from(def.table).update(patch as never).eq('id', id);
      if (e) throw e;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests', def.table] })
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error: e } = await supabase.from(def.table).delete().eq('id', id);
      if (e) throw e;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['requests', def.table] })
  });

  const run = async (fn: () => Promise<unknown>, done: string) => {
    setError(null);
    try {
      await fn();
      toast(done);
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  const rows = query.data?.rows ?? [];
  const statusOf = (value: string) => def.statuses.find((s) => s.value === value);

  return (
    <div className="page">
      <PageHeader title={def.title} subtitle={def.description} />
      <div className="toolbar">
        <select aria-label="Filtrer par statut" value={status} onChange={(e) => { setStatus(e.target.value); setLimit(PAGE); }}>
          <option value="">Tous les statuts</option>
          {def.statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="muted">{query.data?.count ?? 0} au total</span>
      </div>
      <ErrorNotice error={error ?? (query.error ? friendlyError(query.error) : null)} />
      {query.isLoading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <p className="empty">
          Aucune demande pour le moment. Elles apparaîtront ici dès que les formulaires du site les enregistreront.
        </p>
      ) : (
        <ul className="request-list">
          {rows.map((r) => {
            const st = statusOf(r.status);
            const isOpen = open === r.id;
            return (
              <li key={r.id} className={`request${isOpen ? ' is-open' : ''}`}>
                <button type="button" className="request__head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r.id)}>
                  <Badge tone={st?.tone ?? 'neutral'}>{st?.label ?? r.status}</Badge>
                  <strong>{def.name(r)}</strong>
                  <span className="request__summary">{def.summary(r)}</span>
                  <span className="muted">{formatDateTime(r.created_at)}</span>
                </button>
                {isOpen && (
                  <div className="request__body">
                    <dl className="details">
                      <dt>Téléphone</dt>
                      <dd>
                        {def.phone(r)}{' '}
                        <a href={whatsappLink(def.phone(r))} target="_blank" rel="noreferrer">
                          Écrire sur WhatsApp ↗
                        </a>
                      </dd>
                      {def.details(r).map(([k, v]) => (
                        <div key={k} className="details__row">
                          <dt>{k}</dt>
                          <dd className="pre">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="row">
                      <label className="field field--inline">
                        <span className="field__label">Statut</span>
                        <select
                          value={r.status}
                          onChange={(e) => void run(() => update.mutateAsync({ id: r.id, patch: { status: e.target.value } }), 'Statut mis à jour.')}
                        >
                          {def.statuses.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <span className="form__footer-end">
                        <ConfirmButton
                          label="Supprimer ces données"
                          confirmLabel="Confirmer (définitif)"
                          onConfirm={() => run(() => remove.mutateAsync(r.id), 'Données supprimées.')}
                        />
                      </span>
                    </div>
                    {def.notes && (
                      <NotesEditor
                        initial={String(r.internal_notes ?? '')}
                        onSave={(notes) => run(() => update.mutateAsync({ id: r.id, patch: { internal_notes: notes || null } }), 'Notes enregistrées.')}
                      />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {rows.length < (query.data?.count ?? 0) && (
        <button type="button" className="btn" onClick={() => setLimit((l) => l + PAGE)}>
          Afficher plus
        </button>
      )}
    </div>
  );
}

function NotesEditor({ initial, onSave }: { initial: string; onSave: (notes: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <label className="field">
      <span className="field__label">Notes internes (jamais visibles par le client)</span>
      <textarea rows={3} maxLength={5000} value={value} onChange={(e) => setValue(e.target.value)} />
      <span>
        <button type="button" className="btn btn--small" disabled={value === initial} onClick={() => onSave(value.trim())}>
          Enregistrer les notes
        </button>
      </span>
    </label>
  );
}
