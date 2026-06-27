import type { TopologyDef, TopologyNodeDef } from '../types/labedo';
import type { NetworkNode } from '../hooks/useSimulation';

const W = 800;
const H = 500;

// ─── Helpers ────────────────────────────────────────────────────────────────

function n(
  id: string,
  name: string,
  type: TopologyNodeDef['type'],
  x: number,
  y: number,
  icon: string,
  connections: string[],
  vulnerable = false,
  zone?: string
): TopologyNodeDef {
  return { id, name, type, x: x / W, y: y / H, icon, connections, vulnerable, zone };
}

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export interface ZoneDef {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  iconChar: string;
}

export const topologyZones: Record<string, ZoneDef[]> = {
  university: [
    { id: 'dmz',   label: 'SERVIDORES DMZ',    x: 0.06, y: 0.30, w: 0.22, h: 0.32, iconChar: '⬡' },
    { id: 'users', label: 'RED DE USUARIOS',   x: 0.32, y: 0.38, w: 0.22, h: 0.32, iconChar: '⬡' },
    { id: 'corp',  label: 'RED CORPORATIVA',   x: 0.56, y: 0.30, w: 0.22, h: 0.32, iconChar: '⬡' },
    { id: 'iot',   label: 'DISPOSITIVOS IoT',  x: 0.32, y: 0.72, w: 0.22, h: 0.22, iconChar: '⬡' },
    { id: 'db',    label: 'BASE DE DATOS',     x: 0.80, y: 0.38, w: 0.18, h: 0.28, iconChar: '⬡' },
  ],
  hospital: [
    { id: 'emr',      label: 'SISTEMA EMR',       x: 0.06, y: 0.30, w: 0.22, h: 0.32, iconChar: '⬡' },
    { id: 'imaging',  label: 'RADIOLOGÍA/PACS',   x: 0.32, y: 0.30, w: 0.22, h: 0.32, iconChar: '⬡' },
    { id: 'pharmacy', label: 'FARMACIA',           x: 0.56, y: 0.30, w: 0.20, h: 0.32, iconChar: '⬡' },
    { id: 'iot',      label: 'IoT MÉDICO',         x: 0.32, y: 0.66, w: 0.22, h: 0.26, iconChar: '⬡' },
    { id: 'db',       label: 'BD PACIENTES',       x: 0.80, y: 0.35, w: 0.18, h: 0.28, iconChar: '⬡' },
  ],
  datacenter: [
    { id: 'web',   label: 'CAPA WEB',        x: 0.08, y: 0.26, w: 0.38, h: 0.28, iconChar: '⬡' },
    { id: 'app',   label: 'CAPA APLICACIÓN', x: 0.08, y: 0.56, w: 0.38, h: 0.28, iconChar: '⬡' },
    { id: 'db',    label: 'ALMACENAMIENTO',  x: 0.54, y: 0.38, w: 0.38, h: 0.36, iconChar: '⬡' },
  ],
  enterprise: [
    { id: 'hr',      label: 'RRHH',          x: 0.06, y: 0.36, w: 0.22, h: 0.30, iconChar: '⬡' },
    { id: 'finance', label: 'FINANZAS',      x: 0.30, y: 0.36, w: 0.22, h: 0.30, iconChar: '⬡' },
    { id: 'mail',    label: 'SERVICIOS',     x: 0.54, y: 0.36, w: 0.22, h: 0.30, iconChar: '⬡' },
    { id: 'ws',      label: 'ESTACIONES',    x: 0.30, y: 0.68, w: 0.40, h: 0.24, iconChar: '⬡' },
  ],
  industrial: [
    { id: 'scada',    label: 'SCADA / HMI',   x: 0.28, y: 0.30, w: 0.44, h: 0.26, iconChar: '⬡' },
    { id: 'plc',      label: 'PLCs / CONTROL', x: 0.06, y: 0.58, w: 0.38, h: 0.28, iconChar: '⬡' },
    { id: 'sensors',  label: 'SENSORES IoT',  x: 0.56, y: 0.58, w: 0.36, h: 0.28, iconChar: '⬡' },
  ],
  smartfactory: [
    { id: 'mes',     label: 'SISTEMA MES',    x: 0.28, y: 0.26, w: 0.44, h: 0.26, iconChar: '⬡' },
    { id: 'robots',  label: 'ROBOTS / AGVs',  x: 0.06, y: 0.54, w: 0.36, h: 0.30, iconChar: '⬡' },
    { id: 'iot',     label: 'LÍNEA IoT',      x: 0.56, y: 0.54, w: 0.36, h: 0.30, iconChar: '⬡' },
  ],
  critical: [
    { id: 'power',     label: 'RED ELÉCTRICA',     x: 0.04, y: 0.36, w: 0.22, h: 0.30, iconChar: '⬡' },
    { id: 'water',     label: 'RED HÍDRICA',        x: 0.28, y: 0.36, w: 0.22, h: 0.30, iconChar: '⬡' },
    { id: 'transport', label: 'TRANSPORTE',         x: 0.52, y: 0.36, w: 0.22, h: 0.30, iconChar: '⬡' },
    { id: 'telecom',   label: 'TELECOMUNICACIONES', x: 0.76, y: 0.36, w: 0.22, h: 0.30, iconChar: '⬡' },
    { id: 'ops',       label: 'CENTRO OPS',         x: 0.28, y: 0.70, w: 0.44, h: 0.22, iconChar: '⬡' },
  ],
};

