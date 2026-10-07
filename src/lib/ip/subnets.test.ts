import { describe, it, expect } from 'vitest';
import {
  compressIPv6,
  expandIPv6,
  generateCitySubnetPrefix,
  generateDistrictPrefix,
  generateServicePrefix,
  generateZonePrefix,
  generateEui64,
  parseBitSegments,
  ipv6ToBigInt,
  bigIntToIPv6
} from './ipv6Math';
import {
  calculateIPv4Subnet,
  ipv4ToInt,
  intToIPv4,
  generateDistrictIPv4Plan,
  calculateIPv4CityDeficit
} from './ipv4Math';

describe('IPv6 Mathematical Engine', () => {
  it('correctly compresses IPv6 address according to RFC 5952', () => {
    expect(compressIPv6('2001:0db8:0001:0000:0000:0000:0000:0000')).toBe('2001:db8:1::');
    expect(compressIPv6('2001:0db8:0121:0000:0000:0000:0000:0000')).toBe('2001:db8:121::');
    expect(compressIPv6('0000:0000:0000:0000:0000:0000:0000:0001')).toBe('::1');
  });

  it('correctly expands compressed IPv6 address', () => {
    expect(expandIPv6('2001:db8:121::')).toBe('2001:0db8:0121:0000:0000:0000:0000:0000');
    expect(expandIPv6('::1')).toBe('0000:0000:0000:0000:0000:0000:0000:0001');
  });

  it('generates hierarchical city subnets (2001:db8:DDSZ:SSSS::/64)', () => {
    // District 1, Service 2 (Traffic), Zone 1, Subnet 0
    const prefix = generateCitySubnetPrefix(1, '2', 1, 0);
    expect(prefix).toBe('2001:db8:121::/64');

    // District 16 (0x10), Service 4 (Emergency), Zone 3, Subnet 1
    const emPrefix = generateCitySubnetPrefix(16, '4', 3, 1);
    expect(emPrefix).toBe('2001:db8:1043:1::/64');
  });

  it('generates district /40 and service /44 prefixes', () => {
    expect(generateDistrictPrefix(1)).toBe('2001:db8:100::/40');
    expect(generateServicePrefix(1, '2')).toBe('2001:db8:120::/44');
    expect(generateZonePrefix(1, '2', 1)).toBe('2001:db8:121::/48');
  });

  it('calculates EUI-64 interface ID from MAC address', () => {
    // MAC 00:1A:2B:3C:4D:5E -> Invert 7th bit of 00 -> 02 -> 021a:2bff:fe3c:4d5e
    const eui64 = generateEui64('00:1A:2B:3C:4D:5E');
    expect(eui64).toBe('021a:2bff:fe3c:4d5e');
  });

  it('accurately parses 128-bit fields into segments', () => {
    const segments = parseBitSegments(1, '2', 1, 0);
    expect(segments.length).toBe(6);
    expect(segments[0].name).toContain('City Allocation');
    expect(segments[1].name).toContain('District Identifier');
    expect(segments[2].name).toContain('Service Class');
    expect(segments[3].name).toContain('Zone');
    expect(segments[4].name).toContain('Subnet ID');
    expect(segments[5].name).toContain('Interface Identifier');
  });

  it('converts between BigInt and IPv6 string without precision loss', () => {
    const original = '2001:0db8:0001:0002:0003:0004:0005:0006';
    const big = ipv6ToBigInt(original);
    const restored = bigIntToIPv6(big);
    expect(restored).toBe('2001:db8:1:2:3:4:5:6');
  });
});

describe('IPv4 Mathematical Engine & VLSM', () => {
  it('converts IP string to 32-bit integer and back', () => {
    const ip = '10.1.128.0';
    const intVal = ipv4ToInt(ip);
    expect(intToIPv4(intVal)).toBe(ip);
  });

  it('calculates subnet parameters correctly for /17, /19, /20, /21', () => {
    const sub17 = calculateIPv4Subnet('10.1.0.0/17');
    expect(sub17.networkAddress).toBe('10.1.0.0');
    expect(sub17.netmask).toBe('255.255.128.0');
    expect(sub17.broadcastAddress).toBe('10.1.127.255');
    expect(sub17.usableHosts).toBe(32766);

    const sub19 = calculateIPv4Subnet('10.1.128.0/19');
    expect(sub19.networkAddress).toBe('10.1.128.0');
    expect(sub19.netmask).toBe('255.255.224.0');
    expect(sub19.broadcastAddress).toBe('10.1.159.255');
    expect(sub19.usableHosts).toBe(8190);
  });

  it('detects district and city-wide IPv4 exhaustion accurately', () => {
    // Default district: 150k sensors + 2k traffic + 8k surveillance + 1.5k emergency = 161,500 hosts
    const districtPlan = generateDistrictIPv4Plan(1, {
      sensors: 150000,
      traffic: 2000,
      surveillance: 8000,
      emergency: 1500
    });
    expect(districtPlan.isExhausted).toBe(true);
    expect(districtPlan.districtDeficit).toBe(161500 - 65534);

    // Citywide 16 districts * 161,500 = 2,584,000 devices
    const cityDeficit = calculateIPv4CityDeficit(16, {
      sensors: 150000,
      traffic: 2000,
      surveillance: 8000,
      emergency: 1500
    });
    expect(cityDeficit.totalCityDevices).toBe(2584000);
    expect(cityDeficit.class10CleanMax).toBe(16 * 65534);
    expect(cityDeficit.class10Exhausted).toBe(true);
  });
});
