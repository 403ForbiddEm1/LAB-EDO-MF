interface MathAnalysisProps {
  S: number;
  I: number;
  R: number;
  N: number;
  beta: number;
  gamma: number;
  R0: number;
  solver: 'euler' | 'rk4';
}

export default function MathAnalysis({ S, I, R, N, beta, gamma, R0, solver }: MathAnalysisProps) {
  const dSdt = -((beta * S * I) / N);
  const dIdt = (beta * S * I) / N - gamma * I;
  const dRdt = gamma * I;

  const fmt = (v: number) => {
    const s = v.toFixed(3);
    return v >= 0 ? `+${s}` : s;
  };

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8, paddingBottom: 6,
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          Análisis Matemático
          <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--text-muted)', fontWeight: 400 }}>(SIR)</span>
        </span>
        <div style={{ display: 'flex', gap: 3 }}>
          {(['euler', 'rk4'] as const).map(s => (
            <span key={s} style={{
              fontSize: 8, fontWeight: 700, letterSpacing: '0.06em',
              padding: '2px 8px', borderRadius: 3,
              background: solver === s ? 'var(--accent-blue)' : 'var(--bg-card)',
              color: solver === s ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${solver === s ? 'var(--accent-blue)' : 'var(--border-default)'}`,
              textTransform: 'uppercase',
            }}>
              {s.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Content - más grande */}
      <div style={{ flex: 1, display: 'flex', gap: 14, minHeight: 0, paddingTop: 6 }}>

        {/* Left — differential equations */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: 8 }}>
          {[
            { lhs: 'dS/dt', result: fmt(dSdt) },
            { lhs: 'dI/dt', result: fmt(dIdt) },
            { lhs: 'dR/dt', result: fmt(dRdt) },
          ].map(({ lhs, result }) => (
            <div key={lhs} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--text-primary)',
                minWidth: 56,
              }}>
                {lhs}
              </span>
              <span style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 300 }}>=</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                fontWeight: 700,
                color: '#EF4444',
                letterSpacing: '-0.01em',
              }}>
                {result}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: 'var(--border-default)', flexShrink: 0 }} />

        {/* Right — current state values */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', minWidth: 85, gap: 6 }}>
          {[
            { label: 'S(t)', value: Math.round(S).toLocaleString(), color: '#3B82F6' },
            { label: 'I(t)', value: Math.round(I).toLocaleString(), color: '#EF4444' },
            { label: 'R(t)', value: Math.round(R).toLocaleString(), color: '#22C55E' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-muted)',
                minWidth: 38,
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 15,
                fontWeight: 700,
                color,
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Footer - R0 */}
      <div style={{
        marginTop: 8,
        paddingTop: 6,
        borderTop: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 10,
          padding: '2px 10px',
          borderRadius: 3,
          background: Number(R0) > 1 ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
          color: Number(R0) > 1 ? '#EF4444' : '#22C55E',
          fontWeight: 700,
          border: `1px solid ${Number(R0) > 1 ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
        }}>
          {Number(R0) > 1 ? '⚠ BROTE ACTIVO' : '✅ CONTROLADO'}
        </span>
        <span style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          fontWeight: 500,
        }}>
          R₀ = {R0.toFixed(2)}
        </span>
        <span style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          marginLeft: 'auto',
        }}>
          β = {beta.toFixed(2)} &nbsp;·&nbsp; γ = {gamma.toFixed(2)}
        </span>
      </div>
    </div>
  );
}