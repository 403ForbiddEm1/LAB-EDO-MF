import { useState } from 'react';
import { infrastructureList } from '../data/infrastructures';

interface InfrastructureLibraryProps {
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function InfrastructureLibrary({ selectedId, onSelect, disabled }: InfrastructureLibraryProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="panel" style={{ flexShrink: 0 }}>
      <div className="panel-header">
        <span>Infraestructura</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
        {infrastructureList.map((infra) => {
          const isSelected = selectedId === infra.id;
          return (
            <div
              key={infra.id}
              role="button"
              tabIndex={0}
              onClick={() => !disabled && onSelect(infra.id)}
              onKeyDown={(e) => e.key === 'Enter' && !disabled && onSelect(infra.id)}
              onMouseEnter={() => setHovered(infra.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 6,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                background: isSelected ? 'var(--bg-selected)' : hovered === infra.id ? 'var(--bg-hover)' : 'transparent',
                borderLeft: isSelected ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{infra.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{infra.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{infra.type} · {infra.nodeCount} nodos</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
