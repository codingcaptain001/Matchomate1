import { useState } from 'react';
import { Shuffle, Settings, Users, Sparkles, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { roommateIntelligence } from '../data/mockData';

export default function SmartAllocationPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shuffle size={24} style={{ color: 'var(--accent-500)' }} />
          <h1 className="page-header__greeting">Smart Allocation</h1>
        </div>
        <p className="page-header__subtitle">
          Automatically allocate students to rooms based on compatibility, course, and preferences.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          {[
            { id: 1, label: 'Select Students' },
            { id: 2, label: 'Constraints' },
            { id: 3, label: 'Generate' },
            { id: 4, label: 'Review & Approve' }
          ].map((s, index) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= s.id ? 'var(--accent-600)' : 'var(--gray-200)',
                color: step >= s.id ? 'white' : 'var(--gray-500)',
                fontWeight: 600, fontSize: 'var(--font-sm)'
              }}>
                {step > s.id ? <Check size={16} /> : s.id}
              </div>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: step >= s.id ? 600 : 500, color: step >= s.id ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                {s.label}
              </span>
              {index < 3 && <div style={{ flex: 1, height: 2, background: step > s.id ? 'var(--accent-600)' : 'var(--gray-200)', margin: '0 16px' }} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="animate-stagger">
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Select Students to Allocate</h3>
            <div style={{ display: 'flex', gap: 16, marginBottom: 'var(--space-6)' }}>
              <div className="card" style={{ flex: 1, border: '2px solid var(--accent-500)', background: 'var(--accent-50)' }}>
                <Users size={24} style={{ color: 'var(--accent-600)', marginBottom: 12 }} />
                <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Unallocated First-Years</h4>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>120 students pending allocation.</p>
              </div>
              <div className="card card--interactive" style={{ flex: 1 }}>
                <Users size={24} style={{ color: 'var(--text-secondary)', marginBottom: 12 }} />
                <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Waitlist Students</h4>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>12 students waiting for rooms.</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn--primary" onClick={() => setStep(2)}>Next Step <ChevronRight size={18} /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-stagger">
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Configure Constraints</h3>
            <div className="grid-2col" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <div className="input-wrapper">
                <label className="input-label">Target Blocks</label>
                <select className="input">
                  <option>Block A & Block B</option>
                  <option>All Available Blocks</option>
                </select>
              </div>
              <div className="input-wrapper">
                <label className="input-label">Prioritize By</label>
                <select className="input">
                  <option>Lifestyle Compatibility (AI)</option>
                  <option>Same Course</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn--ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn--primary" onClick={() => setStep(3)}>Next Step <ChevronRight size={18} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-stagger" style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
            <Sparkles size={48} style={{ color: 'var(--accent-500)', margin: '0 auto', marginBottom: 'var(--space-4)', animation: 'pulse-subtle 2s infinite' }} />
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 600, marginBottom: 8 }}>AI is generating allocations...</h3>
            <p style={{ fontSize: 'var(--font-md)', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
              Evaluating 1,440 possible combinations to maximize compatibility.
            </p>
            <div className="progress-bar" style={{ maxWidth: 400, margin: '0 auto', height: 8 }}>
              <div className="progress-bar__fill" style={{ width: '60%', background: 'var(--accent-600)' }} />
            </div>
            <div style={{ marginTop: 'var(--space-8)' }}>
              <button className="btn btn--primary" onClick={() => setStep(4)}>Skip to Results (Demo)</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-stagger">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Allocation Complete <CheckCircle2 style={{ color: 'var(--success-500)' }} size={20} />
                </h3>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>AI achieved an average compatibility of 91%.</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn--secondary">Regenerate</button>
                <button className="btn btn--primary">Approve All</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {roommateIntelligence.allocations.map((alloc) => (
                <div key={alloc.room} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                  padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-md)', minWidth: 80 }}>Room {alloc.room}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{alloc.students.join(' & ')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: alloc.score >= 80 ? 'var(--success-600)' : 'var(--warning-600)' }}>
                      {alloc.score}% Match
                    </span>
                    <span className={`badge ${alloc.risk === 'low' ? 'badge--success' : 'badge--warning'}`}>{alloc.risk} risk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
