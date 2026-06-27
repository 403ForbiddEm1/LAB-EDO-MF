import { Play, Pause, Square, RefreshCw, HelpCircle, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  mode: 'simulation' | 'interactive';
  status: 'ready' | 'running' | 'paused' | 'completed' | 'backup' | 'collapsed';
  currentTime: number;
  onModeChange: (mode: 'simulation' | 'interactive') => void;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onOpenEncyclopedia: () => void;
  onOpenHelp: () => void;
  isRunning: boolean;
  isPaused: boolean;
  N: number;
  I: number;
  beta: number;
  gamma: number;
  dt: number;
  solver: 'euler' | 'rk4';
  onUpdate: (param: string, value: string | number) => void;
  onSolverChange: (solver: 'euler' | 'rk4') => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function Header({
  mode,
  status,
  currentTime,
  onModeChange,
  onStart,
  onPause,
  onStop,
  onReset,
  onOpenEncyclopedia,
  onOpenHelp,
  isRunning,
  isPaused,
  N,
  I,
  beta,
  gamma,
  dt,
  solver,
  onUpdate,
  onSolverChange,
}: HeaderProps) {
  const [editingParam, setEditingParam] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleParamClick = (key: string, value: number) => {
    if (isRunning) return;
    setEditingParam(key);
    setEditValue(String(value));
  };

  const handleParamSave = (key: string) => {
    const num = parseFloat(editValue);
    if (!isNaN(num)) {
      onUpdate(key, num);
    }
    setEditingParam(null);
  };

  const handleParamKeyDown = (e: React.KeyboardEvent, key: string) => {
    if (e.key === 'Enter') {
      handleParamSave(key);
    } else if (e.key === 'Escape') {
      setEditingParam(null);
    }
  };

  const handleAdjust = (key: string, currentValue: number, step: number, min: number, max: number, direction: 1 | -1) => {
    if (isRunning) return;
    let newValue = currentValue + (step * direction);
    newValue = Math.max(min, Math.min(max, newValue));
    onUpdate(key, newValue);
  };

  const paramConfigs = [
    { key: 'N', label: 'Población', value: N, color: 'var(--text-primary)', step: 50, min: 50, max: 10000, decimals: 0 },
    { key: 'I', label: 'Infectados', value: I, color: 'var(--accent-red)', step: 1, min: 1, max: 500, decimals: 0 },
    { key: 'beta', label: 'β', value: beta, color: 'var(--accent-red)', step: 0.1, min: 0.1, max: 5.0, decimals: 2 },
    { key: 'gamma', label: 'γ', value: gamma, color: 'var(--accent-green)', step: 0.05, min: 0.05, max: 2.0, decimals: 2 },
    { key: 'dt', label: 'Δt', value: dt, color: 'var(--text-primary)', step: 0.01, min: 0.01, max: 1.0, decimals: 2 },
  ];

  const getStatusLabel = () => {
    if (status === 'collapsed') return '💀 COLAPSADO';
    if (status === 'backup') return '💾 Backup en progreso...';
    if (status === 'running') return 'Simulación activa';
    if (status === 'paused') return 'Pausada';
    if (status === 'completed') return 'Completada';
    return 'Listo';
  };

  const getStatusColor = () => {
    if (status === 'collapsed') return 'var(--accent-red)';
    if (status === 'backup') return 'var(--accent-yellow)';
    if (status === 'running') return 'var(--accent-green)';
    if (status === 'paused') return 'var(--accent-yellow)';
    if (status === 'completed') return 'var(--accent-blue)';
    return 'var(--text-muted)';
  };

  return (
    <header style={{
      height: 52,
      flexShrink: 0,
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 14px',
      gap: 10,
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>🛡 LAB-EDO</span>
        <span style={{ fontSize: 7.5, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.2 }}>
          Malware Propagation Simulator
        </span>
      </div>

      <div style={{
        display: 'flex',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 5,
        padding: 2,
        gap: 2,
      }}>
        <button
          onClick={() => onModeChange('simulation')}
          style={{
            padding: '4px 12px',
            borderRadius: 4,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            background: mode === 'simulation' ? 'var(--accent-cyan)' : 'transparent',
            color: mode === 'simulation' ? '#060d1a' : 'var(--text-muted)',
            boxShadow: mode === 'simulation' ? '0 0 8px rgba(0,212,255,0.4)' : 'none',
          }}
        >
          Simulación
        </button>
        <button
          onClick={() => onModeChange('interactive')}
          style={{
            padding: '4px 12px',
            borderRadius: 4,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            background: mode === 'interactive' ? 'var(--accent-cyan)' : 'transparent',
            color: mode === 'interactive' ? '#060d1a' : 'var(--text-muted)',
            boxShadow: mode === 'interactive' ? '0 0 8px rgba(0,212,255,0.4)' : 'none',
          }}
        >
          Interactivo
        </button>
      </div>

      <div className="status-dot" style={{
        width: 8,
        height: 8,
        background: getStatusColor(),
        boxShadow: status === 'running' ? '0 0 8px var(--accent-green)' : status === 'backup' ? '0 0 8px var(--accent-yellow)' : status === 'collapsed' ? '0 0 8px var(--accent-red)' : 'none',
        animation: status === 'running' ? 'pulse-green 2s ease-in-out infinite' : 'none',
      }} />

      <span style={{ fontSize: 9, color: getStatusColor(), fontWeight: status === 'backup' || status === 'collapsed' ? 700 : 400 }}>
        {getStatusLabel()}
      </span>

      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 18,
        fontWeight: 700,
        color: status === 'running' ? 'var(--accent-green)' : status === 'backup' ? 'var(--accent-yellow)' : status === 'collapsed' ? 'var(--accent-red)' : 'var(--text-primary)',
        letterSpacing: '0.08em',
        minWidth: 64,
      }}>
        {formatTime(currentTime)}
      </span>

      {paramConfigs.map((p) => (
        <div key={p.key} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'var(--bg-input)',
          border: editingParam === p.key ? '1px solid var(--accent-cyan)' : '1px solid var(--border-default)',
          borderRadius: 5,
          padding: '3px 8px',
          minWidth: 68,
          cursor: isRunning ? 'default' : 'pointer',
        }}>
          {editingParam === p.key ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleParamSave(p.key)}
              onKeyDown={(e) => handleParamKeyDown(e, p.key)}
              autoFocus
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: p.color,
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                fontWeight: 700,
                width: 50,
                padding: '2px 0',
              }}
            />
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: 7, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  {p.label}
                </span>
                <span
                  onClick={() => handleParamClick(p.key, p.value)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: p.color,
                    lineHeight: 1.2,
                    cursor: isRunning ? 'default' : 'pointer',
                  }}
                >
                  {p.value.toFixed(p.decimals)}
                </span>
              </div>
              {!isRunning && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <button
                    onClick={() => handleAdjust(p.key, p.value, p.step, p.min, p.max, 1)}
                    style={{
                      background: 'var(--bg-hover)',
                      border: 'none',
                      borderRadius: 2,
                      cursor: 'pointer',
                      padding: '1px 3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: 8,
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleAdjust(p.key, p.value, p.step, p.min, p.max, -1)}
                    style={{
                      background: 'var(--bg-hover)',
                      border: 'none',
                      borderRadius: 2,
                      cursor: 'pointer',
                      padding: '1px 3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: 8,
                    }}
                  >
                    −
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      <div style={{
        display: 'flex',
        gap: 2,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 4,
        padding: 2,
      }}>
        {(['euler', 'rk4'] as const).map((s) => (
          <button
            key={s}
            onClick={() => onSolverChange(s)}
            style={{
              padding: '3px 10px',
              borderRadius: 3,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.06em',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: solver === s ? 'var(--accent-blue)' : 'transparent',
              color: solver === s ? '#fff' : 'var(--text-muted)',
              boxShadow: solver === s ? '0 0 6px rgba(59,130,246,0.4)' : 'none',
              textTransform: 'uppercase',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
        {!isRunning && status !== 'completed' && status !== 'backup' && status !== 'collapsed' && (
          <button
            onClick={onStart}
            style={{
              width: 32,
              height: 32,
              borderRadius: 5,
              border: '1px solid var(--accent-green)',
              background: 'var(--accent-green)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(34,197,94,0.4)',
            }}
          >
            <Play size={16} fill="#000" />
          </button>
        )}
        {isRunning && !isPaused && status !== 'backup' && status !== 'collapsed' && (
          <button
            onClick={onPause}
            style={{
              width: 32,
              height: 32,
              borderRadius: 5,
              border: '1px solid rgba(234,179,8,0.4)',
              background: 'rgba(234,179,8,0.12)',
              color: 'var(--accent-yellow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Pause size={16} />
          </button>
        )}
        {isRunning && isPaused && (
          <button
            onClick={onStart}
            style={{
              width: 32,
              height: 32,
              borderRadius: 5,
              border: '1px solid var(--accent-green)',
              background: 'var(--accent-green)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(34,197,94,0.4)',
            }}
          >
            <Play size={16} fill="#000" />
          </button>
        )}
        {(status === 'backup' || status === 'running' || status === 'paused') && (
          <button
            onClick={onStop}
            style={{
              width: 32,
              height: 32,
              borderRadius: 5,
              border: '1px solid rgba(239,68,68,0.4)',
              background: 'rgba(239,68,68,0.12)',
              color: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Square size={16} />
          </button>
        )}
        <button
          onClick={onReset}
          style={{
            width: 32,
            height: 32,
            borderRadius: 5,
            border: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} />
        </button>
        <button
          onClick={onOpenHelp}
          style={{
            width: 32,
            height: 32,
            borderRadius: 5,
            border: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <HelpCircle size={16} />
        </button>
        <button
          onClick={onOpenEncyclopedia}
          style={{
            width: 32,
            height: 32,
            borderRadius: 5,
            border: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <BookOpen size={16} />
        </button>
      </div>
    </header>
  );
}