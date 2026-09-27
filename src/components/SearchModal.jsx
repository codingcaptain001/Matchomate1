import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, BedDouble, Users, Bell, MessageSquareWarning,
  CreditCard, UtensilsCrossed, CalendarOff, UserCheck, Settings,
  ArrowRight, Sparkles, Shield, Building
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function SearchModal({ isOpen, onClose, isStudent }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const {
    rooms = [],
    students = [],
    announcements = [],
    complaints = [],
    payments = [],
    messMenu = [],
  } = useHostelStore() || {};

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable items list
  const allItems = [
    // Quick navigation pages
    { id: 'p-1', title: 'Dashboard', subtitle: 'Overview & daily hostel updates', category: 'pages', path: isStudent ? '/student/dashboard' : '/admin/dashboard', icon: Building },
    { id: 'p-2', title: 'My Room & Allocation', subtitle: 'Room B-304 details, bed occupancy, amenities', category: 'pages', path: isStudent ? '/student/room' : '/admin/rooms', icon: BedDouble },
    { id: 'p-3', title: 'My Roommate & Compatibility', subtitle: 'Aman Kumar (94% Match), habits, schedule', category: 'pages', path: isStudent ? '/student/roommate' : '/admin/ai-matching', icon: Users },
    { id: 'p-4', title: 'Gate Attendance & In/Out Scan', subtitle: 'Biometric gate passes, live status, daily logs', category: 'pages', path: isStudent ? '/student/attendance' : '/admin/attendance', icon: Shield },
    { id: 'p-5', title: 'Fee Payments & Billing Ledger', subtitle: 'Pay hostel fees, invoices, download receipts', category: 'pages', path: isStudent ? '/student/payments' : '/admin/payments', icon: CreditCard },
    { id: 'p-6', title: 'Complaints & Maintenance', subtitle: 'Raise ticket, track repair status', category: 'pages', path: isStudent ? '/student/complaints' : '/admin/complaints', icon: MessageSquareWarning },
    { id: 'p-7', title: 'Mess Menu & Food Services', subtitle: 'Weekly dining schedule, skip meal, feedback', category: 'pages', path: isStudent ? '/student/mess' : '/admin/mess', icon: UtensilsCrossed },
    { id: 'p-8', title: 'Leave & Out-Pass Requests', subtitle: 'Apply for home visit or overnight stay', category: 'pages', path: isStudent ? '/student/leave' : '/admin/leave', icon: CalendarOff },
    { id: 'p-9', title: 'Visitor Passes', subtitle: 'Pre-register guests, parent visits', category: 'pages', path: isStudent ? '/student/visitors' : '/admin/visitors', icon: UserCheck },
    { id: 'p-10', title: 'Account Settings & Preferences', subtitle: 'Notifications, dark theme, security', category: 'pages', path: isStudent ? '/student/settings' : '/admin/settings', icon: Settings },

    // Announcements
    ...announcements.map((a) => ({
      id: `ann-${a.id}`,
      title: a.title,
      subtitle: `${a.category} · ${a.description}`,
      category: 'announcements',
      path: isStudent ? '/student/announcements' : '/admin/announcements',
      icon: Bell,
    })),

    // Rooms
    ...rooms.map((r) => ({
      id: `rm-${r.id}`,
      title: `Room ${r.number} (${r.block || 'Block B'})`,
      subtitle: `${r.type} · ${r.occupancy}/${r.capacity} Occupants · Floor ${r.floor || 3}`,
      category: 'rooms',
      path: isStudent ? '/student/room' : '/admin/rooms',
      icon: BedDouble,
    })),

    // Complaints
    ...complaints.map((c) => ({
      id: `cmp-${c.id}`,
      title: `${c.category || 'Complaint'}: ${c.description?.slice(0, 45)}...`,
      subtitle: `Status: ${c.status} · Priority: ${c.priority || 'Medium'}`,
      category: 'complaints',
      path: isStudent ? '/student/complaints' : '/admin/complaints',
      icon: MessageSquareWarning,
    })),

    // Payments
    ...payments.map((p) => ({
      id: `pmt-${p.id}`,
      title: `${p.type || 'Hostel Fee'} - ₹${p.amount?.toLocaleString('en-IN')}`,
      subtitle: `Month: ${p.month} · Status: ${p.status?.toUpperCase()}`,
      category: 'payments',
      path: isStudent ? '/student/payments' : '/admin/payments',
      icon: CreditCard,
    })),

    // Mess items
    ...messMenu.slice(0, 6).map((m) => ({
      id: `mess-${m.id}`,
      title: `${m.day} ${m.meal}: ${m.items}`,
      subtitle: `Timing: ${m.time}`,
      category: 'mess',
      path: isStudent ? '/student/mess' : '/admin/mess',
      icon: UtensilsCrossed,
    })),
  ];

  const filtered = allItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    if (!matchesCategory) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
  });

  const handleSelect = (item) => {
    onClose();
    navigate(item.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="command-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 620,
          maxWidth: '92vw',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Search input header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-primary)',
          background: 'var(--bg-tertiary)',
        }}>
          <Search size={20} style={{ color: 'var(--accent-400)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder={isStudent ? "Search rooms, announcements, complaints, mess, payments..." : "Search students, rooms, complaints, staff..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              fontSize: '15px',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ color: 'var(--text-tertiary)', padding: 4, borderRadius: 4 }}
            >
              <X size={16} />
            </button>
          )}
          <span style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            background: 'var(--bg-secondary)',
            padding: '3px 7px',
            borderRadius: 6,
            border: '1px solid var(--border-primary)',
            fontWeight: 600,
          }}>
            ESC
          </span>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: 6,
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-secondary)',
          overflowX: 'auto',
          background: 'var(--bg-secondary)',
        }}>
          {[
            { id: 'all', label: 'All Results' },
            { id: 'pages', label: 'Quick Pages' },
            { id: 'rooms', label: 'Rooms' },
            { id: 'announcements', label: 'Announcements' },
            { id: 'complaints', label: 'Complaints' },
            { id: 'mess', label: 'Mess' },
            { id: 'payments', label: 'Payments' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedIndex(0);
              }}
              style={{
                fontSize: '12px',
                fontWeight: activeCategory === cat.id ? 600 : 500,
                padding: '4px 12px',
                borderRadius: 20,
                background: activeCategory === cat.id ? 'var(--accent-500)' : 'var(--bg-tertiary)',
                color: activeCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (activeCategory === cat.id ? 'var(--accent-500)' : 'var(--border-primary)'),
                cursor: 'pointer',
                transition: 'all 150ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Sparkles size={28} style={{ opacity: 0.4, margin: '0 auto 8px' }} />
              <div style={{ fontSize: '14px', fontWeight: 600 }}>No matching results found</div>
              <div style={{ fontSize: '12px', marginTop: 4 }}>Try searching for "Room B-304", "Mess", "Payment", or "Warden"</div>
            </div>
          ) : (
            filtered.slice(0, 20).map((item, idx) => {
              const Icon = item.icon || Building;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                    transition: 'all 120ms ease',
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: isSelected ? 'var(--accent-500)' : 'var(--bg-tertiary)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontSize: '11.5px',
                      color: 'var(--text-tertiary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: 1,
                    }}>
                      {item.subtitle}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10.5px',
                    textTransform: 'uppercase',
                    color: 'var(--text-quaternary)',
                    background: 'var(--bg-tertiary)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                  }}>
                    {item.category}
                  </span>
                  <ArrowRight size={14} style={{ color: isSelected ? 'var(--accent-400)' : 'var(--text-quaternary)', opacity: isSelected ? 1 : 0.4 }} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 18px',
          borderTop: '1px solid var(--border-primary)',
          background: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: 'var(--text-tertiary)',
        }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <span><kbd style={{ padding: '2px 4px', background: 'var(--bg-secondary)', borderRadius: 3, border: '1px solid var(--border-primary)' }}>↑↓</kbd> Navigate</span>
            <span><kbd style={{ padding: '2px 4px', background: 'var(--bg-secondary)', borderRadius: 3, border: '1px solid var(--border-primary)' }}>↵</kbd> Select</span>
            <span><kbd style={{ padding: '2px 4px', background: 'var(--bg-secondary)', borderRadius: 3, border: '1px solid var(--border-primary)' }}>ESC</kbd> Close</span>
          </div>
          <span style={{ color: 'var(--accent-400)', fontWeight: 600 }}>MatchoMate Instant Search</span>
        </div>
      </div>
    </div>
  );
}