export const TYPE_ICONS: Record<string, string> = {
  internet:    '◎',
  firewall:    '◈',
  router:      '◇',
  server:      '▣',
  database:    '⬡',
  pc:          '▢',
  iot:         '◉',
  plc:         '◧',
  cloud:       '⬡',
  workstation: '▢',
};

export const topologies: TopologyDef[] = [
  {
    id: 'university',
    name: 'Universidad',
    nodes: [
      n('internet', 'Internet',      'internet',  400,  28, '🌐', ['firewall']),
      n('firewall', 'Firewall',      'firewall',  400,  78, '🛡️', ['internet', 'core']),
      n('core',     'Core Switch',   'router',    400, 128, '⬡',  ['firewall', 'dmz1', 'users', 'corp', 'iot1']),
      n('dmz1', 'Srv DMZ',    'server', 130, 230, '⬡', ['core', 'dmz2'], false, 'dmz'),
      n('dmz2', 'Srv Web',    'server', 220, 260, '⬡', ['core', 'dmz1'], false, 'dmz'),
      n('users', 'Red Usuarios', 'router', 370, 235, '⬡', ['core', 'pc1', 'pc2'], false, 'users'),
      n('pc1',   'PC Lab A',    'pc',     340, 290, '⬡', ['users'], false, 'users'),
      n('pc2',   'PC Lab B',    'pc',     420, 290, '⬡', ['users'], false, 'users'),
      n('corp', 'Red Corp',      'router', 570, 235, '⬡', ['core', 'srv1'], false, 'corp'),
      n('srv1', 'Srv Interno',   'server', 590, 290, '⬡', ['corp', 'db'],   false, 'corp'),
      n('iot1', 'IoT Campus',  'iot', 380, 395, '⬡', ['users', 'core'], true, 'iot'),
      n('db', 'Base de Datos', 'database', 690, 285, '⬡', ['corp', 'srv1'], false, 'db'),
    ],
  },
  {
    id: 'hospital',
    name: 'Hospital',
    nodes: [
      n('internet', 'Internet',  'internet', 400,  28, '🌐', ['firewall']),
      n('firewall', 'Firewall',  'firewall', 400,  78, '🛡️', ['internet', 'core']),
      n('core',     'Core',      'router',   400, 128, '⬡',  ['firewall', 'emr', 'pacs', 'pharmacy', 'iot1']),
      n('emr',  'Sistema EMR', 'server', 140, 235, '⬡', ['core', 'db'], false, 'emr'),
      n('wkemr','PC Médico',   'pc',     180, 295, '⬡', ['emr'],        false, 'emr'),
      n('pacs',  'Srv PACS',    'server', 370, 235, '⬡', ['core'],       false, 'imaging'),
      n('xray',  'Radiología',  'pc',     410, 295, '⬡', ['pacs'],       false, 'imaging'),
      n('pharmacy', 'Farmacia',    'server', 580, 235, '⬡', ['core'],       false, 'pharmacy'),
      n('disp',     'Dispensador', 'iot',    620, 295, '⬡', ['pharmacy'],   true,  'pharmacy'),
      n('iot1', 'Monitor UCI',  'iot', 360, 390, '⬡', ['core'],        true,  'iot'),
      n('iot2', 'Monitor UCI2', 'iot', 430, 390, '⬡', ['core'],        true,  'iot'),
      n('db', 'BD Pacientes', 'database', 690, 245, '⬡', ['emr'], false, 'db'),
    ],
  },
  {
    id: 'datacenter',
    name: 'Datacenter',
    nodes: [
      n('internet', 'Internet',      'internet', 400,  28, '🌐', ['lb']),
      n('lb',       'Load Balancer', 'router',   400,  90, '⬡',  ['internet', 'web1', 'web2']),
      n('web1', 'Web Srv 1', 'server', 160, 210, '⬡', ['lb', 'app1'], false, 'web'),
      n('web2', 'Web Srv 2', 'server', 320, 210, '⬡', ['lb', 'app1'], false, 'web'),
      n('web3', 'Web Srv 3', 'server', 240, 260, '⬡', ['lb', 'app2'], false, 'web'),
      n('app1', 'App Srv 1', 'server', 160, 370, '⬡', ['web1', 'db'],    false, 'app'),
      n('app2', 'App Srv 2', 'server', 320, 370, '⬡', ['web3', 'db'],    false, 'app'),
      n('db',    'DB Cluster',  'database', 590, 280, '⬡', ['app1', 'app2', 'cache'], false, 'db'),
      n('cache', 'Redis Cache', 'server',   680, 330, '⬡', ['db'],                     false, 'db'),
      n('bkp',   'Backup Srv',  'server',   660, 220, '⬡', ['db'],                     false, 'db'),
    ],
  },
  {
    id: 'enterprise',
    name: 'Empresa',
    nodes: [
      n('internet', 'Internet',  'internet', 400,  28, '🌐', ['fw']),
      n('fw',       'Firewall',  'firewall', 400,  80, '🛡️', ['internet', 'core']),
      n('core',     'Core',      'router',   400, 140, '⬡',  ['fw', 'hr', 'finance', 'mail']),
      n('hr',  'Recursos Humanos', 'server', 140, 250, '⬡', ['core'],         false, 'hr'),
      n('hrpc','PC RRHH',          'pc',     185, 310, '⬡', ['hr'],           false, 'hr'),
      n('finance', 'Finanzas',    'server', 370, 250, '⬡', ['core', 'dbfin'], false, 'finance'),
      n('dbfin',   'BD Financ.',  'database',370, 320, '⬡', ['finance'],      false, 'finance'),
      n('mail', 'Email Srv',  'server', 590, 250, '⬡', ['core'], false, 'mail'),
      n('web',  'Intranet',   'server', 630, 310, '⬡', ['mail'], false, 'mail'),
      n('ws1', 'Estación 1', 'pc', 370, 405, '⬡', ['core'], false, 'ws'),
      n('ws2', 'Estación 2', 'pc', 460, 405, '⬡', ['core'], false, 'ws'),
    ],
  },
  {
    id: 'industrial',
    name: 'Industria',
    nodes: [
      n('internet', 'Internet',     'internet', 400,  28, '🌐', ['fw']),
      n('fw',       'Firewall OT',  'firewall', 400,  80, '🛡️', ['internet', 'scada']),
      n('scada', 'SCADA',    'server', 310, 195, '⬡', ['fw', 'plc1', 'plc2', 'hmi'], false, 'scada'),
      n('hmi',   'Panel HMI','pc',     490, 195, '⬡', ['scada'],                      false, 'scada'),
      n('plc1', 'PLC Línea 1', 'plc', 160, 340, '⬡', ['scada'], true,  'plc'),
      n('plc2', 'PLC Línea 2', 'plc', 270, 340, '⬡', ['scada'], true,  'plc'),
      n('plc3', 'PLC Línea 3', 'plc', 200, 400, '⬡', ['scada'], true,  'plc'),
      n('sens1',    'Sensor T',     'iot', 520, 330, '⬡', ['scada'], true,  'sensors'),
      n('sens2',    'Sensor P',     'iot', 620, 330, '⬡', ['scada'], true,  'sensors'),
      n('historian','Historian DB', 'database', 400, 430, '⬡', ['scada'], false, 'sensors'),
    ],
  },
  {
    id: 'smartfactory',
    name: 'Smart Factory',
    nodes: [
      n('internet', 'Internet', 'internet', 400,  28, '🌐', ['fw']),
      n('fw',       'Firewall', 'firewall', 400,  80, '🛡️', ['internet', 'mes']),
      n('mes',     'Sistema MES',   'server', 340, 185, '⬡', ['fw', 'robot1', 'robot2', 'iot1'], false, 'mes'),
      n('digital', 'Gemelo Digital','cloud',  480, 185, '⬡', ['mes'],                             false, 'mes'),
      n('robot1', 'Robot 1', 'iot', 150, 340, '⬡', ['mes'], false, 'robots'),
      n('robot2', 'Robot 2', 'iot', 250, 340, '⬡', ['mes'], true,  'robots'),
      n('agv1',   'AGV 1',   'iot', 200, 400, '⬡', ['mes'], true,  'robots'),
      n('iot1', 'Línea IoT',  'iot', 530, 330, '⬡', ['mes'], true,  'iot'),
      n('qc',   'Control QC', 'server', 630, 330, '⬡', ['mes'], false, 'iot'),
    ],
  },
  {
    id: 'critical',
    name: 'Infra. Crítica',
    nodes: [
      n('internet', 'Internet',       'internet', 400,  28, '🌐', ['fw']),
      n('fw',       'Firewall',       'firewall', 400,  80, '🛡️', ['internet', 'core']),
      n('core',     'SCADA Nacional', 'server',   400, 140, '⬡',  ['fw', 'power', 'water', 'transport', 'telecom']),
      n('power',  'Red Eléctrica', 'server', 100, 280, '⬡', ['core'], true,  'power'),
      n('pwsub',  'Subestación',   'iot',    145, 345, '⬡', ['power'],true,  'power'),
      n('water',  'Red Hídrica',   'server', 290, 280, '⬡', ['core'], false, 'water'),
      n('pump',   'Estación Bombeo','iot',   335, 345, '⬡', ['water'],true,  'water'),
      n('transport','Transporte',  'server', 510, 280, '⬡', ['core'], false, 'transport'),
      n('signal',   'Señalización','iot',    555, 345, '⬡', ['transport'],true,'transport'),
      n('telecom', 'Telecom',   'router', 700, 280, '⬡', ['core'],     false, 'telecom'),
      n('antenna', 'Antena',    'iot',    720, 345, '⬡', ['telecom'],  true,  'telecom'),
      n('ops', 'Centro Ops', 'database', 400, 420, '⬡', ['core', 'power', 'water'], false, 'ops'),
    ],
  },
];

