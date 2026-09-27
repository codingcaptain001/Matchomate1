import { useState } from 'react';
import {
  CreditCard, CheckCircle2, Clock, AlertTriangle, FileText,
  Download, QrCode, ArrowRight, ShieldCheck, Receipt
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { inr, formatDate } from '../components/ops/OpsShared';

function downloadReceipt(payment) {
  const lines = [
    'MATCHOMATE HOSTEL PAYMENT RECEIPT',
    `Receipt: ${payment.receipt || payment.id}`,
    `Student: ${payment.studentId}`,
    `Payment for: ${payment.type} (${payment.month})`,
    `Payment date: ${payment.paidOn ? formatDate(payment.paidOn) : 'Not recorded'}`,
    `Method: ${payment.method || 'Not recorded'}`,
    `Transaction: ${payment.txnId || 'Not recorded'}`,
    `Amount paid: ${inr(payment.amount)}`,
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `matchomate-receipt-${payment.receipt || payment.id}.txt`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function StudentPayments() {
  const {
    currentStudent,
    payments,
    markPaymentPaid,
    showToast,
  } = useHostelStore();

  const [payModal, setPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [method, setMethod] = useState('UPI');
  const [receiptModal, setReceiptModal] = useState(null);

  // Student specific invoices
  const myInvoices = payments.filter((p) => p.studentId === currentStudent?.id);
  const pendingInvoice = myInvoices.find((p) => p.status === 'pending' || p.status === 'overdue');
  const paidInvoices = myInvoices.filter((p) => p.status === 'paid');

  const handlePay = () => {
    if (selectedInvoice) {
      markPaymentPaid(selectedInvoice.id, method);
      setPayModal(false);
      setSelectedInvoice(null);
    }
  };

  const openPayFor = (inv) => {
    setSelectedInvoice(inv);
    setPayModal(true);
  };

  return (
    <div className="student-container" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Financial Portal
        </span>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
          Hostel Fees & Payments
        </h1>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          View dues, download official receipts, and pay online. Synced live with university accounts.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Next Payment Due Hero Card */}
        <div className="card" style={{
          padding: 'var(--space-6)',
          background: pendingInvoice
            ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(254, 243, 199, 0.95))'
            : 'linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(240, 253, 244, 0.95))',
          border: pendingInvoice ? '1.5px solid rgba(217, 119, 6, 0.3)' : '1.5px solid rgba(22, 163, 74, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className={`badge ${pendingInvoice ? 'badge--warning' : 'badge--success'}`} style={{ fontSize: '11px', padding: '4px 10px' }}>
                {pendingInvoice ? 'ACTION REQUIRED · PAYMENT PENDING' : 'ACCOUNT UP TO DATE'}
              </span>
              <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: 'var(--text-primary)', margin: '10px 0 4px' }}>
                {pendingInvoice ? inr(pendingInvoice.amount) : '₹0 Outstanding'}
              </h2>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                {pendingInvoice
                  ? `${pendingInvoice.type} (${pendingInvoice.month}) · Due by ${formatDate(pendingInvoice.dueDate)}`
                  : 'All hostel fees and mess advance dues for September 2026 have been settled.'}
              </p>
            </div>

            <div>
              {pendingInvoice ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => openPayFor(pendingInvoice)}
                  style={{ padding: '12px 28px', fontSize: 'var(--font-base)', fontWeight: 700, boxShadow: 'var(--shadow-md)' }}
                >
                  <CreditCard size={18} />
                  Pay Now ({inr(pendingInvoice.amount)})
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => paidInvoices[0] && setReceiptModal(paidInvoices[0])}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={15} />
                  Download Latest Receipt
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, margin: 0 }}>Fee Invoices & History</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                Full record of room rent, utility bills, and mess advance
              </p>
            </div>
            <span className="badge badge--default">{myInvoices.length} records</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myInvoices.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 'var(--radius-sm)',
                    background: inv.status === 'paid' ? 'var(--success-50)' : 'var(--warning-50)',
                    color: inv.status === 'paid' ? 'var(--success-600)' : 'var(--warning-600)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    {inv.status === 'paid' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {inv.type} · {inv.month}
                    </div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      Invoice #{inv.id} · Due {formatDate(inv.dueDate)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--font-base)', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {inr(inv.amount)}
                    </div>
                    <span className={`badge ${inv.status === 'paid' ? 'badge--success' : 'badge--warning'}`} style={{ fontSize: '10px' }}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    {inv.status === 'paid' ? (
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => setReceiptModal(inv)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <FileText size={13} />
                        Receipt
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={() => openPayFor(inv)}
                        style={{ fontWeight: 600 }}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Policy Note */}
        <div className="card" style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-600)' }} />
            Hostel Fee Payment Terms
          </div>
          <p>
            Hostel maintenance and room fees must be cleared by the 5th of each calendar month. Payments made via UPI or Net Banking update the central administrator ledger and student registry instantly.
          </p>
        </div>
      </div>

      {/* Pay Now Modal */}
      {payModal && selectedInvoice && (
        <>
          <div className="drawer-overlay" onClick={() => setPayModal(false)} />
          <div className="drawer" style={{ width: 440 }}>
            <div className="drawer__header">
              <h2 className="drawer__title">Complete Fee Payment</h2>
              <button type="button" className="btn btn--ghost btn--icon" onClick={() => setPayModal(false)}>✕</button>
            </div>
            <div className="drawer__body">
              <div style={{ textAlign: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-primary)' }}>
                <span className="badge badge--warning">Payment Pending</span>
                <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>
                  {inr(selectedInvoice.amount)}
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {selectedInvoice.type} · {selectedInvoice.month} · Invoice #{selectedInvoice.id}
                </div>
              </div>

              <div style={{ margin: '16px 0' }}>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Choose Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  {['UPI', 'Net Banking', 'Debit / Credit Card', 'Cash at Warden Desk'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`btn ${method === m ? 'btn--primary' : 'btn--secondary'}`}
                      style={{ padding: '10px', fontSize: 'var(--font-xs)', justifyContent: 'center' }}
                      onClick={() => setMethod(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {method === 'UPI' && (
                <div style={{ padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    Virtual Payment Address (VPA)
                  </div>
                  <code style={{ fontSize: '13px', background: 'white', padding: '4px 10px', borderRadius: 4, display: 'inline-block' }}>
                    abchostel@icici
                  </code>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 6 }}>
                    Instant confirmation will update your status to Paid.
                  </p>
                </div>
              )}
            </div>

            <div className="drawer__footer" style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn--primary"
                style={{ flex: 1, padding: 12, fontWeight: 700 }}
                onClick={handlePay}
              >
                Pay {inr(selectedInvoice.amount)} via {method}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setPayModal(false)}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* Official Receipt Modal */}
      {receiptModal && (
        <>
          <div className="drawer-overlay" onClick={() => setReceiptModal(null)} />
          <div className="drawer" style={{ width: 440 }}>
            <div className="drawer__header">
              <h2 className="drawer__title">Payment Receipt</h2>
              <button type="button" className="btn btn--ghost btn--icon" onClick={() => setReceiptModal(null)}>✕</button>
            </div>
            <div className="drawer__body" style={{ padding: 'var(--space-5)' }}>
              <div style={{ border: '2px dashed var(--border-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-600)', letterSpacing: '0.06em' }}>ABC RESIDENCY HOSTEL</div>
                  <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>FEE RECEIPT</h3>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Receipt No: {receiptModal.receipt || 'RCT-88421'}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 'var(--font-xs)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Student Name:</span>
                    <strong>{currentStudent?.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Student ID:</span>
                    <strong>{currentStudent?.id}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Room & Bed:</span>
                    <strong>{currentStudent?.room} (Bed {currentStudent?.bed})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Payment For:</span>
                    <strong>{receiptModal.type} ({receiptModal.month})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Payment Date:</span>
                    <strong>{receiptModal.paidOn ? formatDate(receiptModal.paidOn) : 'Not recorded'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Method / Txn:</span>
                    <strong>{receiptModal.method || 'Not recorded'} ({receiptModal.txnId || 'Not recorded'})</strong>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)' }}>
                    <strong>Total Paid:</strong>
                    <strong style={{ color: 'var(--success-600)', fontSize: 'var(--font-base)' }}>{inr(receiptModal.amount)}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="drawer__footer" style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn--primary"
                style={{ flex: 1 }}
                onClick={() => {
                  downloadReceipt(receiptModal);
                  showToast('Payment receipt downloaded.');
                }}
              >
                <Download size={14} /> Download Receipt
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setReceiptModal(null)}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
