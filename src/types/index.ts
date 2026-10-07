export type DeviceClassKey = 'sensors' | 'traffic' | 'surveillance' | 'emergency';

export interface DeviceClassConfig {
  id: DeviceClassKey;
  name: string;
  category: string;
  defaultCountPerDistrict: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  iconName: string;
  serviceCode: string; // Hex char: '1', '2', '3', '4'
  serviceCodeName: string;
  vlanRange: string;
  qosDscp: string;
  addressingMode: string;
  protocols: string[];
  description: string;
  technicalNotes: string[];
  securityProfile: string;
}

export interface CityConfig {
  districts: number;
  devicesPerClass: Record<DeviceClassKey, number>;
  growthRatePct: number;
  planningHorizonYears: number;
}

export interface SubnetNode {
  id: string;
  name: string;
  type: 'city' | 'district' | 'service' | 'zone' | 'subnet';
  ipv6Prefix: string;
  ipv6HostCapacity: string;
  ipv4Cidr?: string;
  ipv4HostCapacity?: number;
  gatewayIpv6?: string;
  gatewayIpv4?: string;
  vlanId?: number;
  serviceCode?: string;
  deviceClass?: DeviceClassKey;
  children?: SubnetNode[];
  description?: string;
  purpose?: string;
}

export interface SuitabilityCriterion {
  id: string;
  name: string;
  category: 'Scale' | 'Protocol' | 'Operations' | 'Security';
  description: string;
  iotRelevance: string;
  defaultWeight: number; // 1-10
  ipv4Score: number; // 1-10
  ipv6Score: number; // 1-10
  ipv4Notes: string;
  ipv6Notes: string;
}

export interface ComparisonItem {
  id: string;
  category: string;
  attribute: string;
  ipv4: string;
  ipv6: string;
  iotImpact: string;
  isIotCritical: boolean;
  verdict: 'IPv6 Advantage' | 'IPv4 Advantage' | 'Neutral';
  glossaryKey?: string;
}

export interface MigrationPhase {
  phaseNumber: number;
  title: string;
  timeframe: string;
  status: 'Complete' | 'Active' | 'Planned' | 'Future';
  architecture: string;
  keyActions: string[];
  risks: string[];
  mitigations: string[];
  technologies: string[];
}
