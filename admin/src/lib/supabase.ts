import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { env } from './env';

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'rgg-admin-auth'
  }
});

export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;
export type Row<T extends TableName> = Tables[T]['Row'];
