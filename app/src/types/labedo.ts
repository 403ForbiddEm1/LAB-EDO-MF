export type MitigationKey = 'firewall' | 'isolation' | 'patch' | 'ids' | 'backup' | 'scan';

export interface MalwareDef {
  id: string;
  name: string;
  type: string;
  risk: string;
  riskClass: string;
  desc: string;
  icon: string;
  beta: number;
  gamma: number;
  infectivity: number;
  stealth: number;
  damage: number;
  recommendedMitigations: MitigationKey[];
  harmfulMitigations: MitigationKey[];
  documentationId: string;
}

export interface InfrastructureDef {
  id: string;
  name: string;
  type: string;
  icon: string;
  nodeCount: number;
  complexity: number;
  securityLevel: number;
  criticality: number;
  collapseThreshold: number;
  baseBetaModifier: number;
  baseGammaModifier: number;
  desc: string;
  availableMitigations: MitigationKey[];
  documentationId: string;
  topologyId: string;
}

export interface MitigationDef {
  id: MitigationKey;
  name: string;
  desc: string;
  effect: string;
  betaMultiplier: number;
  gammaMultiplier: number;
  documentationId: string;
}

export interface DocEntry {
  id: string;
  title: string;
  category: 'malware' | 'infrastructure' | 'mitigation' | 'math' | 'guide';
  summary: string;
  sections: { title: string; content: string }[];
  tags: string[];
}

export interface TopologyNodeDef {
  id: string;
  name: string;
  type: 'internet' | 'firewall' | 'router' | 'server' | 'database' | 'pc' | 'iot' | 'plc' | 'cloud' | 'workstation';
  x: number;
  y: number;
  icon: string;
  connections: string[];
  vulnerable?: boolean;
  zone?: string;
}

export interface TopologyDef {
  id: string;
  name: string;
  nodes: TopologyNodeDef[];
}