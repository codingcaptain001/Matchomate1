import { useState } from 'react';
import {
  UtensilsCrossed, Star, CheckCircle2, Clock, Calendar,
  Coffee, Sun, Sunset, Moon, Plus, AlertCircle, Award
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function StudentMess() {
  const {
    currentStudent,
    messMenu,
    messSkips,
    messFeedback,
    addMessSkip,
    addMessFeedback,
    today,
  } = useHostelStore();

  const [activeTab, setActiveTab] = useState('today');
  const [skipModalOpen, setSkipModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Skip Form State
  const [skipDate, setSkipDate] = useState(today);
  const [skipMeal, setSkipMeal] = useState('Dinner');
  const [skipReason, setSkipReason] = useState('Group study / Dining outside');

  // Feedback Form State
  const [fbMeal, setFbMeal] = useState('Lunch');
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState('Dal Makhani and Paneer Bhurji were excellent today!');

  const mySkips = messSkips.filter((s) => s.studentId === currentStudent?.id);
  const myFeedback = messFeedback.filter((f) => f.studentId === currentStudent?.id);

  const getMealIcon = (meal) => {
    switch (meal.toLowerCase()) {
      case 'breakfast': return <Coffee size={18} color="var(--accent-600)" />;
      case 'lunch': return <Sun size={18} color="var(--warning-600)" />;
      case 'snacks': return <Sunset size={18} color="var(--primary-600)" />;
      case 'dinner': return <Moon size={18} color="var(--accent-800)" />;
      default: return <UtensilsCrossed size={18} />;
    }
  };

  const handleSkipSubmit = (e) => {
    e.preventDefault();
    addMessSkip({
      date: skipDate,
      meal: skipMeal,
      reason: skipReason,
    });
    setSkipModalOpen(false);
  };

  const handleFbSubmit = (e) => {
    e.preventDefault();
    addMessFeedback({
      meal: fbMeal,
      rating: Number(fbRating),
      comment: fbComment,
    });
    setFeedbackModalOpen(false);
    setFbComment('');
  };

  return (
    <div className="student-container" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--space-5)' }}>
        <div>
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hostel Dining & Catering
          </span>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
            Mess & Food Menu
          </h1>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Check daily 4-course meal schedules, submit meal skip requests for fee rebate, and rate daily food.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn--secondary"
            onClick={() => setFeedbackModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px' }}
          >
            <Star size={15} /> Rate Meal
          </button>
          <button
            className="btn btn--primary"
            onClick={() => setSkipModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px' }}
          >
            <Plus size={15} /> Skip Meal (Rebate)
          </button>
        </div>
      </div>

      {/* Highlights / Notice Bar */}
      <div className="card" style={{
        padding: 'var(--space-4)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(244, 244, 255, 0.95))',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 'var(--space-5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-100)', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>
              Special Sunday Feast Alert 🍛
            </div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
              Paneer Butter Masala, Gulab Jamun, Veg Pulao & Ice Cream served this Sunday dinner.
            </div>
          </div>
        </div>
        <div style={{ fontSize: 'var(--font-xs)', background: 'white', padding: '6px 12px', borderRadius: 20, fontWeight: 600, color: 'var(--accent-700)', boxShadow: 'var(--shadow-xs)' }}>
          Mess Timings: 7:30 AM – 10:00 PM
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>
        <button
          className={`btn btn--sm ${activeTab === 'today' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('today')}
        >
          Today's Menu ({today})
        </button>
        <button
          className={`btn btn--sm ${activeTab === 'skips' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('skips')}
        >
          My Meal Skips ({mySkips.length})
        </button>
        <button
          className={`btn btn--sm ${activeTab === 'feedback' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('feedback')}
        >
          My Ratings ({myFeedback.length})
        </button>
      </div>

      {/* Tab 1: Today's Menu */}
      {activeTab === 'today' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          {messMenu.map((item) => (
            <div key={item.id} className="card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getMealIcon(item.meal)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{item.meal}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{item.time}</span>
                  </div>
                </div>
                {item.available ? (
                  <span className="badge badge--success" style={{ fontSize: '10px' }}>Active</span>
                ) : (
                  <span className="badge badge--danger" style={{ fontSize: '10px' }}>Closed</span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(Array.isArray(item.items) ? item.items : String(item.items || '').split(',')).map((food, idx) => (
                    <li key={idx} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-500)', flexShrink: 0 }} />
                      {String(food).trim()}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Diet: {item.diet || 'Pure Veg'}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-600)' }}>Chef: {item.chef || 'Chef Sharma'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Meal Skips */}
      {activeTab === 'skips' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-header)' }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
              Meal Skip & Rebate History
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
              ₹75 credited per skipped lunch/dinner to your monthly mess ledger if requested 6 hrs in advance.
            </p>
          </div>

          {mySkips.length === 0 ? (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <UtensilsCrossed size={36} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p>No meal skips requested this month.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {mySkips.map((s) => (
                <div key={s.id} style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>
                      {s.meal} Skip ({s.date})
                    </div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      Reason: "{s.reason}"
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--success-700)' }}>
                      +₹75 Rebate
                    </span>
                    <span className="badge badge--success">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Feedback */}
      {activeTab === 'feedback' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-header)' }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
              My Food Reviews & Feedback
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
              Directly monitored by the Mess Committee and Student Welfare Warden.
            </p>
          </div>

          {myFeedback.length === 0 ? (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Star size={36} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p>You haven't submitted any food ratings yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {myFeedback.map((fb) => (
                <div key={fb.id} style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                      {fb.meal} Feedback ({fb.date})
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((st) => (
                        <Star key={st} size={14} fill={st <= fb.rating ? 'var(--warning-500)' : 'none'} color="var(--warning-500)" />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 6, fontStyle: 'italic' }}>
                    "{fb.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skip Meal Modal */}
      {skipModalOpen && (
        <div className="modal-overlay" onClick={() => setSkipModalOpen(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460, width: '90%', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>Skip Meal for Food Rebate</h3>
              <button className="btn btn--ghost btn--sm" onClick={() => setSkipModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSkipSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="ops-label">Date</label>
                <input
                  type="date"
                  className="ops-input"
                  style={{ width: '100%' }}
                  value={skipDate}
                  onChange={(e) => setSkipDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="ops-label">Meal to Skip</label>
                <select
                  className="ops-select"
                  style={{ width: '100%' }}
                  value={skipMeal}
                  onChange={(e) => setSkipMeal(e.target.value)}
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Snacks</option>
                  <option>Dinner</option>
                </select>
              </div>

              <div>
                <label className="ops-label">Reason</label>
                <input
                  type="text"
                  className="ops-input"
                  style={{ width: '100%' }}
                  value={skipReason}
                  onChange={(e) => setSkipReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 'var(--space-2)' }}>
                <button type="button" className="btn btn--secondary" onClick={() => setSkipModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Confirm Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="modal-overlay" onClick={() => setFeedbackModalOpen(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460, width: '90%', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>Rate Today's Meal</h3>
              <button className="btn btn--ghost btn--sm" onClick={() => setFeedbackModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleFbSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="ops-label">Meal</label>
                <select
                  className="ops-select"
                  style={{ width: '100%' }}
                  value={fbMeal}
                  onChange={(e) => setFbMeal(e.target.value)}
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Snacks</option>
                  <option>Dinner</option>
                </select>
              </div>

              <div>
                <label className="ops-label">Rating (1 to 5 Stars)</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="btn btn--ghost"
                      style={{ padding: 6 }}
                      onClick={() => setFbRating(star)}
                    >
                      <Star size={24} fill={star <= fbRating ? 'var(--warning-500)' : 'none'} color="var(--warning-500)" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="ops-label">Comments & Suggestions</label>
                <textarea
                  className="ops-input"
                  style={{ width: '100%', minHeight: 70 }}
                  value={fbComment}
                  onChange={(e) => setFbComment(e.target.value)}
                  placeholder="Tell the chef what was good or what can be improved..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 'var(--space-2)' }}>
                <button type="button" className="btn btn--secondary" onClick={() => setFeedbackModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
