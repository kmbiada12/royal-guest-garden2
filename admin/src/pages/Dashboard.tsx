import { Link } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';
import { useAuth } from '@/auth/AuthProvider';
import { COLLECTIONS } from '@/content/collections';
import { missingTranslations } from '@/content/convert';
import { contentKey } from '@/content/queries';
import { Badge, PageHeader } from '@/components/ui';

const REQUESTS = [
  { table: 'booking_requests', kind: 'reservations', label: 'Réservations' },
  { table: 'enquiries', kind: 'messages', label: 'Messages' },
  { table: 'leads', kind: 'prospects', label: 'Prospects' }
] as const;

export default function Dashboard() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const content = useQueries({
    queries: COLLECTIONS.map((c) => ({
      queryKey: contentKey(c.table),
      queryFn: async () => {
        const { data, error } = await supabase.from(c.table as never).select('*').order('sort_order').order('id');
        if (error) throw error;
        return (data ?? []) as Record<string, unknown>[];
      }
    }))
  });

  const newRequests = useQuery({
    queryKey: ['requests', 'new-counts'],
    enabled: isAdmin,
    queryFn: async () =>
      Promise.all(
        REQUESTS.map(async (r) => {
          const { count, error } = await supabase.from(r.table).select('id', { count: 'exact', head: true }).eq('status', 'new');
          if (error) throw error;
          return count ?? 0;
        })
      )
  });

  return (
    <div className="page">
      <PageHeader
        title="Tableau de bord"
        subtitle="Contenu du site et demandes des clients."
        actions={
          <a className="btn btn--ghost" href={env.siteUrl} target="_blank" rel="noreferrer">
            Ouvrir le site ↗
          </a>
        }
      />

      {isAdmin && (
        <section className="stats">
          {REQUESTS.map((r, i) => (
            <Link key={r.table} to={`/demandes/${r.kind}`} className="stat">
              <span className="stat__value">{newRequests.data?.[i] ?? '…'}</span>
              <span className="stat__label">{r.label} — nouvelles</span>
            </Link>
          ))}
        </section>
      )}

      <section className="card">
        <h2>Contenu</h2>
        <div className="table-wrap">
          <table className="table table--compact">
            <thead>
              <tr>
                <th>Rubrique</th>
                <th>Éléments</th>
                <th>Brouillons</th>
                <th>Traductions anglaises</th>
              </tr>
            </thead>
            <tbody>
              {COLLECTIONS.map((c, i) => {
                const rows = content[i].data;
                const drafts = rows?.filter((r) => r.published !== true).length ?? 0;
                const missing = rows?.reduce((sum, r) => sum + missingTranslations(c, r), 0) ?? 0;
                return (
                  <tr key={c.slug}>
                    <td>
                      <Link to={`/contenu/${c.slug}`}>{c.title}</Link>
                    </td>
                    <td>{rows ? rows.length : '…'}</td>
                    <td>{drafts ? <Badge tone="neutral">{drafts}</Badge> : <span className="muted">0</span>}</td>
                    <td>{missing ? <Badge tone="warn">{missing} manquante(s)</Badge> : <Badge tone="ok">complètes</Badge>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
