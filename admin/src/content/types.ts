import type { TableName } from '@/lib/supabase';

/** Field kinds understood by the generic content editor. */
export type FieldDef =
  | { kind: 'slug'; key: string; label: string; hint?: string }
  | { kind: 'text'; key: string; label: string; hint?: string; maxLength?: number }
  | { kind: 'int'; key: string; label: string; hint?: string; min?: number; max?: number; suffix?: string }
  | { kind: 'bool'; key: string; label: string; hint?: string }
  | { kind: 'i18n'; key: string; label: string; hint?: string; multiline?: boolean; rows?: number }
  | { kind: 'i18nList'; key: string; label: string; hint?: string }
  | { kind: 'image'; key: string; label: string; hint?: string }
  | { kind: 'images'; key: string; label: string; hint?: string }
  | { kind: 'select'; key: string; label: string; hint?: string; options: { value: string; label: string }[] }
  | { kind: 'icon'; key: string; label: string; hint?: string }
  | { kind: 'ref'; key: string; label: string; hint?: string; table: TableName; numeric?: boolean }
  | { kind: 'amenities'; key: string; label: string; hint?: string }
  | { kind: 'pricing'; key: string; label: string; hint?: string };

export type ListColumn =
  | { kind: 'image'; key: string; label: string; first?: boolean }
  | { kind: 'text'; key: string; label: string }
  | { kind: 'i18n'; key: string; label: string }
  | { kind: 'xaf'; key: string; label: string }
  | { kind: 'ref'; key: string; label: string; table: TableName }
  | { kind: 'stars'; key: string; label: string }
  | { kind: 'bool'; key: string; label: string };

export interface CollectionDef {
  /** URL segment: /contenu/<slug> */
  slug: string;
  table: TableName;
  title: string;
  singular: string;
  /** Text primary key typed by the editor (slug) vs. generated identity. */
  pk: 'id';
  pkKind: 'slug' | 'identity';
  description?: string;
  columns: ListColumn[];
  fields: FieldDef[];
  /** Values for a new row (besides sort_order/published). */
  defaults: Record<string, unknown>;
  /** Page of the public site showing this row. */
  previewPath?: (row: Record<string, unknown>) => string;
  /** Field shown as the row's title in lists/messages. */
  titleOf: (row: Record<string, unknown>) => string;
}

export type FormValues = Record<string, unknown>;
