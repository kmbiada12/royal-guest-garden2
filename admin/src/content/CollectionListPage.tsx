import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collectionBySlug, refLabel } from './collections';
import { missingTranslations } from './convert';
import { useContentRows, useDeleteRow, useMoveRow, useSetPublished } from './queries';
import type { CollectionDef, ListColumn } from './types';
import { frText } from '@/lib/i18n';
import { formatXaf } from '@/lib/format';
import { imagePreviewUrl } from '@/lib/images';
import { friendlyError } from '@/lib/errors';
import { env } from '@/lib/env';
import { Badge, ErrorNotice, Loading, PageHeader, useToast } from '@/components/ui';
import { ConfirmButton } from '@/components/ConfirmButton';

type AnyRow = Record<string, unknown> & { id: string | number };

function Cell({ column, row, refs }: { column: ListColumn; row: AnyRow; refs: Map<string, AnyRow> }) {
  const value = row[column.key];
  switch (column.kind) {
    case 'image': {
      const src = Array.isArray(value) ? value[0] : value;
      return typeof src === 'string' && src ? <img className="thumb" src={imagePreviewUrl(src, 160)} alt="" loading="lazy" /> : <span className="thumb thumb--empty" />;
    }
    case 'i18n':
      return <>{frText(value)}</>;
    case 'xaf':
      return <>{formatXaf(value as number)}</>;
    case 'ref':
      return <>{refLabel(refs.get(String(value)))}</>;
    case 'stars':
      return <span aria-label={`${value} sur 5`}>{'★'.repeat(Number(value) || 0)}</span>;
    case 'bool':
      return value ? <Badge tone="gold">oui</Badge> : <span className="muted">—</span>;
    default:
      return <>{value === null || value === undefined ? '—' : String(value)}</>;
  }
}

function useRefs(def: CollectionDef) {
  const refTable = def.columns.find((c) => c.kind === 'ref');
  const query = useContentRows(refTable?.kind === 'ref' ? refTable.table : 'room_categories', refTable !== undefined);
  return useMemo(() => new Map((query.data ?? []).map((r) => [String(r.id), r as AnyRow])), [query.data]);
}

export default function CollectionListPage() {
  const { collection } = useParams();
  const def = collectionBySlug(collection);
  if (!def) return <div className="page"><ErrorNotice error="Rubrique inconnue." /></div>;
  return <List key={def.slug} def={def} />;
}

function List({ def }: { def: CollectionDef }) {
  const rowsQuery = useContentRows(def.table);
  const refs = useRefs(def);
  const toast = useToast();
  const setPublished = useSetPublished(def.table);
  const moveRow = useMoveRow(def.table);
  const deleteRow = useDeleteRow(def.table);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const rows = (rowsQuery.data ?? []) as AnyRow[];
  const filtered = search.trim()
    ? rows.filter((r) => def.titleOf(r).toLowerCase().includes(search.trim().toLowerCase()) || String(r.id).includes(search.trim()))
    : rows;
  const canReorder = !search.trim();

  const run = async (action: () => Promise<unknown>, done?: string) => {
    setError(null);
    try {
      await action();
      if (done) toast(done);
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  return (
    <div className="page">
      <PageHeader
        title={def.title}
        subtitle={def.description}
        actions={
          <Link className="btn btn--primary" to={`/contenu/${def.slug}/nouveau`}>
            + Ajouter
          </Link>
        }
      />
      <div className="toolbar">
        <input type="search" placeholder="Rechercher…" aria-label="Rechercher" value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="muted">
          {rows.length} élément(s) · {rows.filter((r) => !r.published).length} brouillon(s)
        </span>
      </div>
      <ErrorNotice error={error ?? (rowsQuery.error ? friendlyError(rowsQuery.error) : null)} />
      {rowsQuery.isLoading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <p className="empty">Aucun élément.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {canReorder && <th aria-label="Ordre" />}
                {def.columns.map((c) => (
                  <th key={c.key + c.kind}>{c.label}</th>
                ))}
                <th>État</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => {
                const missing = missingTranslations(def, row);
                return (
                  <tr key={String(row.id)} className={row.published ? '' : 'is-draft'}>
                    {canReorder && (
                      <td className="order-cell">
                        <button type="button" className="icon-btn" aria-label="Monter" disabled={index === 0 || moveRow.isPending} onClick={() => void run(() => moveRow.mutateAsync({ rows, index, delta: -1 }))}>
                          ↑
                        </button>
                        <button type="button" className="icon-btn" aria-label="Descendre" disabled={index === rows.length - 1 || moveRow.isPending} onClick={() => void run(() => moveRow.mutateAsync({ rows, index, delta: 1 }))}>
                          ↓
                        </button>
                      </td>
                    )}
                    {def.columns.map((c) => (
                      <td key={c.key + c.kind}>
                        <Cell column={c} row={row} refs={refs} />
                      </td>
                    ))}
                    <td className="badges">
                      <label className="switch" title={row.published ? 'Publié' : 'Brouillon'}>
                        <input
                          type="checkbox"
                          checked={row.published === true}
                          aria-label={`Publier ${def.titleOf(row)}`}
                          onChange={(e) =>
                            void run(
                              () => setPublished.mutateAsync({ id: row.id, published: e.target.checked }),
                              e.target.checked ? 'Publié.' : 'Passé en brouillon.'
                            )
                          }
                        />
                        <span>{row.published ? 'Publié' : 'Brouillon'}</span>
                      </label>
                      {missing > 0 && <Badge tone="warn">EN manquant ({missing})</Badge>}
                    </td>
                    <td className="actions">
                      <Link className="btn btn--small" to={`/contenu/${def.slug}/${encodeURIComponent(String(row.id))}`}>
                        Modifier
                      </Link>
                      {def.previewPath && row.published === true && (
                        <a className="btn btn--small btn--ghost" href={`${env.siteUrl}/${def.previewPath(row)}`} target="_blank" rel="noreferrer">
                          Voir ↗
                        </a>
                      )}
                      <ConfirmButton
                        label="Supprimer"
                        confirmLabel="Confirmer la suppression"
                        onConfirm={() => run(() => deleteRow.mutateAsync(row.id), 'Supprimé.')}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
