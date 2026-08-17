import React from 'react';

// Light, clean background — subtle cricket pitch arc on warm cream
export const StadiumBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Warm cream base */}
    <div className="absolute inset-0 bg-c-bg" />

    {/* Very subtle top warm glow */}
    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-72 rounded-full opacity-40 blur-3xl"
      style={{ background: 'radial-gradient(ellipse, rgba(46,158,107,0.18) 0%, transparent 70%)' }} />

    {/* Bottom subtle grass hint */}
    <div className="absolute bottom-0 inset-x-0 h-40 opacity-20"
      style={{ background: 'linear-gradient(to top, rgba(46,158,107,0.15), transparent)' }} />
  </div>
);
