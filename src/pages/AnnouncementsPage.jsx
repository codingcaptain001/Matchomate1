import { announcements } from '../data/mockData';
import { Bell, Megaphone, AlertCircle, Info, Calendar, Plus } from 'lucide-react';

const categoryIcons = {
  Important: AlertCircle,
  Hostel: Building2, // Assuming we import Building2 or use a generic one
  Mess: Info,
  Maintenance: AlertCircle,
  Events: Calendar,
};

import { Building2 } from 'lucide-react';

export default function AnnouncementsPage() {
  return (
    <div className="page-content">
      <div className="page-header animate-stagger" style={{ animation: 'fadeInUp 400ms ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1 className="page-header__greeting">Announcements</h1>
            <p className="page-header__subtitle">Manage and broadcast notifications to students.</p>
          </div>
          <button className="btn btn--primary">
            <Plus size={18} /> New Announcement
          </button>
        </div>
      </div>

      <section className="section animate-stagger">
        <div className="card">
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-primary)', paddingBottom: 'var(--space-4)' }}>
            <div className="tab tab--active">All Announcements</div>
            <div className="tab">Important</div>
            <div className="tab">Events</div>
            <div className="tab">Maintenance</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {announcements.map((ann, index) => {
              const Icon = categoryIcons[ann.category] || Bell;
              return (
                <div key={ann.id} style={{
                  display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)',
                  background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                  borderLeft: `4px solid ${ann.priority === 'high' ? 'var(--danger-500)' : ann.priority === 'medium' ? 'var(--warning-500)' : 'var(--accent-500)'}`,
                  transition: 'all var(--transition-fast)'
                }}>
                  <div style={{ flexShrink: 0, padding: 10, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
                    <Icon size={20} style={{ color: ann.priority === 'high' ? 'var(--danger-600)' : 'var(--text-secondary)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--text-primary)' }}>{ann.title}</h3>
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{ann.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <span className="badge badge--default">{ann.category}</span>
                      {ann.priority === 'high' && <span className="badge badge--danger">High Priority</span>}
                    </div>
                    <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {ann.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
