import React from 'react';
import { Trophy, Target, Activity } from 'lucide-react';

export const Scoreboard = ({
  innings,
  userScore,
  opponentScore,
  target,
  currentBatterName,
  currentBatterAvatar,
  currentBowlerName,
  currentBowlerAvatar,
  totalBalls,
  lastRuns
}) => {
  const currentRuns = innings === 1 ? (currentBatterName.includes('You') ? userScore : opponentScore) : (currentBatterName.includes('You') ? userScore : opponentScore);
  const overs = (totalBalls / 6).toFixed(1);

  return (
    <div className="bg-stadium-navy/90 border border-stadium-blue/60 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
      
      {/* Innings & Target Pill */}
      <div className="flex items-center justify-between border-b border-stadium-blue/40 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-stadium-turf/20 text-emerald-400 border border-emerald-500/30">
            INNINGS {innings} OF 2
          </span>
          {target !== null && (
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>TARGET: {target}</span>
            </span>
          )}
        </div>

        <div className="text-xs font-bold text-slate-400 flex items-center space-x-1">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{totalBalls} Balls ({overs} Ov)</span>
        </div>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-2 gap-4 items-center">
        
        {/* Batter Badge & Runs */}
        <div className="bg-stadium-dark/70 border border-emerald-500/30 rounded-2xl p-3 flex items-center space-x-3">
          <div className="text-2xl">{currentBatterAvatar}</div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
              <span>BATTING 🏏</span>
            </div>
            <div className="text-sm font-extrabold text-slate-100 truncate max-w-[100px] sm:max-w-[140px]">
              {currentBatterName}
            </div>
            <div className="text-2xl font-black text-emerald-300 tracking-tight leading-none mt-1">
              {currentRuns} <span className="text-xs text-slate-400 font-normal">runs</span>
            </div>
          </div>
        </div>

        {/* Bowler Badge & Target Status */}
        <div className="bg-stadium-dark/70 border border-cyan-500/30 rounded-2xl p-3 flex items-center space-x-3">
          <div className="text-2xl">{currentBowlerAvatar}</div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              BOWLING ⚾
            </div>
            <div className="text-sm font-extrabold text-slate-100 truncate max-w-[100px] sm:max-w-[140px]">
              {currentBowlerName}
            </div>
            {target !== null ? (
              <div className="text-xs font-extrabold text-amber-300 mt-1">
                Need {Math.max(0, target - currentRuns)} more
              </div>
            ) : (
              <div className="text-xs font-bold text-slate-400 mt-1">
                Defending Score
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
