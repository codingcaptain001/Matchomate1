import { useState } from 'react';
import {
  HelpCircle, PhoneCall, AlertTriangle, ShieldCheck,
  FileText, MessageSquare, ChevronDown, ChevronUp, Mail,
  Send, HeartPulse, Building, Clock
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function StudentHelp() {
  const { showToast } = useHostelStore();
  const [openFaq, setOpenFaq] = useState(0);
  const [queryTopic, setQueryTopic] = useState('Fee & Ledger');
  const [queryText, setQueryText] = useState('');

  const emergencyContacts = [
    { name: 'Hostel Chief Warden (Dr. Mehta)', role: 'Campus Head', phone: '+91 98765 43210', icon: Building, color: 'var(--accent-600)' },
    { name: 'Campus Security & Gate 1 Control', role: '24x7 Security', phone: '+91 98111 22233', icon: ShieldCheck, color: 'var(--success-600)' },
    { name: 'University Health Centre / Ambulance', role: 'Medical Emergency', phone: '108 / +91 98222 33344', icon: HeartPulse, color: 'var(--danger-600)' },
    { name: 'Anti-Ragging & Welfare Helpline', role: 'Confidential 24x7', phone: '1800-180-5522', icon: AlertTriangle, color: 'var(--warning-600)' },
  ];

  const faqs = [
    {
      q: 'What is the hostel gate curfew time?',
      a: 'The main hostel gate closes strictly at 10:00 PM on weekdays and 10:30 PM on weekends. If you expect to return late due to academic lab work, you must apply for a Late Pass via the Leave & Attendance portal prior to 08:00 PM.'
    },
    {
      q: 'How does the Mess Skip rebate work?',
      a: 'If you plan to eat outside or go home, submit a Meal Skip request at least 6 hours in advance on the Mess page. A rebate of ₹75 per main meal is automatically credited to your next semester mess invoice.'
    },
    {
      q: 'How can I request a room or roommate change?',
      a: 'Roommate change requests open during the mid-semester window. You can browse roommate compatibility scores on the "My Roommate" tab and submit an exchange request through the Room page.'
    },
    {
      q: 'How long does it take for maintenance complaints to get fixed?',
      a: 'High priority plumbing and electrical issues are resolved within 4 to 8 hours. General carpentry and painting tasks are addressed during the Saturday maintenance cycle.'
    },
    {
      q: 'Are parents and day-scholars allowed inside hostel rooms?',
      a: 'Female visitors and parents may meet students in the Ground Floor Reception lounge or dining hall between 04:00 PM and 08:00 PM. Entry into individual student rooms requires prior written permission from Warden.'
    },
  ];

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    showToast('Your inquiry has been sent to Warden Office. Response expected within 24h.');
    setQueryText('');
  };

  return (
    <div className="student-container" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Support & Resident Assistance
        </span>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
          Hostel Helpdesk & Guidelines
        </h1>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          Emergency contacts, rules & handbook, and direct help ticket desk for ABC Residency.
        </p>
      </div>

      {/* Emergency Hotline Grid */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
          Emergency & Duty Hotlines
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          {emergencyContacts.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div key={idx} className="card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{c.role}</span>
                      <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</h3>
                    </div>
                  </div>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="btn btn--secondary btn--sm"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, fontWeight: 700, color: 'var(--text-primary)' }}
                >
                  <PhoneCall size={14} color="var(--accent-600)" /> {c.phone}
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        {/* FAQs */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
            <HelpCircle size={20} color="var(--accent-600)" />
            <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--bg-card)'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: openFaq === idx ? 'var(--bg-tertiary)' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 'var(--font-sm)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '12px 16px', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-color)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Direct Inquiry to Warden */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
            <MessageSquare size={20} color="var(--accent-600)" />
            <div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Message Warden Office
              </h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                Direct confidential query or administrative appeal
              </p>
            </div>
          </div>

          <form onSubmit={handleQuerySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <label className="ops-label">Inquiry Category</label>
              <select
                className="ops-select"
                style={{ width: '100%' }}
                value={queryTopic}
                onChange={(e) => setQueryTopic(e.target.value)}
              >
                <option>Fee & Ledger Inquiries</option>
                <option>Hostel Rule Clarification</option>
                <option>Medical Exemption</option>
                <option>Special Mess Diet Request</option>
                <option>Other Grievance</option>
              </select>
            </div>

            <div>
              <label className="ops-label">Your Message</label>
              <textarea
                className="ops-input"
                style={{ width: '100%', minHeight: 120, resize: 'vertical' }}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Type your message to the warden team..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="submit" className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Send size={15} /> Submit Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
