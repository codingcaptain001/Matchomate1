import { useEffect, useState } from 'react';
import {
  Heart, Sparkles, Users, Zap, CheckCircle2, AlertTriangle, Brain,
  GraduationCap, Moon, Paintbrush, BookOpen, Volume2, UserPlus, Utensils,
  Cigarette, User, ChevronRight, Star, Shield, MessageCircle
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { getCompatibility, getRoommateMatches } from '../api/matching';

const componentsMeta = [
  { key: 'sleep', label: 'Sleep Schedule', icon: <Moon size={18} />, color: '#6366f1' },
  { key: 'cleanliness', label: 'Cleanliness', icon: <Paintbrush size={18} />, color: '#0ea5e9' },
  { key: 'study', label: 'Study Habits', icon: <BookOpen size={18} />, color: '#8b5cf6' },
  { key: 'noise', label: 'Noise Preference', icon: <Volume2 size={18} />, color: '#f59e0b' },
  { key: 'social', label: 'Social Preference', icon: <Users size={18} />, color: '#ec4899' },
  { key: 'guests', label: 'Guest Frequency', icon: <UserPlus size={18} />, color: '#14b8a6' },
  { key: 'food', label: 'Food', icon: <Utensils size={18} />, color: '#22c55e' },
  { key: 'smoking', label: 'Smoking', icon: <Cigarette size={18} />, color: '#ef4444' },
];

export default function StudentRoommate() {
  const { currentStudent } = useHostelStore();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [viewMode, setViewMode] = useState('percentage');
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

  const initials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const getScoreColor = (score) => {
    if (score >= 90) return '#059669';
    if (score >= 75) return '#6366f1';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getMatchLabel = (score) => {
    if (score >= 90) return { text: 'Excellent Match', color: '#059669', bg: 'rgba(5,150,105,0.08)' };
    if (score >= 75) return { text: 'Great Match', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' };
    if (score >= 50) return { text: 'Good Match', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' };
    return { text: 'Fair Match', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>

      {/* ─── Hero Banner ─── */}
      <div style={{
        position: 'relative', padding: '48px 48px 80px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: 120, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '28px 28px' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 600 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
            color: '#a5b4fc', background: 'rgba(165,180,252,0.12)', padding: '5px 14px',
            borderRadius: 20, marginBottom: 16, border: '1px solid rgba(165,180,252,0.15)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <Heart size={13} /> Roommate Compatibility
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', margin: '0 0 8px', letterSpacing: '-0.025em' }}>
            My Roommate
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
            Your lifestyle compatibility and ranked roommate recommendations.
          </p>
        </div>

        {/* Tagline badge */}
        <div style={{
          position: 'absolute', top: 48, right: 48, background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)', borderRadius: 16, padding: '16px 20px',
          border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageCircle size={20} color="#a5b4fc" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Better roommates.</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Happier hostel life.</div>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div style={{ padding: '0 48px 48px', marginTop: -52, position: 'relative', zIndex: 10 }}>

        {matchesLoading && (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)', padding: 60, textAlign: 'center' }}>
            <Sparkles size={40} color="var(--text-tertiary)" style={{ opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Finding your best roommate matches...</div>
          </div>
        )}

        {!matchesLoading && error && (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)', padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>{error}</div>
        )}

        {!matchesLoading && !error && matches.length === 0 && (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)', padding: 60, textAlign: 'center' }}>
            <Users size={44} color="var(--text-tertiary)" style={{ opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>No matches available</div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Complete your lifestyle profile to receive accurate matches.</div>
          </div>
        )}

        {!matchesLoading && !error && selectedMatch && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ─── Roommate Card ─── */}
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
              padding: '28px 32px', display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap',
            }}>
              {/* Left: Avatar + Info */}
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flex: 1, minWidth: 250 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20, flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em',
                }}>
                  {initials(selectedMatch.name)}
                </div>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                    {selectedMatch.name}
                  </h2>
                  <div style={{ fontSize: 13, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GraduationCap size={14} /> {selectedMatch.label || 'B.Tech ME'} · Room {currentStudent?.room || 'B-304'} (Bed B)
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {['Same course track', 'Similar lifestyle', 'Great match'].map((tag, i) => (
                      <span key={i} style={{
                        fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8,
                        background: 'rgba(99,102,241,0.06)', color: '#6366f1',
                        border: '1px solid rgba(99,102,241,0.12)',
                      }}>
                        {i === 2 ? '✨ ' : ''}{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center: Score Ring */}
              <div style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto' }}>
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="48" fill="none" stroke="var(--border-primary)" strokeWidth="8" />
                    <circle cx="55" cy="55" r="48" fill="none"
                      stroke={getScoreColor(selectedMatch.compatibilityScore)}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(selectedMatch.compatibilityScore / 100) * 301.6} 301.6`}
                      transform="rotate(-90 55 55)"
                      style={{ transition: 'stroke-dasharray 0.8s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {selectedMatch.compatibilityScore}%
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, marginTop: 2 }}>Compatible</div>
                  </div>
                </div>
                {(() => {
                  const ml = getMatchLabel(selectedMatch.compatibilityScore);
                  return (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10,
                      fontSize: 12, fontWeight: 700, color: ml.color, background: ml.bg,
                      padding: '5px 14px', borderRadius: 20, border: `1px solid ${ml.color}20`,
                    }}>
                      <Star size={13} /> {ml.text}
                    </div>
                  );
                })()}
              </div>

              {/* Right: Why you match + actions */}
              <div style={{ minWidth: 200 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Why you match?</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(selectedMatch.strengths || []).slice(0, 3).map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={15} color="#059669" /> {s}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button style={{
                    padding: '10px 20px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                  }}>
                    View Detailed Analysis <ChevronRight size={15} />
                  </button>
                  <button onClick={() => setShowAllMatches(s => !s)} style={{
                    padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border-primary)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Users size={15} /> {showAllMatches ? 'Hide' : 'View All'}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── All Matches ─── */}
            {showAllMatches && (
              <div style={{
                background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
              }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-primary)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Ranked Matches</h3>
                </div>
                {matches.map((match, i) => (
                  <div key={match.studentId} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    padding: '16px 24px', borderBottom: i < matches.length - 1 ? '1px solid var(--border-primary)' : 'none',
                    transition: 'background 0.15s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => viewCompatibility(match)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: match.studentId === selectedMatch.studentId ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg-tertiary)',
                        color: match.studentId === selectedMatch.studentId ? 'white' : 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                      }}>
                        {initials(match.name)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{match.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{match.label} · {match.compatibilityScore}%</div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--text-tertiary)" />
                  </div>
                ))}
              </div>
            )}

            {/* ─── Compatibility Details ─── */}
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-primary)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '28px 32px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sparkles size={20} color="#6366f1" />
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>Compatibility Details</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>How well you match across key lifestyle factors.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, background: 'var(--bg-tertiary)', padding: 3, borderRadius: 10, border: '1px solid var(--border-primary)' }}>
                  {['Percentage', 'Comparison'].map(mode => (
                    <button key={mode} onClick={() => setViewMode(mode.toLowerCase())} style={{
                      padding: '6px 16px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      background: viewMode === mode.toLowerCase() ? 'var(--accent-500)' : 'transparent',
                      color: viewMode === mode.toLowerCase() ? 'white' : 'var(--text-secondary)',
                      transition: 'all 0.2s',
                    }}>{mode}</button>
                  ))}
                </div>
              </div>

              {detailsLoading ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading compatibility details...</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
                  {componentsMeta.map(({ key, label, icon, color }) => {
                    const score = selectedMatch.components?.[key];
                    if (typeof score !== 'number') return null;
                    const barColor = getScoreColor(score);
                    return (
                      <div key={key} style={{
                        background: 'var(--bg-tertiary)', borderRadius: 14, padding: '18px 16px',
                        border: '1px solid var(--border-primary)', transition: 'transform 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `${color}12`, color: color,
                          }}>
                            {icon}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--border-primary)', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', borderRadius: 3, background: barColor,
                              width: `${score}%`, transition: 'width 0.6s ease',
                            }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 800, color: barColor, minWidth: 36, textAlign: 'right' }}>{score}%</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>
                          {score >= 90 ? 'Very similar patterns' : score >= 75 ? 'Some differences' : score >= 50 ? 'Moderate differences' : 'Different preferences'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ─── Bottom Cards: Strengths / Differences / Summary ─── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              {/* Strengths */}
              <div style={{
                background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
                padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Shield size={18} color="#059669" />
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#059669', margin: 0 }}>Your Strengths</h4>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 14 }}>Key areas where you are well aligned.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(selectedMatch.strengths || []).map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={15} color="#059669" /> {s}
                    </div>
                  ))}
                  {(!selectedMatch.strengths || selectedMatch.strengths.length === 0) && (
                    <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>No strong overlaps identified.</div>
                  )}
                </div>
              </div>

              {/* Differences */}
              <div style={{
                background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
                padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <AlertTriangle size={18} color="#f59e0b" />
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#f59e0b', margin: 0 }}>Potential Differences</h4>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 14 }}>Areas to be aware of.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(selectedMatch.differences || []).length > 0 ? (
                    selectedMatch.differences.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <AlertTriangle size={14} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} /> {d}
                      </div>
                    ))
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={15} color="#059669" /> No significant differences
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div style={{
                background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
                padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Brain size={18} color="#8b5cf6" />
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#8b5cf6', margin: 0 }}>Compatibility Summary</h4>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 14 }}>AI-powered analysis of your match.</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {selectedMatch.explanation || `You have excellent lifestyle compatibility with ${selectedMatch.name}. This indicates a high potential for a comfortable and harmonious living experience.`}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
