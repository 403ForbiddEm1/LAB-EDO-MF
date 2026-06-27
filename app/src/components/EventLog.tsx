import { useRef, useEffect } from 'react';
import type { LogEntry } from '../hooks/useSimulation';

interface EventLogProps {
  logs: LogEntry[];
}

const TYPE_META: Record<string, { color: string; dot: string }> = {
  infection:  { color: '#EF4444', dot: '●' },
  dead:       { color: '#6B0000', dot: '☠' },
  collapse:   { color: '#FF0000', dot: '💀' },
  trojan:     { color: '#F97316', dot: '🐴' },
  scan:       { color: '#00D4FF', dot: '🔍' },
  mitigation: { color: '#EAB308', dot: '🛡' },
  warning:    { color: '#EAB308', dot: '⚠' },
  recovery:   { color: '#22C55E', dot: '●' },
  backup:     { color: '#8B5CF6', dot: '💾' },
  info:       { color: '#3B82F6', dot: '●' },
};

export default function EventLog({ logs }: EventLogProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = 0; // newest on top
  }, [logs]);

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 10px',
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Registro de Eventos
        </span>
        <span style={{ fontSize: 8, color: 'rgba(100,116,139,0.5)', background: 'rgba(30,50,90,0.3)', padding: '1px 5px', borderRadius: 3 }}>
          {logs.length}
        </span>
      </div>

      <div ref={listRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 0' }}>
        {logs.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 10, color: 'rgba(100,116,139,0.3)' }}>
            Sin eventos
          </div>
        ) : (
          logs.map((log, i) => {
            const meta = TYPE_META[log.type] ?? TYPE_META.info;
            return (
              <div key={log.id ?? i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 6,
                padding: '3px 10px',
                borderBottom: '1px solid rgba(20,35,60,0.4)',
                background: i === 0 ? 'rgba(30,50,90,0.18)' : 'transparent',
              }}>
                <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(100,116,139,0.55)', flexShrink: 0, marginTop: 2, minWidth: 28 }}>
                  {typeof log.timestamp === 'number' ? `${log.timestamp.toFixed(1)}s` : ''}
                </span>
                <span style={{ fontSize: 9, flexShrink: 0, marginTop: 1 }}>
                  {meta.dot}
                </span>
                <span style={{ fontSize: 9, color: meta.color, lineHeight: 1.4, flex: 1 }}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}