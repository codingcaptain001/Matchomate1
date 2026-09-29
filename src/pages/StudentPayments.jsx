import { useState } from 'react';
import {
  CreditCard, CheckCircle2, Clock, AlertTriangle, FileText,
  Download, QrCode, ArrowRight, ShieldCheck, Receipt, Wallet,
  IndianRupee, CalendarCheck, Info, Smartphone
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
  const { currentStudent, payments, markPaymentPaid, showToast } = useHostelStore();

  const [payModal, setPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [method, setMethod] = useState('UPI');
  const [receiptModal, setReceiptModal] = useState(null);

  const myInvoices = payments.filter((p) => p.studentId === currentStudent?.id);
  const pendingInvoice = myInvoices.find((p) => p.status === 'pending' || p.status === 'overdue');
  const paidInvoices = myInvoices.filter((p) => p.status === 'paid');
  const totalPaid = paidInvoices.reduce((s, p) => s + p.amount, 0);

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

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, outline: 'none',
    border: '1.5px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '40px 48px' }}>

      {/* ─── Header ─── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
          color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '5px 14px',
          borderRadius: 20, marginBottom: 12, border: '1px solid rgba(99,102,241,0.15)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <Wallet size={13} /> Financial Portal
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.025em' }}>
          Hostel Fees & Payments
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-tertiary)', margin: 0 }}>
          View dues, download official receipts, and pay online. Synced live with university accounts.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ─── Next Payment Hero Card ─── */}
        <div style={{
          borderRadius: 20, padding: '36px 32px', overflow: 'hidden', position: 'relative',
          background: pendingInvoice
            ? 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02))'
            : 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(5,150,105,0.02))',
          border: `1.5px solid ${pendingInvoice ? 'rgba(245,158,11,0.2)' : 'rgba(5,150,105,0.2)'}`,
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: pendingInvoice ? 'rgba(245,158,11,0.04)' : 'rgba(5,150,105,0.04)' }} />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 20,
                background: pendingInvoice ? 'rgba(245,158,11,0.1)' : 'rgba(5,150,105,0.1)',
                color: pendingInvoice ? '#d97706' : '#059669', fontSize: 12, fontWeight: 700,
                border: `1px solid ${pendingInvoice ? 'rgba(245,158,11,0.2)' : 'rgba(5,150,105,0.2)'}`,
                marginBottom: 16,
              }}>
                {pendingInvoice ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                {pendingInvoice ? 'ACTION REQUIRED · PAYMENT PENDING' : 'ACCOUNT UP TO DATE'}
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                {pendingInvoice ? inr(pendingInvoice.amount) : '₹0 Outstanding'}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
                {pendingInvoice
                  ? `${pendingInvoice.type} (${pendingInvoice.month}) · Due by ${formatDate(pendingInvoice.dueDate)}`
                  : 'All hostel fees and mess advance dues for September 2026 have been settled.'}
              </p>
            </div>
            <div>
              {pendingInvoice ? (
                <button onClick={() => openPayFor(pendingInvoice)} style={{
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: 'white',
                  border: 'none', borderRadius: 14, padding: '14px 28px', fontSize: 15, fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(217,119,6,0.3)', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(217,119,6,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(217,119,6,0.3)'; }}
                >
                  <CreditCard size={20} /> Pay Now ({inr(pendingInvoice.amount)})
                </button>
              ) : (
                <button onClick={() => paidInvoices[0] && setReceiptModal(paidInvoices[0])} style={{
                  padding: '12px 20px', borderRadius: 12, border: '1px solid var(--border-primary)',
                  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Download size={15} /> Download Latest Receipt
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── KPI Cards ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { label: 'Total Invoices', value: myInvoices.length, icon: <Receipt size={22} />, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
            { label: 'Amount Paid', value: inr(totalPaid), icon: <IndianRupee size={22} />, gradient: 'linear-gradient(135deg, #059669, #34d399)' },
            { label: 'Next Due Date', value: pendingInvoice ? formatDate(pendingInvoice.dueDate) : 'None', icon: <CalendarCheck size={22} />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
          ].map((kpi, i) => (
            <div key={i} style={{
              background: 'var(--bg-secondary)', borderRadius: 16, padding: 22,
              border: '1px solid var(--border-primary)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
              display: 'flex', alignItems: 'center', gap: 16,
              transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)'; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: kpi.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                {kpi.icon}
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Invoices List ─── */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={18} color="#6366f1" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Fee Invoices & History</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>Full record of room rent, utility bills, and mess advance</div>
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '4px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}>
              {myInvoices.length} records
            </span>
          </div>

          {myInvoices.map((inv, i) => (
            <div key={inv.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: i < myInvoices.length - 1 ? '1px solid var(--border-primary)' : 'none',
              transition: 'background 0.15s', flexWrap: 'wrap', gap: 12,
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: inv.status === 'paid' ? 'rgba(5,150,105,0.08)' : 'rgba(245,158,11,0.08)',
                  color: inv.status === 'paid' ? '#059669' : '#d97706',
                  border: `1px solid ${inv.status === 'paid' ? 'rgba(5,150,105,0.15)' : 'rgba(245,158,11,0.15)'}`,
                }}>
                  {inv.status === 'paid' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{inv.type} · {inv.month}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Invoice #{inv.id} · Due {formatDate(inv.dueDate)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{inr(inv.amount)}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                    color: inv.status === 'paid' ? '#059669' : '#d97706',
                    background: inv.status === 'paid' ? 'rgba(5,150,105,0.08)' : 'rgba(245,158,11,0.08)',
                    border: `1px solid ${inv.status === 'paid' ? 'rgba(5,150,105,0.15)' : 'rgba(245,158,11,0.15)'}`,
                  }}>{inv.status.toUpperCase()}</span>
                </div>
                {inv.status === 'paid' ? (
                  <button onClick={() => setReceiptModal(inv)} style={{
                    padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-primary)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-400)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-primary)'}
                  >
                    <FileText size={14} /> Receipt
                  </button>
                ) : (
                  <button onClick={() => openPayFor(inv)} style={{
                    padding: '8px 16px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
                  }}>
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Policy Note ─── */}
        <div style={{
          background: 'rgba(99,102,241,0.04)', borderRadius: 16, padding: '20px 24px',
          border: '1px solid rgba(99,102,241,0.12)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
            <Info size={16} color="#6366f1" /> Hostel Fee Payment Terms
          </div>
          <p style={{ margin: 0 }}>
            Hostel maintenance and room fees must be cleared by the <strong>5th of each calendar month</strong>. Payments made via UPI or Net Banking update the central administrator ledger and student registry instantly.
          </p>
        </div>
      </div>

      {/* ─── Pay Now Drawer ─── */}
      {payModal && selectedInvoice && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 998 }} onClick={() => setPayModal(false)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--bg-secondary)', zIndex: 999,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid var(--border-primary)',
          }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CreditCard size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>Complete Fee Payment</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>Secure instant payment via multiple methods.</p>
                </div>
              </div>
              <button onClick={() => setPayModal(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Amount Display */}
              <div style={{
                textAlign: 'center', padding: '24px', borderRadius: 16,
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700,
                  color: '#d97706', background: 'rgba(245,158,11,0.08)', padding: '4px 12px', borderRadius: 8,
                  border: '1px solid rgba(245,158,11,0.15)', marginBottom: 12,
                }}>
                  <Clock size={13} /> Payment Pending
                </span>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {inr(selectedInvoice.amount)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6 }}>
                  {selectedInvoice.type} · {selectedInvoice.month} · Invoice #{selectedInvoice.id}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>Choose Payment Method</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['UPI', 'Net Banking', 'Debit / Credit Card', 'Cash at Warden Desk'].map((m) => (
                    <button key={m} onClick={() => setMethod(m)} style={{
                      padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      background: method === m ? 'rgba(99,102,241,0.08)' : 'var(--bg-tertiary)',
                      color: method === m ? '#6366f1' : 'var(--text-secondary)',
                      border: method === m ? '2px solid #6366f1' : '1.5px solid var(--border-primary)',
                      transition: 'all 0.2s', textAlign: 'center',
                    }}>{m}</button>
                  ))}
                </div>
              </div>

              {method === 'UPI' && (
                <div style={{
                  padding: '18px', background: 'var(--bg-tertiary)', borderRadius: 14,
                  border: '1px solid var(--border-primary)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                    <Smartphone size={15} /> Virtual Payment Address (VPA)
                  </div>
                  <code style={{ fontSize: 14, background: 'var(--bg-secondary)', padding: '6px 16px', borderRadius: 8, display: 'inline-block', fontWeight: 700, border: '1px solid var(--border-primary)' }}>
                    abchostel@icici
                  </code>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
                    Instant confirmation will update your status to Paid.
                  </p>
                </div>
              )}
            </div>

            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: 12 }}>
              <button onClick={() => setPayModal(false)} style={{
                flex: 1, padding: 13, borderRadius: 12, border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handlePay} style={{
                flex: 2, padding: 13, borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}>
                <CreditCard size={16} /> Pay {inr(selectedInvoice.amount)} via {method}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Receipt Drawer ─── */}
      {receiptModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 998 }} onClick={() => setReceiptModal(null)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--bg-secondary)', zIndex: 999,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid var(--border-primary)',
          }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #059669, #34d399)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Receipt size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>Payment Receipt</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>Official fee receipt for your records.</p>
                </div>
              </div>
              <button onClick={() => setReceiptModal(null)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
              <div style={{
                border: '2px dashed rgba(99,102,241,0.3)', padding: '28px 24px', borderRadius: 16,
                background: 'rgba(99,102,241,0.02)',
              }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ABC Residency Hostel</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>FEE RECEIPT</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Receipt No: {receiptModal.receipt || 'RCT-88421'}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
                  {[
                    ['Student Name', currentStudent?.name],
                    ['Student ID', currentStudent?.id],
                    ['Room & Bed', `${currentStudent?.room} (Bed ${currentStudent?.bed})`],
                    ['Payment For', `${receiptModal.type} (${receiptModal.month})`],
                    ['Payment Date', receiptModal.paidOn ? formatDate(receiptModal.paidOn) : 'Not recorded'],
                    ['Method / Txn', `${receiptModal.method || 'Not recorded'} (${receiptModal.txnId || 'N/A'})`],
                  ].map(([label, value], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-primary)' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{value}</strong>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 4 }}>
                    <strong style={{ fontSize: 15 }}>Total Paid</strong>
                    <strong style={{ color: '#059669', fontSize: 20 }}>{inr(receiptModal.amount)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: 12 }}>
              <button onClick={() => setReceiptModal(null)} style={{
                flex: 1, padding: 13, borderRadius: 12, border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Close</button>
              <button onClick={() => { downloadReceipt(receiptModal); showToast('Payment receipt downloaded.'); }} style={{
                flex: 2, padding: 13, borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}>
                <Download size={16} /> Download Receipt
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
