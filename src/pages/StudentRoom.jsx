import { useState } from 'react';
import { BedDouble, CheckCircle, Wifi, Wind, ShieldCheck, Wrench, AlertTriangle, ArrowRightLeft, Users, Building, Sparkles } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function StudentRoom() {
  const { currentStudent, students, rooms, showToast, addComplaint } = useHostelStore();
  const [reportModal, setReportModal] = useState(false);
  const [changeModal, setChangeModal] = useState(false);
  const [issueDesc, setIssueDesc] = useState('');
  const [issueCat, setIssueCat] = useState('Electrical');
  const [changeReason, setChangeReason] = useState('');

  const currentRoom = rooms.find((room) => room.number === currentStudent?.room);
  const roomCapacity = currentRoom?.capacity || 0;
  const bedLabels = Array.from({ length: roomCapacity }, (_, index) => String.fromCharCode(65 + index));
  const roomOccupants = students
    .filter((student) => student.room === currentStudent?.room)
    .sort((a, b) => Number(b.id === currentStudent?.id) - Number(a.id === currentStudent?.id));
  const usedBeds = new Set();
  const roommates = roomOccupants.slice(0, roomCapacity).map((student) => {
    const preferredBed = student.bed && bedLabels.includes(student.bed) && !usedBeds.has(student.bed)
      ? student.bed
      : bedLabels.find((bed) => !usedBeds.has(bed));
    if (preferredBed) usedBeds.add(preferredBed);
    return {
      bed: preferredBed,
      name: student.id === currentStudent?.id ? `${student.name} (You)` : student.name,
      status: 'Occupied',
      course: `${student.course} · Year ${student.year}`,
    };
  });
  const occupiedCount = Math.min(roomCapacity, Math.max(roommates.length, currentRoom?.occupied || 0));
  const unknownOccupants = Math.max(0, occupiedCount - roommates.length);
  for (let index = 0; index < unknownOccupants; index += 1) {
    const bed = bedLabels.find((label) => !usedBeds.has(label));
    if (!bed) break;
    usedBeds.add(bed);
    roommates.push({ bed, name: 'Occupied bed', status: 'Occupied', course: 'Resident details unavailable' });
  }
  bedLabels.forEach((bed) => {
    if (!usedBeds.has(bed)) roommates.push({ bed, name: 'Available', status: 'Available', course: 'Open for allocation' });
  });

  const amenities = [
    { icon: Wind, name: 'Split Air Conditioner', detail: 'Carrier 1.5 Ton · Serviced 10 Sep' },
    { icon: Wifi, name: 'High-speed Wi-Fi', detail: '200 Mbps Fiber · AP Block B' },
    { icon: Building, name: 'Attached Balcony', detail: 'Garden view · Clothes drying rack' },
    { icon: ShieldCheck, name: 'Biometric Access', detail: 'Digital Smart Lock & RFID' },
  ];

  const handleSubmitIssue = (e) => {
    e.preventDefault();
    if (!issueDesc.trim()) return;
    addComplaint({ category: issueCat, description: `[Room ${currentStudent?.room || 'unassigned'}] ${issueDesc}`, priority: 'medium' });
    setIssueDesc('');
    setReportModal(false);
  };

  const handleRequestChange = (e) => {
    e.preventDefault();
    if (!changeReason.trim()) return;
    const requestId = addComplaint({
      category: 'Other',
      priority: 'medium',
      description: `Room-change request from ${currentStudent?.room || 'unassigned'}: ${changeReason.trim()}`,
    });
    showToast(`Room-change request ${requestId} submitted to the Warden.`);
    setChangeReason('');
    setChangeModal(false);
  };

  return (
    <div className="student-container" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Hostel Living
        </span>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
          My Room: {currentStudent?.room || 'Unassigned'}
        </h1>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          Block {currentRoom?.block || '—'} · Floor {currentRoom?.floor || '—'} · {currentRoom?.type || 'Room'} ({roomCapacity}-Bed) · Bed {currentStudent?.bed || '—'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Room Overview Card */}
        <div className="card" style={{ padding: 'var(--space-5)', background: 'linear-gradient(135deg, var(--bg-secondary), var(--accent-50))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-700)', fontWeight: 600 }}>HOSTEL RESIDENCY STATUS</div>
              <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                Room {currentStudent?.room || 'Unassigned'}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <span className="badge badge--success">Assigned & Active</span>
                <span className="badge badge--default">{currentRoom?.type || 'Room'} ({roomCapacity}-Bed)</span>
                <span className="badge badge--accent">Balcony Attached</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => setReportModal(true)}>
                <Wrench size={14} /> Report Issue
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setChangeModal(true)}>
                <ArrowRightLeft size={14} /> Change Room
              </button>
            </div>
          </div>
        </div>

        {/* Bed Allocation Grid */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BedDouble size={18} style={{ color: 'var(--accent-600)' }} />
            Bed Allocations in Room {currentStudent?.room || 'Unassigned'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
            {roommates.map((rm) => (
              <div
                key={rm.bed}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: rm.name.includes('(You)') ? 'var(--accent-50)' : 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: rm.name.includes('(You)') ? '1.5px solid var(--accent-400)' : '1px solid var(--border-primary)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: rm.name.includes('(You)') ? 'var(--accent-700)' : 'var(--text-secondary)' }}>
                    BED {rm.bed}
                  </span>
                  <span className={`badge ${rm.name.includes('(You)') ? 'badge--success' : rm.status === 'Available' ? 'badge--default' : 'badge--accent'}`} style={{ fontSize: '10px' }}>
                    {rm.name.includes('(You)') ? 'Your Bed' : rm.status}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {rm.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {rm.course}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Amenities */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Room Facilities & Hardware
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
            {amenities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} style={{ display: 'flex', gap: 10, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent-50)', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 2 }}>{item.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room Rules & Inspection */}
        <div className="card" style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)' }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
            Hostel Room Inspection Guidelines
          </div>
          <ul style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 16, listStyle: 'disc' }}>
            <li>Night roll-call verification takes place at 10:15 PM daily.</li>
            <li>Electric kettles, heaters, and induction stoves require warden pre-authorization.</li>
            <li>Keep study desks clear during Saturday morning deep housekeeping cycles.</li>
          </ul>
        </div>
      </div>

      {/* Report Issue Modal */}
      {reportModal && (
        <>
          <div className="drawer-overlay" onClick={() => setReportModal(false)} />
          <div className="drawer" style={{ width: 440 }}>
            <div className="drawer__header">
              <h2 className="drawer__title">Report Room Problem</h2>
              <button type="button" className="btn btn--ghost btn--icon" onClick={() => setReportModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitIssue} className="drawer__body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>
                  Category
                </label>
                <select className="ops-select" style={{ width: '100%' }} value={issueCat} onChange={(e) => setIssueCat(e.target.value)}>
                  <option>Electrical</option>
                  <option>Water</option>
                  <option>Internet</option>
                  <option>Cleaning</option>
                  <option>Carpentry</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>
                  Description of Issue in Room {currentStudent?.room || 'Unassigned'}
                </label>
                <textarea
                  className="ops-select"
                  style={{ width: '100%', minHeight: 90, padding: 8 }}
                  placeholder="E.g. Study table lamp socket sparking or fan making noise..."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>Submit to Warden</button>
                <button type="button" className="btn btn--ghost" onClick={() => setReportModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Change Room Modal */}
      {changeModal && (
        <>
          <div className="drawer-overlay" onClick={() => setChangeModal(false)} />
          <div className="drawer" style={{ width: 440 }}>
            <div className="drawer__header">
              <h2 className="drawer__title">Request Room Change</h2>
              <button type="button" className="btn btn--ghost btn--icon" onClick={() => setChangeModal(false)}>✕</button>
            </div>
            <form onSubmit={handleRequestChange} className="drawer__body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                Room change requests are reviewed by Chief Warden Mehta every Tuesday based on available vacant beds in Blocks A, B, and D.
              </p>
              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>
                  Reason for Room Change
                </label>
                <textarea
                  className="ops-select"
                  style={{ width: '100%', minHeight: 90, padding: 8 }}
                  placeholder="Explain why you would like to move rooms (e.g. study timing conflict, floor preference)..."
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>Send Application</button>
                <button type="button" className="btn btn--ghost" onClick={() => setChangeModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
