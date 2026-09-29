import { useState } from 'react';
import {
  UserCheck, Plus, CheckCircle2, Clock, XCircle, ShieldCheck,
  Phone, User, Calendar, Car, ArrowRight, ShieldAlert, FileText,
  Search, ChevronLeft, ChevronRight, Upload, MapPin
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function StudentVisitors() {
  const {
    currentStudent,
    visitors,
    addVisitor,
    today,
  } = useHostelStore();

  const [filter, setFilter] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  // Form State
  const [visitorName, setVisitorName] = useState('');
  const [relation, setRelation] = useState('Father');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [expectedAt, setExpectedAt] = useState(`${today}T16:30`);
  const [vehicle, setVehicle] = useState('');
  const [idProof, setIdProof] = useState('Aadhaar Card');

  const myVisitors = visitors.filter((v) => v.studentId === currentStudent?.id);
  const activeVisitors = myVisitors.filter(v => v.status === 'checked-in' || v.status === 'expected' || v.status === 'pending-approval' || v.status === 'approved');
  const completedVisitors = myVisitors.filter(v => v.status === 'checked-out');

  const filteredVisitors = myVisitors.filter((v) => {
    if (filter === 'active') return activeVisitors.includes(v);
    if (filter === 'completed') return completedVisitors.includes(v);
    return true;
  }).filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return v.visitorName.toLowerCase().includes(q) || v.purpose.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filteredVisitors.length / perPage));
  const paginatedVisitors = filteredVisitors.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!visitorName.trim()) return;

    addVisitor({
      visitorName,
      relation,
      phone,
      purpose,
      expectedAt: expectedAt.replace('T', ' '),
      vehicle: vehicle || 'Walk-in',
      idProof,
    });

    setIsDrawerOpen(false);
    setVisitorName('');
    setPhone('');
    setPurpose('');
    setExpectedAt(`${today}T16:30`);
    setVehicle('');
  };

  const getStatusBadge = (status) => {
    const styles = {
      base: { padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, letterSpacing: '0.01em' },
    };
    switch (status) {
      case 'checked-in':
        return <span style={{ ...styles.base, color: '#059669', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.15)' }}><CheckCircle2 size={13} /> Checked-In</span>;
      case 'expected':
      case 'approved':
        return <span style={{ ...styles.base, color: '#7c3aed', background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.15)' }}><Clock size={13} /> Expected</span>;
      case 'pending-approval':
        return <span style={{ ...styles.base, color: '#d97706', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.15)' }}><Clock size={13} /> Pre-Approved</span>;
      case 'checked-out':
        return <span style={{ ...styles.base, color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}><CheckCircle2 size={13} /> Completed</span>;
      default:
        return <span style={{ ...styles.base, color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}>{status}</span>;
    }
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const avatarColors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#0ea5e9', '#14b8a6'];
  const getAvatarColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

  const relationColors = {
    Father: { bg: 'rgba(99, 102, 241, 0.08)', color: '#6366f1', border: 'rgba(99, 102, 241, 0.2)' },
    Mother: { bg: 'rgba(236, 72, 153, 0.08)', color: '#ec4899', border: 'rgba(236, 72, 153, 0.2)' },
    Sister: { bg: 'rgba(168, 85, 247, 0.08)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.2)' },
    Guest: { bg: 'rgba(14, 165, 233, 0.08)', color: '#0ea5e9', border: 'rgba(14, 165, 233, 0.2)' },
    Friend: { bg: 'rgba(20, 184, 166, 0.08)', color: '#14b8a6', border: 'rgba(20, 184, 166, 0.2)' },
  };
  const getRelationStyle = (rel) => relationColors[rel] || relationColors.Guest;

  // Shared input style
  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, outline: 'none',
    border: '1.5px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6, letterSpacing: '0.01em' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
      
      {/* ─── Hero Banner ─── */}
      <div style={{
        position: 'relative', padding: '48px 48px 80px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: 120, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }} />
        <div style={{ position: 'absolute', top: 30, right: 200, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.015)' }} />

        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 700 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
            color: '#a5b4fc', background: 'rgba(165, 180, 252, 0.12)', padding: '5px 14px',
            borderRadius: 20, marginBottom: 16, border: '1px solid rgba(165, 180, 252, 0.15)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <ShieldCheck size={13} /> Campus Security
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', margin: '0 0 8px', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Visitor Passes & Approvals
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
            Pre-register parents, guardians, and guests for contactless gate entry at ABC Residency.
          </p>
        </div>

        {/* Hostel illustration badge */}
        <div style={{
          position: 'absolute', top: 40, right: 48, background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)', borderRadius: 16, padding: '16px 20px',
          border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={22} color="#a5b4fc" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>ABC Residency</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Block B • Floor 3</div>
          </div>
        </div>
      </div>

      {/* ─── Content Area ─── */}
      <div style={{ padding: '0 48px 48px', marginTop: -52, position: 'relative', zIndex: 10, flex: 1 }}>
        
        {/* ─── KPI Cards ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 32 }}>
          {[
            {
              label: 'Total Visitors', value: myVisitors.length, sub: 'This semester',
              icon: <UserCheck size={22} />, iconBg: 'linear-gradient(135deg, #6366f1, #818cf8)',
              badge: '↑ 20%', badgeBg: 'rgba(5, 150, 105, 0.1)', badgeColor: '#059669',
            },
            {
              label: 'Currently Inside', value: myVisitors.filter(v => v.status === 'checked-in').length, sub: 'Checked-in at security',
              icon: <ShieldCheck size={22} />, iconBg: 'linear-gradient(135deg, #059669, #34d399)',
              badge: '↓ 50%', badgeBg: 'rgba(239, 68, 68, 0.1)', badgeColor: '#ef4444',
            },
            {
              label: 'Hostel Visiting Hours', value: null, sub: 'Common lounge / Dining hall only',
              icon: <Clock size={22} />, iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              customValue: '04:00 PM – 08:00 PM',
            },
            {
              label: 'Security Desk', value: null, sub: null,
              icon: <ShieldAlert size={22} />, iconBg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              customValue: 'Main Gate (Gate 1)',
              customSub: <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6366f1', fontWeight: 600, fontSize: 13 }}><Phone size={13} /> +91 755 123 4567</span>,
            },
          ].map((kpi, i) => (
            <div key={i} style={{
              background: 'var(--bg-secondary)', borderRadius: 16, padding: 22,
              border: '1px solid var(--border-primary)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
              display: 'flex', gap: 16, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)'; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: kpi.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0,
              }}>
                {kpi.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{kpi.label}</div>
                  {kpi.badge && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: kpi.badgeColor, background: kpi.badgeBg, padding: '2px 8px', borderRadius: 10 }}>{kpi.badge}</span>
                  )}
                </div>
                {kpi.value !== null ? (
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{kpi.value}</div>
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>{kpi.customValue}</div>
                )}
                {kpi.sub && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{kpi.sub}</div>}
                {kpi.customSub && <div style={{ marginTop: 4 }}>{kpi.customSub}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Filters Bar ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, background: 'var(--bg-secondary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-primary)' }}>
            {[
              { key: 'all', label: `All Visitors (${myVisitors.length})` },
              { key: 'active', label: `Active (${activeVisitors.length})`, dot: '#22c55e' },
              { key: 'completed', label: `Completed (${completedVisitors.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => { setFilter(tab.key); setCurrentPage(1); }} style={{
                padding: '8px 18px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: filter === tab.key ? 'var(--accent-500)' : 'transparent',
                color: filter === tab.key ? 'white' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s',
              }}>
                {tab.dot && <div style={{ width: 7, height: 7, borderRadius: '50%', background: tab.dot }} />}
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 10,
              padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, width: 260,
              transition: 'border-color 0.2s',
            }}>
              <Search size={16} color="var(--text-tertiary)" />
              <input type="text" placeholder="Search visitors by name, student, purpose..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--text-primary)', fontSize: 13 }} />
            </div>
            <button style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontWeight: 500, transition: 'border-color 0.2s' }}>
              <Calendar size={15} /> Select Date
            </button>
            <select style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>
              <option>All Status</option>
            </select>
          </div>
        </div>

        {/* ─── Data Table ─── */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {['Visitor', 'Relation', 'Student', 'Expected Time', 'Purpose', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedVisitors.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 60, textAlign: 'center' }}>
                    <UserCheck size={40} color="var(--text-tertiary)" style={{ opacity: 0.3, marginBottom: 12 }} />
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No visitors found</div>
                    <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Register a visitor to get started.</div>
                  </td>
                </tr>
              ) : paginatedVisitors.map((vis, i) => {
                const relStyle = getRelationStyle(vis.relation);
                const avatarBg = getAvatarColor(vis.visitorName);
                return (
                  <tr key={vis.id} style={{
                    borderBottom: i < paginatedVisitors.length - 1 ? '1px solid var(--border-primary)' : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 12, background: avatarBg,
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, flexShrink: 0,
                        }}>
                          {getInitials(vis.visitorName)}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{vis.visitorName}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{vis.phone ? `+91 ${vis.phone}` : '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600, color: relStyle.color, background: relStyle.bg,
                        padding: '4px 12px', borderRadius: 8, border: `1px solid ${relStyle.border}`,
                      }}>{vis.relation}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{currentStudent?.name || 'Rahul Sharma'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{currentStudent?.room || 'B-304'} • CSE</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <Calendar size={14} color="var(--text-tertiary)" /> {vis.expectedAt?.split(' ')[0] || 'TBD'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2, paddingLeft: 20 }}>
                        {vis.expectedAt?.split(' ')[1] || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)', maxWidth: 180, lineHeight: 1.5 }}>
                      {vis.purpose}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {getStatusBadge(vis.status)}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button style={{
                          padding: '6px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)',
                          borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-400)'; e.currentTarget.style.color = 'var(--accent-600)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        >View</button>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 4 }}>⋮</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{
            padding: '14px 20px', borderTop: '1px solid var(--border-primary)', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              Showing {Math.min((currentPage - 1) * perPage + 1, filteredVisitors.length)} to {Math.min(currentPage * perPage, filteredVisitors.length)} of {filteredVisitors.length} visitors
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', cursor: currentPage === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{
                  width: 32, height: 32, borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: currentPage === p ? 'var(--accent-500)' : 'transparent',
                  color: currentPage === p ? 'white' : 'var(--text-secondary)',
                }}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', cursor: currentPage === totalPages ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === totalPages ? 0.4 : 1 }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FAB ─── */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 900,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
          border: 'none', borderRadius: 16, padding: '14px 24px',
          fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.35)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.45)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.35)'; }}
      >
        <Plus size={18} /> Pre-Register Visitor
      </button>

      {/* ─── Drawer ─── */}
      {isDrawerOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 998, transition: 'opacity 0.3s' }} onClick={() => setIsDrawerOpen(false)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--bg-secondary)', zIndex: 999,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid var(--border-primary)',
          }}>
            {/* Drawer Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <UserCheck size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>Pre-Register Visitor</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>Generate an OTP gate pass for campus security.</p>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>
            
            {/* Drawer Body */}
            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                <div>
                  <label style={labelStyle}>Visitor Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <User size={17} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: 13 }} />
                    <input type="text" value={visitorName} onChange={e => setVisitorName(e.target.value)} placeholder="e.g. Ramesh Sharma"
                      style={{ ...inputStyle, paddingLeft: 40 }} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Relation to Student <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={relation} onChange={e => setRelation(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Sister</option>
                      <option>Guest</option>
                      <option>Friend</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ display: 'flex' }}>
                      <div style={{ padding: '11px 10px', border: '1.5px solid var(--border-primary)', borderRight: 'none', borderRadius: '10px 0 0 10px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                        <Phone size={13} /> +91
                      </div>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="98765 43210"
                        style={{ ...inputStyle, borderRadius: '0 10px 10px 0' }} required />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Select Student <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{
                    ...inputStyle, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'default',
                  }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                      {getInitials(currentStudent?.name || 'Rahul Sharma')}
                    </div>
                    <span style={{ fontWeight: 600 }}>{currentStudent?.name || 'Rahul Sharma'} ({currentStudent?.room || 'B-304'} • CSE)</span>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Expected Date & Time <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={17} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: 13 }} />
                    <input type="datetime-local" value={expectedAt} onChange={e => setExpectedAt(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 40 }} required />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Purpose of Visit <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={17} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: 13 }} />
                    <textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Semester fee deposit and meeting..."
                      style={{ ...inputStyle, paddingLeft: 40, minHeight: 80, resize: 'none' }} required />
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{purpose.length}/200</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Vehicle Registration <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, fontSize: 11 }}>(Optional)</span></label>
                    <div style={{ position: 'relative' }}>
                      <Car size={17} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: 13 }} />
                      <input type="text" value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="e.g. MP 04 AB 1234"
                        style={{ ...inputStyle, paddingLeft: 40 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <input type="checkbox" id="walkin" defaultChecked style={{ accentColor: '#6366f1' }} />
                      <label htmlFor="walkin" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Walk-in</label>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>ID Proof to Produce <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={idProof} onChange={e => setIdProof(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      <option>Aadhaar Card</option>
                      <option>Driving License</option>
                      <option>Passport</option>
                    </select>
                  </div>
                </div>

              </form>
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: 12 }}>
              <button onClick={() => setIsDrawerOpen(false)} style={{
                flex: 1, padding: 13, borderRadius: 12, border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleSubmit} style={{
                flex: 2, padding: 13, borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
              }}>
                <CheckCircle2 size={16} /> Generate Gate Pass
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
