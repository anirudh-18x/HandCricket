import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, BarChart2 } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const MatchSummary = ({
  winnerName, winnerAvatar, isUserWinner,
  userScore, opponentScore,
  playerName, opponentName,
  ballHistory,
  onRematch, onGoHome
}) => {
  useEffect(() => {
    soundEngine.playVictory();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (_) {}
  }, []);

  const userBalls    = ballHistory.filter(b => b.batter === 'USER');
  const oppBalls     = ballHistory.filter(b => b.batter === 'OPPONENT');
  const stat = (arr, runs) => arr.filter(b => b.runs === runs).length;

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      <div className="bg-c-surface border border-c-border rounded-3xl shadow-lg p-7 text-center">

        {/* Trophy */}
        <div className="inline-flex w-18 h-18 items-center justify-center rounded-2xl bg-c-goldlt border border-c-gold/40 text-5xl mb-3 shadow-sm animate-bounce-gentle">
          🏆
        </div>

        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-c-goldlt text-c-gold border border-c-gold/30">
          Match Finished
        </span>

        <h2 className="text-3xl font-extrabold text-c-text mt-3">
          {winnerName === "TIE" ? "It's a Tie! 🤝" : `${winnerName} Wins! 🎉`}
        </h2>
        <p className="text-xs text-c-muted mt-1">
          {isUserWinner ? 'Outstanding performance!' : 'Great effort — better luck next time!'}
        </p>

        {/* Score comparison */}
        <div className="my-6 grid grid-cols-2 gap-3">
          <div className="bg-c-greenlt border border-c-greenmd rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{winnerName === playerName ? winnerAvatar : '🏏'}</div>
            <div className="text-xs font-bold text-c-muted truncate">{playerName}</div>
            <div className="text-4xl font-black text-c-green mt-1">{userScore}</div>
            <div className="text-[10px] text-c-muted mt-1">
              4s: {stat(userBalls,4)} · 6s: {stat(userBalls,6)} · 10s: {stat(userBalls,10)}
            </div>
          </div>
          <div className="bg-c-bluelt border border-c-blue/30 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{winnerName === opponentName ? winnerAvatar : '🤖'}</div>
            <div className="text-xs font-bold text-c-muted truncate">{opponentName}</div>
            <div className="text-4xl font-black text-c-blue mt-1">{opponentScore}</div>
            <div className="text-[10px] text-c-muted mt-1">
              4s: {stat(oppBalls,4)} · 6s: {stat(oppBalls,6)} · 10s: {stat(oppBalls,10)}
            </div>
          </div>
        </div>

        {/* Ball-by-ball log */}
        <div className="mb-6 text-left">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart2 className="w-4 h-4 text-c-green" />
            <span className="text-xs font-bold text-c-text">Ball-by-Ball</span>
          </div>
          <div className="bg-c-bg border border-c-border rounded-2xl p-3 max-h-36 overflow-y-auto space-y-1">
            {ballHistory.length > 0 ? ballHistory.map((b, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] border-b border-c-border/60 pb-1 last:border-0 last:pb-0">
                <span className="text-c-muted">B{i+1}: {b.batterName} <span className="font-bold text-c-text">({b.userMove})</span> vs {b.bowlerName} <span className="font-bold text-c-text">({b.opponentMove})</span></span>
                <span className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] ${b.isWicket ? 'bg-c-corallt text-c-coral' : 'bg-c-greenlt text-c-green'}`}>
                  {b.isWicket ? 'OUT' : `+${b.runs}`}
                </span>
              </div>
            )) : <p className="text-c-muted text-[11px] text-center">No balls recorded</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => { soundEngine.playClick(); onRematch(); }}
            className="py-3.5 rounded-2xl font-extrabold text-sm bg-c-green text-white shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>REMATCH</span>
          </button>
          <button onClick={() => { soundEngine.playClick(); onGoHome(); }}
            className="py-3.5 rounded-2xl font-extrabold text-sm bg-c-bg border border-c-border text-c-text hover:border-c-green hover:text-c-green transition-all flex items-center justify-center space-x-2">
            <Home className="w-4 h-4" />
            <span>MENU</span>
          </button>
        </div>

      </div>
    </div>
  );
};
