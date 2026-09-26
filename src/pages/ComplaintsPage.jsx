import { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, Circle, Sparkles } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { DetailDrawer, EmptyState, FilterSelect, LoadingTable, MetaGrid, SearchFilterBar, StudentChip, SummaryCards } from '../components/ops/OpsShared';

const priorityConfig = {
  critical: { label: 'Critical', class: 'badge--danger' },
  high: { label: 'High', class: 'badge--warning' },
  medium: { label: 'Medium', class: 'badge--default' },
  low: { label: 'Low', class: 'badge--accent' },
};

const statusConfig = {
  open: { label: 'Open', class: 'badge--warning', icon: Circle },
  'in-progress': { label: 'In Progress', class: 'badge--accent', icon: Clock },
  resolved: { label: 'Resolved', class: 'badge--success', icon: CheckCircle },
};

const assignees = ['Maintenance Team A', 'Electrician B', 'IT Support', 'Housekeeping', 'Admin', 'Warden Mehta'];

export default function ComplaintsPage() {
  const { hydrating, complaints, complaintStats, studentById, updateComplaint } = useHostelStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = complaints.filter((c) => {
    if (status !== 'all' && c.status !== status) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.id.toLowerCase().includes(q) || c.student.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.room.toLowerCase().includes(q);
  });

  const selected = complaints.find((c) => c.id === selectedId);

  if (hydrating) {
    return (
      <div className="page-content">
        <div className="page-header"><h1 className="page-header__greeting">Complaints</h1></div>
        <LoadingTable />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">Complaints</h1>
        <p className="page-header__subtitle">Track, assign, and close tickets. Counts stay in sync with the dashboard and maintenance jobs.</p>
      </div>

      <SummaryCards items={[
        { label: 'Open', value: complaintStats.open, color: 'var(--warning-600)' },
        { label: 'In Progress', value: complaintStats.inProgress, color: 'var(--accent-600)' },
        { label: 'Critical', value: complaintStats.critical, color: 'var(--danger-600)' },
        { label: 'Resolved', value: complaintStats.resolved, color: 'var(--success-600)' },
        { label: 'Active queue', value: complaintStats.open + complaintStats.inProgress },
      ]} />

      <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
        <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search complaints..." countLabel={`${filtered.length} tickets`}>
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'open', label: 'Open' },
              { value: 'in-progress', label: 'In progress' },
              { value: 'resolved', label: 'Resolved' },
            ]}
          />
        </SearchFilterBar>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Room</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <EmptyState icon={AlertTriangle} title="No complaints found matching your search." />
                  </td>
                </tr>
              ) : filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelectedId(c.id)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)', fontWeight: 600 }}>{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.student}</td>
                  <td>{c.room}</td>
                  <td><span className="badge badge--default">{c.category}</span></td>
                  <td><span className={`badge ${priorityConfig[c.priority]?.class}`}>{priorityConfig[c.priority]?.label}</span></td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>{c.assignedTo}</td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>{c.created}</td>
                  <td><span className={`badge ${statusConfig[c.status]?.class}`}>{statusConfig[c.status]?.label}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {c.status === 'open' && (
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => updateComplaint(c.id, { status: 'in-progress' })}>Start</button>
                    )}
                    {c.status === 'in-progress' && (
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => updateComplaint(c.id, { status: 'resolved' })}>Resolve</button>
                    )}
                    {c.status === 'resolved' && (
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--success-600)', fontWeight: 500 }}>Closed</span>
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
          footer={selected.status !== 'resolved' ? (
            <>
              {selected.status === 'open' && (
                <button type="button" className="btn btn--secondary" onClick={() => updateComplaint(selected.id, { status: 'in-progress' })}>Start work</button>
              )}
              <button type="button" className="btn btn--primary" onClick={() => updateComplaint(selected.id, { status: 'resolved' })}>Mark resolved</button>
            </>
          ) : (
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>Ticket closed.</span>
          )}
        >
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className={`badge ${priorityConfig[selected.priority]?.class}`}>{priorityConfig[selected.priority]?.label}</span>
            <span className={`badge ${statusConfig[selected.status]?.class}`}>{statusConfig[selected.status]?.label}</span>
            <span className="badge badge--default">{selected.category}</span>
          </div>
          <StudentChip student={studentById(selected.studentId)} />
          <div style={{ height: 16 }} />
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
            {selected.description}
          </p>
          <MetaGrid items={[
            { label: 'Student', value: selected.student },
            { label: 'Room', value: selected.room },
            { label: 'Created', value: selected.created },
            { label: 'Assigned to', value: selected.assignedTo },
          ]} />
          <label style={{ display: 'block', fontSize: 'var(--font-sm)', marginBottom: 16 }}>
            Reassign
            <select
              className="ops-select"
              style={{ display: 'block', width: '100%', marginTop: 6 }}
              value={selected.assignedTo}
              onChange={(e) => updateComplaint(selected.id, { assignedTo: e.target.value })}
            >
              {assignees.map((a) => <option key={a}>{a}</option>)}
            </select>
          </label>
          <div style={{
            padding: 16,
            background: 'var(--accent-50)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--accent-500)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Sparkles size={14} style={{ color: 'var(--accent-600)' }} />
              <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-700)' }}>AI Categorization</span>
            </div>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--accent-800)', lineHeight: 1.5 }}>
              Related to {selected.category.toLowerCase()} infrastructure. Linked maintenance jobs update when this ticket is resolved.
            </p>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
}
