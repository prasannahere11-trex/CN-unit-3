import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCityContext } from '../context/CityContext';
import {
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  Server,
  Zap,
  ShieldAlert,
  HelpCircle,
  Activity,
  Cpu
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatBigNumber, formatNumber } from '../lib/utils';
import { WhatAmILookingAt } from '../components/WhatAmILookingAt';

export const ScalabilitySimulator: React.FC = () => {
  const navigate = useNavigate();
  const { totalCurrentDevices } = useCityContext();

  // Sim slider from 10k to 100M
  const [simulatedDevices, setSimulatedDevices] = useState<number>(Math.max(2500000, totalCurrentDevices));

  // Thresholds
  const CLASS_10_LIMIT = 16777216; // 10.0.0.0/8
  const RFC1918_TOTAL_LIMIT = 17891328; // 10/8 + 172.16/12 + 192.168/16

  const isClass10Exhausted = simulatedDevices > CLASS_10_LIMIT;
  const isRfc1918Exhausted = simulatedDevices > RFC1918_TOTAL_LIMIT;

  // Compute NAT Metrics
  const natStateEntries = Math.round(simulatedDevices * 4.5); // Average 4.5 active UDP/TCP flows per IoT device
  const natMemoryMb = Math.round((natStateEntries * 160) / (1024 * 1024)); // 160 bytes per state table entry
  const cgnatPublicIpsNeeded = Math.ceil(natStateEntries / 60000); // 60,000 usable ports per public IPv4

  // Chart data points spanning 10k to 100M on log scale
  const scalePoints = [
    { label: '10k', count: 10000 },
    { label: '100k', count: 100000 },
    { label: '1M', count: 1000000 },
    { label: '5M', count: 5000000 },
    { label: '16.7M (10/8 Cap)', count: 16777216 },
    { label: '30M', count: 30000000 },
    { label: '60M', count: 60000000 },
    { label: '100M', count: 100000000 }
  ];

  const chartData = scalePoints.map(pt => {
    return {
      scale: pt.label,
      deviceCount: pt.count,
      IPv4_Private_Available: Math.max(0, RFC1918_TOTAL_LIMIT - pt.count),
      IPv4_Private_Deficit: Math.max(0, pt.count - RFC1918_TOTAL_LIMIT),
      IPv6_Address_Capacity: 100000000 // Displayed as unlimited headroom
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WhatAmILookingAt
        title="Scalability Stress-Test Simulator (10k to 100M Endpoints)"
        summary="A dynamic stress-test engine demonstrating the mathematical breaking points of IPv4 addressing. Slide endpoint volume from 10,000 to 100 million devices to observe when private RFC 1918 address pools collapse and Carrier-Grade NAT (CGNAT) table overflows occur."
        keyPoints={[
          'RFC 1918 Collapse: Total usable private IPv4 address space across all three RFC 1918 blocks is capped at 17,891,328 addresses.',
          'CGNAT Memory Pressure: Tracking 100M devices requires maintaining ~450 million active translation session entries, consuming hundreds of megabytes of router RAM.',
          'IPv6 Infinite Headroom: A single /32 municipal block holds 4.29 billion /64 subnets, scaling effortlessly beyond 100 million devices without translation.'
        ]}
        architectTip="Observe the NAT State Memory card as you slide past 17.9M devices. Dual-NAT (NAT444) adds packet serialization delay and packet drops to real-time traffic lights and emergency radios."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                Step 5: Scalability & Address Exhaustion Simulator
              </h1>
              <p className="text-xs text-slate-400">
                Stress-test municipal scale from 10,000 to 100,000,000 connected smart endpoints
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
          <span className="text-xs text-slate-400">Simulated Scale:</span>
          <span className="font-mono text-base font-black text-cyan-400">
            {formatNumber(simulatedDevices)} Endpoints
          </span>
        </div>
      </div>

      {/* Interactive Scale Slider Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Simulate Total Connected Smart City Endpoints:
          </label>
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setSimulatedDevices(500000)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              500k
            </button>
            <button
              onClick={() => setSimulatedDevices(5000000)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              5M
            </button>
            <button
              onClick={() => setSimulatedDevices(16777216)}
              className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40"
            >
              16.7M (10/8 Cap)
            </button>
            <button
              onClick={() => setSimulatedDevices(50000000)}
              className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40"
            >
              50M
            </button>
            <button
              onClick={() => setSimulatedDevices(100000000)}
              className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40"
            >
              100M Max
            </button>
          </div>
        </div>

        <input
          type="range"
          min={10000}
          max={100000000}
          step={50000}
          value={simulatedDevices}
          onChange={e => setSimulatedDevices(parseInt(e.target.value, 10))}
          className="w-full accent-cyan-400 cursor-pointer h-3 bg-slate-950 rounded-xl"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>10k Devices</span>
          <span>16.7M (Class 10 Exhaustion)</span>
          <span>17.9M (Total RFC1918 Limit)</span>
          <span>100 Million Mega-City</span>
        </div>
      </div>

      {/* Dynamic Exhaustion Warning Banners */}
      {isRfc1918Exhausted ? (
        <div className="p-5 rounded-3xl bg-rose-950/50 border border-rose-500/50 shadow-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>CRITICAL ALERT: Entire RFC 1918 Private IPv4 Address Space Depleted!</span>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed">
            At <strong>{formatNumber(simulatedDevices)}</strong> devices, the city has exceeded all available private IPv4 space (<code className="text-white font-mono">10.0.0.0/8</code>, <code className="text-white font-mono">172.16.0.0/12</code>, and <code className="text-white font-mono">192.168.0.0/16</code> combined total of 17.89M IPs). Mandatory <strong>Carrier-Grade NAT (CGNAT RFC 6598 / NAT444)</strong> must be deployed. This requires maintaining over <strong>{formatNumber(natStateEntries)}</strong> active translation states, creating severe edge router memory bottlenecks and breaking peer-to-peer C-ITS vehicle telemetry.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-500/30">
              <span className="text-rose-300 font-medium">Private Address Deficit:</span>
              <div className="font-mono text-base font-bold text-white mt-0.5">
                -{formatNumber(simulatedDevices - RFC1918_TOTAL_LIMIT)} Addresses
              </div>
            </div>
            <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-500/30">
              <span className="text-rose-300 font-medium">CGNAT Public IPs Needed:</span>
              <div className="font-mono text-base font-bold text-white mt-0.5">
                {formatNumber(cgnatPublicIpsNeeded)} Public IPv4s (1:60k PAT)
              </div>
            </div>
            <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-500/30">
              <span className="text-rose-300 font-medium">Router NAT RAM Overhead:</span>
              <div className="font-mono text-base font-bold text-white mt-0.5">
                ~{natMemoryMb} MB Dedicated State RAM
              </div>
            </div>
          </div>
        </div>
      ) : isClass10Exhausted ? (
        <div className="p-5 rounded-3xl bg-amber-950/40 border border-amber-500/40 shadow-xl space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>WARNING: Primary 10.0.0.0/8 Municipal Block Fully Exhausted!</span>
          </div>
          <p className="text-xs text-amber-200 leading-relaxed">
            Device volume has surpassed 16.7M addresses. The network must now be carved into disjointed secondary pools (<code className="font-mono">172.16.0.0/12</code> and <code className="font-mono">192.168.0.0/16</code>), introducing routing table fragmentation, asymmetric inter-district NAT rules, and complex ACL policies.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>IPv4 Private Capacity Status: Within 10.0.0.0/8 single-block limits ({formatNumber(CLASS_10_LIMIT - simulatedDevices)} remaining).</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold hidden sm:inline">
            IPv6 Headroom: 99.999999% Free
          </span>
        </div>
      )}

      {/* Scalability Chart */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Address Capacity vs. Device Scale Trajectory
          </h3>
          <span className="text-xs text-slate-400 font-mono">Logarithmic Capacity Curve</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="scale" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => formatBigNumber(val)}
              />
              <RechartsTooltip
                formatter={(val: any) => [formatNumber(Number(val)), 'Count']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
              />
              <ReferenceLine
                y={RFC1918_TOTAL_LIMIT}
                label={{ value: 'RFC1918 Cap (17.9M)', fill: '#ef4444', fontSize: 10, position: 'top' }}
                stroke="#ef4444"
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="deviceCount"
                name="Connected IoT Devices"
                stroke="#38BDF8"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="IPv4_Private_Available"
                name="Remaining IPv4 Private Space"
                stroke="#10B981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="IPv4_Private_Deficit"
                name="IPv4 Deficit (Unaddressable)"
                stroke="#F43F5E"
                strokeWidth={2}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fun Facts Cards Grid */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          IPv6 Mathematical Scale Facts
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              1. A Single /64 Subnet
            </div>
            <div className="font-mono text-xl font-bold text-slate-100">
              18.44 Quintillion
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exactly <strong>18,446,744,073,709,551,616</strong> unique addresses per /64 zone. Every physical square millimeter of the city could have its own IP address.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-purple-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              2. City /32 Block Capacity
            </div>
            <div className="font-mono text-xl font-bold text-slate-100">
              4.29 Billion /64s
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A standard documentation prefix <code className="text-cyan-300 font-mono">2001:db8::/32</code> contains 4.29 billion individual /64 subnets — as many subnets as the entire IPv4 internet has single addresses!
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              3. Planet-Scale Abundance
            </div>
            <div className="font-mono text-xl font-bold text-slate-100">
              3.4 × 10³⁸ Total IPs
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              If every grain of sand on planet Earth were assigned an IPv6 address, there would still be enough addresses left over to assign to 300 million other Earth-sized planets.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between">
        <button
          onClick={() => navigate('/comparison')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
        >
          ← Back to Comparison
        </button>

        <button
          onClick={() => navigate('/emergency-dive')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          <span>Proceed to Step 6: Emergency Deep Dive</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
