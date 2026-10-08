import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { StaffRole } from '@/lib/staffApi';

interface AuthState {
  loading: boolean;
  session: Session | null;
  /** Staff role, or null for a login that is not staff. */
  role: StaffRole | null;
  /** True when the account has two-factor enabled but this session has not passed it yet. */
  needsSecondFactor: boolean;
}

interface AuthContextValue extends AuthState {
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadState(session: Session | null): Promise<AuthState> {
  if (!session) return { loading: false, session: null, role: null, needsSecondFactor: false };
  const [{ data: role }, { data: aal }] = await Promise.all([
    supabase.rpc('current_staff_role'),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  ]);
  return {
    loading: false,
    session,
    role: role === 'admin' || role === 'editor' ? role : null,
    needsSecondFactor: !!aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2'
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loading: true,
    session: null,
    role: null,
    needsSecondFactor: false
  });

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setState(await loadState(data.session));
  }, []);

  useEffect(() => {
    void refresh();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // Supabase calls must not be awaited inside this callback: defer.
      setTimeout(() => {
        void loadState(session).then(setState);
      }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ loading: false, session: null, role: null, needsSecondFactor: false });
  }, []);

  const value = useMemo(() => ({ ...state, refresh, signOut }), [state, refresh, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
