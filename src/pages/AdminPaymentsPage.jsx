import { useMemo, useState } from 'react';
import { CreditCard, Banknote } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { DetailDrawer, EmptyState, FilterSelect, LoadingTable, MetaGrid, SearchFilterBar, StudentChip, SummaryCards, formatDate, inr } from '../components/ops/OpsShared';

const statusClass = {
  paid: 'badge--success',
  pending: 'badge--warning',
  overdue: 'badge--danger',
};

export default function AdminPaymentsPage() {
  const { hydrating, payments, students, studentById, markPaymentPaid, sendPaymentReminder } = useHostelStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [method, setMethod] = useState('UPI');

  const filtered = useMemo(() => payments.filter((p) => {
    if (status !== 'all' && p.status !== status) return false;
    const student = studentById(p.studentId);
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      student?.name.toLowerCase().includes(q) ||
      student?.id.toLowerCase().includes(q)
    );
  }), [payments, status, search, studentById]);

  const collected = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingAmt = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const overdueAmt = payments.filter((p) => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  const selected = payments.find((p) => p.id === selectedId);

  if (hydrating) {
    return (
      <div className="page-content">
        <div className="page-header"><h1 className="page-header__greeting">Payments</h1></div>
        <LoadingTable />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">Payments</h1>
        <p className="page-header__subtitle">Hostel fee and mess collections for ABC Residency. Status is shared with student records.</p>
      </div>

      <SummaryCards items={[
        { label: 'Collected', value: inr(collected), color: 'var(--success-600)', hint: `${payments.filter((p) => p.status === 'paid').length} receipts` },
        { label: 'Pending', value: inr(pendingAmt), color: 'var(--warning-600)' },
        { label: 'Overdue', value: inr(overdueAmt), color: 'var(--danger-600)' },
        { label: 'Defaulters', value: students.filter((s) => s.payment !== 'paid').length, color: 'var(--text-primary)' },
      ]} />

      <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
        <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search student, receipt, or type..." countLabel={`${filtered.length} invoices`}>
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' },
              { value: 'overdue', label: 'Overdue' },
            ]}
          />
        </SearchFilterBar>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Student</th>
                <th>Type</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState icon={Banknote} title="No invoices match your filters." />
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const student = studentById(p.studentId);
                return (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(p.id)}>
                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)', fontWeight: 600 }}>{p.id}</td>
                    <td><StudentChip student={student} /></td>
                    <td>{p.type}</td>
                    <td>{p.month}</td>
                    <td style={{ fontWeight: 600 }}>{inr(p.amount)}</td>
                    <td>{formatDate(p.dueDate)}</td>
                    <td><span className={`badge ${statusClass[p.status]}`}>{p.status}</span></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {p.status !== 'paid' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button type="button" className="btn btn--primary btn--sm" onClick={() => markPaymentPaid(p.id, 'UPI')}>Collect</button>
                          <button type="button" className="btn btn--ghost btn--sm" onClick={() => sendPaymentReminder(p.id)}>Remind</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{p.receipt}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <DetailDrawer
          title={selected.id}
          onClose={() => setSelectedId(null)}
          footer={selected.status !== 'paid' ? (
            <>
              <select className="ops-select" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option>UPI</option>
                <option>Cash</option>
                <option>Net Banking</option>
                <option>Card</option>
              </select>
              <button type="button" className="btn btn--primary" onClick={() => markPaymentPaid(selected.id, method)}>
                <CreditCard size={14} /> Record payment
              </button>
              <button type="button" className="btn btn--secondary" onClick={() => sendPaymentReminder(selected.id)}>Send reminder</button>
            </>
          ) : (
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>Receipt {selected.receipt} issued.</span>
          )}
        >
          <StudentChip student={studentById(selected.studentId)} />
          <div style={{ height: 16 }} />
          <MetaGrid items={[
            { label: 'Type', value: selected.type },
            { label: 'Period', value: selected.month },
            { label: 'Amount', value: inr(selected.amount) },
            { label: 'Due date', value: formatDate(selected.dueDate) },
            { label: 'Paid on', value: formatDate(selected.paidOn) },
            { label: 'Method', value: selected.method },
            { label: 'Txn ID', value: selected.txnId },
            { label: 'Student ledger', value: studentById(selected.studentId)?.payment },
          ]} />
        </DetailDrawer>
      )}
    </div>
  );
}
