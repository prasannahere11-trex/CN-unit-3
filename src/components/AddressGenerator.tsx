import React, { useState } from 'react';
import { ALL_SERVICE_CODES, SERVICE_CLASSES } from '../data/serviceClasses';
import {
  generateCitySubnetPrefix,
  generateEui64,
  compressIPv6,
  expandIPv6
} from '../lib/ip/ipv6Math';
import { calculateIPv4Subnet } from '../lib/ip/ipv4Math';
import { Copy, Check, Download, Sparkles, Server, Cpu, ShieldCheck } from 'lucide-react';

interface AddressGeneratorProps {
  districtId: number;
  serviceCode: string;
  zoneId: number;
  onDistrictChange?: (d: number) => void;
  onServiceChange?: (s: string) => void;
  onZoneChange?: (z: number) => void;
}

export const AddressGenerator: React.FC<AddressGeneratorProps> = ({
  districtId,
  serviceCode,
  zoneId,
  onDistrictChange,
  onServiceChange,
  onZoneChange
}) => {
  const [subnetId, setSubnetId] = useState<number>(1);
  const [hostIdType, setHostIdType] = useState<'static' | 'slaac' | 'anycast' | 'gateway'>('static');
  const [macAddress, setMacAddress] = useState<string>('00:1A:2B:3C:4D:5E');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeServiceObj = ALL_SERVICE_CODES.find(s => s.code === serviceCode) || ALL_SERVICE_CODES[0];
  const activeClassConfig = SERVICE_CLASSES[activeServiceObj.classKey];

  // Calculate Subnet Prefix
  const ipv6SubnetPrefix = generateCitySubnetPrefix(districtId, serviceCode, zoneId, subnetId);

  // Generate Interface ID
  let iidHex = '0000:0000:0000:0001';
  let addressNote = 'Default Subnet Default Gateway Router Interface';

  if (hostIdType === 'static') {
    iidHex = '0000:0000:0000:0010';
    addressNote = 'Static Host Interface ID (Deterministic Assignment)';
  } else if (hostIdType === 'slaac') {
    iidHex = generateEui64(macAddress);
    addressNote = `SLAAC EUI-64 Host ID derived from MAC [${macAddress}]`;
  } else if (hostIdType === 'anycast') {
    iidHex = '0000:0000:0000:0000';
    addressNote = 'Subnet Router Anycast Address (RFC 4291 Sec 2.6.1)';
  } else if (hostIdType === 'gateway') {
    iidHex = '0000:0000:0000:0001';
    addressNote = 'Primary Default Gateway VIP / VRRP Interface';
  }

  // Assemble full IPv6 address
  const dd = districtId.toString(16).padStart(2, '0').toLowerCase();
  const s = serviceCode.toLowerCase();
  const z = zoneId.toString(16).toLowerCase();
  const ssss = subnetId.toString(16).padStart(4, '0').toLowerCase();
  const fullRawIpv6 = `2001:0db8:${dd}${s}${z}:${ssss}:${iidHex}`;
  const compressedIpv6 = compressIPv6(fullRawIpv6);
  const expandedIpv6 = expandIPv6(compressedIpv6);

  // Reverse DNS PTR String for IPv6
  const cleanHex = fullRawIpv6.replace(/:/g, '').split('').reverse().join('.');
  const ptrIpv6 = `${cleanHex}.ip6.arpa`;

  // Matching IPv4 VLSM approximation
  const ipv4Base = `10.${districtId}.${parseInt(serviceCode, 16) * 16 + zoneId}.0/24`;
  const ipv4Subnet = calculateIPv4Subnet(ipv4Base);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export full plan table to CSV
  const handleExportCSV = () => {
    const rows = [
      ['District', 'Service Code', 'Service Name', 'Zone', 'Subnet /64 Prefix', 'IPv6 Gateway', 'VLAN Tag', 'QoS DSCP', 'IPv4 Equivalent Subnet', 'Host Capacity']
    ];

    for (let d = 1; d <= Math.min(districtId + 2, 16); d++) {
      ALL_SERVICE_CODES.forEach(svc => {
        for (let zn = 1; zn <= 2; zn++) {
          const prefix = generateCitySubnetPrefix(d, svc.code, zn, 1);
          const gw = compressIPv6(`2001:0db8:${d.toString(16).padStart(2, '0')}${svc.code}${zn.toString(16)}:0001:0000:0000:0000:0001`);
          const vlan = `VLAN ${parseInt(svc.code, 16) * 100 + zn * 10}`;
          const qos = SERVICE_CLASSES[svc.classKey]?.qosDscp || 'Best Effort';
          const v4 = `10.${d}.${parseInt(svc.code, 16) * 16 + zn}.0/24`;
          rows.push([
            `District ${d}`,
            `0x${svc.code}`,
            svc.name,
            `Zone ${zn}`,
            prefix,
            gw,
            vlan,
            `"${qos}"`,
            v4,
            '1.844 × 10^19 (IPv6) / 254 (IPv4)'
          ]);
        }
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CityNet_Addressing_Plan_D${districtId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-6">
      {/* Header & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Interactive Address & Subnet Generator
          </h3>
          <p className="text-xs text-slate-400">
            Generate and validate real-time production IPv6/IPv4 addresses, PTR records, and gateway parameters
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-medium text-xs transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95"
        >
          <Download className="w-4 h-4" />
          Export Addressing Plan (.CSV)
        </button>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            District Selector (DD: 0x01 - 0xFF)
          </label>
          <select
            value={districtId}
            onChange={e => onDistrictChange?.(parseInt(e.target.value, 10))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {Array.from({ length: 16 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>
                District {d} (Hex: 0x{d.toString(16).padStart(2, '0').toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Service Class (S: 0x1 - 0xF)
          </label>
          <select
            value={serviceCode}
            onChange={e => onServiceChange?.(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {ALL_SERVICE_CODES.map(s => (
              <option key={s.code} value={s.code}>
                [{s.code.toUpperCase()}] {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Zone / Sector (Z: 0x0 - 0xF)
          </label>
          <select
            value={zoneId}
            onChange={e => onZoneChange?.(parseInt(e.target.value, 10))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {Array.from({ length: 16 }, (_, i) => i).map(z => (
              <option key={z} value={z}>
                Zone {z} (Sector {z === 0 ? 'Core/NOC' : `Zone ${z}`})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Subnet ID (SSSS: 0 - 65535)
          </label>
          <input
            type="number"
            min={0}
            max={65535}
            value={subnetId}
            onChange={e => setSubnetId(Math.max(0, Math.min(65535, parseInt(e.target.value) || 0)))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Host Generation Type Pill Bar */}
      <div className="pt-1">
        <label className="block text-xs font-medium text-slate-300 mb-2">
          Interface ID (IID) Generation Mechanism:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'static', label: 'Static Host (::10)', desc: 'Servers & Controllers' },
            { id: 'slaac', label: 'SLAAC EUI-64 (MAC)', desc: 'Sensors & Mesh Nodes' },
            { id: 'gateway', label: 'Default Gateway (::1)', desc: 'VRRP / HSRP VIP' },
            { id: 'anycast', label: 'Anycast VIP (::0)', desc: 'PSAP Dispatch & DNS' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setHostIdType(t.id as any)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                hostIdType === t.id
                  ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-xs font-semibold">{t.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* SLAAC MAC input if selected */}
      {hostIdType === 'slaac' && (
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <label className="text-xs text-slate-300 shrink-0 font-medium">
            Device MAC Address (48-bit):
          </label>
          <input
            type="text"
            value={macAddress}
            onChange={e => setMacAddress(e.target.value)}
            placeholder="00:1A:2B:3C:4D:5E"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
          />
          <span className="text-[11px] text-slate-400">
            Auto-flips U/L bit & inserts <code className="text-cyan-400 font-mono">0xFFFE</code>
          </span>
        </div>
      )}

      {/* Generated Results Grid */}
      <div className="space-y-3 pt-2">
        {/* Compressed IPv6 */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                Compressed IPv6 Address (RFC 5952)
              </span>
              <span className="text-xs text-slate-400">{addressNote}</span>
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-cyan-300 tracking-wide break-all">
              {compressedIpv6}
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(compressedIpv6, 'comp-v6')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors shrink-0 self-start md:self-auto"
          >
            {copiedKey === 'comp-v6' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy IP</span>
              </>
            )}
          </button>
        </div>

        {/* Subnet & Gateway Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="text-[11px] text-slate-400 font-medium">Allocated /64 Subnet Prefix</div>
            <div className="font-mono text-xs font-semibold text-emerald-400 break-all">
              {ipv6SubnetPrefix}
            </div>
            <div className="text-[10px] text-slate-400">
              Host Capacity: <strong className="text-slate-200">18.44 Quintillion addresses (2⁶⁴)</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="text-[11px] text-slate-400 font-medium">Default Gateway Router VIP</div>
            <div className="font-mono text-xs font-semibold text-sky-400 break-all">
              {compressIPv6(`2001:0db8:${dd}${s}${z}:${ssss}:0000:0000:0000:0001`)}
            </div>
            <div className="text-[10px] text-slate-400">
              Assigned to Router Interface / First usable host ID
            </div>
          </div>
        </div>

        {/* Expanded IPv6 and Reverse DNS PTR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Fully Expanded 128-Bit IPv6 String
            </div>
            <div className="font-mono text-[11px] text-slate-300 break-all bg-slate-900/80 p-2 rounded border border-slate-800">
              {expandedIpv6}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Reverse DNS PTR Record (ip6.arpa)
            </div>
            <div className="font-mono text-[11px] text-cyan-400 break-all bg-slate-900/80 p-2 rounded border border-slate-800">
              {ptrIpv6}
            </div>
          </div>
        </div>

        {/* IPv4 Equivalent Comparison Box */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-amber-400">IPv4 VLSM Reference: </span>
            <span className="font-mono text-amber-200">{ipv4Subnet.cidr}</span>
            <span className="text-slate-400 ml-2">
              (Netmask: {ipv4Subnet.netmask}, Usable Hosts: {ipv4Subnet.usableHosts})
            </span>
          </div>
          <span className="text-[11px] text-amber-300/80 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/20 shrink-0">
            Requires CGNAT once capacity exceeded
          </span>
        </div>
      </div>
    </div>
  );
};
