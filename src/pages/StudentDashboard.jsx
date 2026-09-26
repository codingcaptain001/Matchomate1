import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BedDouble, Users, AlertCircle, FileText, CheckCircle2, ChevronRight,
  Bell, Calendar, Clock, CreditCard, LogIn, LogOut, ArrowRight,
  UtensilsCrossed, ShieldAlert, Sparkles, MapPin, UserCheck, Star
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { inr, formatDate } from '../components/ops/OpsShared';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const {
    currentStudent,
    movements,
    currentMovementStatus,
    markMovement,
    payments,
    complaints,
    leaveRequests,
    messMenu,
    announcements,
    markPaymentPaid,
    showToast,
  } = useHostelStore();

  const [payingModal, setPayingModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  // Student specific data with safe array fallbacks
  const myPayments = (payments || []).filter((p) => p.studentId === currentStudent?.id);
  const pendingPayment = myPayments.find((p) => p.status === 'pending' || p.status === 'overdue');
  const myComplaints = (complaints || []).filter((c) => c.studentId === currentStudent?.id && c.status !== 'resolved');
  const myLeaves = (leaveRequests || []).filter((l) => l.studentId === currentStudent?.id);
  const activeLeave = myLeaves.find((l) => l.status === 'approved' || l.status === 'pending');

  // Today's mess items
  const saturdayMenu = (messMenu || []).filter((m) => m.day === 'Saturday' && m.available);
  const recentMovements = movements || [];
  const noticeList = announcements || [];

  const handlePayNow = () => {
    if (pendingPayment) {
      markPaymentPaid(pendingPayment.id, selectedMethod);
      setPayingModal(false);
    }
  };

  const isInside = currentMovementStatus === 'IN';

  return (
    <div className="student-container" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 860, margin: '0 auto' }}>
      {/* Friendly Header */}
      <div style={{ animation: 'fadeInUp 400ms ease', marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Hostel Resident Portal
            </span>
            <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: 2 }}>
              Hello, {currentStudent?.name?.split(' ')[0] || 'Rahul'} 👋
            </h1>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
              {currentStudent?.course} · Room {currentStudent?.room} (Bed {currentStudent?.bed})
            </p>
          </div>
          <div
            className="avatar avatar--lg"
            onClick={() => navigate('/student/profile')}
            style={{
              background: 'linear-gradient(135deg, var(--accent-500), #7c3aed)',
              color: 'white',
              fontSize: 'var(--font-base)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {currentStudent?.avatar || 'RS'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Movement / Attendance Hero Card */}
        <div className="card" style={{
          background: isInside
            ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(240, 253, 244, 0.95))'
            : 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(254, 243, 199, 0.95))',
          border: isInside ? '1px solid rgba(22, 163, 74, 0.25)' : '1px solid rgba(217, 119, 6, 0.25)',
          padding: 'var(--space-5)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className={`badge ${isInside ? 'badge--success' : 'badge--warning'}`} style={{ fontSize: '11px', padding: '4px 10px' }}>
                  {isInside ? '● INSIDE HOSTEL' : '● CURRENTLY OUTSIDE'}
                </span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                  Movement & Attendance
                </span>
              </div>
              <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isInside ? 'You are inside ABC Residency' : 'You are currently checked out'}
              </h2>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
                Last gate scan: <strong style={{ color: 'var(--text-primary)' }}>{movements[0]?.time}</strong> ({movements[0]?.type} at {movements[0]?.location})
              </p>
            </div>

            {/* Quick Action Toggle Button */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {isInside ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => markMovement('OUT', 'Main Campus Gate')}
                  style={{
                    background: 'var(--warning-600)',
                    borderColor: 'var(--warning-600)',
                    color: 'white',
                    padding: '10px 18px',
                    fontWeight: 600,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <LogOut size={16} />
                  MARK OUT
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => markMovement('IN', 'Block B Gate')}
                  style={{
                    background: 'var(--success-600)',
                    borderColor: 'var(--success-600)',
                    color: 'white',
                    padding: '10px 18px',
                    fontWeight: 600,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <LogIn size={16} />
                  MARK IN
                </button>
              )}
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => navigate('/student/attendance')}
                title="View movement logs"
              >
                Logs <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Movement history preview */}
          <div style={{
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            fontSize: 'var(--font-xs)',
            color: 'var(--text-tertiary)',
          }}>
            <span>Recent Movement:</span>
            {movements.slice(0, 2).map((m) => (
              <span key={m.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                <Clock size={12} />
                <strong>{m.time}</strong> — <span className={`badge ${m.type === 'IN' ? 'badge--success' : 'badge--warning'}`} style={{ padding: '1px 6px', fontSize: '10px' }}>{m.type}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Room & Roommate Card */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-md)',
                background: 'var(--accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-600)',
              }}>
                <BedDouble size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, margin: 0 }}>Room {currentStudent?.room}</h3>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Block B · Floor 3 · Bed {currentStudent?.bed}</span>
              </div>
            </div>
            <Link to="/student/room" style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-600)', fontWeight: 600 }}>
              Room Details <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-3)',
            background: 'var(--bg-tertiary)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar avatar--md" style={{ background: '#7c3aed', color: 'white' }}>
                AK
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Roommate</div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>Aman Kumar</div>
                <div style={{ fontSize: '11px', color: 'var(--text-quaternary)' }}>B.Tech ME · Bed B</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 8 }}>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Compatibility</div>
                <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--success-600)' }}>94% Match</div>
              </div>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => navigate('/student/roommate')}
              >
                <Users size={13} />
                Profile
              </button>
            </div>
          </div>
        </div>

        {/* Payments Due Card */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-md)',
                background: pendingPayment ? 'var(--warning-50)' : 'var(--success-50)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: pendingPayment ? 'var(--warning-600)' : 'var(--success-600)',
              }}>
                <CreditCard size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, margin: 0 }}>Fee & Dues Status</h3>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Central hostel billing</span>
              </div>
            </div>
            <Link to="/student/payments" style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-600)', fontWeight: 600 }}>
              All Invoices <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </Link>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            padding: 'var(--space-3) var(--space-4)',
            background: pendingPayment ? 'var(--warning-50)' : 'var(--success-50)',
            borderRadius: 'var(--radius-md)',
            border: pendingPayment ? '1px solid rgba(217, 119, 6, 0.2)' : '1px solid rgba(22, 163, 74, 0.2)',
          }}>
            <div>
              {pendingPayment ? (
                <>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--warning-700)', fontWeight: 600 }}>
                    NEXT PAYMENT DUE: {formatDate(pendingPayment.dueDate)}
                  </div>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                    {inr(pendingPayment.amount)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {pendingPayment.type} ({pendingPayment.month}) · Invoice {pendingPayment.id}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--success-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={14} /> ALL DUES SETTLED
                  </div>
                  <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                    No pending dues for September 2026
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    Last receipt: {myPayments.find(p => p.status === 'paid')?.receipt || 'RCT-88421'}
                  </div>
                </>
              )}
            </div>

            <div>
              {pendingPayment ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setPayingModal(true)}
                  style={{ padding: '8px 18px', fontWeight: 600 }}
                >
                  Pay Now
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => navigate('/student/payments')}
                >
                  View Receipts
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            Quick Actions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-3)' }}>
            {[
              { icon: isInside ? LogOut : LogIn, label: isInside ? 'Mark OUT' : 'Mark IN', path: '/student/attendance', color: 'var(--accent-600)', bg: 'var(--accent-50)' },
              { icon: CreditCard, label: 'Pay Fees', path: '/student/payments', color: 'var(--success-600)', bg: 'var(--success-50)' },
              { icon: AlertCircle, label: 'Complaints', path: '/student/complaints', color: 'var(--danger-600)', bg: 'var(--danger-50)' },
              { icon: FileText, label: 'Apply Leave', path: '/student/leave', color: 'var(--warning-600)', bg: 'var(--warning-50)' },
              { icon: UserCheck, label: 'Gate Visitor', path: '/student/visitors', color: '#7c3aed', bg: '#f5f3ff' },
              { icon: UtensilsCrossed, label: 'Mess Menu', path: '/student/mess', color: '#0284c7', bg: '#f0f9ff' },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  type="button"
                  className="card card--interactive"
                  onClick={() => navigate(action.path)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: 'var(--space-4)',
                    textAlign: 'center',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: action.bg, color: action.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two Column Grid: Mess & Active Tickets/Leave */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {/* Today's Mess Menu */}
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <UtensilsCrossed size={16} style={{ color: '#0284c7' }} />
                <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, margin: 0 }}>Today's Mess Menu</h3>
              </div>
              <Link to="/student/mess" style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-600)', fontWeight: 500 }}>
                Full Schedule →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {saturdayMenu.slice(0, 3).map((item) => (
                <div key={item.id} style={{ padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>{item.meal}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{item.time}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {item.items}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Statuses: Complaints & Leave */}
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldAlert size={16} style={{ color: 'var(--accent-600)' }} />
                <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, margin: 0 }}>Open Tickets & Leave</h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Live status</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Complaint snippet */}
              <div style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>Active Complaints</span>
                  <span className={`badge ${myComplaints.length > 0 ? 'badge--warning' : 'badge--success'}`}>
                    {myComplaints.length} Active
                  </span>
                </div>
                {myComplaints.length > 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {myComplaints[0].id}: {myComplaints[0].description.slice(0, 45)}...
                  </p>
                ) : (
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: 4 }}>
                    No pending maintenance or room complaints.
                  </p>
                )}
              </div>

              {/* Leave snippet */}
              <div style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>Leave & Out-Pass</span>
                  <span className={`badge ${activeLeave ? 'badge--accent' : 'badge--default'}`}>
                    {activeLeave ? activeLeave.status : 'None active'}
                  </span>
                </div>
                {activeLeave ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {activeLeave.type} ({formatDate(activeLeave.from)} – {formatDate(activeLeave.to)})
                  </p>
                ) : (
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: 4 }}>
                    No scheduled out-passes for today.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hostel Announcements */}
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Bell size={16} style={{ color: 'var(--accent-500)' }} />
              Hostel Announcements
            </h3>
            <Link to="/student/announcements" style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-600)', fontWeight: 500 }}>
              All notices →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {noticeList.slice(0, 2).map((ann) => (
              <div key={ann.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 8, borderRadius: 'var(--radius-sm)' }}>
                <span className={`badge ${ann.priority === 'high' ? 'badge--danger' : 'badge--default'}`} style={{ fontSize: '10px', flexShrink: 0 }}>
                  {ann.category}
                </span>
                <div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{ann.title}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{ann.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pay Now Modal */}
      {payingModal && pendingPayment && (
        <>
          <div className="drawer-overlay" onClick={() => setPayingModal(false)} />
          <div className="drawer" style={{ width: 440 }}>
            <div className="drawer__header">
              <h2 className="drawer__title">Instant Fee Payment</h2>
              <button type="button" className="btn btn--ghost btn--icon" onClick={() => setPayingModal(false)}>✕</button>
            </div>
            <div className="drawer__body">
              <div style={{ textAlign: 'center', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border-primary)' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Total Amount Payable</div>
                <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                  {inr(pendingPayment.amount)}
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-600)', fontWeight: 600, marginTop: 4 }}>
                  {pendingPayment.type} · {pendingPayment.month}
                </div>
              </div>

              <div style={{ margin: 'var(--space-4) 0' }}>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Select Payment Mode
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  {['UPI', 'Net Banking', 'Debit Card', 'Cash at Desk'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`btn ${selectedMethod === m ? 'btn--primary' : 'btn--secondary'}`}
                      style={{ padding: '10px', fontSize: 'var(--font-xs)', justifyContent: 'center' }}
                      onClick={() => setSelectedMethod(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                🔒 Transactions are processed securely. Your student ledger and admin billing portal update automatically upon confirmation.
              </div>
            </div>
            <div className="drawer__footer" style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn--primary"
                style={{ flex: 1, padding: 12, fontWeight: 700 }}
                onClick={handlePayNow}
              >
                Confirm Payment of {inr(pendingPayment.amount)}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setPayingModal(false)}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
