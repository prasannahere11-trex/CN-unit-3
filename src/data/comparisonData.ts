import { ComparisonItem } from '../types';

export const COMPARISON_ITEMS: ComparisonItem[] = [
  {
    id: 'address_bits',
    category: 'Addressing & Architecture',
    attribute: 'Address Size & Bit Length',
    ipv4: '32 bits (4 octets, 4 bytes)',
    ipv6: '128 bits (16 octets, 16 bytes)',
    iotImpact: 'IPv6 provides 4× the bit length, enabling a clean 6-level hierarchy (City → District → Service → Zone → Subnet → Host) without VLSM fragmentation.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'ipv6_address'
  },
  {
    id: 'total_address_space',
    category: 'Addressing & Architecture',
    attribute: 'Total Addressable Space',
    ipv4: '4,294,967,296 (~4.29 billion total; exhausted globally in 2011)',
    ipv6: '340,282,366,920,938,463,463,374,607,431,768,211,456 (~3.4 × 10³⁸)',
    iotImpact: 'Allows assigning a unique public or structured municipal address to every light pole, trash bin, parking sensor, and autonomous vehicle for centuries.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'address_space'
  },
  {
    id: 'notation_format',
    category: 'Addressing & Architecture',
    attribute: 'Textual Notation & Representation',
    ipv4: 'Dotted decimal: 10.1.0.1',
    ipv6: 'Hexadecimal groups with zero compression: 2001:db8:121::1',
    iotImpact: 'Hexadecimal structure aligns directly with 4-bit nibble boundaries, simplifying hardware filter masks and route aggregation in TCAM memory.',
    isIotCritical: false,
    verdict: 'Neutral',
    glossaryKey: 'rfc5952'
  },
  {
    id: 'header_size',
    category: 'Header & Routing',
    attribute: 'Base Header Size & Processing',
    ipv4: 'Variable 20 to 60 bytes (Options field requires CPU parsing)',
    ipv6: 'Fixed 40 bytes (Extension headers chained after base header)',
    iotImpact: 'Fixed 40-byte header allows hardware router ASICs to pipeline packet forwarding at wire-speed without CPU interrupts.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'fixed_header'
  },
  {
    id: 'header_checksum',
    category: 'Header & Routing',
    attribute: 'Hop-by-Hop Header Checksum',
    ipv4: 'Mandatory checksum at every router hop (recalculated due to TTL decrement)',
    ipv6: 'No header checksum (handled by Layer 2 Ethernet CRC and Layer 4 TCP/UDP checksums)',
    iotImpact: 'Eliminating the checksum recalculation at each core router reduces router CPU load and lowers packet transit jitter across the municipal backbone.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'checksum'
  },
  {
    id: 'nat_requirement',
    category: 'Scale & Connectivity',
    attribute: 'Network Address Translation (NAT)',
    ipv4: 'Mandatory CGNAT (Carrier-Grade NAT / NAT444) for large-scale private IoT networks',
    ipv6: 'Not needed. True end-to-end direct reachability with stateful firewall policies',
    iotImpact: 'NAT table state limits cause dropped IoT telemetry connections, prevent server-to-sensor push notifications, and waste up to 35% battery on keep-alives.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'cgnat'
  },
  {
    id: 'address_config',
    category: 'Operations & Provisioning',
    attribute: 'Endpoint Address Auto-Configuration',
    ipv4: 'DHCP (Dynamic Host Configuration Protocol) or manual static IP entry',
    ipv6: 'SLAAC (Stateless Address Autoconfiguration RFC 4862) + DHCPv6 option',
    iotImpact: 'Massive deployments of 2M+ sensors boot, listen to Router Advertisements (RA), and generate unique IPs automatically with zero DHCP server bottleneck.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'slaac'
  },
  {
    id: 'multicast_broadcast',
    category: 'Protocol & Bandwidth',
    attribute: 'Broadcast vs. Multicast / Anycast',
    ipv4: 'Heavy use of Layer 2 / Layer 3 Broadcast (ARP, DHCP discovery, NetBIOS)',
    ipv6: 'No Broadcast! Multicast (MLDv2) + Solicited-Node Multicast + Anycast',
    iotImpact: 'Eliminating broadcast prevents radio wakeup storms on battery-constrained low-power wireless mesh (6LoWPAN, Wi-Fi HaLow) sensor networks.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'multicast'
  },
  {
    id: 'qos_flow',
    category: 'QoS & Traffic Engineering',
    attribute: 'QoS & Flow Identification',
    ipv4: '8-bit Type of Service (ToS) / DiffServ byte',
    ipv6: '8-bit Traffic Class + dedicated 20-bit Flow Label field',
    iotImpact: 'Core routers steer mission-critical emergency voice/telemetry flows without decrypting or inspecting inner Layer 4 packet payloads.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'flow_label'
  },
  {
    id: 'security_ipsec',
    category: 'Security & Integrity',
    attribute: 'IPsec & Cryptographic Binding',
    ipv4: 'Optional retrofitted extension (RFC 2401)',
    ipv6: 'Mandatory standard specification (RFC 4301) + SEND (Secure Neighbor Discovery)',
    iotImpact: 'Provides native end-to-end encrypted tunnels between traffic controllers, emergency vehicles, and city SCADA operational centers.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'ipsec'
  },
  {
    id: 'packet_fragmentation',
    category: 'Header & Routing',
    attribute: 'Packet Fragmentation Handling',
    ipv4: 'Performed by routers and sending hosts',
    ipv6: 'Performed ONLY by sending source hosts via Path MTU Discovery (PMTUD)',
    iotImpact: 'Intermediate routers never waste CPU fragmentation buffers on large packets; fragmentation is offloaded to the origin endpoint.',
    isIotCritical: false,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'pmtud'
  },
  {
    id: 'neighbor_discovery',
    category: 'Protocol & Bandwidth',
    attribute: 'Layer 2 Resolution & Link Management',
    ipv4: 'ARP (Address Resolution Protocol) using noisy broadcast requests',
    ipv6: 'NDP (Neighbor Discovery Protocol) using ICMPv6 Solicited-Node Multicast',
    iotImpact: 'NDP allows silent node verification, router redirect, and neighbor unreachability detection without disturbing sleeping IoT sensor nodes.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'ndp'
  },
  {
    id: 'mobility_support',
    category: 'Operations & Provisioning',
    attribute: 'Mobile Endpoint Roaming & Fleet',
    ipv4: 'Complex mobile IP overlays with triangular routing overhead',
    ipv6: 'Native Mobile IPv6 (MIPv6 / PMIPv6) + DHCPv6 Prefix Delegation (/60)',
    iotImpact: 'Emergency vehicles and public transit buses maintain persistent TCP/UDP sessions across cellular, satellite, and municipal roadside Wi-Fi.',
    isIotCritical: true,
    verdict: 'IPv6 Advantage',
    glossaryKey: 'mipv6'
  },
  {
    id: 'legacy_hardware',
    category: 'Legacy & Ecosystem',
    attribute: 'Legacy Hardware & Firmware Maturity',
    ipv4: '100% universal support in all legacy microcontrollers and serial-to-IP gateways',
    ipv6: 'Universal in modern platforms (Linux, Zephyr, FreeRTOS); older 8-bit RTUs require translation',
    iotImpact: 'Certain 15-year-old water pump PLCs and SCADA RTUs require dual-stack gateways or NAT64 translation proxies.',
    isIotCritical: false,
    verdict: 'IPv4 Advantage',
    glossaryKey: 'dual_stack'
  }
];
