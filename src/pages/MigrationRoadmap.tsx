import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MIGRATION_PHASES } from '../data/migrationSteps';
import {
  Milestone,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Globe,
  Radio,
  Server,
  Layers
} from 'lucide-react';
import { WhatAmILookingAt } from '../components/WhatAmILookingAt';
import { Tooltip } from '../components/Tooltip';

export const MigrationRoadmap: React.FC = () => {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState<number>(2); // Phase 2 default expanded
  const [testIpv4Target, setTestIpv4Target] = useState<string>('198.51.100.45');

  // NAT64 / DNS64 synthesis calculation (Well-Known Prefix 64:ff9b::/96)
  const calculateNat64 = (ipv4: string) => {
    try {
      const octets = ipv4.split('.').map(o => parseInt(o, 10));
      if (octets.length === 4 && octets.every(o => !isNaN(o) && o >= 0 && o <= 255)) {
        const hex1 = octets[0].toString(16).padStart(2, '0') + octets[1].toString(16).padStart(2, '0');
        const hex2 = octets[2].toString(16).padStart(2, '0') + octets[3].toString(16).padStart(2, '0');
        return `64:ff9b::${hex1}:${hex2}`;
      }
    } catch {
      // fallback
    }
    return '64:ff9b::c633:642d';
  };

  const synthesizedIpv6 = calculateNat64(testIpv4Target);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WhatAmILookingAt
        title="4-Phase IPv6 Transition & Coexistence Strategy"
        summary="A pragmatic, non-disruptive migration blueprint transitioning the smart city from legacy dual-stack to pure IPv6-only operations. Addresses legacy SCADA PLCs, boundary security, and zero-downtime cutovers using RFC-standardized translation mechanisms."
        keyPoints={[
          'Phase 1 to 4 Progression: Dual-Stack Backbone → Greenfield IoT SLAAC → Anycast PSAP → Pure IPv6 Core.',
          'NAT64 / DNS64 (RFC 6146/6147): Allows new IPv6-only sensors to reach legacy IPv4 cloud dashboards via synthesized 64:ff9b::/96 addresses.',
          'Stateless SIIT (RFC 7915): Provides hardware-accelerated wire-speed translation for high-volume legacy RTUs without state table memory overhead.'
        ]}
        architectTip="Use the interactive NAT64 / DNS64 Synthesizer below to test how legacy IPv4 servers are dynamically translated into IPv6 packets by border routers."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Milestone className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                Step 7: Municipal Migration Roadmap (4-Phase Transition)
              </h1>
              <p className="text-xs text-slate-400">
                Phased dual-stack rollout, greenfield SLAAC onboarding, and NAT64/DNS64 legacy translation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive NAT64 / DNS64 Translation Sandbox */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Interactive NAT64 / DNS64 Translation Sandbox (RFC 6052 / RFC 6146)
              </h3>
              <p className="text-xs text-slate-400">
                Simulate how an IPv6-only municipal sensor reaches an external IPv4-only cloud server
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            WKP: 64:ff9b::/96
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Step 1: IPv4 Target */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-400">
              1. Legacy IPv4 Cloud Endpoint
            </span>
            <input
              type="text"
              value={testIpv4Target}
              onChange={e => setTestIpv4Target(e.target.value)}
              placeholder="198.51.100.45"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-slate-400">
              External SaaS API or legacy municipal SCADA database
            </p>
          </div>

          {/* Step 2: DNS64 Synthesis */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <span className="text-[10px] uppercase font-bold text-cyan-400">
              2. DNS64 Synthesized IPv6 AAAA Record
            </span>
            <div className="font-mono text-xs font-bold text-cyan-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 break-all">
              {synthesizedIpv6}
            </div>
            <p className="text-[10px] text-slate-400">
              DNS64 prepends Well-Known Prefix <code className="text-cyan-300 font-mono">64:ff9b::/96</code>
            </p>
          </div>

          {/* Step 3: NAT64 Gateway */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400">
              3. Border NAT64 Gateway Forwarding
            </span>
            <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Translates L3 IPv6 Header to IPv4 Payload</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Stateful session translation with zero endpoint reconfiguration
            </p>
          </div>
        </div>
      </div>

      {/* 4 Migration Phases Timeline List */}
      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Municipal IPv6 Transition Phasing Plan
        </div>

        {MIGRATION_PHASES.map((phase) => {
          const isExpanded = expandedPhase === phase.phaseNumber;

          return (
            <div
              key={phase.phaseNumber}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50'
              }`}
            >
              {/* Accordion Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? 0 : phase.phaseNumber)}
                className="w-full p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-9 h-9 rounded-2xl font-mono font-bold text-xs flex items-center justify-center border shrink-0 ${
                      phase.status === 'Complete'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : phase.status === 'Active'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 ring-2 ring-cyan-500/20'
                        : phase.status === 'Planned'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    P{phase.phaseNumber}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-100">{phase.title}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold uppercase ${
                          phase.status === 'Complete'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : phase.status === 'Active'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30 animate-pulse'
                            : phase.status === 'Planned'
                            ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {phase.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{phase.architecture}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {phase.timeframe}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Accordion Expanded Body */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
                  {/* Key Actions */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Key Engineering Actions:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {phase.keyActions.map((action, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks & Mitigations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Identified Technical Risks:
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-amber-200/90 list-disc pl-4">
                        {phase.risks.map((risk, idx) => (
                          <li key={idx} className="leading-relaxed">{risk}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Architectural Mitigations:
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-emerald-200/90 list-disc pl-4">
                        {phase.mitigations.map((mit, idx) => (
                          <li key={idx} className="leading-relaxed">{mit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      RFC Standards:
                    </span>
                    {phase.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between">
        <button
          onClick={() => navigate('/emergency-dive')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
        >
          ← Back to Emergency Deep Dive
        </button>

        <button
          onClick={() => navigate('/report')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          <span>Proceed to Step 8: Executive Report & Export</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
