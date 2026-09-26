import { useState } from 'react';
import {
  UserCheck, Plus, CheckCircle2, Clock, XCircle, ShieldCheck,
  Phone, User, Calendar, Car, ArrowRight, ShieldAlert, FileText
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { OpsDrawer } from '../components/ops/OpsShared';

export default function StudentVisitors() {
  const {
    currentStudent,
    visitors,
    addVisitor,
    today,
  } = useHostelStore();

  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  // Form State
  const [visitorName, setVisitorName] = useState('Sunil Sharma');
  const [relation, setRelation] = useState('Father');
  const [phone, setPhone] = useState('+91 98100 11111');
  const [purpose, setPurpose] = useState('Weekend semester visit and delivering documents');
  const [expectedAt, setExpectedAt] = useState(`${today} 16:30`);
  const [vehicle, setVehicle] = useState('DL 3C AB 4590 (Car)');
  const [idProof, setIdProof] = useState('Aadhaar Card');

  const myVisitors = visitors.filter((v) => v.studentId === currentStudent?.id);
  const filteredVisitors = myVisitors.filter((v) => {
    if (filter === 'all') return true;
    if (filter === 'active') return v.status === 'checked-in' || v.status === 'expected' || v.status === 'pending-approval';
    if (filter === 'completed') return v.status === 'checked-out';
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    addVisitor({
      visitorName,
      relation,
      phone,
      purpose,
      expectedAt,
      vehicle,
      idProof,
    });

    setIsModalOpen(false);
    setVisitorName('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'checked-in':
        return <span className="badge badge--success" style={{ gap: 4 }}><ShieldCheck size={12} /> On Campus (Checked In)</span>;
      case 'expected':
      case 'approved':
        return <span className="badge badge--info" style={{ gap: 4 }}><CheckCircle2 size={12} /> Pre-Approved Pass</span>;
      case 'pending-approval':
        return <span className="badge badge--warning" style={{ gap: 4 }}><Clock size={12} /> Pending Security</span>;
      case 'checked-out':
        return <span className="badge badge--neutral" style={{ gap: 4 }}><UserCheck size={12} /> Completed Visit</span>;
      case 'denied':
        return <span className="badge badge--danger" style={{ gap: 4 }}><XCircle size={12} /> Entry Denied</span>;
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
            Campus Security & Guest Entry
          </span>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
            Visitor Passes & Approvals
          </h1>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Pre-register parents, guardians, and guests for contactless gate entry at ABC Residency.
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontWeight: 600 }}
        >
          <Plus size={16} /> Pre-Approve Visitor
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--accent-500)' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>TOTAL VISITORS</div>
          <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            {myVisitors.length}
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>Logged this semester</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--success-500)' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--success-700)', fontWeight: 600 }}>CURRENTLY INSIDE</div>
          <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--success-700)', marginTop: 4 }}>
            {myVisitors.filter((v) => v.status === 'checked-in').length}
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>Checked-in at security desk</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--primary-500)' }}>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--primary-700)', fontWeight: 600 }}>HOSTEL VISITING HOURS</div>
          <div style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 6 }}>
            04:00 PM – 08:00 PM
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>Common lounge / Dining hall only</div>
        </div>
      </div>

      {/* Visitors List Card */}
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
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                className={`btn btn--sm ${filter === f ? 'btn--primary' : 'btn--ghost'}`}
                onClick={() => setFilter(f)}
                style={{ textTransform: 'capitalize', fontSize: '12px' }}
              >
                {f} {f === 'all' ? `(${myVisitors.length})` : ''}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
            Showing {filteredVisitors.length} guests
          </span>
        </div>

        {filteredVisitors.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <UserCheck size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--text-primary)' }}>No visitor logs found</h3>
            <p style={{ fontSize: 'var(--font-sm)', marginTop: 4 }}>You haven't registered any visitors yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredVisitors.map((vis) => (
              <div
                key={vis.id}
                onClick={() => setSelectedVisitor(vis)}
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
                    background: vis.status === 'checked-in' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                    color: vis.status === 'checked-in' ? 'var(--success-600)' : 'var(--accent-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 'var(--font-md)', color: 'var(--text-primary)' }}>
                        {vis.visitorName}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--accent-600)', background: 'var(--accent-50)', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                        {vis.relation}
                      </span>
                      {getStatusBadge(vis.status)}
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={13} /> {vis.phone}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> Expected: {vis.expectedAt}
                      </span>
                      {vis.inTime && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success-700)', fontWeight: 600 }}>
                          <CheckCircle2 size={13} /> In at {vis.inTime}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                      Purpose: {vis.purpose}
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

      {/* Pre-Approve Visitor Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, width: '90%', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Pre-Register Visitor
                </h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  Generates an OTP gate pass for campus security.
                </p>
              </div>
              <button className="btn btn--ghost btn--sm" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="ops-label">Visitor Full Name</label>
                <input
                  type="text"
                  className="ops-input"
                  style={{ width: '100%' }}
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="ops-label">Relation to Student</label>
                  <select
                    className="ops-select"
                    style={{ width: '100%' }}
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                  >
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Sibling</option>
                    <option>Local Guardian</option>
                    <option>Friend / Colleague</option>
                  </select>
                </div>
                <div>
                  <label className="ops-label">Phone Number</label>
                  <input
                    type="tel"
                    className="ops-input"
                    style={{ width: '100%' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="ops-label">Expected Date & Time</label>
                <input
                  type="text"
                  className="ops-input"
                  style={{ width: '100%' }}
                  value={expectedAt}
                  onChange={(e) => setExpectedAt(e.target.value)}
                  placeholder="YYYY-MM-DD HH:MM"
                  required
                />
              </div>

              <div>
                <label className="ops-label">Purpose of Visit</label>
                <input
                  type="text"
                  className="ops-input"
                  style={{ width: '100%' }}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Semester fee deposit and meeting"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="ops-label">Vehicle Registration</label>
                  <input
                    type="text"
                    className="ops-input"
                    style={{ width: '100%' }}
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. DL 01 AB 1234 or Walk-in"
                  />
                </div>
                <div>
                  <label className="ops-label">ID Proof to Produce</label>
                  <select
                    className="ops-select"
                    style={{ width: '100%' }}
                    value={idProof}
                    onChange={(e) => setIdProof(e.target.value)}
                  >
                    <option>Aadhaar Card</option>
                    <option>Driving License</option>
                    <option>Voter ID</option>
                    <option>Passport</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Generate Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visitor Detail Drawer */}
      {selectedVisitor && (
        <OpsDrawer
          onClose={() => setSelectedVisitor(null)}
          title={selectedVisitor.visitorName}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>STATUS</span>
              {getStatusBadge(selectedVisitor.status)}
            </div>

            <div className="card" style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)' }}>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>RELATION & CONTACT</div>
              <div style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
                {selectedVisitor.relation} ({selectedVisitor.phone})
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                Govt ID: {selectedVisitor.idProof} | Vehicle: {selectedVisitor.vehicle}
              </div>
            </div>

            <div>
              <span className="ops-meta-label">Purpose of Visit</span>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                {selectedVisitor.purpose}
              </p>
            </div>

            <div>
              <span className="ops-meta-label">Visit Timings</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4, fontSize: 'var(--font-xs)' }}>
                <div><strong>Expected:</strong> {selectedVisitor.expectedAt}</div>
                {selectedVisitor.inTime && <div><strong style={{ color: 'var(--success-700)' }}>Gate Check-in:</strong> {selectedVisitor.inTime}</div>}
                {selectedVisitor.outTime && <div><strong>Gate Check-out:</strong> {selectedVisitor.outTime}</div>}
              </div>
            </div>

            <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center', border: '1px dashed var(--accent-300)' }}>
              <FileText size={24} color="var(--accent-600)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>Gate Entry Code: #VIS-{selectedVisitor.id.slice(-4)}</div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                Visitor can share this code along with ID proof at the main security barrier.
              </p>
            </div>
          </div>
        </OpsDrawer>
      )}
    </div>
  );
}
