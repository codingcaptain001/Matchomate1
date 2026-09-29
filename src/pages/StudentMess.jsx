import { useState } from 'react';
import {
  UtensilsCrossed, Star, CheckCircle2, Clock, Calendar,
  Coffee, Sun, Sunset, Moon, Plus, AlertCircle, Award,
  ChefHat, Info, Leaf
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

export default function StudentMess() {
  const { currentStudent, messMenu, messSkips, messFeedback, addMessSkip, addMessFeedback, today } = useHostelStore();

  const [activeTab, setActiveTab] = useState('today');
  const [skipDrawerOpen, setSkipDrawerOpen] = useState(false);
  const [feedbackDrawerOpen, setFeedbackDrawerOpen] = useState(false);

  const [skipDate, setSkipDate] = useState(today);
  const [skipMeal, setSkipMeal] = useState('Dinner');
  const [skipReason, setSkipReason] = useState('Group study / Dining outside');

  const [fbMeal, setFbMeal] = useState('Lunch');
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState('Dal Makhani and Paneer Bhurji were excellent today!');

  const mySkips = messSkips.filter((s) => s.studentId === currentStudent?.id);
  const myFeedback = messFeedback.filter((f) => f.studentId === currentStudent?.id);

  const getMealIcon = (meal) => {
    switch (meal.toLowerCase()) {
      case 'breakfast': return <Coffee size={20} />;
      case 'lunch': return <Sun size={20} />;
      case 'snacks': return <Sunset size={20} />;
      case 'dinner': return <Moon size={20} />;
      default: return <UtensilsCrossed size={20} />;
    }
  };
  const getMealColor = (meal) => {
    switch (meal.toLowerCase()) {
      case 'breakfast': return '#f59e0b';
      case 'lunch': return '#f97316';
      case 'snacks': return '#8b5cf6';
      case 'dinner': return '#6366f1';
      default: return '#6366f1';
    }
  };

  const handleSkipSubmit = (e) => {
    if (e) e.preventDefault();
    addMessSkip({ date: skipDate, meal: skipMeal, reason: skipReason });
    setSkipDrawerOpen(false);
  };

  const handleFbSubmit = (e) => {
    if (e) e.preventDefault();
    addMessFeedback({ meal: fbMeal, rating: Number(fbRating), comment: fbComment });
    setFeedbackDrawerOpen(false);
    setFbComment('');
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, outline: 'none',
    border: '1.5px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)',
    transition: 'border-color 0.2s',
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '40px 48px' }}>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
            color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '5px 14px',
            borderRadius: 20, marginBottom: 12, border: '1px solid rgba(99,102,241,0.15)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <UtensilsCrossed size={13} /> Hostel Dining & Catering
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.025em' }}>
            Mess & Food Menu
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-tertiary)', margin: 0 }}>
            Check daily 4-course meal schedules, submit meal skip requests for fee rebate, and rate daily food.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setFeedbackDrawerOpen(true)} style={{
            padding: '10px 18px', borderRadius: 10, border: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Star size={15} /> Rate Meal
          </button>
          <button onClick={() => setSkipDrawerOpen(true)} style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
            border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}>
            <Plus size={15} /> Skip Meal (Rebate)
          </button>
        </div>
      </div>

      {/* ─── Notice Banner ─── */}
      <div style={{
        borderRadius: 16, padding: '18px 24px', marginBottom: 24,
        background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Special Sunday Feast Alert 🍛</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Paneer Butter Masala, Gulab Jamun, Veg Pulao & Ice Cream served this Sunday dinner.</div>
          </div>
        </div>
        <div style={{
          fontSize: 12, background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: 20,
          fontWeight: 700, color: '#6366f1', border: '1px solid rgba(99,102,241,0.15)',
        }}>
          Mess Timings: 7:30 AM – 10:00 PM
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div style={{ display: 'flex', gap: 6, background: 'var(--bg-secondary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-primary)', marginBottom: 24, width: 'fit-content' }}>
        {[
          { key: 'today', label: `Today's Menu (${today})` },
          { key: 'skips', label: `My Meal Skips (${mySkips.length})` },
          { key: 'feedback', label: `My Ratings (${myFeedback.length})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '8px 20px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: activeTab === tab.key ? 'var(--accent-500)' : 'transparent',
            color: activeTab === tab.key ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* ─── Tab: Today's Menu ─── */}
      {activeTab === 'today' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {messMenu.map((item) => {
            const mealColor = getMealColor(item.meal);
            return (
              <div key={item.id} style={{
                background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
              >
                {/* Meal header */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${mealColor}, ${mealColor}80)` }} />
                <div style={{ padding: '20px 20px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${mealColor}12`, color: mealColor,
                      }}>
                        {getMealIcon(item.meal)}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{item.meal}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.time}</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                      color: item.available ? '#059669' : '#ef4444',
                      background: item.available ? 'rgba(5,150,105,0.08)' : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${item.available ? 'rgba(5,150,105,0.15)' : 'rgba(239,68,68,0.15)'}`,
                    }}>{item.available ? 'Active' : 'Closed'}</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '0 20px', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(Array.isArray(item.items) ? item.items : String(item.items || '').split(',')).map((food, idx) => (
                      <div key={idx} style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: mealColor, flexShrink: 0 }} />
                        {String(food).trim()}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '14px 20px', marginTop: 16, borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Leaf size={12} /> {item.diet || 'Pure Veg'}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: mealColor }}>Chef: {item.chef || 'Chef Sharma'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Tab: Meal Skips ─── */}
      {activeTab === 'skips' && (
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Meal Skip & Rebate History</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>₹75 credited per skipped lunch/dinner to your monthly mess ledger if requested 6 hrs in advance.</div>
          </div>

          {mySkips.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <UtensilsCrossed size={40} color="var(--text-tertiary)" style={{ opacity: 0.3, marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>No meal skips requested</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Use "Skip Meal" to request a rebate.</div>
            </div>
          ) : mySkips.map((s, i) => (
            <div key={s.id} style={{
              padding: '16px 24px', borderBottom: i < mySkips.length - 1 ? '1px solid var(--border-primary)' : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99,102,241,0.08)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getMealIcon(s.meal)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{s.meal} Skip ({s.date})</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Reason: "{s.reason}"</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>+₹75 Rebate</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, color: '#059669', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)' }}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Tab: Feedback ─── */}
      {activeTab === 'feedback' && (
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-primary)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>My Food Reviews & Feedback</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Directly monitored by the Mess Committee and Student Welfare Warden.</div>
          </div>

          {myFeedback.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <Star size={40} color="var(--text-tertiary)" style={{ opacity: 0.3, marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>No ratings submitted yet</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Use "Rate Meal" to share your feedback.</div>
            </div>
          ) : myFeedback.map((fb, i) => (
            <div key={fb.id} style={{
              padding: '18px 24px', borderBottom: i < myFeedback.length - 1 ? '1px solid var(--border-primary)' : 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{fb.meal} Feedback ({fb.date})</div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star key={st} size={15} fill={st <= fb.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>"{fb.comment}"</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Skip Meal Drawer ─── */}
      {skipDrawerOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 998 }} onClick={() => setSkipDrawerOpen(false)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--bg-secondary)', zIndex: 999,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid var(--border-primary)',
          }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <UtensilsCrossed size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>Skip Meal for Rebate</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>₹75 credited per skipped lunch/dinner.</p>
                </div>
              </div>
              <button onClick={() => setSkipDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
              <form onSubmit={handleSkipSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Date <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="date" value={skipDate} onChange={e => setSkipDate(e.target.value)} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Meal to Skip <span style={{ color: '#ef4444' }}>*</span></label>
                  <select value={skipMeal} onChange={e => setSkipMeal(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option>Breakfast</option><option>Lunch</option><option>Snacks</option><option>Dinner</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Reason <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" value={skipReason} onChange={e => setSkipReason(e.target.value)} style={inputStyle} required />
                </div>
              </form>
            </div>
            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: 12 }}>
              <button onClick={() => setSkipDrawerOpen(false)} style={{ flex: 1, padding: 13, borderRadius: 12, border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSkipSubmit} style={{ flex: 2, padding: 13, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
                <CheckCircle2 size={16} /> Confirm Skip
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Feedback Drawer ─── */}
      {feedbackDrawerOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 998 }} onClick={() => setFeedbackDrawerOpen(false)} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--bg-secondary)', zIndex: 999,
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid var(--border-primary)',
          }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Star size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>Rate Today's Meal</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>Your feedback helps improve food quality.</p>
                </div>
              </div>
              <button onClick={() => setFeedbackDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
              <form onSubmit={handleFbSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Meal <span style={{ color: '#ef4444' }}>*</span></label>
                  <select value={fbMeal} onChange={e => setFbMeal(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option>Breakfast</option><option>Lunch</option><option>Snacks</option><option>Dinner</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Rating <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setFbRating(star)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                        transform: star <= fbRating ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.15s',
                      }}>
                        <Star size={28} fill={star <= fbRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Comments & Suggestions <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea value={fbComment} onChange={e => setFbComment(e.target.value)} placeholder="Tell the chef what was good or what can be improved..."
                    style={{ ...inputStyle, minHeight: 80, resize: 'none' }} required />
                  <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{fbComment.length}/300</div>
                </div>
              </form>
            </div>
            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: 12 }}>
              <button onClick={() => setFeedbackDrawerOpen(false)} style={{ flex: 1, padding: 13, borderRadius: 12, border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleFbSubmit} style={{ flex: 2, padding: 13, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
                <Star size={16} /> Submit Rating
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
