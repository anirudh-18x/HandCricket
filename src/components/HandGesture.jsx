import React from 'react';

/**
 * HandGesture Component
 * Renders high-quality animated hand gestures for Hand Cricket numbers 1 to 10
 */
export const HandGesture = ({ number, isOpponent = false, className = "", size = "md" }) => {
  if (!number || number < 1 || number > 10) {
    return (
      <div className={`flex items-center justify-center bg-stadium-blue/40 border border-slate-700/50 rounded-2xl p-4 ${className}`}>
        <span className="text-4xl animate-pulse">❓</span>
      </div>
    );
  }

  // Size configurations
  const sizeClasses = {
    sm: "w-16 h-16 text-xs",
    md: "w-28 h-28 text-sm",
    lg: "w-36 h-36 text-base",
    xl: "w-44 h-44 text-lg"
  };

  // Helper to render individual SVG hand with specific fingers extended
  const renderSingleHand = (extendedFingers, label = "") => {
    // extendedFingers = [Thumb, Index, Middle, Ring, Pinky]
    const [thumb, index, middle, ring, pinky] = extendedFingers;

    return (
      <svg
        viewBox="0 0 100 120"
        className={`w-full h-full drop-shadow-lg transition-transform duration-300 ${isOpponent ? 'rotate-180 scale-x-[-1]' : ''}`}
      >
        <defs>
          <linearGradient id="handSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="handGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Wrist & Palm Base */}
        <path
          d="M 30 85 C 30 75, 70 75, 70 85 L 75 115 L 25 115 Z"
          fill="url(#handSkin)"
          stroke="#C2410C"
          strokeWidth="2"
        />

        {/* Palm Center */}
        <path
          d="M 25 50 Q 20 80 32 85 Q 50 90 68 85 Q 80 80 75 50 Q 50 45 25 50 Z"
          fill="url(#handSkin)"
          stroke="#EA580C"
          strokeWidth="2"
        />

        {/* Thumb */}
        {thumb ? (
          /* Extended Thumb */
          <path
            d="M 24 58 Q 10 50 8 36 Q 6 28 14 30 Q 20 35 28 48 Z"
            fill="url(#handSkin)"
            stroke="#EA580C"
            strokeWidth="2"
            filter="url(#glow)"
          />
        ) : (
          /* Folded Thumb */
          <path
            d="M 24 60 Q 18 68 28 72 Z"
            fill="#F97316"
            stroke="#EA580C"
            strokeWidth="2"
          />
        )}

        {/* Index Finger */}
        {index ? (
          /* Extended Index */
          <rect
            x="30" y="10" width="11" height="42" rx="5"
            fill="url(#handSkin)" stroke="#EA580C" strokeWidth="2" filter="url(#glow)"
          />
        ) : (
          /* Folded Index */
          <rect x="30" y="42" width="11" height="15" rx="5" fill="#F97316" stroke="#EA580C" strokeWidth="2" />
        )}

        {/* Middle Finger */}
        {middle ? (
          /* Extended Middle */
          <rect
            x="44" y="5" width="11" height="47" rx="5"
            fill="url(#handSkin)" stroke="#EA580C" strokeWidth="2" filter="url(#glow)"
          />
        ) : (
          /* Folded Middle */
          <rect x="44" y="40" width="11" height="15" rx="5" fill="#F97316" stroke="#EA580C" strokeWidth="2" />
        )}

        {/* Ring Finger */}
        {ring ? (
          /* Extended Ring */
          <rect
            x="58" y="10" width="11" height="42" rx="5"
            fill="url(#handSkin)" stroke="#EA580C" strokeWidth="2" filter="url(#glow)"
          />
        ) : (
          /* Folded Ring */
          <rect x="58" y="42" width="11" height="15" rx="5" fill="#F97316" stroke="#EA580C" strokeWidth="2" />
        )}

        {/* Pinky Finger */}
        {pinky ? (
          /* Extended Pinky */
          <rect
            x="71" y="20" width="9" height="32" rx="4"
            fill="url(#handSkin)" stroke="#EA580C" strokeWidth="2" filter="url(#glow)"
          />
        ) : (
          /* Folded Pinky */
          <rect x="71" y="44" width="9" height="13" rx="4" fill="#F97316" stroke="#EA580C" strokeWidth="2" />
        )}

        {/* Fingernail highlights for extended fingers */}
        {index && <circle cx="35.5" cy="15" r="2.5" fill="#FED7AA" />}
        {middle && <circle cx="49.5" cy="10" r="2.5" fill="#FED7AA" />}
        {ring && <circle cx="63.5" cy="15" r="2.5" fill="#FED7AA" />}
        {pinky && <circle cx="75.5" cy="24" r="2" fill="#FED7AA" />}
        {thumb && <circle cx="12" cy="33" r="2.5" fill="#FED7AA" />}
      </svg>
    );
  };

  // Determine finger arrays for 1..10
  const getFingers = (num) => {
    switch(num) {
      case 1: return { hand1: [false, true, false, false, false] };
      case 2: return { hand1: [false, true, true, false, false] };
      case 3: return { hand1: [false, true, true, true, false] };
      case 4: return { hand1: [false, true, true, true, true] };
      case 5: return { hand1: [true, true, true, true, true] };
      case 6: return { hand1: [true, true, true, true, true], hand2: [false, true, false, false, false] };
      case 7: return { hand1: [true, true, true, true, true], hand2: [false, true, true, false, false] };
      case 8: return { hand1: [true, true, true, true, true], hand2: [false, true, true, true, false] };
      case 9: return { hand1: [true, true, true, true, true], hand2: [false, true, true, true, true] };
      case 10: return { hand1: [true, true, true, true, true], hand2: [true, true, true, true, true] };
      default: return { hand1: [false, true, false, false, false] };
    }
  };

  const { hand1, hand2 } = getFingers(number);

  return (
    <div className={`relative flex flex-col items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center justify-center space-x-1 w-full h-full">
        <div className="w-1/2 h-full flex items-center justify-center transform hover:scale-105 transition-transform">
          {renderSingleHand(hand1)}
        </div>
        {hand2 && (
          <div className="w-1/2 h-full flex items-center justify-center transform hover:scale-105 transition-transform">
            {renderSingleHand(hand2)}
          </div>
        )}
      </div>

      {/* Number Badge Pill */}
      <div className="absolute -bottom-2 bg-gradient-to-r from-stadium-turf to-stadium-accent text-slate-900 font-extrabold px-3 py-0.5 rounded-full shadow-lg border border-emerald-300 text-sm">
        {number}
      </div>
    </div>
  );
};
