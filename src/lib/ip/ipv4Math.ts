/**
 * Real IPv4 Mathematical & VLSM Utilities for Smart City Addressing.
 */

export interface IPv4SubnetInfo {
  cidr: string;
  networkAddress: string;
  netmask: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalAddresses: number;
  usableHosts: number;
  prefixLength: number;
}

/**
 * Convert IPv4 dotted string (e.g. "10.1.0.0") to unsigned 32-bit integer
 */
export function ipv4ToInt(ip: string): number {
  return (
    ip
      .split('.')
      .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0) >>> 0
  );
}

/**
 * Convert unsigned 32-bit integer to IPv4 dotted string
 */
export function intToIPv4(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

/**
 * Calculate netmask from prefix length (0-32)
 */
export function prefixToNetmask(prefix: number): string {
  if (prefix === 0) return '0.0.0.0';
  const mask = ((0xffffffff << (32 - prefix)) >>> 0);
  return intToIPv4(mask);
}

/**
 * Detailed subnet calculation from a CIDR notation string (e.g. "10.1.0.0/17")
 */
export function calculateIPv4Subnet(cidrStr: string): IPv4SubnetInfo {
  const [ipStr, prefixStr] = cidrStr.split('/');
  const prefix = parseInt(prefixStr || '24', 10);
  const ipInt = ipv4ToInt(ipStr || '0.0.0.0');

  const maskInt = prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0);
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

  const totalAddresses = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, totalAddresses - 2);

  const firstUsableInt = prefix >= 31 ? networkInt : networkInt + 1;
  const lastUsableInt = prefix >= 31 ? broadcastInt : broadcastInt - 1;

  return {
    cidr: `${intToIPv4(networkInt)}/${prefix}`,
    networkAddress: intToIPv4(networkInt),
    netmask: intToIPv4(maskInt),
    broadcastAddress: intToIPv4(broadcastInt),
    firstUsableHost: intToIPv4(firstUsableInt),
    lastUsableHost: intToIPv4(lastUsableInt),
    totalAddresses,
    usableHosts,
    prefixLength: prefix
  };
}

/**
 * Determine the smallest IPv4 prefix length needed to accommodate a given number of hosts
 */
export function getRequiredPrefixLength(hostCount: number): number {
  if (hostCount <= 0) return 32;
  // Account for network and broadcast address
  const needed = hostCount + 2;
  const bitsNeeded = Math.ceil(Math.log2(needed));
  const prefix = 32 - bitsNeeded;
  return Math.max(0, Math.min(30, prefix));
}

export interface IPv4DistrictPlan {
  districtId: number;
  districtBlock: string; // 10.<district>.0.0/16
  sensorsSubnet: IPv4SubnetInfo; // e.g. 10.D.0.0/17 (32,766 hosts)
  surveillanceSubnet: IPv4SubnetInfo; // e.g. 10.D.128.0/19 (8,190 hosts)
  trafficSubnet: IPv4SubnetInfo; // e.g. 10.D.160.0/20 (4,094 hosts)
  emergencySubnet: IPv4SubnetInfo; // e.g. 10.D.176.0/21 (2,046 hosts)
  reservedBlock: string; // e.g. 10.D.184.0/21 + remaining
  totalAllocatedHosts: number;
  districtDeficit: number; // If requested exceeds 65,534
  isExhausted: boolean;
}

/**
 * Generate standard VLSM IPv4 plan for a District (10.<district>.0.0/16)
 */
