import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCityContext } from '../context/CityContext';
import { ALL_SERVICE_CODES, SERVICE_CLASSES } from '../data/serviceClasses';
import { BitfieldVisualizer } from '../components/BitfieldVisualizer';
import { SubnetTreeExplorer } from '../components/SubnetTreeExplorer';
import { AddressGenerator } from '../components/AddressGenerator';
import { PerClassDesignNotes } from '../components/PerClassDesignNotes';
import { WhatAmILookingAt } from '../components/WhatAmILookingAt';
import {
  Binary,
  Layers,
  Cpu,
  ArrowRight,
  Sparkles,
  Download,
  Activity,
  Navigation,
  Camera,
  ShieldAlert,
  Server,
  Network
} from 'lucide-react';
import { generateCitySubnetPrefix, compressIPv6 } from '../lib/ip/ipv6Math';

export const AddressingPlanBuilder: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeDistrict,
    setActiveDistrict,
    activeService,
    setActiveService,
    activeZone,
    setActiveZone,
    config
  } = useCityContext();

  const [activeTab, setActiveTab] = useState<'visualizer' | 'tree' | 'generator' | 'classes'>('visualizer');

  const currentPrefix = generateCitySubnetPrefix(activeDistrict, activeService, activeZone, 1);
  const activeSvcObj = ALL_SERVICE_CODES.find(s => s.code === activeService) || ALL_SERVICE_CODES[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WhatAmILookingAt
        title="128-Bit Hierarchical Addressing Engine"
        summary="The core addressing architecture for CityNet. Uses a nibble-aligned 5-tier IPv6 structure based on IANA documentation block 2001:db8::/32. Subnet boundaries align precisely with 4-bit hex characters (DD = District, S = Service Class, Z = Zone, SSSS = Subnet)."
        keyPoints={[
          'Hierarchical Aggregation: /32 City → /40 District → /44 Service → /48 Zone → /64 Subnet.',
          'Nibble Alignment: Route filtering and TCAM mask matching happen directly on 4-bit boundaries (0x1 to 0xF).',
          'Autonomous /64 Subnets: Each physical sensor cluster and intersection receives a full /64 containing 18.4 quintillion addresses.',
          'IPv4 VLSM Comparison: Shows private 10.0.0.0/8 block subdivisions and calculates where address exhaustion triggers CGNAT.'
        ]}
        architectTip="Click any node in the Subnet Tree or choose selectors in the Address Generator to live-update the 128-bit bitfield visualizer and generate production configuration strings."
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Binary className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                Step 3: Addressing Plan Builder & Subnet Architecture
              </h1>
              <p className="text-xs text-slate-400">
                Hierarchical IPv6 allocation: 2001:db8:DDSZ:SSSS::/64 with nibble-aligned service classes
              </p>
            </div>
          </div>
        </div>

        {/* Live Active Prefix Indicator */}
        <div className="flex items-center gap-2 bg-slate-900 border border-cyan-500/40 px-3.5 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] text-slate-400">Active Scope:</span>
          <span className="font-mono text-xs font-bold text-cyan-300">{currentPrefix}</span>
        </div>
      </div>

      {/* Quick Navigation Tabs for the Core Engine */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { id: 'visualizer', label: '1. Bitfield Visualizer', icon: Binary, desc: '128-Bit Breakdown' },
          { id: 'tree', label: '2. Subnet Tree & VLANs', icon: Layers, desc: 'Hierarchy Explorer' },
          { id: 'generator', label: '3. Address Generator', icon: Cpu, desc: 'Sample IPs & CSV' },
          { id: 'classes', label: '4. Device Profiles', icon: Activity, desc: 'QoS & Architectures' }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/60 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-950 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold truncate">{tab.label}</div>
                <div className="text-[10px] text-slate-400 truncate">{tab.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Service Code Quick Reference Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Nibble-Aligned Service Codes (4-bit Hex S: 0x1 to 0xF)</span>
          <span className="font-mono text-[11px] text-cyan-400">2001:db8:DD[S]Z::/48</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {ALL_SERVICE_CODES.map(s => {
            const isSelected = activeService === s.code;
            return (
              <button
                key={s.code}
                onClick={() => setActiveService(s.code)}
                className={`p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold" style={{ color: s.color }}>
                    0x{s.code.toUpperCase()}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                </div>
                <div className="text-[10px] text-slate-300 truncate mt-0.5 font-medium">
                  {s.name.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'visualizer' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <BitfieldVisualizer
            districtId={activeDistrict}
            serviceCode={activeService}
            zoneId={activeZone}
            subnetId={1}
          />
        </div>
      )}

      {activeTab === 'tree' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <SubnetTreeExplorer
            selectedDistrict={activeDistrict}
            selectedService={activeService}
            selectedZone={activeZone}
            onSelectNode={(d, s, z) => {
              setActiveDistrict(d);
              setActiveService(s);
              setActiveZone(z);
            }}
          />
        </div>
      )}

      {activeTab === 'generator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <AddressGenerator
            districtId={activeDistrict}
            serviceCode={activeService}
            zoneId={activeZone}
            onDistrictChange={setActiveDistrict}
            onServiceChange={setActiveService}
            onZoneChange={setActiveZone}
          />
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <PerClassDesignNotes />
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-between">
        <button
          onClick={() => navigate('/suitability')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
        >
          ← Back to Suitability
        </button>

        <button
          onClick={() => navigate('/comparison')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          <span>Proceed to Step 4: IPv4 vs IPv6 Comparison</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
