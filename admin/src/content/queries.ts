import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, type TableName } from '@/lib/supabase';

type AnyRow = Record<string, unknown> & { id: string | number; sort_order?: number; published?: boolean };

/* supabase-js is typed per table; the generic editor works on any content
   table, so it goes through this untyped handle. */
const roomsBuilder = () => supabase.from('rooms');
type UntypedClient = { from: (table: string) => ReturnType<typeof roomsBuilder> };
const from = (table: TableName) => (supabase as unknown as UntypedClient).from(table);

export const contentKey = (table: TableName) => ['content', table] as const;

/** All rows of a content table, in display order. */
export function useContentRows(table: TableName, enabled = true) {
  return useQuery({
    queryKey: contentKey(table),
    enabled,
    queryFn: async () => {
      const { data, error } = await from(table).select('*').order('sort_order').order('id');
      if (error) throw error;
      return (data ?? []) as unknown as AnyRow[];
    }
  });
}

export function useContentRow(table: TableName, id: string | undefined) {
  return useQuery({
    queryKey: [...contentKey(table), 'row', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await from(table).select('*').eq('id', id as never).maybeSingle();
      if (error) throw error;
      return data as unknown as AnyRow | null;
    }
  });
}

export function useSaveRow(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, row }: { id: string | number | null; row: Record<string, unknown> }) => {
      if (id === null) {
        // New rows go to the end of the list.
        const { data: last } = await from(table).select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const next = ((last?.[0] as { sort_order?: number } | undefined)?.sort_order ?? 0) + 1;
        const { data, error } = await from(table).insert({ ...row, sort_order: next } as never).select('id').single();
        if (error) throw error;
        return (data as { id: string | number }).id;
      }
      const { error } = await from(table).update(row as never).eq('id', id as never);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKey(table) })
  });
}

export function useDeleteRow(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await from(table).delete().eq('id', id as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKey(table) })
  });
}

export function useSetPublished(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, published }: { id: string | number; published: boolean }) => {
      const { error } = await from(table).update({ published } as never).eq('id', id as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKey(table) })
  });
}

/** Moves a row one step and renumbers sort_order 1..n where needed. */
export function useMoveRow(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ rows, index, delta }: { rows: AnyRow[]; index: number; delta: -1 | 1 }) => {
      const target = index + delta;
      if (target < 0 || target >= rows.length) return;
      const order = rows.slice();
      [order[index], order[target]] = [order[target], order[index]];
      const changes = order
        .map((row, i) => ({ id: row.id, sort_order: i + 1, current: row.sort_order }))
        .filter((c) => c.current !== c.sort_order);
      for (const c of changes) {
        const { error } = await from(table).update({ sort_order: c.sort_order } as never).eq('id', c.id as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKey(table) })
  });
}
