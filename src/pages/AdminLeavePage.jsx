import { useMemo, useState } from 'react';
import { CalendarOff } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { DetailDrawer, EmptyState, FilterSelect, LoadingTable, MetaGrid, SearchFilterBar, StudentChip, SummaryCards, formatDate } from '../components/ops/OpsShared';

const statusClass = {
  pending: 'badge--warning',
  approved: 'badge--success',
  rejected: 'badge--danger',
  completed: 'badge--default',
};

export default function AdminLeavePage() {
  const { hydrating, leaveRequests, studentById, reviewLeave } = useHostelStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [remarks, setRemarks] = useState('');

  const filtered = useMemo(() => leaveRequests.filter((l) => {
    if (status !== 'all' && l.status !== status) return false;
    const student = studentById(l.studentId);
    if (!search) return true;
    const q = search.toLowerCase();
    return l.id.toLowerCase().includes(q) || l.reason.toLowerCase().includes(q) || student?.name.toLowerCase().includes(q) || l.destination.toLowerCase().includes(q);
  }), [leaveRequests, status, search, studentById]);

  const selected = leaveRequests.find((l) => l.id === selectedId);

  if (hydrating) {
    return (
      <div className="page-content">
        <div className="page-header"><h1 className="page-header__greeting">Leave Requests</h1></div>
        <LoadingTable />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">Leave Requests</h1>
        <p className="page-header__subtitle">Out-pass approvals. Approving an active leave marks the student on-leave and updates today’s attendance.</p>
      </div>

      <SummaryCards items={[
        { label: 'Pending', value: leaveRequests.filter((l) => l.status === 'pending').length, color: 'var(--warning-600)' },
        { label: 'Approved', value: leaveRequests.filter((l) => l.status === 'approved').length, color: 'var(--success-600)' },
        { label: 'Rejected', value: leaveRequests.filter((l) => l.status === 'rejected').length, color: 'var(--danger-600)' },
        { label: 'Students on leave', value: [...new Set(leaveRequests.filter((l) => l.status === 'approved').map((l) => l.studentId))].length },
      ]} />

      <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
        <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search student, city, or reason..." countLabel={`${filtered.length} requests`}>
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'completed', label: 'Returned' },
            ]}
          />
        </SearchFilterBar>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7"><EmptyState icon={CalendarOff} title="No leave requests match." /></td>
                </tr>
              ) : filtered.map((l) => (
                <tr key={l.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedId(l.id); setRemarks(l.remarks || ''); }}>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)', fontWeight: 600 }}>{l.id}</td>
                  <td><StudentChip student={studentById(l.studentId)} /></td>
                  <td>{l.type}</td>
                  <td>{formatDate(l.from)} – {formatDate(l.to)} ({l.days}d)</td>
                  <td>{l.destination}</td>
                  <td><span className={`badge ${statusClass[l.status]}`}>{l.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {l.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" className="btn btn--primary btn--sm" onClick={() => reviewLeave(l.id, 'approved')}>Approve</button>
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => reviewLeave(l.id, 'rejected', 'Rejected from list')}>Reject</button>
                      </div>
                    )}
                    {l.status === 'approved' && (
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => reviewLeave(l.id, 'completed')}>Mark return</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <DetailDrawer
          title={selected.id}
          onClose={() => setSelectedId(null)}
          footer={selected.status === 'pending' ? (
            <>
              <button type="button" className="btn btn--primary" onClick={() => reviewLeave(selected.id, 'approved', remarks)}>Approve</button>
              <button type="button" className="btn btn--ghost" onClick={() => reviewLeave(selected.id, 'rejected', remarks || 'Rejected by warden')}>Reject</button>
            </>
          ) : selected.status === 'approved' ? (
            <button type="button" className="btn btn--secondary" onClick={() => reviewLeave(selected.id, 'completed')}>Student returned</button>
          ) : null}
        >
          <StudentChip student={studentById(selected.studentId)} />
          <div style={{ height: 16 }} />
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 16 }}>{selected.reason}</p>
          <MetaGrid items={[
            { label: 'Type', value: selected.type },
            { label: 'Destination', value: selected.destination },
            { label: 'From', value: formatDate(selected.from) },
            { label: 'To', value: formatDate(selected.to) },
            { label: 'Applied', value: formatDate(selected.appliedOn) },
            { label: 'Emergency', value: selected.emergencyContact },
            { label: 'Reviewed by', value: selected.reviewedBy },
            { label: 'Student status', value: studentById(selected.studentId)?.status },
          ]} />
          <label style={{ display: 'block', fontSize: 'var(--font-sm)' }}>
            Warden remarks
            <textarea
              className="ops-select"
              style={{ display: 'block', width: '100%', marginTop: 6, minHeight: 72, padding: 8 }}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </label>
        </DetailDrawer>
      )}
    </div>
  );
}
