import { useEffect, useState } from 'react';
import { Heart, Sparkles, Users, Zap } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { getCompatibility, getRoommateMatches } from '../api/matching';

const components = [
  ['sleep', 'Sleep Schedule'],
  ['cleanliness', 'Cleanliness'],
  ['study', 'Study Habits'],
  ['noise', 'Noise Preference'],
  ['social', 'Social Preference'],
  ['guests', 'Guest Frequency'],
  ['food', 'Food'],
  ['smoking', 'Smoking'],
];

export default function StudentRoommate() {
  const { currentStudent } = useHostelStore();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentStudent?.id) return undefined;
    const controller = new AbortController();
    getRoommateMatches(currentStudent.id, { signal: controller.signal })
      .then(({ matches: results }) => {
        setMatches(results);
        setSelectedMatch(results[0] || null);
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setMatchesLoading(false);
      });
    return () => controller.abort();
  }, [currentStudent?.id]);

  const viewCompatibility = async (match) => {
    setSelectedMatch(match);
    setShowAllMatches(false);
    setDetailsLoading(true);
    setError('');
    try {
      const result = await getCompatibility(currentStudent.id, match.studentId);
      setSelectedMatch({ ...match, ...result });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const initials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2);

  return (
    <div className="page-content" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header animate-stagger" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">My Roommate</h1>
        <p className="page-header__subtitle">Your lifestyle compatibility and ranked roommate recommendations.</p>
      </div>

      <div className="animate-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {matchesLoading && <div className="card" role="status">Finding your best roommate matches...</div>}
        {!matchesLoading && error && <div className="card" role="alert">{error}</div>}
        {!matchesLoading && !error && matches.length === 0 && (
          <div className="card">No roommate matches available yet. Complete your lifestyle profile to receive accurate matches.</div>
        )}
        {!matchesLoading && !error && selectedMatch && (
          <>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                <div className="avatar" style={{ width: 80, height: 80, fontSize: 'var(--font-3xl)', background: 'var(--accent-100)', color: 'var(--accent-700)' }}>
                  {initials(currentStudent?.name)}
                </div>
                <Heart size={32} style={{ color: 'var(--accent-500)', fill: 'var(--accent-100)' }} />
                <div className="avatar" style={{ width: 80, height: 80, fontSize: 'var(--font-3xl)', background: 'var(--gray-100)', color: 'var(--gray-700)' }}>
                  {initials(selectedMatch.name)}
                </div>
              </div>
              <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedMatch.compatibilityScore}% Compatible
              </h2>
              <p style={{ fontSize: 'var(--font-md)', color: 'var(--text-secondary)', marginTop: 8 }}>
                {selectedMatch.name} · {selectedMatch.label}
              </p>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 8 }}>
                {selectedMatch.explanation}
              </p>
              <button type="button" className="btn btn--secondary btn--sm" style={{ marginTop: 16 }} onClick={() => setShowAllMatches((show) => !show)}>
                <Users size={14} /> {showAllMatches ? 'Hide Matches' : 'View All Matches'}
              </button>
            </div>

            {showAllMatches && (
              <div className="card">
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Ranked Matches</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {matches.map((match) => (
                    <div key={match.studentId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{match.name}</div>
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{match.label} · {match.compatibilityScore}%</div>
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>{match.strengths.join(' · ') || match.explanation}</div>
                      </div>
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => viewCompatibility(match)}>View Compatibility</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-6)' }}>
                <Sparkles size={20} style={{ color: 'var(--accent-600)' }} />
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>Compatibility Details</h3>
              </div>
              {detailsLoading ? <p role="status">Loading compatibility details...</p> : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    {components.map(([key, label]) => {
                      const score = selectedMatch.components?.[key];
                      if (typeof score !== 'number') return null;
                      const scoreColor = score >= 85
                        ? 'var(--success-500)'
                        : score >= 70
                          ? 'var(--accent-500)'
                          : score >= 50
                            ? 'var(--warning-500)'
                            : 'var(--danger-500)';
                      return (
                        <div key={key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                            <span>{label}</span><span style={{ color: scoreColor, fontWeight: 700 }}>{score}%</span>
                          </div>
                          <div className="progress-bar"><div className="progress-bar__fill" style={{ width: `${score}%`, background: scoreColor }} /></div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 600, marginBottom: 8 }}><Sparkles size={15} /> Why you match</h4>
                    {selectedMatch.strengths?.length
                      ? selectedMatch.strengths.map((strength) => <p key={strength} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 5 }}>✓ {strength}</p>)
                      : <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>No strong preference overlaps identified.</p>}
                  </div>
                  <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--warning-500)' }}>
                    <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Zap size={16} style={{ color: 'var(--warning-600)' }} /> Things to know
                    </div>
                    {selectedMatch.differences?.length
                      ? selectedMatch.differences.map((difference) => <p key={difference} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 4 }}>• {difference}</p>)
                      : <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>No notable lifestyle differences.</p>}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
