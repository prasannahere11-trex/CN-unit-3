import { MigrationPhase } from '../types';

export const MIGRATION_PHASES: MigrationPhase[] = [
  {
    phaseNumber: 1,
    title: 'Phase 1: IPv6 Core Backbone & Dual-Stack Foundation',
    timeframe: 'Months 1 - 6',
    status: 'Complete',
    architecture: 'Dual-Stack Backbone with BGP / OSPFv3 Core Routing',
    keyActions: [
      'Allocate CityNet municipal IPv6 block (2001:db8::/32) and configure BGP peering with tier-1 ISPs.',
      'Upgrade Core and Distribution layer switches to support dual-stack IPv4/IPv6 line-rate forwarding and hardware TCAM tables.',
      'Deploy Dual-Stack Authoritative DNS (BIND9/PowerDNS) with IPv6 AAAA records alongside legacy A records.',
      'Implement central NTP (Chrony) and syslog/monitoring ingestion supporting native IPv6 transports.'
    ],
    risks: [
      'Dual routing tables increase router memory utilization by ~25%.',
      'Asymmetric routing paths if IPv6 peering routes differ from IPv4 transit.'
    ],
    mitigations: [
      'Upgrade memory on legacy distribution routers; tune TCAM carving profiles for IPv6 /64 routes.',
      'Enforce synchronized BGP route policies and BFD (Bidirectional Forwarding Detection) on all dual-stack links.'
    ],
    technologies: ['Dual-Stack (RFC 4213)', 'OSPFv3 (RFC 5340)', 'MP-BGP (RFC 4760)', 'DNS AAAA (RFC 3596)']
  },
  {
    phaseNumber: 2,
    title: 'Phase 2: Greenfield IoT Deployment & SLAAC Rollout',
    timeframe: 'Months 7 - 18',
    status: 'Active',
    architecture: 'IPv6-First Smart Infrastructure (Sensors + Traffic + Surveillance)',
    keyActions: [
      'Configure 6LoWPAN mesh border routers and LoRaWAN gateways with dedicated /64 prefixes per district zone.',
      'Deploy 150,000+ environmental sensors per district using SLAAC auto-configuration and RFC 7217 opaque IDs.',
      'Provision Traffic Controller corridors on dedicated /48 subnets with hardware-bound IPsec tunnels.',
      'Establish IPv6 Multicast (ff0e::/16) trees for 4K municipal CCTV feeds to eliminate unicast streaming overhead.'
    ],
    risks: [
      'Vendor firmware inconsistencies in low-power SLAAC implementations.',
      'Broadcast-domain bridging errors if legacy switches flood IPv6 multicast as broadcast.'
    ],
    mitigations: [
      'Enforce mandatory RFC compliance testing in municipal procurement RFPs.',
      'Enable MLD Snooping (RFC 4541) on all access switches to restrict multicast forwarding to subscribed ports.'
    ],
    technologies: ['SLAAC (RFC 4862)', '6LoWPAN (RFC 6282)', 'MLDv2 (RFC 3810)', 'IPsec ESP (RFC 4303)']
  },
  {
    phaseNumber: 3,
    title: 'Phase 3: Mission-Critical First Responders & Anycast PSAP',
    timeframe: 'Months 19 - 30',
    status: 'Planned',
    architecture: 'IPv6 Anycast PSAP Dispatch + DHCPv6-PD Fleet Roaming',
    keyActions: [
      'Configure Anycast IPv6 addresses across geographically redundant 911 / PSAP dispatch data centers.',
      'Deploy DHCPv6 Prefix Delegation (DHCPv6-PD) to dynamically delegate /60 blocks to emergency fleet vehicles.',
      'Enable DSCP Expedited Forwarding (EF) and 20-bit Flow Label routing on all emergency service VLANs (400-499).',
      'Deploy NAT64 / DNS64 gateways at the municipal boundary for legacy IPv4 cloud interoperability.'
    ],
    risks: [
      'Anycast route convergence delay during data center failover.',
      'Stateful NAT64 translation bottleneck for non-IPv6 external cloud dashboards.'
    ],
    mitigations: [
      'Use BGP Flowspec and fast BFD sub-second health checks for instant Anycast withdraw.',
      'Deploy stateless translation (SIIT / RFC 7915) where feasible and cluster stateful NAT64 with active-active HA.'
    ],
    technologies: ['Anycast Routing', 'DHCPv6-PD (RFC 3633)', 'NAT64/DNS64 (RFC 6146/6147)', 'DiffServ EF (RFC 3246)']
  },
  {
    phaseNumber: 4,
    title: 'Phase 4: IPv6-Only Municipal Core & Legacy Decommissioning',
    timeframe: 'Months 31 - 42',
    status: 'Future',
    architecture: 'Pure IPv6-Only Smart City with Micro-Segmented Zero Trust',
    keyActions: [
      'Isolate remaining legacy IPv4 industrial PLCs into dedicated brownfield VLANs behind NAT64/SIIT proxies.',
      'Decommission internal IPv4 DHCP scopes and retire CGNAT translation boxes.',
      'Transition municipal core from dual-stack to pure IPv6 Segment Routing (SRv6).',
      'Audit end-to-end telemetry latency and verify 100% elimination of NAT keep-alive overhead.'
    ],
    risks: [
      'Unexpected legacy dependency on IPv4-only third-party SaaS tools.',
      'Orphaned legacy sensors failing to reach modernized cloud ingestion points.'
    ],
    mitigations: [
      'Maintain dual-stack proxy bastion nodes at the DMZ for third-party cloud tools.',
      'Deploy 464XLAT (RFC 6877) CLAT translation agents on legacy endpoints where necessary.'
    ],
    technologies: ['Pure IPv6 (RFC 8200)', 'SRv6 (RFC 8986)', '464XLAT (RFC 6877)', 'Zero Trust Microsegmentation']
  }
];
