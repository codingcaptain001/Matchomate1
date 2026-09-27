import { useState } from 'react';
import { HelpCircle, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const helpItems = [
  ['How do I review a leave request?', 'Open Leave Requests, select a request, add optional remarks, then approve or reject it.'],
  ['Where are new student support tickets?', 'Student complaints, help inquiries, and room-change requests appear in the Complaints queue.'],
  ['How do reports work?', 'Reports export the current demo data as CSV. They do not connect to an external accounting or attendance system.'],
  ['How do I approve a room allocation?', 'Generate allocations, review the compatibility scores and room capacity, then choose Approve All.'],
];

export default function AdminHelpPage() {
  const [open, setOpen] = useState(0);
  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><HelpCircle size={24} style={{ color: 'var(--accent-500)' }} /><h1 className="page-header__greeting">Help & Support</h1></div>
        <p className="page-header__subtitle">Guidance for operating the MatchoMate demo workspace.</p>
      </div>
      <div className="grid-2col" style={{ alignItems: 'start' }}>
        <section className="card">
          <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Frequently Asked Questions</h2>
          {helpItems.map(([question, answer], index) => (
            <div key={question} style={{ borderTop: '1px solid var(--border-primary)' }}>
              <button type="button" className="btn btn--ghost" style={{ width: '100%', justifyContent: 'space-between', textAlign: 'left', padding: '12px 0' }} onClick={() => setOpen(open === index ? -1 : index)}>
                {question}{open === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {open === index && <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, paddingBottom: 12 }}>{answer}</p>}
            </div>
          ))}
        </section>
        <section className="card">
          <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 8 }}>Contact Support</h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Use these links to contact the demo support desk.</p>
          <a className="btn btn--secondary" href="mailto:support@matchomate.com"><Mail size={15} /> Email support</a>
          <a className="btn btn--ghost" href="tel:+919876543210" style={{ marginLeft: 8 }}><Phone size={15} /> Call support</a>
        </section>
      </div>
    </div>
  );
}