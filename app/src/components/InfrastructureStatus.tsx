import { useRef, useEffect } from 'react';

interface InfrastructureStatusProps {
  healthScore: number;
  totalNodes: number;
  infectedNodes: number;
  recoveredNodes: number;
  deadNodes?: number;
}

export default function InfrastructureStatus({
  healthScore,
  totalNodes,
  infectedNodes,
  recoveredNodes,
  deadNodes = 0,
}: InfrastructureStatusProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const healthPct = Math.round(Math.max(0, Math.min(100, healthScore)));
  const saneNodes = Math.max(0, totalNodes - infectedNodes - deadNodes);

  const healthColor =
    healthPct >= 80 ? '#22C55E' : healthPct >= 50 ? '#F97316' : '#EF4444';

  const healthLabel =
    healthPct >= 80 ? 'ÓPTIMO' : healthPct >= 50 ? 'DEGRADADO' : 'CRÍTICO';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cx = size / 2,
      cy = size / 2;
    const outerR = size * 0.42;
    const innerR = size * 0.30;

    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(30,50,90,0.5)';
    ctx.lineWidth = outerR - innerR;
    ctx.stroke();

    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (healthPct / 100) * Math.PI * 2;

    ctx.save();
    ctx.shadowColor = healthColor;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, (outerR + innerR) / 2, startAngle, endAngle);
    ctx.strokeStyle = healthColor;
    ctx.lineWidth = outerR - innerR;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = healthColor;
    ctx.font = `bold ${size * 0.18}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${healthPct}%`, cx, cy - size * 0.04);

    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    ctx.font = `600 ${size * 0.09}px Inter, sans-serif`;
    ctx.fillText('SALUD', cx, cy + size * 0.14);
  }, [healthPct, healthColor]);

  return (
    <div className="panel" style={{ flexShrink: 0 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          paddingBottom: 7,
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}
        >
          Estado de la Infraestructura
        </span>
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: healthColor,
            background:
              healthPct >= 80
                ? 'rgba(34,197,94,0.12)'
                : healthPct >= 50
                ? 'rgba(249,115,22,0.12)'
                : 'rgba(239,68,68,0.12)',
            border: `1px solid ${healthColor}40`,
            padding: '2px 8px',
            borderRadius: 4,
            letterSpacing: '0.06em',
          }}
        >
          ● {healthLabel}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flexShrink: 0 }}>
          <canvas ref={canvasRef} width={90} height={90} style={{ display: 'block' }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 9,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Total Nodos
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
              }}
            >
              {totalNodes.toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 9,
                color: 'rgba(239,68,68,0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Infectados
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#EF4444',
                fontFamily: 'monospace',
              }}
            >
              {Math.round(infectedNodes).toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 9,
                color: 'rgba(34,197,94,0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Sanos/Recup.
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#22C55E',
                fontFamily: 'monospace',
              }}
            >
              {Math.round(saneNodes + recoveredNodes).toLocaleString()}
            </span>
          </div>

          {deadNodes > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 9,
                  color: 'rgba(100,100,100,0.7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                💀 Muertos
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#666',
                  fontFamily: 'monospace',
                }}
              >
                {deadNodes}
              </span>
            </div>
          )}

          <div style={{ marginTop: 2 }}>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: 'rgba(30,50,90,0.6)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${healthPct}%`,
                  background: healthColor,
                  borderRadius: 2,
                  boxShadow: `0 0 6px ${healthColor}`,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}