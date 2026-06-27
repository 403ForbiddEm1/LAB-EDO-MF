import { useState, useCallback, useRef, useEffect } from 'react';
import { getMalwareById } from '../data/malwares';
import { getInfrastructureById } from '../data/infrastructures';
import type { MitigationKey } from '../types/labedo';
import { topologyToNetworkNodes, syncNetworkWithSIR } from '../simulation/network';

const SIMULATION_TICK_MS = 200;

export interface MitigationState {
  firewall: boolean;
  isolation: boolean;
  patch: boolean;
  ids: boolean;
  backup: boolean;
  scan: boolean;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'internet' | 'firewall' | 'router' | 'server' | 'database' | 'pc' | 'iot' | 'plc' | 'cloud' | 'workstation';
  state: 'susceptible' | 'infected' | 'recovered' | 'isolated' | 'dead';
  x: number;
  y: number;
  icon?: string;
  connections?: string[];
  isStructural?: boolean;
  vulnerable?: boolean;
  infectedTime?: number;
  scanTimer?: number;
  scanDone?: boolean;
  isDead?: boolean;
  isOrigin?: boolean;
  isTrojan?: boolean;
  isPatched?: boolean;
  isBotnetHub?: boolean;
  isRootkitHidden?: boolean;
  spywareTarget?: boolean;
  trafficLoad?: number;
  backingUp?: boolean;
  backupProgress?: number;
  backupCount?: number;
}

export interface LogEntry {
  id: number;
  timestamp: number;
  message: string;
  type: string;
}

export interface SimulationState {
  malwareId: string;
  infrastructureId: string;
  N: number;
  I0: number;
  beta: number;
  gamma: number;
  dt: number;
  solver: 'euler' | 'rk4';
  mode: 'simulation' | 'interactive';
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number;
  realTime: number;
  S: number;
  I: number;
  R: number;
  R0: number;
  peakInfection: number;
  peakTime: number;
  history: { t: number; S: number; I: number; R: number }[];
  logs: LogEntry[];
  mitigations: MitigationState;
  networkNodes: NetworkNode[];
  healthScore: number;
  status: 'ready' | 'running' | 'paused' | 'completed' | 'backup' | 'collapsed';
  collapseReason?: string;
  backupTimer: number;
  backupDuration: number;
  backupActive: boolean;
  backupNodeQueue: string[];
  trojanNodeId?: string;
  trojanTimer: number;
  trojanDuration: number;
  trojanDetected: boolean;
  scanActive: boolean;
  scanTimer: number;
  scanDuration: number;
  scanTargetId?: string;
  rootkitFoundId?: string;
  botnetHubId?: string;
  spywareNodeId?: string;
  spywareExfilTimer: number;
  trafficDegradation: number;
  isolatedNodeIds: string[];
  deadNodeIds: string[];
  originNodeId?: string;
  collapseInfPct: number;
  collapseDeadPct: number;
}

const COLLAPSE_INF_PCT = 0.20;
const COLLAPSE_DEAD_PCT = 0.50;

function euler(S: number, I: number, R: number, b: number, g: number, N: number, dt: number) {
  const dS = (-b * S * I) / N,
    dI = (b * S * I) / N - g * I,
    dR = g * I;
  return { S: S + dS * dt, I: I + dI * dt, R: R + dR * dt };
}

function rk4(S: number, I: number, R: number, b: number, g: number, N: number, dt: number) {
  const f = (s: number, i: number) => ({ dS: (-b * s * i) / N, dI: (b * s * i) / N - g * i, dR: g * i });
  const k1 = f(S, I),
    k2 = f(S + k1.dS * dt / 2, I + k1.dI * dt / 2),
    k3 = f(S + k2.dS * dt / 2, I + k2.dI * dt / 2),
    k4 = f(S + k3.dS * dt, I + k3.dI * dt);
  return {
    S: S + (k1.dS + 2 * k2.dS + 2 * k3.dS + k4.dS) * dt / 6,
    I: I + (k1.dI + 2 * k2.dI + 2 * k3.dI + k4.dI) * dt / 6,
    R: R + (k1.dR + 2 * k2.dR + 2 * k3.dR + k4.dR) * dt / 6,
  };
}

function clampSIR(S: number, I: number, R: number, N: number) {
  const s = Math.max(0, Math.min(N, S)),
    i = Math.max(0, Math.min(N - s, I));
  return { S: s, I: i, R: Math.max(0, Math.min(N, N - s - i)) };
}

function getMults(
  mit: MitigationState,
  malware: { harmfulMitigations: string[]; recommendedMitigations: string[] },
  infra: { availableMitigations: string[] }
): { bm: number; gm: number } {
  const base: Record<string, [number, number]> = {
    firewall: [0.70, 1.00],
    isolation: [0.60, 1.00],
    patch: [1.00, 1.30],
    ids: [0.85, 1.15],
    backup: [1.00, 1.40],
    scan: [0.90, 1.10],
  };
  let bm = 1,
    gm = 1;
  (Object.keys(mit) as MitigationKey[]).forEach(k => {
    if (!mit[k] || k === 'backup') return;
    const def = base[k];
    if (!def) return;
    if (!infra.availableMitigations.includes(k)) { bm *= 1.15; return; }
    if (malware.harmfulMitigations.includes(k)) { bm *= 1.35;
      gm *= 0.85; return; }
    const s = malware.recommendedMitigations.includes(k) ? 1.0 : 0.5;
    bm *= 1 + (def[0] - 1) * s;
    gm *= 1 + (def[1] - 1) * s;
  });
  return { bm, gm };
}

function computeParams(malwareId: string, infrastructureId: string) {
  const malware = getMalwareById(malwareId);
  const infra = getInfrastructureById(infrastructureId);
  const beta = +(malware.beta * infra.baseBetaModifier).toFixed(2);
  const gamma = +(malware.gamma * infra.baseGammaModifier).toFixed(2);
  const N = infra.nodeCount;
  const I0 = Math.max(1, Math.round(N * 0.01));
  return { beta, gamma, N, I0, infra, malware };
}

function buildInitialState(malwareId = 'worm', infrastructureId = 'hospital'): SimulationState {
  const { beta, gamma, N, I0, infra, malware } = computeParams(malwareId, infrastructureId);
  const nodes = topologyToNetworkNodes(infra.topologyId, I0, 0, N);
  const bd = Math.max(3, Math.min(10, 3 + malware.damage));
  return {
    malwareId,
    infrastructureId,
    N,
    I0,
    beta,
    gamma,
    dt: 0.1,
    solver: 'rk4',
    mode: 'simulation',
    isRunning: false,
    isPaused: false,
    currentTime: 0,
    realTime: 0,
    S: N - I0,
    I: I0,
    R: 0,
    R0: +(beta / gamma).toFixed(2),
    peakInfection: 0,
    peakTime: 0,
    history: [],
    logs: [{ id: 1, timestamp: 0, message: `🔬 Lab-EDO listo. ${malware.name} / ${infra.name} — ${N} nodos.`, type: 'info' }],
    mitigations: { firewall: false, patch: false, isolation: false, ids: false, backup: false, scan: false },
    networkNodes: nodes,
    healthScore: 100,
    status: 'ready',
    backupTimer: 0,
    backupDuration: bd,
    backupActive: false,
    backupNodeQueue: [],
    trojanNodeId: undefined,
    trojanTimer: 0,
    trojanDuration: 3 + Math.random() * 2,
    trojanDetected: false,
    scanActive: false,
    scanTimer: 0,
    scanDuration: 3,
    scanTargetId: undefined,
    rootkitFoundId: undefined,
    botnetHubId: undefined,
    spywareNodeId: undefined,
    spywareExfilTimer: 0,
    trafficDegradation: 0,
    isolatedNodeIds: [],
    deadNodeIds: [],
    originNodeId: undefined,
    collapseInfPct: 0,
    collapseDeadPct: 0,
  };
}

