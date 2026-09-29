import { useState } from 'react';
import {
  CalendarOff, Plus, CheckCircle2, Clock, XCircle, AlertTriangle,
  Calendar, MapPin, Phone, ShieldCheck, FileText, UserCheck,
  Search, ChevronRight, MoreVertical, Plane, Home, Stethoscope,
  GraduationCap, PartyPopper, Sun
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { formatDate } from '../components/ops/OpsShared';

export default function StudentLeave() {
  const { currentStudent, leaveRequests, applyLeave, today, showToast } = useHostelStore();

  const [filter, setFilter] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Form State
  const [leaveType, setLeaveType] = useState('Home visit');
  const [fromDate, setFromDate] = useState(today || new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [parentContact, setParentContact] = useState(currentStudent?.guardianPhone || '+91 98100 11111');
  const [parentConsent, setParentConsent] = useState(false);
  const [formError, setFormError] = useState('');

  const myLeaves = leaveRequests.filter((l) => l.studentId === currentStudent?.id);
  const filteredLeaves = myLeaves.filter((l) => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  const pendingCount = myLeaves.filter((l) => l.status === 'pending').length;
  const approvedCount = myLeaves.filter((l) => l.status === 'approved').length;
  const rejectedCount = myLeaves.filter((l) => l.status === 'rejected').length;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!destination.trim()) {
      const err = 'Please enter destination city & address';
      setFormError(err);
      showToast?.(err);
      return;
    }
    if (!toDate) {
      const err = 'Please select a return date';
      setFormError(err);
      showToast?.(err);
      return;
    }
    if (toDate < fromDate) {
      const err = 'The return date must be on or after the departure date';
      setFormError(err);
      showToast?.(err);
      return;
    }
    if (!reason.trim()) {
      const err = 'Please provide a detailed reason for leave';
      setFormError(err);
      showToast?.(err);
      return;
    }
    if (!parentConsent) {
      const err = 'Please confirm parent / guardian consent';
      setFormError(err);
      showToast?.(err);
      return;
    }

    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);
    const diffDays = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) || 1);

    applyLeave({
      type: leaveType,
      from: fromDate,
      to: toDate,
      days: diffDays,
      reason: reason.trim(),
      destination: destination.trim(),
      emergencyContact: parentContact || currentStudent?.guardianPhone || '+91 98100 11111',
    });

    setIsDrawerOpen(false);
    setFilter('all');
    setReason('');
    setDestination('');
    const nextD = new Date();
    nextD.setDate(nextD.getDate() + 2);
    setToDate(nextD.toISOString().split('T')[0]);
    setParentConsent(false);
    setFormError('');
  };

  const getStatusBadge = (status) => {
    const base = { padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, letterSpacing: '0.01em' };
    switch (status) {
      case 'approved':
        return <span style={{ ...base, color: '#059669', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)' }}><CheckCircle2 size={13} /> Approved</span>;
      case 'pending':
        return <span style={{ ...base, color: '#d97706', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.15)' }}><Clock size={13} /> Pending Warden</span>;
      case 'rejected':
        return <span style={{ ...base, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}><XCircle size={13} /> Rejected</span>;
      case 'completed':
        return <span style={{ ...base, color: '#7c3aed', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}><ShieldCheck size={13} /> Returned</span>;
      default:
        return <span style={{ ...base, color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}>{status}</span>;
    }
  };

  const typeIcons = {
    'Home visit': <Home size={18} />,
    'Medical leave': <Stethoscope size={18} />,
    'Academic / Conference': <GraduationCap size={18} />,
    'Family function': <PartyPopper size={18} />,
    'Weekend outing': <Sun size={18} />,
  };
  const typeColors = {
    'Home visit': '#6366f1',
    'Medical leave': '#ef4444',
    'Academic / Conference': '#0ea5e9',
    'Family function': '#f59e0b',
    'Weekend outing': '#22c55e',
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, outline: 'none',
    border: '1.5px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)',
    transition: 'border-color 0.2s',
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6, letterSpacing: '0.01em' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '40px 48px', position: 'relative' }}>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
            color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '5px 14px',
            borderRadius: 20, marginBottom: 12, border: '1px solid rgba(99,102,241,0.15)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <Plane size={13} /> Night & Vacation Permissions
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.025em' }}>
            Hostel Leave Management
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-tertiary)', margin: 0 }}>
            Apply for home visits, medical leaves, and overnight gate out-passes with warden approval.
          </p>
        </div>
        <button onClick={() => setIsDrawerOpen(true)} style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
          border: 'none', borderRadius: 12, padding: '12px 22px', fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(99,102,241,0.3)', transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)'; }}
        >
          <Plus size={18} /> Apply New Leave
        </button>
      </div>

      {/* ─── KPI Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
        {[
          { label: 'Total Applications', value: myLeaves.length, sub: 'This academic semester', icon: <CalendarOff size={22} />, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
          { label: 'Pending Review', value: pendingCount, sub: 'Awaiting warden sign-off', icon: <Clock size={22} />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
          { label: 'Approved Passes', value: approvedCount, sub: 'Gate QR code generated', icon: <CheckCircle2 size={22} />, gradient: 'linear-gradient(135deg, #059669, #34d399)' },
          {
            label: 'Guardian Consent', value: null, icon: <ShieldCheck size={22} />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            customValue: <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#059669', marginTop: 4 }}><CheckCircle2 size={16} /> Verified via SMS</div>,
            sub: currentStudent?.guardianPhone || '+91 98100 11111',
          },
        ].map((kpi, i) => (
          <div key={i} style={{
            background: 'var(--bg-secondary)', borderRadius: 16, padding: 22,
            border: '1px solid var(--border-primary)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
            display: 'flex', alignItems: 'center', gap: 16,
            transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: kpi.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              {kpi.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{kpi.label}</div>
              {kpi.value !== null ? (
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{kpi.value}</div>
              ) : kpi.customValue}
              {kpi.sub && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{kpi.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Filters ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-secondary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-primary)' }}>
          {[
            { key: 'all', label: `All (${myLeaves.length})` },
            { key: 'pending', label: `Pending (${pendingCount})`, dot: '#f59e0b' },
            { key: 'approved', label: `Approved (${approvedCount})`, dot: '#22c55e' },
            { key: 'completed', label: 'Completed' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
              padding: '8px 18px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: filter === tab.key ? 'var(--accent-500)' : 'transparent',
              color: filter === tab.key ? 'white' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
            }}>
              {tab.dot && <div style={{ width: 7, height: 7, borderRadius: '50%', background: tab.dot }} />}
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Showing {filteredLeaves.length} entries</div>
      </div>

      {/* ─── Leave Cards ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredLeaves.length === 0 ? (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)', padding: 60, textAlign: 'center' }}>
            <CalendarOff size={44} color="var(--text-tertiary)" style={{ opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>No leave records found</div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>You haven't requested any leaves matching this filter.</div>
          </div>
        ) : filteredLeaves.map(leave => {
          const iconColor = typeColors[leave.type] || '#6366f1';
          const icon = typeIcons[leave.type] || <Calendar size={18} />;
          return (
            <div key={leave.id} onClick={() => setSelectedLeave(leave)} style={{
              background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
              transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Status accent bar */}
              <div style={{
                height: 3, background: leave.status === 'approved' ? 'linear-gradient(90deg, #059669, #34d399)' :
                  leave.status === 'pending' ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                    leave.status === 'rejected' ? 'linear-gradient(90deg, #ef4444, #f87171)' :
                      'linear-gradient(90deg, #8b5cf6, #a78bfa)',
              }} />

              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, flex: 1, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${iconColor}12`, color: iconColor, border: `1px solid ${iconColor}20`,
                  }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{leave.type}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{leave.id}</span>
                      {getStatusBadge(leave.status)}
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Calendar size={14} color="var(--text-tertiary)" /> {formatDate(leave.from)} → {formatDate(leave.to)}
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '2px 8px', borderRadius: 6 }}>{leave.days}d</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={14} color="var(--text-tertiary)" /> {leave.destination}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6, fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{leave.reason}"
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-tertiary)" style={{ flexShrink: 0, marginLeft: 16 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Apply Leave Drawer ─── */}
      {isDrawerOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 998 }} onClick={() => setIsDrawerOpen(false)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, background: 'var(--bg-secondary)', zIndex: 999,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid var(--border-primary)',
          }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Plane size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>Apply for Leave</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>Warden and guardian will receive instant notification.</p>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                <div>
                  <label style={labelStyle}>Leave Category <span style={{ color: '#ef4444' }}>*</span></label>
                  <select value={leaveType} onChange={e => setLeaveType(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option>Home visit</option>
                    <option>Medical leave</option>
                    <option>Academic / Conference</option>
                    <option>Family function</option>
                    <option>Weekend outing</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>From Date <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={17} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: 13 }} />
                      <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ ...inputStyle, paddingLeft: 40 }} required />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>To Date <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={17} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: 13 }} />
                      <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ ...inputStyle, paddingLeft: 40 }} required />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Destination City & Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={17} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: 13 }} />
                    <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. 14 Vaishali Nagar, Jaipur"
                      style={{ ...inputStyle, paddingLeft: 40 }} required />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Detailed Reason for Leave <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Provide context for warden review..."
                    style={{ ...inputStyle, minHeight: 80, resize: 'none' }} required />
                  <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{reason.length}/300</div>
                </div>

                <div>
                  <label style={labelStyle}>Guardian / Emergency Contact <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={17} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: 13 }} />
                    <input type="tel" value={parentContact} onChange={e => setParentContact(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 40 }} required />
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-tertiary)', padding: '14px 16px', borderRadius: 12,
                  display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                }}>
                  <input type="checkbox" id="consent" checked={parentConsent} onChange={e => setParentConsent(e.target.checked)}
                    style={{ cursor: 'pointer', marginTop: 2, accentColor: '#6366f1' }} />
                  <label htmlFor="consent" style={{ cursor: 'pointer', lineHeight: 1.5 }}>
                    I confirm that my parents/guardians are aware and have consented to this travel plan.
                  </label>
                </div>

                {formError && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#ef4444',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    padding: '10px 14px', borderRadius: 10,
                  }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <span>{formError}</span>
                  </div>
                )}
              </form>
            </div>

            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: 12 }}>
              <button onClick={() => setIsDrawerOpen(false)} style={{
                flex: 1, padding: 13, borderRadius: 12, border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 2, padding: 13, borderRadius: 12, border: 'none',
                  background: parentConsent ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99, 102, 241, 0.4)',
                  color: 'white', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                  boxShadow: parentConsent ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                <FileText size={16} /> Submit Application
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Detail Drawer ─── */}
      {selectedLeave && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 998 }} onClick={() => setSelectedLeave(null)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--bg-secondary)', zIndex: 999,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid var(--border-primary)',
          }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{selectedLeave.type}</h2>
                  {getStatusBadge(selectedLeave.status)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{selectedLeave.id}</div>
              </div>
              <button onClick={() => setSelectedLeave(null)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Travel Window */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px 18px', borderRadius: 14, border: '1px solid var(--border-primary)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Travel Window</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatDate(selectedLeave.from)} → {formatDate(selectedLeave.to)}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginTop: 4 }}>
                  Duration: {selectedLeave.days} {selectedLeave.days === 1 ? 'Day' : 'Days'}
                </div>
              </div>

              {/* Destination */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Destination</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                  <MapPin size={16} color="#6366f1" /> {selectedLeave.destination}
                </div>
              </div>

              {/* Reason */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Reason</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{selectedLeave.reason}</p>
              </div>

              {/* Contact */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Emergency Contact</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                  <Phone size={16} color="#6366f1" /> {selectedLeave.emergencyContact}
                </div>
              </div>

              {/* Reviewer */}
              {selectedLeave.reviewedBy && (
                <div style={{ padding: '14px 16px', background: 'rgba(5,150,105,0.06)', borderRadius: 12, border: '1px solid rgba(5,150,105,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#059669' }}>
                    <UserCheck size={15} /> Approved by {selectedLeave.reviewedBy}
                  </div>
                  {selectedLeave.remarks && (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, fontStyle: 'italic' }}>"{selectedLeave.remarks}"</p>
                  )}
                </div>
              )}

              {/* Gate Pass */}
              {selectedLeave.status === 'approved' && (
                <div style={{
                  padding: '20px', textAlign: 'center', borderRadius: 14,
                  border: '2px dashed rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)',
                }}>
                  <FileText size={28} color="#6366f1" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>Digital Gate Pass Active</div>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                    Show your hostel ID at Block B or Main Gate turnstile when departing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
