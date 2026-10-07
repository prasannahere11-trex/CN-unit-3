/**
 * Real IPv6 Mathematical Utilities for Smart City Subnetting.
 * Utilizes JavaScript BigInt for precise 128-bit arithmetic without precision loss.
 */

export interface IPv6BitSegment {
  name: string;
  bitStart: number;
  bitEnd: number;
  bitLength: number;
  prefixLength: number;
  hexValue: string;
  binaryValue: string;
  description: string;
  color: string;
}

/**
 * Format a BigInt 128-bit number into standard colon-separated 8 16-bit hex groups
 */
export function bigIntToIPv6(value: bigint): string {
  const parts: string[] = [];
  const mask16 = BigInt(0xffff);
  for (let i = 7; i >= 0; i--) {
    const shift = BigInt(i * 16);
    const group = (value >> shift) & mask16;
    parts.push(group.toString(16));
  }
  return parts.join(':');
}

/**
 * Compress an IPv6 address string according to RFC 5952
 * (replaces the longest contiguous run of zero groups with ::)
 */
export function compressIPv6(ip: string): string {
  // Split into 8 groups
  let groups = ip.split(':');
  if (groups.length !== 8) {
    // If it already has :: or is shorthand, normalize first
    groups = expandIPv6(ip).split(':');
  }

  // Remove leading zeros from each hex group
  groups = groups.map(g => parseInt(g || '0', 16).toString(16));

  // Find longest streak of "0"
  let maxZeroStart = -1;
  let maxZeroLen = 0;
  let currentStart = -1;
  let currentLen = 0;

  for (let i = 0; i < groups.length; i++) {
    if (groups[i] === '0') {
      if (currentStart === -1) currentStart = i;
      currentLen++;
      if (currentLen > maxZeroLen) {
        maxZeroLen = currentLen;
        maxZeroStart = currentStart;
      }
    } else {
      currentStart = -1;
      currentLen = 0;
    }
  }

  // RFC 5952: only replace if run length is >= 2
  if (maxZeroLen >= 2) {
    const before = groups.slice(0, maxZeroStart).join(':');
    const after = groups.slice(maxZeroStart + maxZeroLen).join(':');
    return `${before}::${after}`.replace(/^:::/, '::').replace(/:::$/, '::');
  }

  return groups.join(':');
}

/**
 * Expand compressed IPv6 address into full 8 groups with 4 hex digits each
 */
export function expandIPv6(ip: string): string {
  let [prefix, suffix] = ip.split('::');
  let prefixGroups = prefix ? prefix.split(':').filter(Boolean) : [];
  let suffixGroups = suffix !== undefined ? suffix.split(':').filter(Boolean) : [];

  if (suffix !== undefined) {
    const missing = 8 - (prefixGroups.length + suffixGroups.length);
    const zeros = new Array(missing).fill('0000');
    const all = [...prefixGroups, ...zeros, ...suffixGroups];
    return all.map(g => g.padStart(4, '0')).join(':');
  }

  return prefixGroups.map(g => g.padStart(4, '0')).join(':');
}

/**
 * Parse an IPv6 address to a BigInt 128-bit number
 */
export function ipv6ToBigInt(ip: string): bigint {
  const full = expandIPv6(ip);
  const groups = full.split(':');
  let result = 0n;
  for (const group of groups) {
    result = (result << 16n) | BigInt(parseInt(group, 16));
  }
  return result;
}

/**
 * Generate the Smart City IPv6 prefix according to the hierarchical plan:
 * City prefix: 2001:0db8::/32
 * District: 8 bits (DD: 00 to FF -> /40)
 * Service Class: 4 bits (S: 1 to F -> /44)
 * Zone: 4 bits (Z: 0 to F -> /48)
 * Subnet ID: 16 bits (SSSS: 0000 to FFFF -> /64)
 */
export function generateCitySubnetPrefix(
  districtId: number,
  serviceCode: string,
  zoneId: number,
  subnetId: number = 0
): string {
  const dd = districtId.toString(16).padStart(2, '0').toLowerCase();
  const s = serviceCode.toLowerCase();
  const z = zoneId.toString(16).toLowerCase();
  const ssss = subnetId.toString(16).padStart(4, '0').toLowerCase();

  // Pattern: 2001:0db8:DDSZ:SSSS::/64
  const group3 = `${dd}${s}${z}`;
  const uncompressed = `2001:0db8:${group3}:${ssss}:0000:0000:0000:0000`;
  return `${compressIPv6(uncompressed)}/64`;
}

/**
 * Generate District Prefix (/40)
 */
export function generateDistrictPrefix(districtId: number): string {
  const dd = districtId.toString(16).padStart(2, '0').toLowerCase();
  return compressIPv6(`2001:0db8:${dd}00:0000:0000:0000:0000:0000`) + '/40';
}

/**
 * Generate Service Prefix within a District (/44)
 */
export function generateServicePrefix(districtId: number, serviceCode: string): string {
  const dd = districtId.toString(16).padStart(2, '0').toLowerCase();
  const s = serviceCode.toLowerCase();
  return compressIPv6(`2001:0db8:${dd}${s}0:0000:0000:0000:0000:0000`) + '/44';
}

/**
 * Generate Zone Prefix within a District & Service (/48)
 */
