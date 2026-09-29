import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, User, ArrowRight, Zap, Sparkles, CheckCircle2,
  Lock, Mail, Eye, EyeOff, Building2, UtensilsCrossed,
  CreditCard, UserCheck, ShieldCheck, ChevronRight, Fingerprint,
  Sun, Moon, KeyRound, Check, RefreshCw, Radio, Sparkle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [email, setEmail] = useState('student@matchomate.com');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [authError, setAuthError] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Feature carousel data
  const featureHighlights = [
    {
      icon: Sparkles,
      title: 'AI Roommate Matching',
      badge: '94% Match Accuracy',
      desc: 'Smart lifestyle compatibility based on sleep schedules, cleanliness, study habits, and personal preferences.',
      color: '#818cf8',
      bg: 'rgba(99, 102, 241, 0.12)',
    },
    {
      icon: UserCheck,
      title: 'Biometric Gate Attendance',
      badge: 'Instant Live Sync',
      desc: 'Automatic gate in/out logs with real-time warden alerts, out-pass validation, and digital parental approvals.',
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.12)',
    },
    {
      icon: CreditCard,
      title: 'Instant UPI Fee Settlement',
      badge: 'Zero Transaction Fee',
      desc: 'Centralized hostel dues ledger, QR payments, automated fee receipts, and installment reminders.',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
    },
    {
      icon: UtensilsCrossed,
      title: 'Smart Mess & Meal Rebate',
      badge: '₹75/Meal Credit',
      desc: 'Live dining menus, automated meal skip rebates, hygiene audits, and feedback directly to the head chef.',
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.12)',
    },
  ];

  // Auto cycle features every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeatureTab((prev) => (prev + 1) % featureHighlights.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setAuthError('');
    if (selectedRole === 'admin') {
      setEmail('admin@matchomate.com');
      setPassword('admin123');
    } else {
      setEmail('student@matchomate.com');
      setPassword('student123');
    }
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    const credentials = role === 'admin'
      ? { email: 'admin@matchomate.com', password: 'admin123' }
      : { email: 'student@matchomate.com', password: 'student123' };
    if (email.trim().toLowerCase() !== credentials.email || password !== credentials.password) {
      setAuthError('Email or password does not match this demo account.');
      return;
    }
    setAuthError('');
    setIsLoading(true);
    setLoadingText('Connecting to ABC Residency Gate Network...');
    
    setTimeout(() => {
      setLoadingText('Verifying credential tokens...');
    }, 250);

    setTimeout(() => {
      setIsLoading(false);
      navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }, 600);
  };

  const handleBiometricScan = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setIsLoading(true);
      setLoadingText('Biometric Fingerprint Verified! Logging in...');
      setTimeout(() => {
        setIsLoading(false);
        navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      }, 500);
    }, 900);
  };

  const handleQuickLogin = (selectedRole, customEmail, customPass) => {
    setRole(selectedRole);
    setEmail(customEmail);
    setPassword(customPass);
    setAuthError('');
    setIsLoading(true);
    setLoadingText(`Logging in as ${selectedRole === 'student' ? 'Student' : 'Admin'}...`);
    setTimeout(() => {
      setIsLoading(false);
      navigate(selectedRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }, 450);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotModalOpen(false);
    }, 1800);
  };

  return (
    <div className="login-page" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: theme === 'dark'
        ? 'radial-gradient(120% 120% at 50% 0%, #0c1222 0%, #070a12 100%)'
        : 'radial-gradient(120% 120% at 50% 0%, #f1f5f9 0%, #e2e8f0 100%)',
      color: 'var(--text-primary)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 250ms ease',
    }}>
      {/* Dynamic Animated Ambient Background Glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '20%',
        width: '650px',
        height: '650px',
        background: role === 'student'
          ? 'radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, rgba(34, 197, 94, 0) 70%)'
          : 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(99, 102, 241, 0) 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        borderRadius: '50%',
        transition: 'background 500ms ease',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '15%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        borderRadius: '50%',
      }} />

      {/* Top Header Bar */}
      <header className="login-header" style={{
        padding: '18px 36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(99, 102, 241, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}>
            <Zap size={24} color="#ffffff" fill="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
              MatchoMate
            </div>
            <div className="login-brand-tagline" style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              AI Student Housing & Operations OS
            </div>
          </div>
        </div>

        {/* Right header actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Live Gate Status Pill */}
          <div className="login-gate-status" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-secondary)',
            backdropFilter: 'blur(10px)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border-primary)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span>Gate Network: <strong style={{ color: 'var(--text-primary)' }}>ABC Residency Live</strong></span>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              color: theme === 'dark' ? '#fbbf24' : '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="login-main" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 24px',
        position: 'relative',
        zIndex: 10,
        flex: 1,
      }}>
        <div className="login-layout" style={{
          maxWidth: '1120px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.15fr 1fr',
          gap: '40px',
          alignItems: 'center',
        }}>
          {/* Left Column: Interactive Value Proposition & Live Demo Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: role === 'student' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(99, 102, 241, 0.12)',
              border: role === 'student' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
              padding: '6px 14px',
              borderRadius: '20px',
              width: 'fit-content',
              fontSize: '12px',
              fontWeight: 700,
              color: role === 'student' ? '#22c55e' : 'var(--text-accent)',
              transition: 'all 300ms ease',
            }}>
              <Sparkles size={14} /> Next-Generation Campus Living
            </div>

            <h1 style={{
              fontSize: 'clamp(30px, 3.8vw, 44px)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Smart Housing. <br />
              <span style={{
                color: role === 'student' ? '#059669' : '#6366f1',
                transition: 'color 300ms ease',
              }}>
                Instant Peace of Mind.
              </span>
            </h1>

            <p style={{
              fontSize: '14.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '480px',
            }}>
              MatchoMate unifies AI roommate compatibility, biometric roll-call attendance, UPI fee invoices, and hostel food services into a single fluid workspace.
            </p>

            {/* Interactive Feature Tabs */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div className="login-feature-tabs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
                {featureHighlights.map((f, i) => {
                  const Icon = f.icon;
                  const isActive = activeFeatureTab === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveFeatureTab(i)}
                      style={{
                        padding: '8px 6px',
                        borderRadius: 8,
                        background: isActive ? f.bg : 'transparent',
                        border: isActive ? `1px solid ${f.color}40` : '1px solid transparent',
                        color: isActive ? f.color : 'var(--text-tertiary)',
                        fontSize: '11px',
                        fontWeight: isActive ? 700 : 500,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <Icon size={16} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {f.title.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active feature content card */}
              <div style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: featureHighlights[activeFeatureTab].bg,
                  color: featureHighlights[activeFeatureTab].color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  {(() => {
                    const Icon = featureHighlights[activeFeatureTab].icon;
                    return <Icon size={18} />;
                  })()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {featureHighlights[activeFeatureTab].title}
                    </span>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: featureHighlights[activeFeatureTab].color,
                      background: featureHighlights[activeFeatureTab].bg,
                      padding: '1px 6px',
                      borderRadius: 4,
                    }}>
                      {featureHighlights[activeFeatureTab].badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: 3, lineHeight: 1.4 }}>
                    {featureHighlights[activeFeatureTab].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Fast Login Portal Cards */}
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-quaternary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span>⚡ Instant One-Click Demo Access</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Student Demo Button */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student', 'student@matchomate.com', 'student123')}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 180ms ease',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#22c55e';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      RS
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Rahul Sharma
                      </div>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 500 }}>
                        Student (Room B-304)
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: '#10b981' }} />
                </button>

                {/* Admin Demo Button */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'admin@matchomate.com', 'admin123')}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 180ms ease',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-400)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      WM
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Dr. Mehta
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--accent-400)', fontWeight: 500 }}>
                        Chief Hostel Warden
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--accent-400)' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Glassmorphism Form Card */}
          <div style={{
            background: 'var(--bg-secondary)',
            backdropFilter: 'blur(24px)',
            borderRadius: '24px',
            border: '1px solid var(--border-primary)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-secondary)',
            padding: '36px 32px',
            position: 'relative',
          }}>
            {/* Header with Segmented Role Selector */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-quaternary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Account Authentication
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Sign in to your portal
              </h2>

              {/* Segmented Role Selector Pill Tabs */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'var(--bg-tertiary)',
                padding: '4px',
                borderRadius: '12px',
                marginTop: '16px',
                border: '1px solid var(--border-primary)'
              }}>
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  style={{
                    padding: '9px 14px',
                    borderRadius: '8px',
                    background: role === 'student' ? '#10b981' : 'transparent',
                    color: role === 'student' ? '#ffffff' : 'var(--text-secondary)',
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
                    padding: '9px 14px',
                    borderRadius: '8px',
                    background: role === 'admin' ? 'var(--accent-500)' : 'transparent',
                    color: role === 'admin' ? '#ffffff' : 'var(--text-secondary)',
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
              {/* Email / Roll input */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {role === 'admin' ? 'Warden Email Address' : 'Student Roll / Email'}
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-quaternary)' }}>
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
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '10px',
                      padding: '11px 14px 11px 38px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = role === 'student' ? '#10b981' : 'var(--accent-400)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-primary)'}
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Portal Password
                  </label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" onClick={() => setShowDemoCredentials((visible) => !visible)} style={{ fontSize: '11px', color: 'var(--accent-400)', cursor: 'pointer', background: 'none', border: 0, padding: 0 }}>
                      Demo credentials
                    </button>
                    <button type="button" onClick={() => setForgotModalOpen(true)} style={{ fontSize: '11.5px', color: 'var(--accent-400)', cursor: 'pointer', fontWeight: 600, background: 'none', border: 0, padding: 0 }}>
                      Forgot password?
                    </button>
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-quaternary)' }}>
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
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '10px',
                      padding: '11px 40px 11px 38px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = role === 'student' ? '#10b981' : 'var(--accent-400)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-primary)'}
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
                      color: 'var(--text-quaternary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me option */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: 15, height: 15, accentColor: role === 'student' ? '#10b981' : '#6366f1', cursor: 'pointer' }}
                />
                <label htmlFor="remember-me" style={{ fontSize: '12px', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                  Remember my session on this device
                </label>
              </div>

              {showDemoCredentials && <p role="status" style={{ margin: 0, fontSize: 12, color: 'var(--text-tertiary)' }}>
                {role === 'admin' ? 'admin@matchomate.com / admin123' : 'student@matchomate.com / student123'}
              </p>}
              {authError && <p role="alert" style={{ margin: 0, fontSize: 12, color: 'var(--danger-500)' }}>{authError}</p>}

              {/* Submit Main Button */}
              <button
                type="submit"
                disabled={isLoading || biometricScanning}
                style={{
                  marginTop: '4px',
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: role === 'student'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: '#ffffff',
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
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {isLoading ? (
                  <span>{loadingText || 'Authenticating...'}</span>
                ) : (
                  <>
                    <span>Enter {role === 'student' ? 'Student Workspace' : 'Admin Operations'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Biometric Touch Simulator Button */}
              <button
                type="button"
                onClick={handleBiometricScan}
                disabled={isLoading || biometricScanning}
                style={{
                  padding: '10px',
                  borderRadius: 10,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)',
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
                  e.currentTarget.style.borderColor = role === 'student' ? '#10b981' : '#6366f1';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Fingerprint size={16} style={{ color: biometricScanning ? '#22c55e' : 'var(--accent-400)', animation: biometricScanning ? 'pulse 1s infinite' : 'none' }} />
                <span>{biometricScanning ? 'Scanning Fingerprint Sensor...' : '⚡ Tap for Instant Biometric Login'}</span>
              </button>

              {/* SSL Security Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                marginTop: '2px'
              }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>256-bit SSL Biometric Encrypted Session</span>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setForgotModalOpen(false)} />
          <div
            className="command-palette"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              width: 420,
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <KeyRound size={18} style={{ color: 'var(--accent-400)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Reset Portal Password
                </h3>
              </div>
              <button
                type="button"
                className="btn btn--ghost btn--icon"
                onClick={() => setForgotModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 20 }}>
              {forgotSent ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Reset Link Dispatched!
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: 4 }}>
                    Check your university inbox for login recovery instructions.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: 14 }}>
                    Enter your registered student roll number or warden email address to receive an instant OTP link.
                  </p>
                  <input
                    type="email"
                    required
                    placeholder="name@matchomate.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '13.5px',
                      marginBottom: 16,
                      outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="submit"
                      className="btn btn--primary"
                      style={{ flex: 1 }}
                    >
                      Send Recovery Link
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => setForgotModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer Bar */}
      <footer className="login-footer" style={{
        padding: '16px 36px',
        borderTop: '1px solid var(--border-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: '12px',
        color: 'var(--text-quaternary)',
        position: 'relative',
        zIndex: 10,
      }}>
        <div>© 2026 MatchoMate Inc. Enterprise Hostel Operating System.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-tertiary)' }}>Campus Security Hotline: +91 98111 22233</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-tertiary)' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-tertiary)' }}>Hostel Regulations</span>
        </div>
      </footer>
    </div>
  );
}
