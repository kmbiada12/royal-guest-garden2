import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { COLLECTIONS } from '@/content/collections';
import { env } from '@/lib/env';
import { ErrorBoundary } from './ErrorBoundary';

const ADMIN_LINKS = [
  { to: '/reglages', label: 'Réglages du site' },
  { to: '/demandes/reservations', label: 'Réservations' },
  { to: '/demandes/messages', label: 'Messages' },
  { to: '/demandes/prospects', label: 'Prospects' },
  { to: '/personnel', label: 'Personnel' },
  { to: '/journal', label: 'Journal d’audit' }
];

export function Layout() {
  const { session, role, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className="shell">
      <header className="topbar">
        <button type="button" className="topbar__menu" aria-expanded={menuOpen} aria-controls="sidebar" onClick={() => setMenuOpen((o) => !o)}>
          ☰ <span className="sr-only">Menu</span>
        </button>
        <span className="topbar__brand">
          Royal Guest Garden <span>back-office</span>
        </span>
        <span className="topbar__user">
          <a href={env.siteUrl} target="_blank" rel="noreferrer">
            Site ↗
          </a>
          <NavLink to="/compte">{session?.user.email}</NavLink>
          <button type="button" className="btn btn--small btn--ghost-light" onClick={() => void signOut()}>
            Déconnexion
          </button>
        </span>
      </header>
      <nav id="sidebar" className={`sidebar${menuOpen ? ' is-open' : ''}`} aria-label="Navigation du back-office">
        <NavLink to="/" end>
          Tableau de bord
        </NavLink>
        <p className="sidebar__group">Contenu</p>
        {COLLECTIONS.map((c) => (
          <NavLink key={c.slug} to={`/contenu/${c.slug}`}>
            {c.title}
          </NavLink>
        ))}
        {role === 'admin' && (
          <>
            <p className="sidebar__group">Administration</p>
            {ADMIN_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to}>
                {l.label}
              </NavLink>
            ))}
          </>
        )}
        <p className="sidebar__group">Compte</p>
        <NavLink to="/compte">Mon compte</NavLink>
      </nav>
      <main className="main">
        <ErrorBoundary resetKey={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
