import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCityContext } from '../context/CityContext';
import {
  Sliders,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  Navigation,
  Camera,
  ShieldAlert,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatBigNumber, formatNumber } from '../lib/utils';
import { WhatAmILookingAt } from '../components/WhatAmILookingAt';

export const CityRequirements: React.FC = () => {
  const navigate = useNavigate();
  const {
    config,
    updateConfig,
    updateDeviceCount,
    resetToDefaults,
    totalCurrentDevices,
    projectedGrowthDevices,
    devicesByClass
  } = useCityContext();

  const pieData = [
    { name: 'Sensors', value: devicesByClass.sensors, color: '#10B981' },
    { name: 'Traffic Signals', value: devicesByClass.traffic, color: '#3B82F6' },
    { name: 'Surveillance CCTV', value: devicesByClass.surveillance, color: '#A855F7' },
    { name: 'Emergency Services', value: devicesByClass.emergency, color: '#EF4444' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WhatAmILookingAt
        title="City Scale & IoT Requirements Modeling"
        summary="This module establishes the municipal deployment baseline. Adjust the district count, device density across 4 critical infrastructure classes, and projected annual growth rates to recalculate address demand in real-time."
        keyPoints={[
          'Municipal District Multiplier: Scales all 4 service classes across up to 256 distinct administrative zones.',
          'Compound Growth Projections: Models 10-year future device density to stress-test addressing longevity.',
          'Device Class Distribution: Sensors form ~92% of endpoint volume, dictating SLAAC and 6LoWPAN auto-configuration requirements.'
        ]}
        architectTip="Increasing districts above 16 will trigger the IPv4 10.0.0.0/8 private space threshold, illustrating why fixed /16 per district allocations fail in large cities."
      />

      {/* Top Header & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                Step 1: Smart City IoT Scale Requirements
              </h1>
              <p className="text-xs text-slate-400">
                Configure endpoint density per district, annual compound growth, and planning horizon
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={resetToDefaults}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* Top Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Current Endpoints
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cyan-400">
            {formatNumber(totalCurrentDevices)}
          </div>
          <div className="text-[11px] text-slate-400">
            Across {config.districts} Municipal Districts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {config.planningHorizonYears}-Year Projected Endpoints
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {formatNumber(projectedGrowthDevices)}
          </div>
          <div className="text-[11px] text-slate-400">
            At {config.growthRatePct}% Compound Annual Growth (YoY)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Net Expansion
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-purple-400">
            +{formatNumber(projectedGrowthDevices - totalCurrentDevices)}
          </div>
          <div className="text-[11px] text-slate-400">
            +{((projectedGrowthDevices / Math.max(1, totalCurrentDevices) - 1) * 100).toFixed(0)}% Fleet Expansion
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs Column & Donut Chart Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Municipal Districts Slider */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Number of Municipal Districts:
              </label>
              <span className="font-mono text-sm font-bold px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {config.districts} Districts
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={64}
              step={1}
              value={config.districts}
              onChange={e => updateConfig({ districts: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 District (Pilot)</span>
              <span>16 Districts (Standard Metro)</span>
              <span>64 Districts (Mega-Region)</span>
            </div>
          </div>

          {/* 4 Device Class Input Cards */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">
              Device Density per District (Baseline)
            </h3>

            {/* Class 1: Sensors */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  1. Environmental & Municipal Sensors
                </span>
                <span className="font-mono text-slate-200 font-bold">
                  {formatNumber(config.devicesPerClass.sensors)} / district
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={config.devicesPerClass.sensors}
                onChange={e => updateDeviceCount('sensors', parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-900 rounded"
              />
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>Citywide: {formatNumber(devicesByClass.sensors)} sensors</span>
                <span>Air, Noise, Soil, Smart Waste, Flood</span>
              </div>
            </div>

            {/* Class 2: Traffic */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-sky-400 flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  2. Traffic Signals & Flow Controllers
                </span>
                <span className="font-mono text-slate-200 font-bold">
                  {formatNumber(config.devicesPerClass.traffic)} / district
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={15000}
                step={100}
                value={config.devicesPerClass.traffic}
                onChange={e => updateDeviceCount('traffic', parseInt(e.target.value, 10))}
                className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-900 rounded"
              />
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>Citywide: {formatNumber(devicesByClass.traffic)} controllers</span>
                <span>Intersections, VMS Signs, C-V2X RSUs</span>
              </div>
            </div>

            {/* Class 3: Surveillance */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-400 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  3. Municipal Surveillance & Edge AI
                </span>
                <span className="font-mono text-slate-200 font-bold">
                  {formatNumber(config.devicesPerClass.surveillance)} / district
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={30000}
                step={250}
                value={config.devicesPerClass.surveillance}
                onChange={e => updateDeviceCount('surveillance', parseInt(e.target.value, 10))}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-900 rounded"
              />
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>Citywide: {formatNumber(devicesByClass.surveillance)} cameras</span>
                <span>4K CCTV, ALPR, Edge Analytics</span>
              </div>
            </div>

            {/* Class 4: Emergency */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  4. Emergency Services & Public Safety
                </span>
                <span className="font-mono text-slate-200 font-bold">
                  {formatNumber(config.devicesPerClass.emergency)} / district
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={10000}
                step={100}
                value={config.devicesPerClass.emergency}
                onChange={e => updateDeviceCount('emergency', parseInt(e.target.value, 10))}
                className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-900 rounded"
              />
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>Citywide: {formatNumber(devicesByClass.emergency)} units</span>
                <span>Ambulances, Fire, PSAP, Siren Nodes</span>
              </div>
            </div>
          </div>

          {/* Growth & Horizon Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  Annual Growth Rate
                </span>
                <span className="font-mono font-bold text-cyan-300">{config.growthRatePct}% / yr</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={1}
                value={config.growthRatePct}
                onChange={e => updateConfig({ growthRatePct: parseInt(e.target.value, 10) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-950 rounded"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Planning Horizon
                </span>
                <span className="font-mono font-bold text-purple-300">{config.planningHorizonYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={1}
                value={config.planningHorizonYears}
                onChange={e => updateConfig({ planningHorizonYears: parseInt(e.target.value, 10) })}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-950 rounded"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Donut Chart & Insights (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Donut Chart Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-cyan-400" />
                Device Class Proportion (Fleet Mix)
              </h3>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any) => [`${formatNumber(Number(val))} devices`, 'Count']}
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
                    height={36}
                    formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              {pieData.map((item, idx) => {
                const pct = ((item.value / Math.max(1, totalCurrentDevices)) * 100).toFixed(1);
                return (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <div className="font-mono text-slate-300">
                      <strong>{pct}%</strong> ({formatBigNumber(item.value)})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Architectural Takeaway Note */}
          <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Sparkles className="w-4 h-4" />
              Scale Implications for Address Planning:
            </div>
            <p className="leading-relaxed">
              Sensors constitute <strong>{((devicesByClass.sensors / Math.max(1, totalCurrentDevices)) * 100).toFixed(1)}%</strong> of the smart city fleet. In IPv4, this density instantly exhausts single <code className="text-cyan-300 font-mono">/16</code> district networks (limited to 65,534 hosts), requiring fragile multi-VLAN fragmentation. In IPv6, each zone receives an autonomous <code className="text-cyan-300 font-mono">/64</code> subnet, supporting trillions of sensors seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => navigate('/suitability')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          <span>Proceed to Step 2: Suitability Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
