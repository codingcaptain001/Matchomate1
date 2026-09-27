import { useState } from 'react';
import { Search, Filter, X, User, Mail, Phone, MapPin, BookOpen, Plus } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { inr } from '../components/ops/OpsShared';

const paymentConfig = {
  paid: { label: 'Paid', class: 'badge--success' },
  pending: { label: 'Pending', class: 'badge--warning' },
  overdue: { label: 'Overdue', class: 'badge--danger' },
};

const statusConfig = {
  active: { label: 'Active', class: 'badge--success' },
  'on-leave': { label: 'On Leave', class: 'badge--warning' },
  inactive: { label: 'Inactive', class: 'badge--default' },
  onboarding: { label: 'Profile Incomplete', class: 'badge--default' },
};

export default function StudentsPage() {
  const { students, payments, attendance, today, addStudent } = useHostelStore();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', course: '', year: '1', city: '' });
  const selectedStudent = students.find((s) => s.id === selectedId) || null;

  const filtered = students.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (paymentFilter !== 'all' && s.payment !== paymentFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || (s.room || '').toLowerCase().includes(q);
  });

  const handleAddStudent = (event) => {
    event.preventDefault();
    if (!newStudent.name.trim() || !newStudent.email.trim() || !newStudent.phone.trim() || !newStudent.course.trim()) return;
    addStudent(newStudent);
    setNewStudent({ name: '', email: '', phone: '', course: '', year: '1', city: '' });
    setAddModalOpen(false);
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__greeting">Students</h1>
            <p className="page-header__subtitle">Manage student records, profiles, and hostel assignments.</p>
          </div>
          <button type="button" className="btn btn--primary" onClick={() => setAddModalOpen(true)}>
            <Plus size={15} />
            Add Student
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
        <div className="data-table-toolbar">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)', flex: 1, maxWidth: 300,
          }}>
            <Search size={15} style={{ color: 'var(--text-quaternary)', flexShrink: 0 }} />
            <input
              style={{ border: 'none', padding: 0, background: 'transparent', flex: 1, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}
              placeholder="Search by name, ID, or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>
            <Filter size={14} />
            Filters
          </button>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
            {filtered.length} students
          </span>
        </div>

        {filtersOpen && <div className="data-table-toolbar" style={{ gap: 12, borderTop: '1px solid var(--border-primary)' }}>
          <label className="input-wrapper"><span className="input-label">Student status</span><select className="ops-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="active">Active</option><option value="on-leave">On leave</option><option value="onboarding">Profile incomplete</option><option value="inactive">Inactive</option></select></label>
          <label className="input-wrapper"><span className="input-label">Payment status</span><select className="ops-select" value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}><option value="all">All payments</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option></select></label>
        </div>}

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Course</th>
                <th>Room</th>
                <th>Compatibility</th>
                <th>Attendance</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedId(student.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div className="avatar avatar--sm" style={{ background: 'linear-gradient(135deg, var(--accent-400), #a78bfa)', color: 'white' }}>
                          {student.avatar}
                        </div>
                        <span style={{ fontWeight: 500 }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-tertiary)', fontFamily: 'monospace', fontSize: 'var(--font-xs)' }}>{student.id}</td>
                    <td>{student.course}</td>
                    <td style={{ fontWeight: 500 }}>{student.room}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="progress-bar" style={{ width: 50, height: 4 }}>
                          <div className="progress-bar__fill" style={{
                            width: `${student.compatibility ?? 0}%`,
                            background: student.compatibility == null ? 'var(--gray-300)' : student.compatibility >= 70 ? 'var(--success-500)' : 'var(--danger-500)',
                          }} />
                        </div>
                        <span style={{
                          fontSize: 'var(--font-xs)', fontWeight: 600,
                          color: student.compatibility == null ? 'var(--text-tertiary)' : student.compatibility >= 70 ? 'var(--success-600)' : 'var(--danger-600)',
                        }}>
                          {student.compatibility == null ? 'Pending' : `${student.compatibility}%`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 500,
                        color: student.attendance >= 85 ? 'var(--success-600)' : student.attendance >= 75 ? 'var(--warning-600)' : 'var(--danger-600)',
                      }}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${paymentConfig[student.payment]?.class || 'badge--default'}`}>
                        {paymentConfig[student.payment]?.label || student.payment}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${statusConfig[student.status]?.class || 'badge--default'}`}>
                        {statusConfig[student.status]?.label || student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-quaternary)' }}>
                      <User size={32} style={{ opacity: 0.4 }} />
                      <p>No students found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="data-table-pagination">
          <span>Showing 1–{filtered.length} of {filtered.length}</span>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>All demo records shown</span>
        </div>
      </div>

      {addModalOpen && <div className="drawer-overlay" onClick={() => setAddModalOpen(false)}>
        <section className="drawer" role="dialog" aria-modal="true" aria-labelledby="add-student-title" onClick={(event) => event.stopPropagation()}>
          <div className="drawer__header"><h2 id="add-student-title" className="drawer__title">Add Student</h2><button type="button" className="btn btn--ghost btn--icon" onClick={() => setAddModalOpen(false)}><X size={18} /></button></div>
          <form className="drawer__body" onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['name', 'Full name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel'],
              ['course', 'Course', 'text'], ['year', 'Year', 'number'], ['city', 'City', 'text'],
            ].map(([key, label, type]) => <label key={key} className="input-wrapper"><span className="input-label">{label}</span><input className="ops-input" type={type} min={type === 'number' ? 1 : undefined} max={type === 'number' ? 8 : undefined} required={key !== 'city'} value={newStudent[key]} onChange={(event) => setNewStudent((previous) => ({ ...previous, [key]: event.target.value }))} /></label>)}
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>New students enter onboarding without a room or compatibility score until their profile is completed.</p>
            <button type="submit" className="btn btn--primary">Add to onboarding</button>
          </form>
        </section>
      </div>}

      {/* Student Profile Drawer */}
      {selectedStudent && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedId(null)} />
          <div className="drawer" style={{ width: 520 }}>
            <div className="drawer__header">
              <h2 className="drawer__title">Student Profile</h2>
              <button onClick={() => setSelectedId(null)} className="btn btn--ghost btn--icon">
                <X size={18} />
              </button>
            </div>

            {/* Profile header */}
            <div style={{
              padding: 'var(--space-6)',
              borderBottom: '1px solid var(--border-primary)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
            }}>
              <div className="avatar avatar--lg" style={{
                background: 'linear-gradient(135deg, var(--accent-500), #7c3aed)',
                color: 'white', fontSize: 'var(--font-lg)',
              }}>
                {selectedStudent.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{selectedStudent.name}</h3>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>
                  {selectedStudent.course} · Year {selectedStudent.year}
                </p>
              </div>
              <span className={`badge ${statusConfig[selectedStudent.status]?.class}`}>
                {statusConfig[selectedStudent.status]?.label}
              </span>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ padding: '0 var(--space-6)' }}>
              {['overview', 'hostel', 'attendance', 'payments'].map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="drawer__body">
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {[
                    { icon: User, label: 'Student ID', value: selectedStudent.id },
                    { icon: BookOpen, label: 'Course', value: `${selectedStudent.course} · Year ${selectedStudent.year}` },
                    { icon: MapPin, label: 'Room', value: `${selectedStudent.room} · Bed ${selectedStudent.bed}` },
                    { icon: Mail, label: 'Email', value: selectedStudent.email },
                    { icon: Phone, label: 'Phone', value: selectedStudent.phone },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        <Icon size={16} style={{ color: 'var(--text-quaternary)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)' }}>{item.label}</div>
                          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{item.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'hostel' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)', marginBottom: 4 }}>Room & Bed</div>
                    <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{selectedStudent.room} · Bed {selectedStudent.bed}</div>
                  </div>
                  <div style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)', marginBottom: 4 }}>Compatibility Score</div>
                    <div style={{
                      fontSize: 'var(--font-2xl)', fontWeight: 800,
                      color: selectedStudent.compatibility >= 70 ? 'var(--success-600)' : 'var(--danger-600)',
                    }}>
                      {selectedStudent.compatibility}%
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  <div style={{
                    fontSize: 'var(--font-4xl)', fontWeight: 800,
                    color: selectedStudent.attendance >= 85 ? 'var(--success-600)' : 'var(--warning-600)',
                    marginBottom: 4,
                  }}>
                    {selectedStudent.attendance}%
                  </div>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginBottom: 16 }}>Overall Attendance</div>
                  {(() => {
                    const rec = attendance.find((a) => a.studentId === selectedStudent.id && a.date === today);
                    return (
                      <span className="badge badge--default">Today: {rec?.status || 'unmarked'}{rec?.checkIn ? ` · ${rec.checkIn}` : ''}</span>
                    );
                  })()}
                </div>
              )}

              {activeTab === 'payments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <span className={`badge ${paymentConfig[selectedStudent.payment]?.class}`} style={{ fontSize: 'var(--font-base)', padding: '6px 16px' }}>
                      {paymentConfig[selectedStudent.payment]?.label}
                    </span>
                  </div>
                  {payments.filter((p) => p.studentId === selectedStudent.id).map((p) => (
                    <div key={p.id} style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <strong>{p.type}</strong>
                        <span>{inr(p.amount)}</span>
                      </div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                        {p.month} · {p.status}{p.receipt ? ` · ${p.receipt}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
