import React from 'react';
import { Radio } from 'lucide-react';

export const CommentaryTicker = ({ commentaryLog }) => {
  const latest = commentaryLog?.length
    ? commentaryLog[commentaryLog.length - 1]
    : 'Welcome to Hand Cricket Arena!';

  return (
    <div className="bg-c-goldlt border border-c-gold/40 rounded-2xl p-3 shadow-sm flex items-center space-x-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-c-gold/20 flex items-center justify-center">
        <Radio className="w-4 h-4 text-c-gold animate-pulse" />
      </div>
      <div className="overflow-hidden flex-1 min-w-0">
        <div className="text-[9px] font-extrabold uppercase tracking-widest text-c-gold">Live Commentary</div>
        <div className="text-xs font-semibold text-c-text truncate animate-fadeIn">{latest}</div>
      </div>
    </div>
  );
};
