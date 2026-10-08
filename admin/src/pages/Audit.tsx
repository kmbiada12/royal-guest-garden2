import { Fragment, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { friendlyError } from '@/lib/errors';
import { formatDateTime } from '@/lib/format';
import { staffApi } from '@/lib/staffApi';
import { Badge, ErrorNotice, Loading, PageHeader } from '@/components/ui';

const PAGE = 50;
const TABLE_LABELS: Record<string, string> = {
  settings: 'Réglages',
  rooms: 'Chambres',
  room_categories: 'Catégories',
  amenities: 'Équipements',
  services: 'Services',
  benefit_groups: 'Avantages (groupes)',
  benefits: 'Avantages',
  testimonials: 'Témoignages',
  hotel_values: 'Valeurs',
  guest_experiences: 'Expériences',
  team_members: 'Équipe',
  gallery_items: 'Galerie',
  booking_requests: 'Réservations',
  enquiries: 'Messages',
  leads: 'Prospects',
  staff: 'Personnel'
};
const ACTION: Record<string, { label: string; tone: 'ok' | 'gold' | 'danger' }> = {
  insert: { label: 'création', tone: 'ok' },
  update: { label: 'modification', tone: 'gold' },
  delete: { label: 'suppression', tone: 'danger' }
};

interface AuditRow {
  id: number;
  actor_user_id: string | null;
  table_name: string;
  record_id: string;
  action: string;
  diff: unknown;
  created_at: string;
}

export default function Audit() {
  const [table, setTable] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ['audit', table, limit],
    queryFn: async () => {
      let q = supabase.from('audit_log').select('*', { count: 'exact' }).order('created_at', { ascending: false }).order('id', { ascending: false }).limit(limit);
      if (table) q = q.eq('table_name', table);
      const { data, error, count } = await q;
      if (error) throw error;
      return { rows: (data ?? []) as AuditRow[], count: count ?? 0 };
    }
  });
  const staff = useQuery({ queryKey: ['staff'], queryFn: staffApi.list });
  const who = useMemo(() => new Map((staff.data ?? []).map((m) => [m.userId, m.email])), [staff.data]);

  const rows = query.data?.rows ?? [];
  return (
    <div className="page">
      <PageHeader
        title="Journal d’audit"
        subtitle="Qui a modifié quoi. Pour les demandes des clients, seuls les noms des champs modifiés sont conservés. Rétention : 24 mois."
      />
      <div className="toolbar">
        <select aria-label="Filtrer par rubrique" value={table} onChange={(e) => { setTable(e.target.value); setLimit(PAGE); }}>
          <option value="">Toutes les rubriques</option>
          {Object.entries(TABLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="muted">{query.data?.count ?? 0} entrée(s)</span>
      </div>
      <ErrorNotice error={query.error ? friendlyError(query.error) : null} />
      {query.isLoading ? (
        <Loading />
      ) : (
        <div className="table-wrap">
          <table className="table table--compact">
            <thead>
              <tr>
                <th>Date</th>
                <th>Auteur</th>
                <th>Rubrique</th>
                <th>Action</th>
                <th>Élément</th>
                <th aria-label="Détail" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Fragment key={r.id}>
                  <tr>
                    <td>{formatDateTime(r.created_at)}</td>
                    <td>{r.actor_user_id ? who.get(r.actor_user_id) ?? r.actor_user_id.slice(0, 8) : <span className="muted">système / site</span>}</td>
                    <td>{TABLE_LABELS[r.table_name] ?? r.table_name}</td>
                    <td>
                      <Badge tone={ACTION[r.action]?.tone ?? 'gold'}>{ACTION[r.action]?.label ?? r.action}</Badge>
                    </td>
                    <td className="mono">{r.record_id}</td>
                    <td>
                      <button type="button" className="btn btn--small btn--ghost" aria-expanded={open === r.id} onClick={() => setOpen(open === r.id ? null : r.id)}>
                        {open === r.id ? 'Masquer' : 'Détail'}
                      </button>
                    </td>
                  </tr>
                  {open === r.id && (
                    <tr key={`${r.id}-diff`} className="diff-row">
                      <td colSpan={6}>
                        <pre className="json">{JSON.stringify(r.diff, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows.length < (query.data?.count ?? 0) && (
        <button type="button" className="btn" onClick={() => setLimit((l) => l + PAGE)}>
          Afficher plus
        </button>
      )}
    </div>
  );
}
