import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type StaffRole = 'admin' | 'editor';

export interface StaffMember {
  userId: string;
  email: string;
  role: StaffRole;
  createdAt: string;
  invitedBy: string | null;
  lastSignInAt: string | null;
  confirmed: boolean;
  twoFactor: boolean;
  isMe: boolean;
}

/** Calls the staff-admin Edge Function (service-role work stays server-side). */
async function call<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('staff-admin', { body });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = await error.context.json().catch(() => null);
      throw new Error(payload?.error ?? 'Le service du personnel a refusé la demande.');
    }
    throw new Error('Service du personnel injoignable.');
  }
  return data as T;
}

export const staffApi = {
  list: () => call<{ staff: StaffMember[] }>({ action: 'list' }).then((d) => d.staff),
  invite: (email: string, role: StaffRole) =>
    call<{ ok: true; existingAccount?: boolean }>({ action: 'invite', email, role }),
  setRole: (userId: string, role: StaffRole) => call<{ ok: true }>({ action: 'set_role', userId, role }),
  remove: (userId: string) => call<{ ok: true }>({ action: 'remove', userId })
};
