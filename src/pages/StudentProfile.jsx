import { studentProfile, matchingFactors } from '../data/mockData';
import { User, Activity, FileText, CheckCircle2 } from 'lucide-react';

export default function StudentProfile() {
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
            {studentProfile.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 600, color: 'var(--text-primary)' }}>{studentProfile.name}</h2>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
              {studentProfile.course} (Year {studentProfile.year}) • {studentProfile.id}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Profile Completion</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="progress-bar" style={{ width: 100 }}>
                <div className="progress-bar__fill" style={{ width: `${studentProfile.profileCompletion}%`, background: 'var(--success-500)' }} />
              </div>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--success-600)' }}>{studentProfile.profileCompletion}%</span>
            </div>
          </div>
        </div>

        {/* Tabs style navigation (visual only) */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', borderBottom: '1px solid var(--border-primary)', paddingBottom: 'var(--space-4)' }}>
          <div className="tab tab--active">Personal Details</div>
          <div className="tab">Lifestyle Preferences</div>
          <div className="tab">Academic</div>
          <div className="tab">Emergency Contact</div>
        </div>

        {/* Form area */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>Lifestyle Preferences</h3>
            <button className="btn btn--secondary btn--sm">Edit</button>
          </div>
          
          <div className="grid-2col" style={{ gap: 'var(--space-6)' }}>
            {Object.entries(studentProfile.lifestyle).map(([key, value]) => (
              <div key={key} className="input-wrapper">
                <label className="input-label" style={{ textTransform: 'capitalize' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="input" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
