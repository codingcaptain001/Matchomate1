import { useState } from 'react';
import { studentProfile } from '../data/mockData';
import { useHostelStore } from '../context/HostelStore';

export default function StudentProfile() {
  const { currentStudent, updateStudentProfile } = useHostelStore();
  const sections = ['Personal Details', 'Lifestyle Preferences', 'Academic', 'Emergency Contact'];
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const student = currentStudent || {};
  const completionFields = ['name', 'email', 'phone', 'course', 'room', 'city', 'guardian', 'guardianPhone'];
  const completion = Math.round(completionFields.filter((field) => student[field]).length / completionFields.length * 100);

  const startEditing = () => {
    setDraft({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      city: student.city || '',
    });
    setEditing(true);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.email.trim() || !draft.phone.trim()) return;
    const avatar = draft.name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    updateStudentProfile(student.id, { ...draft, avatar });
    setEditing(false);
  };

  const field = (label, value) => (
    <div key={label} className="input-wrapper">
      <label className="input-label">{label}</label>
      <div className="input" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{value || 'Not provided'}</div>
    </div>
  );

  return (
    <div className="page-content" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header animate-stagger" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">My Profile</h1>
        <p className="page-header__subtitle">Manage your personal details and lifestyle preferences.</p>
      </div>

      <div className="animate-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Top Profile Card */}
        <div className="card" style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
          <div className="avatar" style={{ width: 80, height: 80, fontSize: 'var(--font-3xl)', background: 'var(--accent-100)', color: 'var(--accent-700)' }}>
            {student.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</h2>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
              {student.course} (Year {student.year}) · {student.id}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Profile Completion</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="progress-bar" style={{ width: 100 }}>
                <div className="progress-bar__fill" style={{ width: `${completion}%`, background: 'var(--success-500)' }} />
              </div>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--success-600)' }}>{completion}%</span>
            </div>
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Profile sections">
          {sections.map((section) => (
            <button key={section} type="button" role="tab" aria-selected={activeSection === section} className={`tab ${activeSection === section ? 'tab--active' : ''}`} onClick={() => { setActiveSection(section); setEditing(false); }}>
              {section}
            </button>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>{activeSection}</h3>
            {activeSection === 'Personal Details' && !editing && <button type="button" className="btn btn--secondary btn--sm" onClick={startEditing}>Edit details</button>}
          </div>

          {activeSection === 'Personal Details' ? (editing ? (
            <form onSubmit={saveProfile} className="grid-2col" style={{ gap: 'var(--space-6)' }}>
              {['name', 'email', 'phone', 'city'].map((key) => (
                <div key={key} className="input-wrapper">
                  <label className="input-label" htmlFor={`profile-${key}`}>{key[0].toUpperCase() + key.slice(1)}</label>
                  <input id={`profile-${key}`} className="input" required={key !== 'city'} type={key === 'email' ? 'email' : 'text'} value={draft[key]} onChange={(event) => setDraft((previous) => ({ ...previous, [key]: event.target.value }))} />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Save profile</button>
              </div>
            </form>
          ) : (
            <div className="grid-2col" style={{ gap: 'var(--space-6)' }}>
              {field('Name', student.name)}{field('Email', student.email)}{field('Phone', student.phone)}{field('City', student.city)}
            </div>
          )) : (
            <div className="grid-2col" style={{ gap: 'var(--space-6)' }}>
              {activeSection === 'Lifestyle Preferences' && Object.entries(studentProfile.lifestyle).map(([key, value]) => field(key.replace(/([A-Z])/g, ' $1').trim(), value))}
              {activeSection === 'Academic' && <>{field('Course', student.course)}{field('Year', student.year)}{field('Room', student.room)}{field('Bed', student.bed)}</>}
              {activeSection === 'Emergency Contact' && <>{field('Guardian', student.guardian)}{field('Guardian phone', student.guardianPhone)}</>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
