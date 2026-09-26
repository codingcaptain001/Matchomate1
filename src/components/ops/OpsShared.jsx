import { Search, X, Inbox } from 'lucide-react';

export function inr(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function SummaryCards({ items }) {
  return (
    <div className="ops-summary-grid">
      {items.map((stat, i) => (
        <div
          key={stat.label}
          className="card card--flat ops-summary-card"
          style={{ animationDelay: `${i * 50}ms`, animation: 'fadeInUp 400ms ease backwards' }}
        >
          <div className="ops-summary-card__value" style={{ color: stat.color || 'var(--text-primary)' }}>
            {stat.value}
          </div>
          <div className="ops-summary-card__label">{stat.label}</div>
          {stat.hint && <div className="ops-summary-card__hint">{stat.hint}</div>}
        </div>
      ))}
    </div>
  );
}

export function SearchFilterBar({ search, onSearch, placeholder, children, countLabel }) {
  return (
    <div className="data-table-toolbar" style={{ flexWrap: 'wrap' }}>
      <div className="ops-search">
        <Search size={15} style={{ color: 'var(--text-quaternary)', flexShrink: 0 }} />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {children}
      {countLabel && (
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)', marginLeft: 'auto', fontWeight: 500 }}>
          {countLabel}
        </span>
      )}
    </div>
  );
}

export function FilterSelect({ value, onChange, options }) {
  return (
    <select className="ops-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description }) {
  return (
    <div className="ops-empty">
      <div style={{
        width: 56, height: 56, borderRadius: 'var(--radius-full)',
        background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--border-primary)'
      }}>
        <Icon size={24} style={{ color: 'var(--text-quaternary)' }} />
      </div>
      <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 'var(--font-base)' }}>{title}</p>
      {description && <p style={{ fontSize: 'var(--font-sm)', maxWidth: 300 }}>{description}</p>}
    </div>
  );
}

export function LoadingTable({ rows = 6, cols = 6 }) {
  return (
    <div className="data-table-wrapper" style={{ animation: 'fadeInUp 400ms ease' }}>
      <div className="data-table-toolbar">
        <div className="ops-skeleton" style={{ width: 240, height: 34 }} />
        <div className="ops-skeleton" style={{ width: 110, height: 34, marginLeft: 'auto' }} />
      </div>
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="ops-skeleton" style={{ height: 38, width: `${94 - (i % 3) * 4}%`, opacity: 1 - i * 0.08 }} />
        ))}
      </div>
    </div>
  );
}

export function DetailDrawer({ open = true, title, onClose, children, footer, width = 480 }) {
  if (open === false) return null;
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" style={{ width }}>
        <div className="drawer__header">
          <h2 className="drawer__title">{title}</h2>
          <button onClick={onClose} className="btn btn--ghost btn--icon" type="button">
            <X size={18} />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        {footer && <div className="drawer__footer" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{footer}</div>}
      </div>
    </>
  );
}

export const OpsDrawer = DetailDrawer;

export function MetaGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
      {items.map((item) => (
        <div key={item.label} style={{
          padding: '12px 14px',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-secondary)'
        }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)', marginBottom: 3, fontWeight: 500 }}>{item.label}</div>
          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value || '—'}</div>
        </div>
      ))}
    </div>
  );
}

export function StudentChip({ student }) {
  if (!student) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="avatar avatar--sm" style={{ background: 'linear-gradient(135deg, var(--accent-400), #a78bfa)', color: 'white' }}>
        {student.avatar}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{student.name}</div>
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{student.id} · {student.room}</div>
      </div>
    </div>
  );
}
