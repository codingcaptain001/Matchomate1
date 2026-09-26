import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sparkles, ChevronDown, Menu, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studentProfile } from '../data/mockData';

export default function Topbar({ onAIClick, onMobileMenuClick, isStudent }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleProfile = () => {
    navigate(isStudent ? '/student/profile' : '/admin/profile');
    setDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate(isStudent ? '/student/settings' : '/admin/settings');
    setDropdownOpen(false);
  };

  return (
    <header className="topbar">
      {/* Mobile menu button */}
      <button
        className="topbar__action-btn"
        onClick={onMobileMenuClick}
        style={{ display: 'none' }}
        id="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Workspace selector */}
      <button className="topbar__workspace">
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--success-500)', flexShrink: 0
        }} />
        {isStudent ? 'ABC Residency - B-304' : 'ABC Residency'}
        {!isStudent && <ChevronDown size={14} style={{ color: 'var(--text-quaternary)' }} />}
      </button>

      {/* Search */}
      <div className="topbar__search" tabIndex={0} role="button">
        <Search size={16} className="topbar__search-icon" />
        <span className="topbar__search-text">{isStudent ? 'Search...' : 'Search students, rooms, complaints...'}</span>
        <span className="topbar__search-shortcut">⌘K</span>
      </div>

      {/* Actions */}
      <div className="topbar__actions">
        {/* AI button */}
        {!isStudent && (
          <button className="topbar__ai-btn" onClick={onAIClick}>
            <Sparkles size={15} />
            <span>Ask MatchoMate</span>
          </button>
        )}

        {/* Notifications */}
        <button className="topbar__action-btn">
          <Bell size={19} />
          <span className="topbar__notification-dot" />
        </button>

        {/* User */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button className="topbar__user" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="topbar__user-avatar">{isStudent ? studentProfile.avatar : 'AJ'}</div>
          </button>
          
          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 220,
              background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-primary)',
              zIndex: 500, overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-primary)' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>
                  {isStudent ? studentProfile.name : 'Admin User'}
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                  {isStudent ? 'student@matchomate.com' : 'admin@matchomate.com'}
                </div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <button onClick={handleProfile} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 16px', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <User size={16} /> View Profile
                </button>
                <button onClick={handleSettings} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 16px', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <Settings size={16} /> Settings
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 16px', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <Bell size={16} /> Notifications
                </button>
              </div>
              <div style={{ padding: '8px 0', borderTop: '1px solid var(--border-primary)' }}>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 16px', fontSize: 'var(--font-sm)', color: 'var(--danger-600)', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-50)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
