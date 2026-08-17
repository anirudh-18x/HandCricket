import React from 'react';
import { X, Trophy, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-c-surface border border-c-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">

        <button onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-c-bg border border-c-border text-c-muted hover:text-c-text transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-c-goldlt border border-c-gold/40 flex items-center justify-center text-2xl">🏏</div>
          <div>
            <h3 className="text-lg font-extrabold text-c-text">How to Play</h3>
            <p className="text-xs text-c-gold font-semibold">Indian Street Hand Cricket 🇮🇳</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-c-muted">
          {[
            {
              icon: <Trophy className="w-4 h-4" />,
              color: 'text-c-gold',
              bg: 'bg-c-goldlt border-c-gold/30',
              title: '1. Coin Toss',
              body: 'Match starts with a Heads or Tails call. The winner decides to Bat First or Bowl First.',
            },
            {
              icon: <Zap className="w-4 h-4" />,
              color: 'text-c-blue',
              bg: 'bg-c-bluelt border-c-blue/30',
              title: '2. Pick Numbers (1 – 10)',
              body: 'Each ball, both Batter and Bowler pick a number from 1 to 10 using hand gestures!',
            },
            {
              icon: <AlertTriangle className="w-4 h-4" />,
              color: 'text-c-coral',
              bg: 'bg-c-corallt border-c-coral/30',
              title: '3. OUT or RUNS?',
              body: 'Same number = OUT (wicket falls, target set). Different numbers = Batter adds that many runs!',
            },
            {
              icon: <ShieldCheck className="w-4 h-4" />,
              color: 'text-c-green',
              bg: 'bg-c-greenlt border-c-greenmd',
              title: '4. 2nd Innings & Winner',
              body: 'After the wicket, roles swap. The new batter must exceed the 1st innings score to win!',
            },
          ].map((r, i) => (
            <div key={i} className={`border rounded-2xl p-4 ${r.bg}`}>
              <div className={`flex items-center space-x-2 ${r.color} font-bold mb-1.5`}>
                {r.icon}<span>{r.title}</span>
              </div>
              <p className="text-c-muted leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          className="mt-5 w-full py-3 rounded-2xl font-extrabold text-sm bg-c-green text-white shadow-md hover:scale-[1.02] transition-transform">
          GOT IT, LET'S PLAY! 🏏
        </button>
      </div>
    </div>
  );
};