export function getTopologyById(id: string): TopologyDef {
  return topologies.find((t) => t.id === id) ?? topologies[1];
}

function generatePopulationNodes(
  topologyId: string,
  structuralNodes: TopologyNodeDef[],
  totalN: number
): TopologyNodeDef[] {
  const zones = topologyZones[topologyId] ?? [];
  if (zones.length === 0) return [];

  const structural = structuralNodes.length;
  const extras = Math.min(60, Math.max(0, Math.floor((totalN - structural * 20) / 40)));
  if (extras <= 0) return [];

  const result: TopologyNodeDef[] = [];

  zones.forEach((zone, zi) => {
    const share = Math.round(extras / zones.length) + (zi === 0 ? extras % zones.length : 0);
    const anchors = structuralNodes.filter((s) => s.zone === zone.id);

    for (let i = 0; i < share; i++) {
      let px: number;
      let py: number;

      if (anchors.length > 0) {
        const anchor = anchors[Math.floor(Math.random() * anchors.length)];
        const spread = 0.08;
        px = clamp(anchor.x + rnd(-spread, spread), zone.x + 0.02, zone.x + zone.w - 0.02);
        py = clamp(anchor.y + rnd(-spread, spread), zone.y + 0.02, zone.y + zone.h - 0.02);
      } else {
        px = rnd(zone.x + 0.03, zone.x + zone.w - 0.03);
        py = rnd(zone.y + 0.03, zone.y + zone.h - 0.03);
      }

      let closestId = anchors[0]?.id ?? structuralNodes[0].id;
      let minDist = Infinity;
      structuralNodes.forEach((s) => {
        const d = Math.hypot(s.x - px, s.y - py);
        if (d < minDist) { minDist = d; closestId = s.id; }
      });

      result.push({
        id: `pop_${zone.id}_${i}`,
        name: `${zone.label.split(' ')[0]} ${i + 1}`,
        type: 'pc',
        x: px,
        y: py,
        icon: TYPE_ICONS['pc'],
        connections: [closestId],
        vulnerable: Math.random() < 0.15,
        zone: zone.id,
      });
    }
  });

  return result;
}

