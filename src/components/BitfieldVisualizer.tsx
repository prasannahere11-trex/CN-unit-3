import React, { useState } from 'react';
import { parseBitSegments, IPv6BitSegment } from '../lib/ip/ipv6Math';
import { Layers, Binary, Cpu, Info } from 'lucide-react';

interface BitfieldVisualizerProps {
  districtId: number;
  serviceCode: string;
  zoneId: number;
  subnetId: number;
}

export const BitfieldVisualizer: React.FC<BitfieldVisualizerProps> = ({
  districtId,
  serviceCode,
  zoneId,
  subnetId
}) => {
  const [selectedSegment, setSelectedSegment] = useState<IPv6BitSegment | null>(null);

  const segments = parseBitSegments(districtId, serviceCode, zoneId, subnetId);
  const activeSegment = selectedSegment || segments[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              128-Bit IPv6 Address Architecture Visualizer
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                RFC 4291 / RFC 3849
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive nibble-aligned bitfield breakdown for CityNet municipal allocation
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-500/30 self-start sm:self-auto">
          Total Bits: 128 (16 Bytes / 8 Words)
        </div>
      </div>

      {/* Bit Ratio Visual Bar */}
      <div className="mt-5 space-y-2">
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Bit 0 (MSB)</span>
          <span>Prefix Boundary (/64)</span>
          <span>Bit 127 (LSB)</span>
        </div>

        <div className="w-full h-11 rounded-xl p-1 bg-slate-950 border border-slate-800 flex gap-1 overflow-hidden">
          {segments.map((seg, idx) => {
            const isSelected = activeSegment.name === seg.name;
            // Percentage width of the 128 bits
            const widthPct = (seg.bitLength / 128) * 100;

            return (
              <button
                key={idx}
                onClick={() => setSelectedSegment(seg)}
                style={{ width: `${widthPct}%` }}
                className={`h-full rounded-lg transition-all flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-white scale-[1.02] z-10 brightness-110 shadow-lg'
                    : 'opacity-85 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                <div
                  className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="relative text-[10px] sm:text-xs font-bold text-slate-950 tracking-tight truncate px-1 font-mono">
                  {seg.bitLength}b
                </span>
                <span className="relative text-[9px] text-slate-900 font-medium truncate px-1 hidden md:block">
                  /{seg.prefixLength}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Segment Cards Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
        {segments.map((seg, idx) => {
          const isSelected = activeSegment.name === seg.name;
          return (
            <button
              key={idx}
              onClick={() => setSelectedSegment(seg)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-[10px] font-mono font-semibold text-slate-400">
                  {seg.bitLength} bits
                </span>
              </div>
              <div className="text-xs font-medium text-slate-200 truncate">{seg.name.split(' ')[0]}</div>
              <div className="font-mono text-xs font-bold text-cyan-300 mt-1 truncate">
                0x{seg.hexValue}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Inspector Card for Selected Segment */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row gap-4 items-start justify-between">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: activeSegment.color }}
            />
            <h4 className="font-semibold text-sm text-slate-100">{activeSegment.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Bits [{activeSegment.bitStart}..{activeSegment.bitEnd}] (Length: {activeSegment.bitLength} bits)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{activeSegment.description}</p>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 shrink-0 w-full md:w-auto space-y-1">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Binary Value
          </div>
          <div className="font-mono text-xs text-emerald-400 break-all font-semibold">
            {activeSegment.binaryValue}
          </div>
          <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between gap-4">
            <span>Hex Mask: <strong className="text-cyan-300 font-mono">0x{activeSegment.hexValue}</strong></span>
            <span>Prefix: <strong className="text-cyan-300 font-mono">/{activeSegment.prefixLength}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
