import { Shield, Lock, Wrench, Brain, Database, Search } from 'lucide-react';
import type { MitigationState } from '../hooks/useSimulation';
import type { MitigationKey } from '../types/labedo';
import { getMalwareById } from '../data/malwares';
import { getInfrastructureById } from '../data/infrastructures';

interface MitigationControlsProps {
  mitigations: MitigationState;
  onToggle: (key: MitigationKey) => void;
  mode: 'simulation' | 'interactive';
  malwareId: string;
  infrastructureId: string;
  isolationCountdown?: number;
}

const icons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  firewall:  Shield,
  isolation: Lock,
  patch:     Wrench,
  ids:       Brain,
  backup:    Database,
  scan:      Search,
};

export default function MitigationControls({
  mitigations,
  onToggle,
  mode,
  malwareId,
  infrastructureId,
  isolationCountdown = 0,
}: MitigationControlsProps) {
  const malware = getMalwareById(malwareId);
  const infra = getInfrastructureById(infrastructureId);

  const displayList = [
    { id: 'firewall' as MitigationKey, name: 'FIREWALL', desc: 'Filtrado de conexiones' },
    { id: 'isolation' as MitigationKey, name: 'ISOLATION', desc: 'Aislamiento de nodos' },
    { id: 'patch' as MitigationKey, name: 'PATCH', desc: 'Gestión de parches' },
    { id: 'ids' as MitigationKey, name: 'IDS/IPS', desc: 'Detección de intrusos' },
    { id: 'backup' as MitigationKey, name: 'BACKUP', desc: 'Recuperación de datos' },
    { id: 'scan' as MitigationKey, name: 'ESCANEO', desc: 'Análisis de malware' },
  ];

  const getStatus = (key: MitigationKey) => {
    if (!infra.availableMitigations.includes(key)) return 'unavailable';
    if (malware.harmfulMitigations.includes(key)) return 'harmful';
    if (malware.recommendedMitigations.includes(key)) return 'recommended';
    return 'neutral';
  };

  return (
    <div className="panel" style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      padding: '6px 10px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 4, paddingBottom: 4,
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          Mitigación y Controles
        </span>
        {isolationCountdown > 0 && (
          <span style={{
            fontSize: 7, color: '#EAB308', fontWeight: 700,
            background: 'rgba(234,179,8,0.12)', padding: '1px 6px',
            borderRadius: 2, border: '1px solid rgba(234,179,8,0.3)',
          }}>
            🔒 {isolationCountdown}s
          </span>
        )}
      </div>

      {/* Controls grid - botones más largos/altos */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        gap: 5, 
        alignItems: 'stretch', 
        minHeight: 0,
        padding: '2px 0',
      }}>
        {displayList.map((ctrl) => {
          const IconComp = icons[ctrl.id] ?? Shield;
          const isActive = mitigations[ctrl.id] ?? false;
          const disabled = mode === 'simulation';
          const status = getStatus(ctrl.id);
          const showCd = ctrl.id === 'isolation' && isolationCountdown > 0;

          let borderColor: string;
          let bgColor: string;
          let iconColor: string;
          let labelColor: string;
          let statusText: string;

          if (isActive) {
            borderColor = 'rgba(34,197,94,0.5)';
            bgColor = 'rgba(34,197,94,0.08)';
            iconColor = '#22C55E';
            labelColor = '#22C55E';
            statusText = 'ACTIVO';
          } else if (showCd) {
            borderColor = 'rgba(234,179,8,0.5)';
            bgColor = 'rgba(234,179,8,0.06)';
            iconColor = '#EAB308';
            labelColor = '#EAB308';
            statusText = 'ACTIVO';
          } else if (status === 'unavailable') {
            borderColor = 'rgba(50,70,100,0.3)';
            bgColor = 'rgba(20,30,50,0.3)';
            iconColor = 'rgba(100,120,150,0.3)';
            labelColor = 'rgba(100,120,150,0.3)';
            statusText = 'N/D';
          } else {
            borderColor = 'var(--border-default)';
            bgColor = 'var(--bg-card)';
            iconColor = 'var(--text-muted)';
            labelColor = 'var(--text-secondary)';
            statusText = 'INACTIVO';
          }

          if (isActive && status === 'harmful') {
            borderColor = 'rgba(239,68,68,0.5)';
            bgColor = 'rgba(239,68,68,0.08)';
            iconColor = '#EF4444';
            labelColor = '#EF4444';
            statusText = '⚠ PELIGRO';
          }

          return (
            <button
              key={ctrl.id}
              onClick={() => !disabled && status !== 'unavailable' && onToggle(ctrl.id)}
              disabled={disabled || status === 'unavailable'}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '38px 10px',
                borderRadius: 5,
                border: `1.5px solid ${borderColor}`,
                background: bgColor,
                cursor: (disabled || status === 'unavailable') ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                minWidth: 0,
                position: 'relative',
                outline: 'none',
                opacity: disabled ? 0.7 : 1,
              }}
            >
              {showCd && (
                <div style={{
                  position: 'absolute', top: 2, right: 2,
                  background: 'rgba(234,179,8,0.15)',
                  fontSize: 6, fontWeight: 700, color: '#EAB308',
                  padding: '0px 4px', borderRadius: 2,
                }}>
                  {isolationCountdown}s
                </div>
              )}

              <IconComp size={22} color={iconColor} />

              <div style={{
                fontSize: 9, fontWeight: 700, textAlign: 'center',
                color: labelColor,
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}>
                {ctrl.name}
              </div>

              <div style={{
                fontSize: 7.5, color: 'rgba(100,116,139,0.5)',
                textAlign: 'center', lineHeight: 1.1,
              }}>
                {ctrl.desc}
              </div>

              <div style={{
                fontSize: 8, fontWeight: 700,
                color: isActive ? (status === 'harmful' ? '#EF4444' : '#22C55E') : (showCd ? '#EAB308' : 'rgba(100,116,139,0.4)'),
                background: isActive ? (status === 'harmful' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)') : 'transparent',
                padding: isActive ? '2px 10px' : '0',
                borderRadius: 3,
                letterSpacing: '0.04em',
              }}>
                {statusText}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}