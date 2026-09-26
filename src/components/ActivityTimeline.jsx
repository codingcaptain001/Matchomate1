import {
  UserPlus, CheckCircle, CheckCircle2, CreditCard,
  ArrowRightLeft, Calendar
} from 'lucide-react';

const iconMap = {
  UserPlus, CheckCircle, CheckCircle2, CreditCard,
  ArrowRightLeft, Calendar,
};

const typeColors = {
  student: 'var(--accent-500)',
  room: 'var(--success-500)',
  complaint: 'var(--warning-500)',
  payment: '#06b6d4',
  leave: 'var(--gray-400)',
};

export default function ActivityTimeline({ items }) {
  return (
    <div className="activity-timeline">
      {items.map((item, idx) => {
        const Icon = iconMap[item.icon] || CheckCircle;
        const color = typeColors[item.type] || 'var(--gray-400)';
        return (
          <div key={item.id} className="activity-timeline__item" style={{ animationDelay: `${idx * 60}ms` }}>
            <div className="activity-timeline__indicator">
              <div
                className="activity-timeline__dot"
                style={{ background: color }}
              >
                <Icon size={12} color="white" />
              </div>
              {idx < items.length - 1 && <div className="activity-timeline__line" />}
            </div>
            <div className="activity-timeline__content">
              <p className="activity-timeline__text">{item.text}</p>
              <span className="activity-timeline__time">{item.time}</span>
            </div>
          </div>
        );
      })}

      <style>{`
        .activity-timeline {
          display: flex;
          flex-direction: column;
        }
        .activity-timeline__item {
          display: flex;
          gap: var(--space-3);
          animation: fadeInUp 400ms ease both;
        }
        .activity-timeline__indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        .activity-timeline__dot {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .activity-timeline__line {
          width: 1.5px;
          flex: 1;
          min-height: 20px;
          background: var(--gray-200);
        }
        .activity-timeline__content {
          padding-bottom: var(--space-5);
          flex: 1;
        }
        .activity-timeline__text {
          font-size: var(--font-sm);
          color: var(--text-primary);
          line-height: 1.5;
          font-weight: 450;
        }
        .activity-timeline__time {
          font-size: var(--font-xs);
          color: var(--text-quaternary);
          margin-top: 2px;
          display: block;
        }
      `}</style>
    </div>
  );
}
