import { SuitabilityCriterion } from '../types';

export const SUITABILITY_CRITERIA: SuitabilityCriterion[] = [
  {
    id: 'address_space',
    name: 'Address Space & Scale',
    category: 'Scale',
    description: 'Ability to assign globally or locally unique IP addresses to millions of endpoints without exhaustion.',
    iotRelevance: 'Smart cities with millions of sensors and cameras quickly exhaust IPv4 private blocks (10.0.0.0/8 offers only 16.7M addresses citywide).',
    defaultWeight: 10,
    ipv4Score: 2,
    ipv6Score: 10,
    ipv4Notes: 'Exhausted globally. Private RFC1918 (10/8) limited to 16.7M IPs; insufficient for multi-district dense sensors + expansion.',
    ipv6Notes: 'Virtually inexhaustible (3.4×10³⁸ addresses). A single /64 subnet holds 18.4 quintillion addresses; /32 city allocation provides 4.29B /64s.'
  },
  {
    id: 'autoconfig',
    name: 'Auto-Configuration (SLAAC / ZTP)',
    category: 'Operations',
    description: 'Zero-touch provisioning and stateless plug-and-play address generation for rapid mass deployment.',
    iotRelevance: 'Deploying 150k+ sensors per district is logistically impossible if each requires manual configuration or stateful DHCP lease pools.',
    defaultWeight: 9,
    ipv4Score: 3,
    ipv6Score: 10,
    ipv4Notes: 'Requires stateful DHCP server with massive memory pools and active lease tracking, creating a single point of failure and server load.',
    ipv6Notes: 'Native SLAAC (Stateless Address Autoconfiguration) via Router Advertisements (ICMPv6) + RFC 7217. Zero server state overhead.'
  },
  {
    id: 'end_to_end',
    name: 'End-to-End Connectivity & No NAT',
    category: 'Scale',
    description: 'Direct bi-directional peer communication without intermediate translation layers, ALG proxies, or port mapping.',
    iotRelevance: 'NAT breaks incoming telemetry alerts, peer-to-peer C-ITS vehicle communications, and requires battery-draining keep-alive pulses.',
    defaultWeight: 9,
    ipv4Score: 2,
    ipv6Score: 10,
    ipv4Notes: 'Mandatory CGNAT (Carrier-Grade NAT / NAT444) adds packet translation latency, drops long-lived IoT sessions, and exhausts state tables.',
    ipv6Notes: 'True end-to-end direct reachability with clean boundary ACLs. Eliminates keep-alives, saving up to 35% sensor battery lifetime.'
  },
  {
    id: 'security_ipsec',
    name: 'Built-in Network Security (IPsec / Cryptographic IDs)',
    category: 'Security',
    description: 'Native cryptographically bound addresses, mandatory IPsec protocol support, and secure neighbor discovery.',
    iotRelevance: 'Critical for municipal grid resilience, traffic lights, and emergency dispatch protection against spoofing and MitM attacks.',
    defaultWeight: 8,
    ipv4Score: 4,
    ipv6Score: 9,
    ipv4Notes: 'IPsec was retrofitted as an optional add-on. ARP is unauthenticated and highly vulnerable to ARP cache poisoning & spoofing.',
    ipv6Notes: 'IPsec built into IPv6 architectural specification (RFC 4301). Secure Neighbor Discovery (SEND) and Cryptographically Generated Addresses (CGA).'
  },
  {
    id: 'qos_traffic_mgmt',
    name: 'QoS, Priority & Flow Identification',
    category: 'Protocol',
    description: 'Packet classification, DSCP markings, and dedicated 20-bit Flow Labels for hardware-accelerated routing.',
    iotRelevance: 'Emergency 911 audio and traffic signal priority preempt lower-priority sensor telemetry in transit routers without deep packet inspection.',
    defaultWeight: 8,
    ipv4Score: 6,
    ipv6Score: 9,
    ipv4Notes: '8-bit Type of Service (ToS) / DiffServ field. Routers must parse TCP/UDP ports for flow tracking, which fails when payloads are encrypted.',
    ipv6Notes: '8-bit Traffic Class + dedicated 20-bit Flow Label in fixed 40-byte header. Core routers perform line-rate ECMP flow steering even over encrypted traffic.'
  },
  {
    id: 'multicast_anycast',
    name: 'Multicast & Anycast Capabilities',
    category: 'Protocol',
    description: 'Efficient one-to-many streaming and distributed closest-node server resilience without broadcast storms.',
    iotRelevance: 'Surveillance video distribution and emergency PSAP dispatch resilience require efficient multicast and anycast failover.',
    defaultWeight: 8,
    ipv4Score: 4,
    ipv6Score: 10,
    ipv4Notes: 'Broadcast causes broadcast storms on dense IoT Wi-Fi/mesh radios. IPv4 multicast requires complex IGMP and sparse-mode rendezvous points.',
    ipv6Notes: 'Broadcast eliminated completely. Built-in MLDv2, rich scope-based multicast (Node/Link/Site/Global), and seamless Anycast routing for PSAP dispatch.'
  },
  {
    id: 'mobility_prefix_delegation',
    name: 'IoT Mobility & Prefix Delegation',
    category: 'Operations',
    description: 'Dynamic subnet delegation for mobile responder units and seamless vehicle-to-infrastructure handovers.',
    iotRelevance: 'Ambulances and fire trucks require dynamic /60 subnets for onboard cameras, defibrillators, and mobile routers while moving at 100 km/h.',
    defaultWeight: 7,
    ipv4Score: 3,
    ipv6Score: 9,
    ipv4Notes: 'Very awkward; requires mobile IP tunnels or re-DHCP on cell handover, causing IP address changes and session resets.',
    ipv6Notes: 'Native DHCPv6 Prefix Delegation (DHCPv6-PD) and Mobile IPv6 (RFC 6275) / Proxy Mobile IPv6 allow seamless multi-homed roaming.'
  },
  {
    id: 'routing_efficiency',
    name: 'Routing Efficiency & Header Architecture',
    category: 'Protocol',
    description: 'Fixed header size, hierarchical route aggregation, and elimination of router checksum recomputation.',
    iotRelevance: 'High packet rates from millions of municipal devices require wire-speed forwarding on core edge routers.',
    defaultWeight: 7,
    ipv4Score: 5,
    ipv6Score: 9,
    ipv4Notes: 'Variable 20-60 byte header with optional fields requires complex router CPU parsing; per-hop header checksum recomputation is required.',
    ipv6Notes: 'Fixed 40-byte header format with chained extension headers. No per-hop checksum (handled by L2/L4), enabling high-speed ASIC forwarding.'
  },
  {
    id: 'device_support_legacy',
    name: 'Legacy Device Support & Field Compatibility',
    category: 'Operations',
    description: 'Availability of network stacks in older industrial PLCs, budget IoT sensors, and commercial vendor firmware.',
    iotRelevance: 'Some legacy RTUs and inexpensive microcontroller boards in water meters or older HVAC units lack dual-stack IPv6 firmware.',
    defaultWeight: 6,
    ipv4Score: 9,
    ipv6Score: 7,
    ipv4Notes: 'Universal support across all hardware produced in the last 30 years.',
    ipv6Notes: 'Supported in all modern Linux/RTOS IoT platforms (Zephyr, FreeRTOS, Contiki-NG, RIOT, ESP-IDF). Older legacy PLCs require dual-stack/NAT64 translation gateways.'
  },
  {
    id: 'migration_capex_opex',
    name: 'Migration Effort & Initial Cost',
    category: 'Operations',
    description: 'Effort to upgrade router firmware, train network engineers, and validate monitoring tools.',
    iotRelevance: 'Greenfield smart cities have near-zero legacy penalty, but existing brownfield infrastructure requires dual-stack transition planning.',
    defaultWeight: 6,
    ipv4Score: 8,
    ipv6Score: 6,
    ipv4Notes: 'Zero new staff training required initially; existing NOC operational runbooks apply immediately.',
    ipv6Notes: 'Requires modern dual-stack architecture training, updating firewall policy rules, and configuring NAT64/DNS64 boundary translators.'
  }
];
