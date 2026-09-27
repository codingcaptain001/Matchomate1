import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BedDouble, Users, AlertCircle, FileText, CheckCircle2, ChevronRight,
  Bell, Calendar, Clock, CreditCard, LogIn, LogOut, ArrowRight,
  UtensilsCrossed, ShieldAlert, Sparkles, MapPin, UserCheck, Star,
  Heart, Check, X, Shield, QrCode, Building, Activity
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { inr, formatDate } from '../components/ops/OpsShared';
import { getRoommateMatches } from '../api/matching';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const {
    currentStudent,
    rooms = [],
    students = [],
    movements = [],
    currentMovementStatus,
    markMovement,
    payments = [],
    complaints = [],
    leaveRequests = [],
    messMenu = [],
    announcements = [],
    markPaymentPaid,
    showToast,
  } = useHostelStore();

    const assignedRoommates = students.filter(
    (student) =>
      student.room === currentStudent?.room &&
      student.id !== currentStudent?.id
  );

  const [payingModal, setPayingModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [compatibilityModal, setCompatibilityModal] = useState(false);
  const [greeting, setGreeting] = useState('Good evening');
  const [roommateMatch, setRoommateMatch] = useState({ loading: true, error: '', match: null });
  const assignedRoom = rooms.find((room) => room.number === currentStudent?.room);
  const matchedStudent = students.find((student) => student.id === roommateMatch.match?.studentId);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    if (!currentStudent?.id) return undefined;
    const controller = new AbortController();
    getRoommateMatches(currentStudent.id, { signal: controller.signal })
      .then(({ matches: results }) => setRoommateMatch({ loading: false, error: '', match: results[0] || null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setRoommateMatch({ loading: false, error: error.message, match: null });
      });
    return () => controller.abort();
  }, [currentStudent?.id]);

  // Student specific data with safe array fallbacks
  const myPayments = (payments || []).filter((p) => p.studentId === currentStudent?.id);
  const pendingPayment = myPayments.find((p) => p.status === 'pending' || p.status === 'overdue');
  const myComplaints = (complaints || []).filter((c) => c.studentId === currentStudent?.id && c.status !== 'resolved');
  const myLeaves = (leaveRequests || []).filter((l) => l.studentId === currentStudent?.id);
  const activeLeave = myLeaves.find((l) => l.status === 'approved' || l.status === 'pending');

  const isInside = currentMovementStatus === 'IN';

  const handlePayNow = () => {
    if (pendingPayment) {
      markPaymentPaid(pendingPayment.id, selectedMethod);
      setPayingModal(false);
      showToast(`Payment of ${inr(pendingPayment.amount)} processed successfully!`);
    }
  };

  const handleToggleMovement = () => {
    if (isInside) {
      markMovement('OUT', 'Main Campus Gate');
      showToast('Checked OUT — Exit biometric recorded at Main Campus Gate.');
    } else {
      markMovement('IN', 'Block B Gate');
      showToast('Checked IN — Entry biometric recorded at Block B Gate.');
    }
  };

  return (
    <div className="dashboard-root" style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto' }}>
      {/* ===================== HERO TOP SECTION ===================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.35fr',
        gap: 20,
        marginBottom: 20,
        alignItems: 'stretch'
      }}>
        {/* Left: User Welcome */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '12px 4px'
        }}>
          <span style={{ fontSize: '15px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
            {greeting},
          </span>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            margin: '4px 0 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            {currentStudent?.name?.split(' ')[0] || 'Rahul'}
            <span style={{ display: 'inline-block', animation: 'wave 2s infinite' }}>👋</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>{currentStudent?.course || 'B.Tech CSE'}</span>
            <span>•</span>
            <span>Room {currentStudent?.room || 'B-304'} (Bed {currentStudent?.bed || 'A'})</span>
            <span>•</span>
            <span>ABC Residency</span>
          </p>
        </div>

        {/* Right: Evening Campus Night Banner with Interactive Floating Status & Action */}
        <div style={{
          position: 'relative',
          borderRadius: 18,
          overflow: 'hidden',
          minHeight: 140,
          background: 'linear-gradient(135deg, #090d1a, #131b30)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '16px 20px',
        }}>
          {/* Background Night Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/hostel_night.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            opacity: 0.65,
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.3) 60%, rgba(11, 15, 25, 0.7) 100%)',
          }} />

          {/* Floating Pill & Mark Button */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
          }}>
            {/* Live status badge */}
            <div
              onClick={() => navigate('/student/attendance')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 16px',
                borderRadius: 9999,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(12px)',
                border: isInside ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isInside ? '#22c55e' : '#f59e0b',
                boxShadow: isInside ? '0 0 10px #22c55e' : '0 0 10px #f59e0b',
              }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                  {isInside ? 'You are inside the hostel' : 'You are currently outside'}
                </div>
                <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                  Last gate scan: <strong style={{ color: '#ffffff' }}>{movements[0]?.time || '06:18 PM'}</strong>
                </div>
              </div>
              <ChevronRight size={14} style={{ color: '#94a3b8', marginLeft: 2 }} />
            </div>

            {/* Toggle Mark In/Out Button */}
            <button
              type="button"
              onClick={handleToggleMovement}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 12,
                fontSize: '13px',
                fontWeight: 700,
                color: '#ffffff',
                background: isInside
                  ? 'linear-gradient(135deg, #c2410c, #ea580c)'
                  : 'linear-gradient(135deg, #15803d, #16a34a)',
                border: isInside ? '1px solid #f97316' : '1px solid #22c55e',
                boxShadow: isInside
                  ? '0 4px 16px rgba(234, 88, 12, 0.35)'
                  : '0 4px 16px rgba(22, 163, 74, 0.35)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isInside ? <LogOut size={16} /> : <LogIn size={16} />}
              {isInside ? 'Mark Out' : 'Mark In'}
            </button>
          </div>
        </div>
      </div>

      {/* ===================== 5 STATS CARDS ROW ===================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 14,
        marginBottom: 20
      }}>
        {/* Card 1: Current Status */}
        <div
          onClick={() => navigate('/student/attendance')}
          className="dashboard-stat-card"
          style={{
            padding: '14px 16px',
            borderRadius: 14,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(34, 197, 94, 0.12)',
            color: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Shield size={20} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Current Status</div>
            <div style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{isInside ? 'Inside Hostel' : 'Outside'}</span>
              <ChevronRight size={13} style={{ color: 'var(--text-quaternary)' }} />
            </div>
            <div style={{ fontSize: '11px', color: '#22c55e', marginTop: 1, fontWeight: 500 }}>
              Last scan: {movements[0]?.time || '06:18 PM'}
            </div>
          </div>
        </div>

        {/* Card 2: Today's Movement */}
        <div
          onClick={() => navigate('/student/attendance')}
          className="dashboard-stat-card"
          style={{
            padding: '14px 16px',
            borderRadius: 14,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(139, 92, 246, 0.12)',
            color: '#a78bfa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Clock size={20} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Today's Movement</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'nowrap' }}>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                padding: '2px 6px',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                IN 06:18 PM &gt;
              </span>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                padding: '2px 6px',
                borderRadius: 4
              }}>
                OUT 08:42 AM
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Attendance */}
        <div
          onClick={() => navigate('/student/attendance')}
          className="dashboard-stat-card"
          style={{
            padding: '14px 16px',
            borderRadius: 14,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Calendar size={20} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Attendance</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>92%</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>This month</div>
              </div>
              {/* Mini glowing bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 22, paddingRight: 4 }}>
                <span style={{ width: 4, height: '60%', background: '#10b981', borderRadius: 2 }} />
                <span style={{ width: 4, height: '80%', background: '#10b981', borderRadius: 2 }} />
                <span style={{ width: 4, height: '100%', background: '#10b981', borderRadius: 2 }} />
                <span style={{ width: 4, height: '70%', background: '#10b981', borderRadius: 2 }} />
                <span style={{ width: 4, height: '90%', background: '#10b981', borderRadius: 2 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Fees */}
        <div
          onClick={() => setPayingModal(true)}
          className="dashboard-stat-card"
          style={{
            padding: '14px 16px',
            borderRadius: 14,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <CreditCard size={20} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Pending Fees</div>
            <div style={{
              fontSize: '15px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>₹12,500</span>
              <ChevronRight size={13} style={{ color: 'var(--text-quaternary)' }} />
            </div>
            <div style={{ fontSize: '10.5px', color: '#f59e0b', marginTop: 1, fontWeight: 500 }}>
              Due: 5 Sept 2026
            </div>
          </div>
        </div>

        {/* Card 5: Open Complaints */}
        <div
          onClick={() => navigate('/student/complaints')}
          className="dashboard-stat-card"
          style={{
            padding: '14px 16px',
            borderRadius: 14,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(244, 63, 94, 0.12)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <AlertCircle size={20} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Open Complaints</div>
            <div style={{
              fontSize: '15px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{myComplaints.length || 1}</span>
              <ChevronRight size={13} style={{ color: 'var(--text-quaternary)' }} />
            </div>
            <div style={{ fontSize: '10.5px', color: '#f43f5e', marginTop: 1, fontWeight: 500 }}>
              Requires attention
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MIDDLE ROW (ROOM & ROOMMATE) ===================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 20,
        marginBottom: 20
      }}>
        {/* Left: My Room Card */}
        <div style={{
          padding: '20px 22px',
          borderRadius: 18,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <BedDouble size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  My Room
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Room {currentStudent?.room || 'Unassigned'}
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-tertiary)' }}>
                    Block {assignedRoom?.block || '—'} · Floor {assignedRoom?.floor || '—'} · Bed {currentStudent?.bed || '—'}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/student/room"
              style={{
                fontSize: '12.5px',
                color: 'var(--accent-400)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Room Details <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 16, alignItems: 'stretch' }}>
            {/* Room Image */}
            <div style={{
              borderRadius: 12,
              overflow: 'hidden',
              minHeight: 150,
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              position: 'relative',
            }}>
              <img
                src={currentStudent?.room === 'B-304' ? '/images/room_b304.jpg' : '/images/hostel_night.jpg'}
                alt={currentStudent?.room === 'B-304' ? 'Room B-304' : 'ABC Residency'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* Room Spec Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Type */}
              <div style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <BedDouble size={18} style={{ color: '#818cf8', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>Room Type</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{assignedRoom?.type || 'Room'}</div>
                </div>
              </div>

              {/* Capacity */}
              <div style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Users size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>Capacity</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{assignedRoom?.capacity || 0} Students</div>
                </div>
              </div>

              {/* Occupancy */}
              <div style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Users size={18} style={{ color: '#a78bfa', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>Occupancy</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{assignedRoommates.length} / {assignedRoom?.capacity || 0}</div>
                </div>
              </div>

              {/* Status */}
              <div style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>Room Status</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: assignedRoom?.status === 'maintenance' ? 'var(--warning-600)' : 'var(--success-600)' }}>{assignedRoom?.status || 'Unassigned'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: My Roommate Card */}
        <div style={{
          padding: '20px 22px',
          borderRadius: 18,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} style={{ color: '#818cf8' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  My Roommate
                </h3>
              </div>
              <Link
                to="/student/roommate"
                style={{
                  fontSize: '12.5px',
                  color: 'var(--accent-400)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                View Full Profile <ArrowRight size={13} />
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              {/* Profile details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
                }}>
                  {roommateMatch.match?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || '—'}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {roommateMatch.loading ? 'Finding matches...' : roommateMatch.error ? 'Matches unavailable' : roommateMatch.match?.name || 'No matches available'}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {matchedStudent ? `${matchedStudent.course} · Room ${matchedStudent.room}` : roommateMatch.match?.label || 'Lifestyle recommendation'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    {roommateMatch.match && <><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} /><span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>{roommateMatch.match.label}</span></>}
                  </div>
                </div>
              </div>

              {/* Compatibility Radial Meter */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  border: `4px solid ${roommateMatch.match ? '#10b981' : 'var(--gray-300)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: '0 0 16px rgba(16, 185, 129, 0.3)',
                }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {roommateMatch.match ? `${roommateMatch.match.compatibilityScore}%` : '—'}
                  </span>
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  marginTop: 6,
                  display: 'inline-block'
                }}>
                  {roommateMatch.match?.label || (roommateMatch.error ? 'Unavailable' : 'No match yet')}
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility link button */}
          <button
            type="button"
            onClick={() => navigate('/student/roommate')}
            style={{
              marginTop: 14,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Heart size={14} style={{ color: '#ec4899' }} />
            View Compatibility Details <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ===================== BOTTOM ROW (FEES & ANNOUNCEMENTS) ===================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 20
      }}>
        {/* Left: Fee & Dues Status */}
        <div style={{
          padding: '20px 22px',
          borderRadius: 18,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CreditCard size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Fee & Dues Status
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Central hostel billing</span>
              </div>
            </div>

            <Link
              to="/student/payments"
              style={{
                fontSize: '12.5px',
                color: 'var(--accent-400)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              All Invoices <ArrowRight size={13} />
            </Link>
          </div>

          {/* Inner banner: Next Payment Due */}
          <div style={{
            padding: '14px 18px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.03))',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.04em' }}>
                  NEXT PAYMENT DUE
                </div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
                  ₹12,500
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-tertiary)',
                  padding: '6px 12px',
                  borderRadius: 8,
                }}>
                  <Calendar size={14} style={{ color: '#f59e0b' }} />
                  <span>5 Sept 2026</span>
                </div>

                <button
                  type="button"
                  onClick={() => setPayingModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 18px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: '1px solid #818cf8',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <CreditCard size={15} />
                  Pay Now
                </button>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div style={{ marginTop: 14 }}>
              <div style={{
                height: 6,
                borderRadius: 9999,
                background: 'var(--bg-tertiary)',
                display: 'flex',
                overflow: 'hidden',
                marginBottom: 8,
              }}>
                <div style={{ width: '66.6%', background: '#22c55e', borderRadius: '4px 0 0 4px' }} />
                <div style={{ width: '33.4%', background: '#f59e0b', borderRadius: '0 4px 4px 0' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ color: 'var(--text-tertiary)' }}>Paid:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>₹25,000</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ color: 'var(--text-tertiary)' }}>Pending:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>₹12,500</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Total:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>₹37,500</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Announcements */}
        <div style={{
          padding: '20px 22px',
          borderRadius: 18,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={18} style={{ color: '#f43f5e' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Recent Announcements
              </h3>
            </div>
            <Link
              to="/student/announcements"
              style={{
                fontSize: '12.5px',
                color: 'var(--accent-400)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Notice 1 */}
            <div
              onClick={() => navigate('/student/mess')}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: 8,
                transition: 'all 120ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}>
                <UtensilsCrossed size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Mess Menu Updated
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-quaternary)' }}>2 hours ago</span>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1.35 }}>
                  New menu for this week is now available. Check it out!
                </p>
              </div>
            </div>

            {/* Notice 2 */}
            <div
              onClick={() => navigate('/student/announcements')}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: 8,
                transition: 'all 120ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}>
                <Building size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Block B Water Maintenance
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-quaternary)' }}>1 day ago</span>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1.35 }}>
                  Water supply in Block B will be off tomorrow from 10 AM to 2 PM.
                </p>
              </div>
            </div>

            {/* Notice 3 */}
            <div
              onClick={() => navigate('/student/announcements')}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: 8,
                transition: 'all 120ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}>
                <Calendar size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Cultural Night Registration
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-quaternary)' }}>2 days ago</span>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1.35 }}>
                  Registrations are now open for the Annual Cultural Night 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== PAY NOW MODAL ===================== */}
      {payingModal && (
        <>
          <div className="drawer-overlay" onClick={() => setPayingModal(false)} />
          <div
            className="command-palette"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              width: 480,
              maxWidth: '92vw',
              background: 'var(--bg-secondary)',
              borderRadius: 18,
              border: '1px solid var(--border-primary)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              padding: 0,
              overflow: 'hidden',
            }}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-primary)',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <CreditCard size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Quick Fee Settlement
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                    Invoice #INV-2026-09 · ABC Residency
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn--ghost btn--icon"
                onClick={() => setPayingModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{
                textAlign: 'center',
                padding: '16px',
                borderRadius: 12,
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                marginBottom: 16,
              }}>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Amount Due</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
                  ₹12,500
                </div>
                <div style={{ fontSize: '12px', color: 'var(--accent-400)', fontWeight: 600, marginTop: 2 }}>
                  September 2026 Hostel & Mess Rent
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Select Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
                  {['UPI', 'NetBanking', 'Cards', 'QR Code'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMethod(m)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: 8,
                        fontSize: '11.5px',
                        fontWeight: 600,
                        textAlign: 'center',
                        background: selectedMethod === m ? 'var(--accent-500)' : 'var(--bg-tertiary)',
                        color: selectedMethod === m ? '#ffffff' : 'var(--text-secondary)',
                        border: '1px solid ' + (selectedMethod === m ? 'var(--accent-500)' : 'var(--border-primary)'),
                        cursor: 'pointer',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMethod === 'UPI' && (
                <div style={{
                  padding: '12px',
                  borderRadius: 10,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 16,
                }}>
                  <QrCode size={24} style={{ color: 'var(--accent-400)' }} />
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    UPI ID: <strong>rahul.sharma@okhdfcbank</strong> (Auto-verified)
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handlePayNow}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: '1px solid #22c55e',
                  boxShadow: '0 4px 16px rgba(22, 163, 74, 0.35)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Check size={18} />
                Confirm & Pay ₹12,500
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===================== COMPATIBILITY DETAILS MODAL ===================== */}
      {compatibilityModal && (
        <>
          <div className="drawer-overlay" onClick={() => setCompatibilityModal(false)} />
          <div
            className="command-palette"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              width: 520,
              maxWidth: '92vw',
              background: 'var(--bg-secondary)',
              borderRadius: 18,
              border: '1px solid var(--border-primary)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              padding: 0,
              overflow: 'hidden',
            }}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-primary)',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Heart size={18} style={{ color: '#ec4899' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    AI Roommate Compatibility Analysis
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                    Rahul Sharma + Aman Kumar (Room B-304)
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn--ghost btn--icon"
                onClick={() => setCompatibilityModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Overall Match Rating</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981' }}>94% Highly Compatible</div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: 9999,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontSize: '11px',
                  fontWeight: 700,
                }}>
                  Grade A+ Match
                </div>
              </div>

              {/* Match Factors */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { factor: 'Sleep Schedule (Night Owls)', match: '96%', color: '#818cf8' },
                  { factor: 'Study Habits (Quiet Environment)', match: '92%', color: '#38bdf8' },
                  { factor: 'Cleanliness & Organization', match: '95%', color: '#10b981' },
                  { factor: 'Social Preference (Moderate)', match: '90%', color: '#f59e0b' },
                ].map((f, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.factor}</span>
                      <strong style={{ color: f.color }}>{f.match}</strong>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{ width: f.match, height: '100%', background: f.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn btn--primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setCompatibilityModal(false);
                    navigate('/student/roommate');
                  }}
                >
                  Go to Roommate Profile
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setCompatibilityModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
