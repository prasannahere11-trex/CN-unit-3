import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Server,
  Activity,
  Zap,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Tooltip } from './Tooltip';

export const EmergencyPathSimulator: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(true);
  const [activeHop, setActiveHop] = useState<number>(0);
  const [isFailoverActive, setIsFailoverActive] = useState(false);
  const [packetDropRate, setPacketDropRate] = useState<number>(0);
  const [currentLatencyMs, setCurrentLatencyMs] = useState<number>(3.2);

  // Packet transit simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setActiveHop(prev => (prev + 1) % 5);
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const toggleFailover = () => {
    setIsFailoverActive(!isFailoverActive);
    if (!isFailoverActive) {
      setCurrentLatencyMs(4.8); // slight detour via Secondary Data Center
    } else {
      setCurrentLatencyMs(3.2);
    }
  };

  const hops = [
    {
      id: 0,
      name: 'Emergency Fleet Vehicle',
      tag: 'Ambulance / Mobile Medic',
      ipv6: '2001:db8:0141:0000::/60 (DHCPv6-PD)',
      qos: 'DSCP EF (Value 46)',
      icon: ShieldAlert,
      color: '#EF4444'
    },
    {
      id: 1,
      name: '5G RSU / LoRa Emergency Mesh',
      tag: 'C-V2X Sector RSU',
      ipv6: '2001:db8:0141:0010::/64',
      qos: '802.1p CoS 6 / Priority Queue',
      icon: Radio,
      color: '#F59E0B'
    },
    {
      id: 2,
      name: 'District Aggregation Core',
      tag: '100G Optical Ring',
      ipv6: '2001:db8:0100::/40 (MP-BGP)',
      qos: 'Strict Priority EF Queue (Zero Jitter)',
      icon: Activity,
      color: '#3B82F6'
    },
    {
      id: 3,
      name: isFailoverActive ? 'Secondary Geo-DR Core' : 'Primary Municipal Data Center',
      tag: isFailoverActive ? 'BGP Anycast Sub-Second Divert' : 'Primary Fiber Core NOC',
      ipv6: '2001:db8:0040::1 (Anycast VIP)',
      qos: 'IPsec ESP Tunnel (AES-GCM-256)',
      icon: Server,
      color: isFailoverActive ? '#EC4899' : '#8B5CF6'
    },
    {
      id: 4,
      name: '911 / PSAP Dispatch Command',
      tag: 'NG9-1-1 Emergency Ops',
      ipv6: '2001:db8:0040:0001::5 (NENA i3)',
      qos: 'High-Availability Anycast Target',
      icon: Lock,
      color: '#10B981'
    }
  ];

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                Mission-Critical Emergency Packet Path & Anycast Simulator
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                  DSCP EF Strict Priority
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing sub-5ms low-latency failover, prefix delegation, and IPsec cryptographic protection
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleFailover}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isFailoverActive
                ? 'bg-rose-950 text-rose-300 border-rose-500/50 ring-2 ring-rose-500/30'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            {isFailoverActive ? 'Failover Active (Geo-DR)' : 'Simulate Core Link Cut'}
          </button>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
            title={isSimulating ? 'Pause Packet Animation' : 'Resume Animation'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400">End-to-End Latency</div>
          <div className="font-mono text-base font-bold text-emerald-400">{currentLatencyMs} ms</div>
          <div className="text-[10px] text-slate-400">Target SLA: &lt; 10.0 ms</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400">QoS Queue Class</div>
          <div className="font-mono text-base font-bold text-rose-400">DSCP EF (46)</div>
          <div className="text-[10px] text-slate-400">Preemptive Priority</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Packet Loss Rate</div>
          <div className="font-mono text-base font-bold text-cyan-400">0.000%</div>
          <div className="text-[10px] text-slate-400">Zero packet drop queue</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Anycast BGP Status</div>
          <div className="font-mono text-base font-bold text-purple-400">
            {isFailoverActive ? 'Secondary POP' : 'Primary DC'}
          </div>
          <div className="text-[10px] text-slate-400">Sub-second convergence</div>
        </div>
      </div>

      {/* Animated Path Nodes */}
      <div className="relative py-4">
        {/* Connection line */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-slate-800 rounded-full z-0">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${(activeHop / 4) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
          {hops.map((hop) => {
            const Icon = hop.icon;
            const isCurrent = activeHop === hop.id;

            return (
              <div
                key={hop.id}
                className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-2 ${
                  isCurrent
                    ? 'bg-slate-800/90 scale-105 shadow-xl ring-2'
                    : 'bg-slate-950/80 border-slate-800/90'
                }`}
                style={{
                  borderColor: isCurrent ? hop.color : undefined,
                  boxShadow: isCurrent ? `0 0 20px -3px ${hop.color}44` : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${hop.color}20`, color: hop.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    Hop {hop.id + 1}/5
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-100 truncate">{hop.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{hop.tag}</p>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="font-mono text-[10px] text-cyan-300 truncate" title={hop.ipv6}>
                    {hop.ipv6}
                  </div>
                  <div className="text-[9px] text-amber-300/90 truncate font-semibold">
                    {hop.qos}
                  </div>
                </div>

                {isCurrent && (
                  <div className="pt-1 flex items-center justify-center text-[10px] font-bold text-emerald-400 animate-pulse">
                    ● Packet In-Transit
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Architectural Deep-Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            1. Prefix Delegation (DHCPv6-PD /60) for Fleet
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every ambulance, fire engine, and police vehicle is delegated a full <code className="text-cyan-300 font-mono">/60</code> subnet (16 distinct /64 networks). This allows the vehicle router to assign individual dedicated subnets to onboard video cameras, patient tele-health telemetry, defibrillator sensors, and first-responder handheld radios without requiring NAT or routing re-negotiation during 5G tower handovers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            2. Anycast BGP Routing for PSAP Dispatch Resilience
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The 911 / PSAP Dispatch center utilizes an Anycast IPv6 address (<code className="text-cyan-300 font-mono">2001:db8:0040::1</code>) announced from multiple geo-redundant data centers. If the primary command center experiences a fiber cut or outage, BGP automatically withdraws the route and converges to the secondary disaster-recovery site in under <strong>500 milliseconds</strong> with zero dropped calls.
          </p>
        </div>
      </div>
    </div>
  );
};
