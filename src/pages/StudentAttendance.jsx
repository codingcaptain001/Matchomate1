import { useState } from 'react';
import {
  Clock, LogIn, LogOut, CheckCircle2, AlertTriangle, ShieldCheck,
  Calendar, MapPin, QrCode, Smartphone, Info
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { formatDate } from '../components/ops/OpsShared';

export default function StudentAttendance() {
  const {
    currentStudent,
    movements,
    currentMovementStatus,
    markMovement,
    attendance,
    today,
  } = useHostelStore();

  const [customGate, setCustomGate] = useState('Block B Gate');
  const [movementReason, setMovementReason] = useState('Campus / Classes');
  const isInside = currentMovementStatus === 'IN';

  const myTodayAttendance = attendance.find((a) => a.studentId === currentStudent?.id && a.date === today);

  const handleMark = (type) => {
    markMovement(type, `${customGate} (${movementReason})`);
  };

  return (
    <div className="student-container" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Hostel Movement Tracker
        </span>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
          Attendance & Movement
        </h1>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          Digital check-in & gate out-pass log for ABC Residency. Synced live with warden rolls.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Main In/Out Action Card */}
        <div className="card" style={{
          padding: 'var(--space-6)',
          background: isInside
            ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(240, 253, 244, 0.98))'
            : 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(254, 243, 199, 0.98))',
          border: isInside ? '1.5px solid rgba(22, 163, 74, 0.3)' : '1.5px solid rgba(217, 119, 6, 0.3)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className={`badge ${isInside ? 'badge--success' : 'badge--warning'}`} style={{ fontSize: '12px', padding: '6px 14px' }}>
              CURRENT STATUS: {isInside ? 'INSIDE HOSTEL (CHECKED IN)' : 'OUTSIDE HOSTEL (CHECKED OUT)'}
            </span>
          </div>

          <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: 'var(--text-primary)', margin: '12px 0 6px' }}>
            {isInside ? 'You are Safe Inside ABC Residency' : 'You are Currently Outside Campus'}
          </h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 20px' }}>
            {isInside
              ? 'Planning to head out for lectures, library, or market? Tap below to generate your gate out-pass.'
              : 'Returned back to hostel? Tap below to mark your biometric check-in and night roll-call.'}
          </p>

          {/* Gate Selection Form */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
            maxWidth: 520,
            margin: '0 auto 24px',
            padding: 12,
            background: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ textAlign: 'left', flex: 1, minWidth: 160 }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Gate / Checkpoint</label>
              <select className="ops-select" style={{ width: '100%', marginTop: 4 }} value={customGate} onChange={(e) => setCustomGate(e.target.value)}>
                <option>Block B Gate</option>
                <option>Campus Main Gate</option>
                <option>North Academic Gate</option>
                <option>Library Turnstile</option>
              </select>
            </div>
            <div style={{ textAlign: 'left', flex: 1, minWidth: 160 }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Purpose / Destination</label>
              <select className="ops-select" style={{ width: '100%', marginTop: 4 }} value={movementReason} onChange={(e) => setMovementReason(e.target.value)}>
                <option>Campus / Classes</option>
                <option>Central Library</option>
                <option>Market / Grocery</option>
                <option>Dinner / Outing</option>
                <option>Sports Complex</option>
              </select>
            </div>
          </div>

          {/* Giant Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            {isInside ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => handleMark('OUT')}
                style={{
                  background: 'var(--warning-600)',
                  borderColor: 'var(--warning-600)',
                  color: 'white',
                  padding: '14px 36px',
                  fontSize: 'var(--font-base)',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <LogOut size={20} />
                MARK OUT (Leaving Hostel)
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => handleMark('IN')}
                style={{
                  background: 'var(--success-600)',
                  borderColor: 'var(--success-600)',
                  color: 'white',
                  padding: '14px 36px',
                  fontSize: 'var(--font-base)',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <LogIn size={20} />
                MARK IN (Returning to Hostel)
              </button>
            )}
          </div>
        </div>

        {/* Today's Admin Roll Status Sync Pill */}
        <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-50)', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Warden Attendance Roll · Today ({today})</div>
              <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>
                Status: <span className="badge badge--success">{myTodayAttendance?.status || 'present'}</span>
                {myTodayAttendance?.checkIn && ` · Check-in recorded at ${myTodayAttendance.checkIn}`}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
            Method: <strong>{myTodayAttendance?.method || 'Biometric'}</strong>
          </div>
        </div>

        {/* Movement History */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} style={{ color: 'var(--accent-600)' }} />
                Movement Log History
              </h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                Every gate IN / OUT scan is logged chronologically
              </p>
            </div>
            <span className="badge badge--default">{movements.length} scans</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {movements.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `4px solid ${m.type === 'IN' ? 'var(--success-500)' : 'var(--warning-500)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: m.type === 'IN' ? 'var(--success-50)' : 'var(--warning-50)',
                    color: m.type === 'IN' ? 'var(--success-600)' : 'var(--warning-600)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {m.type === 'IN' ? <LogIn size={16} /> : <LogOut size={16} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.time} — <span style={{ color: m.type === 'IN' ? 'var(--success-600)' : 'var(--warning-600)' }}>{m.type}</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {m.location} · {m.date}
                    </div>
                  </div>
                </div>
                <span className={`badge ${m.type === 'IN' ? 'badge--success' : 'badge--warning'}`}>
                  {m.type === 'IN' ? 'Returned' : 'Departed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Curfew & Movement Policy Note */}
        <div className="card" style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Info size={14} style={{ color: 'var(--accent-600)' }} />
            Hostel Curfew & Gate Pass Regulations
          </div>
          <p>
            Curfew time for ABC Residency is <strong>10:00 PM</strong> on weekdays and <strong>11:00 PM</strong> on weekends. Any check-ins past curfew trigger an automated notification to registered guardian Suresh Sharma. For night stays outside campus, please apply for an authorized Leave Out-Pass.
          </p>
        </div>
      </div>
    </div>
  );
}
