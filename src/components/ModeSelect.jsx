import React, { useState } from 'react';
import { Bot, Globe, ChevronRight } from 'lucide-react';
import { AI_PERSONALITIES } from '../utils/aiAgent';
import { soundEngine } from '../utils/soundEngine';

const DIFFICULTY_ICONS = {
  TACTICAL: '🧠',
  SMASHER:  '💪',
  SPINNER:  '🌀',
  DEFENDER: '🛡️',
};

export const ModeSelect = ({ onSelectOffline, onSelectOnline }) => {
  const [selectedAi, setSelectedAi] = useState('TACTICAL');

  return (
    <div className="max-w-2xl mx-auto my-8 px-4">

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-c-text tracking-tight">Choose Mode</h2>
        <p className="text-sm text-c-muted mt-1">How do you want to play today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ── Offline Card ── */}
        <div className="bg-c-surface border border-c-border rounded-3xl p-6 shadow-md flex flex-col justify-between hover:border-c-green hover:shadow-lg transition-all">
          <div>
            {/* Title */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-c-greenlt border border-c-greenmd flex items-center justify-center">
                <Bot className="w-6 h-6 text-c-green" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-c-text">Offline Mode</h3>
                <p className="text-xs font-semibold text-c-green">vs AI Agent</p>
              </div>
            </div>

            <p className="text-xs text-c-muted leading-relaxed mb-4">
              Play against a smart AI that reads your move patterns and adapts its strategy!
            </p>

            {/* AI Difficulty Selector — no avatars, just icon + name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-c-muted mb-2">
                AI Difficulty
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(AI_PERSONALITIES).map((ai) => (
                  <button
                    key={ai.id}
                    type="button"
                    onClick={() => { soundEngine.playClick(); setSelectedAi(ai.id); }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedAi === ai.id
                        ? 'bg-c-greenlt border-c-green ring-1 ring-c-greenmd shadow-sm'
                        : 'bg-c-bg border-c-border hover:border-c-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{DIFFICULTY_ICONS[ai.id]}</span>
                      <div>
                        <div className="text-xs font-bold text-c-text leading-tight">{ai.name}</div>
                        <div className="text-[9px] text-c-muted">{ai.role}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); onSelectOffline(selectedAi); }}
            className="mt-5 w-full py-3.5 rounded-2xl font-extrabold text-sm bg-c-green text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span>PLAY VS AGENT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── Online Card ── */}
        <div className="bg-c-surface border border-c-border rounded-3xl p-6 shadow-md flex flex-col justify-between hover:border-c-blue hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-c-bluelt border border-c-blue/30 flex items-center justify-center">
                <Globe className="w-6 h-6 text-c-blue" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-c-text">Online Mode</h3>
                <p className="text-xs font-semibold text-c-blue">With Friends · 4-Digit Code</p>
              </div>
            </div>

            <p className="text-xs text-c-muted leading-relaxed mb-4">
              Generate a room code and share it with your friend, or enter theirs to join instantly!
            </p>

            <div className="bg-c-bg border border-c-border rounded-2xl p-4 space-y-2.5">
              {[
                'Host creates a room and gets a 4-digit code (e.g. 4829)',
                'Friend enters code on their device or another tab',
                'Instant match pairing — toss begins!',
              ].map((step, i) => (
                <div key={i} className="flex items-start space-x-3 text-xs text-c-muted">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-c-bluelt text-c-blue font-bold flex items-center justify-center text-[10px]">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { soundEngine.playClick(); onSelectOnline(); }}
            className="mt-5 w-full py-3.5 rounded-2xl font-extrabold text-sm bg-c-blue text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span>ONLINE MULTIPLAYER</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
