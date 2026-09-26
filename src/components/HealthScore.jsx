import { useEffect, useState } from 'react';

export default function HealthScore({ score, breakdown }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (val) => {
    if (val >= 85) return 'var(--success-500)';
    if (val >= 70) return 'var(--accent-500)';
    if (val >= 50) return 'var(--warning-500)';
    return 'var(--danger-500)';
  };

  const getLabel = (val) => {
    if (val >= 85) return 'Excellent';
    if (val >= 70) return 'Good';
    if (val >= 50) return 'Fair';
    return 'Needs attention';
  };

  return (
    <div className="health-score">
      <div className="health-score__visual">
        <svg width="175" height="175" viewBox="0 0 175 175">
          <circle
            cx="87.5" cy="87.5" r={radius}
            fill="none"
            stroke="var(--gray-100)"
            strokeWidth="9"
          />
          <circle
            cx="87.5" cy="87.5" r={radius}
            fill="none"
            stroke={getColor(animatedScore)}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 87.5 87.5)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
        </svg>
        <div className="health-score__center">
          <span className="health-score__number">{animatedScore}</span>
          <span className="health-score__label">{getLabel(animatedScore)}</span>
        </div>
      </div>

      <div className="health-score__breakdown">
        {breakdown.map((item) => (
          <div key={item.label} className="health-score__item">
            <div className="health-score__item-header">
              <span className="health-score__item-label">{item.label}</span>
              <span className="health-score__item-value" style={{ color: getColor(item.value) }}>{item.value}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar__fill"
                style={{
                  width: `${item.value}%`,
                  background: item.color || getColor(item.value),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .health-score {
          display: flex;
          align-items: center;
          gap: var(--space-8);
        }
        .health-score__visual {
          position: relative;
          flex-shrink: 0;
        }
        .health-score__center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .health-score__number {
          font-size: var(--font-4xl);
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .health-score__label {
          font-size: var(--font-xs);
          color: var(--text-tertiary);
          font-weight: 500;
          margin-top: 4px;
        }
        .health-score__breakdown {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .health-score__item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .health-score__item-label {
          font-size: var(--font-sm);
          color: var(--text-secondary);
          font-weight: 500;
        }
        .health-score__item-value {
          font-size: var(--font-sm);
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
        @media (max-width: 600px) {
          .health-score {
            flex-direction: column;
            align-items: stretch;
          }
          .health-score__visual {
            align-self: center;
          }
        }
      `}</style>
    </div>
  );
}
