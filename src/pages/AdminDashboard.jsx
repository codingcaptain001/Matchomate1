import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, Percent, BedDouble, MessageSquareWarning, Heart, UserPlus, DoorOpen,
  ClipboardCheck, Megaphone, BarChart3, Sparkles, ArrowRight, CreditCard, Wrench,
  UserCheck, CalendarOff, UtensilsCrossed, AlertCircle, CheckCircle2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import KPICard from '../components/KPICard';
import AIInsightCard from '../components/AIInsightCard';
import HealthScore from '../components/HealthScore';
import ActivityTimeline from '../components/ActivityTimeline';
import { useHostelStore } from '../context/HostelStore';
import { inr } from '../components/ops/OpsShared';

const quickActions = [
  { label: 'Attendance', icon: ClipboardCheck, path: '/admin/attendance' },
  { label: 'Fee Payments', icon: CreditCard, path: '/admin/payments' },
  { label: 'Complaints', icon: MessageSquareWarning, path: '/admin/complaints' },
  { label: 'Maintenance', icon: Wrench, path: '/admin/maintenance' },
  { label: 'Visitors Log', icon: UserCheck, path: '/admin/visitors' },
  { label: 'Leave Out-Pass', icon: CalendarOff, path: '/admin/leave' },
  { label: 'Mess Kitchen', icon: UtensilsCrossed, path: '/admin/mess' },
  { label: 'Students', icon: Users, path: '/admin/students' },
];

const occupancyPieDataFrom = (occupancyData) => [
  { name: 'Occupied', value: occupancyData.occupied, color: 'var(--accent-500)' },
  { name: 'Vacant', value: occupancyData.vacant, color: 'var(--gray-300)' },
  { name: 'Reserved', value: occupancyData.reserved, color: 'var(--warning-500)' },
  { name: 'Maintenance', value: occupancyData.maintenance, color: 'var(--danger-400)' },
];

