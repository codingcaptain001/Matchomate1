import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Users, MessageSquareWarning, Bell, BedDouble, ClipboardCheck, CalendarOff, CreditCard, UserCheck, UtensilsCrossed, Settings, HelpCircle, Zap } from 'lucide-react';

export default function StudentSidebar() {
  const mainNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'My Room', icon: BedDouble, path: '/student/room' },
    { label: 'My Roommate', icon: Users, path: '/student/roommate' },
    { label: 'Attendance', icon: ClipboardCheck, path: '/student/attendance' },
    { label: 'Leave', icon: CalendarOff, path: '/student/leave' },
    { label: 'Payments', icon: CreditCard, path: '/student/payments' },
    { label: 'Complaints', icon: MessageSquareWarning, path: '/student/complaints' },
    { label: 'Visitors', icon: UserCheck, path: '/student/visitors' },
    { label: 'Mess', icon: UtensilsCrossed, path: '/student/mess' },
    { label: 'Announcements', icon: Bell, path: '/student/announcements' },
  ];

  const bottomNavItems = [
    { label: 'Profile', icon: User, path: '/student/profile' },
    { label: 'Settings', icon: Settings, path: '/student/settings' },
    { label: 'Help', icon: HelpCircle, path: '/student/help' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Zap size={16} />
        </div>
        <div>
          <span className="sidebar__brand-name">MatchoMate</span>
          <div style={{ fontSize: '10px', color: 'var(--text-sidebar)', opacity: 0.7, fontWeight: 500 }}>
            Student Workspace
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <div className="sidebar__section-label">Main Menu</div>
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
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Switcher */}
      <div className="sidebar__bottom">
        {bottomNavItems.map((item) => {
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
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