export function generateZonePrefix(districtId: number, serviceCode: string, zoneId: number): string {
  const dd = districtId.toString(16).padStart(2, '0').toLowerCase();
  const s = serviceCode.toLowerCase();
  const z = zoneId.toString(16).toLowerCase();
  return compressIPv6(`2001:0db8:${dd}${s}${z}:0000:0000:0000:0000:0000`) + '/48';
}

/**
 * Break down a 128-bit IPv6 address / prefix into the 6 structured bitfields
 */
export function parseBitSegments(
  districtId: number,
  serviceCode: string,
  zoneId: number,
  subnetId: number,
  interfaceHex: string = '0000:0000:0000:0001'
): IPv6BitSegment[] {
  const ddHex = districtId.toString(16).padStart(2, '0').toUpperCase();
  const sHex = serviceCode.toUpperCase();
  const zHex = zoneId.toString(16).toUpperCase();
  const ssssHex = subnetId.toString(16).padStart(4, '0').toUpperCase();

  const toBinary = (hex: string, bits: number) =>
    parseInt(hex, 16).toString(2).padStart(bits, '0');

  return [
    {
      name: 'City Allocation (Doc Prefix)',
      bitStart: 0,
      bitEnd: 31,
      bitLength: 32,
      prefixLength: 32,
      hexValue: '2001:0DB8',
      binaryValue: '0010000000000001 0000110110111000',
      description: 'IANA Documentation Prefix (RFC 3849) allocated to CityNet Smart Municipal Network',
      color: '#06B6D4' // Cyan
    },
    {
      name: 'District Identifier',
      bitStart: 32,
      bitEnd: 39,
      bitLength: 8,
      prefixLength: 40,
      hexValue: ddHex,
      binaryValue: toBinary(ddHex, 8),
      description: `District index (0x${ddHex} = District ${districtId}), allows up to 256 municipal districts`,
      color: '#3B82F6' // Blue
    },
    {
      name: 'Service Class',
      bitStart: 40,
      bitEnd: 43,
      bitLength: 4,
      prefixLength: 44,
      hexValue: sHex,
      binaryValue: toBinary(sHex, 4),
      description: `Service category tag (0x${sHex}), allows 16 discrete traffic classes with dedicated routing policies`,
      color: '#8B5CF6' // Purple
    },
    {
      name: 'Zone / Sector Site',
      bitStart: 44,
      bitEnd: 47,
      bitLength: 4,
      prefixLength: 48,
      hexValue: zHex,
      binaryValue: toBinary(zHex, 4),
      description: `Geographic sector or physical enclosure zone (0x${zHex}), up to 16 zones per service per district`,
      color: '#EC4899' // Pink
    },
    {
      name: 'Subnet ID',
      bitStart: 48,
      bitEnd: 63,
      bitLength: 16,
      prefixLength: 64,
      hexValue: ssssHex,
      binaryValue: toBinary(ssssHex, 16),
      description: `Individual /64 broadcast-free network segment (0x${ssssHex}), 65,536 subnets per zone`,
      color: '#10B981' // Emerald
    },
    {
      name: 'Interface Identifier (IID)',
      bitStart: 64,
      bitEnd: 127,
      bitLength: 64,
      prefixLength: 128,
      hexValue: interfaceHex,
      binaryValue: '64-bit SLAAC EUI-64 or Cryptographically Generated Host ID',
      description: 'Host identifier (18,446,744,073,709,551,616 unique host addresses per /64 subnet)',
      color: '#F59E0B' // Amber
    }
  ];
}

/**
 * Generate EUI-64 Modified Interface ID from a MAC address
 */
export function generateEui64(macAddress: string): string {
  // Clean MAC address
  const cleanMac = macAddress.replace(/[^0-9A-Fa-f]/g, '').toLowerCase();
  if (cleanMac.length !== 12) return '0000:0000:0000:0001';

  // Split into 6 octets
  const octets = [];
  for (let i = 0; i < 12; i += 2) {
    octets.push(cleanMac.substr(i, 2));
  }

  // Invert the 7th bit (Universal/Local bit) of first octet
  let firstByte = parseInt(octets[0], 16);
  firstByte = firstByte ^ 0x02; // Flip bit 1 (0-indexed from right: 00000010)
  const modifiedFirst = firstByte.toString(16).padStart(2, '0');

  // Insert fffe in the middle: byte0 byte1 byte2 ff fe byte3 byte4 byte5
  const g1 = `${modifiedFirst}${octets[1]}`;
  const g2 = `${octets[2]}ff`;
  const g3 = `fe${octets[3]}`;
  const g4 = `${octets[4]}${octets[5]}`;

  return `${g1}:${g2}:${g3}:${g4}`;
}

/**
 * Calculate capacity metrics for IPv6 prefix allocations
 */
export function getIpv6CapacityMetrics() {
  return {
    cityBlock: '/32',
    districtsCapacity: 256, // 2^8
    serviceClassesPerDistrict: 16, // 2^4
    zonesPerService: 16, // 2^4
    subnetsPerZone: 65536, // 2^16
    totalSubnetsPerDistrict: 16 * 16 * 65536, // 16,777,216 /64s per district
    totalCitySubnets: 256 * 16 * 16 * 65536, // 4,294,967,296 /64 subnets
    hostsPerSubnetFormatted: '1.844 × 10¹⁹ (2⁶⁴ hosts)',
    totalCityAddresses: '3.402 × 10³⁸'
  };
}
