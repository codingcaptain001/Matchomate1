import { useState } from 'react';
import { Brain } from 'lucide-react';
import AIInsightCard from '../components/AIInsightCard';
import { useHostelStore } from '../context/HostelStore';

const filters = ['all', 'high', 'medium', 'low'];

export default function AdminInsightsPage() {
  const { aiAttentionItems } = useHostelStore();
  const [filter, setFilter] = useState('all');
  const visibleItems = aiAttentionItems.filter((item) => filter === 'all' || item.severity === filter);

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain size={24} style={{ color: 'var(--accent-500)' }} />
          <h1 className="page-header__greeting">AI Insights</h1>
        </div>
        <p className="page-header__subtitle">Operational signals and recommended actions from the current demo data.</p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-5)' }} role="group" aria-label="Filter insights by severity">
        {filters.map((level) => (
          <button key={level} type="button" className={`btn btn--sm ${filter === level ? 'btn--primary' : 'btn--secondary'}`} onClick={() => setFilter(level)}>
            {level === 'all' ? 'All' : `${level[0].toUpperCase()}${level.slice(1)} priority`}
          </button>
        ))}
      </div>
      {visibleItems.length ? (
        <div className="grid-2col">
          {visibleItems.map((item) => <AIInsightCard key={item.id} item={item} />)}
        </div>
      ) : <div className="card">No insights match this severity filter.</div>}
    </div>
  );
}