import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCityContext } from '../context/CityContext';
import {
  Network,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';
import { formatBigNumber, formatNumber } from '../lib/utils';
import { WhatAmILookingAt } from '../components/WhatAmILookingAt';

export const HomeOverview: React.FC = () => {
  const navigate = useNavigate();
  const {
    totalCurrentDevices,
    config,
    ipv4DeficitInfo,
    ipv6Capacity,
    suitabilityScore,
    devicesByClass
  } = useCityContext();

  const steps = [
    {
      step: 1,
      name: 'City Requirements',
      desc: 'Configure 16 districts, device counts & 10-year growth rates',
      path: '/requirements'
    },
    {
      step: 2,
      name: 'Suitability Assessment',
      desc: '11 weighted technical criteria & IPv6 suitability verdict',
      path: '/suitability'
    },
    {
      step: 3,
      name: 'Addressing Plan Builder',
      desc: '128-bit hierarchical prefix builder & interactive subnet tree',
      path: '/plan-builder'
    },
    {
      step: 4,
      name: 'IPv4 vs IPv6 Matrix',
      desc: 'Side-by-side protocol comparison with IoT filter',
      path: '/comparison'
    },
    {
      step: 5,
      name: 'Report & Export',
      desc: 'Executive summary, printable PDF, and CSV addressing plan',
      path: '/report'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* What Am I Looking At context header */}
      <WhatAmILookingAt
        title="CityNet Executive Overview & Navigation Center"
        summary="CityNet Address Planner is an enterprise network architecture engine built to evaluate IPv4 and IPv6 protocols for large-scale municipal IoT environments. It combines real-time subnetting arithmetic with interactive design models across 4 critical smart city device categories."
        keyPoints={[
          'Models real mathematical address consumption for millions of devices without hard-coded numbers.',
          'Features a 128-bit hierarchical IPv6 addressing scheme using documentation block 2001:db8::/32.',
          'Demonstrates IPv4 RFC1918 private address exhaustion and Carrier-Grade NAT (CGNAT) bottlenecks.',
          'Includes emergency PSAP priority routing simulations with DSCP Expedited Forwarding (EF).'
        ]}
        architectTip="Begin with the 5-Step Guided Tour or jump directly to the Addressing Plan Builder to inspect the nibble-aligned bitfield architecture."
      />

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#0B1220] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Municipal IoT Addressing Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            CityNet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">Address Planner</span>
          </h1>

          {/* 3-Line Technical Brief */}
          <div className="space-y-1.5 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              1. <strong>Strategic Architectural Assessment:</strong> Evaluates IPv4 vs IPv6 suitability across scale, auto-configuration, QoS, multicast, and security for high-density IoT cities.
            </p>
            <p>
              2. <strong>Hierarchical 128-Bit Addressing Engine:</strong> Generates clean, nibble-aligned subnets for environmental sensors, traffic signals, CCTV surveillance, and emergency fleets.
            </p>
            <p>
              3. <strong>Scalability & Migration Roadmap:</strong> Visualizes RFC 1918 private IPv4 exhaustion thresholds and guides a 4-phase transition to pure IPv6 with NAT64/DNS64.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/requirements')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 cursor-pointer"
            >
              <span>Start Guided Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/plan-builder')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Addressing Plan Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: City Devices */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>City IoT Endpoints</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-100">
            {formatNumber(totalCurrentDevices)}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold font-mono">
              {config.districts} Municipal Districts
            </span>
            <span>• {config.growthRatePct}% YoY Growth</span>
          </div>
        </div>

        {/* KPI 2: IPv4 Address Space Status */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>IPv4 Needed vs Available</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-400">
            {formatBigNumber(totalCurrentDevices)} / {formatBigNumber(ipv4DeficitInfo.class10CleanMax)}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            {ipv4DeficitInfo.class10Exhausted ? (
              <span className="text-rose-400 font-semibold">
                ⚠️ Exhausted! Deficit of {formatBigNumber(ipv4DeficitInfo.deficitTotal)}
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold">
                ✓ Within 10.0.0.0/8 private space
              </span>
            )}
          </div>
        </div>

        {/* KPI 3: IPv6 /64 Subnets Available */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>IPv6 /64 Subnets in /32</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cyan-300">
            4.29 Billion
          </div>
          <div className="text-xs text-slate-400">
            Each /64 holds <strong className="text-slate-200">18.4 Quintillion</strong> IPs
          </div>
        </div>

        {/* KPI 4: Architecture Suitability Score */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Suitability Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {suitabilityScore.ipv6Total}
            </span>
            <span className="text-xs text-slate-400">vs IPv4: {suitabilityScore.ipv4Total} / 10</span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold">
            Recommended: IPv6 Dual-Stack Transition
          </div>
        </div>
      </div>

      {/* 5-Step Guided Progress Tracker */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Guided Architectural Workflow
            </h2>
            <p className="text-xs text-slate-400">
              Follow the 5-phase sequential process to configure, assess, plan, and generate the final report
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((s) => (
            <div
              key={s.step}
              onClick={() => navigate(s.path)}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-cyan-500/40 cursor-pointer transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold text-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                  0{s.step}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {s.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Class Breakdown Cards */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Current Smart City Device Fleet Distribution
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              name: 'Environmental Sensors',
              count: devicesByClass.sensors,
              code: '0x1',
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              tech: 'SLAAC / 6LoWPAN / LoRaWAN'
            },
            {
              name: 'Traffic Signal Controllers',
              count: devicesByClass.traffic,
              code: '0x2',
              color: 'text-sky-400',
              bg: 'bg-sky-500/10 border-sky-500/30',
              tech: 'Static IP / C-ITS / Zero Jitter'
            },
            {
              name: 'Surveillance & Edge AI',
              count: devicesByClass.surveillance,
              code: '0x3',
              color: 'text-purple-400',
              bg: 'bg-purple-500/10 border-purple-500/30',
              tech: 'Multicast ff0e:: / 4K Video'
            },
            {
              name: 'Emergency Services & PSAP',
              count: devicesByClass.emergency,
              code: '0x4',
              color: 'text-rose-400',
              bg: 'bg-rose-500/10 border-rose-500/30',
              tech: 'Anycast / DSCP EF / PD /60'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.bg} ${item.color}`}>
                  Service {item.code}
                </span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {formatNumber(item.count)}
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">{item.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.tech}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
