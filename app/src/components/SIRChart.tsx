import { useRef, useEffect } from 'react';

interface SIRChartProps {
  history: { t: number; S: number; I: number; R: number }[];
  N: number;
}

export default function SIRChart({ history, N }: SIRChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width  = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const pad = { top: 28, right: 16, bottom: 32, left: 36 };
      const cW = w - pad.left - pad.right;
      const cH = h - pad.top - pad.bottom;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0A1020';
      ctx.fillRect(0, 0, w, h);

      const legendItems = [
        { label: 'S', color: '#3B82F6' },
        { label: 'I', color: '#EF4444' },
        { label: 'R', color: '#22C55E' },
      ];
      let lx = pad.left + 8;
      const ly = 10;
      legendItems.forEach(item => {
        ctx.save();
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 4;
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(lx, ly + 3);
        ctx.lineTo(lx + 18, ly + 3);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = 'rgba(148,163,184,0.8)';
        ctx.font = '700 10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`— ${item.label}`, lx, ly + 7);
        lx += 48;
      });

      if (history.length < 2) {
        ctx.fillStyle = 'rgba(100,116,139,0.35)';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Inicie la simulación para ver las curvas SIR', w / 2, h / 2 + 10);
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // ─── ESCALA DINÁMICA: empieza en 50 y crece ──────────────────
      const lastT = history[history.length - 1].t;
      const maxT = Math.max(50, Math.ceil(lastT / 10) * 10 + 10);
      const maxY = N;

      const gridLines = 4;
      for (let i = 0; i <= gridLines; i++) {
        const y = pad.top + (cH / gridLines) * i;
        ctx.strokeStyle = 'rgba(30,50,90,0.6)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
        ctx.setLineDash([]);

        const pct = Math.round(100 - (100 / gridLines) * i);
        ctx.fillStyle = 'rgba(100,116,139,0.55)';
        ctx.font = '8px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${pct}%`, pad.left - 5, y);
      }

      // X axis labels - cada 10 unidades
      const xTickInterval = maxT <= 100 ? 10 : maxT <= 300 ? 20 : 50;
      const xTicks = Math.floor(maxT / xTickInterval);
      for (let i = 0; i <= xTicks; i++) {
        const x = pad.left + (cW / maxT) * (i * xTickInterval);
        const tVal = i * xTickInterval;
        ctx.fillStyle = 'rgba(100,116,139,0.55)';
        ctx.font = '8px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(String(tVal), x, h - pad.bottom + 5);
      }

      ctx.fillStyle = 'rgba(100,116,139,0.4)';
      ctx.font = '8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('Tiempo (s)', w / 2, h - 2);

      const drawCurve = (key: 'S' | 'I' | 'R', color: string, glowColor: string) => {
        ctx.beginPath();
        history.forEach((pt, i) => {
          const x = pad.left + (pt.t / maxT) * cW;
          const y = pad.top  + (1 - pt[key] / maxY) * cH;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        const lastPt = history[history.length - 1];
        ctx.lineTo(pad.left + (lastPt.t / maxT) * cW, pad.top + cH);
        ctx.lineTo(pad.left, pad.top + cH);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + cH);
        grad.addColorStop(0, color + '20');
        grad.addColorStop(1, color + '00');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 6;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        history.forEach((pt, i) => {
          const x = pad.left + (pt.t / maxT) * cW;
          const y = pad.top  + (1 - pt[key] / maxY) * cH;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.restore();
      };

      drawCurve('S', '#3B82F6', '#3B82F6');
      drawCurve('R', '#22C55E', '#22C55E');
      drawCurve('I', '#EF4444', '#EF4444');

      ctx.strokeStyle = 'rgba(40,60,100,0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(pad.left, pad.top, cW, cH);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [history, N]);

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      <div className="panel-header" style={{
        padding: '8px 12px',
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-panel)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          Gráfica de Propagación (SIR)
        </span>
        <span style={{ fontSize: 16, color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1 }}>⋮</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, background: '#0A1020' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}