function buildAdj(nodes: NetworkNode[]): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  nodes.forEach(n => {
    adj.set(n.id, [...(n.connections ?? [])]);
    (n.connections ?? []).forEach(cid => {
      if (!adj.has(cid)) adj.set(cid, []);
      adj.get(cid)!.push(n.id);
    });
  });
  return adj;
}

function stepWorm(
  nodes: NetworkNode[],
  dt: number,
  mit: MitigationState,
  newLogs: LogEntry[],
  logId: () => number,
  t: number
): NetworkNode[] {
  const adj = buildAdj(nodes);
  const infected = nodes.filter(n => n.state === 'infected' && !n.isDead);

  const toInfect = new Set<string>();
  infected.forEach(node => {
    const neighbors = (adj.get(node.id) ?? [])
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is NetworkNode => !!n && n.state === 'susceptible' && !n.isDead);

    if (neighbors.length === 0) return;

    const isLarge = ['server', 'database', 'router', 'cloud'].includes(node.type);
    const spreadCount = isLarge ? 4 : 2;
    const chance = isLarge ? 0.12 : 0.08;

    const shuffled = [...neighbors].sort(() => Math.random() - 0.5);
    let spread = 0;
    for (const nb of shuffled) {
      if (spread >= spreadCount) break;
      if (Math.random() < chance && !mit.firewall) {
        toInfect.add(nb.id);
        spread++;
      } else if (Math.random() < chance * 0.3 && mit.firewall) {
        toInfect.add(nb.id);
        spread++;
      }
    }
  });

  if (toInfect.size > 0) {
    newLogs.push({ id: logId(), timestamp: t, message: `🦠 Worm se multiplica — ${toInfect.size} nuevas infecciones.`, type: 'infection' });
  }

  return nodes.map(n =>
    toInfect.has(n.id) ?
    { ...n, state: 'infected' as const, infectedTime: 0 } :
    n
  );
}

function stepRansomware(
  nodes: NetworkNode[],
  dt: number,
  mit: MitigationState,
  newLogs: LogEntry[],
  logId: () => number,
  t: number,
  isCritical: boolean
): NetworkNode[] {
  const adj = buildAdj(nodes);
  const infected = nodes.filter(n => n.state === 'infected' && !n.isDead);

  const toInfect = new Set<string>();
  infected.forEach(node => {
    const neighbors = (adj.get(node.id) ?? [])
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is NetworkNode => !!n && n.state === 'susceptible' && !n.isDead);

    if (neighbors.length === 0) return;

    const vulnNeighbors = neighbors.filter(n => n.vulnerable);
    const target = vulnNeighbors.length > 0 ?
      vulnNeighbors[Math.floor(Math.random() * vulnNeighbors.length)] :
      neighbors[Math.floor(Math.random() * neighbors.length)];

    const chance = isCritical ? 0.04 : 0.025;
    if (Math.random() < chance && !mit.isolation) {
      toInfect.add(target.id);
    }
  });

  return nodes.map(n =>
    toInfect.has(n.id) ?
    { ...n, state: 'infected' as const, infectedTime: 0 } :
    n
  );
}

function stepTrojan(
  nodes: NetworkNode[],
  realDt: number,
  state: SimulationState,
  newLogs: LogEntry[],
  logId: () => number,
  t: number
): { nodes: NetworkNode[]; trojanNodeId?: string; trojanTimer: number; trojanDuration: number; trojanDetected: boolean } {
  let { trojanNodeId, trojanTimer, trojanDuration, trojanDetected } = state;
  const mit = state.mitigations;

  trojanTimer += realDt;

  if (!trojanNodeId) {
    const cands = nodes.filter(n =>
      n.state === 'susceptible' && !n.isTrojan && !n.isPatched &&
      n.type !== 'internet' && n.type !== 'firewall'
    );
    if (cands.length > 0 && Math.random() < 0.05) {
      const t2 = cands[Math.floor(Math.random() * cands.length)];
      trojanNodeId = t2.id;
      trojanTimer = 0;
      trojanDuration = 3 + Math.random() * 2;
      trojanDetected = false;
      nodes = nodes.map(n => n.id === t2.id ? { ...n, isTrojan: true } : n);
      newLogs.push({ id: logId(), timestamp: t, message: `🐴 Troyano activo en la red. Usa IDS o escaneo para detectarlo.`, type: 'trojan' });
    }
    return { nodes, trojanNodeId, trojanTimer, trojanDuration, trojanDetected };
  }

  if (mit.ids && !trojanDetected && Math.random() < 0.08 * realDt) {
    const tn = nodes.find(n => n.id === trojanNodeId);
    if (tn) {
      trojanDetected = true;
      newLogs.push({ id: logId(), timestamp: t, message: `👁 IDS detectó al troyano en "${tn.name}". ¡Aísla y parchea!`, type: 'scan' });
    }
  }

  if (trojanTimer >= trojanDuration) {
    const tn = nodes.find(n => n.id === trojanNodeId);
    if (tn && tn.state !== 'isolated' && !tn.isPatched) {
      nodes = nodes.map(n => n.id === trojanNodeId ?
        { ...n, isTrojan: false, state: 'infected' as const, infectedTime: 0 } :
        n
      );
      newLogs.push({ id: logId(), timestamp: t, message: `🕵️ Troyano activó infección en "${tn.name}" y se movió.`, type: 'trojan' });

      const adj = buildAdj(nodes);
      const neighbors = (adj.get(trojanNodeId) ?? [])
        .map(id => nodes.find(n => n.id === id))
        .filter((n): n is NetworkNode => !!n && n.state === 'susceptible' && !n.isPatched);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        trojanNodeId = next.id;
        nodes = nodes.map(n => n.id === next.id ? { ...n, isTrojan: true } : n);
      } else {
        trojanNodeId = undefined;
      }
    } else {
      if (tn) {
        nodes = nodes.map(n => n.id === trojanNodeId ? { ...n, isTrojan: false } : n);
        newLogs.push({ id: logId(), timestamp: t, message: `✅ Troyano neutralizado en "${tn.name}".`, type: 'info' });
      }
      trojanNodeId = undefined;
    }
    trojanTimer = 0;
    trojanDuration = 3 + Math.random() * 2;
    trojanDetected = false;
  }

  return { nodes, trojanNodeId, trojanTimer, trojanDuration, trojanDetected };
}

