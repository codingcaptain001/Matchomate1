import { useState } from 'react';
import { Shuffle, Sparkles, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { generateAllocations as createAllocations } from '../api/allocations';
import { useHostelStore } from '../context/HostelStore';

export default function SmartAllocationPage() {
  const [step, setStep] = useState(1);
  const { students, rooms, hydrating, approveAllocations } = useHostelStore();
  const [selectedIds, setSelectedIds] = useState([]);
  const [targetBlock, setTargetBlock] = useState('all');
  const [priority, setPriority] = useState('compatibility');
  const [allocations, setAllocations] = useState([]);
  const [averageCompatibility, setAverageCompatibility] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState('');

  const eligibleStudents = students.filter((student) => student.status === 'active');
  const selectedStudents = eligibleStudents.filter((student) => selectedIds.includes(student.id));
  const availableBlocks = [...new Set(rooms.filter((room) => room.status !== 'maintenance').map((room) => room.block))].sort();
  const selectedBlocks = targetBlock === 'all' ? [] : targetBlock.split(',');

  const toggleStudent = (studentId) => {
    setSelectedIds((previous) => previous.includes(studentId)
      ? previous.filter((id) => id !== studentId)
      : [...previous, studentId]);
    setError('');
    setAllocations([]);
    setApproved(false);
  };

  const handleGenerate = async () => {
    if (selectedStudents.length < 2 || selectedStudents.length % 2 !== 0) {
      setError('Select an even number of students so everyone can be paired.');
      return;
    }
    setStep(3);
    setGenerating(true);
    setError('');
    setApproved(false);
    try {
      const result = await createAllocations({
        students: selectedStudents,
        rooms,
        targetBlocks: selectedBlocks,
        priority,
      });
      setAllocations(result.allocations);
      setAverageCompatibility(result.averageCompatibility);
      setStep(4);
    } catch (generationError) {
      setError(generationError.message || 'Unable to generate allocations.');
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = () => {
    approveAllocations(allocations);
    setApproved(true);
  };

  const steps = [
    { id: 1, label: 'Select Students' },
    { id: 2, label: 'Constraints' },
    { id: 3, label: 'Generate' },
    { id: 4, label: 'Review & Approve' },
  ];

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
          {steps.map((s, index) => (
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
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Choose an even number of active demo students. Selected students are considered for reassignment.
            </p>
            {hydrating ? <p role="status">Loading hostel students...</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                {eligibleStudents.map((student) => (
                  <label key={student.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'var(--space-3)', background: selectedIds.includes(student.id) ? 'var(--accent-50)' : 'var(--bg-tertiary)', border: `1px solid ${selectedIds.includes(student.id) ? 'var(--accent-300)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedIds.includes(student.id)} onChange={() => toggleStudent(student.id)} />
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</span>
                      <span style={{ display: 'block', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{student.course} · Room {student.room}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
              {selectedStudents.length} selected · {eligibleStudents.length} eligible
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn--primary" onClick={() => { setError(''); setStep(2); }} disabled={hydrating || selectedStudents.length < 2 || selectedStudents.length % 2 !== 0}>
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-stagger">
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Configure Constraints</h3>
            <div className="grid-2col" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <div className="input-wrapper">
                <label className="input-label">Target Blocks</label>
                <select className="input" value={targetBlock} onChange={(event) => setTargetBlock(event.target.value)}>
                  <option value="all">All Available Blocks</option>
                  {availableBlocks.length > 1 && <option value={availableBlocks.slice(0, 2).join(',')}>Blocks {availableBlocks.slice(0, 2).join(' & ')}</option>}
                  {availableBlocks.map((block) => <option key={block} value={block}>Block {block}</option>)}
                </select>
              </div>
              <div className="input-wrapper">
                <label className="input-label">Prioritize By</label>
                <select className="input" value={priority} onChange={(event) => setPriority(event.target.value)}>
                  <option value="compatibility">Lifestyle Compatibility</option>
                  <option value="course">Same Course, then Compatibility</option>
                </select>
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
              Only rooms with enough capacity for a pair are considered. Current selected students are released from their rooms before availability is calculated.
            </p>
            {error && <p role="alert" style={{ color: 'var(--danger-600)', marginBottom: 'var(--space-4)' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn--ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn--primary" onClick={handleGenerate}>
                Generate Allocations <Sparkles size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-stagger" style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
            <Sparkles size={48} style={{ color: 'var(--accent-500)', margin: '0 auto', marginBottom: 'var(--space-4)', animation: 'pulse-subtle 2s infinite' }} />
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 600, marginBottom: 8 }}>
              {generating ? 'Generating compatibility-based allocations...' : 'Allocation generation needs attention'}
            </h3>
            <p role={generating ? 'status' : undefined} style={{ fontSize: 'var(--font-md)', color: error ? 'var(--danger-600)' : 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              {error || 'Scoring selected student pairs and checking room capacity.'}
            </p>
            {!generating && <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button className="btn btn--ghost" onClick={() => setStep(2)}>Back to Constraints</button>
              <button className="btn btn--primary" onClick={handleGenerate}>Try Again <Sparkles size={16} /></button>
            </div>}
          </div>
        )}

        {step === 4 && (
          <div className="animate-stagger">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {approved ? 'Allocations Approved' : 'Allocation Complete'} <CheckCircle2 style={{ color: 'var(--success-500)' }} size={20} />
                </h3>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                  Generated {allocations.length} room pairs with an average compatibility of {averageCompatibility}%.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn--secondary" onClick={() => { setError(''); setStep(2); }} disabled={approved}>Regenerate</button>
                <button className="btn btn--primary" onClick={handleApprove} disabled={approved || allocations.length === 0}>
                  {approved ? 'Approved' : 'Approve All'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {allocations.map((alloc) => (
                <div key={alloc.room} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                  padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-md)', minWidth: 80 }}>Room {alloc.room}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{alloc.students.map((student) => student.name).join(' & ')}</div>
                    {alloc.strengths.length > 0 && <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>{alloc.strengths.join(' · ')}</div>}
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
