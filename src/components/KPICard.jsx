import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ label, value, suffix, change, changePeriod, icon: Icon, format }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);

  // Count-up animation
  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 900;
    const startTime = performance.now();
    const isDecimal = numValue % 1 !== 0;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (numValue - start) * eased;
      setDisplayValue(isDecimal ? current.toFixed(1) : Math.round(current));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }, [value]);

  const isPositive = change > 0;
  const isNeutral = change === 0;
  const changeColor = isPositive
    ? 'var(--success-600)'
    : change < 0
      ? 'var(--danger-600)'
      : 'var(--text-tertiary)';

  const changeBg = isPositive
    ? 'var(--success-50)'
    : change < 0
      ? 'var(--danger-50)'
      : 'var(--gray-50)';

  return (
    <div className="card card--flat kpi-card" ref={ref}>
      <div className="kpi-card__header">
        <span className="kpi-card__label">{label}</span>
        {Icon && (
          <span className="kpi-card__icon">
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className="kpi-card__value">
        {displayValue}{suffix}
      </div>
      {change !== undefined && (
        <div className="kpi-card__change" style={{ color: changeColor, background: changeBg }}>
          {isPositive ? <TrendingUp size={12} /> : change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          <span>{isPositive ? '+' : ''}{change}%</span>
          {changePeriod && <span className="kpi-card__period">{changePeriod}</span>}
        </div>
      )}

      <style>{`
        .kpi-card {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          transition: all var(--transition-base);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
        }
        .kpi-card:hover {
          border-color: var(--gray-300);
          box-shadow: var(--shadow-md);
        }
        .kpi-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .kpi-card__label {
          font-size: var(--font-sm);
          font-weight: 500;
          color: var(--text-tertiary);
          letter-spacing: -0.005em;
        }
        .kpi-card__icon {
          color: var(--text-quaternary);
          opacity: 0.7;
        }
        .kpi-card__value {
          font-size: var(--font-3xl);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.03em;
          line-height: 1.1;
          animation: countUp 500ms ease;
        }
        .kpi-card__change {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--font-xs);
          font-weight: 500;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          width: fit-content;
        }
        .kpi-card__period {
          color: var(--text-quaternary);
          font-weight: 400;
          margin-left: 2px;
        }
      `}</style>
    </div>
  );
}
