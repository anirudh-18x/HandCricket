import React from 'react';
import { Volume2, VolumeX, HelpCircle, Home } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const Navbar = ({ playerName, playerAvatar, isMuted, setIsMuted, onOpenRules, onGoHome }) => {
  const toggleSound = () => {
    const nextMute = soundEngine.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) soundEngine.playClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-c-nav border-b border-c-border shadow-sm px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <button onClick={onGoHome} className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-c-green flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
            🏏
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-c-text leading-none">
              Hand Cricket
            </div>
            <div className="text-[10px] font-semibold text-c-muted tracking-widest uppercase leading-none mt-0.5">
              India Edition 🇮🇳
            </div>
          </div>
        </button>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {playerName && (
            <div className="hidden sm:flex items-center space-x-1.5 bg-c-greenlt border border-c-greenmd px-3 py-1.5 rounded-full">
              <span className="text-base">{playerAvatar}</span>
              <span className="text-xs font-bold text-c-text">{playerName}</span>
            </div>
          )}

          <button
            onClick={toggleSound}
            title={isMuted ? "Unmute" : "Mute"}
            className="p-2 rounded-xl bg-c-surface border border-c-border text-c-muted hover:text-c-green hover:border-c-green transition-all shadow-sm active:scale-95"
          >
            {isMuted
              ? <VolumeX className="w-4 h-4 text-c-coral" />
              : <Volume2 className="w-4 h-4 text-c-green" />
            }
          </button>

          <button
            onClick={() => { soundEngine.playClick(); onOpenRules(); }}
            title="How to Play"
            className="p-2 rounded-xl bg-c-surface border border-c-border text-c-muted hover:text-c-gold hover:border-c-gold transition-all shadow-sm active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-c-gold" />
          </button>

          <button
            onClick={() => { soundEngine.playClick(); onGoHome(); }}
            title="Home"
            className="p-2 rounded-xl bg-c-surface border border-c-border text-c-muted hover:text-c-blue hover:border-c-blue transition-all shadow-sm active:scale-95"
          >
            <Home className="w-4 h-4 text-c-blue" />
          </button>
        </div>
      </div>
    </header>
  );
};
