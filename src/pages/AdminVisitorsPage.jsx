import { useMemo, useState } from 'react';
import { UserCheck } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { DetailDrawer, EmptyState, FilterSelect, LoadingTable, MetaGrid, SearchFilterBar, StudentChip, SummaryCards } from '../components/ops/OpsShared';

const statusClass = {
  'pending-approval': 'badge--warning',
  expected: 'badge--accent',
  'checked-in': 'badge--success',
  'checked-out': 'badge--default',
  denied: 'badge--danger',
};

export default function AdminVisitorsPage() {
  const { hydrating, visitors, studentById, updateVisitor } = useHostelStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => visitors.filter((v) => {
    if (status !== 'all' && v.status !== status) return false;
    const host = studentById(v.studentId);
    if (!search) return true;
    const q = search.toLowerCase();
    return v.visitorName.toLowerCase().includes(q) || v.id.toLowerCase().includes(q) || host?.name.toLowerCase().includes(q) || v.purpose.toLowerCase().includes(q);
  }), [visitors, status, search, studentById]);

  const selected = visitors.find((v) => v.id === selectedId);

  if (hydrating) {
    return (
      <div className="page-content">
        <div className="page-header"><h1 className="page-header__greeting">Visitors</h1></div>
        <LoadingTable />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">Visitors</h1>
        <p className="page-header__subtitle">Gate log for ABC Residency. Approvals are linked to the host student’s room.</p>
      </div>

      <SummaryCards items={[
        { label: 'Pending approval', value: visitors.filter((v) => v.status === 'pending-approval').length, color: 'var(--warning-600)' },
        { label: 'Expected', value: visitors.filter((v) => v.status === 'expected').length, color: 'var(--accent-600)' },
        { label: 'Inside campus', value: visitors.filter((v) => v.status === 'checked-in').length, color: 'var(--success-600)' },
        { label: 'Checked out', value: visitors.filter((v) => v.status === 'checked-out').length },
      ]} />

      <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
        <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search visitor, host, or purpose..." countLabel={`${filtered.length} visitors`}>
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'pending-approval', label: 'Pending' },
              { value: 'expected', label: 'Expected' },
              { value: 'checked-in', label: 'Checked in' },
              { value: 'checked-out', label: 'Checked out' },
              { value: 'denied', label: 'Denied' },
            ]}
          />
        </SearchFilterBar>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Host</th>
                <th>Relation</th>
                <th>Purpose</th>
                <th>Expected</th>
                <th>In / Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8"><EmptyState icon={UserCheck} title="No visitors match your filters." /></td>
                </tr>
              ) : filtered.map((v) => (
                <tr key={v.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(v.id)}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{v.visitorName}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{v.id}</div>
                  </td>
                  <td><StudentChip student={studentById(v.studentId)} /></td>
                  <td>{v.relation}</td>
                  <td style={{ maxWidth: 220 }}>{v.purpose}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{v.expectedAt.replace('2026-', '')}</td>
                  <td>{v.inTime || '—'} / {v.outTime || '—'}</td>
                  <td><span className={`badge ${statusClass[v.status]}`}>{v.status.replace('-', ' ')}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {v.status === 'pending-approval' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" className="btn btn--primary btn--sm" onClick={() => updateVisitor(v.id, 'approve')}>Approve</button>
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => updateVisitor(v.id, 'deny')}>Deny</button>
                      </div>
                    )}
                    {v.status === 'expected' && (
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => updateVisitor(v.id, 'check-in')}>Check In</button>
                    )}
                    {v.status === 'checked-in' && (
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => updateVisitor(v.id, 'check-out')}>Check Out</button>
                    )}
                    {(v.status === 'checked-out' || v.status === 'denied') && (
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Logged</span>
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
          title={selected.visitorName}
          onClose={() => setSelectedId(null)}
          footer={(
            <>
              {selected.status === 'pending-approval' && (
                <>
                  <button type="button" className="btn btn--primary" onClick={() => updateVisitor(selected.id, 'approve')}>Approve entry</button>
                  <button type="button" className="btn btn--ghost" onClick={() => updateVisitor(selected.id, 'deny')}>Deny</button>
                </>
              )}
              {selected.status === 'expected' && (
                <button type="button" className="btn btn--primary" onClick={() => updateVisitor(selected.id, 'check-in')}>Check in at gate</button>
              )}
              {selected.status === 'checked-in' && (
                <button type="button" className="btn btn--primary" onClick={() => updateVisitor(selected.id, 'check-out')}>Check out</button>
              )}
            </>
          )}
        >
          <StudentChip student={studentById(selected.studentId)} />
          <div style={{ height: 16 }} />
          <MetaGrid items={[
            { label: 'Relation', value: selected.relation },
            { label: 'Phone', value: selected.phone },
            { label: 'Vehicle', value: selected.vehicle },
            { label: 'ID proof', value: selected.idProof },
            { label: 'Expected', value: selected.expectedAt },
            { label: 'In time', value: selected.inTime },
            { label: 'Out time', value: selected.outTime },
            { label: 'Status', value: selected.status },
          ]} />
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{selected.purpose}</p>
        </DetailDrawer>
      )}
    </div>
  );
}
