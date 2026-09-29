import { useState, useRef } from 'react';
import {
  Plus, CheckCircle, Clock, AlertCircle, MessageSquareWarning,
  Search, Upload, ChevronLeft, ChevronRight, Wrench, Zap, Droplets,
  Wifi, Bug, Sparkles, MoreVertical, Filter, X, Send, User, CheckCircle2,
  Calendar, ShieldAlert, ArrowUpRight, Flame, Image as ImageIcon, Trash2
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function StudentComplaints() {
  const { currentStudent, complaints, addComplaint, updateComplaint, showToast } = useHostelStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [category, setCategory] = useState('Plumbing');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [followUpNote, setFollowUpNote] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const fileInputRef = useRef(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const myComplaints = complaints.filter((c) => c.studentId === currentStudent?.id);
  const totalComplaints = myComplaints.length;
  const openComplaints = myComplaints.filter(c => c.status === 'open').length;
  const inProgressComplaints = myComplaints.filter(c => c.status === 'in-progress').length;
  const resolvedComplaints = myComplaints.filter(c => c.status === 'resolved').length;

  const filteredComplaints = myComplaints
    .filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.description?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return (a.id || '').localeCompare(b.id || '');
      if (sortBy === 'priority') {
        const pOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      // default latest
      return (b.id || '').localeCompare(a.id || '');
    });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newPhotos = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      size: `${(file.size / 1024).toFixed(1)} KB`
    }));
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (idx) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!description.trim()) {
      showToast?.('Please describe the issue');
      return;
    }
    addComplaint({
      category,
      priority,
      description,
      photos: uploadedPhotos.map(p => p.url)
    });
    setDescription('');
    setUploadedPhotos([]);
    setDrawerOpen(false);
  };

  const handleResolve = (comp) => {
    updateComplaint(comp.id, { status: 'resolved' });
    if (selectedComplaint?.id === comp.id) {
      setSelectedComplaint(prev => ({ ...prev, status: 'resolved' }));
    }
    setActiveMenuId(null);
  };

  const handleReopen = (comp) => {
    updateComplaint(comp.id, { status: 'in-progress' });
    if (selectedComplaint?.id === comp.id) {
      setSelectedComplaint(prev => ({ ...prev, status: 'in-progress' }));
    }
    setActiveMenuId(null);
  };

  const handleEscalate = (comp) => {
    updateComplaint(comp.id, { priority: 'critical' });
    showToast?.(`Complaint ${comp.id} escalated to Critical priority.`);
    if (selectedComplaint?.id === comp.id) {
      setSelectedComplaint(prev => ({ ...prev, priority: 'critical' }));
    }
    setActiveMenuId(null);
  };

  const handleSendFollowUp = (comp) => {
    if (!followUpNote.trim()) return;
    showToast?.(`Note added to complaint ${comp.id}`);
    setFollowUpNote('');
  };

  const categoryIcons = {
    Plumbing: <Droplets size={18} />,
    Electrical: <Zap size={18} />,
    'AC/Heating': <Sparkles size={18} />,
    'Wi-Fi / Internet': <Wifi size={18} />,
    'Pest Control': <Bug size={18} />,
    'Carpentry / Furniture': <Wrench size={18} />,
    Cleanliness: <Sparkles size={18} />,
  };

  const priorityStyles = {
    critical: { bg: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.2)', label: 'Critical Priority' },
    high: { bg: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)', label: 'High Priority' },
    medium: { bg: 'rgba(99, 102, 241, 0.08)', color: '#6366f1', border: 'rgba(99, 102, 241, 0.2)', label: 'Medium Priority' },
    low: { bg: 'rgba(34, 197, 94, 0.08)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.2)', label: 'Low Priority' },
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, outline: 'none',
    border: '1.5px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6, letterSpacing: '0.01em' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '40px 48px', position: 'relative' }}>
      
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
            color: '#6366f1', background: 'rgba(99, 102, 241, 0.08)', padding: '5px 14px',
            borderRadius: 20, marginBottom: 12, border: '1px solid rgba(99, 102, 241, 0.15)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <Wrench size={13} /> Maintenance & Support
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.025em' }}>
            Complaints & Support
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-tertiary)', margin: 0 }}>
            Report maintenance issues or living concerns and track resolution in real-time.
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
            border: 'none', borderRadius: 12, padding: '12px 22px',
            fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.3)'; }}
        >
          <Plus size={18} /> Raise Complaint
        </button>
      </div>

      {/* ─── KPI Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 28 }}>
        {[
          { key: 'all', label: 'Total Complaints', value: totalComplaints, icon: <MessageSquareWarning size={22} />, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
          { key: 'open', label: 'Open', value: openComplaints, icon: <AlertCircle size={22} />, gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
          { key: 'in-progress', label: 'In Progress', value: inProgressComplaints, icon: <Clock size={22} />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
          { key: 'resolved', label: 'Resolved', value: resolvedComplaints, icon: <CheckCircle size={22} />, gradient: 'linear-gradient(135deg, #059669, #34d399)' },
        ].map((kpi, i) => (
          <div
            key={i}
            onClick={() => setStatusFilter(kpi.key)}
            style={{
              background: 'var(--bg-secondary)', borderRadius: 16, padding: 22,
              border: statusFilter === kpi.key ? '2px solid #6366f1' : '1px solid var(--border-primary)',
              boxShadow: statusFilter === kpi.key ? '0 4px 16px rgba(99, 102, 241, 0.15)' : '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
              display: 'flex', alignItems: 'center', gap: 16,
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = statusFilter === kpi.key ? '0 4px 16px rgba(99, 102, 241, 0.15)' : '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)'; }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: kpi.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0,
            }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{kpi.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Filters & Search ─── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1, minWidth: 280 }}>
          <div style={{
            flex: 1, minWidth: 240, maxWidth: 360, background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
            borderRadius: 10, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Search by ID, keyword, or room..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--text-primary)', fontSize: 13 }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 10,
              padding: '9px 14px', fontSize: 13, color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="all">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="AC/Heating">AC/Heating</option>
            <option value="Carpentry / Furniture">Carpentry / Furniture</option>
            <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
            <option value="Pest Control">Pest Control</option>
            <option value="Cleanliness">Cleanliness</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 10,
              padding: '9px 14px', fontSize: 13, color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 10,
              padding: '9px 14px', fontSize: 13, color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Highest Priority First</option>
          </select>
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
          Showing <strong>{filteredComplaints.length}</strong> of {totalComplaints} tickets
        </div>
      </div>

      {/* ─── Complaints List ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredComplaints.length === 0 ? (
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
            padding: 60, textAlign: 'center',
          }}>
            <MessageSquareWarning size={44} color="var(--text-tertiary)" style={{ opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>No complaints match your criteria</div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try resetting the filters to see all tickets.'
                : 'Your room is in great shape! Tap "Raise Complaint" if anything needs fixing.'}
            </div>
            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); setPriorityFilter('all'); }}
                style={{
                  marginTop: 14, padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border-primary)',
                  background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : filteredComplaints.map(comp => {
          const pStyle = priorityStyles[comp.priority] || priorityStyles.low;
          const catIcon = categoryIcons[comp.category] || <Wrench size={18} />;
          const isResolved = comp.status === 'resolved';
          const isInProgress = comp.status === 'in-progress';

          return (
            <div
              key={comp.id}
              onClick={() => setSelectedComplaint(comp)}
              style={{
                background: 'var(--bg-secondary)', borderRadius: 16,
                border: '1px solid var(--border-primary)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer', position: 'relative'
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Status accent bar */}
              <div style={{
                height: 3,
                background: isResolved ? 'linear-gradient(90deg, #059669, #34d399)' :
                  isInProgress ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                    'linear-gradient(90deg, #ef4444, #f87171)',
              }} />

              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 16, flex: 1, minWidth: 280 }}>
                    {/* Category Icon */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                      background: isResolved ? 'rgba(5, 150, 105, 0.08)' : 'rgba(99, 102, 241, 0.08)',
                      color: isResolved ? '#059669' : '#6366f1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${isResolved ? 'rgba(5, 150, 105, 0.12)' : 'rgba(99, 102, 241, 0.12)'}`,
                    }}>
                      {catIcon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Meta row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono, monospace)' }}>{comp.id}</span>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-primary)' }} />
                        <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{comp.category}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                          background: pStyle.bg, color: pStyle.color, border: `1px solid ${pStyle.border}`,
                          letterSpacing: '0.02em',
                        }}>{pStyle.label}</span>
                      </div>
                      {/* Title */}
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.4 }}>{comp.description}</h3>
                      {/* Sub */}
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                        Logged on {comp.createdOn || 'Today'} · Assigned to: <strong style={{ color: 'var(--text-secondary)' }}>{comp.assignedTo || 'Maintenance Support Team'}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
                      padding: '6px 14px', borderRadius: 20,
                      ...(isResolved ? { color: '#059669', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.15)' }
                        : isInProgress ? { color: '#d97706', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.15)' }
                          : { color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }),
                    }}>
                      {isResolved ? <CheckCircle size={14} /> : isInProgress ? <Clock size={14} /> : <AlertCircle size={14} />}
                      {isResolved ? 'Resolved' : isInProgress ? 'In Progress' : 'Open'}
                    </span>

                    {/* Action dropdown menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === comp.id ? null : comp.id);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 6, borderRadius: 6 }}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === comp.id && (
                        <div style={{
                          position: 'absolute', top: '100%', right: 0, width: 180, background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-primary)', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                          padding: 6, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 2,
                        }}>
                          <button
                            onClick={() => { setSelectedComplaint(comp); setActiveMenuId(null); }}
                            style={{ padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}
                          >
                            <ArrowUpRight size={14} /> View Details
                          </button>
                          {!isResolved ? (
                            <button
                              onClick={() => handleResolve(comp)}
                              style={{ padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', fontSize: 13, color: '#059669', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                              <CheckCircle2 size={14} /> Mark Resolved
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReopen(comp)}
                              style={{ padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', fontSize: 13, color: '#f59e0b', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                              <Clock size={14} /> Reopen Ticket
                            </button>
                          )}
                          {comp.priority !== 'critical' && !isResolved && (
                            <button
                              onClick={() => handleEscalate(comp)}
                              style={{ padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', fontSize: 13, color: '#ef4444', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                              <Flame size={14} /> Escalate Priority
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ─── Pipeline ─── */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 20, paddingLeft: 60, flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { label: 'Registered', time: comp.createdOn || 'Today', done: true },
                    { label: 'Assigned', time: comp.status !== 'open' ? 'Technician assigned' : 'Queueing...', done: comp.status !== 'open' },
                    { label: 'In Progress', time: comp.status === 'resolved' || comp.status === 'in-progress' ? 'Work underway' : 'Pending', done: comp.status === 'resolved' || comp.status === 'in-progress' },
                    { label: 'Closed', time: comp.status === 'resolved' ? 'Verified' : '—', done: comp.status === 'resolved' },
                  ].map((step, si) => (
                    <div key={si} style={{ display: 'flex', alignItems: 'center', flex: si < 3 ? 1 : 'none', minWidth: 120 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                          background: step.done ? '#059669' : 'var(--bg-tertiary)',
                          color: step.done ? 'white' : 'var(--text-tertiary)',
                          border: step.done ? 'none' : '2px solid var(--border-primary)',
                          transition: 'all 0.3s',
                        }}>
                          {step.done ? '✓' : ''}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: step.done ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{step.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{step.time}</div>
                        </div>
                      </div>
                      {si < 3 && (
                        <div style={{
                          flex: 1, height: 2, margin: '0 12px', minWidth: 20,
                          background: step.done ? '#059669' : 'var(--border-primary)',
                          borderRadius: 1, transition: 'background 0.3s',
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Create Complaint Drawer ─── */}
      {drawerOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 998 }} onClick={() => setDrawerOpen(false)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(440px, 92vw)', background: 'var(--bg-secondary)', zIndex: 999,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid var(--border-primary)',
          }}>
            {/* Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <MessageSquareWarning size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>Raise Maintenance Complaint</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>Report any maintenance or living issue for your room.</p>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>
            
            {/* Body */}
            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Room */}
                <div>
                  <label style={labelStyle}>Assigned Room</label>
                  <div style={{
                    background: 'var(--bg-tertiary)', padding: '14px 16px', borderRadius: 12,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    border: '1px solid var(--border-primary)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99, 102, 241, 0.08)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertCircle size={18} />
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{currentStudent?.room || 'B-304'}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>ABC Residency</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Block B · Floor 3</div>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label style={labelStyle}>Issue Category <span style={{ color: '#ef4444' }}>*</span></label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>AC/Heating</option>
                    <option>Carpentry / Furniture</option>
                    <option>Wi-Fi / Internet</option>
                    <option>Pest Control</option>
                    <option>Cleanliness</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label style={labelStyle}>Priority Level <span style={{ color: '#ef4444' }}>*</span></label>
                  <select value={priority} onChange={e => setPriority(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="low">Low (Cosmetic / Routine)</option>
                    <option value="medium">Medium (Requires attention within 24h)</option>
                    <option value="high">High (Affecting daily routine)</option>
                    <option value="critical">Critical (Water leak / Power breakdown)</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Detailed Description <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the issue clearly (e.g., Washroom faucet leaking continuously since morning)..."
                    style={{ ...inputStyle, minHeight: 100, resize: 'none' }}
                    required
                  />
                  <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{description.length}/500</div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label style={labelStyle}>Add Photos <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, fontSize: 11 }}>(Optional)</span></label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--border-primary)', borderRadius: 12, padding: 24,
                      textAlign: 'center', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <Upload size={26} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Click to upload photos</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>Supports JPG, PNG (Max 5MB each)</div>
                  </div>

                  {uploadedPhotos.length > 0 && (
                    <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                      {uploadedPhotos.map((photo, i) => (
                        <div key={i} style={{ position: 'relative', width: 68, height: 68, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
                          <img src={photo.url} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            style={{
                              position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: '50%',
                              background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: 12 }}>
              <button onClick={() => setDrawerOpen(false)} style={{
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
                <CheckCircle size={16} /> Submit Complaint
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Complaint Detail & Tracking Drawer ─── */}
      {selectedComplaint && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 998 }} onClick={() => setSelectedComplaint(null)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(460px, 92vw)', background: 'var(--bg-secondary)', zIndex: 999,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid var(--border-primary)',
          }}>
            {/* Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#6366f1', fontFamily: 'var(--font-mono, monospace)' }}>
                    {selectedComplaint.id}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                    background: priorityStyles[selectedComplaint.priority]?.bg,
                    color: priorityStyles[selectedComplaint.priority]?.color,
                    border: `1px solid ${priorityStyles[selectedComplaint.priority]?.border}`,
                  }}>
                    {selectedComplaint.priority?.toUpperCase()}
                  </span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {selectedComplaint.category}
                </h2>
              </div>
              <button onClick={() => setSelectedComplaint(null)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Description */}
              <div style={{ background: 'var(--bg-tertiary)', padding: 18, borderRadius: 14, border: '1px solid var(--border-primary)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Description</div>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>{selectedComplaint.description}</p>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 10 }}>Room: <strong>{selectedComplaint.room || currentStudent?.room || 'B-304'}</strong> · Logged: {selectedComplaint.createdOn || 'Today'}</div>
              </div>

              {/* Status & Tech Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 12, border: '1px solid var(--border-primary)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Status</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: selectedComplaint.status === 'resolved' ? '#059669' : selectedComplaint.status === 'in-progress' ? '#d97706' : '#ef4444', marginTop: 4 }}>
                    {selectedComplaint.status?.toUpperCase()}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 12, border: '1px solid var(--border-primary)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Assigned To</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedComplaint.assignedTo || 'Maintenance Desk'}
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Progress Milestones</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 8 }}>
                  {[
                    { title: 'Ticket Lodged', desc: `Submitted by ${currentStudent?.name || 'Student'}`, time: selectedComplaint.createdOn || 'Today', done: true },
                    { title: 'Assigned to Technician', desc: `Assigned to ${selectedComplaint.assignedTo || 'Maintenance Desk'}`, time: selectedComplaint.status !== 'open' ? 'Today' : 'Pending', done: selectedComplaint.status !== 'open' },
                    { title: 'Inspection & Repair', desc: 'Technician on-site inspection', time: selectedComplaint.status === 'resolved' || selectedComplaint.status === 'in-progress' ? 'In progress' : 'Pending', done: selectedComplaint.status === 'resolved' || selectedComplaint.status === 'in-progress' },
                    { title: 'Work Verified & Closed', desc: 'Student or Warden closure sign-off', time: selectedComplaint.status === 'resolved' ? 'Completed' : 'Pending', done: selectedComplaint.status === 'resolved' },
                  ].map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: step.done ? '#059669' : 'var(--bg-tertiary)',
                        color: step.done ? 'white' : 'var(--text-tertiary)',
                        border: step.done ? 'none' : '2px solid var(--border-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                      }}>
                        {step.done ? '✓' : idx + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: step.done ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{step.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{step.desc}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{step.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Note / Follow-up */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Add Note or Update</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={followUpNote}
                    onChange={e => setFollowUpNote(e.target.value)}
                    placeholder="Message the maintenance desk..."
                    style={{ ...inputStyle, padding: '10px 12px', fontSize: 13 }}
                  />
                  <button
                    onClick={() => handleSendFollowUp(selectedComplaint)}
                    style={{
                      background: '#6366f1', color: 'white', border: 'none', borderRadius: 10,
                      padding: '0 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: 10 }}>
              {selectedComplaint.status !== 'resolved' ? (
                <button
                  onClick={() => handleResolve(selectedComplaint)}
                  style={{
                    flex: 1, padding: 13, borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #059669, #34d399)', color: 'white',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                    boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
                  }}
                >
                  <CheckCircle2 size={16} /> Mark as Resolved
                </button>
              ) : (
                <button
                  onClick={() => handleReopen(selectedComplaint)}
                  style={{
                    flex: 1, padding: 13, borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: 'white',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                  }}
                >
                  <Clock size={16} /> Reopen Ticket
                </button>
              )}
              {selectedComplaint.priority !== 'critical' && selectedComplaint.status !== 'resolved' && (
                <button
                  onClick={() => handleEscalate(selectedComplaint)}
                  style={{
                    padding: '13px 18px', borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
                  }}
                >
                  <Flame size={15} /> Escalate
                </button>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}

