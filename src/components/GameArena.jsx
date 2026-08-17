import React, { useState, useEffect } from 'react';
import { CommentaryTicker } from './CommentaryTicker';
import { HandGesture } from './HandGesture';
import { GESTURES } from '../utils/gestureData';
import { getCommentary } from '../utils/commentaryGenerator';
import { soundEngine } from '../utils/soundEngine';
import { HandCricketAI } from '../utils/aiAgent';
import { Zap, Target } from 'lucide-react';

export const GameArena = ({
  playerName, playerAvatar,
  opponentName, opponentAvatar,
  isOnline, isHost, peerService,
  aiPersonalityKey,
  initialUserRole,
  onMatchEnd
}) => {
  // ── Core State ─────────────────────────────────────────────────────────────
  const [innings,          setInnings]          = useState(1);
  const [userRole,         setUserRole]         = useState(initialUserRole);
  const [userScore,        setUserScore]        = useState(0);
  const [opponentScore,    setOpponentScore]    = useState(0);
  const [target,           setTarget]           = useState(null);
  const [totalBalls,       setTotalBalls]       = useState(0);

  // ── Turn State ─────────────────────────────────────────────────────────────
  const [userMove,         setUserMove]         = useState(null);
  const [opponentMove,     setOpponentMove]     = useState(null);
  const [isRevealing,      setIsRevealing]      = useState(false);
  const [revealTimer,      setRevealTimer]      = useState(0);
  const [turnResult,       setTurnResult]       = useState(null);

  // ── Commentary ─────────────────────────────────────────────────────────────
  const [commentaryLog,    setCommentaryLog]    = useState([
    `🏏 Match started! ${initialUserRole === 'BAT' ? playerName : opponentName} is batting first!`
  ]);
  const [ballHistory,      setBallHistory]      = useState([]);

  // ── AI ─────────────────────────────────────────────────────────────────────
  const [aiAgent] = useState(() => new HandCricketAI());
  useEffect(() => {
    if (!isOnline && aiPersonalityKey) aiAgent.setPersonality(aiPersonalityKey);
  }, [aiPersonalityKey, isOnline, aiAgent]);

  // ── Online Incoming ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOnline && peerService) {
      peerService.onMessageCallback = (data) => {
        if (data.type === 'MOVE_CHOICE') setOpponentMove(data.move);
      };
    }
  }, [isOnline, peerService]);

  // ── Trigger reveal once both moves ready ───────────────────────────────────
  useEffect(() => {
    if (userMove !== null && opponentMove !== null && !isRevealing) {
      startReveal();
    }
  }, [userMove, opponentMove, isRevealing]);

  // ── Select number ──────────────────────────────────────────────────────────
  const handleSelect = (num) => {
    if (userMove !== null || isRevealing) return;
    soundEngine.playClick();
    setUserMove(num);

    if (isOnline && peerService) {
      peerService.sendData({ type: 'MOVE_CHOICE', move: num });
    } else {
      const isAiBatting = userRole === 'BOWL';
      const aiMove = aiAgent.makeMove({
        isAiBatting,
        target,
        currentScore: isAiBatting ? opponentScore : userScore
      });
      setOpponentMove(aiMove);
    }
  };

  // ── Reveal countdown ────────────────────────────────────────────────────────
  const startReveal = () => {
    setIsRevealing(true);
    setRevealTimer(3);
    const timer = setInterval(() => {
      setRevealTimer(prev => {
        if (prev <= 1) { clearInterval(timer); resolveTurn(userMove, opponentMove); return 0; }
        return prev - 1;
      });
    }, 450);
  };

  // ── Resolve turn ────────────────────────────────────────────────────────────
  const resolveTurn = (uMove, oMove) => {
    const isWicket      = uMove === oMove;
    const isUserBatting = userRole === 'BAT';
    const batterName    = isUserBatting ? playerName  : opponentName;
    const batterMove    = isUserBatting ? uMove       : oMove;

    setTotalBalls(p => p + 1);

    const log = {
      batter: isUserBatting ? 'USER' : 'OPPONENT',
      batterName,
      bowlerName: isUserBatting ? opponentName : playerName,
      userMove: uMove, opponentMove: oMove,
      runs: isWicket ? 0 : batterMove,
      isWicket
    };
    setBallHistory(prev => [...prev, log]);
    if (!isOnline) aiAgent.recordTurn(uMove, oMove);

    if (isWicket) {
      soundEngine.playWicket();
      setCommentaryLog(prev => [...prev, getCommentary(0, true, batterName)]);
      setTurnResult({ isWicket: true });

      if (innings === 1) {
        const firstScore = isUserBatting ? userScore : opponentScore;
        const newTarget  = firstScore + 1;
        setTarget(newTarget);
        setInnings(2);
        setUserRole(isUserBatting ? 'BOWL' : 'BAT');
        setCommentaryLog(prev => [...prev, `🔁 Innings break! Target: ${newTarget} runs`]);
      } else {
        endMatch(userScore, opponentScore);
      }

    } else {
      const runs = batterMove;
      soundEngine.playBatShot(runs);
      setCommentaryLog(prev => [...prev, getCommentary(runs, false, batterName)]);
      setTurnResult({ isWicket: false, runs });

      if (isUserBatting) {
        const next = userScore + runs;
        setUserScore(next);
        if (innings === 2 && target !== null && next >= target) { endMatch(next, opponentScore); return; }
      } else {
        const next = opponentScore + runs;
        setOpponentScore(next);
        if (innings === 2 && target !== null && next >= target) { endMatch(userScore, next); return; }
      }
    }

    setTimeout(() => {
      setUserMove(null);
      setOpponentMove(null);
      setIsRevealing(false);
      setTurnResult(null);
    }, 1800);
  };

  const endMatch = (finalUser = userScore, finalOpp = opponentScore) => {
    const winner      = finalOpp > finalUser ? opponentName : finalUser > finalOpp ? playerName : "TIE";
    const isUserWin   = finalUser >= finalOpp;
    setTimeout(() => {
      onMatchEnd({ winnerName: winner, isUserWinner: isUserWin, userScore: finalUser, opponentScore: finalOpp, ballHistory });
    }, 1200);
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const isUserBatting = userRole === 'BAT';
  const myScore       = userScore;
  const oppScore      = opponentScore;
  const runsNeeded    = target !== null ? Math.max(0, target - (isUserBatting ? myScore : oppScore)) : null;

  return (
    <div className="flex-1 flex flex-col w-full mx-auto px-3 py-2 gap-2 min-h-0 overflow-y-auto">

      {/* ── MAIN CONTENT: Left info + Right keypad ─────────────────────────── */}
      <div className="flex-1 flex flex-col sm:flex-row gap-2 min-h-0">

        {/* ═══ LEFT PANEL — Player Info, Score, Hand Reveal ═══ */}
        <div className="flex flex-col gap-2 sm:w-[45%] min-w-0">

          {/* Scoreboard */}
          <div className="bg-c-surface border border-c-border rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              {/* Batter */}
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-xl">{isUserBatting ? playerAvatar : opponentAvatar}</span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-c-green uppercase tracking-wider">Batting 🏏</div>
                  <div className="text-sm font-extrabold text-c-text truncate max-w-[90px] sm:max-w-[120px]">
                    {isUserBatting ? playerName : opponentName}
                  </div>
                </div>
              </div>

              {/* Score Centre */}
              <div className="text-center flex-shrink-0 mx-2">
                <div className="text-3xl font-black text-c-text leading-none">
                  {isUserBatting ? myScore : oppScore}
                </div>
                {target !== null && (
                  <div className="text-[11px] font-bold text-c-coral flex items-center justify-center space-x-0.5 mt-0.5">
                    <Target className="w-3 h-3" />
                    <span>Need {runsNeeded}</span>
                  </div>
                )}
                <div className="text-[10px] text-c-muted mt-0.5">
                  Inn.{innings} · {totalBalls}b
                </div>
              </div>

              {/* Bowler */}
              <div className="flex items-center space-x-2 min-w-0 text-right justify-end">
                <div className="min-w-0 text-right">
                  <div className="text-[10px] font-bold text-c-blue uppercase tracking-wider">Bowling ⚾</div>
                  <div className="text-sm font-extrabold text-c-text truncate max-w-[90px] sm:max-w-[120px]">
                    {isUserBatting ? opponentName : playerName}
                  </div>
                </div>
                <span className="text-xl">{isUserBatting ? opponentAvatar : playerAvatar}</span>
              </div>
            </div>
          </div>

          {/* Hand Reveal Arena */}
          <div className={`relative flex-1 bg-c-surface border-2 rounded-2xl shadow-sm overflow-hidden transition-all flex flex-col ${
            turnResult?.isWicket ? 'border-c-coral bg-c-corallt' : 'border-c-border'
          }`}>

            {/* Wicket Flash Overlay */}
            {turnResult?.isWicket && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-c-corallt/90 rounded-2xl">
                <div className="text-4xl font-black text-c-coral animate-pop">💥 OUT!</div>
                <div className="text-sm font-bold text-c-coral mt-1">Same number — wicket taken!</div>
              </div>
            )}

            {/* Runs flash — positioned near the batter side */}
            {turnResult && !turnResult.isWicket && (
              <div className={`absolute top-2 ${isUserBatting ? 'left-2' : 'right-2'} z-10 bg-c-green text-white font-black px-4 py-1 rounded-full text-sm shadow animate-pop`}>
                +{turnResult.runs} RUNS!
              </div>
            )}

            <div className="grid grid-cols-2 divide-x divide-c-border flex-1">

              {/* YOUR hand */}
              <div className="p-3 flex flex-col items-center justify-center">
                <div className="flex items-center space-x-1.5 mb-2">
                  <span className="text-base">{playerAvatar}</span>
                  <span className="text-xs font-bold text-c-text truncate max-w-[70px]">{playerName}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    userRole === 'BAT' ? 'bg-c-greenlt text-c-green' : 'bg-c-bluelt text-c-blue'
                  }`}>
                    {userRole}
                  </span>
                </div>

                <div className="h-28 w-full flex items-center justify-center">
                  {isRevealing && userMove
                    ? <HandGesture number={userMove} size="lg" />
                    : userMove
                      ? <div className="text-center">
                          <div className="w-14 h-14 rounded-2xl bg-c-greenlt border-2 border-c-green flex items-center justify-center text-2xl font-black text-c-green mx-auto">
                            {userMove}
                          </div>
                          <div className="text-[10px] font-bold text-c-green mt-1">LOCKED ✓</div>
                        </div>
                      : <div className="text-center text-c-muted">
                          <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-c-border flex items-center justify-center text-2xl mx-auto">✋</div>
                          <div className="text-[10px] font-bold mt-1">Pick a number</div>
                        </div>
                  }
                </div>
              </div>

              {/* OPPONENT hand */}
              <div className="p-3 flex flex-col items-center justify-center">
                <div className="flex items-center space-x-1.5 mb-2">
                  <span className="text-base">{opponentAvatar}</span>
                  <span className="text-xs font-bold text-c-text truncate max-w-[70px]">{opponentName}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    userRole !== 'BAT' ? 'bg-c-greenlt text-c-green' : 'bg-c-bluelt text-c-blue'
                  }`}>
                    {userRole === 'BAT' ? 'BOWL' : 'BAT'}
                  </span>
                </div>

                <div className="h-28 w-full flex items-center justify-center">
                  {isRevealing && opponentMove
                    ? <HandGesture number={opponentMove} isOpponent size="lg" />
                    : opponentMove
                      ? <div className="text-center">
                          <div className="w-14 h-14 rounded-2xl bg-c-bluelt border-2 border-c-blue flex items-center justify-center text-2xl font-black text-c-blue mx-auto">?</div>
                          <div className="text-[10px] font-bold text-c-blue mt-1">READY ✓</div>
                        </div>
                      : <div className="text-center text-c-muted">
                          <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-c-border flex items-center justify-center text-xl mx-auto">⏳</div>
                          <div className="text-[10px] font-bold mt-1">
                            {isOnline ? 'Waiting…' : 'Thinking…'}
                          </div>
                        </div>
                  }
                </div>
              </div>

            </div>

            {/* Status bar */}
            <div className="border-t border-c-border px-4 py-2 bg-c-bg text-center">
              {isRevealing
                ? <span className="font-extrabold text-c-gold text-sm animate-bounce inline-block">
                    Revealing in {revealTimer}… ✋💥🤚
                  </span>
                : userMove === null
                  ? <span className="text-xs font-semibold text-c-muted flex items-center justify-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-c-gold" />
                      <span>
                        {isUserBatting
                          ? 'Choose a number to score runs!'
                          : 'Pick a number to take a wicket!'}
                      </span>
                    </span>
                  : <span className="text-xs font-semibold text-c-green">
                      Move locked! Waiting for reveal…
                    </span>
              }
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL — Number Keypad ═══ */}
        <div className="sm:w-[55%] min-w-0 flex flex-col">
          <div className="bg-c-surface border border-c-border rounded-2xl p-4 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-c-text uppercase tracking-wider">
                {isUserBatting ? '🏏 Pick Your Shot' : '⚾ Call Your Delivery'}
              </span>
              <span className="text-[10px] font-bold text-c-muted">1 to 10</span>
            </div>

            {/* 5 × 2 grid — large targets that fill the panel */}
            <div className="grid grid-cols-5 gap-2 flex-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const selected = userMove === num;
                return (
                  <button
                    key={num}
                    disabled={userMove !== null || isRevealing}
                    onClick={() => handleSelect(num)}
                    className={`rounded-2xl font-black text-2xl flex flex-col items-center justify-center transition-all shadow-sm active:scale-90 ${
                      selected
                        ? 'bg-c-green text-white border-2 border-c-green scale-105 shadow-md'
                        : 'bg-c-bg border border-c-border text-c-text hover:border-c-green hover:bg-c-greenlt disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                  >
                    {num}
                    <span className="text-[9px] font-semibold opacity-60 mt-0.5">
                      {GESTURES[num]?.symbol || ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <CommentaryTicker commentaryLog={commentaryLog} />
      </div>

    </div>
  );
};
