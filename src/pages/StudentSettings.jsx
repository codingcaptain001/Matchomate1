import { useState } from 'react';
import { Bell, KeyRound, Sparkles } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

const defaultNotifications = {
  gatePassSms: true,
  feeAlerts: true,
  wardenBroadcasts: true,
  messMenuDaily: false,
  nightRollCall: true,
};

const defaultRoomPreferences = {
  acTemp: '24°C (Optimal)',
  sleepTime: '11:30 PM (Moderate)',
  studyVibe: 'Quiet / Focused',
  guestPolicy: 'Weekend only',
};

function loadSettings(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

export default function StudentSettings() {
  const { currentStudent, showToast } = useHostelStore();
  const storageKey = `matchomate.student-settings.${currentStudent?.id || 'demo'}`;
  const [saved] = useState(() => loadSettings(storageKey));
  const [notifs, setNotifs] = useState(() => ({ ...defaultNotifications, ...saved.notifications }));
  const [roomPrefs, setRoomPrefs] = useState(() => ({ ...defaultRoomPreferences, ...saved.roomPreferences }));

  const persist = (notifications, roomPreferences) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ notifications, roomPreferences }));
      return true;
    } catch {
      return false;
    }
  };

  const toggleNotif = (key) => {
    const next = { ...notifs, [key]: !notifs[key] };
    setNotifs(next);
    showToast(persist(next, roomPrefs)
      ? 'Notification preference saved on this device.'
      : 'Unable to save notification preference.');
  };

  const handleSavePrefs = (event) => {
    event.preventDefault();
    showToast(persist(notifs, roomPrefs)
      ? 'Roommate & living preferences saved on this device.'
      : 'Unable to save roommate preferences.');
  };

  const updateRoomPreference = (key, value) => {
    setRoomPrefs((previous) => ({ ...previous, [key]: value }));
  };

  return (
    <div className="student-container" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Preferences & Security
        </span>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>Account Settings</h1>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          Manage notification and room preferences for this demo account.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-4)' }}>
            <Bell size={20} style={{ color: 'var(--accent-600)' }} />
            <div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>SMS & WhatsApp Alerts</h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                Connected to {currentStudent?.phone} and parent number {currentStudent?.guardianPhone}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { key: 'gatePassSms', label: 'Gate In/Out Biometric SMS', desc: 'Real-time alerts for gate activity.' },
              { key: 'feeAlerts', label: 'Semester Fee Due Reminders', desc: 'Reminders before payment due dates.' },
              { key: 'wardenBroadcasts', label: 'Urgent Warden Broadcasts', desc: 'Maintenance and emergency notices.' },
              { key: 'messMenuDaily', label: 'Daily Breakfast & Lunch Menu Push', desc: 'Daily menu notifications.' },
              { key: 'nightRollCall', label: 'Night Roll-Call Check Reminder', desc: 'Reminder if not marked inside.' },
            ].map((item) => (
              <label key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>{item.label}</span>
                  <span style={{ display: 'block', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{item.desc}</span>
                </span>
                <input type="checkbox" checked={notifs[item.key]} onChange={() => toggleNotif(item.key)} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--accent-600)' }} />
              </label>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-4)' }}>
            <Sparkles size={20} style={{ color: 'var(--success-600)' }} />
            <div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Roommate Compatibility Preferences</h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                Saved in this browser. Matching suggestions currently use the demo lifestyle profiles.
              </p>
            </div>
          </div>
          <form onSubmit={handleSavePrefs} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            <div>
              <label className="ops-label">Target AC Temperature</label>
              <select className="ops-select" style={{ width: '100%' }} value={roomPrefs.acTemp} onChange={(event) => updateRoomPreference('acTemp', event.target.value)}>
                <option>22°C (Cool)</option><option>24°C (Optimal)</option><option>26°C (Eco / Warm)</option>
              </select>
            </div>
            <div>
              <label className="ops-label">Lights-Off Sleep Habit</label>
              <select className="ops-select" style={{ width: '100%' }} value={roomPrefs.sleepTime} onChange={(event) => updateRoomPreference('sleepTime', event.target.value)}>
                <option>10:30 PM (Early Bird)</option><option>11:30 PM (Moderate)</option><option>01:30 AM (Night Owl)</option>
              </select>
            </div>
            <div>
              <label className="ops-label">Study Atmosphere</label>
              <select className="ops-select" style={{ width: '100%' }} value={roomPrefs.studyVibe} onChange={(event) => updateRoomPreference('studyVibe', event.target.value)}>
                <option>Quiet / Focused</option><option>Soft Music / Collaborative</option><option>Flexible</option>
              </select>
            </div>
            <div>
              <label className="ops-label">Room Guest Policy</label>
              <select className="ops-select" style={{ width: '100%' }} value={roomPrefs.guestPolicy} onChange={(event) => updateRoomPreference('guestPolicy', event.target.value)}>
                <option>Weekend only</option><option>Strictly No Non-Residents</option><option>Study group friendly</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="submit" className="btn btn--primary" style={{ padding: '8px 18px' }}>Save Roommate Preferences</button>
            </div>
          </form>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <KeyRound size={20} style={{ color: 'var(--danger-600)' }} />
            <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Password & Account Security</h2>
          </div>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            Password changes are unavailable because this prototype uses demo login and has no authentication service.
          </p>
        </div>
      </div>
    </div>
  );
}