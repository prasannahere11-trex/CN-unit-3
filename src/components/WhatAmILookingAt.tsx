import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface WhatAmILookingAtProps {
  title: string;
  summary: string;
  keyPoints: string[];
  architectTip?: string;
}

export const WhatAmILookingAt: React.FC<WhatAmILookingAtProps> = ({
  title,
  summary,
  keyPoints,
  architectTip
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Architectural Context
            </span>
            <h4 className="text-sm font-medium text-slate-200">
              What am I looking at? — {title}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{isExpanded ? 'Hide guide' : 'Explain page'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-800/70 text-sm text-slate-300 space-y-3 animate-in fade-in duration-200">
          <p className="leading-relaxed text-slate-300">{summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {keyPoints.map((pt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span className="text-slate-300">{pt}</span>
              </div>
            ))}
          </div>
          {architectTip && (
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-cyan-950/30 to-blue-950/20 border border-cyan-500/30 flex items-start gap-2.5 text-xs text-cyan-200">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-cyan-300">Network Architect Tip: </strong>
                {architectTip}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
