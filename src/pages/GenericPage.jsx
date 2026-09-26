import { LayoutDashboard } from 'lucide-react';

export default function GenericPage({ title, description, icon: Icon = LayoutDashboard }) {
  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={24} style={{ color: 'var(--accent-500)' }} />
          <h1 className="page-header__greeting">{title}</h1>
        </div>
        <p className="page-header__subtitle">{description}</p>
      </div>

      <div className="card" style={{ animation: 'fadeInUp 500ms ease', padding: 'var(--space-12)', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: 'var(--text-quaternary)' }}>
          <Icon size={48} style={{ opacity: 0.3 }} />
          <div>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
              {title} Module
            </h3>
            <p style={{ fontSize: 'var(--font-sm)', maxWidth: 400, margin: '0 auto' }}>
              This page is part of the MatchoMate intelligent student housing OS. Detailed data and interactive components will be populated here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
