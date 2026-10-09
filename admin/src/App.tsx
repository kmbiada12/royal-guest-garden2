import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { env } from '@/lib/env';
import { AuthProvider } from '@/auth/AuthProvider';
import { RequireStaff } from '@/auth/RequireStaff';
import { Layout } from '@/components/Layout';
import { Loading, ToastProvider } from '@/components/ui';
import Login from '@/pages/auth/Login';
import MfaChallenge from '@/pages/auth/MfaChallenge';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import SetPassword from '@/pages/auth/SetPassword';
import Dashboard from '@/pages/Dashboard';
import CollectionListPage from '@/content/CollectionListPage';
import CollectionEditPage from '@/content/CollectionEditPage';
import Account from '@/pages/Account';

const Settings = lazy(() => import('@/pages/Settings'));
const Requests = lazy(() => import('@/pages/Requests'));
const Staff = lazy(() => import('@/pages/Staff'));
const Audit = lazy(() => import('@/pages/Audit'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } }
});

const admin = (node: React.ReactNode) => (
  <RequireStaff adminOnly>
    <Suspense fallback={<div className="page"><Loading /></div>}>{node}</Suspense>
  </RequireStaff>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter basename={env.basePath}>
            <Routes>
              <Route path="/connexion" element={<Login />} />
              <Route path="/connexion/code" element={<MfaChallenge />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
              <Route path="/mot-de-passe" element={<SetPassword />} />
              <Route
                element={
                  <RequireStaff>
                    <Layout />
                  </RequireStaff>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="contenu/:collection" element={<CollectionListPage />} />
                <Route path="contenu/:collection/:id" element={<CollectionEditPage />} />
                <Route path="compte" element={<Account />} />
                <Route path="reglages" element={admin(<Settings />)} />
                <Route path="demandes/:kind" element={admin(<Requests />)} />
                <Route path="personnel" element={admin(<Staff />)} />
                <Route path="journal" element={admin(<Audit />)} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
