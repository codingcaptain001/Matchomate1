import { useState } from 'react';
import { Bell, AlertCircle, Info, Calendar, Plus, Building2 } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

const categoryIcons = {
  Important: AlertCircle,
  Hostel: Building2,
  Mess: Info,
  Maintenance: AlertCircle,
  Events: Calendar,
};

export default function AnnouncementsPage({ audience = 'admin' }) {
  const { announcements, setAnnouncements, today } = useHostelStore();
  const [filter, setFilter] = useState('All');
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', category: 'Important', priority: 'normal', description: '' });
  const isAdmin = audience === 'admin';
  const filters = ['All', 'Important', 'Events', 'Maintenance', 'Mess', 'Hostel'];
  const visibleAnnouncements = announcements.filter((item) => filter === 'All' || item.category === filter);

  const publish = (event) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.description.trim()) return;
    const date = new Date(`${today}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setAnnouncements((previous) => [{ ...draft, id: `ANN-${Date.now()}`, title: draft.title.trim(), description: draft.description.trim(), date }, ...previous]);
    setDraft({ title: '', category: 'Important', priority: 'normal', description: '' });
    setComposeOpen(false);
  };

  return (
    <div className="page-content">
      <div className="page-header animate-stagger" style={{ animation: 'fadeInUp 400ms ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1 className="page-header__greeting">Announcements</h1>
            <p className="page-header__subtitle">{isAdmin ? 'Publish updates for residents and staff.' : 'Updates published by the Warden Office.'}</p>
          </div>
          {isAdmin && <button type="button" className="btn btn--primary" onClick={() => setComposeOpen((open) => !open)}><Plus size={18} /> {composeOpen ? 'Cancel' : 'New Announcement'}</button>}
        </div>
      </div>

      {isAdmin && composeOpen && <form className="card" onSubmit={publish} style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <label className="input-wrapper"><span className="input-label">Title</span><input className="input" required value={draft.title} onChange={(event) => setDraft((previous) => ({ ...previous, title: event.target.value }))} /></label>
        <div className="grid-2col" style={{ gap: 'var(--space-3)' }}>
          <label className="input-wrapper"><span className="input-label">Category</span><select className="input" value={draft.category} onChange={(event) => setDraft((previous) => ({ ...previous, category: event.target.value }))}>{filters.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="input-wrapper"><span className="input-label">Priority</span><select className="input" value={draft.priority} onChange={(event) => setDraft((previous) => ({ ...previous, priority: event.target.value }))}><option value="normal">Normal</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        </div>
        <label className="input-wrapper"><span className="input-label">Message</span><textarea className="input" required rows="4" value={draft.description} onChange={(event) => setDraft((previous) => ({ ...previous, description: event.target.value }))} /></label>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn--primary">Publish announcement</button></div>
      </form>}

      <section className="section animate-stagger">
        <div className="card">
          <div className="tabs" role="tablist" aria-label="Announcement category">
            {filters.map((category) => <button key={category} type="button" role="tab" aria-selected={filter === category} className={`tab ${filter === category ? 'tab--active' : ''}`} onClick={() => setFilter(category)}>{category}</button>)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {visibleAnnouncements.length === 0 && <p style={{ color: 'var(--text-tertiary)', padding: 'var(--space-4)' }}>No announcements in this category.</p>}
            {visibleAnnouncements.map((ann) => {
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
