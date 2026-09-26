import { useMemo, useState } from 'react';
import { Wrench } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { DetailDrawer, EmptyState, FilterSelect, LoadingTable, MetaGrid, SearchFilterBar, SummaryCards } from '../components/ops/OpsShared';

const priorityClass = {
  critical: 'badge--danger',
  high: 'badge--warning',
  medium: 'badge--default',
  low: 'badge--accent',
};

const statusClass = {
  open: 'badge--warning',
  'in-progress': 'badge--accent',
  overdue: 'badge--danger',
  completed: 'badge--success',
};

const vendors = ['Ramesh Plumbing Co.', 'Electrician B', 'IT Support', 'Housekeeping', 'PowerCare Services', 'Maintenance Team A', 'Carpenter Singh'];

export default function AdminMaintenancePage() {
  const { hydrating, maintenance, rooms, updateMaintenance } = useHostelStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => maintenance.filter((m) => {
    if (status !== 'all' && m.status !== status) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return m.title.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.room.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
  }), [maintenance, status, search]);

  const selected = maintenance.find((m) => m.id === selectedId);
  const linkedRoom = selected ? rooms.find((r) => r.number === selected.room) : null;

  if (hydrating) {
    return (
      <div className="page-content">
        <div className="page-header"><h1 className="page-header__greeting">Maintenance</h1></div>
        <LoadingTable />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">Maintenance</h1>
        <p className="page-header__subtitle">Facility jobs tied to rooms and student complaints. Completing a job can close the linked complaint.</p>
      </div>

      <SummaryCards items={[
        { label: 'Open', value: maintenance.filter((m) => m.status === 'open').length, color: 'var(--warning-600)' },
        { label: 'In progress', value: maintenance.filter((m) => m.status === 'in-progress').length, color: 'var(--accent-600)' },
        { label: 'Overdue', value: maintenance.filter((m) => m.status === 'overdue').length, color: 'var(--danger-600)' },
        { label: 'Completed', value: maintenance.filter((m) => m.status === 'completed').length, color: 'var(--success-600)' },
        { label: 'Rooms offline', value: rooms.filter((r) => r.status === 'maintenance').length },
      ]} />

      <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
        <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search job, room, or category..." countLabel={`${filtered.length} jobs`}>
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'open', label: 'Open' },
              { value: 'in-progress', label: 'In progress' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        </SearchFilterBar>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Job</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Vendor</th>
                <th>Due</th>
                <th>Linked</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9"><EmptyState icon={Wrench} title="No maintenance jobs match." /></td>
                </tr>
              ) : filtered.map((m) => (
                <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(m.id)}>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)', fontWeight: 600 }}>{m.id}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{m.title}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{m.category}</div>
                  </td>
                  <td>{m.room}</td>
                  <td><span className={`badge ${priorityClass[m.priority]}`}>{m.priority}</span></td>
                  <td style={{ color: 'var(--text-tertiary)' }}>{m.assignedTo}</td>
                  <td>{m.due}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)' }}>{m.linkedComplaintId || '—'}</td>
                  <td><span className={`badge ${statusClass[m.status]}`}>{m.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {m.status !== 'completed' ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        {m.status !== 'in-progress' && (
                          <button type="button" className="btn btn--secondary btn--sm" onClick={() => updateMaintenance(m.id, { status: 'in-progress' })}>Start</button>
                        )}
                        <button type="button" className="btn btn--primary btn--sm" onClick={() => updateMaintenance(m.id, { status: 'completed' })}>Done</button>
                      </div>
                    ) : (
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
          footer={selected.status !== 'completed' ? (
            <>
              <button type="button" className="btn btn--secondary" onClick={() => updateMaintenance(selected.id, { status: 'in-progress' })}>Start work</button>
              <button type="button" className="btn btn--primary" onClick={() => updateMaintenance(selected.id, { status: 'completed' })}>Mark completed</button>
            </>
          ) : (
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>Job closed.</span>
          )}
        >
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, marginBottom: 8 }}>{selected.title}</h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 16 }}>{selected.notes}</p>
          <MetaGrid items={[
            { label: 'Location', value: `${selected.room} · Block ${selected.block}` },
            { label: 'Room status', value: linkedRoom?.status || 'common area' },
            { label: 'Priority', value: selected.priority },
            { label: 'Status', value: selected.status },
            { label: 'Raised', value: selected.raisedOn },
            { label: 'Due', value: selected.due },
            { label: 'Complaint', value: selected.linkedComplaintId || 'Standalone' },
            { label: 'Vendor', value: selected.assignedTo },
          ]} />
          {selected.status !== 'completed' && (
            <label style={{ display: 'block', fontSize: 'var(--font-sm)' }}>
              Reassign vendor
              <select
                className="ops-select"
                style={{ display: 'block', width: '100%', marginTop: 6 }}
                value={selected.assignedTo}
                onChange={(e) => updateMaintenance(selected.id, { assignedTo: e.target.value })}
              >
                {vendors.map((v) => <option key={v}>{v}</option>)}
              </select>
            </label>
          )}
        </DetailDrawer>
      )}
    </div>
  );
}
