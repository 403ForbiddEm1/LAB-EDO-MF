import type { MitigationDef, MitigationKey } from '../types/labedo';
import type { MalwareDef } from '../types/labedo';
import type { InfrastructureDef } from '../types/labedo';

export const mitigationList: MitigationDef[] = [
  {
    id: 'firewall',
    name: 'FIREWALL',
    desc: 'Filtrado de conexiones',
    effect: 'β × 0.70',
    betaMultiplier: 0.7,
    gammaMultiplier: 1,
    documentationId: 'doc_firewall',
  },
  {
    id: 'isolation',
    name: 'ISOLATION',
    desc: 'Aislamiento de nodos',
    effect: 'β × 0.60',
    betaMultiplier: 0.6,
    gammaMultiplier: 1,
    documentationId: 'doc_isolation',
  },
  {
    id: 'patch',
    name: 'PATCH',
    desc: 'Gestión de parches',
    effect: 'γ × 1.30',
    betaMultiplier: 1,
    gammaMultiplier: 1.3,
    documentationId: 'doc_patch',
  },
  {
    id: 'ids',
    name: 'IDS/IPS',
    desc: 'Detección de intrusos',
    effect: 'β × 0.85 · γ × 1.15',
    betaMultiplier: 0.85,
    gammaMultiplier: 1.15,
    documentationId: 'doc_ids',
  },
  {
    id: 'backup',
    name: 'BACKUP',
    desc: 'Recuperación de datos',
    effect: 'γ × 1.40',
    betaMultiplier: 1,
    gammaMultiplier: 1.4,
    documentationId: 'doc_backup',
  },
  {
    id: 'scan',
    name: 'ESCANEO',
    desc: 'Análisis de malware',
    effect: 'β × 0.90 · γ × 1.10',
    betaMultiplier: 0.9,
    gammaMultiplier: 1.1,
    documentationId: 'doc_scan',
  },
];

export function getMitigationById(id: MitigationKey): MitigationDef {
  return mitigationList.find((m) => m.id === id) ?? mitigationList[0];
}

export interface MitigationEffectResult {
  effectiveBeta: number;
  effectiveGamma: number;
  warnings: string[];
}

export function applyMitigationEffects(
  baseBeta: number,
  baseGamma: number,
  active: Record<MitigationKey, boolean>,
  malware: MalwareDef,
  infrastructure: InfrastructureDef,
  mode: 'simulation' | 'interactive'
): MitigationEffectResult {
  let effectiveBeta = baseBeta;
  let effectiveGamma = baseGamma;
  const warnings: string[] = [];

  (Object.keys(active) as MitigationKey[]).forEach((key) => {
    if (!active[key]) return;

    const def = getMitigationById(key);

    if (!infrastructure.availableMitigations.includes(key)) {
      effectiveBeta *= 1.2;
      warnings.push(`${def.name} no está disponible en ${infrastructure.name}. Efecto contraproducente.`);
      return;
    }

    if (malware.harmfulMitigations.includes(key)) {
      effectiveBeta *= 1.35;
      effectiveGamma *= 0.85;
      if (mode === 'interactive') {
        warnings.push(`⚠ ${def.name} es contraproducente contra ${malware.name}. ¡Aumenta el riesgo!`);
      }
      return;
    }

    const isRecommended = malware.recommendedMitigations.includes(key);
    const strength = isRecommended ? 1 : 0.5;

    if (!isRecommended && mode === 'interactive') {
      warnings.push(`${def.name} no es la mitigación ideal para ${malware.name} (efecto reducido).`);
    }

    const betaFactor = 1 + (def.betaMultiplier - 1) * strength;
    const gammaFactor = 1 + (def.gammaMultiplier - 1) * strength;
    effectiveBeta *= betaFactor;
    effectiveGamma *= gammaFactor;
  });

  return { effectiveBeta, effectiveGamma, warnings };
}