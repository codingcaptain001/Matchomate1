import { useState } from 'react';
import { Shuffle, Sparkles, CheckCircle2, ChevronRight, Check, Users, SlidersHorizontal, ArrowLeft } from 'lucide-react';
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
  const [generationCount, setGenerationCount] = useState(0);

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
    setGenerationCount(0);
  };

  const handleGenerate = async ({ avoidCurrent = false } = {}) => {
    if (selectedStudents.length < 1) {
      setError('Select at least one student to allocate.');
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
        avoidPairs: avoidCurrent
          ? allocations.flatMap((allocation) => allocation.pairs || [])
          : [],
        variation: generationCount,
      });
      setAllocations(result.allocations);
      setAverageCompatibility(result.averageCompatibility);
      setGenerationCount((count) => count + 1);
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
    { id: 1, label: 'Select students', icon: Users },
    { id: 2, label: 'Set preferences', icon: SlidersHorizontal },
    { id: 3, label: 'Find matches', icon: Sparkles },
    { id: 4, label: 'Review & approve', icon: CheckCircle2 },
  ];

  return (
    <div className="page-content allocation-page">
      <div className="page-header allocation-page__header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <div className="allocation-page__title-row">
          <div className="allocation-page__icon"><Shuffle size={21} /></div>
          <div>
            <div className="allocation-page__eyebrow">ROOM PLANNING</div>
            <h1 className="page-header__greeting">Smart Allocation</h1>
          </div>
        </div>
        <p className="page-header__subtitle">
          Automatically allocate students to rooms based on compatibility, course, and preferences.
        </p>
      </div>

      <div className="card allocation-card">
        {/* Stepper */}
        <div className="allocation-stepper" aria-label={`Step ${step} of ${steps.length}`}>
          {steps.map((s, index) => (
            <div className="allocation-step-wrap" key={s.id}>
              <div
                className={`allocation-step ${step === s.id ? 'allocation-step--active' : ''} ${step > s.id ? 'allocation-step--complete' : ''}`}
                aria-current={step === s.id ? 'step' : undefined}
              >
                <div className="allocation-step__number">{step > s.id ? <Check size={16} /> : s.id}</div>
                <span>{s.label}</span>
              </div>
              {index < steps.length - 1 && <div className={`allocation-step__connector ${step > s.id ? 'allocation-step__connector--complete' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="animate-stagger allocation-step-content">
            <div className="allocation-section-heading">
              <div className="allocation-section-heading__icon"><Users size={18} /></div>
              <div>
                <h3>Select students to allocate</h3>
                <p>
              Choose active demo students. Selected students are considered for reassignment.
                </p>
              </div>
            </div>
            {hydrating ? <p role="status">Loading hostel students...</p> : (
              <div className="allocation-student-grid">
                {eligibleStudents.map((student) => (
                  <label key={student.id} className={`allocation-student-card ${selectedIds.includes(student.id) ? 'allocation-student-card--selected' : ''}`}>
                    <input type="checkbox" checked={selectedIds.includes(student.id)} onChange={() => toggleStudent(student.id)} />
                    <span className="allocation-student-card__avatar">{student.avatar || student.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</span>
                    <span className="allocation-student-card__details">
                      <span className="allocation-student-card__name">{student.name}</span>
                      <span className="allocation-student-card__meta">{student.course} · Room {student.room}</span>
                    </span>
                    <span className="allocation-student-card__check"><Check size={13} /></span>
                  </label>
                ))}
              </div>
            )}
            <div className="allocation-selection-summary">
              <span>{selectedStudents.length} selected</span>
              <span>{eligibleStudents.length} active students available</span>
            </div>
            <div className="allocation-actions allocation-actions--end">
              <button className="btn btn--primary" onClick={() => { setError(''); setStep(2); }} disabled={hydrating || selectedStudents.length < 1}>
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-stagger allocation-step-content">
            <div className="allocation-section-heading">
              <div className="allocation-section-heading__icon"><SlidersHorizontal size={18} /></div>
              <div>
                <h3>Configure allocation preferences</h3>
                <p>Choose where students can be placed and what to prioritize.</p>
              </div>
            </div>
            <div className="allocation-constraint-grid">
              <div className="allocation-field">
                <label htmlFor="allocation-target-block">Target blocks</label>
                <select id="allocation-target-block" className="allocation-select" value={targetBlock} onChange={(event) => setTargetBlock(event.target.value)}>
                  <option value="all">All Available Blocks</option>
                  {availableBlocks.length > 1 && <option value={availableBlocks.slice(0, 2).join(',')}>Blocks {availableBlocks.slice(0, 2).join(' & ')}</option>}
                  {availableBlocks.map((block) => <option key={block} value={block}>Block {block}</option>)}
                </select>
              </div>
              <div className="allocation-field">
                <label htmlFor="allocation-priority">Prioritize by</label>
                <select id="allocation-priority" className="allocation-select" value={priority} onChange={(event) => setPriority(event.target.value)}>
                  <option value="compatibility">Lifestyle Compatibility</option>
                  <option value="course">Same Course, then Compatibility</option>
                </select>
              </div>
            </div>
            <div className="allocation-info-note">
              <Sparkles size={16} />
              <p>Only rooms with enough capacity are considered. Selected students are released from their current rooms before availability is calculated.</p>
            </div>
            {error && <p role="alert" className="allocation-error">{error}</p>}
            <div className="allocation-actions">
              <button className="btn btn--secondary" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
              <button className="btn btn--primary allocation-generate-btn" onClick={handleGenerate}>
                Generate Allocations <Sparkles size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-stagger allocation-generating">
            <div className="allocation-generating__icon"><Sparkles size={26} /></div>
            <h3>
              {generating ? 'Generating compatibility-based allocations...' : 'Allocation generation needs attention'}
            </h3>
            <p role={generating ? 'status' : undefined} className={error ? 'allocation-error' : ''}>
              {error || 'Scoring selected student pairs and checking room capacity.'}
            </p>
            {!generating && <div className="allocation-actions allocation-actions--center">
              <button className="btn btn--secondary" onClick={() => setStep(2)}><ArrowLeft size={16} /> Back to preferences</button>
              <button className="btn btn--primary" onClick={handleGenerate}>Try Again <Sparkles size={16} /></button>
            </div>}
          </div>
        )}

        {step === 4 && (
          <div className="animate-stagger allocation-step-content">
            <div className="allocation-review-header">
              <div>
                <h3 className="allocation-review-header__title">
                  {approved ? 'Allocations Approved' : 'Allocation Complete'} <CheckCircle2 style={{ color: 'var(--success-500)' }} size={20} />
                </h3>
                <p className="allocation-review-header__summary">
                  Generated {allocations.length} room pairs with an average compatibility of {averageCompatibility}%.
                </p>
              </div>
              <div className="allocation-review-header__actions">
                <button
                  className="btn btn--secondary"
                  onClick={() => handleGenerate({ avoidCurrent: true })}
                  disabled={generating || selectedStudents.length === 0}
                >
                  Regenerate
                </button>
                <button className="btn btn--primary" onClick={handleApprove} disabled={approved || allocations.length === 0}>
                  {approved ? 'Approved' : 'Approve All'}
                </button>
              </div>
            </div>

            <div className="allocation-results">
              {allocations.map((alloc) => (
                <div key={alloc.room} className="allocation-result-card">
                  <div className="allocation-result-card__room">Room {alloc.room}</div>
                  <div className="allocation-result-card__students">
                    <div>{alloc.students.map((student) => student.name).join(' & ')}</div>
                    {alloc.strengths.length > 0 && <div className="allocation-result-card__strengths">{alloc.strengths.join(' · ')}</div>}
                  </div>
                  <div className="allocation-result-card__match">
                    <span className={alloc.score >= 80 ? 'allocation-result-card__score' : 'allocation-result-card__score allocation-result-card__score--warning'}>
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
