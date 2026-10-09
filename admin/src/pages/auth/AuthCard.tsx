import type { ReactNode } from 'react';

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__brand">
          <span className="auth__logo" aria-hidden="true">RGG</span>
          <div>
            <strong>Royal Guest Garden</strong>
            <span>Back-office</span>
          </div>
        </div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
