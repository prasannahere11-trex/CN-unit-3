import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmergencyPathSimulator } from '../components/EmergencyPathSimulator';
import { WhatAmILookingAt } from '../components/WhatAmILookingAt';
import {
  ShieldAlert,
  ArrowRight,
  Radio,
  Server,
  Zap,
  Lock,
  Activity,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { Tooltip } from '../components/Tooltip';

export const EmergencyDeepDive: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WhatAmILookingAt
        title="Mission-Critical First Responder (MCX) Architecture"
        summary="A specialized deep-dive into the emergency communications infrastructure (VLANs 400-499, Service Code 0x4). It showcases how IPv6 Anycast, DHCPv6 Prefix Delegation, and hardware-accelerated DSCP Expedited Forwarding (EF) deliver zero-packet-drop reliability for life-safety operations."
        keyPoints={[
          'Strict Priority QoS: DSCP EF (Code Point 46) ensures emergency voice and telemetry preempts consumer streaming traffic at the ASIC queue level.',
          'Dynamic Prefix Delegation (/60): Ambulances carry moving /60 subnets, isolating on-board ECG/defibrillators, dashcams, and mobile router interfaces.',
          'Sub-Second Anycast Failover: 911 dispatch calls route to the topologically nearest active PSAP center; route withdraws happen instantaneously over BGP.'
        ]}
        architectTip="Click 'Simulate Core Link Cut' inside the interactive simulator below to observe the sub-second Anycast path diversion to the secondary geo-redundant data center."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                Step 6: Emergency Services Architecture & Anycast PSAP
              </h1>
              <p className="text-xs text-slate-400">
                Mission-Critical Push-to-Talk (MCPTT), NG9-1-1 NENA i3, and DSCP Expedited Forwarding (EF)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Packet Flow Simulator */}
      <EmergencyPathSimulator />

      {/* 4 Pillars of Emergency Networking */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          The 4 Pillars of CityNet Public Safety Communications
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1 */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span>1. DHCPv6 Prefix Delegation (DHCPv6-PD /60)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mobile response vehicles (ambulances, hazardous materials response, police tactical units) are delegated a dedicated <code className="text-rose-300 font-mono">/60</code> subnet (16 independent <code className="text-cyan-300 font-mono">/64</code> subnets) upon connecting to municipal mesh or private 5G slices. This allows medical diagnostics, 4K bodycams, and mobile router interfaces to communicate locally with zero NAT translation overhead.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Radio className="w-4 h-4" />
              </div>
              <span>2. Multi-POP Anycast 911 / PSAP Routing</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Public Safety Answering Points (PSAPs) share a single unified Anycast IPv6 address across geographically separated data centers. BGP routing directs packets along the lowest-latency fiber path. If a core switch fails, BGP withdraws the prefix within milliseconds, seamlessly redirecting dispatch calls without dropped audio.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <span>3. DSCP EF (Expedited Forwarding) & 20-bit Flow Label</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Emergency packets are tagged with DSCP EF (Value 46) and assigned a unique 20-bit IPv6 Flow Label. Intermediate edge and distribution routers place these packets in high-priority strict priority queues, guaranteeing bounded latency (&lt;5ms) and 0% packet drop even under 100% link congestion during natural disasters.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Lock className="w-4 h-4" />
              </div>
              <span>4. Mandatory IPsec ESP Encryption (RFC 4301)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every first-responder voice stream (MCPTT) and patient diagnostic record is encrypted in-flight using hardware-accelerated IPsec Encapsulating Security Payload (ESP) with AES-GCM-256. Cryptographically Generated Addresses (CGA) prevent MAC spoofing and man-in-the-middle attacks.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between">
        <button
          onClick={() => navigate('/scalability')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
        >
          ← Back to Scalability
        </button>

        <button
          onClick={() => navigate('/migration')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          <span>Proceed to Step 7: Migration Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
