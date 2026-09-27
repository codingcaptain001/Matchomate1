import { AlertTriangle, Users, BedDouble, Wrench, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  AlertTriangle, Users, BedDouble, Wrench,
};

const severityConfig = {
  high: { bg: 'var(--danger-50)', border: 'rgba(239, 68, 68, 0.15)', dot: 'var(--danger-500)', label: 'HIGH PRIORITY' },
  medium: { bg: 'var(--warning-50)', border: 'rgba(245, 158, 11, 0.15)', dot: 'var(--warning-500)', label: 'MEDIUM' },
  low: { bg: 'var(--accent-50)', border: 'rgba(99, 102, 241, 0.12)', dot: 'var(--accent-500)', label: 'LOW' },
};

export default function AIInsightCard({ item }) {
  const navigate = useNavigate();
  const config = severityConfig[item.severity] || severityConfig.medium;
  const Icon = iconMap[item.icon] || AlertTriangle;
  const routes = {
    complaint: '/admin/complaints',
    roommate: '/admin/ai-matching',
    occupancy: '/admin/smart-allocation',
    maintenance: '/admin/maintenance',
  };

  return (
    <div className="ai-insight-card">
      <div className="ai-insight-card__header">
        <div className="ai-insight-card__severity">
          <span className="ai-insight-card__dot" style={{ background: config.dot }} />
          <span className="ai-insight-card__severity-label">{config.label}</span>
        </div>
        <span className="ai-insight-card__type badge badge--ai">{item.type}</span>
      </div>

      <h4 className="ai-insight-card__title">{item.title}</h4>
      <p className="ai-insight-card__desc">{item.description}</p>

      <div className="ai-insight-card__recommendation">
        <span className="ai-insight-card__rec-label">Recommended action:</span>
        <span className="ai-insight-card__rec-text">{item.recommendation}</span>
      </div>

      <button type="button" className="btn btn--secondary btn--sm ai-insight-card__cta" onClick={() => navigate(routes[item.type] || '/admin/analytics')}>
        {item.cta}
        <ArrowRight size={14} />
      </button>

      <style>{`
        .ai-insight-card {
          padding: var(--space-5);
          border: 1px solid rgba(99, 102, 241, 0.12);
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--bg-secondary), rgba(99, 102, 241, 0.02));
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          transition: all var(--transition-base);
          animation: fadeInUp 400ms ease both;
        }
        .ai-insight-card:hover {
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.06);
        }
        .ai-insight-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ai-insight-card__severity {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .ai-insight-card__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ai-insight-card__severity-label {
          font-size: var(--font-xs);
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
        }
        .ai-insight-card__title {
          font-size: var(--font-base);
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }
        .ai-insight-card__desc {
          font-size: var(--font-sm);
          color: var(--text-tertiary);
          line-height: 1.5;
        }
        .ai-insight-card__recommendation {
          padding: var(--space-3);
          background: var(--accent-50);
          border-radius: var(--radius-md);
          font-size: var(--font-sm);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ai-insight-card__rec-label {
          font-weight: 500;
          color: var(--accent-700);
          font-size: var(--font-xs);
        }
        .ai-insight-card__rec-text {
          color: var(--accent-800);
        }
        .ai-insight-card__cta {
          align-self: flex-start;
          margin-top: var(--space-1);
        }
      `}</style>
    </div>
  );
}
