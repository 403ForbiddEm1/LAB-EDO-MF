import { useRef, useEffect, useState, useCallback } from 'react';
import type { NetworkNode } from '../hooks/useSimulation';

interface NetworkTopologyProps {
  nodes: NetworkNode[];
  totalNodes: number;
  infrastructureName?: string;
  mode?: 'simulation' | 'interactive';
  onIsolationActive?: (active: boolean, countdown: number) => void;
  onIsolateNode?: (nodeId: string) => void;
  onPatchNode?: (nodeId: string) => void;
  onScanNode?: (nodeId: string) => void;
  onBackupNode?: (nodeId: string) => void;
  trojanDetected?: boolean;
  trojanNodeId?: string;
  rootkitFoundId?: string;
  scanActive?: boolean;
}

const NODE_COLORS: Record<string, string> = {
  susceptible: '#3B82F6',
  infected:    '#EF4444',
  recovered:   '#22C55E',
  isolated:    '#EAB308',
  dead:        '#2a2a2a',
};

const STATE_LABELS: Record<string, string> = {
  susceptible: 'Susceptible',
  infected:    'Infectado',
  recovered:   'Recuperado',
  isolated:    'Aislado',
  dead:        'Muerto',
};

const TYPE_LABELS: Record<string, string> = {
  internet: 'Internet',
  firewall: 'Firewall',
  router:   'Router/Switch',
  server:   'Servidor',
  database: 'Base de Datos',
  pc:       'Workstation',
  iot:      'Dispositivo IoT',
  plc:      'PLC/Control',
  cloud:    'Cloud',
  workstation: 'Workstation',
};

const ISOLATION_MS = 5000;

function satelliteCount(totalN: number, structuralCount: number): number {
  const base = Math.floor(totalN / Math.max(1, structuralCount * 20));
  return Math.min(Math.max(base, 3), 18);
}

function structuralR(type: string): number {
  switch (type) {
    case 'internet':  return 28;
    case 'firewall':  return 26;
    case 'router':    return 24;
    case 'cloud':     return 24;
    case 'database':  return 22;
    case 'server':    return 22;
    case 'plc':       return 20;
    case 'iot':       return 20;
    default:          return 20;
  }
}