export function generateDistrictIPv4Plan(
  districtId: number,
  devices: {
    sensors: number;
    traffic: number;
    surveillance: number;
    emergency: number;
  }
): IPv4DistrictPlan {
  // District base: 10.<district>.0.0/16 (supports max 65,534 hosts)
  const d = Math.max(1, Math.min(254, districtId));
  const districtBlock = `10.${d}.0.0/16`;

  // Pre-configured fixed VLSM blocks within /16:
  // 10.D.0.0/17    -> Sensors: 32,766 hosts (50% of district)
  // 10.D.128.0/19  -> Surveillance: 8,190 hosts (12.5%)
  // 10.D.160.0/20  -> Traffic: 4,094 hosts (6.25%)
  // 10.D.176.0/21  -> Emergency: 2,046 hosts (3.125%)
  // 10.D.184.0/21  -> Management & expansion reserved
  const sensorsSubnet = calculateIPv4Subnet(`10.${d}.0.0/17`);
  const surveillanceSubnet = calculateIPv4Subnet(`10.${d}.128.0/19`);
  const trafficSubnet = calculateIPv4Subnet(`10.${d}.160.0/20`);
  const emergencySubnet = calculateIPv4Subnet(`10.${d}.176.0/21`);

  const requestedTotal = devices.sensors + devices.traffic + devices.surveillance + devices.emergency;
  const maxDistrictUsable = 65534;
  const isExhausted = requestedTotal > maxDistrictUsable;
  const districtDeficit = Math.max(0, requestedTotal - maxDistrictUsable);

  return {
    districtId: d,
    districtBlock,
    sensorsSubnet,
    surveillanceSubnet,
    trafficSubnet,
    emergencySubnet,
    reservedBlock: `10.${d}.184.0/21`,
    totalAllocatedHosts: maxDistrictUsable,
    districtDeficit,
    isExhausted
  };
}

/**
 * Calculate City-wide IPv4 Exhaustion & Carrier-Grade NAT (CGNAT) Metrics
 */
export function calculateIPv4CityDeficit(
  districtsCount: number,
  devicesPerDistrict: {
    sensors: number;
    traffic: number;
    surveillance: number;
    emergency: number;
  }
) {
  const devicesPerDist = devicesPerDistrict.sensors + devicesPerDistrict.traffic + devicesPerDistrict.surveillance + devicesPerDistrict.emergency;
  const totalCityDevices = devicesPerDist * districtsCount;

  // RFC 1918 Private Pools:
  // 10.0.0.0/8: 16,777,216 addresses
  // 172.16.0.0/12: 1,048,576 addresses
  // 192.168.0.0/16: 65,536 addresses
  // Total usable private RFC1918 = ~17,891,328 addresses
  const rfc1918Total = 17891328;
  const class10Total = 16777216;

  // In standard clean /16 per district architecture (10.D.0.0/16):
  // 256 districts * 65,534 hosts = 16,776,704 hosts
  const class10CleanMax = Math.min(districtsCount, 254) * 65534;

  const rfc1918Exhausted = totalCityDevices > rfc1918Total;
  const class10Exhausted = totalCityDevices > class10CleanMax;

  // NAT Layer Estimation:
  // Level 1: 1:1 NAT (no oversubscription)
  // Level 2: Port Address Translation (PAT / NAPT) 1 public : 64,000 ports
  // Level 3: Dual-NAT / Carrier Grade NAT (CGNAT RFC 6598 100.64.0.0/10) with NAT444
  let natTier = 'Standard Local Subnet (No NAT)';
  let natWarning = '';
  let translationOverheadScore = 0; // 0-100%

  if (totalCityDevices > 65534 && totalCityDevices <= class10Total) {
    natTier = 'Multi-VLAN Core Routing (Inter-District NAT / Internal PAT)';
    natWarning = 'District-level device overflow: requires subnetting split or inter-district NAT.';
    translationOverheadScore = 35;
  } else if (totalCityDevices > class10Total && totalCityDevices <= rfc1918Total) {
    natTier = 'Multi-RFC1918 Patchwork (10/8 + 172.16/12 + 192.168/16)';
    natWarning = 'Disjoint non-contiguous private pools required. Routing table complexity surges significantly.';
    translationOverheadScore = 68;
  } else if (totalCityDevices > rfc1918Total) {
    natTier = 'Carrier-Grade NAT444 / Dual-CGNAT Tier';
    natWarning = 'CRITICAL: Private IPv4 exhaustion exceeded! Mandatory double-NAT (NAT444) required. Breaks end-to-end telemetry and introduces state table memory bottlenecks on edge routers.';
    translationOverheadScore = 100;
  }

  return {
    totalCityDevices,
    class10Total,
    rfc1918Total,
    class10CleanMax,
    class10Exhausted,
    rfc1918Exhausted,
    natTier,
    natWarning,
    translationOverheadScore,
    deficitTotal: Math.max(0, totalCityDevices - class10CleanMax)
  };
}
