import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, User, ArrowRight, Zap, Sparkles, CheckCircle2,
  Lock, Mail, Eye, EyeOff, Building2, UtensilsCrossed,
  CreditCard, UserCheck, ShieldCheck, ChevronRight
} from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState('student'); // Default to student or admin
  const [email, setEmail] = useState('student@matchomate.com');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin@matchomate.com');
      setPassword('admin123');
    } else {
      setEmail('student@matchomate.com');
      setPassword('student123');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }, 450);
  };

  const quickLoginAs = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin@matchomate.com');
      setPassword('admin123');
    } else {
      setEmail('student@matchomate.com');
      setPassword('student123');
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(selectedRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'radial-gradient(120% 120% at 50% 0%, #0f172a 0%, #090d16 100%)',
      color: '#f8fafc',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    }}>
      {/* Dynamic Animated Ambient Background Glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '15%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        borderRadius: '50%',
      }} />

      {/* Top Navigation Bar */}
      <header style={{
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #6366f1, #4338ca)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              MatchoMate
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
              AI Student Housing & Operations OS
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(10px)',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '12px',
          color: '#cbd5e1'
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
          <span>Biometric Gate Sync: <strong>Connected</strong></span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        position: 'relative',
        zIndex: 10,
        flex: 1,
      }}>
        <div style={{
          maxWidth: '1060px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'center',
        }}>
          {/* Left Column: Value Proposition Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              padding: '6px 14px',
              borderRadius: '20px',
              width: 'fit-content',
              fontSize: '12px',
              fontWeight: 600,
              color: '#a5b4fc',
            }}>
              <Sparkles size={14} /> Next-Gen Smart Hostel OS
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: 0,
            }}>
              Intelligent Housing. <br />
              <span style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Seamless Operations.
              </span>
            </h1>

            <p style={{
              fontSize: '15px',
              color: '#94a3b8',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '440px',
            }}>
              MatchoMate unifies AI roommate compatibility, live gate attendance tracking, UPI fee settlements, and automated warden workflows in one single platform.
            </p>

            {/* Feature Pills Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
              {[
                { icon: UserCheck, title: 'Live In/Out Gate Pass', desc: 'Real-time roll-call' },
                { icon: Sparkles, title: '94% AI Matching', desc: 'Lifestyle alignment' },
                { icon: CreditCard, title: 'UPI Fee Portal', desc: 'Instant receipts' },
                { icon: UtensilsCrossed, title: 'Mess Menu & Rebate', desc: '₹75/meal skip credit' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#818cf8',
                      flexShrink: 0
                    }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* One-Click Fast Demo Logins */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                ⚡ One-Click Instant Demo Portals
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => quickLoginAs('student')}
                  style={{
                    flex: '1 1 180px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: '#f8fafc',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.22)';
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#000' }}>
                      RS
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700 }}>Rahul Sharma</div>
                      <div style={{ fontSize: '10px', color: '#6ee7b7' }}>Student (Room B-304)</div>
                    </div>
                  </div>
                  <ChevronRight size={14} color="#6ee7b7" />
                </button>

                <button
                  type="button"
                  onClick={() => quickLoginAs('admin')}
                  style={{
                    flex: '1 1 180px',
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: '#f8fafc',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.22)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                      WM
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700 }}>Dr. Mehta</div>
                      <div style={{ fontSize: '10px', color: '#a5b4fc' }}>Chief Hostel Warden</div>
                    </div>
                  </div>
                  <ChevronRight size={14} color="#a5b4fc" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Glassmorphism Form Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            padding: '36px 32px',
            position: 'relative',
          }}>
            {/* Header with Role Segmented Switcher */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Account Authentication
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                Sign in to your portal
              </h2>

              {/* Segmented Role Selector */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px',
                borderRadius: '12px',
                marginTop: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: role === 'student' ? '#10b981' : 'transparent',
                    color: role === 'student' ? '#0f172a' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: role === 'student' ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none'
                  }}
                >
                  <User size={15} /> Student Resident
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: role === 'admin' ? '#6366f1' : 'transparent',
                    color: role === 'admin' ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: role === 'admin' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
                  }}
                >
                  <Shield size={15} /> Admin / Warden
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  {role === 'admin' ? 'Warden Email Address' : 'Student Roll / Email'}
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={role === 'admin' ? 'admin@matchomate.com' : 'student@matchomate.com'}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '11px 14px 11px 38px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = role === 'student' ? '#10b981' : '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
                    Portal Password
                  </label>
                  <span style={{ fontSize: '11px', color: '#818cf8', cursor: 'pointer' }}>
                    Forgot key?
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '11px 40px 11px 38px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = role === 'student' ? '#10b981' : '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: role === 'student'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: role === 'student' ? '#064e3b' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: role === 'student'
                    ? '0 4px 14px rgba(16, 185, 129, 0.4)'
                    : '0 4px 14px rgba(99, 102, 241, 0.4)',
                  transition: 'transform 0.15s, opacity 0.15s',
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter {role === 'student' ? 'Student Workspace' : 'Admin Operations'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: '11px',
                color: '#64748b',
                marginTop: '4px'
              }}>
                <ShieldCheck size={13} color="#10b981" />
                <span>256-bit SSL Biometric Encrypted Session</span>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer style={{
        padding: '16px 32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: '12px',
        color: '#64748b',
        position: 'relative',
        zIndex: 10,
      }}>
        <div>© 2026 MatchoMate Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <span style={{ cursor: 'pointer', color: '#94a3b8' }}>Campus Security Hotline: +91 98111 22233</span>
          <span style={{ cursor: 'pointer', color: '#94a3b8' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer', color: '#94a3b8' }}>Hostel Regulations</span>
        </div>
      </footer>
    </div>
  );
}
