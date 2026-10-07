import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCityContext } from '../context/CityContext';
import {
  LayoutDashboard,
  Sliders,
  Award,
  Binary,
  GitCompare,
  TrendingUp,
  ShieldAlert,
  Milestone,
  FileText,
  ChevronLeft,
  ChevronRight,
  Radio,
  Cpu,
  Camera,
  Activity
} from 'lucide-react';
import { formatBigNumber } from '../lib/utils';

export const NAV_ITEMS = [
  {
    path: '/',
    label: 'Overview & Guided Tour',
    shortLabel: 'Overview',
    icon: LayoutDashboard,
    step: 1,
    badge: 'Home'
  },
  {
    path: '/requirements',
    label: 'City Requirements',
    shortLabel: 'Requirements',
    icon: Sliders,
    step: 2,
    badge: 'Inputs'
  },
  {
    path: '/suitability',
    label: 'Suitability Assessment',
    shortLabel: 'Suitability',
    icon: Award,
    step: 3,
    badge: 'Matrix'
  },
  {
    path: '/plan-builder',
    label: 'Addressing Plan Builder',
    shortLabel: 'Addressing Plan',
    icon: Binary,
    step: 4,
    badge: 'Core Engine'
  },
  {
    path: '/comparison',
    label: 'IPv4 vs IPv6 Comparison',
    shortLabel: 'Comparison',
    icon: GitCompare,
    step: 5,
    badge: 'Deep Matrix'
  },
  {
    path: '/scalability',
    label: 'Scalability Simulator',
    shortLabel: 'Scalability',
    icon: TrendingUp,
    step: 6,
    badge: '100M Scale'
  },
  {
    path: '/emergency-dive',
    label: 'Emergency Deep Dive',
    shortLabel: 'Emergency PSAP',
    icon: ShieldAlert,
    step: 7,
    badge: 'QoS EF'
  },
  {
    path: '/migration',
    label: 'Migration Roadmap',
    shortLabel: 'Migration',
    icon: Milestone,
    step: 8,
    badge: '4 Phases'
  },
  {
    path: '/report',
    label: 'Report & Export',
    shortLabel: 'Report',
    icon: FileText,
    step: 9,
    badge: 'PDF / CSV'
  }
];

export const Sidebar: React.FC = () => {
  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    totalCurrentDevices,
    devicesByClass
  } = useCityContext();

  return (
    <aside
      className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] bg-slate-950/95 md:bg-slate-950/70 border-r border-slate-800/80 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
        isSidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'w-72'
      }`}
    >
      {/* Navigation List */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${isSidebarCollapsed ? 'md:hidden' : ''}`}>
          Guided Workflow
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-md font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
              title={item.label}
            >
              <div className="relative shrink-0">
                <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-slate-800 text-[9px] font-mono text-slate-300 flex items-center justify-center border border-slate-700">
                  {item.step}
                </span>
              </div>

              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Device Telemetry Summary (if expanded) */}
      {!isSidebarCollapsed && (
        <div className="p-4 m-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-400">Total City Devices</span>
            <span className="font-mono font-bold text-slate-100">
              {formatBigNumber(totalCurrentDevices)}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Activity className="w-3 h-3" /> Sensors:
              </span>
              <span className="font-mono text-slate-300">{formatBigNumber(devicesByClass.sensors)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Radio className="w-3 h-3" /> Traffic:
              </span>
              <span className="font-mono text-slate-300">{formatBigNumber(devicesByClass.traffic)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-purple-400">
                <Camera className="w-3 h-3" /> Surveillance:
              </span>
              <span className="font-mono text-slate-300">{formatBigNumber(devicesByClass.surveillance)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-rose-400">
                <ShieldAlert className="w-3 h-3" /> Emergency:
              </span>
              <span className="font-mono text-slate-300">{formatBigNumber(devicesByClass.emergency)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse button at bottom */}
      <div className="p-3 border-t border-slate-800/80 flex items-center justify-center">
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-850 rounded-lg transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
