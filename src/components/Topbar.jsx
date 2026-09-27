import { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, Sparkles, ChevronDown, Menu, User, Settings, LogOut,
  Sun, Moon, Building, HelpCircle, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studentProfile } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './SearchModal';
import HostelSwitcherModal from './HostelSwitcherModal';
import NotificationsDropdown from './NotificationsDropdown';

export default function Topbar({ onAIClick, onMobileMenuClick, isStudent }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [hostelModalOpen, setHostelModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const profileRef = useRef(null);
  const notifBtnRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleProfile = () => {
    navigate(isStudent ? '/student/profile' : '/admin/profile');
    setProfileDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate(isStudent ? '/student/settings' : '/admin/settings');
    setProfileDropdownOpen(false);
  };

  const handleHelp = () => {
    navigate(isStudent ? '/student/help' : '/admin/help');
    setProfileDropdownOpen(false);
  };

  return (
    <>
      <header className="topbar">
        {/* Mobile menu button */}
        <button
          className="topbar__action-btn"
          onClick={onMobileMenuClick}
          style={{ display: 'none' }}
          id="mobile-menu-btn"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Workspace selector button (ABC Residency - B-304) */}
        <button
          type="button"
          className="topbar__workspace"
          onClick={() => setHostelModalOpen(true)}
          title="Click to view or switch hostel residence"
        >
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--success-500)', flexShrink: 0,
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)'
          }} />
          <span style={{ fontWeight: 600 }}>
            {isStudent ? 'ABC Residency - B-304' : 'ABC Residency (Admin)'}
          </span>
          <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', marginLeft: 2 }} />
        </button>

        {/* Search Bar with interactive click and shortcut */}
        <div
          className="topbar__search"
          tabIndex={0}
          role="button"
          onClick={() => setSearchModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSearchModalOpen(true);
            }
          }}
          title="Click or press ⌘K to search"
        >
          <Search size={16} className="topbar__search-icon" />
          <span className="topbar__search-text">
            {isStudent ? 'Search rooms, announcements...' : 'Search students, rooms, complaints...'}
          </span>
          <span className="topbar__search-shortcut">⌘K</span>
        </div>

        {/* Actions Group */}
        <div className="topbar__actions">
          {/* Ask MatchoMate AI Copilot (Admin or Student) */}
          {!isStudent && (
            <button className="topbar__ai-btn" onClick={onAIClick}>
              <Sparkles size={15} />
              <span>Ask MatchoMate</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            className="topbar__action-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
            style={{
              color: theme === 'dark' ? '#fbbf24' : '#6366f1',
              transition: 'transform 200ms ease',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications button with Popover */}
          <div style={{ position: 'relative' }} ref={notifBtnRef}>
            <button
              type="button"
              className="topbar__action-btn"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 && <span className="topbar__notification-dot" />}
            </button>

            <NotificationsDropdown
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              unreadCount={unreadCount}
              setUnreadCount={setUnreadCount}
              isStudent={isStudent}
            />
          </div>

          {/* User Profile Pill & Dropdown */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              type="button"
              className="topbar__user"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              title="Account Menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '4px 8px 4px 4px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div
                className="topbar__user-avatar"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-500), #7c3aed)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isStudent ? (studentProfile?.avatar || 'RS') : 'AJ'}
              </div>

              {/* Name & Course metadata on desktop */}
              <div style={{ textAlign: 'left', lineHeight: 1.2, paddingRight: 4 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {isStudent ? (studentProfile?.name || 'Rahul Sharma') : 'Admin User'}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>
                  {isStudent ? (studentProfile?.course || 'B.Tech CSE') : 'Super Admin'}
                </div>
              </div>
            </button>
            
            {profileDropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 10, width: 230,
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-primary)',
                border: '1px solid var(--border-primary)',
                zIndex: 500, overflow: 'hidden',
                animation: 'scaleIn 150ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {isStudent ? (studentProfile?.name || 'Rahul Sharma') : 'Admin User'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {isStudent ? 'rahul.sharma@matchomate.com' : 'admin@matchomate.com'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <span className="badge badge--success" style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                      ● Active In Hostel
                    </span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-quaternary)' }}>
                      Room B-304
                    </span>
                  </div>
                </div>

                <div style={{ padding: '6px' }}>
                  <button
                    type="button"
                    onClick={handleProfile}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '8px 12px', fontSize: '12.5px', color: 'var(--text-secondary)',
                      borderRadius: 6, textAlign: 'left', transition: 'all 120ms ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <User size={15} style={{ color: 'var(--accent-400)' }} /> View Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleSettings}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '8px 12px', fontSize: '12.5px', color: 'var(--text-secondary)',
                      borderRadius: 6, textAlign: 'left', transition: 'all 120ms ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <Settings size={15} style={{ color: 'var(--accent-400)' }} /> Settings & Theme
                  </button>

                  <button
                    type="button"
                    onClick={handleHelp}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '8px 12px', fontSize: '12.5px', color: 'var(--text-secondary)',
                      borderRadius: 6, textAlign: 'left', transition: 'all 120ms ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <HelpCircle size={15} style={{ color: 'var(--accent-400)' }} /> Help & Support
                  </button>
                </div>

                <div style={{ padding: '6px', borderTop: '1px solid var(--border-primary)' }}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '8px 12px', fontSize: '12.5px', color: 'var(--danger-500)',
                      borderRadius: 6, textAlign: 'left', fontWeight: 600, transition: 'all 120ms ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        isStudent={isStudent}
      />

      <HostelSwitcherModal
        isOpen={hostelModalOpen}
        onClose={() => setHostelModalOpen(false)}
        isStudent={isStudent}
      />
    </>
  );
}