// ─── MAIN: topologyToNetworkNodes ─────────────────────────────────────────────

export function topologyToNetworkNodes(
  topologyId: string,
  sirI: number,
  sirR: number,
  sirN: number
): NetworkNode[] {
  console.log('🔵 topologyToNetworkNodes - INICIO');
  console.log('  sirI:', sirI, 'sirR:', sirR, 'sirN:', sirN);
  
  const topology = getTopologyById(topologyId);

  const structuralWithIcons: TopologyNodeDef[] = topology.nodes.map((node) => ({
    ...node,
    icon: node.type === 'internet' ? '◎'
        : node.type === 'firewall' ? '◈'
        : TYPE_ICONS[node.type] ?? '▢',
  }));

  const popNodes = generatePopulationNodes(topologyId, structuralWithIcons, sirN);
  const allDefs = [...structuralWithIcons, ...popNodes];
  const count = allDefs.length;

  console.log('  Nodos estructurales:', structuralWithIcons.length);
  console.log('  Nodos poblacion:', popNodes.length);
  console.log('  Total:', count);

  const infectedTarget = Math.max(1, Math.round((sirI / sirN) * count));
  const recoveredTarget = Math.round((sirR / sirN) * count);

  const vulnerablePool = allDefs.filter((d) => d.vulnerable && d.type !== 'internet' && d.type !== 'firewall');
  const normalPool = allDefs.filter((d) => d.type !== 'internet' && d.type !== 'firewall');
  const pool = vulnerablePool.length > 0 ? vulnerablePool : normalPool;

  const seedIdx = Math.floor(Math.random() * pool.length);
  const seedId = pool[seedIdx].id;

  const infectedSet = new Set<string>();
  const recoveredSet = new Set<string>();

  const adj = new Map<string, string[]>();
  allDefs.forEach((d) => {
    adj.set(d.id, [...(d.connections ?? [])]);
    (d.connections ?? []).forEach((cid) => {
      if (!adj.has(cid)) adj.set(cid, []);
      adj.get(cid)!.push(d.id);
    });
  });

  const queue: string[] = [seedId];
  infectedSet.add(seedId);

  while (infectedSet.size < infectedTarget && queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adj.get(current) ?? [];
    const shuffled = [...neighbors].sort(() => Math.random() - 0.5);
    for (const nb of shuffled) {
      if (!infectedSet.has(nb) && !recoveredSet.has(nb)) {
        infectedSet.add(nb);
        queue.push(nb);
        if (infectedSet.size >= infectedTarget) break;
      }
    }
  }

  const recQueue = [...infectedSet].sort(() => Math.random() - 0.5);
  for (const id of recQueue) {
    if (recoveredSet.size >= recoveredTarget) break;
    recoveredSet.add(id);
    infectedSet.delete(id);
  }

  const result = allDefs.map((def) => {
    let state: NetworkNode['state'] = 'susceptible';
    if (infectedSet.has(def.id)) state = 'infected';
    if (recoveredSet.has(def.id)) state = 'recovered';

    const isStructural = !def.id.startsWith('pop_');

    return {
      id: def.id,
      name: def.name,
      type: def.type,
      state,
      x: def.x,
      y: def.y,
      icon: def.icon ?? TYPE_ICONS[def.type] ?? '▢',
      connections: def.connections,
      isStructural,
      vulnerable: def.vulnerable,
      infectedTime: state === 'infected' ? 0 : undefined,
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
    };
  });

  console.log('🔵 topologyToNetworkNodes - RESULTADO:', result.length, 'nodos');
  console.log('  Primer nodo:', result[0]?.id, result[0]?.name);
  console.log('  Ultimo nodo:', result[result.length - 1]?.id, result[result.length - 1]?.name);
  
  return result;
}

