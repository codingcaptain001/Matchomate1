import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { experienceData } from '../data/mockData';
import { Shield, Sparkles, TrendingUp, Users, HeartPulse, Building2, Utensils, MessageSquare } from 'lucide-react';

const icons = {
  Roommate: Users,
  Maintenance: Shield,
  Cleanliness: Sparkles,
  Food: Utensils,
  Security: Shield,
  Communication: MessageSquare,
};

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--gray-900)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 'var(--font-sm)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: 'var(--gray-300)', display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || 'var(--accent-500)' }} />
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  return (
    <div className="page-content">
      <div className="page-header animate-stagger" style={{ animation: 'fadeInUp 400ms ease' }}>
        <div>
          <h1 className="page-header__greeting">Student Experience Analytics</h1>
          <p className="page-header__subtitle">Holistic view of student satisfaction and hostel health.</p>
        </div>
      </div>

      {/* Hero KPI */}
      <section className="section animate-stagger">
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--accent-50))', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <HeartPulse size={24} style={{ color: 'var(--accent-600)' }} />
                <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, color: 'var(--text-secondary)' }}>Overall Experience Score</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-700)', letterSpacing: '-0.02em' }}>
                  {experienceData.overall}
                </span>
                <span style={{ fontSize: 'var(--font-lg)', color: 'var(--text-tertiary)' }}>/ 100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: 'var(--success-600)', fontSize: 'var(--font-sm)', fontWeight: 500 }}>
                <TrendingUp size={16} />
                +2.4 points from last month
              </div>
            </div>
            
            <div style={{ flex: 1, minWidth: 280, maxWidth: 500 }}>
              <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>Score Trend (6 Months)</h3>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={experienceData.trend}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-500)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--accent-500)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="score" stroke="var(--accent-600)" fill="url(#scoreGrad)" strokeWidth={3} name="Score" activeDot={{ r: 6, fill: 'var(--accent-600)', stroke: 'white', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                {experienceData.trend.map((t, i) => (
                  <span key={i} style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)' }}>{t.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section animate-stagger" style={{ animationDelay: '100ms' }}>
        <div className="grid-2col">
          {/* Breakdown */}
          <div className="card">
            <div className="section__header" style={{ marginBottom: 'var(--space-6)' }}>
              <h3 className="section__title">Category Breakdown</h3>
              <p className="section__subtitle">Key areas affecting overall satisfaction</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {experienceData.breakdown.map((item) => {
                const Icon = icons[item.label] || Sparkles;
                return (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--font-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        <Icon size={16} style={{ color: 'var(--text-tertiary)' }} />
                        {item.label}
                      </div>
                      <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{ 
                        width: `${item.value}%`, 
                        background: item.value >= 85 ? 'var(--success-500)' : item.value >= 75 ? 'var(--warning-500)' : 'var(--danger-500)' 
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Block Comparison */}
          <div className="card">
            <div className="section__header" style={{ marginBottom: 'var(--space-6)' }}>
              <h3 className="section__title">Block Comparison</h3>
              <p className="section__subtitle">Experience score variance by building</p>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={experienceData.blockComparison} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-secondary)" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="block" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-secondary)', fontWeight: 500 }} />
                  <Tooltip cursor={{ fill: 'var(--gray-50)' }} content={<CustomTooltip />} />
                  <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]} barSize={32}>
                    {
                      experienceData.blockComparison.map((entry, index) => (
                        <cell key={`cell-${index}`} fill={entry.score >= 85 ? '#4f46e5' : entry.score >= 80 ? '#6366f1' : '#a5b4fc'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* AI Insight */}
      <section className="section animate-stagger" style={{ animationDelay: '200ms' }}>
        <div className="card card--ai">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <div style={{ padding: 12, background: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <Sparkles size={24} style={{ color: 'var(--accent-600)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>AI Insight</h3>
              <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}>
                Overall satisfaction is trending positively. However, <strong>Block C</strong> is significantly pulling down the average (78/100). 
                The category breakdown reveals that <strong>Maintenance</strong> is the lowest performing area across all blocks. 
                Focusing on maintenance response times in Block C is highly recommended to improve overall experience.
              </p>
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
                <button className="btn btn--primary btn--sm">View Block C Maintenance</button>
                <button className="btn btn--secondary btn--sm">Generate Full Report</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
