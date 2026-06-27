import { Users, Activity, TrendingUp, Clock } from 'lucide-react';

interface AnalyticsMetricsProps {
  S: number;
  I: number;
  R: number;
  N: number;
  R0: number;
  peakInfection: number;
  peakTime: number;
  trafficDegradation?: number;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function AnalyticsMetrics({
  S,
  I,
  R,
  N,
  R0,
  peakInfection,
  peakTime,
  trafficDegradation = 0,
}: AnalyticsMetricsProps) {
  const trafficPct = Math.max(0, Math.round((1 - trafficDegradation) * 100));

  return (
    <div className="panel" style={{ flexShrink: 0 }}>
      <div className="panel-header">
        <span>Analytics</span>
        <span style={{ fontSize: 8, fontWeight: 400, color: 'var(--text-muted)' }}>Métricas Globales</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 5 }}>
        <div className="mc-s">
          <div style={{ fontSize: 8, color: 'rgba(34,197,94,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Susceptibles
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#22C55E', fontFamily: 'monospace', lineHeight: 1 }}>
            {Math.round(S).toLocaleString()}
          </div>
          <div style={{ fontSize: 8, color: 'rgba(34,197,94,0.55)' }}>
            {((S / N) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="mc-i">
          <div style={{ fontSize: 8, color: 'rgba(239,68,68,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Infectados
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#EF4444', fontFamily: 'monospace', lineHeight: 1 }}>
            {Math.round(I).toLocaleString()}
          </div>
          <div style={{ fontSize: 8, color: 'rgba(239,68,68,0.55)' }}>
            {((I / N) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="mc-r">
          <div style={{ fontSize: 8, color: 'rgba(59,130,246,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recuperados
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#3B82F6', fontFamily: 'monospace', lineHeight: 1 }}>
            {Math.round(R).toLocaleString()}
          </div>
          <div style={{ fontSize: 8, color: 'rgba(59,130,246,0.55)' }}>
            {((R / N) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
        <div className="mc-r0">
          <Activity size={16} color="#8B5CF6" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 8, color: 'rgba(139,92,246,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              R₀
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#8B5CF6', fontFamily: 'monospace', lineHeight: 1 }}>
              {R0.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mc-pk">
          <TrendingUp size={16} color="#F97316" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 8, color: 'rgba(249,115,22,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pico Inf.
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#F97316', fontFamily: 'monospace', lineHeight: 1 }}>
              {(peakInfection * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="mc-tm">
          <Clock size={16} color="#00D4FF" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 8, color: 'rgba(0,212,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {trafficDegradation > 0.5 ? 'Tráfico' : 'T. Pico'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: trafficDegradation > 0.5 ? '#F97316' : '#00D4FF', fontFamily: 'monospace', lineHeight: 1 }}>
              {trafficDegradation > 0.5 ? `${trafficPct}%` : formatTime(peakTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}