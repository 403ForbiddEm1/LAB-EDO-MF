import { Plus, Minus } from 'lucide-react';

interface SimulationParamsProps {
  N: number;
  I0: number;
  beta: number;
  gamma: number;
  dt: number;
  solver: 'euler' | 'rk4';
  onUpdate: (param: string, value: string | number) => void;
  onSolverChange: (solver: 'euler' | 'rk4') => void;
}

export default function SimulationParams({ N, I0, beta, gamma, dt, solver, onUpdate, onSolverChange }: SimulationParamsProps) {
  const params: Array<{ key: string; label: string; value: number; min: number; max: number; step: number; accent?: string }> = [
    { key: 'N', label: 'Población', value: N, min: 50, max: 10000, step: 50 },
    { key: 'I0', label: 'Infectados', value: I0, min: 1, max: 500, step: 1 },
    { key: 'beta', label: 'Infección (β)', value: beta, min: 0.1, max: 5.0, step: 0.1, accent: '#EF4444' },
    { key: 'gamma', label: 'Recup. (γ)', value: gamma, min: 0.05, max: 2.0, step: 0.05, accent: '#22C55E' },
    { key: 'dt', label: 'Δt (Paso)', value: dt, min: 0.01, max: 1.0, step: 0.01, accent: '#EAB308' },
  ];

  const handleAdjust = (key: string, currentValue: number, step: number, min: number, max: number, direction: 1 | -1) => {
    let newValue = currentValue + (step * direction);
    newValue = Math.max(min, Math.min(max, newValue));
    onUpdate(key, newValue);
  };

  return (
    <div className="panel" style={{ flexShrink: 0, padding: '12px 16px' }}>
      <div className="panel-header" style={{ marginBottom: '8px', paddingBottom: '8px' }}>
        <span>Parámetros</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onSolverChange('euler')}
            className={solver === 'euler' ? 'btn-active' : 'btn-secondary'}
            style={{ padding: '2px 8px', fontSize: 10 }}
          >
            EULER
          </button>
          <button
            onClick={() => onSolverChange('rk4')}
            className={solver === 'rk4' ? 'btn-active' : 'btn-secondary'}
            style={{ padding: '2px 8px', fontSize: 10 }}
          >
            RK4
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
        {params.map(p => (
          <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '6px', flex: '1 1 calc(20% - 16px)', minWidth: '130px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{p.label}</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: p.accent || 'var(--text-primary)' }}>
                {p.value.toFixed(p.step < 1 ? 2 : 0)}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button 
                onClick={() => handleAdjust(p.key, p.value, p.step, p.min, p.max, 1)}
                style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
              >
                <Plus size={10} />
              </button>
              <button 
                onClick={() => handleAdjust(p.key, p.value, p.step, p.min, p.max, -1)}
                style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
              >
                <Minus size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
