import { GitBranch, Settings, Zap } from 'lucide-react';

interface FooterProps {
  version: string;
  model: string;
  solver: string;
  dt: number;
  precision: string;
}

export default function Footer({ version, model, solver, dt, precision }: FooterProps) {
  return (
    <footer style={{
      height: 36,
      background: 'var(--bg-footer)',
      borderTop: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 20,
      flexShrink: 0,
    }}>
      {/* Version */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-accent)' }}>LAB-EDO</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>v{version}</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>| Laboratorio de Ciberseguridad & Ecuaciones Diferenciales</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Active params */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <GitBranch size={12} color="var(--text-muted)" />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Modelo: <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{model}</span></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Settings size={12} color="var(--text-muted)" />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Solver: <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{solver.toUpperCase()}</span></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Zap size={12} color="var(--text-muted)" />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Paso de tiempo: <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{dt}</span></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Precisión: <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{precision}</span></span>
        </div>
      </div>

      <div style={{ width: 1, height: 16, background: 'var(--border-default)' }} />

      {/* Copyright */}
      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>© 2026 LAB-EDO TEAM</span>
    </footer>
  );
}
