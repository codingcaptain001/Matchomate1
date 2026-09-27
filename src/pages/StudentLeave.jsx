import { useState } from 'react';
import {
  CalendarOff, Plus, CheckCircle2, Clock, XCircle, AlertTriangle,
  Calendar, MapPin, Phone, ShieldCheck, FileText, ArrowRight, UserCheck
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { OpsDrawer, formatDate } from '../components/ops/OpsShared';

export default function StudentLeave() {
  const {
    currentStudent,
    leaveRequests,
    applyLeave,
    today,
    showToast,
  } = useHostelStore();

  const [filter, setFilter] = useState('all');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Form State
  const [leaveType, setLeaveType] = useState('Home visit');
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState('');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [parentContact, setParentContact] = useState(currentStudent?.guardianPhone || '+91 98100 11111');
  const [parentConsent, setParentConsent] = useState(false);

  // Filter requests for current student
  const myLeaves = leaveRequests.filter((l) => l.studentId === currentStudent?.id);
  const filteredLeaves = myLeaves.filter((l) => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  const pendingCount = myLeaves.filter((l) => l.status === 'pending').length;
  const approvedCount = myLeaves.filter((l) => l.status === 'approved').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    if (toDate < fromDate) {
      showToast('The return date must be on or after the departure date.');
      return;
    }

    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);
    const diffTime = d2 - d1;
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    applyLeave({
      type: leaveType,
      from: fromDate,
      to: toDate,
      days: diffDays,
      reason,
      destination,
      emergencyContact: parentContact,
    });

    setIsApplyModalOpen(false);
    setReason('');
    setDestination('');
    setToDate('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge--success" style={{ gap: 4 }}><CheckCircle2 size={12} /> Approved</span>;
      case 'pending':
        return <span className="badge badge--warning" style={{ gap: 4 }}><Clock size={12} /> Pending Warden</span>;
      case 'rejected':
        return <span className="badge badge--danger" style={{ gap: 4 }}><XCircle size={12} /> Rejected</span>;
      case 'completed':
        return <span className="badge badge--info" style={{ gap: 4 }}><ShieldCheck size={12} /> Returned</span>;
      default:
        return <span className="badge badge--neutral">{status}</span>;
    }
  };

  return (
    <div className="student-container" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--space-5)' }}>
        <div>
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Night & Vacation Permissions
          </span>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
            Hostel Leave Management
          </h1>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Apply for home visits, medical leaves, and overnight gate out-passes with warden approval.
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setIsApplyModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontWeight: 600 }}
        >
          <Plus size={16} /> Apply New Leave
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--accent-500)' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>TOTAL APPLICATIONS</div>
          <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            {myLeaves.length}
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>This academic semester</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--warning-500)' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--warning-700)', fontWeight: 600 }}>PENDING REVIEW</div>
          <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--warning-700)', marginTop: 4 }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>Awaiting warden sign-off</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--success-500)' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--success-700)', fontWeight: 600 }}>APPROVED PASSES</div>
          <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--success-700)', marginTop: 4 }}>
            {approvedCount}
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>Gate QR code generated</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--primary-500)' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--primary-700)', fontWeight: 600 }}>GUARDIAN CONSENT</div>
          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--success-700)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
            <CheckCircle2 size={16} /> Verified via SMS
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>{currentStudent?.guardianPhone}</div>
        </div>
      </div>

      {/* Main Leave List Card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          background: 'var(--bg-card-header)'
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'pending', 'approved', 'completed'].map((f) => (
              <button
                key={f}
                className={`btn btn--sm ${filter === f ? 'btn--primary' : 'btn--ghost'}`}
                onClick={() => setFilter(f)}
                style={{ textTransform: 'capitalize', fontSize: '12px' }}
              >
                {f} {f === 'all' ? `(${myLeaves.length})` : ''}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
            Showing {filteredLeaves.length} entries
          </span>
        </div>

        {filteredLeaves.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <CalendarOff size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--text-primary)' }}>No leave records found</h3>
            <p style={{ fontSize: 'var(--font-sm)', marginTop: 4 }}>You haven't requested any leaves matching this filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredLeaves.map((leave) => (
              <div
                key={leave.id}
                onClick={() => setSelectedLeave(leave)}
                style={{
                  padding: 'var(--space-4)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                className="hover-bg"
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: leave.status === 'approved' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                    color: leave.status === 'approved' ? 'var(--success-600)' : 'var(--accent-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 'var(--font-md)', color: 'var(--text-primary)' }}>
                        {leave.type}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        {leave.id}
                      </span>
                      {getStatusBadge(leave.status)}
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} /> {formatDate(leave.from)} → {formatDate(leave.to)} ({leave.days} {leave.days === 1 ? 'day' : 'days'})
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} /> {leave.destination}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4, fontStyle: 'italic' }}>
                      "{leave.reason}"
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)' }}>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsApplyModalOpen(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540, width: '90%', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Apply for Leave / Gate Out-Pass
                </h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  Your warden and guardian will receive an instant notification.
                </p>
              </div>
              <button className="btn btn--ghost btn--sm" onClick={() => setIsApplyModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="ops-label">Leave Category</label>
                <select
                  className="ops-select"
                  style={{ width: '100%' }}
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option>Home visit</option>
                  <option>Medical leave</option>
                  <option>Academic / Conference</option>
                  <option>Family function</option>
                  <option>Weekend outing</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="ops-label" htmlFor="leave-from-date">From Date</label>
                  <input
                    id="leave-from-date"
                    type="date"
                    className="ops-input"
                    style={{ width: '100%' }}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="ops-label" htmlFor="leave-to-date">To Date</label>
                  <input
                    id="leave-to-date"
                    type="date"
                    className="ops-input"
                    style={{ width: '100%' }}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="ops-label" htmlFor="leave-destination">Destination City & Address</label>
                <input
                  id="leave-destination"
                  type="text"
                  className="ops-input"
                  style={{ width: '100%' }}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. 14 Vaishali Nagar, Jaipur"
                  required
                />
              </div>

              <div>
                <label className="ops-label" htmlFor="leave-reason">Detailed Reason for Leave</label>
                <textarea
                  id="leave-reason"
                  className="ops-input"
                  style={{ width: '100%', minHeight: 70, resize: 'vertical' }}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide context for warden review..."
                  required
                />
              </div>

              <div>
                <label className="ops-label">Guardian / Emergency Contact Number</label>
                <input
                  type="tel"
                  className="ops-input"
                  style={{ width: '100%' }}
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  required
                />
              </div>

              <div style={{
                background: 'var(--bg-tertiary)',
                padding: 10,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 'var(--font-xs)',
                color: 'var(--text-secondary)'
              }}>
                <input
                  type="checkbox"
                  id="consent"
                  checked={parentConsent}
                  onChange={(e) => setParentConsent(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="consent" style={{ cursor: 'pointer' }}>
                  I confirm that my parents/guardians are aware and have consented to this travel plan.
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn btn--secondary" onClick={() => setIsApplyModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={!parentConsent}>
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Detail Drawer */}
      {selectedLeave && (
        <OpsDrawer
          onClose={() => setSelectedLeave(null)}
          title={`${selectedLeave.type} Details`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>STATUS</span>
              {getStatusBadge(selectedLeave.status)}
            </div>

            <div className="card" style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>TRAVEL WINDOW</div>
              <div style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
                {formatDate(selectedLeave.from)} → {formatDate(selectedLeave.to)}
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-600)', fontWeight: 600, marginTop: 2 }}>
                Total Duration: {selectedLeave.days} Days
              </div>
            </div>

            <div>
              <span className="ops-meta-label">Destination</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontWeight: 600 }}>
                <MapPin size={16} color="var(--accent-600)" /> {selectedLeave.destination}
              </div>
            </div>

            <div>
              <span className="ops-meta-label">Reason</span>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                {selectedLeave.reason}
              </p>
            </div>

            <div>
              <span className="ops-meta-label">Emergency / Parent Contact</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontWeight: 600 }}>
                <Phone size={16} /> {selectedLeave.emergencyContact}
              </div>
            </div>

            {selectedLeave.reviewedBy && (
              <div style={{ padding: 'var(--space-3)', background: 'rgba(22, 163, 74, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--success-700)' }}>
                  <UserCheck size={14} /> Approved by {selectedLeave.reviewedBy}
                </div>
                {selectedLeave.remarks && (
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Note: "{selectedLeave.remarks}"
                  </p>
                )}
              </div>
            )}

            {selectedLeave.status === 'approved' && (
              <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center', border: '1px dashed var(--accent-300)' }}>
                <FileText size={24} color="var(--accent-600)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>Digital Gate Pass Active</div>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  Show your hostel ID at Block B or Main Gate turnstile when departing.
                </p>
              </div>
            )}
          </div>
        </OpsDrawer>
      )}
    </div>
  );
}
