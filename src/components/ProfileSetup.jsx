import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

const AVATARS = [
  { emoji: '👑', label: 'Captain' },
  { emoji: '🏏', label: 'Master' },
  { emoji: '🔥', label: 'Blaster' },
  { emoji: '⚡', label: 'Flash'   },
  { emoji: '🏆', label: 'Legend'  },
  { emoji: '🎯', label: 'Striker' },
  { emoji: '🚀', label: 'Rocket'  },
  { emoji: '🦁', label: 'Lion'    },
];

export const ProfileSetup = ({ onComplete }) => {
  const [name, setName]             = useState('');
  const [selectedAvatar, setAvatar] = useState('👑');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundEngine.playClick();
    onComplete(name.trim(), selectedAvatar);
  };

  return (
    <div className="max-w-sm mx-auto my-10 px-4">
      <div className="bg-c-surface border border-c-border rounded-3xl shadow-lg p-7">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-c-greenlt border border-c-greenmd items-center justify-center text-4xl mb-3 shadow-sm">
            {selectedAvatar}
          </div>
          <h2 className="text-2xl font-extrabold text-c-text">Welcome Player!</h2>
          <p className="text-sm text-c-muted mt-1">Enter your name and pick an avatar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-c-muted mb-1.5">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-c-muted" />
              <input
                type="text"
                maxLength={16}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Virat, Rohit, MSD…"
                className="w-full pl-10 pr-4 py-2.5 bg-c-bg border border-c-border rounded-2xl text-c-text placeholder-c-muted font-semibold text-sm focus:outline-none focus:border-c-green focus:ring-2 focus:ring-c-greenmd transition-all"
                required
              />
            </div>
          </div>

          {/* Avatar grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-c-muted mb-1.5">
              Choose Avatar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.label}
                  type="button"
                  onClick={() => { soundEngine.playClick(); setAvatar(av.emoji); }}
                  className={`py-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all text-center ${
                    selectedAvatar === av.emoji
                      ? 'bg-c-greenlt border-c-green ring-2 ring-c-greenmd scale-105 shadow-md'
                      : 'bg-c-bg border-c-border hover:border-c-green hover:bg-c-greenlt'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                  <span className="text-[9px] font-bold text-c-muted mt-0.5">{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3.5 rounded-2xl font-extrabold text-sm tracking-wide bg-c-green text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>ENTER ARENA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
