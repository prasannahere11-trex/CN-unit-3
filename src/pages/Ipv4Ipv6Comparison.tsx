import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMPARISON_ITEMS } from '../data/comparisonData';
import {
  GitCompare,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import { WhatAmILookingAt } from '../components/WhatAmILookingAt';

export const Ipv4Ipv6Comparison: React.FC = () => {
  const navigate = useNavigate();
  const [iotOnlyFilter, setIotOnlyFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Addressing & Architecture', 'Header & Routing', 'Scale & Connectivity', 'Operations & Provisioning', 'Protocol & Bandwidth', 'QoS & Traffic Engineering', 'Security & Integrity'];

  const filteredItems = COMPARISON_ITEMS.filter(item => {
    if (iotOnlyFilter && !item.isIotCritical) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WhatAmILookingAt
        title="Comprehensive IPv4 vs IPv6 Protocol Comparison Matrix"
        summary="A deep technical head-to-head comparison examining the architectural, operational, and performance differences between IPv4 and IPv6. Special emphasis is given to low-power IoT constraints, video streaming multicast, and emergency preemption."
        keyPoints={[
          'IoT Critical Filter: Highlights features that directly affect sensor battery lifespan, radio airtime, and NAT state limits.',
          'Fixed 40-Byte Header & No Checksum: Offloads intermediate router CPU cycles for line-rate packet throughput.',
          'Broadcast Elimination: Replaces noisy ARP broadcasts with multicast NDP, preventing radio wakeups across 6LoWPAN mesh nodes.'
        ]}
        architectTip="Toggle 'Show only differences that matter for IoT' to instantly filter out generic theoretical items and focus on operational smart city requirements."
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <GitCompare className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                Step 4: Side-by-Side IPv4 vs IPv6 Comparison Matrix
              </h1>
              <p className="text-xs text-slate-400">
                Evaluating protocol mechanics, header architectures, and operational scalability
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIotOnlyFilter(!iotOnlyFilter)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              iotOnlyFilter
                ? 'bg-cyan-950 text-cyan-300 border-cyan-400 ring-2 ring-cyan-400/30 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Show Only IoT-Critical Differences</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-md'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Comparison Table Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-wider font-semibold text-slate-400">
                <th className="py-4 px-5 w-1/4">Protocol Attribute</th>
                <th className="py-4 px-5 w-1/4 text-amber-400 bg-amber-950/10">Legacy IPv4 Architecture</th>
                <th className="py-4 px-5 w-1/4 text-cyan-400 bg-cyan-950/10">Next-Gen IPv6 Architecture</th>
                <th className="py-4 px-5 w-1/4">IoT Smart City Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {filteredItems.map(item => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Attribute & Category */}
                  <td className="py-4 px-5 space-y-1 align-top">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {item.attribute}
                      </span>
                      {item.isIotCritical && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold uppercase tracking-wider">
                          IoT Critical
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {item.category}
                    </div>
                  </td>

                  {/* IPv4 Side */}
                  <td className="py-4 px-5 align-top bg-amber-950/5 space-y-1 font-mono text-[11px] text-amber-200/90 leading-relaxed border-l border-r border-slate-800/60">
                    <div>{item.ipv4}</div>
                  </td>

                  {/* IPv6 Side */}
                  <td className="py-4 px-5 align-top bg-cyan-950/5 space-y-1 font-mono text-[11px] text-cyan-200/90 leading-relaxed border-r border-slate-800/60">
                    <div className="font-semibold">{item.ipv6}</div>
                  </td>

                  {/* IoT Smart City Impact */}
                  <td className="py-4 px-5 align-top space-y-1.5 text-slate-300 leading-relaxed">
                    <p className="text-[11px] text-slate-300">{item.iotImpact}</p>
                    <div className="pt-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-semibold font-mono ${
                          item.verdict === 'IPv6 Advantage'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : item.verdict === 'IPv4 Advantage'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.verdict === 'IPv6 Advantage' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : item.verdict === 'IPv4 Advantage' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : null}
                        {item.verdict}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Summary Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            1. No CGNAT Bottleneck
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminates high-maintenance translation state tables. Sensors can receive direct cloud alerts and push events without expensive polling connections.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            2. 35% Battery Life Savings
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminating NAT keep-alive pings and broadcast ARP wakeups drastically extends battery lifespans for water and soil sensors deployed in the field.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            3. Wire-Speed 40B Header
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fixed 40-byte base header allows router hardware ASICs to process municipal CCTV video streams and emergency packets with deterministic sub-millisecond latency.
          </p>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between">
        <button
          onClick={() => navigate('/plan-builder')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
        >
          ← Back to Addressing Plan
        </button>

        <button
          onClick={() => navigate('/scalability')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          <span>Proceed to Step 5: Scalability Simulator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
