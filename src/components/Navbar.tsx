import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCityContext } from '../context/CityContext';
import {
  Network,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  ShieldAlert,
  Server,
  Sparkles,
  Layers
} from 'lucide-react';
import { formatBigNumber, formatNumber } from '../lib/utils';

export const STEPS = [
  { path: '/', label: 'Overview', stepNum: 1 },
  { path: '/requirements', label: 'Requirements', stepNum: 2 },
  { path: '/suitability', label: 'Suitability', stepNum: 3 },
  { path: '/plan-builder', label: 'Address Plan', stepNum: 4 },
  { path: '/comparison', label: 'IPv4 vs IPv6', stepNum: 5 },
  { path: '/scalability', label: 'Scalability', stepNum: 6 },
  { path: '/emergency-dive', label: 'Emergency', stepNum: 7 },
  { path: '/migration', label: 'Migration', stepNum: 8 },
  { path: '/report', label: 'Report & Export', stepNum: 9 }
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    theme,
    toggleTheme,
    isSidebarCollapsed,
    setSidebarCollapsed,
    totalCurrentDevices,
    config,
    ipv4DeficitInfo
  } = useCityContext();

  const currentStep = STEPS.find(s => s.path === location.pathname) || STEPS[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40 group-hover:scale-105 transition-transform">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  CityNet
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  NOC Architect
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                IPv4 vs IPv6 IoT Addressing & Scale Engine
              </p>
            </div>
          </div>
        </div>

        {/* Center: Guided 5-Step Workflow Breadcrumb (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full shadow-inner">
          {[
            { path: '/requirements', name: '1. Requirements' },
            { path: '/suitability', name: '2. Suitability' },
            { path: '/plan-builder', name: '3. Addressing Plan' },
            { path: '/comparison', name: '4. Compare' },
            { path: '/report', name: '5. Report' }
          ].map((item, idx, arr) => {
            const isActive = location.pathname === item.path;
            return (
              <React.Fragment key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {item.name}
                </button>
                {idx < arr.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: City Live Telemetry Pill & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Real-time scale badge */}
          <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Devices:</span>
              <span className="font-mono font-bold text-slate-100">
                {formatBigNumber(totalCurrentDevices)}
              </span>
            </div>
            <div className="w-px h-3.5 bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Districts:</span>
              <span className="font-mono font-bold text-cyan-300">
                {config.districts}
              </span>
            </div>
          </div>

          {/* IPv4 Status pill */}
          <div
            onClick={() => navigate('/scalability')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${
              ipv4DeficitInfo.class10Exhausted
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/70'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            }`}
            title="IPv4 Space Status"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="font-mono font-medium">
              {ipv4DeficitInfo.class10Exhausted ? 'IPv4 Deficit!' : 'IPv4 OK'}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark NOC Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
