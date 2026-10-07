import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCityContext } from '../context/CityContext';
import { SUITABILITY_CRITERIA } from '../data/suitabilityData';
import {
  Award,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  Layers,
  Cpu,
  Zap
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip
} from 'recharts';
import { WhatAmILookingAt } from '../components/WhatAmILookingAt';

export const SuitabilityAssessment: React.FC = () => {
  const navigate = useNavigate();
  const {
    suitabilityWeights,
    updateWeight,
    resetWeights,
    suitabilityScore
  } = useCityContext();

  // Prepare data for Radar Chart
  const radarData = SUITABILITY_CRITERIA.map(c => {
    return {
      criterion: c.name.split(' ')[0] + ' ' + (c.name.split(' ')[1] || ''),
      fullName: c.name,
      IPv4: c.ipv4Score,
      IPv6: c.ipv6Score,
      weight: suitabilityWeights[c.id] ?? c.defaultWeight
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WhatAmILookingAt
        title="Multi-Criteria Protocol Suitability Matrix"
        summary="A formal evaluation of IPv4 vs IPv6 across 10 critical networking dimensions for municipal IoT. Each criterion can be weighted from 1 to 10 based on municipal priorities (e.g. scale vs legacy migration cost) to recalculate the composite architectural score."
        keyPoints={[
          'Weighted Scoring Model: Multiplies intrinsic protocol capabilities (1-10) by municipal priority weights.',
          'Dimensional Radar Chart: Visualizes the dramatic divergence between IPv4 legacy constraints and IPv6 scale.',
          'Architectural Verdict: Provides evidence-based justification recommending IPv6-first with a dual-stack transition phase.'
        ]}
        architectTip="Even if legacy device compatibility is weighted at maximum (10), IPv6 decisively outperforms IPv4 due to overwhelming advantages in address scale, autoconfiguration, and elimination of NAT state tables."
      />

      {/* Top Header & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                Step 2: IPv4 vs IPv6 Suitability Assessment
              </h1>
              <p className="text-xs text-slate-400">
                Adjust criteria weighting to evaluate protocol fit for high-density smart municipal deployments
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={resetWeights}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
          <span>Reset Weights</span>
        </button>
      </div>

      {/* Executive Verdict Card */}
      <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/30 p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ARCHITECTURAL VERDICT: UNANIMOUS
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Recommended: IPv6-First Architecture with Dual-Stack Phase
            </h2>
            <p className="text-xs text-slate-300">
              IPv6 is mandatory for long-term municipal viability, eliminating CGNAT bottlenecks and enabling SLAAC ZTP.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-cyan-400">IPv6 Score</div>
              <div className="font-mono text-3xl font-black text-cyan-300">
                {suitabilityScore.ipv6Total}
                <span className="text-xs text-slate-500 font-normal">/10</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">{suitabilityScore.ipv6WeightedPercent}% Fit</div>
            </div>

            <div className="w-px h-10 bg-slate-800" />

            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-amber-400">IPv4 Score</div>
              <div className="font-mono text-3xl font-black text-amber-400">
                {suitabilityScore.ipv4Total}
                <span className="text-xs text-slate-500 font-normal">/10</span>
              </div>
              <div className="text-[10px] text-rose-400 font-semibold">{suitabilityScore.ipv4WeightedPercent}% Fit</div>
            </div>
          </div>
        </div>

        {/* Verdict Justification Bullets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <strong className="text-cyan-400 font-semibold">1. Unlimited Scalability:</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Provides 4.29 billion /64 subnets per /32 city block, avoiding private RFC1918 space collapse.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <strong className="text-purple-400 font-semibold">2. Zero-Touch SLAAC Autoconfig:</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Eliminates stateful DHCP memory limits for 2.4M+ battery-operated street sensors.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <strong className="text-emerald-400 font-semibold">3. True End-to-End Multicast & QoS:</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Enables native video multicast (ff0e::) and priority DSCP EF without NAT hole-punching.
            </p>
          </div>
        </div>
      </div>

      {/* Radar Chart & Weighting Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Visual (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              10-Dimensional Protocol Capability Radar
            </h3>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="criterion"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#475569" />
                <Radar
                  name="IPv6 Capability"
                  dataKey="IPv6"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.4}
                />
                <Radar
                  name="IPv4 Capability"
                  dataKey="IPv4"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.2}
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Outer perimeter indicates maximum score (10/10). IPv6 dominates in 8 of 10 categories.
          </p>
        </div>

        {/* Weighted Criteria Sliders List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-200">
              Criteria Weighting Matrix (1 = Low Priority, 10 = Critical)
            </h3>
            <span className="text-xs text-slate-400 font-mono">10 Criteria Total</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {SUITABILITY_CRITERIA.map(c => {
              const currentWeight = suitabilityWeights[c.id] ?? c.defaultWeight;

              return (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{c.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {c.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="text-amber-400">IPv4: {c.ipv4Score}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-cyan-400 font-bold">IPv6: {c.ipv6Score}</span>
                      </div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                        Weight: {currentWeight}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal">{c.description}</p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[10px] text-slate-500 font-mono">1 (Low)</span>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={currentWeight}
                      onChange={e => updateWeight(c.id, parseInt(e.target.value, 10))}
                      className="flex-1 accent-purple-400 cursor-pointer h-1.5 bg-slate-950 rounded"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">10 (Critical)</span>
                  </div>

                  {/* Notes snippet */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-slate-800/60 text-[10px]">
                    <div className="text-amber-300/80">
                      <strong className="text-amber-400">IPv4: </strong>
                      {c.ipv4Notes}
                    </div>
                    <div className="text-cyan-300/90">
                      <strong className="text-cyan-400">IPv6: </strong>
                      {c.ipv6Notes}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between">
        <button
          onClick={() => navigate('/requirements')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
        >
          ← Back to Requirements
        </button>

        <button
          onClick={() => navigate('/plan-builder')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          <span>Proceed to Step 3: Addressing Plan Builder</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
