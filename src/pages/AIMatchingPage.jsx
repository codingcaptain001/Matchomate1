import { useState } from 'react';
import { Brain, ChevronDown, Shield, AlertTriangle, Sparkles, Users } from 'lucide-react';
import { students, matchingFactors } from '../data/mockData';

export default function AIMatchingPage() {
  const [studentA, setStudentA] = useState(students[0]);
  const [studentB, setStudentB] = useState(students[2]);
  const overallScore = 91;

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain size={24} style={{ color: 'var(--accent-500)' }} />
          <h1 className="page-header__greeting">AI Roommate Matching</h1>
        </div>
        <p className="page-header__subtitle">
          Find compatible living combinations using lifestyle preferences and behavioral signals.
        </p>
      </div>

      {/* Student selectors */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', animation: 'fadeInUp 500ms ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'var(--space-6)', alignItems: 'center' }}>
          {/* Student A */}
          <div>
            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-quaternary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>
              Student A
            </label>
            <select
              className="input"
              style={{ width: '100%', padding: '10px 14px', cursor: 'pointer', background: 'var(--bg-tertiary)' }}
              value={studentA.id}
              onChange={(e) => setStudentA(students.find(s => s.id === e.target.value) || students[0])}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.room}</option>
              ))}
            </select>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar avatar--lg" style={{ background: 'linear-gradient(135deg, var(--accent-400), #a78bfa)', color: 'white' }}>
                {studentA.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-md)' }}>{studentA.name}</div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{studentA.course} · Room {studentA.room}</div>
              </div>
            </div>
          </div>

          {/* Score center */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(124, 58, 237, 0.1))',
              border: '3px solid var(--accent-500)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
            }}>
              <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--accent-600)', lineHeight: 1 }}>
                {overallScore}%
              </span>
              <span style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-tertiary)', marginTop: 2 }}>MATCH</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="badge badge--success" style={{ gap: 4 }}>
                <Shield size={10} /> Low Conflict Risk
              </span>
            </div>
          </div>

          {/* Student B */}
          <div>
            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-quaternary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>
              Student B
            </label>
            <select
              className="input"
              style={{ width: '100%', padding: '10px 14px', cursor: 'pointer', background: 'var(--bg-tertiary)' }}
              value={studentB.id}
              onChange={(e) => setStudentB(students.find(s => s.id === e.target.value) || students[2])}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.room}</option>
              ))}
            </select>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar avatar--lg" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: 'white' }}>
                {studentB.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-md)' }}>{studentB.name}</div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{studentB.course} · Room {studentB.room}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matching factors */}
      <div className="grid-2col" style={{ animation: 'fadeInUp 600ms ease' }}>
        {/* Factor breakdown */}
        <div className="card">
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>
            Compatibility Factors
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {matchingFactors.map((factor) => (
              <div key={factor.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>{factor.label}</span>
                  <span style={{
                    fontSize: 'var(--font-sm)', fontWeight: 700,
                    color: factor.match >= 90 ? 'var(--success-600)' : factor.match >= 80 ? 'var(--accent-600)' : 'var(--warning-600)',
                  }}>
                    {factor.match}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-bar__fill" style={{
                    width: `${factor.match}%`,
                    background: factor.match >= 90
                      ? 'var(--success-500)'
                      : factor.match >= 80
                        ? 'var(--accent-500)'
                        : 'var(--warning-500)',
                    borderRadius: 'var(--radius-full)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="card card--ai">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-5)' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-500)' }} />
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600 }}>AI Analysis</h3>
          </div>

          {/* Why this match */}
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--accent-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
            borderLeft: '3px solid var(--accent-500)',
          }}>
            <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-700)', marginBottom: 4 }}>
              Why this match?
            </div>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--accent-800)', lineHeight: 1.6 }}>
              Both students prefer quiet environments and have similar sleep schedules. Their cleanliness standards are closely aligned, and both maintain consistent study routines.
            </p>
          </div>

          {/* Conflict risk */}
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--success-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Shield size={14} style={{ color: 'var(--success-600)' }} />
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--success-700)' }}>Conflict Risk: LOW</span>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--success-700)', lineHeight: 1.5 }}>
              No major lifestyle conflicts detected. Minor differences in social preferences are within acceptable range.
            </p>
          </div>

          {/* Shared + differences */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <h4 style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--success-600)', marginBottom: 8 }}>✓ Shared</h4>
              {['Sleep schedule', 'Cleanliness', 'Study routine'].map(s => (
                <div key={s} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 4 }}>{s}</div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--warning-600)', marginBottom: 8 }}>△ Differences</h4>
              {['Social preference', 'Guest frequency'].map(s => (
                <div key={s} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 4 }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
