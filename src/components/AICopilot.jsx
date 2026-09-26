import { useState } from 'react';
import { Sparkles, ArrowRight, MessageSquare, BarChart3, AlertTriangle, FileText, X } from 'lucide-react';

const suggestions = [
  { text: 'What needs my attention today?', icon: AlertTriangle },
  { text: 'Which block has the most complaints?', icon: MessageSquare },
  { text: 'Show high conflict risk rooms', icon: AlertTriangle },
  { text: 'Why did satisfaction decrease?', icon: BarChart3 },
  { text: "Generate this month's report", icon: FileText },
];

export default function AICopilot({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="command-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette__input-wrapper">
          <Sparkles size={18} style={{ color: 'var(--accent-500)', flexShrink: 0 }} />
          <input
            className="command-palette__input"
            placeholder="Ask anything about your hostel..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} style={{ color: 'var(--text-quaternary)', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <div className="command-palette__body">
          {!query && (
            <>
              <div style={{
                padding: '8px 12px',
                fontSize: 'var(--font-xs)',
                fontWeight: 600,
                color: 'var(--text-quaternary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Suggestions
              </div>
              {suggestions.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.text}
                    className="command-palette__suggestion"
                    onClick={() => setQuery(s.text)}
                  >
                    <Icon size={16} style={{ color: 'var(--accent-500)', flexShrink: 0 }} />
                    <span>{s.text}</span>
                    <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-quaternary)' }} />
                  </div>
                );
              })}
            </>
          )}
          {query && (
            <div style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: 'var(--font-sm)',
            }}>
              <Sparkles size={28} style={{ color: 'var(--accent-400)', margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 500 }}>AI responses will appear here</p>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-quaternary)', marginTop: 4 }}>
                Connected to MatchoMate AI engine
              </p>
            </div>
          )}
        </div>

        <div className="command-palette__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={12} style={{ color: 'var(--accent-500)' }} />
            <span>Powered by MatchoMate AI</span>
          </div>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
