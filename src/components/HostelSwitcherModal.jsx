import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Check, MapPin, Wifi, Phone, ShieldCheck,
  ChevronRight, ExternalLink, BedDouble, User
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function HostelSwitcherModal({ isOpen, onClose, isStudent }) {
  const navigate = useNavigate();
  const { currentStudent, showToast } = useHostelStore() || {};

  const [selectedBlock, setSelectedBlock] = useState('Block B');

  const hostels = [
    {
      id: 'abc-b',
      name: 'ABC Residency - Block B',
      tag: 'Current Residence',
      active: true,
      room: 'Room B-304 (Bed A)',
      type: 'Double Sharing Premium',
      warden: 'Dr. R. K. Verma',
      wardenPhone: '+91 98765 43210',
      wifi: 'ABC_Residency_5G (Connected)',
      location: 'South Campus, Academic Zone',
      totalBeds: '180 Beds · 98% Occupied',
    },
    {
      id: 'abc-a',
      name: 'ABC Residency - Block A',
      tag: 'Junior Wing',
      active: false,
      room: 'Room A-102',
      type: 'Triple Sharing Standard',
      warden: 'Prof. S. Nair',
      wardenPhone: '+91 98765 43211',
      wifi: 'ABC_BlockA_HighSpeed',
      location: 'South Campus, West Gate',
      totalBeds: '220 Beds · 94% Occupied',
    },
    {
      id: 'abc-c',
      name: 'ABC Residency - Block C',
      tag: 'Executive Wing',
      active: false,
      room: 'Room C-201',
      type: 'Single Studio Suite',
      warden: 'Dr. Anita Joshi',
      wardenPhone: '+91 98765 43212',
      wifi: 'ABC_Exec_Secure',
      location: 'North Campus Annex',
      totalBeds: '80 Beds · 100% Occupied',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="command-overlay" onClick={onClose} style={{ zIndex: 1000, paddingTop: '10vh' }}>
      <div
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 580,
          maxWidth: '92vw',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
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
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-500), #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <Building2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Hostel & Residence Switcher
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                Manage student allocation and view residence specs
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={onClose}
            style={{ color: 'var(--text-tertiary)' }}
          >
            ✕
          </button>
        </div>

        {/* Current Active Badge */}
        <div style={{ padding: '14px 20px', background: 'rgba(99, 102, 241, 0.08)', borderBottom: '1px solid var(--border-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-500)' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Active Residence: ABC Residency — Block B (Room B-304)
              </span>
            </div>
            <span className="badge badge--success" style={{ fontSize: '10px' }}>Current Assigned</span>
          </div>
        </div>

        {/* Hostel Options List */}
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
          {hostels.map((h) => {
            const isSelected = selectedBlock === h.name.split(' - ')[1] || (h.active && selectedBlock === 'Block B');
            return (
              <div
                key={h.id}
                onClick={() => {
                  setSelectedBlock(h.name.split(' - ')[1]);
                  showToast(`Selected ${h.name}`);
                }}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: isSelected ? '1px solid var(--accent-500)' : '1px solid var(--border-primary)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{h.name}</span>
                    <span className={`badge ${isSelected ? 'badge--accent' : 'badge--default'}`} style={{ fontSize: '10px' }}>
                      {h.tag}
                    </span>
                  </div>
                  {isSelected && (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--accent-500)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Check size={14} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BedDouble size={13} style={{ color: 'var(--accent-400)' }} />
                    <span>{h.room} ({h.type})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} style={{ color: 'var(--text-quaternary)' }} />
                    <span>{h.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={13} style={{ color: 'var(--text-quaternary)' }} />
                    <span>Warden: {h.warden}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Wifi size={13} style={{ color: 'var(--success-500)' }} />
                    <span>{h.wifi}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-primary)',
          background: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => {
              onClose();
              navigate(isStudent ? '/student/room' : '/admin/rooms');
            }}
          >
            <BedDouble size={14} />
            View Full Room Specs
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => {
              onClose();
              showToast(`Residence preferences updated to ${selectedBlock}`);
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
