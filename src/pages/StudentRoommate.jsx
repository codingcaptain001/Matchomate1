import { studentProfile, matchingFactors } from '../data/mockData';
import { Users, Heart, Zap, Sparkles } from 'lucide-react';

export default function StudentRoommate() {
  return (
    <div className="page-content" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header animate-stagger" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">My Roommate</h1>
        <p className="page-header__subtitle">Your compatibility breakdown with {studentProfile.roommate}.</p>
      </div>

      <div className="animate-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Main Card */}
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div className="avatar" style={{ width: 80, height: 80, fontSize: 'var(--font-3xl)', background: 'var(--accent-100)', color: 'var(--accent-700)' }}>
              {studentProfile.avatar}
            </div>
            <Heart size={32} style={{ color: 'var(--accent-500)', fill: 'var(--accent-100)' }} />
            <div className="avatar" style={{ width: 80, height: 80, fontSize: 'var(--font-3xl)', background: 'var(--gray-100)', color: 'var(--gray-700)' }}>
              {studentProfile.roommate.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {studentProfile.compatibility}% Compatible
          </h2>
          <p style={{ fontSize: 'var(--font-md)', color: 'var(--text-secondary)', marginTop: 8 }}>
            You and {studentProfile.roommate.split(' ')[0]} are a great match!
          </p>
        </div>

        {/* Visual Comparison */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-6)' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-600)' }} />
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>Shared Preferences</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {matchingFactors.map(factor => (
              <div key={factor.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <span>{factor.label}</span>
                  <span style={{ color: factor.match >= 90 ? 'var(--success-600)' : factor.match >= 80 ? 'var(--warning-600)' : 'var(--danger-600)' }}>
                    {factor.match}% Match
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar__fill" style={{ width: `${factor.match}%`, background: factor.match >= 90 ? 'var(--success-500)' : factor.match >= 80 ? 'var(--warning-500)' : 'var(--danger-500)' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--warning-500)' }}>
            <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Zap size={16} style={{ color: 'var(--warning-600)' }} /> Key Difference
            </div>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              You differ slightly in <strong>Social Lifestyle</strong>. While you prefer a balanced environment, {studentProfile.roommate.split(' ')[0]} is slightly more outgoing.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
