import { useState } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, MessageSquareWarning, ArrowRight } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function StudentComplaints() {
  const { currentStudent, complaints, addComplaint } = useHostelStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState('Plumbing');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');

  const myComplaints = complaints.filter((c) => c.studentId === currentStudent?.id || c.studentId === 'STU001');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    addComplaint({ category, priority, description });
    setDescription('');
    setModalOpen(false);
  };

  return (
    <div className="student-container" style={{ maxWidth: 860, margin: '0 auto', padding: 'var(--space-5) var(--space-4)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--space-5)' }}>
        <div>
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Maintenance & Support
          </span>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
            My Complaints & Requests
          </h1>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Track and raise maintenance or living issues for Room {currentStudent?.room || 'B-304'}.
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontWeight: 600 }}
        >
          <Plus size={16} /> Raise Complaint
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {myComplaints.length === 0 ? (
          <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <MessageSquareWarning size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--text-primary)' }}>No active complaints</h3>
            <p style={{ fontSize: 'var(--font-sm)', marginTop: 4 }}>Your room is in good shape! If anything breaks, tap "Raise Complaint" above.</p>
          </div>
        ) : (
          myComplaints.map((comp) => (
            <div key={comp.id} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--accent-600)', fontFamily: 'var(--font-mono)' }}>
                      {comp.id}
                    </span>
                    <span className="badge badge--neutral">{comp.category}</span>
                    <span className={`badge ${comp.priority === 'critical' ? 'badge--danger' : comp.priority === 'high' ? 'badge--warning' : 'badge--neutral'}`} style={{ fontSize: '10px' }}>
                      {comp.priority} priority
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--font-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {comp.description}
                  </p>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                    Logged on {comp.createdOn || comp.created || 'Recently'} · Assigned to: {comp.assignedTo || 'Maintenance Desk'}
                  </div>
                </div>

                {comp.status === 'resolved' ? (
                  <span className="badge badge--success" style={{ gap: 4, padding: '6px 12px' }}><CheckCircle size={14} /> Resolved</span>
                ) : comp.status === 'in-progress' ? (
                  <span className="badge badge--warning" style={{ gap: 4, padding: '6px 12px' }}><Clock size={14} /> In Progress</span>
                ) : (
                  <span className="badge badge--danger" style={{ gap: 4, padding: '6px 12px' }}><AlertCircle size={14} /> Open</span>
                )}
              </div>

              {/* Visual Progress Pipeline */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                background: 'var(--bg-tertiary)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--space-3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--success-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                    ✓
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>1. Registered</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Ticket logged</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: comp.status !== 'open' ? 'var(--success-500)' : 'var(--gray-300)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11
                  }}>
                    {comp.status !== 'open' ? '✓' : '2'}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: comp.status !== 'open' ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                      2. Assigned
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Staff dispatched</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: comp.status === 'resolved' ? 'var(--success-500)' : 'var(--gray-300)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11
                  }}>
                    {comp.status === 'resolved' ? '✓' : '3'}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: comp.status === 'resolved' ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                      3. Closed
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Issue fixed</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Raise Complaint Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500, width: '90%', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Raise Maintenance Complaint
                </h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  For Room {currentStudent?.room || 'B-304'}
                </p>
              </div>
              <button className="btn btn--ghost btn--sm" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="ops-label">Issue Category</label>
                <select
                  className="ops-select"
                  style={{ width: '100%' }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Carpentry / Furniture</option>
                  <option>Appliance (AC / Geyser)</option>
                  <option>Wi-Fi / Internet</option>
                  <option>Pest Control</option>
                  <option>Cleanliness</option>
                </select>
              </div>

              <div>
                <label className="ops-label">Priority Level</label>
                <select
                  className="ops-select"
                  style={{ width: '100%' }}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low (Cosmetic / Routine)</option>
                  <option value="medium">Medium (Requires attention within 24h)</option>
                  <option value="high">High (Affecting daily routine)</option>
                  <option value="critical">Critical (Water leak / Power breakdown)</option>
                </select>
              </div>

              <div>
                <label className="ops-label">Detailed Description</label>
                <textarea
                  className="ops-input"
                  style={{ width: '100%', minHeight: 90, resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue clearly (e.g., Washroom faucet leaking continuously since morning)..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 'var(--space-2)' }}>
                <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

