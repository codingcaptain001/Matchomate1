import { useEffect, useState } from 'react';
import { Brain, Shield, Sparkles } from 'lucide-react';
import { getCompatibility, getMatchingStudents } from '../api/matching';

const matchingFactors = [
  ['sleep', 'Sleep Schedule'],
  ['cleanliness', 'Cleanliness'],
  ['noise', 'Noise Tolerance'],
  ['study', 'Study Routine'],
  ['social', 'Social Lifestyle'],
  ['guests', 'Guest Frequency'],
  ['food', 'Food Preference'],
  ['smoking', 'Smoking Preference'],
];

function initials(name = '') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
}

function matchLabel(score) {
  if (score >= 90) return 'Excellent Match';
  if (score >= 75) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  return 'Low Compatibility';
}

export default function AIMatchingPage() {
  const [students, setStudents] = useState([]);
  const [studentAId, setStudentAId] = useState('STU001');
  const [studentBId, setStudentBId] = useState('STU003');
  const [compatibility, setCompatibility] = useState(null);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getMatchingStudents({ signal: controller.signal })
      .then((results) => setStudents(results))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setStudentsLoading(false);
      });
    return () => controller.abort();
  }, []);

  const studentA = students.find((student) => student.id === studentAId);
  const studentB = students.find((student) => student.id === studentBId);

  const calculateMatch = async () => {
    if (!studentA || !studentB || studentAId === studentBId) {
      setError('Select two different students to calculate compatibility.');
      setCompatibility(null);
      return;
    }
    setCalculating(true);
    setError('');
    setCompatibility(null);
    try {
      setCompatibility(await getCompatibility(studentAId, studentBId));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCalculating(false);
    }
  };

  const selectStudent = (setter) => (event) => {
    setter(event.target.value);
    setCompatibility(null);
    setError('');
  };

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
              value={studentAId}
              onChange={selectStudent(setStudentAId)}
              disabled={studentsLoading || students.length === 0}
            >
              {students.length === 0 && <option value="">No students available</option>}
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.room}</option>
              ))}
            </select>
            {studentA && <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar avatar--lg" style={{ background: 'linear-gradient(135deg, var(--accent-400), #a78bfa)', color: 'white' }}>{initials(studentA.name)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-md)' }}>{studentA.name}</div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{studentA.course} · Room {studentA.room}</div>
              </div>
            </div>}
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
                {calculating ? '…' : compatibility ? `${compatibility.overallScore}%` : '--'}
              </span>
              <span style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-tertiary)', marginTop: 2 }}>MATCH</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="badge badge--success" style={{ gap: 4 }}>
                {compatibility ? matchLabel(compatibility.overallScore) : 'Awaiting calculation'}
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
              value={studentBId}
              onChange={selectStudent(setStudentBId)}
              disabled={studentsLoading || students.length === 0}
            >
              {students.length === 0 && <option value="">No students available</option>}
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.room}</option>
              ))}
            </select>
            {studentB && <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar avatar--lg" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: 'white' }}>{initials(studentB.name)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-md)' }}>{studentB.name}</div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{studentB.course} · Room {studentB.room}</div>
              </div>
            </div>}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
          <button type="button" className="btn btn--primary" onClick={calculateMatch} disabled={studentsLoading || calculating || !studentA || !studentB || studentAId === studentBId}>
            {calculating ? 'Calculating compatibility...' : 'Calculate Compatibility'}
          </button>
        </div>
        {studentsLoading && <p role="status" style={{ textAlign: 'center', marginTop: 12 }}>Loading demo students...</p>}
        {error && <p role="alert" style={{ color: 'var(--danger-600)', textAlign: 'center', marginTop: 12 }}>{error}</p>}
      </div>

      {/* Matching factors */}
      <div className="grid-2col" style={{ animation: 'fadeInUp 600ms ease' }}>
        {/* Factor breakdown */}
        <div className="card">
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>
            Compatibility Factors
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {matchingFactors.map(([key, label]) => {
              const score = compatibility?.components?.[key];
              return <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{
                    fontSize: 'var(--font-sm)', fontWeight: 700,
                    color: typeof score !== 'number' ? 'var(--text-tertiary)' : score >= 90 ? 'var(--success-600)' : score >= 80 ? 'var(--accent-600)' : 'var(--warning-600)',
                  }}>
                    {typeof score === 'number' ? `${score}%` : '--'}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-bar__fill" style={{
                    width: `${score ?? 0}%`,
                    background: (score ?? 0) >= 90
                      ? 'var(--success-500)'
                      : (score ?? 0) >= 80
                        ? 'var(--accent-500)'
                        : 'var(--warning-500)',
                    borderRadius: 'var(--radius-full)',
                  }} />
                </div>
              </div>;
            })}
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
              {compatibility?.explanation || 'Select two students, then calculate compatibility to see their demo lifestyle analysis.'}
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
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--success-700)' }}>
                {compatibility ? `Compatibility: ${matchLabel(compatibility.overallScore)}` : 'Compatibility not calculated'}
              </span>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--success-700)', lineHeight: 1.5 }}>
              {compatibility?.differences.length
                ? compatibility.differences.join('. ')
                : compatibility ? 'No notable lifestyle differences detected.' : 'Run a calculation to compare the selected demo profiles.'}
            </p>
          </div>

          {/* Shared + differences */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <h4 style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--success-600)', marginBottom: 8 }}>✓ Shared</h4>
              {compatibility?.strengths.length
                ? compatibility.strengths.map((strength) => <div key={strength} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 4 }}>{strength}</div>)
                : <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>No calculated strengths yet.</div>}
            </div>
            <div>
              <h4 style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--warning-600)', marginBottom: 8 }}>△ Differences</h4>
              {compatibility?.differences.length
                ? compatibility.differences.map((difference) => <div key={difference} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 4 }}>{difference}</div>)
                : <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>No calculated differences.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
