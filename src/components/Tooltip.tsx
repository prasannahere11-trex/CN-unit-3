import React, { useState } from 'react';
import { GLOSSARY } from '../data/glossary';
import { Info } from 'lucide-react';

interface TooltipProps {
  termKey?: keyof typeof GLOSSARY | string;
  customTerm?: string;
  customText?: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  termKey,
  customTerm,
  customText,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const termData = termKey ? GLOSSARY[termKey] : undefined;
  const title = customTerm || termData?.term || termKey;
  const description = customText || termData?.definition;
  const rfc = termData?.rfc;
  const smartCityNote = termData?.smartCityRelevance;

  return (
    <span
      className="relative inline-flex items-center group cursor-help"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="border-b border-dotted border-cyan-400/70 text-cyan-300 group-hover:text-cyan-200 transition-colors">
        {children || title}
      </span>
      <Info className="w-3.5 h-3.5 ml-1 text-cyan-400/80 opacity-70 group-hover:opacity-100 transition-opacity" />

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-2xl backdrop-blur-md text-xs text-slate-200 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700/60">
            <span className="font-semibold text-cyan-400">{title}</span>
            {rfc && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
                {rfc}
              </span>
            )}
          </div>
          {description && <p className="text-slate-300 leading-relaxed mb-1.5">{description}</p>}
          {smartCityNote && (
            <div className="mt-1 pt-1.5 border-t border-slate-800 text-[11px] text-emerald-300/90 flex gap-1 items-start">
              <span className="font-medium text-emerald-400">IoT Impact:</span>
              <span>{smartCityNote}</span>
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}
    </span>
  );
};
