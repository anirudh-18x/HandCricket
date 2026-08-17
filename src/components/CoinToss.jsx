import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const CoinToss = ({
  playerName, playerAvatar,
  opponentName, opponentAvatar,
  isOnline, isHost, peerService,
  onTossComplete
}) => {
  const [stage, setStage]           = useState('CALL');
  const [call, setCall]             = useState(null);
  const [tossWinner, setTossWinner] = useState(null);
  const [coinResult, setCoinResult] = useState('HEADS');

  const handleCallCoin = (selectedCall) => {
    soundEngine.playCoinFlip();
    setCall(selectedCall);
    setStage('FLIPPING');

    if (isOnline && peerService) {
      peerService.sendData({ type: 'TOSS_CALL', call: selectedCall });
    }

    setTimeout(() => {
      const result = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
      setCoinResult(result);
      // Realistic 50/50 toss — winner is random
      const winner = Math.random() > 0.5 ? 'USER' : 'OPPONENT';
      setTossWinner(winner);
      const isWin = winner === 'USER';
      soundEngine.playCoinLand(isWin);
      setStage('RESULT');

      if (winner === 'OPPONENT' && !isOnline) {
        setTimeout(() => {
          const aiDecision = Math.random() > 0.5 ? 'BAT' : 'BOWL';
          const userRole = aiDecision === 'BAT' ? 'BOWL' : 'BAT';
          onTossComplete({ tossWinnerName: opponentName, userRole });
        }, 1600);
      }
    }, 2200);
  };

  const handleSelectRole = (role) => {
    soundEngine.playClick();
    onTossComplete({ tossWinnerName: playerName, userRole: role });
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-c-surface border border-c-border rounded-3xl shadow-lg p-7 text-center w-full max-w-sm">

        {/* Badge */}
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-c-goldlt text-c-gold border border-c-gold/30">
          Coin Toss 🪙
        </span>

        <h2 className="text-2xl font-extrabold text-c-text mt-3 mb-1">
          {stage === 'CALL'     && 'Call the Flip!'}
          {stage === 'FLIPPING' && 'Flipping…'}
          {stage === 'RESULT'   && `${coinResult}!`}
        </h2>
        <p className="text-xs text-c-muted mb-6">{playerName} vs {opponentName}</p>

        {/* Coin */}
        <div className="flex justify-center my-6">
          <div
            className={`w-28 h-28 rounded-full border-4 border-c-gold bg-gradient-to-tr from-yellow-300 via-amber-200 to-yellow-100 shadow-xl flex flex-col items-center justify-center font-black text-c-text transition-transform duration-700 ${
              stage === 'FLIPPING' ? 'animate-spin scale-110' : 'hover:scale-105'
            }`}
          >
            <span className="text-3xl">🪙</span>
            <span className="text-xs font-extrabold tracking-wider mt-0.5">
              {stage === 'FLIPPING' ? '…' : coinResult}
            </span>
          </div>
        </div>

        {/* CALL stage */}
        {stage === 'CALL' && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-c-muted">Pick your call:</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleCallCoin('HEADS')}
                className="py-4 rounded-2xl font-extrabold text-sm bg-c-orange border-2 border-c-orange text-white hover:bg-c-orangelt hover:text-c-orange transition-all shadow-sm active:scale-95">
                HEADS
              </button>
              <button onClick={() => handleCallCoin('TAILS')}
                className="py-4 rounded-2xl font-extrabold text-sm bg-c-indigo border-2 border-c-indigo text-white hover:bg-c-indigolt hover:text-c-indigo transition-all shadow-sm active:scale-95">
                TAILS
              </button>
            </div>
          </div>
        )}

        {/* FLIPPING stage */}
        {stage === 'FLIPPING' && (
          <p className="text-xs text-c-muted animate-pulse font-semibold">Coin is in the air…</p>
        )}

        {/* RESULT stage */}
        {stage === 'RESULT' && (
          <div className="space-y-4">
            {tossWinner === 'USER' ? (
              <>
                <div className="flex items-center justify-center space-x-2 text-c-green font-extrabold text-lg">
                  <Trophy className="w-5 h-5 text-c-gold" />
                  <span>You Won the Toss! 🎉</span>
                </div>
                <p className="text-xs text-c-muted">What would you like to do?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleSelectRole('BAT')}
                    className="py-3.5 rounded-2xl font-extrabold text-sm bg-c-green text-white shadow-md hover:scale-105 transition-all">
                    🏏 BAT FIRST
                  </button>
                  <button onClick={() => handleSelectRole('BOWL')}
                    className="py-3.5 rounded-2xl font-extrabold text-sm bg-c-blue text-white shadow-md hover:scale-105 transition-all">
                    ⚾ BOWL FIRST
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <div className="text-c-coral font-extrabold text-lg">{opponentName} Won the Toss!</div>
                <p className="text-xs text-c-muted animate-pulse">{opponentName} is choosing…</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
