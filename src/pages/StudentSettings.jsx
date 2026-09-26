import { useState } from 'react';
import {
  Settings, Bell, Shield, Moon, Smartphone, Lock, Eye,
  CheckCircle2, Volume2, KeyRound, Sparkles, UserCheck
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function StudentSettings() {
  const { currentStudent, showToast } = useHostelStore();

  // Notification Toggles
  const [notifs, setNotifs] = useState({
    gatePassSms: true,
    feeAlerts: true,
    wardenBroadcasts: true,
    messMenuDaily: false,
    nightRollCall: true,
  });

  // Roommate Preferences
  const [roomPrefs, setRoomPrefs] = useState({
    acTemp: '24°C',
    sleepTime: '11:30 PM',
    studyVibe: 'Quiet / Focused',
    guestPolicy: 'Weekend only',
  });

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const toggleNotif = (key) => {
    setNotifs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast('Notification preference saved.');
      return next;
    });
  };

  const handleSavePrefs = (e) => {
    e.preventDefault();
    showToast('Roommate & living preferences updated.');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    showToast('Hostel Portal password changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="student-container" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Preferences & Security
        </span>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
          Account Settings
        </h1>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          Manage your notifications, living preferences, biometric pass, and security credentials.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Card 1: Notification Preferences */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-4)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                SMS & WhatsApp Alerts
              </h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                Connected to {currentStudent?.phone} and parent number {currentStudent?.guardianPhone}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { key: 'gatePassSms', label: 'Gate In/Out Biometric SMS', desc: 'Real-time alert sent to registered guardian phone upon gate turnstile tap.' },
              { key: 'feeAlerts', label: 'Semester Fee Due Reminders', desc: 'Alerts 7 days and 3 days before payment due date to avoid late fine.' },
              { key: 'wardenBroadcasts', label: 'Urgent Warden Broadcasts', desc: 'Campus curfew changes, maintenance water shutdowns, emergency notices.' },
              { key: 'messMenuDaily', label: 'Daily Breakfast & Lunch Menu Push', desc: 'Receive morning notifications with the daily chef special.' },
              { key: 'nightRollCall', label: 'Night Roll-Call Check Reminder', desc: 'Reminder at 09:30 PM if not yet marked inside hostel.' },
            ].map((item) => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {item.desc}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifs[item.key]}
                  onChange={() => toggleNotif(item.key)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--accent-600)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Living & Roommate Matching Preferences */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-4)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Roommate Compatibility Preferences
              </h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                Used by MatchoMate AI matching algorithm for next semester re-allocation
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePrefs} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            <div>
              <label className="ops-label">Target AC Temperature</label>
              <select
                className="ops-select"
                style={{ width: '100%' }}
                value={roomPrefs.acTemp}
                onChange={(e) => setRoomPrefs({ ...roomPrefs, acTemp: e.target.value })}
              >
                <option>22°C (Cool)</option>
                <option>24°C (Optimal)</option>
                <option>26°C (Eco / Warm)</option>
              </select>
            </div>

            <div>
              <label className="ops-label">Lights-Off Sleep Habit</label>
              <select
                className="ops-select"
                style={{ width: '100%' }}
                value={roomPrefs.sleepTime}
                onChange={(e) => setRoomPrefs({ ...roomPrefs, sleepTime: e.target.value })}
              >
                <option>10:30 PM (Early Bird)</option>
                <option>11:30 PM (Moderate)</option>
                <option>01:30 AM (Night Owl)</option>
              </select>
            </div>

            <div>
              <label className="ops-label">Study Atmosphere</label>
              <select
                className="ops-select"
                style={{ width: '100%' }}
                value={roomPrefs.studyVibe}
                onChange={(e) => setRoomPrefs({ ...roomPrefs, studyVibe: e.target.value })}
              >
                <option>Quiet / Focused</option>
                <option>Soft Music / Collaborative</option>
                <option>Flexible</option>
              </select>
            </div>

            <div>
              <label className="ops-label">Room Guest Policy</label>
              <select
                className="ops-select"
                style={{ width: '100%' }}
                value={roomPrefs.guestPolicy}
                onChange={(e) => setRoomPrefs({ ...roomPrefs, guestPolicy: e.target.value })}
              >
                <option>Weekend only</option>
                <option>Strictly No Non-Residents</option>
                <option>Study group friendly</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="submit" className="btn btn--primary" style={{ padding: '8px 18px' }}>
                Save Roommate Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Card 3: Security & Password */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-4)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyRound size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Security & Login Credentials
              </h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                Change your student portal password and view active sessions
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            <div>
              <label className="ops-label">Current Password</label>
              <input
                type="password"
                className="ops-input"
                style={{ width: '100%' }}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="ops-label">New Password</label>
              <input
                type="password"
                className="ops-input"
                style={{ width: '100%' }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, 1 number"
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                Last login: Today from Firefox on Windows 11 (Hostel Wi-Fi)
              </span>
              <button type="submit" className="btn btn--secondary" disabled={!currentPassword || !newPassword}>
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
