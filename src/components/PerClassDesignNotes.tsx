import React, { useState } from 'react';
import { SERVICE_CLASSES } from '../data/serviceClasses';
import { DeviceClassKey } from '../types';
import {
  Activity,
  Navigation,
  Camera,
  ShieldAlert,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  Radio,
  Sparkles
} from 'lucide-react';
import { Tooltip } from './Tooltip';

export const PerClassDesignNotes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DeviceClassKey>('sensors');

  const classes: { key: DeviceClassKey; title: string; icon: any; color: string }[] = [
    { key: 'sensors', title: '1. Environmental Sensors', icon: Activity, color: '#10B981' },
    { key: 'traffic', title: '2. Traffic Controllers', icon: Navigation, color: '#3B82F6' },
    { key: 'surveillance', title: '3. Surveillance & Video', icon: Camera, color: '#A855F7' },
    { key: 'emergency', title: '4. Emergency Services', icon: ShieldAlert, color: '#EF4444' }
  ];

  const currentClass = SERVICE_CLASSES[activeTab];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Device Class Technical Architecture & Design Profiles
          </h3>
          <p className="text-xs text-slate-400">
            Addressing strategies, QoS DSCP markings, zero-trust security profiles, and protocol stacks
          </p>
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {classes.map(c => {
          const Icon = c.icon;
          const isSelected = activeTab === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setActiveTab(c.key)}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                isSelected
                  ? 'bg-slate-800/90 shadow-md ring-1'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:bg-slate-800/40'
              }`}
              style={{
                borderColor: isSelected ? c.color : undefined,
                boxShadow: isSelected ? `0 0 15px -3px ${c.color}33` : undefined
              }}
            >
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ backgroundColor: `${c.color}20`, color: c.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className={`text-xs font-semibold ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                  {c.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {SERVICE_CLASSES[c.key]?.category}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Class Deep Architecture Card */}
      <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4 animate-in fade-in duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentClass.color }}
              />
              <h4 className="font-bold text-base text-slate-100">{currentClass.name}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${currentClass.badgeBg}`}>
                {currentClass.serviceCodeName}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{currentClass.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] font-mono shrink-0">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
              {currentClass.vlanRange}
            </span>
          </div>
        </div>

        {/* Technical Key Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
              Addressing & Autoconfig
            </div>
            <div className="text-xs font-medium text-slate-200">
              {currentClass.addressingMode}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
              QoS / DSCP Priority
            </div>
            <div className="text-xs font-medium text-slate-200">
              {currentClass.qosDscp}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Supported Protocols
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentClass.protocols.map(p => (
                <span
                  key={p}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Design Notes Bullet List */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Network Architecture Specifications:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentClass.technicalNotes.map((note, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300"
              >
                <CheckCircle2
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: currentClass.color }}
                />
                <span className="leading-relaxed">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Profile */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <strong className="font-semibold text-slate-200">Security Profile: </strong>
            <span>{currentClass.securityProfile}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