const PIE_COLORS = ['#6366f1', '#d4d4d8', '#f59e0b', '#f87171'];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--gray-900)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 'var(--font-sm)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ fontWeight: 600 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: 'var(--gray-300)', marginTop: 2 }}>
            {p.name}: {p.value}{typeof p.value === 'number' && p.value < 100 ? '%' : ''}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    kpi: kpiData,
    complaintStats: complaintData,
    recentActivity,
    occupancyData,
    hostelHealth,
    roommateIntelligence,
    aiAttentionItems,
    payments,
    attendance,
    students,
    leaveRequests,
    visitors,
    maintenance,
    today,
  } = useHostelStore();

  const [occupancyRange, setOccupancyRange] = useState('7d');
  const trendData = occupancyRange === '7d' ? occupancyData.trend : occupancyData.monthly;
  const trendXKey = occupancyRange === '7d' ? 'day' : 'month';
  const occupancyPieData = occupancyPieDataFrom(occupancyData);

  // Live Operations & Financial Calculations connected to central store
  const feeCollected = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const feePending = payments.filter((p) => p.status === 'pending' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  const pendingStudents = students.filter((s) => s.payment !== 'paid');

  const todayAttendance = attendance.filter((a) => a.date === today);
  const presentToday = todayAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const absentToday = todayAttendance.filter((a) => a.status === 'absent').length;
  const onLeaveToday = todayAttendance.filter((a) => a.status === 'leave').length;
  const unmarkedToday = students.length - todayAttendance.length + todayAttendance.filter((a) => a.status === 'unmarked').length;

  const insideVisitors = visitors.filter((v) => v.status === 'checked-in').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending').length;
  const activeMnt = maintenance.filter((m) => m.status === 'open' || m.status === 'in-progress' || m.status === 'overdue').length;

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">{getGreeting()}, Admin.</h1>
        <p className="page-header__subtitle">ABC Residency Operations & Intelligence Hub · Connected Live State</p>
        <div className="page-header__meta">
          <span className="badge badge--default" style={{ gap: 6, display: 'inline-flex', alignItems: 'center' }}>
            <Calendar size={12} />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <section className="section">
        <div className="grid-kpi animate-stagger">
          <KPICard
            label="Total Students"
            value={students.length}
            change={kpiData.totalStudents.changePercent}
            changePeriod={kpiData.totalStudents.period}
            icon={Users}
          />
          <KPICard
            label="Occupancy"
            value={kpiData.occupancy.value}
            suffix="%"
            change={kpiData.occupancy.change}
            changePeriod={kpiData.occupancy.period}
            icon={Percent}
          />
          <KPICard
            label="Vacant Beds"
            value={kpiData.vacantBeds.value}
            change={kpiData.vacantBeds.changePercent}
            changePeriod={kpiData.vacantBeds.period}
            icon={BedDouble}
          />
          <KPICard
            label="Open Complaints"
            value={complaintData.open + complaintData.inProgress}
            change={kpiData.openComplaints.changePercent}
            changePeriod={kpiData.openComplaints.period}
            icon={MessageSquareWarning}
          />
          <KPICard
            label="Student Experience"
            value={kpiData.studentExperience.value}
            suffix="/100"
            change={kpiData.studentExperience.change}
            changePeriod={kpiData.studentExperience.period}
            icon={Heart}
          />
        </div>
      </section>

      {/* Live Operations & Financial Snapshot */}
      <section className="section" style={{ animation: 'fadeInUp 450ms ease' }}>
        <div className="section__header" style={{ marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={18} style={{ color: 'var(--accent-600)' }} />
              <h2 className="section__title">Operations & Financial Pulse</h2>
            </div>
            <p className="section__subtitle">Live connected state across payments, attendance, complaints, and facility requests.</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-2)'
        }}>
          {/* Finance card */}
          <div className="card card--flat" style={{ border: '1px solid var(--border-primary)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Fee Collection
              </span>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => navigate('/admin/payments')}
                style={{ padding: '2px 8px', fontSize: 'var(--font-xs)' }}
              >
                Payments <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--success-600)' }}>
                {inr(feeCollected)}
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                collected
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Pending Dues: <strong style={{ color: 'var(--warning-600)' }}>{inr(feePending)}</strong>
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {pendingStudents.length} student{pendingStudents.length === 1 ? '' : 's'}: {pendingStudents.map(s => s.name).slice(0, 3).join(', ')}{pendingStudents.length > 3 ? ` +${pendingStudents.length - 3}` : ''}
                </div>
              </div>
              <span className={`badge ${pendingStudents.length > 0 ? 'badge--warning' : 'badge--success'}`}>
                {pendingStudents.length > 0 ? `${pendingStudents.length} Dues` : 'All Clear'}
              </span>
            </div>
          </div>

          {/* Today's Roll Call */}
          <div className="card card--flat" style={{ border: '1px solid var(--border-primary)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Roll Call · Today
              </span>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => navigate('/admin/attendance')}
                style={{ padding: '2px 8px', fontSize: 'var(--font-xs)' }}
              >
                Attendance <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--accent-600)' }}>
                {presentToday} / {students.length}
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                marked present / late
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge badge--success" title="Present">{presentToday} Present</span>
              <span className="badge badge--danger" title="Absent">{absentToday} Absent</span>
              <span className="badge badge--accent" title="On Leave">{onLeaveToday} On Leave</span>
              {unmarkedToday > 0 && (
                <span className="badge badge--default" title="Unmarked">{unmarkedToday} Unmarked</span>
              )}
            </div>
          </div>

          {/* Facilities & Security */}
          <div className="card card--flat" style={{ border: '1px solid var(--border-primary)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Campus Activity
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Live security</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div
                onClick={() => navigate('/admin/visitors')}
                style={{ padding: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)' }}>Visitors Inside</div>
                <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: insideVisitors > 0 ? 'var(--success-600)' : 'var(--text-primary)' }}>
                  {insideVisitors}
                </div>
              </div>
              <div
                onClick={() => navigate('/admin/leave')}
                style={{ padding: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)' }}>Pending Leaves</div>
                <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: pendingLeaves > 0 ? 'var(--warning-600)' : 'var(--text-primary)' }}>
                  {pendingLeaves}
                </div>
              </div>
              <div
                onClick={() => navigate('/admin/maintenance')}
                style={{ padding: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)' }}>Maintenance Jobs</div>
                <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeMnt}
                </div>
              </div>
              <div
                onClick={() => navigate('/admin/complaints')}
                style={{ padding: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)' }}>Active Complaints</div>
                <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: complaintData.open > 0 ? 'var(--danger-600)' : 'var(--text-primary)' }}>
                  {complaintData.open + complaintData.inProgress}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Attention Center */}
      <section className="section">
        <div className="section__header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} style={{ color: 'var(--accent-500)' }} />
              <h2 className="section__title">AI Attention Center</h2>
            </div>
            <p className="section__subtitle">Things that may need your attention.</p>
          </div>
          <button className="btn btn--ghost btn--sm">View all</button>
        </div>
        <div className="grid-2col animate-stagger">
          {aiAttentionItems.map((item) => (
            <AIInsightCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Hostel Health + Occupancy */}
      <section className="section">
        <div className="grid-2col">
          {/* Health Score */}
          <div className="card">
            <div className="section__header" style={{ marginBottom: 'var(--space-5)' }}>
              <div>
                <h3 className="section__title">Hostel Health</h3>
                <p className="section__subtitle">Overall wellness indicator</p>
              </div>
            </div>
            <HealthScore score={hostelHealth.overall} breakdown={hostelHealth.breakdown} />
          </div>

          {/* Occupancy Intelligence */}
          <div className="card">
            <div className="section__header" style={{ marginBottom: 'var(--space-5)' }}>
              <div>
                <h3 className="section__title">Occupancy Intelligence</h3>
                <p className="section__subtitle">Real-time occupancy tracking</p>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['7d', '30d'].map((r) => (
                  <button
                    key={r}
                    className={`btn btn--sm ${occupancyRange === r ? 'btn--primary' : 'btn--ghost'}`}
                    onClick={() => setOccupancyRange(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
              {/* Mini pie */}
              <div style={{ flexShrink: 0 }}>
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie
                      data={occupancyPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {occupancyPieData.map((entry, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 8 }}>
                  {occupancyPieData.map((item, i) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: PIE_COLORS[i] }} />
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trend chart */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey={trendXKey} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                    <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="rate" stroke="#6366f1" fill="url(#occGrad)" strokeWidth={2} name="Occupancy" />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{
                  marginTop: 8, padding: '8px 12px',
                  background: 'var(--accent-50)', borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-xs)', color: 'var(--accent-700)', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Sparkles size={12} />
                  Occupancy increased 4.2% this month.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complaints + Roommate Intelligence */}
      <section className="section">
        <div className="grid-2col">
          {/* Complaint Intelligence */}
          <div className="card">
            <div className="section__header" style={{ marginBottom: 'var(--space-5)' }}>
              <div>
                <h3 className="section__title">Complaint Intelligence</h3>
                <p className="section__subtitle">Trends and AI-powered insights</p>
              </div>
              <button className="btn btn--ghost btn--sm">
                View complaints <ArrowRight size={14} />
              </button>
            </div>

            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={complaintData.trend} barSize={24}>
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Complaints" />
              </BarChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {complaintData.categories.slice(0, 4).map((cat) => (
                <span key={cat.name} className="badge badge--default" style={{ gap: 4, display: 'inline-flex', alignItems: 'center' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color }} />
                  {cat.name} ({cat.count})
                </span>
              ))}
            </div>

            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: 'var(--accent-50)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--accent-500)',
            }}>
              <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-700)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} /> AI Insight
              </div>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--accent-800)', lineHeight: 1.5 }}>
                {complaintData.aiInsight}
              </p>
            </div>
          </div>

          {/* Roommate Intelligence */}
          <div className="card">
            <div className="section__header" style={{ marginBottom: 'var(--space-5)' }}>
              <div>
                <h3 className="section__title">Roommate Intelligence</h3>
                <p className="section__subtitle">Compatibility and risk overview</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <div style={{ flex: 1, padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--accent-600)' }}>{roommateIntelligence.avgCompatibility}%</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>Avg Compatibility</div>
              </div>
              <div style={{ flex: 1, padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--danger-600)' }}>{roommateIntelligence.highRiskRooms}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>High Risk Rooms</div>
              </div>
              <div style={{ flex: 1, padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--success-600)' }}>{roommateIntelligence.recentAllocations}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>Recent Allocations</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {roommateIntelligence.allocations.map((alloc) => (
                <div key={alloc.room} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gray-150)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                >
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)', minWidth: 60 }}>
                    Room {alloc.room}
                  </div>
                  <div style={{ flex: 1, fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>
                    {alloc.students.join(' & ')}
                  </div>
                  <div style={{
                    fontSize: 'var(--font-sm)', fontWeight: 600,
                    color: alloc.score >= 70 ? 'var(--success-600)' : 'var(--danger-600)',
                  }}>
                    {alloc.score}%
                  </div>
                  <span className={`badge ${alloc.risk === 'high' ? 'badge--danger' : 'badge--success'}`}>
                    {alloc.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Activity + Quick Actions */}
      <section className="section">
        <div className="grid-2-1">
          {/* Recent Activity */}
          <div className="card">
            <div className="section__header" style={{ marginBottom: 'var(--space-5)' }}>
              <h3 className="section__title">Recent Activity</h3>
              <button className="btn btn--ghost btn--sm">View all</button>
            </div>
            <ActivityTimeline items={recentActivity} />
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="section__header" style={{ marginBottom: 'var(--space-5)' }}>
              <h3 className="section__title">Quick Actions</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="quick-action-btn"
                    type="button"
                    onClick={() => navigate(action.path)}
                  >
                    <Icon size={20} style={{ color: 'var(--accent-600)' }} />
                    <span style={{ fontSize: 'var(--font-xs)', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
