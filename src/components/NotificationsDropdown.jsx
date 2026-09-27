import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Check, CheckCheck, Trash2, UtensilsCrossed, AlertTriangle,
  Calendar, CreditCard, ShieldCheck, ArrowRight, Sparkles
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function NotificationsDropdown({ isOpen, onClose, unreadCount, setUnreadCount, isStudent }) {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useHostelStore() || {};

  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState([
    {
      id: 'n-1',
      title: 'Mess Menu Updated',
      desc: 'New menu for this week is now available. Check it out!',
      time: '2 hours ago',
      category: 'mess',
      icon: UtensilsCrossed,
      iconColor: '#0284c7',
      unread: true,
      path: isStudent ? '/student/mess' : '/admin/mess',
    },
    {
      id: 'n-2',
      title: 'Block B Water Maintenance',
      desc: 'Water supply in Block B will be off tomorrow from 10 AM to 2 PM.',
      time: '1 day ago',
      category: 'maintenance',
      icon: AlertTriangle,
      iconColor: 'var(--warning-500)',
      unread: true,
      path: isStudent ? '/student/announcements' : '/admin/announcements',
    },
    {
      id: 'n-3',
      title: 'Cultural Night Registration',
      desc: 'Registrations are now open for the Annual Cultural Night 2026.',
      time: '2 days ago',
      category: 'events',
      icon: Calendar,
      iconColor: '#7c3aed',
      unread: false,
      path: isStudent ? '/student/announcements' : '/admin/announcements',
    },
    {
      id: 'n-4',
      title: 'Fee Payment Due Soon',
      desc: 'September 2026 hostel fee payment of ₹12,500 due on 5 Sept 2026.',
      time: '3 days ago',
      category: 'payments',
      icon: CreditCard,
      iconColor: 'var(--accent-500)',
      unread: false,
      path: isStudent ? '/student/payments' : '/admin/payments',
    },
    {
      id: 'n-5',
      title: 'Biometric Gate Scan Logged',
      desc: 'Entry recorded at Block B Main Gate at 06:18 PM.',
      time: 'Today',
      category: 'attendance',
      icon: ShieldCheck,
      iconColor: 'var(--success-500)',
      unread: false,
      path: isStudent ? '/student/attendance' : '/admin/attendance',
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
    setUnreadCount(0);
    if (showToast) showToast('All notifications marked as read.');
  };

  const handleItemClick = (item) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, unread: false } : i)));
    setUnreadCount((prev) => Math.max(0, prev - (item.unread ? 1 : 0)));
    onClose();
    navigate(item.path);
  };

  const handleClearAll = () => {
    setItems([]);
    setUnreadCount(0);
    if (showToast) showToast('Notifications cleared.');
  };

  const filteredItems = items.filter((item) => (activeTab === 'unread' ? item.unread : true));
  const currentUnread = items.filter((i) => i.unread).length;

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 10,
        width: 380,
        maxWidth: '92vw',
        background: 'var(--bg-secondary)',
        borderRadius: 14,
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-primary)',
        border: '1px solid var(--border-primary)',
        zIndex: 500,
        overflow: 'hidden',
        animation: 'scaleIn 180ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-tertiary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={17} style={{ color: 'var(--accent-400)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Notifications
          </h3>
          {currentUnread > 0 && (
            <span className="badge badge--danger" style={{ fontSize: '10px', padding: '1px 6px' }}>
              {currentUnread} new
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {currentUnread > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              title="Mark all as read"
              style={{
                fontSize: '11px',
                color: 'var(--accent-400)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 600,
              }}
            >
              <CheckCheck size={14} /> Mark Read
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-secondary)',
        background: 'var(--bg-secondary)',
        padding: '6px 12px',
        gap: 6,
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            fontSize: '12px',
            fontWeight: activeTab === 'all' ? 600 : 500,
            padding: '4px 10px',
            borderRadius: 6,
            background: activeTab === 'all' ? 'var(--bg-tertiary)' : 'transparent',
            color: activeTab === 'all' ? 'var(--text-primary)' : 'var(--text-tertiary)',
          }}
        >
          All ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('unread')}
          style={{
            fontSize: '12px',
            fontWeight: activeTab === 'unread' ? 600 : 500,
            padding: '4px 10px',
            borderRadius: 6,
            background: activeTab === 'unread' ? 'var(--bg-tertiary)' : 'transparent',
            color: activeTab === 'unread' ? 'var(--text-primary)' : 'var(--text-tertiary)',
          }}
        >
          Unread ({currentUnread})
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight: 340, overflowY: 'auto', padding: '6px' }}>
        {filteredItems.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <Sparkles size={24} style={{ opacity: 0.3, margin: '0 auto 6px' }} />
            <div style={{ fontSize: '13px', fontWeight: 600 }}>No notifications</div>
            <div style={{ fontSize: '11px', marginTop: 2 }}>You're all caught up!</div>
          </div>
        ) : (
          filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: item.unread ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  border: item.unread ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                  marginBottom: 4,
                  transition: 'all 120ms ease',
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--bg-tertiary)',
                  color: item.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <span style={{
                      fontSize: '12.5px',
                      fontWeight: item.unread ? 700 : 600,
                      color: 'var(--text-primary)',
                    }}>
                      {item.title}
                    </span>
                    {item.unread && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-500)', flexShrink: 0 }} />
                    )}
                  </div>
                  <p style={{
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}>
                    {item.desc}
                  </p>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-quaternary)', marginTop: 4, display: 'inline-block' }}>
                    {item.time}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid var(--border-primary)',
        background: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
      }}>
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate(isStudent ? '/student/announcements' : '/admin/announcements');
          }}
          style={{ color: 'var(--accent-400)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          View all notices <ArrowRight size={12} />
        </button>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            style={{ color: 'var(--text-quaternary)', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Trash2 size={11} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
