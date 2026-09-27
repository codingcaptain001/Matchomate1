import { useState } from 'react';
import { Save, UserRound } from 'lucide-react';

const storageKey = 'matchomate.admin-profile';
const defaultProfile = {
  name: 'Admin User',
  title: 'Hostel Administrator',
  email: 'admin@matchomate.com',
  phone: '+91 98765 43210',
};

function loadProfile() {
  try {
    return { ...defaultProfile, ...JSON.parse(localStorage.getItem(storageKey) || '{}') };
  } catch {
    return defaultProfile;
  }
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(loadProfile);
  const [message, setMessage] = useState('');

  const update = (key, value) => setProfile((previous) => ({ ...previous, [key]: value }));
  const save = (event) => {
    event.preventDefault();
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile));
      window.dispatchEvent(new Event('matchomate:admin-profile-updated'));
      setMessage('Demo profile saved in this browser.');
    } catch {
      setMessage('Unable to save demo profile.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><UserRound size={24} style={{ color: 'var(--accent-500)' }} /><h1 className="page-header__greeting">Admin Profile</h1></div>
        <p className="page-header__subtitle">Manage the local demo administrator profile.</p>
      </div>
      <form className="card" onSubmit={save} style={{ maxWidth: 720 }}>
        <div className="grid-2col" style={{ gap: 'var(--space-4)' }}>
          {[
            ['name', 'Display name', 'text'],
            ['title', 'Role', 'text'],
            ['email', 'Email', 'email'],
            ['phone', 'Phone', 'tel'],
          ].map(([key, label, type]) => (
            <label key={key} className="input-wrapper">
              <span className="input-label">{label}</span>
              <input className="input" type={type} required value={profile[key]} onChange={(event) => update(key, event.target.value)} />
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 'var(--space-5)' }}>
          <p role="status" style={{ fontSize: 'var(--font-sm)', color: 'var(--success-700)' }}>{message}</p>
          <button type="submit" className="btn btn--primary"><Save size={15} /> Save Profile</button>
        </div>
        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-4)' }}>
          This prototype has no admin authentication service; profile changes are stored in this browser only.
        </p>
      </form>
    </div>
  );
}