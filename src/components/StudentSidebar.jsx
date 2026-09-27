import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, User, Users, MessageSquareWarning, Bell,
  BedDouble, ClipboardCheck, CalendarOff, CreditCard, UserCheck,
  UtensilsCrossed, Settings, HelpCircle, Zap, Shield
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function StudentSidebar() {
  const { complaints = [], currentStudent } = useHostelStore() || {};
  const activeComplaintsCount = complaints.filter(
    (c) => c.studentId === (currentStudent?.id || 'STU001') && c.status !== 'resolved'
  ).length;

  const mainNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'My Room', icon: BedDouble, path: '/student/room' },
    { label: 'My Roommate', icon: Users, path: '/student/roommate' },
    { label: 'Attendance', icon: ClipboardCheck, path: '/student/attendance' },
    { label: 'Leave', icon: CalendarOff, path: '/student/leave' },
    { label: 'Payments', icon: CreditCard, path: '/student/payments' },
    {
      label: 'Complaints',
      icon: MessageSquareWarning,
      path: '/student/complaints',
      badge: activeComplaintsCount > 0 ? activeComplaintsCount : null
    },
    { label: 'Visitors', icon: UserCheck, path: '/student/visitors' },
    { label: 'Mess', icon: UtensilsCrossed, path: '/student/mess' },
    { label: 'Announcements', icon: Bell, path: '/student/announcements' },
  ];

  const bottomNavItems = [
    { label: 'Profile', icon: User, path: '/student/profile' },
    { label: 'Settings', icon: Settings, path: '/student/settings' },
    { label: 'Help & Support', icon: HelpCircle, path: '/student/help' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <div
          className="sidebar__logo"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 16px rgba(139, 92, 246, 0.45)',
          }}
        >
          <Zap size={16} fill="white" />
        </div>
        <div>
          <span className="sidebar__brand-name" style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            MatchoMate
          </span>
          <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
            Student Portal
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <div className="sidebar__section-label">MAIN MENU</div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
            >
              <span className="sidebar__item-icon">
                <Icon size={18} />
              </span>
              <span className="sidebar__item-text">{item.label}</span>
              {item.badge && (
                <span className="sidebar__item-badge" style={{ marginLeft: 'auto' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Account Items */}
      <div className="sidebar__bottom">
        <div className="sidebar__section-label" style={{ padding: '8px 12px 4px', fontSize: '9.5px' }}>
          ACCOUNT
        </div>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
            >
              <span className="sidebar__item-icon">
                <Icon size={17} />
              </span>
              <span className="sidebar__item-text">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
