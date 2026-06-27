import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getMalwareById } from '../data/malwares';
import { getInfrastructureById } from '../data/infrastructures';

interface SelectedSummaryProps {
  malwareId: string;
  infrastructureId: string;
  beta: number;
  gamma: number;
  isRunning: boolean;
}

export default function SelectedSummary({ malwareId, infrastructureId, beta, gamma, isRunning }: SelectedSummaryProps) {
  const malware = getMalwareById(malwareId);
  const infra = getInfrastructureById(infrastructureId);

  const r0 = (beta / gamma).toFixed(1);

  // SIEMPRE muestra la información, solo cambia el estado de "simulación activa"
  return (
    <div className="panel" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span>Resumen de Contexto</span>
        {isRunning && (
          <span style={{ fontSize: 8, color: 'var(--accent-green)', fontWeight: 700 }}>
            ● SIMULACIÓN ACTIVA
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', paddingRight: 4, flex: 1 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{malware.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{malware.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{malware.desc}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>β: <span className="mono">{beta}</span></span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>γ: <span className="mono">{gamma}</span></span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>R₀: <span className="mono" style={{ color: Number(r0) > 1 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{r0}</span></span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Infectividad: {'⭐'.repeat(malware.infectivity)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{infra.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{infra.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{infra.desc}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>N: <span className="mono">{infra.nodeCount}</span></span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Complejidad: <span style={{ color: 'var(--accent-yellow)' }}>{infra.complexity}%</span></span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Seguridad: <span style={{ color: infra.securityLevel >= 70 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>{infra.securityLevel}%</span></span>
            </div>
          </div>
        </div>

        <div style={{ padding: '8px 10px', background: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border-default)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>MITIGACIONES RECOMENDADAS</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {malware.recommendedMitigations.map((m: string) => (
              <span key={m} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green)', fontWeight: 600, textTransform: 'uppercase' }}>
                {m}
              </span>
            ))}
          </div>
          {malware.harmfulMitigations.length > 0 && (
            <>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, marginBottom: 4 }}>EVITAR EN INTERACTIVO</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {malware.harmfulMitigations.map((m: string) => (
                  <span key={m} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {m}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldAlert size={14} color="var(--accent-red)" />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Threat Match</span>
            </div>
            <div style={{ width: '40%', height: 4, background: 'var(--bg-input)', borderRadius: 2 }}>
              <div style={{ width: '60%', height: '100%', background: 'var(--accent-yellow)', borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={14} color="var(--accent-green)" />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Readiness</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: infra.securityLevel >= 70 ? 'var(--accent-green)' : infra.securityLevel >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
              {infra.securityLevel >= 70 ? 'LISTO' : infra.securityLevel >= 50 ? 'PARCIAL' : 'BAJO'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}