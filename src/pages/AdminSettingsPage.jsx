import { useState } from 'react';
import { Save, Settings } from 'lucide-react';

const defaults = { curfewWeekday: '22:00', curfewWeekend: '22:30', messRebate: '75', latePassCutoff: '20:00' };
const storageKey = 'matchomate.admin-settings';

function readSettings() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || '{}') };
  } catch {
    return defaults;
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(readSettings);
  const [message, setMessage] = useState('');

  const update = (key, value) => setSettings((previous) => ({ ...previous, [key]: value }));
  const save = (event) => {
    event.preventDefault();
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setMessage('Hostel rules saved in this browser.');
    } catch {
      setMessage('Unable to save hostel rules.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Settings size={24} style={{ color: 'var(--accent-500)' }} /><h1 className="page-header__greeting">Hostel Settings</h1></div>
        <p className="page-header__subtitle">Configure demo curfew, late-pass, and meal-rebate rules.</p>
      </div>
      <form className="card" onSubmit={save} style={{ maxWidth: 720 }}>
        <div className="grid-2col" style={{ gap: 'var(--space-4)' }}>
          <label className="input-wrapper"><span className="input-label">Weekday curfew</span><input className="input" type="time" required value={settings.curfewWeekday} onChange={(event) => update('curfewWeekday', event.target.value)} /></label>
          <label className="input-wrapper"><span className="input-label">Weekend curfew</span><input className="input" type="time" required value={settings.curfewWeekend} onChange={(event) => update('curfewWeekend', event.target.value)} /></label>
          <label className="input-wrapper"><span className="input-label">Late-pass application cutoff</span><input className="input" type="time" required value={settings.latePassCutoff} onChange={(event) => update('latePassCutoff', event.target.value)} /></label>
          <label className="input-wrapper"><span className="input-label">Mess rebate per main meal (₹)</span><input className="input" type="number" min="0" max="10000" required value={settings.messRebate} onChange={(event) => update('messRebate', event.target.value)} /></label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 'var(--space-5)' }}>
          <p role="status" style={{ fontSize: 'var(--font-sm)', color: 'var(--success-700)' }}>{message}</p>
          <button type="submit" className="btn btn--primary"><Save size={15} /> Save Settings</button>
        </div>
      </form>
    </div>
  );
}