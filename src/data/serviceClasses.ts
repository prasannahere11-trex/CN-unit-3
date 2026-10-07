import { DeviceClassConfig } from '../types';

export const SERVICE_CLASSES: Record<string, DeviceClassConfig> = {
  sensors: {
    id: 'sensors',
    name: 'Environmental & Municipal Sensors',
    category: 'Massive IoT (mIoT)',
    defaultCountPerDistrict: 150000,
    color: '#10B981', // Emerald / Green
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeBorder: 'border-emerald-500',
    iconName: 'Activity',
    serviceCode: '1',
    serviceCodeName: '0x1 - Environmental Sensors',
    vlanRange: 'VLAN 100-199',
    qosDscp: 'DSCP CS1 / Best-Effort (Scavenger for raw periodic telemetry)',
    addressingMode: 'SLAAC (Stateless Address Autoconfiguration) with 6LoWPAN / LoRaWAN Gateways',
    protocols: ['CoAP', 'MQTT-SN', '6LoWPAN', 'NB-IoT', 'UDP Telemetry'],
    description: 'Ultra-dense battery-powered sensors monitoring air quality, water levels, soil moisture, and acoustic noise across city districts.',
    technicalNotes: [
      'Utilizes 6LoWPAN header compression (RFC 6282) compressing 40-byte IPv6 headers to 2-4 bytes over 802.15.4 mesh links.',
      'SLAAC with RFC 7217 (Opaque Semantically-Neutral Interface IDs) eliminates DHCP server state table overhead for 2.4M+ endpoints.',
      'Massive /64 subnet allocated per zone allows limitless horizontal scale without NAT traversal latency or keep-alive packet overhead.',
      'No stateful NAT gateways required, drastically reducing sensor battery drain caused by frequent NAT hole-punching packets.'
    ],
    securityProfile: 'ACL-isolated IoT Segment, Outbound-only MQTT/CoAP to Data Lake, TLS 1.3 / DTLS enabled.'
  },
  traffic: {
    id: 'traffic',
    name: 'Traffic Signal & Flow Controllers',
    category: 'Critical Infrastructure & C-ITS',
    defaultCountPerDistrict: 2000,
    color: '#3B82F6', // Blue / Sky
    badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    badgeBorder: 'border-sky-500',
    iconName: 'Navigation',
    serviceCode: '2',
    serviceCodeName: '0x2 - Traffic Controllers & C-ITS',
    vlanRange: 'VLAN 200-299',
    qosDscp: 'DSCP AF31 / AF41 (Low-Latency Assured Forwarding)',
    addressingMode: 'Deterministic Static / Statefully Managed DHCPv6 with Fixed Reservations',
    protocols: ['NTCIP 1202', 'OCIT-O', 'MQTT over TLS', 'IEEE 1609 WAVE / C-V2X'],
    description: 'Road intersection controllers, dynamic variable-message signs, induction loop telemetry, and connected vehicle road-side units (RSUs).',
    technicalNotes: [
      'Dedicated /48 per district zoned by intersection corridor for deterministic latency and topological aggregation.',
      'Zero broadcast traffic (pure IPv6 Multicast / Anycast via NDP) prevents broadcast storms from disrupting millisecond-sensitive signal phase timing.',
      'Traffic light control protocols (NTCIP/OCIT) leverage direct peer-to-peer IPv6 routing without NAT port forwarding bottlenecks.',
      'Segment Routing over IPv6 (SRv6) enables sub-10ms failover across redundant optical municipal rings.'
    ],
    securityProfile: 'Zero-Trust Zone, Mutual TLS (mTLS) with Hardware TPM/Secure Element, 802.1X Port Security.'
  },
  surveillance: {
    id: 'surveillance',
    name: 'Municipal CCTV & AI Video Analytics',
    category: 'High-Bandwidth Video & Edge AI',
    defaultCountPerDistrict: 8000,
    color: '#A855F7', // Purple
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    badgeBorder: 'border-purple-500',
    iconName: 'Camera',
    serviceCode: '3',
    serviceCodeName: '0x3 - Surveillance & Edge AI',
    vlanRange: 'VLAN 300-399',
    qosDscp: 'DSCP AF41 / CS4 (High-Throughput Streaming Video)',
    addressingMode: 'DHCPv6 with Host DUID / Static DNS AAAA records',
    protocols: ['RTSP over IPv6', 'WebRTC', 'ONVIF Profile S/G/T', 'SRTP'],
    description: '4K/8K smart security cameras, automated license plate readers (ALPR), and edge AI vision servers across transit hubs and public squares.',
    technicalNotes: [
      'Utilizes IPv6 Global Multicast (ff0e::/16 scope) for 1-to-many live surveillance dispatch to NOC and emergency operations centers simultaneously.',
      'Native IPv6 jumbo frames (9000 bytes) reduce CPU interrupt overhead on edge video ingestion nodes by over 40%.',
      'Completely isolated from public internet via IPv6 Prefix ACLs and micro-segmentation in District Data Centers.',
      'High-bandwidth streams bypass CGNAT state table limiters that frequently drop RTSP control channels in IPv4.'
    ],
    securityProfile: 'Encrypted Media (SRTP), Strict MAC/DUID Whitelisting, Micro-segmented Video VRF.'
  },
  emergency: {
    id: 'emergency',
    name: 'Emergency Response, PSAP & Public Safety',
    category: 'Mission-Critical First Responder (MCX)',
    defaultCountPerDistrict: 1500,
    color: '#EF4444', // Red / Rose
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    badgeBorder: 'border-rose-500',
    iconName: 'ShieldAlert',
    serviceCode: '4',
    serviceCodeName: '0x4 - Emergency & First Responders',
    vlanRange: 'VLAN 400-499',
    qosDscp: 'DSCP EF (Expedited Forwarding - Strict Priority) + CS5',
    addressingMode: 'Anycast Dispatch PSAP + IPv6 Prefix Delegation (DHCPv6-PD /60 per vehicle)',
    protocols: ['3GPP Mission Critical PTT (MCPTT)', 'NG9-1-1 / NENA i3', 'SIP/SDP over IPv6', 'IPsec ESP'],
    description: 'Ambulances, fire engines, police mobile cruisers, hospital dispatch telemetry, AED smart lockers, and disaster siren networks.',
    technicalNotes: [
      'Anycast IPv6 Addresses configured across geodistributed dispatch servers (PSAP) ensure instantaneous zero-delay failover.',
      'DHCPv6-PD (Prefix Delegation) assigns a dedicated /60 IPv6 subnet to every emergency vehicle, allowing on-board defibrillators, bodycams, and mobile routers to communicate seamlessly.',
      'Mobile IPv6 (MIPv6) / PMIPv6 allows emergency fleet vehicles to roam seamlessly across 5G slicing, private LTE, and municipal Wi-Fi without dropping active voice or telemetry sessions.',
      'Marked with DSCP Expedited Forwarding (EF) with reserved 15% bandwidth headroom on all core aggregation links.'
    ],
    securityProfile: 'Mandatory IPsec Encryption (RFC 4301) at Network Layer, Quantum-Resistant VPN Overlays, Top-Tier VRF Isolation.'
  }
};

export const ALL_SERVICE_CODES = [
  { code: '1', name: 'Environmental Sensors', classKey: 'sensors', color: '#10B981' },
  { code: '2', name: 'Traffic Controllers', classKey: 'traffic', color: '#3B82F6' },
  { code: '3', name: 'Surveillance & Edge AI', classKey: 'surveillance', color: '#A855F7' },
  { code: '4', name: 'Emergency Services', classKey: 'emergency', color: '#EF4444' },
  { code: '5', name: 'Smart Lighting & Energy Utilities', classKey: 'utilities', color: '#F59E0B' },
  { code: '6', name: 'Public Wi-Fi & Citizen Services', classKey: 'public-wifi', color: '#06B6D4' },
  { code: '7', name: 'NOC Management & Out-of-Band', classKey: 'noc-mgmt', color: '#64748B' },
  { code: 'f', name: 'Infrastructure, Loopbacks & Core P2P', classKey: 'infra-loopback', color: '#E2E8F0' }
];
