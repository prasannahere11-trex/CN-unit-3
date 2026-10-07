import React, { useState, useMemo } from 'react';
import { ALL_SERVICE_CODES, SERVICE_CLASSES } from '../data/serviceClasses';
import {
  generateDistrictPrefix,
  generateServicePrefix,
  generateZonePrefix,
  generateCitySubnetPrefix,
  compressIPv6
} from '../lib/ip/ipv6Math';
import { calculateIPv4Subnet } from '../lib/ip/ipv4Math';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Server,
  Layers,
  Network,
  Tag,
  Search,
  CheckCircle2
} from 'lucide-react';

interface SubnetTreeExplorerProps {
  selectedDistrict: number;
  selectedService: string;
  selectedZone: number;
  onSelectNode?: (district: number, service: string, zone: number) => void;
}

export const SubnetTreeExplorer: React.FC<SubnetTreeExplorerProps> = ({
  selectedDistrict,
  selectedService,
  selectedZone,
  onSelectNode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDistricts, setExpandedDistricts] = useState<Record<number, boolean>>({ [selectedDistrict]: true });
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({ [`${selectedDistrict}-${selectedService}`]: true });

  const toggleDistrict = (d: number) => {
    setExpandedDistricts(prev => ({ ...prev, [d]: !prev[d] }));
  };

  const toggleService = (d: number, s: string) => {
    const key = `${d}-${s}`;
    setExpandedServices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Generate hierarchy data
  const treeData = useMemo(() => {
    // Show top 4 districts or filtered districts for performance and clarity
    const districts = Array.from({ length: 8 }, (_, i) => i + 1);

    return districts.map(d => {
      const dPrefix = generateDistrictPrefix(d);
      const services = ALL_SERVICE_CODES.slice(0, 4).map(svc => {
        const sPrefix = generateServicePrefix(d, svc.code);
        const zones = [1, 2].map(z => {
          const zPrefix = generateZonePrefix(d, svc.code, z);
          const subPrefix = generateCitySubnetPrefix(d, svc.code, z, 1);
          const gw = compressIPv6(`2001:0db8:${d.toString(16).padStart(2, '0')}${svc.code}${z.toString(16)}:0001:0000:0000:0000:0001`);
          const vlanId = parseInt(svc.code, 16) * 100 + z * 10;
          const v4Sub = calculateIPv4Subnet(`10.${d}.${parseInt(svc.code, 16) * 16 + z}.0/24`);

          return {
            zoneId: z,
            name: `Zone ${z} (${z === 1 ? 'North/Core' : 'South/Perimeter'})`,
            prefix: zPrefix,
            subPrefix,
            gateway: gw,
            vlanId,
            v4Subnet: v4Sub.cidr,
            classKey: svc.classKey
          };
        });

        return {
          code: svc.code,
          name: svc.name,
          prefix: sPrefix,
          color: svc.color,
          classKey: svc.classKey,
          zones
        };
      });

      return {
        districtId: d,
        name: `District ${d.toString().padStart(2, '0')} (${d === 1 ? 'Central Downtown' : `Sub-Municipality ${d}`})`,
        prefix: dPrefix,
        services
      };
    });
  }, []);

  const filteredTree = useMemo(() => {
    if (!searchQuery) return treeData;
    const q = searchQuery.toLowerCase();
    return treeData.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.prefix.toLowerCase().includes(q) ||
      d.services.some(s =>
        s.name.toLowerCase().includes(q) ||
        s.prefix.toLowerCase().includes(q) ||
        s.zones.some(z => z.subPrefix.toLowerCase().includes(q) || z.vlanId.toString().includes(q))
      )
    );
  }, [treeData, searchQuery]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Hierarchical Addressing Tree & VLAN Explorer
          </h3>
          <p className="text-xs text-slate-400">
            Click nodes to explore nested /32 → /40 → /44 → /48 → /64 prefix structures and VLAN mappings
          </p>
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search prefix, service, or VLAN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* City Root Node */}
      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Network className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-xs font-bold text-cyan-300">CityNet Smart Municipal Allocation</div>
            <div className="font-mono text-[11px] text-cyan-200">2001:0db8::/32 (IANA RFC 3849 City Block)</div>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-400 font-mono hidden sm:block">
          Holds 4.29 Billion /64 Subnets
        </div>
      </div>

      {/* Hierarchical Subnet List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredTree.map(district => {
          const isDistExpanded = expandedDistricts[district.districtId] ?? false;
          return (
            <div
              key={district.districtId}
              className="rounded-xl border border-slate-800/80 bg-slate-950/50 overflow-hidden"
            >
              {/* District Header */}
              <div
                onClick={() => toggleDistrict(district.districtId)}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isDistExpanded ? (
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                  {isDistExpanded ? (
                    <FolderOpen className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-xs font-semibold text-slate-200">{district.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30">
                    {district.prefix}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  /40 District Block (16.7M /64s)
                </span>
              </div>

              {/* District Content: Service Classes */}
              {isDistExpanded && (
                <div className="pl-6 pr-3 pb-3 space-y-2 border-t border-slate-800/60 pt-2">
                  {district.services.map(svc => {
                    const svcKey = `${district.districtId}-${svc.code}`;
                    const isSvcExpanded = expandedServices[svcKey] ?? false;
                    const classConfig = SERVICE_CLASSES[svc.classKey];

                    return (
                      <div
                        key={svc.code}
                        className="rounded-lg border border-slate-800/60 bg-slate-900/60 overflow-hidden"
                      >
                        {/* Service Class Header */}
                        <div
                          onClick={() => toggleService(district.districtId, svc.code)}
                          className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {isSvcExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: svc.color }}
                            />
                            <span className="text-xs font-medium text-slate-300">{svc.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                              {svc.prefix}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                            /44 Service Slice (1M /64s)
                          </span>
                        </div>

                        {/* Service Content: Zones & Subnets */}
                        {isSvcExpanded && (
                          <div className="pl-6 pr-2 pb-2.5 pt-1 space-y-2">
                            {svc.zones.map(zone => {
                              const isSelected =
                                selectedDistrict === district.districtId &&
                                selectedService === svc.code &&
                                selectedZone === zone.zoneId;

                              return (
                                <div
                                  key={zone.zoneId}
                                  onClick={() =>
                                    onSelectNode?.(district.districtId, svc.code, zone.zoneId)
                                  }
                                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-cyan-950/80 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/60'
                                  }`}
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <div className="flex items-center gap-2">
                                      <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                      <span className="font-semibold text-slate-200">
                                        {zone.name}
                                      </span>
                                      <span className="font-mono text-emerald-400 text-[11px]">
                                        {zone.subPrefix}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                        VLAN {zone.vlanId}
                                      </span>
                                      <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/20 font-mono">
                                        IPv4: {zone.v4Subnet}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                                    <span>
                                      Default Gateway:{' '}
                                      <code className="text-sky-300 font-mono">{zone.gateway}</code>
                                    </span>
                                    <span>
                                      QoS Policy:{' '}
                                      <strong className="text-cyan-300">{classConfig?.qosDscp || 'Best Effort'}</strong>
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