// ─── syncNetworkWithSIR ─── CON LOGS DE DEPURACION ───────────────────────────

export function syncNetworkWithSIR(
  nodes: NetworkNode[],
  I: number,
  R: number,
  N: number
): NetworkNode[] {
  console.log('🟢 syncNetworkWithSIR - INICIO');
  console.log('  Nodos entrantes:', nodes.length);
  console.log('  I:', I, 'R:', R, 'N:', N);
  
  if (nodes.length === 0) {
    console.warn('🟢 syncNetworkWithSIR - ⚠️ NO HAY NODOS!');
    return nodes;
  }

  // Guardar para verificar
  const originalIds = new Set(nodes.map(n => n.id));
  const originalCount = nodes.length;
  console.log('  IDs originales:', originalIds.size);

  const count = nodes.length;
  const infectedTarget = Math.max(0, Math.round((I / N) * count));
  const recoveredTarget = Math.max(0, Math.round((R / N) * count));

  console.log('  infectedTarget:', infectedTarget, 'recoveredTarget:', recoveredTarget);

  const adj = new Map<string, string[]>();
  nodes.forEach((node) => {
    adj.set(node.id, [...(node.connections ?? [])]);
    (node.connections ?? []).forEach((cid) => {
      if (!adj.has(cid)) adj.set(cid, []);
      adj.get(cid)!.push(node.id);
    });
  });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const currentInfected = nodes.filter((n) => n.state === 'infected' && !n.isDead);
  const currentRecovered = nodes.filter((n) => n.state === 'recovered');
  const currentSusceptible = nodes.filter((n) => n.state === 'susceptible' && !n.isDead);

  console.log('  currentInfected:', currentInfected.length);
  console.log('  currentRecovered:', currentRecovered.length);
  console.log('  currentSusceptible:', currentSusceptible.length);

  const infectedSet = new Set(currentInfected.map((n) => n.id));
  const recoveredSet = new Set(currentRecovered.map((n) => n.id));

  const diff = infectedTarget - infectedSet.size;

  if (diff > 0) {
    const frontier = [...infectedSet];
    const candidates: string[] = [];
    frontier.forEach((id) => {
      (adj.get(id) ?? []).forEach((nb) => {
        const nbNode = nodeMap.get(nb);
        if (nbNode && nbNode.state === 'susceptible' && !infectedSet.has(nb) && !recoveredSet.has(nb) && !nbNode.isDead) {
          candidates.push(nb);
        }
      });
    });

    const vulnCandidates = candidates.filter((id) => nodeMap.get(id)?.vulnerable);
    const otherCandidates = candidates.filter((id) => !nodeMap.get(id)?.vulnerable);
    const ordered = [
      ...vulnCandidates.sort(() => Math.random() - 0.5),
      ...otherCandidates.sort(() => Math.random() - 0.5),
    ];

    const toInfect = ordered.length > 0
      ? ordered
      : currentSusceptible.map((n) => n.id).sort(() => Math.random() - 0.5);

    let added = 0;
    for (const id of toInfect) {
      if (added >= diff) break;
      infectedSet.add(id);
      added++;
    }
    console.log('  Infectados añadidos:', added);
  } else if (diff < 0) {
    const toRecover = [...infectedSet]
      .map((id) => ({ id, t: nodeMap.get(id)?.infectedTime ?? 0 }))
      .sort((a, b) => a.t - b.t)
      .slice(0, -diff)
      .map((x) => x.id);

    toRecover.forEach((id) => {
      infectedSet.delete(id);
      recoveredSet.add(id);
    });
    console.log('  Recuperados por exceso:', toRecover.length);
  }

  const recovDiff = recoveredTarget - recoveredSet.size;
  if (recovDiff > 0) {
    const toRecover = [...infectedSet]
      .map((id) => ({ id, t: nodeMap.get(id)?.infectedTime ?? 0 }))
      .sort((a, b) => a.t - b.t)
      .slice(0, recovDiff)
      .map((x) => x.id);
    toRecover.forEach((id) => {
      infectedSet.delete(id);
      recoveredSet.add(id);
    });
    console.log('  Recuperados adicionales:', toRecover.length);
  }

  // ─── MAPEAR RESULTADOS ──────────────────────────────────────────
  const result = nodes.map((node) => {
    if (node.isDead) {
      return { ...node };
    }
    
    let state: NetworkNode['state'] = 'susceptible';
    if (node.state === 'isolated') state = 'isolated';
    else if (recoveredSet.has(node.id)) state = 'recovered';
    else if (infectedSet.has(node.id)) state = 'infected';
    
    return {
      ...node,
      state,
      infectedTime:
        state === 'infected'
          ? (node.infectedTime ?? 0) + 1
          : undefined,
    };
  });

  // ─── VERIFICAR QUE NO SE PERDIERON NODOS ──────────────────────────
  const resultIds = new Set(result.map(n => n.id));
  const missingIds = [...originalIds].filter(id => !resultIds.has(id));
  
  if (missingIds.length > 0) {
    console.error('🟢 syncNetworkWithSIR - ⚠️ NODOS PERDIDOS!', missingIds);
    // Recuperar nodos perdidos
    const missingNodes = nodes.filter(n => missingIds.includes(n.id));
    result.push(...missingNodes);
    console.log('  Nodos recuperados:', missingNodes.length);
  }

  console.log('🟢 syncNetworkWithSIR - RESULTADO:', result.length, 'nodos');
  
  if (result.length !== originalCount) {
    console.error('🟢 syncNetworkWithSIR - ⚠️ CONTEO DIFERENTE!', originalCount, '→', result.length);
  }

  return result;
}