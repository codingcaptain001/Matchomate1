import { useState } from 'react';
import {
  Clock, LogIn, LogOut, CheckCircle2, AlertTriangle, ShieldCheck,
  Calendar, MapPin, QrCode, Smartphone, Info, Fingerprint, Scan
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { formatDate } from '../components/ops/OpsShared';

export default function StudentAttendance() {
  const { currentStudent, movements, currentMovementStatus, markMovement, attendance, today } = useHostelStore();

  const [customGate, setCustomGate] = useState('Block B Gate');
  const [movementReason, setMovementReason] = useState('Campus / Classes');
  const isInside = currentMovementStatus === 'IN';

  const myTodayAttendance = attendance.find((a) => a.studentId === currentStudent?.id && a.date === today);

  const handleMark = (type) => {
    markMovement(type, `${customGate} (${movementReason})`);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, outline: 'none',
    border: '1.5px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)',
    transition: 'border-color 0.2s', appearance: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '40px 48px' }}>

      {/* ─── Header ─── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
          color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '5px 14px',
          borderRadius: 20, marginBottom: 12, border: '1px solid rgba(99,102,241,0.15)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <Fingerprint size={13} /> Hostel Movement Tracker
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.025em' }}>
          Attendance & Movement
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-tertiary)', margin: 0 }}>
          Digital check-in & gate out-pass log for ABC Residency. Synced live with warden rolls.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ─── Main In/Out Action Card ─── */}
        <div style={{
          borderRadius: 20, padding: '40px 36px', textAlign: 'center', overflow: 'hidden', position: 'relative',
          background: isInside
            ? 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(5,150,105,0.02))'
            : 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02))',
          border: `1.5px solid ${isInside ? 'rgba(5,150,105,0.2)' : 'rgba(245,158,11,0.2)'}`,
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: isInside ? 'rgba(5,150,105,0.04)' : 'rgba(245,158,11,0.04)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -30, width: 160, height: 160, borderRadius: '50%', background: isInside ? 'rgba(5,150,105,0.03)' : 'rgba(245,158,11,0.03)' }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Status badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 24,
              background: isInside ? 'rgba(5,150,105,0.1)' : 'rgba(245,158,11,0.1)',
              border: `1px solid ${isInside ? 'rgba(5,150,105,0.2)' : 'rgba(245,158,11,0.2)'}`,
              color: isInside ? '#059669' : '#d97706', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
              marginBottom: 20,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: isInside ? '#22c55e' : '#f59e0b', boxShadow: `0 0 8px ${isInside ? '#22c55e' : '#f59e0b'}` }} />
              CURRENT STATUS: {isInside ? 'INSIDE HOSTEL' : 'OUTSIDE CAMPUS'}
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              {isInside ? 'You are Safe Inside ABC Residency' : 'You are Currently Outside Campus'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
              {isInside
                ? 'Planning to head out for lectures, library, or market? Select your destination and generate your gate out-pass.'
                : 'Returned back to hostel? Tap below to mark your biometric check-in and night roll-call.'}
            </p>

            {/* Gate Selection */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', maxWidth: 520,
              margin: '0 auto 28px', padding: 16, background: 'var(--bg-secondary)',
              borderRadius: 14, border: '1px solid var(--border-primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ textAlign: 'left', flex: 1, minWidth: 160 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gate / Checkpoint</label>
                <select style={{ ...inputStyle, marginTop: 6 }} value={customGate} onChange={(e) => setCustomGate(e.target.value)}>
                  <option>Block B Gate</option>
                  <option>Campus Main Gate</option>
                  <option>North Academic Gate</option>
                  <option>Library Turnstile</option>
                </select>
              </div>
              <div style={{ textAlign: 'left', flex: 1, minWidth: 160 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Purpose / Destination</label>
                <select style={{ ...inputStyle, marginTop: 6 }} value={movementReason} onChange={(e) => setMovementReason(e.target.value)}>
                  <option>Campus / Classes</option>
                  <option>Central Library</option>
                  <option>Market / Grocery</option>
                  <option>Dinner / Outing</option>
                  <option>Sports Complex</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {isInside ? (
                <button type="button" onClick={() => handleMark('OUT')} style={{
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: 'white',
                  border: 'none', borderRadius: 14, padding: '16px 40px', fontSize: 16, fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(217,119,6,0.3)', transition: 'transform 0.2s, box-shadow 0.2s',
                  letterSpacing: '0.02em',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(217,119,6,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(217,119,6,0.3)'; }}
                >
                  <LogOut size={22} /> MARK OUT — Leaving Hostel
                </button>
              ) : (
                <button type="button" onClick={() => handleMark('IN')} style={{
                  background: 'linear-gradient(135deg, #059669, #34d399)', color: 'white',
                  border: 'none', borderRadius: 14, padding: '16px 40px', fontSize: 16, fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(5,150,105,0.3)', transition: 'transform 0.2s, box-shadow 0.2s',
                  letterSpacing: '0.02em',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(5,150,105,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(5,150,105,0.3)'; }}
                >
                  <LogIn size={22} /> MARK IN — Returning to Hostel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Warden Roll Sync ─── */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
          padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Warden Attendance Roll · Today ({today})</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                Status:
                <span style={{
                  padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  color: '#059669', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)',
                }}>
                  {myTodayAttendance?.status || 'present'}
                </span>
                {myTodayAttendance?.checkIn && <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>· Check-in at {myTodayAttendance.checkIn}</span>}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Fingerprint size={15} /> Method: <strong>{myTodayAttendance?.method || 'Biometric'}</strong>
          </div>
        </div>

        {/* ─── Movement Log ─── */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid var(--border-primary)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} color="#6366f1" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Movement Log History</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>Every gate IN / OUT scan is logged chronologically</div>
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '4px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}>
              {movements.length} scans
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {movements.map((m, i) => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: i < movements.length - 1 ? '1px solid var(--border-primary)' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: m.type === 'IN' ? 'rgba(5,150,105,0.08)' : 'rgba(245,158,11,0.08)',
                    color: m.type === 'IN' ? '#059669' : '#d97706',
                    border: `1px solid ${m.type === 'IN' ? 'rgba(5,150,105,0.15)' : 'rgba(245,158,11,0.15)'}`,
                  }}>
                    {m.type === 'IN' ? <LogIn size={18} /> : <LogOut size={18} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {m.time}
                      <span style={{ fontSize: 12, fontWeight: 700, color: m.type === 'IN' ? '#059669' : '#d97706' }}>{m.type === 'IN' ? 'CHECK-IN' : 'CHECK-OUT'}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {m.location} · {m.date}
                    </div>
                  </div>
                </div>
                <span style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  color: m.type === 'IN' ? '#059669' : '#d97706',
                  background: m.type === 'IN' ? 'rgba(5,150,105,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${m.type === 'IN' ? 'rgba(5,150,105,0.15)' : 'rgba(245,158,11,0.15)'}`,
                }}>
                  {m.type === 'IN' ? 'Returned' : 'Departed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Policy Note ─── */}
        <div style={{
          background: 'rgba(99,102,241,0.04)', borderRadius: 16, padding: '20px 24px',
          border: '1px solid rgba(99,102,241,0.12)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
            <Info size={16} color="#6366f1" />
            Hostel Curfew & Gate Pass Regulations
          </div>
          <p style={{ margin: 0 }}>
            Curfew time for ABC Residency is <strong>10:00 PM</strong> on weekdays and <strong>11:00 PM</strong> on weekends.
            Any check-ins past curfew trigger an automated notification to registered guardian {currentStudent?.guardianName || 'Suresh Sharma'}.
            For night stays outside campus, please apply for an authorized Leave Out-Pass.
          </p>
        </div>
      </div>
    </div>
  );
}
