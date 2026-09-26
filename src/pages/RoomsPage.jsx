import { useState } from 'react';
import { Search, Filter, X, Users, BedDouble, Shield, AlertTriangle, Wrench } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

const blocks = ['All', 'A', 'B', 'C', 'D'];
const statuses = ['All', 'available', 'full', 'maintenance'];
const statusConfig = {
  available: { label: 'Available', class: 'badge--success' },
  full: { label: 'Full', class: 'badge--default' },
  maintenance: { label: 'Maintenance', class: 'badge--warning' },
};

export default function RoomsPage() {
  const { rooms, students } = useHostelStore();
  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || null;

  const filtered = rooms.filter((r) => {
    if (search && !r.number.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedBlock !== 'All' && r.block !== selectedBlock) return false;
    if (selectedStatus !== 'All' && r.status !== selectedStatus) return false;
    return true;
  });

  const roomStudents = selectedRoom
    ? students.filter((s) => s.room === selectedRoom.number)
    : [];

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">Rooms & Beds</h1>
        <p className="page-header__subtitle">
          Manage room allocations, view occupancy, and track compatibility.
        </p>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        marginBottom: 'var(--space-6)', flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px', background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
          flex: '1', maxWidth: 280,
        }}>
          <Search size={15} style={{ color: 'var(--text-quaternary)', flexShrink: 0 }} />
          <input
            className="input"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', padding: 0, background: 'transparent', flex: 1 }}
          />
        </div>

        {/* Block filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {blocks.map((b) => (
            <button
              key={b}
              className={`btn btn--sm ${selectedBlock === b ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => setSelectedBlock(b)}
            >
              {b === 'All' ? 'All Blocks' : `Block ${b}`}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {statuses.map((s) => (
            <button
              key={s}
              className={`btn btn--sm ${selectedStatus === s ? 'btn--secondary' : 'btn--ghost'}`}
              style={selectedStatus === s ? { borderColor: 'var(--gray-300)' } : {}}
              onClick={() => setSelectedStatus(s)}
            >
              {s === 'All' ? 'All Status' : statusConfig[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 'var(--space-4)',
      }} className="animate-stagger">
        {filtered.map((room) => (
          <div
            key={room.id}
            className="card card--interactive"
            onClick={() => setSelectedRoomId(room.id)}
            style={{
              padding: 'var(--space-5)',
              cursor: 'pointer',
              borderColor: selectedRoom?.id === room.id ? 'var(--accent-400)' : undefined,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  {room.number}
                </h3>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)' }}>
                  Block {room.block} · Floor {room.floor} · {room.type}
                </span>
              </div>
              <span className={`badge ${statusConfig[room.status]?.class || 'badge--default'}`}>
                {statusConfig[room.status]?.label || room.status}
              </span>
            </div>

            {/* Occupancy bar */}
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Occupancy</span>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {room.occupied} / {room.capacity}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{
                    width: `${(room.occupied / room.capacity) * 100}%`,
                    background: room.occupied === room.capacity
                      ? 'var(--gray-400)'
                      : room.status === 'maintenance'
                        ? 'var(--warning-500)'
                        : 'var(--accent-500)',
                  }}
                />
              </div>
            </div>

            {/* Compatibility */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: '20px' }}>
              {room.compatibility > 0 ? (
                <>
                  <Shield size={13} style={{ color: room.compatibility >= 70 ? 'var(--success-500)' : 'var(--danger-500)' }} />
                  <span style={{
                    fontSize: 'var(--font-sm)', fontWeight: 600,
                    color: room.compatibility >= 70 ? 'var(--success-600)' : 'var(--danger-600)',
                  }}>
                    {room.compatibility}%
                  </span>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)' }}>compatibility</span>
                </>
              ) : (
                <>
                  <Shield size={13} style={{ color: 'var(--gray-300)' }} />
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--gray-400)' }}>N/A</span>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)' }}>compatibility</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Room Detail Drawer */}
      {selectedRoom && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedRoomId(null)} />
          <div className="drawer">
            <div className="drawer__header">
              <h2 className="drawer__title">Room {selectedRoom.number}</h2>
              <button onClick={() => setSelectedRoomId(null)} className="btn btn--ghost btn--icon">
                <X size={18} />
              </button>
            </div>
            <div className="drawer__body">
              {/* Room info */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  {[
                    { label: 'Block', value: selectedRoom.block },
                    { label: 'Floor', value: selectedRoom.floor },
                    { label: 'Type', value: selectedRoom.type },
                    { label: 'Capacity', value: selectedRoom.capacity },
                    { label: 'Occupied', value: selectedRoom.occupied },
                    { label: 'Status', value: statusConfig[selectedRoom.status]?.label },
                  ].map((item) => (
                    <div key={item.label} style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 'var(--font-base)', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility */}
              {selectedRoom.compatibility > 0 && (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <h4 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Compatibility</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{
                      fontSize: 'var(--font-2xl)', fontWeight: 800,
                      color: selectedRoom.compatibility >= 70 ? 'var(--success-600)' : 'var(--danger-600)',
                    }}>
                      {selectedRoom.compatibility}%
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {selectedRoom.compatibility >= 85 ? 'Excellent Match' : selectedRoom.compatibility >= 70 ? 'Good Match' : 'At Risk'}
                      </div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                        Based on lifestyle compatibility analysis
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Students */}
              <div>
                <h4 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                  Students ({roomStudents.length})
                </h4>
                {roomStudents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {roomStudents.map((student) => (
                      <div key={student.id} style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        <div className="avatar avatar--md" style={{ background: 'linear-gradient(135deg, var(--accent-400), #a78bfa)', color: 'white' }}>
                          {student.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{student.course} · Bed {student.bed}</div>
                        </div>
                        <span className={`badge ${student.status === 'active' ? 'badge--success' : 'badge--warning'}`}>
                          {student.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: 'var(--space-8)',
                    textAlign: 'center',
                    color: 'var(--text-quaternary)',
                    fontSize: 'var(--font-sm)',
                  }}>
                    <BedDouble size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                    <p>No students assigned to this room.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