function drawIcon(ctx: CanvasRenderingContext2D, type: string, r: number, color: string) {
  const s = r * 0.52;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (type) {
    case 'internet': {
      ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.48, s, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.85, -s * 0.5); ctx.lineTo(s * 0.85, -s * 0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.85, s * 0.5); ctx.lineTo(s * 0.85, s * 0.5); ctx.stroke();
      break;
    }
    case 'firewall': {
      ctx.beginPath();
      ctx.moveTo(0, -s); ctx.lineTo(s, -s * 0.45);
      ctx.lineTo(s, s * 0.2);
      ctx.quadraticCurveTo(s, s * 0.85, 0, s);
      ctx.quadraticCurveTo(-s, s * 0.85, -s, s * 0.2);
      ctx.lineTo(-s, -s * 0.45); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, s * 0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.45, 0); ctx.lineTo(s * 0.45, 0); ctx.stroke();
      break;
    }
    case 'router': {
      const hw = s * 0.88, hh = s * 0.38;
      ctx.strokeRect(-hw, -hh, hw * 2, hh * 2);
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i * s * 0.3, -hh);
        ctx.lineTo(i * s * 0.3, -hh - s * 0.28);
        ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(-hw * 0.45, 0, s * 0.09, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, s * 0.09, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hw * 0.45, 0, s * 0.09, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'server': {
      const sw = s * 0.88;
      [-s * 0.5, -s * 0.12, s * 0.26].forEach(y => {
        ctx.strokeRect(-sw, y, sw * 2, s * 0.32);
        ctx.beginPath(); ctx.arc(sw - s * 0.16, y + s * 0.16, s * 0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-sw + s * 0.12, y + s * 0.16); ctx.lineTo(-sw + s * 0.5, y + s * 0.16); ctx.stroke();
      });
      break;
    }
    case 'database': {
      const rx = s * 0.72, ry = s * 0.18;
      ctx.beginPath(); ctx.ellipse(0, -s * 0.42, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, s * 0.42, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-rx, -s * 0.42); ctx.lineTo(-rx, s * 0.42); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx, -s * 0.42); ctx.lineTo(rx, s * 0.42); ctx.stroke();
      break;
    }
    case 'pc':
    case 'workstation': {
      const mw = s * 0.8, mh = s * 0.55;
      ctx.strokeRect(-mw, -s * 0.9, mw * 2, mh * 1.5);
      ctx.strokeRect(-mw * 0.72, -s * 0.75, mw * 1.44, mh * 1.05);
      ctx.beginPath(); ctx.moveTo(0, -s * 0.9 + mh * 1.5); ctx.lineTo(0, s * 0.55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.4, s * 0.55); ctx.lineTo(s * 0.4, s * 0.55); ctx.stroke();
      break;
    }
    case 'iot': {
      ctx.beginPath(); ctx.arc(0, s * 0.15, s * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, s * 0.15 - s * 0.18); ctx.lineTo(0, -s * 0.25); ctx.stroke();
      [0.48, 0.78].forEach(sc => {
        ctx.globalAlpha = 0.9 - sc * 0.5;
        ctx.beginPath(); ctx.arc(0, 0, s * sc, Math.PI + 0.5, -0.5); ctx.stroke();
        ctx.globalAlpha = 1;
      });
      break;
    }
    case 'plc': {
      const pw = s * 0.78, ph = s * 0.65;
      ctx.strokeRect(-pw, -ph, pw * 2, ph * 2);
      [-1, 0, 1].forEach(i => {
        ctx.beginPath(); ctx.moveTo(-pw, i * ph * 0.6); ctx.lineTo(-pw - s * 0.22, i * ph * 0.6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pw, i * ph * 0.6); ctx.lineTo(pw + s * 0.22, i * ph * 0.6); ctx.stroke();
      });
      ctx.font = `bold ${s * 0.42}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PLC', 0, 0);
      break;
    }
    case 'cloud': {
      ctx.beginPath();
      ctx.arc(-s * 0.28, s * 0.05, s * 0.36, Math.PI, 0);
      ctx.arc(s * 0.22, -s * 0.04, s * 0.4, Math.PI * 1.1, 0);
      ctx.arc(s * 0.08, -s * 0.28, s * 0.3, -0.1, Math.PI * 0.9);
      ctx.arc(-s * 0.42, s * 0.05, s * 0.26, Math.PI * 1.5, Math.PI * 2.5);
      ctx.closePath(); ctx.stroke();
      break;
    }
    default: {
      ctx.beginPath();
      ctx.moveTo(0, -s); ctx.lineTo(s, 0); ctx.lineTo(0, s); ctx.lineTo(-s, 0);
      ctx.closePath(); ctx.stroke();
    }
  }
}

function satellitePositions(
  cx: number,
  cy: number,
  count: number,
  minR: number,
  maxR: number,
  seed: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  let rng = seed;
  const rand = () => {
    rng = (rng * 16807 + 0) % 2147483647;
    return (rng - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let placed = false;
    while (attempts < 30 && !placed) {
      const angle = rand() * Math.PI * 2;
      const dist = minR + rand() * (maxR - minR);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const ok = positions.every(p => Math.hypot(p.x - x, p.y - y) > 10);
      if (ok) {
        positions.push({ x, y });
        placed = true;
      }
      attempts++;
    }
    if (!placed) {
      const angle = (i / count) * Math.PI * 2;
      const dist = minR + (maxR - minR) * 0.5;
      positions.push({ x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist });
    }
  }
  return positions;
}

export default function NetworkTopology({
  nodes,
  totalNodes,
  infrastructureName,
  mode = 'simulation',
  onIsolationActive,
  onIsolateNode,
  onPatchNode,
  onScanNode,
  onBackupNode,
  trojanDetected = false,
  trojanNodeId,
  rootkitFoundId,
  scanActive = false,
}: NetworkTopologyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef(nodes);
  const modeRef = useRef(mode);
  const totalRef = useRef(totalNodes);

  const isoTimers = useRef<Map<string, { deadline: number; startTime: number }>>(new Map());
  const [isoCountdown, setIsoCountdown] = useState(0);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    node: NetworkNode;
  } | null>(null);
  
  // Estados para feedback visual de escaneo
  const [scanningNodes, setScanningNodes] = useState<Map<string, number>>(new Map());
  
  // Estados para feedback visual de backup
  const [backupNodes, setBackupNodes] = useState<Map<string, { progress: number; duration: number; startTime: number }>>(new Map());

  const satPosCache = useRef<Map<string, { x: number; y: number }[]>>(new Map());

  useEffect(() => {
    nodesRef.current = nodes;
    satPosCache.current.clear();
  }, [nodes]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    totalRef.current = totalNodes;
    satPosCache.current.clear();
  }, [totalNodes]);

  // ─── ISOLATION TIMERS ──────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      let max = 0;
      isoTimers.current.forEach((data, nodeId) => {
        const rem = data.deadline - now;
        if (rem <= 0) {
          isoTimers.current.delete(nodeId);
        } else if (rem > max) {
          max = rem;
        }
      });
      const secs = Math.ceil(max / 1000);
      setIsoCountdown(secs);
      onIsolationActive?.(max > 0, secs);
    }, 100);
    return () => clearInterval(id);
  }, [onIsolationActive]);

  // ─── ESCANEO: animación de barra ──────────────────────────────────────────
  useEffect(() => {
    const scanInterval = setInterval(() => {
      const now = Date.now();
      const newScanning = new Map(scanningNodes);
      let changed = false;
      
      newScanning.forEach((startTime, nodeId) => {
        const elapsed = (now - startTime) / 1000;
        if (elapsed >= 1.5) { // 1.5 segundos de escaneo
          newScanning.delete(nodeId);
          changed = true;
        }
      });
      
      if (changed) {
        setScanningNodes(newScanning);
      }
    }, 50);
    
    return () => clearInterval(scanInterval);
  }, [scanningNodes]);

  // ─── BACKUP: animación de progreso ────────────────────────────────────────
  useEffect(() => {
    const backupInterval = setInterval(() => {
      const now = Date.now();
      const newBackup = new Map(backupNodes);
      let changed = false;
      
      newBackup.forEach((data, nodeId) => {
        const elapsed = (now - data.startTime) / 1000;
        const progress = Math.min(1, elapsed / data.duration);
        if (progress >= 1) {
          newBackup.delete(nodeId);
          changed = true;
        } else {
          newBackup.set(nodeId, { ...data, progress });
          changed = true;
        }
      });
      
      if (changed) {
        setBackupNodes(newBackup);
      }
    }, 100);
    
    return () => clearInterval(backupInterval);
  }, [backupNodes]);

  const draw = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const W = canvas.width,
        H = canvas.height;
      const now = Date.now();
      const cur = nodesRef.current;
      const N = totalRef.current;

      ctx.fillStyle = '#07101E';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(25,45,85,0.3)';
      for (let x = 24; x < W; x += 28)
        for (let y = 24; y < H; y += 28) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

      const structural = cur.filter(n => n.isStructural !== false && !n.id.startsWith('pop_'));
      const satCount = satelliteCount(N, structural.length);

      const pos = new Map<string, { x: number; y: number }>();
      cur.forEach(n => pos.set(n.id, { x: n.x * W, y: n.y * H }));

      const satMap = new Map<string, { x: number; y: number; state: string }[]>();
      structural.forEach((node, idx) => {
        const p = pos.get(node.id)!;
        const r = structuralR(node.type);
        const cacheKey = `${node.id}-${satCount}-${W}-${H}`;
        let positions: { x: number; y: number }[];
        if (satPosCache.current.has(cacheKey)) {
          positions = satPosCache.current.get(cacheKey)!;
        } else {
          positions = satellitePositions(p.x, p.y, satCount, r + 18, r + 55, idx * 7919 + satCount);
          satPosCache.current.set(cacheKey, positions);
        }

        const totalInfected = cur.filter(n => n.state === 'infected').length;
        const totalRecovered = cur.filter(n => n.state === 'recovered').length;
        const infectedFrac = totalInfected / Math.max(1, cur.length);
        const recoveredFrac = totalRecovered / Math.max(1, cur.length);
        const nInfected = node.state === 'infected'
          ? Math.max(1, Math.round(satCount * Math.min(0.8, infectedFrac * 2)))
          : 0;
        const nRecovered = node.state === 'recovered' ? Math.round(satCount * recoveredFrac) : 0;

        const sats = positions.map((p2, i) => ({
          x: p2.x,
          y: p2.y,
          state: i < nInfected ? 'infected' : i < nInfected + nRecovered ? 'recovered' : 'susceptible',
        }));
        satMap.set(node.id, sats);
      });

      satMap.forEach((sats, nodeId) => {
        const hub = pos.get(nodeId)!;
        sats.forEach(sat => {
          const infected = sat.state === 'infected';
          ctx.strokeStyle = infected ? 'rgba(239,68,68,0.22)' : 'rgba(40,80,160,0.2)';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(hub.x, hub.y);
          ctx.lineTo(sat.x, sat.y);
          ctx.stroke();
        });
      });

      const drawn = new Set<string>();
      structural.forEach(node => {
        node.connections?.forEach(tid => {
          const target = cur.find(n => n.id === tid);
          if (!target) return;
          const key = [node.id, tid].sort().join('|');
          if (drawn.has(key)) return;
          drawn.add(key);
          const pA = pos.get(node.id)!,
            pB = pos.get(tid)!;
          const infected = node.state === 'infected' || target.state === 'infected';
          const mx = (pA.x + pB.x) / 2 - (pB.y - pA.y) * 0.08;
          const my = (pA.y + pB.y) / 2 + (pB.x - pA.x) * 0.08;
          ctx.strokeStyle = infected ? 'rgba(239,68,68,0.35)' : 'rgba(50,100,200,0.28)';
          ctx.lineWidth = infected ? 1.4 : 1.0;
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.quadraticCurveTo(mx, my, pB.x, pB.y);
          ctx.stroke();

          const traffic = Math.min(1, node.trafficLoad ?? 0);
          if (traffic > 0.1 && !target.isDead && !node.isDead) {
            const alpha = 0.1 + traffic * 0.6;
            const width = 0.5 + traffic * 3;
            const count = Math.floor(1 + traffic * 4);
            for (let i = 0; i < count; i++) {
              const offset = ((ts / 800 + i * 0.3 + (node.id.charCodeAt(0) % 10) * 0.05) % 1);
              const t = offset;
              const px = (1 - t) * (1 - t) * pA.x + 2 * (1 - t) * t * mx + t * t * pB.x;
              const py = (1 - t) * (1 - t) * pA.y + 2 * (1 - t) * t * my + t * t * pB.y;
              const color = infected ? `rgba(255, 50, 50, ${alpha})` : `rgba(0, 200, 255, ${alpha * 0.7})`;
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(px, py, width, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      });

      structural.filter(n => n.state === 'infected').forEach(node => {
        node.connections?.forEach(tid => {
          const target = cur.find(n => n.id === tid);
          if (!target || target.state !== 'susceptible') return;
          const pA = pos.get(node.id)!,
            pB = pos.get(tid)!;
          const mx = (pA.x + pB.x) / 2 - (pB.y - pA.y) * 0.08;
          const my = (pA.y + pB.y) / 2 + (pB.x - pA.x) * 0.08;
          [0, 0.4, 0.75].forEach(off => {
            const t = ((ts * 0.0007 + off) % 1);
            const px = (1 - t) * (1 - t) * pA.x + 2 * (1 - t) * t * mx + t * t * pB.x;
            const py = (1 - t) * (1 - t) * pA.y + 2 * (1 - t) * t * my + t * t * pB.y;
            const g = ctx.createRadialGradient(px, py, 0, px, py, 4);
            g.addColorStop(0, 'rgba(239,68,68,0.95)');
            g.addColorStop(1, 'rgba(239,68,68,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
          });
        });
      });

      satMap.forEach(sats => {
        sats.forEach(sat => {
          const color = NODE_COLORS[sat.state as keyof typeof NODE_COLORS] ?? '#3B82F6';
          const g = ctx.createRadialGradient(sat.x, sat.y, 0, sat.x, sat.y, 6);
          g.addColorStop(0, color + 'DD');
          g.addColorStop(1, color + '00');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(sat.x, sat.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(sat.x, sat.y, 2.8, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // ─── NODOS ESTRUCTURALES ──────────────────────────────────────────────
      structural.forEach(node => {
        const p = pos.get(node.id)!;
        const nx = p.x,
          ny = p.y;
        const r = structuralR(node.type);
        const color = NODE_COLORS[node.state] ?? '#3B82F6';
        const isoData = isoTimers.current.get(node.id);
        const isIso = !!isoData;
        const scanStart = scanningNodes.get(node.id);
        const backupData = backupNodes.get(node.id);

        if (node.state === 'dead' || node.isDead) {
          ctx.fillStyle = '#1a1a1a';
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(nx, ny, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#555';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('💀', nx, ny + 2);
          return;
        }

        // ─── AISLAMIENTO: Círculo amarillo con cuenta regresiva ───────────
        if (isIso) {
          const remaining = (isoData.deadline - now) / 1000;
          const frac = Math.max(0, Math.min(1, remaining / (ISOLATION_MS / 1000)));
          ctx.save();
          ctx.strokeStyle = '#EAB308';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#EAB308';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(nx, ny, r + 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
          ctx.stroke();
          ctx.restore();
          
          // Texto de cuenta regresiva
          ctx.fillStyle = '#EAB308';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`🔒 ${Math.ceil(remaining)}s`, nx, ny - r - 12);
        }

        // ─── ESCANEO: Barra de arriba a abajo ──────────────────────────────
        if (scanStart) {
          const elapsed = (now - scanStart) / 1000;
          const progress = Math.min(1, elapsed / 1.5);
          const barY = ny - r - 5 + progress * (r * 2 + 10);
          
          ctx.save();
          // Barra de escaneo
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 + 0.7 * (1 - progress)})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(nx - r - 5, barY);
          ctx.lineTo(nx + r + 5, barY);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Texto "ESCANEANDO"
          ctx.fillStyle = `rgba(0, 212, 255, ${0.5 + 0.5 * (1 - progress)})`;
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText('🔍 ESCANEANDO', nx, ny - r - 22);
          ctx.restore();
        }

        // ─── TROYANO detectado ──────────────────────────────────────────────
        if (node.isTrojan && trojanDetected) {
          const pulse = 0.5 + 0.5 * Math.sin(ts / 200);
          ctx.save();
          ctx.strokeStyle = `rgba(255, 0, 0, ${pulse})`;
          ctx.lineWidth = 4;
          ctx.shadowColor = 'red';
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.arc(nx, ny, r + 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText('⚠ TROYANO', nx, ny - r - 8);
        }

        // ─── ROOTKIT encontrado ─────────────────────────────────────────────
        if (node.id === rootkitFoundId) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 100, 0, 0.8)';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.shadowColor = 'orange';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(nx, ny, r + 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();

          ctx.fillStyle = '#FF6600';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText('👁 ROOTKIT', nx, ny - r - 8);
        }

        // ─── PARCHEADO: Texto verde ─────────────────────────────────────────
        if (node.isPatched && node.state === 'recovered') {
          ctx.fillStyle = '#22C55E';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText('✅ PARCHEADO', nx, ny - r - 8);
        }

        // ─── BACKUP: Barra de progreso con segundos ─────────────────────────
        if (backupData) {
          const remaining = Math.max(0, backupData.duration - (now - backupData.startTime) / 1000);
          const progress = backupData.progress;
          
          ctx.save();
          // Barra circular de progreso
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.2 + 0.8 * progress})`;
          ctx.lineWidth = 4;
          ctx.shadowColor = '#22C55E';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(nx, ny, r + 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
          ctx.stroke();
          ctx.restore();
          
          // Texto con segundos restantes
          ctx.fillStyle = '#22C55E';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`💾 ${Math.ceil(remaining)}s`, nx, ny - r - 24);
          
          // Texto "BACKUP" debajo
          ctx.fillStyle = `rgba(34, 197, 94, ${0.5 + 0.5 * progress})`;
          ctx.font = 'bold 7px sans-serif';
          ctx.textBaseline = 'top';
          ctx.fillText('BACKUP', nx, ny + r + 6);
        }

        // ─── Glow de infección ──────────────────────────────────────────────
        if (node.state === 'infected') {
          const pulse = 0.07 + 0.05 * Math.sin(ts / 240 + nx * 0.012);
          const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, r + 22);
          g.addColorStop(0, `rgba(239,68,68,${pulse})`);
          g.addColorStop(1, 'rgba(239,68,68,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(nx, ny, r + 22, 0, Math.PI * 2);
          ctx.fill();
        }

        // ─── Anillo de estado ──────────────────────────────────────────────
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(nx, ny, r + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = color + '44';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(nx, ny, r + 7, 0, Math.PI * 2);
        ctx.stroke();

        // ─── Fondo del nodo ──────────────────────────────────────────────────
        const bg = ctx.createRadialGradient(nx - r * 0.25, ny - r * 0.25, 0, nx, ny, r);
        bg.addColorStop(0, '#1C2E4A');
        bg.addColorStop(1, '#0A1525');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fill();

        // ─── Icono ──────────────────────────────────────────────────────────
        ctx.save();
        ctx.translate(nx, ny - 5);
        ctx.globalAlpha = 0.9;
        drawIcon(ctx, node.type, r, color);
        ctx.globalAlpha = 1;
        ctx.restore();

        // ─── Label ──────────────────────────────────────────────────────────
        ctx.fillStyle = 'rgba(200,220,255,0.85)';
        ctx.font = `600 ${Math.max(7, r * 0.28)}px Inter,sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        const lbl = node.name.length > 13 ? node.name.slice(0, 11) + '…' : node.name;
        ctx.fillText(lbl, nx, ny + r * 0.72);

        // ─── Vulnerable ─────────────────────────────────────────────────────
        if (node.vulnerable && node.state !== 'recovered') {
          ctx.save();
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 8;
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('!', nx + r * 0.68, ny - r * 0.68);
          ctx.restore();
        }
      });

      const legend = [
        { l: 'Susceptible', c: '#3B82F6' },
        { l: 'Infectado', c: '#EF4444' },
        { l: 'Recuperado', c: '#22C55E' },
        { l: 'Aislado', c: '#EAB308' },
        { l: 'Muerto', c: '#2a2a2a' },
      ];
      let lx = 10;
      const ly = H - 10;
      ctx.font = '8px Inter,sans-serif';
      ctx.textBaseline = 'middle';
      legend.forEach(item => {
        ctx.save();
        ctx.shadowColor = item.c;
        ctx.shadowBlur = 6;
        ctx.fillStyle = item.c;
        ctx.beginPath();
        ctx.arc(lx + 4, ly, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = 'rgba(148,163,184,0.65)';
        ctx.textAlign = 'left';
        ctx.fillText(item.l, lx + 11, ly);
        lx += ctx.measureText(item.l).width + 22;
      });
      ctx.fillStyle = 'rgba(60,90,140,0.4)';
      ctx.font = '7px Inter,sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${infrastructureName ?? ''} · N=${totalNodes}`, W - 8, H - 10);

      animRef.current = requestAnimationFrame(draw);
    },
    [infrastructureName, totalNodes, trojanDetected, rootkitFoundId, scanActive, scanningNodes, backupNodes]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [draw]);

  const hitTest = useCallback(
    (ex: number, ey: number, rect: DOMRect) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const mx = ex - rect.left,
        my = ey - rect.top;
      const W = canvas.offsetWidth,
        H = canvas.offsetHeight;
      const structural = nodesRef.current.filter(n => n.isStructural !== false && !n.id.startsWith('pop_'));
      return (
        structural.find(n => {
          const nx = n.x * W,
            ny = n.y * H;
          const r = structuralR(n.type) + 10;
          return Math.hypot(nx - mx, ny - my) < r;
        }) ?? null
      );
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const found = hitTest(e.clientX, e.clientY, rect);
      if (found) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, node: found });
      else setTooltip(null);
    },
    [hitTest]
  );

  // ─── CLICK IZQUIERDO: BACKUP ──────────────────────────────────────────────
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0) return;
      if (modeRef.current !== 'interactive') return;
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const found = hitTest(e.clientX, e.clientY, rect);
      if (!found) return;

      const node = nodesRef.current.find(n => n.id === found.id);
      if (!node) return;

      if (!node.isDead && node.state !== 'recovered') {
        if (onBackupNode) {
          onBackupNode(found.id);
          // Iniciar feedback visual de backup
          const duration = 3 + Math.random() * 5; // 3-8 segundos
          setBackupNodes(prev => {
            const newMap = new Map(prev);
            newMap.set(found.id, { progress: 0, duration, startTime: Date.now() });
            return newMap;
          });
        }
      }
    },
    [hitTest, onBackupNode]
  );

  // ─── DOBLE CLICK IZQUIERDO: PARCHAR ──────────────────────────────────────
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (modeRef.current !== 'interactive') return;
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const found = hitTest(e.clientX, e.clientY, rect);
      if (!found) return;

      const node = nodesRef.current.find(n => n.id === found.id);
      if (!node) return;

      // Solo se puede parchear si está infectado o vulnerable
      if ((node.state === 'infected' || node.vulnerable) && !node.isDead) {
        if (onPatchNode) {
          onPatchNode(found.id);
        }
      }
    },
    [hitTest, onPatchNode]
  );

  // ─── CLICK DERECHO: ESCANEAR ──────────────────────────────────────────────
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (modeRef.current !== 'interactive') return;
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const found = hitTest(e.clientX, e.clientY, rect);
      if (!found) return;

      const node = nodesRef.current.find(n => n.id === found.id);
      if (!node) return;

      if (!node.isDead) {
        if (onScanNode) {
          onScanNode(found.id);
        }
        // Iniciar feedback visual de escaneo
        setScanningNodes(prev => {
          const newMap = new Map(prev);
          newMap.set(found.id, Date.now());
          return newMap;
        });
      }
    },
    [hitTest, onScanNode]
  );

  // ─── DOBLE CLICK DERECHO: AISLAR ──────────────────────────────────────────
  const [rightClickTimer, setRightClickTimer] = useState<NodeJS.Timeout | null>(null);
  const [rightClickNodeId, setRightClickNodeId] = useState<string | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (modeRef.current !== 'interactive') return;
      
      if (e.button !== 2) return;
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const found = hitTest(e.clientX, e.clientY, rect);
      if (!found) return;

      const node = nodesRef.current.find(n => n.id === found.id);
      if (!node) return;

      if (rightClickTimer && rightClickNodeId === found.id) {
        // ─── DOBLE CLICK DERECHO: AISLAR ──────────────────────────────
        clearTimeout(rightClickTimer);
        setRightClickTimer(null);
        setRightClickNodeId(null);
        
        if (found.type !== 'internet' && found.type !== 'firewall' && !node.isDead) {
          if (onIsolateNode) {
            onIsolateNode(found.id);
          }
          const deadline = Date.now() + ISOLATION_MS;
          isoTimers.current.set(found.id, { deadline, startTime: Date.now() });
          setTimeout(() => isoTimers.current.delete(found.id), ISOLATION_MS + 150);
        }
        return;
      }

      setRightClickNodeId(found.id);
      
      if (rightClickTimer) {
        clearTimeout(rightClickTimer);
      }
      
      const timer = setTimeout(() => {
        // ─── CLICK DERECHO SIMPLE: ESCANEAR ──────────────────────────────
        if (!node.isDead) {
          if (onScanNode) {
            onScanNode(found.id);
          }
          setScanningNodes(prev => {
            const newMap = new Map(prev);
            newMap.set(found.id, Date.now());
            return newMap;
          });
        }
        setRightClickTimer(null);
        setRightClickNodeId(null);
      }, 300);
      
      setRightClickTimer(timer);
    },
    [hitTest, onIsolateNode, onScanNode, rightClickTimer, rightClickNodeId]
  );

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      <div
        className="panel-header"
        style={{
          padding: '7px 12px',
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--bg-panel)',
          flexShrink: 0,
        }}
      >
        <span>Infraestructura Tecnológica{infrastructureName ? ` — ${infrastructureName}` : ''}</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {isoCountdown > 0 && (
            <span style={{ fontSize: 9, color: '#EAB308', fontWeight: 700, animation: 'blink 1s infinite' }}>
              🔒 ISOLATION — {isoCountdown}s
            </span>
          )}
          {scanActive && (
            <span style={{ fontSize: 9, color: '#00D4FF', fontWeight: 700 }}>
              🔍 ESCANEO ACTIVO
            </span>
          )}
          {trojanDetected && (
            <span style={{ fontSize: 9, color: '#EF4444', fontWeight: 700, animation: 'blink 0.5s infinite' }}>
              ⚠ TROYANO DETECTADO
            </span>
          )}
          {mode === 'interactive' && (
            <span style={{ fontSize: 9, color: 'rgba(100,140,200,0.5)' }}>
              click→backup · doble click→parchear · click derecho→escanear · doble click derecho→aislar
            </span>
          )}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: 0, background: '#07101E' }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleContextMenu}
          onMouseLeave={() => {
            setTooltip(null);
            if (rightClickTimer) {
              clearTimeout(rightClickTimer);
              setRightClickTimer(null);
              setRightClickNodeId(null);
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
        />

        {tooltip && (() => {
          const n = tooltip.node;
          const color = NODE_COLORS[n.state] ?? '#3B82F6';
          const isoData = isoTimers.current.get(n.id);
          const isoSecs = isoData ? Math.ceil((isoData.deadline - Date.now()) / 1000) : 0;
          const structural = nodesRef.current.filter(x => x.isStructural !== false && !x.id.startsWith('pop_'));
          const groupSize = Math.round(totalNodes / Math.max(1, structural.length));
          const gInfected = n.state === 'infected' ? Math.round(groupSize * 0.65) : 0;
          const gRecovered = n.state === 'recovered' ? groupSize : 0;
          const gSusc = groupSize - gInfected - gRecovered;

          const isTrojanNode = n.isTrojan && trojanDetected;
          const isRootkitNode = n.id === rootkitFoundId;

          return (
            <div
              style={{
                position: 'absolute',
                left: Math.min(tooltip.x + 16, (canvasRef.current?.offsetWidth ?? 500) - 200),
                top: Math.max(tooltip.y - 90, 4),
                background: 'rgba(5,10,22,0.97)',
                border: `1px solid ${color}28`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 8,
                padding: '10px 14px',
                pointerEvents: 'none',
                zIndex: 100,
                minWidth: 186,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 8px ${color}`,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{n.name}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 1 }}>
                {TYPE_LABELS[n.type] ?? n.type}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color, marginBottom: 7 }}>{STATE_LABELS[n.state]}</div>

              {isTrojanNode && (
                <div style={{ fontSize: 10, color: '#FF4444', fontWeight: 700, marginBottom: 7 }}>
                  ⚠ TROYANO DETECTADO
                </div>
              )}
              {isRootkitNode && (
                <div style={{ fontSize: 10, color: '#FF6600', fontWeight: 700, marginBottom: 7 }}>
                  👁 ROOTKIT ENCONTRADO
                </div>
              )}
              {n.isPatched && (
                <div style={{ fontSize: 10, color: '#22C55E', fontWeight: 600, marginBottom: 7 }}>
                  ✅ PARCHEADO
                </div>
              )}
              {n.isDead && (
                <div style={{ fontSize: 10, color: '#666', fontWeight: 700, marginBottom: 7 }}>
                  💀 MUERTO (irrecuperable)
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px', marginBottom: 5 }}>
                {[
                  ['Nodos grupo', groupSize, 'var(--text-primary)'],
                  ['% Infección', `${Math.round((gInfected / groupSize) * 100)}%`, '#EF4444'],
                  ['Susceptibles', gSusc, '#3B82F6'],
                  ['Infectados', gInfected, '#EF4444'],
                  ['Recuperados', gRecovered, '#22C55E'],
                  ['Conexiones', n.connections?.length ?? 0, 'var(--text-secondary)'],
                ].map(([label, val, col]) => (
                  <>
                    <span key={`l-${label}`} style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                      {label}:
                    </span>
                    <span key={`v-${label}`} style={{ fontSize: 9, color: col as string, fontWeight: 600 }}>
                      {val}
                    </span>
                  </>
                ))}
              </div>

              {n.vulnerable && (
                <div style={{ fontSize: 9, color: '#EF4444', marginBottom: 3 }}>⚠ Nodo vulnerable</div>
              )}
              {isoSecs > 0 && (
                <div style={{ fontSize: 9, color: '#EAB308', fontWeight: 700 }}>
                  🔒 Aislado — {isoSecs}s restantes
                </div>
              )}
              {n.isPatched && (
                <div style={{ fontSize: 9, color: '#22C55E', fontWeight: 600 }}>
                  ✅ Nodo parcheado
                </div>
              )}
              {n.trafficLoad && n.trafficLoad > 0.1 && (
                <div style={{ fontSize: 8, color: 'rgba(100,116,139,0.6)', marginTop: 2 }}>
                  📡 Tráfico: {Math.round((1 - (n.trafficLoad || 0)) * 100)}%
                </div>
              )}
              {mode === 'interactive' && n.type !== 'internet' && n.type !== 'firewall' && !n.isDead && (
                <div style={{ fontSize: 8, color: 'rgba(148,163,184,0.3)', marginTop: 5 }}>
                  click→backup · doble click→parchear · click derecho→escanear · doble click derecho→aislar
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}