import { useMemo, useState } from 'react';
import { ClipboardCheck, UserX } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { DetailDrawer, EmptyState, FilterSelect, LoadingTable, MetaGrid, SearchFilterBar, StudentChip, SummaryCards } from '../components/ops/OpsShared';

const statusClass = {
  present: 'badge--success',
  late: 'badge--warning',
  absent: 'badge--danger',
  leave: 'badge--accent',
  unmarked: 'badge--default',
};

export default function AdminAttendancePage() {
  const { hydrating, students, attendance, today, markAttendance, markAllUnmarkedPresent } = useHostelStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const rows = useMemo(() => students.map((s) => {
    const rec = attendance.find((a) => a.studentId === s.id && a.date === today);
    return {
      student: s,
      record: rec || { studentId: s.id, date: today, status: 'unmarked', checkIn: null, method: null, gate: null },
    };
  }), [students, attendance, today]);

  const filtered = rows.filter(({ student, record }) => {
    if (status !== 'all' && record.status !== status) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return student.name.toLowerCase().includes(q) || student.id.toLowerCase().includes(q) || student.room.toLowerCase().includes(q);
  });

  const counts = {
    present: rows.filter((r) => r.record.status === 'present').length,
    late: rows.filter((r) => r.record.status === 'late').length,
    absent: rows.filter((r) => r.record.status === 'absent').length,
    leave: rows.filter((r) => r.record.status === 'leave').length,
    unmarked: rows.filter((r) => r.record.status === 'unmarked').length,
  };

  const selected = rows.find((r) => r.student.id === selectedId);

  if (hydrating) {
    return (
      <div className="page-content">
        <div className="page-header"><h1 className="page-header__greeting">Attendance</h1></div>
        <LoadingTable />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-header__greeting">Attendance</h1>
            <p className="page-header__subtitle">Night roll-call and gate check-ins for ABC Residency · {today}</p>
          </div>
          <button className="btn btn--primary" type="button" onClick={markAllUnmarkedPresent}>
            <ClipboardCheck size={15} />
            Mark unmarked present
          </button>
        </div>
      </div>

      <SummaryCards items={[
        { label: 'Present', value: counts.present, color: 'var(--success-600)' },
        { label: 'Late', value: counts.late, color: 'var(--warning-600)' },
        { label: 'Absent', value: counts.absent, color: 'var(--danger-600)' },
        { label: 'On leave', value: counts.leave, color: 'var(--accent-600)' },
        { label: 'Unmarked', value: counts.unmarked, color: 'var(--text-tertiary)' },
      ]} />

      <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
        <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search name, ID, or room..." countLabel={`${filtered.length} students`}>
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'present', label: 'Present' },
              { value: 'late', label: 'Late' },
              { value: 'absent', label: 'Absent' },
              { value: 'leave', label: 'Leave' },
              { value: 'unmarked', label: 'Unmarked' },
            ]}
          />
        </SearchFilterBar>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Room</th>
                <th>Overall %</th>
                <th>Check-in</th>
                <th>Method</th>
                <th>Today</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <EmptyState icon={UserX} title="No attendance rows match your filters." description="Try another status or clear search." />
                  </td>
                </tr>
              ) : filtered.map(({ student, record }) => (
                <tr key={student.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(student.id)}>
                  <td><StudentChip student={student} /></td>
                  <td style={{ fontWeight: 500 }}>{student.room}</td>
                  <td style={{ fontWeight: 600, color: student.attendance >= 85 ? 'var(--success-600)' : student.attendance >= 75 ? 'var(--warning-600)' : 'var(--danger-600)' }}>
                    {student.attendance}%
                  </td>
                  <td>{record.checkIn || '—'}</td>
                  <td style={{ color: 'var(--text-tertiary)' }}>{record.method || '—'}</td>
                  <td><span className={`badge ${statusClass[record.status]}`}>{record.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="btn btn--ghost btn--sm" title="Mark Present" onClick={() => markAttendance(student.id, 'present')}>P</button>
                      <button type="button" className="btn btn--ghost btn--sm" title="Mark Late" onClick={() => markAttendance(student.id, 'late')}>L</button>
                      <button type="button" className="btn btn--ghost btn--sm" title="Mark Absent" onClick={() => markAttendance(student.id, 'absent')}>A</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <DetailDrawer
          title="Attendance detail"
          onClose={() => setSelectedId(null)}
          footer={(
            <>
              <button type="button" className="btn btn--primary" onClick={() => markAttendance(selected.student.id, 'present')}>Mark present</button>
              <button type="button" className="btn btn--secondary" onClick={() => markAttendance(selected.student.id, 'late')}>Mark late</button>
              <button type="button" className="btn btn--ghost" onClick={() => markAttendance(selected.student.id, 'absent')}>Mark absent</button>
              <button type="button" className="btn btn--ghost" onClick={() => markAttendance(selected.student.id, 'leave')}>Mark leave pass</button>
            </>
          )}
        >
          <StudentChip student={selected.student} />
          <div style={{ height: 16 }} />
          <MetaGrid items={[
            { label: 'Hostel status', value: selected.student.status },
            { label: 'Payment', value: selected.student.payment },
            { label: 'Today', value: selected.record.status },
            { label: 'Check-in', value: selected.record.checkIn || '—' },
            { label: 'Method', value: selected.record.method || '—' },
            { label: 'Gate', value: selected.record.gate || '—' },
            { label: 'Phone', value: selected.student.phone },
            { label: 'Guardian', value: `${selected.student.guardian} · ${selected.student.guardianPhone}` },
          ]} />
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
            Overall attendance is shared with the Students list and dashboard profile. Changing today’s mark updates the same student record.
          </p>
        </DetailDrawer>
      )}
    </div>
  );
}