function stepBotnet(
  nodes: NetworkNode[],
  dt: number,
  mit: MitigationState,
  newLogs: LogEntry[],
  logId: () => number,
  t: number,
  botnetHubId: string | undefined
): { nodes: NetworkNode[]; botnetHubId: string | undefined } {
  if (!botnetHubId) {
    const hub = nodes.find(n => n.state === 'infected' && n.isStructural && !n.isDead);
    if (hub) {
      botnetHubId = hub.id;
      nodes = nodes.map(n => n.id === hub.id ? { ...n, isBotnetHub: true } : n);
      newLogs.push({ id: logId(), timestamp: t, message: `🕸️ Nodo madre botnet: "${hub.name}". Crea red de nodos comprometidos.`, type: 'infection' });
    }
    return { nodes, botnetHubId };
  }

  const adj = buildAdj(nodes);
  const hub = nodes.find(n => n.id === botnetHubId);
  if (!hub || hub.isDead) { botnetHubId = undefined; return { nodes, botnetHubId }; }

  const hubNeighbors = (adj.get(botnetHubId) ?? [])
    .map(id => nodes.find(n => n.id === id))
    .filter((n): n is NetworkNode => !!n && n.state === 'susceptible' && !n.isDead);

  const chance = mit.ids ? 0.04 : mit.firewall ? 0.06 : 0.10;
  const toInfect = new Set<string>();

  hubNeighbors.forEach(nb => {
    if (Math.random() < chance) toInfect.add(nb.id);
  });

  nodes.filter(n => n.state === 'infected' && !n.isDead && !n.isBotnetHub).forEach(node => {
    const nbs = (adj.get(node.id) ?? [])
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is NetworkNode => !!n && n.state === 'susceptible' && !n.isDead);
    if (nbs.length > 0 && Math.random() < 0.06) {
      toInfect.add(nbs[Math.floor(Math.random() * nbs.length)].id);
    }
  });

  if (toInfect.size > 0 && Math.random() < 0.3) {
    newLogs.push({ id: logId(), timestamp: t, message: `🕸️ Botnet se expande: ${toInfect.size} nuevos nodos comprometidos.`, type: 'infection' });
  }

  nodes = nodes.map(n =>
    toInfect.has(n.id) ?
    { ...n, state: 'infected' as const, infectedTime: 0 } :
    n
  );

  return { nodes, botnetHubId };
}

function stepRootkit(
  nodes: NetworkNode[],
  dt: number,
  mit: MitigationState,
  newLogs: LogEntry[],
  logId: () => number,
  t: number,
  rootkitFoundId: string | undefined
): { nodes: NetworkNode[]; rootkitFoundId: string | undefined } {
  const adj = buildAdj(nodes);

  nodes = nodes.map(n => {
    if (n.state === 'infected' && !n.isDead && !n.isRootkitHidden && n.id !== rootkitFoundId) {
      return { ...n, isRootkitHidden: true };
    }
    return n;
  });

  const hiddenInfected = nodes.filter(n => n.state === 'infected' && n.isRootkitHidden && !n.isDead);
  const toInfect = new Set<string>();

  hiddenInfected.forEach(node => {
    const neighbors = (adj.get(node.id) ?? [])
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is NetworkNode => !!n && n.state === 'susceptible' && !n.isDead);
    if (neighbors.length > 0 && Math.random() < 0.05) {
      toInfect.add(neighbors[Math.floor(Math.random() * neighbors.length)].id);
    }
  });

  if (rootkitFoundId && hiddenInfected.length > 0 && Math.random() < 0.02) {
    newLogs.push({ id: logId(), timestamp: t, message: `👁 Rootkit reveló red oculta: ${hiddenInfected.length} nodos comprometidos silenciosamente.`, type: 'warning' });
  }

  nodes = nodes.map(n =>
    toInfect.has(n.id) ?
    { ...n, state: 'infected' as const, infectedTime: 0, isRootkitHidden: true } :
    n
  );

  return { nodes, rootkitFoundId };
}

function stepSpyware(
  nodes: NetworkNode[],
  realDt: number,
  mit: MitigationState,
  newLogs: LogEntry[],
  logId: () => number,
  t: number,
  spywareNodeId: string | undefined,
  spywareExfilTimer: number
): { nodes: NetworkNode[]; spywareNodeId: string | undefined; spywareExfilTimer: number } {
  spywareExfilTimer += realDt;

  if (!spywareNodeId) {
    const seed = nodes.find(n => n.state === 'infected' && !n.isDead);
    if (seed) {
      spywareNodeId = seed.id;
      nodes = nodes.map(n => n.id === seed.id ? { ...n, spywareTarget: true } : n);
      newLogs.push({ id: logId(), timestamp: t, message: `📡 Spyware activo en "${seed.name}". Exfiltrando datos...`, type: 'infection' });
    }
    return { nodes, spywareNodeId, spywareExfilTimer };
  }

  if (spywareExfilTimer > 8 + Math.random() * 4) {
    spywareExfilTimer = 0;
    const adj = buildAdj(nodes);
    const current = nodes.find(n => n.id === spywareNodeId);
    if (!current) { spywareNodeId = undefined; return { nodes, spywareNodeId, spywareExfilTimer }; }

    const neighbors = (adj.get(spywareNodeId) ?? [])
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is NetworkNode => !!n && n.state === 'susceptible' && !n.isDead);

    nodes = nodes.map(n => n.id === spywareNodeId ? { ...n, spywareTarget: false } : n);

    if (neighbors.length > 0 && !(mit.firewall && mit.ids)) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      spywareNodeId = next.id;
      nodes = nodes.map(n => n.id === next.id ? { ...n, state: 'infected' as const, infectedTime: 0, spywareTarget: true } : n);
      newLogs.push({ id: logId(), timestamp: t, message: `📡 Spyware se mueve a "${next.name}" y extrae datos.`, type: 'infection' });
    } else if (mit.firewall && mit.ids) {
      newLogs.push({ id: logId(), timestamp: t, message: `🛡 Firewall + IDS bloquearon exfiltración de spyware.`, type: 'mitigation' });
    }
  }

  return { nodes, spywareNodeId, spywareExfilTimer };
}

function stepAdware(
  nodes: NetworkNode[],
  realDt: number,
  mit: MitigationState,
  newLogs: LogEntry[],
  logId: () => number,
  t: number,
  trafficDegradation: number
): { nodes: NetworkNode[]; trafficDegradation: number } {
  const degradeRate = mit.firewall ? -0.02 : 0.015;
  trafficDegradation = Math.max(0, Math.min(1, trafficDegradation + degradeRate * realDt));

  if (trafficDegradation > 0.9 && Math.random() < 0.02) {
    newLogs.push({ id: logId(), timestamp: t, message: `📢 Adware ha saturado el tráfico de red al ${Math.round(trafficDegradation * 100)}%.`, type: 'warning' });
  }

  nodes = nodes.map(n => ({ ...n, trafficLoad: trafficDegradation }));
  return { nodes, trafficDegradation };
}

