import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { FullPageMessage, Spinner } from '@/components/ui';

/**
 * Route guard. The real protection is row-level security in the database:
 * this only decides what to show.
 */
export function RequireStaff({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { loading, session, role, needsSecondFactor, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <FullPageMessage>
        <Spinner /> Vérification de la session…
      </FullPageMessage>
    );
  }
  if (!session) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  if (needsSecondFactor) return <Navigate to="/connexion/code" replace state={{ from: location.pathname }} />;
  if (!role) {
    return (
      <FullPageMessage title="Accès refusé">
        <p>Ce compte ne fait pas partie du personnel du Royal Guest Garden.</p>
        <button type="button" className="btn" onClick={() => void signOut()}>
          Se déconnecter
        </button>
      </FullPageMessage>
    );
  }
  if (adminOnly && role !== 'admin') {
    return (
      <div className="page">
        <div className="notice notice--error">
          <strong>Réservé aux administrateurs.</strong> Votre rôle (éditeur) donne accès au contenu du site uniquement.
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
