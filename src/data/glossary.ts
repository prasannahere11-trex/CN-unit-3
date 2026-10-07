export interface GlossaryTerm {
  term: string;
  rfc?: string;
  definition: string;
  smartCityRelevance: string;
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
  SLAAC: {
    term: 'SLAAC (Stateless Address Autoconfiguration)',
    rfc: 'RFC 4862 / RFC 7217',
    definition: 'A mechanism allowing an IPv6 host to generate its own unique IPv6 address using network prefix announcements from local routers (ICMPv6 Router Advertisements) without requiring a stateful DHCP server.',
    smartCityRelevance: 'Allows 150k+ environmental sensors per district to instantly join the network on power-up with zero provisioning overhead.'
  },
  VLSM: {
    term: 'VLSM (Variable Length Subnet Masking)',
    rfc: 'RFC 1878',
    definition: 'A technique of allocating IP address spaces with subnet masks of varying lengths, breaking subnets into hierarchical subdivisions to maximize address efficiency in IPv4.',
    smartCityRelevance: 'Used in legacy IPv4 to divide 10.0.0.0/8 into district /16 blocks and service /17, /19, /20, /21 blocks.'
  },
  NAT64: {
    term: 'NAT64 / DNS64',
    rfc: 'RFC 6146 / RFC 6147',
    definition: 'A transition mechanism that enables IPv6-only devices to communicate seamlessly with IPv4-only servers by synthesizing IPv6 addresses (DNS64) and translating packets at the gateway (NAT64).',
    smartCityRelevance: 'Enables new IPv6-only traffic controllers and sensors to send alerts to older legacy IPv4 cloud services.'
  },
  DSCP: {
    term: 'DSCP (Differentiated Services Code Point)',
    rfc: 'RFC 2474 / RFC 3246',
    definition: 'A 6-bit field in the IPv4 ToS or IPv6 Traffic Class header used to classify network traffic and enforce Quality of Service (QoS) queue priority.',
    smartCityRelevance: 'Emergency services utilize DSCP EF (Expedited Forwarding = 46) for zero packet-drop priority across municipal links.'
  },
  CGNAT: {
    term: 'CGNAT (Carrier-Grade NAT / NAT444)',
    rfc: 'RFC 6598',
    definition: 'Large-scale network address translation performed by an ISP or city core router, multiplexing multiple private IP subnets behind a small pool of shared addresses using port mapping.',
    smartCityRelevance: 'IPv4 requires CGNAT once device counts surpass 16.7M, causing state-table bottlenecks and breaking incoming telemetry.'
  },
  '6LoWPAN': {
    term: '6LoWPAN (IPv6 over Low-Power Wireless Personal Area Networks)',
    rfc: 'RFC 4944 / RFC 6282',
    definition: 'An adaptation layer and header compression protocol that allows native IPv6 packets to be transmitted over constrained 802.15.4 low-power radio mesh networks.',
    smartCityRelevance: 'Compresses standard 40-byte IPv6 headers down to 2-4 bytes for battery-powered street sensors.'
  },
  'EUI-64': {
    term: 'Modified EUI-64',
    rfc: 'RFC 4291',
    definition: 'A method of generating a 64-bit IPv6 Interface Identifier from a device 48-bit MAC address by inserting 0xFFFE and flipping the Universal/Local bit.',
    smartCityRelevance: 'Guarantees globally unique host addressing based on physical hardware MAC addresses.'
  },
  Anycast: {
    term: 'IPv6 Anycast Routing',
    rfc: 'RFC 4291 / RFC 4786',
    definition: 'A network addressing scheme where a single IP address is shared by multiple servers in different locations, with routers directing packets to the closest node via BGP/OSPF.',
    smartCityRelevance: 'Ensures 911/PSAP dispatch requests automatically route to the nearest active control center with instant zero-downtime failover.'
  },
  'Prefix Delegation': {
    term: 'DHCPv6 Prefix Delegation (DHCPv6-PD)',
    rfc: 'RFC 3633',
    definition: 'A protocol mechanism where a delegating router assigns entire IPv6 prefix blocks (e.g. /60) to a requesting router rather than just single host IPs.',
    smartCityRelevance: 'Assigns /60 subnets to emergency vehicles (ambulances/fire trucks) to power onboard cameras and patient diagnostic systems.'
  },
  NDP: {
    term: 'NDP (Neighbor Discovery Protocol)',
    rfc: 'RFC 4861',
    definition: 'The IPv6 protocol suite replacing IPv4 ARP, ICMP Router Discovery, and ICMP Redirect, operating over ICMPv6 multicast.',
    smartCityRelevance: 'Eliminates disruptive broadcast storms across wireless IoT mesh corridors.'
  },
  FlowLabel: {
    term: '20-bit IPv6 Flow Label',
    rfc: 'RFC 6437',
    definition: 'A dedicated 20-bit field in the IPv6 header used to identify specific packet streams that require consistent multi-path forwarding (ECMP) without deep packet inspection.',
    smartCityRelevance: 'Allows high-speed line-rate forwarding of latency-sensitive video and emergency telemetry streams.'
  },
  IPsec: {
    term: 'IPsec (Internet Protocol Security)',
    rfc: 'RFC 4301',
    definition: 'A cryptographic protocol suite that provides packet authentication (AH) and encryption (ESP) directly at the IP network layer.',
    smartCityRelevance: 'Protects critical city infrastructure (traffic lights, water SCADA, emergency dispatch) from spoofing and cyberattacks.'
  }
};
