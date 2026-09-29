import { useLocation, useNavigate } from 'react-router-dom';
import { useHostelStore } from '../context/HostelStore';
import {
  LayoutDashboard, Users, BedDouble, Brain, Shuffle, MessageSquareWarning,
  Wrench, ClipboardCheck, CalendarOff, UserCheck, CreditCard, UtensilsCrossed,
  Megaphone, BarChart3, Sparkles, FileText, Settings, HelpCircle, User,
  Zap
} from 'lucide-react';

const mainNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Students', icon: Users, path: '/admin/students' },
  { label: 'Rooms & Beds', icon: BedDouble, path: '/admin/rooms' },
  { label: 'AI Matching', icon: Brain, path: '/admin/ai-matching', ai: true },
  { label: 'Smart Allocation', icon: Shuffle, path: '/admin/smart-allocation', ai: true },
  { label: 'Attendance', icon: ClipboardCheck, path: '/admin/attendance' },
  { label: 'Leave Requests', icon: CalendarOff, path: '/admin/leave' },
  { label: 'Complaints', icon: MessageSquareWarning, path: '/admin/complaints' },
  { label: 'Maintenance', icon: Wrench, path: '/admin/maintenance' },
  { label: 'Visitors', icon: UserCheck, path: '/admin/visitors' },
  { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
  { label: 'Mess', icon: UtensilsCrossed, path: '/admin/mess' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'AI Insights', icon: Sparkles, path: '/admin/ai-insights', ai: true },
  { label: 'Reports', icon: FileText, path: '/admin/reports' },
  { label: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
];

const bottomNavItems = [
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
  { label: 'Help', icon: HelpCircle, path: '/admin/help' },
  { label: 'Profile', icon: User, path: '/admin/profile' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { complaintStats, leaveRequests, students, maintenance } = useHostelStore();
  const complaintBadge = complaintStats.open + complaintStats.inProgress;
  const leaveBadge = leaveRequests.filter((l) => l.status === 'pending').length;
  const paymentBadge = students.filter((s) => s.payment !== 'paid').length;
  const maintenanceBadge = maintenance.filter((m) => m.status === 'open' || m.status === 'overdue').length;

  const getItemBadge = (path, staticBadge) => {
    if (path === '/admin/complaints') return complaintBadge;
    if (path === '/admin/leave') return leaveBadge;
    if (path === '/admin/payments') return paymentBadge;
    if (path === '/admin/maintenance') return maintenanceBadge;
    return staticBadge;
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Zap size={16} />
        </div>
        <span className="sidebar__brand-name">MatchoMate</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <div className="sidebar__section-label">Main</div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const badgeVal = getItemBadge(item.path, item.badge);
          return (
            <button
              key={item.path}
              className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <span className="sidebar__item-icon">
                <Icon size={18} />
              </span>
              <span className="sidebar__item-text">{item.label}</span>
              {badgeVal ? (
                <span className="sidebar__item-badge">{badgeVal}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="sidebar__bottom">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <span className="sidebar__item-icon">
                <Icon size={18} />
              </span>
              <span className="sidebar__item-text">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