function processDeadNodes(
  nodes: NetworkNode[],
  realDt: number,
  malwareId: string,
  deadIds: string[],
  mode: string,
  newLogs: LogEntry[],
  logId: () => number,
  t: number
): { nodes: NetworkNode[]; deadIds: string[] } {
  if (mode === 'simulation') {
    return { nodes, deadIds };
  }

  const canDie = malwareId === 'ransomware' || malwareId === 'spyware';
  if (!canDie) {
    return { nodes, deadIds };
  }

  const deadThreshold = malwareId === 'ransomware' ? 20 : 30;

  nodes = nodes.map(n => {
    if (n.state !== 'infected' || n.isDead || n.isPatched) return n;

    const infectedTime = (n.infectedTime ?? 0) + realDt;

    if (infectedTime >= deadThreshold) {
      if (!deadIds.includes(n.id)) {
        deadIds = [...deadIds, n.id];
        newLogs.push({
          id: logId(),
          timestamp: t,
          message: `💀 "${n.name}" ha muerto (${malwareId === 'ransomware' ? '🔒 cifrado' : '📡 exfiltración'}). ${Math.round(infectedTime)}s infectado.`,
          type: 'dead'
        });
      }
      return { ...n, infectedTime: infectedTime, isDead: true, state: 'dead' as const };
    }
    return { ...n, infectedTime: infectedTime };
  });

  return { nodes, deadIds };
}

function processBackup(
  prev: SimulationState,
  realDt: number,
  newLogs: LogEntry[],
  logId: () => number
): Partial<SimulationState> {
  let { backupTimer, backupDuration, networkNodes: nodes, isolatedNodeIds, deadNodeIds } = prev;
  const isRansomware = prev.malwareId === 'ransomware';

  backupTimer += realDt;

  if (isRansomware) {
    const recoverChance = 0.008 * realDt;
    let recovered = 0;
    nodes = nodes.map(n => {
      if (n.state === 'infected' && !n.isDead && Math.random() < recoverChance) {
        recovered++;
        return { ...n, state: 'recovered' as const, backingUp: false, backupProgress: 1 };
      }
      if (n.state === 'infected' && !n.isDead) {
        return { ...n, backingUp: true, backupProgress: Math.min(1, (n.backupProgress ?? 0) + 0.002) };
      }
      return n;
    });

    const stillInf = nodes.filter(n => n.state === 'infected' && !n.isDead).length;
    if (stillInf === 0) {
      newLogs.push({ id: logId(), timestamp: prev.currentTime, message: `💾 Descifrado completado. Datos parcialmente recuperados. Nodos muertos: ${deadNodeIds.length}.`, type: 'backup' });
      return { networkNodes: nodes, backupTimer, status: 'completed', isRunning: false, backupActive: false };
    }
    return { networkNodes: nodes, backupTimer };
  }

  const progress = Math.min(1, backupTimer / backupDuration);
  nodes = nodes.map(n => {
    if ((n.state === 'infected' || n.state === 'isolated') && !n.isDead) {
      return { ...n, backingUp: true, backupProgress: progress };
    }
    return n;
  });

  if (backupTimer >= backupDuration) {
    nodes = nodes.map(n => {
      if (n.isDead) {
        return { ...n, isDead: false, state: 'recovered' as const, backingUp: false };
      }
      if (n.state === 'infected' || n.state === 'isolated') {
        return { ...n, state: 'recovered' as const, backingUp: false, backupProgress: 1, isTrojan: false, isPatched: false };
      }
      return { ...n, backingUp: false, isTrojan: false };
    });

    const rec = nodes.filter(n => n.state === 'recovered').length;
    const dead = nodes.filter(n => n.isDead).length;
    newLogs.push({
      id: logId(),
      timestamp: prev.currentTime,
      message: `💾 Backup completado. ${rec} nodos recuperados (azul). ${isolatedNodeIds.length} aislados → recuperados. ${dead} nodos permanecen apagados.`,
      type: 'backup'
    });

    const R = rec;
    const S = nodes.filter(n => n.state === 'susceptible').length;
    return {
      networkNodes: nodes,
      backupTimer,
      status: 'completed',
      isRunning: false,
      backupActive: false,
      isolatedNodeIds: [],
      I: 0,
      R,
      S,
    };
  }

  return { networkNodes: nodes, backupTimer };
}

function checkCollapse(
  nodes: NetworkNode[],
  deadIds: string[],
  infrastructureId: string,
  mode: string,
  newLogs: LogEntry[],
  logId: () => number,
  t: number
): { collapsed: boolean; infPct: number; deadPct: number } {
  if (mode === 'simulation') {
    return { collapsed: false, infPct: 0, deadPct: 0 };
  }

  const structural = nodes.filter(n => n.isStructural);
  const total = Math.max(1, structural.length);
  const infCount = structural.filter(n => n.state === 'infected').length;
  const deadCount = structural.filter(n => n.isDead).length;
  const infPct = infCount / total;
  const deadPct = deadCount / total;

  const isCritical = infrastructureId === 'critical';
  if (isCritical && infPct >= COLLAPSE_INF_PCT && deadPct >= COLLAPSE_DEAD_PCT) {
    newLogs.push({
      id: logId(),
      timestamp: t,
      message: `💀 INFRAESTRUCTURA COLAPSADA — ${deadCount}/${total} nodos muertos, ${infCount} infectados.`,
      type: 'collapse'
    });
    return { collapsed: true, infPct, deadPct };
  }

  if (deadIds.length / total >= 0.5 && total > 5) {
    newLogs.push({
      id: logId(),
      timestamp: t,
      message: `💀 COLAPSO TOTAL — más del 50% de la infraestructura ha sido destruida.`,
      type: 'collapse'
    });
    return { collapsed: true, infPct, deadPct };
  }

  return { collapsed: false, infPct, deadPct };
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(() => buildInitialState());

  const stateRef = useRef(state);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const tickingRef = useRef(false);
  const logIdRef = useRef(2);
  stateRef.current = state;

  const logId = useCallback(() => logIdRef.current++, []);

  const tick = useCallback((realElapsedMs: number) => {
    const realDt = realElapsedMs / 1000;

    setState(prev => {
      if (!prev.isRunning || prev.isPaused) return prev;
      if (prev.status === 'collapsed' || prev.status === 'completed') return { ...prev, isRunning: false };

      const malware = getMalwareById(prev.malwareId);
      const infra = getInfrastructureById(prev.infrastructureId);
      const { dt, solver, mode, N } = prev;
      const newLogs: LogEntry[] = [];
      const lId = () => logIdRef.current++;

      if (prev.status === 'backup') {
        const update = processBackup(prev, realDt, newLogs, lId);
        return {
          ...prev,
          ...update,
          realTime: prev.realTime + realDt,
          logs: [...newLogs, ...prev.logs].slice(0, 300),
        };
      }

      let { S, I, R, currentTime, peakInfection, peakTime } = prev;
      let nodes = [...prev.networkNodes];
      let isolated = [...prev.isolatedNodeIds];
      let dead = [...prev.deadNodeIds];
      let {
        trojanNodeId,
        trojanTimer,
        trojanDuration,
        trojanDetected,
        scanActive,
        scanTimer,
        scanDuration,
        scanTargetId,
        rootkitFoundId,
        botnetHubId,
        spywareNodeId,
        spywareExfilTimer,
        trafficDegradation
      } = prev;
      let originNodeId = prev.originNodeId;

      let mit = { ...prev.mitigations };
      if (mode === 'simulation') {
        const r = I / N;
        mit = {
          firewall: r > 0.08,
          ids: r > 0.15,
          patch: r > 0.20,
          isolation: r > 0.40,
          backup: r > 0.65,
          scan: r > 0.10,
        };
      }

      const { bm, gm } = getMults(mit, malware, infra);
      const effB = prev.beta * bm;

      // ─── MODO INTERACTIVO: γ = 0 (NO RECUPERACIÓN NATURAL) ────────────
      // ─── MODO SIMULACIÓN: γ normal ─────────────────────────────────────
      const effG = prev.mode === 'simulation' ? prev.gamma * gm : 0;

      let raw = solver === 'euler' ?
        euler(S, I, R, effB, effG, N, dt) :
        rk4(S, I, R, effB, effG, N, dt);
      raw = clampSIR(raw.S, raw.I, raw.R, N);
      S = raw.S;
      I = raw.I;
      R = raw.R;
      currentTime += dt;
      if (I / N > peakInfection) { peakInfection = I / N;
        peakTime = currentTime; }

      const deadResult = processDeadNodes(
        nodes, realDt, prev.malwareId, dead, mode, newLogs, lId, currentTime
      );
      nodes = deadResult.nodes;
      dead = deadResult.deadIds;

      const isCritical = prev.infrastructureId === 'critical';

      switch (prev.malwareId) {
        case 'worm':
          nodes = stepWorm(nodes, dt, mit, newLogs, lId, currentTime);
          break;
        case 'ransomware':
          nodes = stepRansomware(nodes, dt, mit, newLogs, lId, currentTime, isCritical);
          break;
        case 'trojan': {
          const tr = stepTrojan(nodes, realDt, prev, newLogs, lId, currentTime);
          nodes = tr.nodes;
          trojanNodeId = tr.trojanNodeId;
          trojanTimer = tr.trojanTimer;
          trojanDuration = tr.trojanDuration;
          trojanDetected = tr.trojanDetected;
          break;
        }
        case 'botnet': {
          const btResult = stepBotnet(nodes, dt, mit, newLogs, lId, currentTime, botnetHubId);
          nodes = btResult.nodes;
          botnetHubId = btResult.botnetHubId;
          break;
        }
        case 'rootkit': {
          const rk = stepRootkit(nodes, dt, mit, newLogs, lId, currentTime, rootkitFoundId);
          nodes = rk.nodes;
          rootkitFoundId = rk.rootkitFoundId;
          break;
        }
        case 'spyware': {
          const sp = stepSpyware(nodes, realDt, mit, newLogs, lId, currentTime, spywareNodeId, spywareExfilTimer);
          nodes = sp.nodes;
          spywareNodeId = sp.spywareNodeId;
          spywareExfilTimer = sp.spywareExfilTimer;
          break;
        }
        case 'adware': {
          const ad = stepAdware(nodes, realDt, mit, newLogs, lId, currentTime, trafficDegradation);
          nodes = ad.nodes;
          trafficDegradation = ad.trafficDegradation;
          break;
        }
      }

      if (mit.scan && scanActive) {
        scanTimer += realDt;
        if (scanTimer >= scanDuration) {
          nodes = nodes.map(n => ({
            ...n,
            isRootkitHidden: false,
            isTrojan: n.isTrojan ? false : n.isTrojan,
          }));
          if (prev.malwareId === 'rootkit') {
            const found = nodes.filter(n => n.state === 'infected');
            if (found.length > 0) {
              rootkitFoundId = found[0].id;
              newLogs.push({ id: lId(), timestamp: currentTime, message: `🔍 Escaneo completado: rootkit detectado en ${found.length} nodos.`, type: 'scan' });
            }
          }
          scanTimer = 0;
          scanActive = false;
        }
      }

      if (scanTargetId && mit.scan) {
        nodes = nodes.map(n => {
          if (n.id !== scanTargetId) return n;
          const st = (n.scanTimer ?? 0) + realDt;
          if (st >= 5) {
            return { ...n, scanTimer: 0, scanDone: true, isRootkitHidden: false };
          }
          return { ...n, scanTimer: st };
        });
      }

      // ─── MODO INTERACTIVO: acciones manuales ──────────────────────────
      if (mode === 'interactive' && mit.isolation) {
        nodes = nodes.map(n => {
          if (n.state === 'infected' && !n.isDead && !isolated.includes(n.id)) {
            isolated = [...isolated, n.id];
            return { ...n, state: 'isolated' as const };
          }
          return n;
        });
      }
      if (mode === 'interactive' && mit.patch) {
        nodes = nodes.map(n =>
          n.vulnerable && n.state === 'susceptible' && !n.isPatched ? { ...n, isPatched: true } : n
        );
      }

      // ─── SINCRONIZAR ──────────────────────────────────────────────────────
      nodes = syncNetworkWithSIR(nodes, I, R, N);

      nodes = nodes.map(n => {
        if (isolated.includes(n.id)) return { ...n, state: 'isolated' as const };
        if (dead.includes(n.id)) return { ...n, isDead: true, state: 'dead' as const };
        return n;
      });

      if (!originNodeId) {
        const fi = nodes.find(n => n.state === 'infected' && n.isStructural);
        if (fi) originNodeId = fi.id;
      }

      const healthScore = Math.max(0, Math.round(((S + R) / N) * 100));

      // ─── COLAPSO SOLO EN INTERACTIVO ────────────────────────────────────
      if (mode === 'interactive') {
        const { collapsed, infPct, deadPct } = checkCollapse(
          nodes, dead, prev.infrastructureId, mode, newLogs, lId, currentTime
        );
        if (collapsed) {
          return {
            ...prev,
            S,
            I,
            R,
            currentTime,
            realTime: prev.realTime + realDt,
            peakInfection,
            peakTime,
            networkNodes: nodes,
            healthScore,
            status: 'collapsed',
            isRunning: false,
            collapseReason: `💀 Infraestructura destruida. ${dead.length} nodos irrecuperables.`,
            mitigations: prev.mode === 'simulation' ? mit : prev.mitigations,
            trojanNodeId,
            trojanTimer,
            trojanDuration,
            trojanDetected,
            scanActive,
            scanTimer,
            scanDuration,
            scanTargetId,
            rootkitFoundId,
            botnetHubId,
            spywareNodeId,
            spywareExfilTimer,
            trafficDegradation,
            isolatedNodeIds: isolated,
            deadNodeIds: dead,
            originNodeId,
            collapseInfPct: infPct,
            collapseDeadPct: deadPct,
            R0: +(effB / (prev.mode === 'simulation' ? prev.gamma * gm : 1)).toFixed(2),
            history: [...prev.history, { t: currentTime, S, I, R }].slice(-2000),
            logs: [...newLogs, ...prev.logs].slice(0, 300),
          };
        }
      }

      // ─── COMPLETADO ──────────────────────────────────────────────────────
      if (I < 0.5 && R > 1) {
        if (mode === 'simulation') {
          newLogs.push({ id: lId(), timestamp: currentTime, message: '✅ Simulación completada. Epidemia controlada.', type: 'info' });
          return {
            ...prev,
            S,
            I,
            R,
            currentTime,
            realTime: prev.realTime + realDt,
            peakInfection,
            peakTime,
            networkNodes: nodes,
            healthScore,
            status: 'completed',
            isRunning: false,
            mitigations: mit,
            trojanNodeId,
            trojanTimer,
            trojanDuration,
            trojanDetected,
            scanActive,
            scanTimer,
            scanDuration,
            scanTargetId,
            rootkitFoundId,
            botnetHubId,
            spywareNodeId,
            spywareExfilTimer,
            trafficDegradation,
            isolatedNodeIds: isolated,
            deadNodeIds: dead,
            originNodeId,
            collapseInfPct: 0,
            collapseDeadPct: 0,
            R0: +(effB / (prev.mode === 'simulation' ? prev.gamma * gm : 1)).toFixed(2),
            history: [...prev.history, { t: currentTime, S, I, R }].slice(-2000),
            logs: [...newLogs, ...prev.logs].slice(0, 300),
          };
        } else {
          // En modo interactivo, la recuperación SOLO ocurre con backup
          const infectedNodes = nodes.filter(n => n.state === 'infected' && !n.isDead);
          if (infectedNodes.length === 0) {
            newLogs.push({
              id: lId(),
              timestamp: currentTime,
              message: `🔬 Infección controlada. Usa BACKUP para recuperar nodos aislados o infectados.`,
              type: 'info'
            });
            return {
              ...prev,
              S,
              I,
              R,
              currentTime,
              realTime: prev.realTime + realDt,
              peakInfection,
              peakTime,
              networkNodes: nodes,
              healthScore,
              status: 'running',
              mitigations: prev.mitigations,
              trojanNodeId,
              trojanTimer,
              trojanDuration,
              trojanDetected,
              scanActive,
              scanTimer,
              scanDuration,
              scanTargetId,
              rootkitFoundId,
              botnetHubId,
              spywareNodeId,
              spywareExfilTimer,
              trafficDegradation,
              isolatedNodeIds: isolated,
              deadNodeIds: dead,
              originNodeId,
              collapseInfPct: 0,
              collapseDeadPct: 0,
              R0: +(effB / (prev.mode === 'simulation' ? prev.gamma * gm : 1)).toFixed(2),
              history: [...prev.history, { t: currentTime, S, I, R }].slice(-2000),
              logs: [...newLogs, ...prev.logs].slice(0, 300),
            };
          }
          newLogs.push({
            id: lId(),
            timestamp: currentTime,
            message: `💾 Se requiere BACKUP para recuperar ${infectedNodes.length} nodos infectados.`,
            type: 'backup'
          });
          return {
            ...prev,
            S,
            I,
            R,
            currentTime,
            realTime: prev.realTime + realDt,
            peakInfection,
            peakTime,
            networkNodes: nodes,
            healthScore,
            status: 'running',
            mitigations: prev.mitigations,
            trojanNodeId,
            trojanTimer,
            trojanDuration,
            trojanDetected,
            scanActive,
            scanTimer,
            scanDuration,
            scanTargetId,
            rootkitFoundId,
            botnetHubId,
            spywareNodeId,
            spywareExfilTimer,
            trafficDegradation,
            isolatedNodeIds: isolated,
            deadNodeIds: dead,
            originNodeId,
            collapseInfPct: 0,
            collapseDeadPct: 0,
            R0: +(effB / (prev.mode === 'simulation' ? prev.gamma * gm : 1)).toFixed(2),
            history: [...prev.history, { t: currentTime, S, I, R }].slice(-2000),
            logs: [...newLogs, ...prev.logs].slice(0, 300),
          };
        }
      }

      return {
        ...prev,
        S,
        I,
        R,
        currentTime,
        realTime: prev.realTime + realDt,
        peakInfection,
        peakTime,
        networkNodes: nodes,
        healthScore,
        status: 'running',
        mitigations: prev.mode === 'simulation' ? mit : prev.mitigations,
        trojanNodeId,
        trojanTimer,
        trojanDuration,
        trojanDetected,
        scanActive,
        scanTimer,
        scanDuration,
        scanTargetId,
        rootkitFoundId,
        botnetHubId,
        spywareNodeId,
        spywareExfilTimer,
        trafficDegradation,
        isolatedNodeIds: isolated,
        deadNodeIds: dead,
        originNodeId,
        collapseInfPct: 0,
        collapseDeadPct: 0,
        R0: +(effB / (prev.mode === 'simulation' ? prev.gamma * gm : 1)).toFixed(2),
        history: [...prev.history, { t: currentTime, S, I, R }].slice(-2000),
        logs: [...newLogs, ...prev.logs].slice(0, 300),
      };
    });
  }, []);

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    tickingRef.current = false;
    lastTsRef.current = 0;
  }, []);

  const startLoop = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    lastTsRef.current = 0;
    const loop = (ts: number) => {
      const s = stateRef.current;
      if (!s.isRunning || s.isPaused || s.status === 'collapsed' || s.status === 'completed') {
        tickingRef.current = false;
        return;
      }
      if (lastTsRef.current === 0) lastTsRef.current = ts;

      const elapsed = ts - lastTsRef.current;
      if (elapsed >= SIMULATION_TICK_MS) {
        tick(elapsed);
        lastTsRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [tick]);

  const start = useCallback(() => {
    stopLoop();
    setState(prev => {
      const { beta, gamma, N, I0, malwareId, infrastructureId, solver, dt, mode } = prev;
      let nodes = prev.networkNodes;
      let seedNodeId: string | undefined;

      if (nodes.length === 0) {
        const { infra } = computeParams(malwareId, infrastructureId);
        nodes = topologyToNetworkNodes(infra.topologyId, I0, 0, N);
      }

      seedNodeId = nodes.find(n => n.isStructural && n.type !== 'internet' && n.type !== 'firewall')?.id;
      if (!seedNodeId) seedNodeId = nodes.find(n => n.isStructural)?.id;

      nodes = nodes.map(n => ({
        ...n,
        state: n.id === seedNodeId ? 'infected' as const : 'susceptible' as const,
        infectedTime: n.id === seedNodeId ? 0 : undefined,
        isDead: false,
        isTrojan: false,
        isPatched: false,
        isBotnetHub: false,
        isRootkitHidden: false,
        spywareTarget: false,
        trafficLoad: 0,
        backingUp: false,
        backupProgress: 0,
        scanTimer: 0,
        scanDone: false,
      }));

      const malware = getMalwareById(malwareId);
      const infra = getInfrastructureById(infrastructureId);
      const bd = Math.max(3, Math.min(10, 3 + malware.damage));
      const newLogs: LogEntry[] = [];
      const lId = () => logIdRef.current++;

      newLogs.push({ id: lId(), timestamp: 0, message: `🚀 Simulación iniciada — ${malware.name} en ${infra.name} (${N} nodos). Solver: ${solver.toUpperCase()}. Modo: ${mode.toUpperCase()}.`, type: 'info' });

      return {
        ...prev,
        isRunning: true,
        isPaused: false,
        status: 'running',
        currentTime: 0,
        realTime: 0,
        beta,
        gamma,
        N,
        I0,
        dt,
        solver,
        mode,
        S: N - I0,
        I: I0,
        R: 0,
        R0: +(beta / gamma).toFixed(2),
        peakInfection: 0,
        peakTime: 0,
        history: [],
        healthScore: 100,
        mitigations: { firewall: false, patch: false, isolation: false, ids: false, backup: false, scan: false },
        networkNodes: nodes,
        collapseReason: undefined,
        backupTimer: 0,
        backupDuration: bd,
        backupActive: false,
        backupNodeQueue: [],
        trojanNodeId: undefined,
        trojanTimer: 0,
        trojanDuration: 3 + Math.random() * 2,
        trojanDetected: false,
        scanActive: false,
        scanTimer: 0,
        scanDuration: 3,
        scanTargetId: undefined,
        rootkitFoundId: undefined,
        botnetHubId: undefined,
        spywareNodeId: undefined,
        spywareExfilTimer: 0,
        trafficDegradation: prev.malwareId === 'adware' ? 0.1 : 0,
        isolatedNodeIds: [],
        deadNodeIds: [],
        originNodeId: seedNodeId,
        collapseInfPct: 0,
        collapseDeadPct: 0,
        logs: [...newLogs, ...prev.logs].slice(0, 300),
      };
    });
    setTimeout(startLoop, 16);
  }, [stopLoop, startLoop]);

  const pause = useCallback(() => {
    setState(p => ({ ...p, isPaused: !p.isPaused }));
    lastTsRef.current = 0;
  }, []);

  const stop = useCallback(() => {
    stopLoop();
    setState(p => ({ ...p, isRunning: false, isPaused: false, status: 'paused' }));
  }, [stopLoop]);

  const reset = useCallback(() => {
    stopLoop();
    const s = stateRef.current;
    setState(buildInitialState(s.malwareId, s.infrastructureId));
  }, [stopLoop]);

  const updateParam = useCallback((param: string, value: number | string) => {
    setState(prev => {
      const next = { ...prev, [param]: value } as SimulationState;

      if (param === 'N') {
        const newN = value as number;
        next.N = newN;
        next.I0 = Math.min(prev.I0, newN - 1);
        next.S = newN - next.I0;
        next.I = next.I0;
        next.R = 0;
        next.R0 = +(prev.beta / prev.gamma).toFixed(2);
      }
      if (param === 'I0') {
        next.I0 = value as number;
        next.S = prev.N - (value as number);
        next.I = value as number;
        next.R = 0;
      }
      if (param === 'I') {
        next.I0 = value as number;
        next.S = prev.N - (value as number);
        next.I = value as number;
        next.R = 0;
      }
      if (param === 'beta') {
        const b = value as number;
        next.beta = b;
        next.R0 = +(b / prev.gamma).toFixed(2);
      }
      if (param === 'gamma') {
        const g = value as number;
        next.gamma = g;
        next.R0 = +(prev.beta / g).toFixed(2);
      }
      if (param === 'dt') {
        next.dt = value as number;
      }
      return next;
    });
  }, []);

  const setSolver = useCallback((solver: 'euler' | 'rk4') => {
    setState(p => ({ ...p, solver }));
  }, []);

  const setMode = useCallback((mode: 'simulation' | 'interactive') => {
    setState(p => ({ ...p, mode }));
  }, []);

  const toggleMitigation = useCallback((key: MitigationKey) => {
    if (stateRef.current.mode !== 'interactive') return;
    const malware = getMalwareById(stateRef.current.malwareId);
    const infra = getInfrastructureById(stateRef.current.infrastructureId);
    const will = !stateRef.current.mitigations[key];

    setState(p => {
      const newMit = { ...p.mitigations, [key]: !p.mitigations[key] };
      const newLogs: LogEntry[] = [];
      const lId = () => logIdRef.current++;

      if (will) {
        if (malware.harmfulMitigations.includes(key)) {
          newLogs.push({ id: lId(), timestamp: p.currentTime, message: `⚠ ${key.toUpperCase()} es contraproducente contra ${malware.name} — aumenta propagación.`, type: 'warning' });
        }
        if (!infra.availableMitigations.includes(key)) {
          newLogs.push({ id: lId(), timestamp: p.currentTime, message: `⚠ ${infra.name} no soporta ${key.toUpperCase()} — efecto contraproducente.`, type: 'warning' });
        }

        if (key === 'backup') {
          const infectedNodes = p.networkNodes.filter(n => n.state === 'infected' && !n.isDead);
          const isolatedNodes = p.networkNodes.filter(n => n.state === 'isolated' && !n.isDead);
          
          if (infectedNodes.length === 0 && isolatedNodes.length === 0) {
            newLogs.push({ id: lId(), timestamp: p.currentTime, message: `💾 No hay nodos infectados o aislados para recuperar.`, type: 'info' });
            return { ...p, mitigations: newMit, logs: [...newLogs, ...p.logs].slice(0, 300) };
          }

          const newNodes = p.networkNodes.map(n => {
            if ((n.state === 'infected' || n.state === 'isolated') && !n.isDead) {
              return { ...n, state: 'recovered' as const, isTrojan: false, isPatched: true, backingUp: false, backupProgress: 1 };
            }
            return n;
          });

          const recovered = newNodes.filter(n => n.state === 'recovered').length;
          const dead = newNodes.filter(n => n.isDead).length;
          const susceptible = newNodes.filter(n => n.state === 'susceptible').length;

          newLogs.push({
            id: lId(),
            timestamp: p.currentTime,
            message: `💾 Backup completado. ${recovered} nodos recuperados (azul). ${dead} nodos muertos (irrecuperables). ${susceptible} nodos susceptibles.`,
            type: 'backup'
          });

          const I = newNodes.filter(n => n.state === 'infected').length;
          const R = recovered;
          const S = susceptible;

          return {
            ...p,
            mitigations: newMit,
            networkNodes: newNodes,
            I,
            R,
            S,
            isolatedNodeIds: [],
            logs: [...newLogs, ...p.logs].slice(0, 300),
          };
        }

        if (key === 'scan' && will) {
          newLogs.push({ id: lId(), timestamp: p.currentTime, message: `🔍 Escaneo global iniciado (${p.scanDuration}s reales). Detectará amenazas ocultas.`, type: 'scan' });
          return {
            ...p,
            mitigations: newMit,
            scanActive: true,
            scanTimer: 0,
            logs: [...newLogs, ...p.logs].slice(0, 300),
          };
        }
      }

      return { ...p, mitigations: newMit, logs: [...newLogs, ...p.logs].slice(0, 300) };
    });
  }, []);

  const triggerBackupOnNode = useCallback((nodeId: string) => {
    setState(prev => {
      const node = prev.networkNodes.find(n => n.id === nodeId);
      if (!node || node.isDead || node.state === 'recovered') return prev;

      const lId = () => logIdRef.current++;
      const malware = getMalwareById(prev.malwareId);
      const isRansomware = prev.malwareId === 'ransomware';

      if (isRansomware) {
        const backupCount = (node.backupCount || 0) + 1;
        const neededBackups = Math.max(2, Math.min(4, 3 + Math.floor(malware.damage / 2)));

        if (backupCount < neededBackups) {
          const newNodes = prev.networkNodes.map(n => {
            if (n.id === nodeId) {
              return { ...n, backupCount, backingUp: true, backupProgress: backupCount / neededBackups };
            }
            return n;
          });
          newLogs.push({
            id: lId(),
            timestamp: prev.currentTime,
            message: `💾 Backup ${backupCount}/${neededBackups} en "${node.name}" — Ransomware requiere ${neededBackups} backups.`,
            type: 'backup'
          });
          return { ...prev, networkNodes: newNodes, logs: [...newLogs, ...prev.logs].slice(0, 300) };
        } else {
          const newNodes = prev.networkNodes.map(n => {
            if (n.id === nodeId) {
              return { ...n, state: 'recovered' as const, backupCount: 0, backingUp: false, backupProgress: 1, isTrojan: false };
            }
            return n;
          });
          newLogs.push({
            id: lId(),
            timestamp: prev.currentTime,
            message: `✅ "${node.name}" recuperado después de ${neededBackups} backups.`,
            type: 'backup'
          });
          return { ...prev, networkNodes: newNodes, logs: [...newLogs, ...prev.logs].slice(0, 300) };
        }
      }

      const newNodes = prev.networkNodes.map(n => {
        if (n.id === nodeId && (n.state === 'infected' || n.state === 'isolated')) {
          return { ...n, state: 'recovered' as const, backingUp: false, backupProgress: 1, isTrojan: false, isPatched: true };
        }
        return n;
      });

      newLogs.push({
        id: lId(),
        timestamp: prev.currentTime,
        message: `💾 Backup completado en "${node.name}". Nodo recuperado (azul).`,
        type: 'backup'
      });

      return { ...prev, networkNodes: newNodes, logs: [...newLogs, ...prev.logs].slice(0, 300) };
    });
  }, []);

  const isolateNode = useCallback((nodeId: string) => {
    setState(prev => {
      const n = prev.networkNodes.find(x => x.id === nodeId);
      if (!n || n.state === 'isolated' || n.isDead) return prev;
      const lId = () => logIdRef.current++;
      return {
        ...prev,
        networkNodes: prev.networkNodes.map(x => x.id === nodeId ? { ...x, state: 'isolated' as const } : x),
        isolatedNodeIds: [...prev.isolatedNodeIds, nodeId],
        logs: [{ id: lId(), timestamp: prev.currentTime, message: `🔒 "${n.name}" aislado manualmente.`, type: 'mitigation' }, ...prev.logs].slice(0, 300),
      };
    });
  }, []);

  const patchNode = useCallback((nodeId: string) => {
    setState(prev => {
      const n = prev.networkNodes.find(x => x.id === nodeId);
      if (!n || n.isDead || n.state === 'recovered') return prev;
      const lId = () => logIdRef.current++;
      const clrTrojan = prev.trojanNodeId === nodeId;
      return {
        ...prev,
        networkNodes: prev.networkNodes.map(x =>
          x.id === nodeId ? { ...x, state: 'recovered' as const, isPatched: true, isTrojan: false, infectedTime: 0 } : x
        ),
        trojanNodeId: clrTrojan ? undefined : prev.trojanNodeId,
        trojanTimer: clrTrojan ? 0 : prev.trojanTimer,
        logs: [{ id: lId(), timestamp: prev.currentTime, message: `🔧 "${n.name}" parcheado y recuperado.`, type: 'mitigation' }, ...prev.logs].slice(0, 300),
      };
    });
  }, []);

  const scanNode = useCallback((nodeId: string) => {
    setState(prev => {
      if (!prev.mitigations.scan) return prev;
      const n = prev.networkNodes.find(x => x.id === nodeId);
      if (!n) return prev;
      const lId = () => logIdRef.current++;
      const newLogs: LogEntry[] = [];

      if (prev.malwareId === 'rootkit' && n.state === 'infected') {
        newLogs.push({ id: lId(), timestamp: prev.currentTime, message: `🔍 ¡Rootkit encontrado en "${n.name}"! Parchea y aísla inmediatamente.`, type: 'scan' });
        return {
          ...prev,
          rootkitFoundId: nodeId,
          networkNodes: prev.networkNodes.map(x => x.id === nodeId ? { ...x, isRootkitHidden: false, scanTargetId: nodeId } : x),
          scanTargetId: nodeId,
          logs: [...newLogs, ...prev.logs].slice(0, 300),
        };
      }

      if (n.isTrojan) {
        newLogs.push({ id: lId(), timestamp: prev.currentTime, message: `🔍 ¡Troyano detectado en "${n.name}"! Aísla o parchea.`, type: 'scan' });
        return {
          ...prev,
          trojanDetected: true,
          networkNodes: prev.networkNodes.map(x => x.id === nodeId ? { ...x, state: 'infected' as const } : x),
          logs: [...newLogs, ...prev.logs].slice(0, 300),
        };
      }

      newLogs.push({ id: lId(), timestamp: prev.currentTime, message: `🔍 "${n.name}" escaneado — sin amenazas detectadas.`, type: 'scan' });
      return { ...prev, logs: [...newLogs, ...prev.logs].slice(0, 300) };
    });
  }, []);

  const selectMalware = useCallback((malwareId: string) => {
    if (stateRef.current.isRunning) return;
    stopLoop();
    const newState = buildInitialState(malwareId, stateRef.current.infrastructureId);
    setState({
      ...newState,
      mode: stateRef.current.mode,
      solver: stateRef.current.solver,
    });
  }, [stopLoop]);

  const selectInfrastructure = useCallback((infrastructureId: string) => {
    if (stateRef.current.isRunning) return;
    stopLoop();
    const newState = buildInitialState(stateRef.current.malwareId, infrastructureId);
    setState({
      ...newState,
      mode: stateRef.current.mode,
      solver: stateRef.current.solver,
    });
  }, [stopLoop]);

  useEffect(() => {
    if (state.isRunning && !state.isPaused && state.status === 'running') startLoop();
  }, [state.isRunning, state.isPaused, state.status, startLoop]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  return {
    state,
    start,
    pause,
    stop,
    reset,
    updateParam,
    setSolver,
    setMode,
    toggleMitigation,
    isolateNode,
    patchNode,
    scanNode,
    triggerBackupOnNode,
    selectMalware,
    selectInfrastructure,
  };
}