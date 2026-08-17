import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProfileSetup } from './components/ProfileSetup';
import { ModeSelect } from './components/ModeSelect';
import { OnlineLobby } from './components/OnlineLobby';
import { CoinToss } from './components/CoinToss';
import { GameArena } from './components/GameArena';
import { MatchSummary } from './components/MatchSummary';
import { RulesModal } from './components/RulesModal';
import { StadiumBackground } from './components/StadiumBackground';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [screen,          setScreen]          = useState('PROFILE');
  const [playerName,      setPlayerName]      = useState('');
  const [playerAvatar,    setPlayerAvatar]    = useState('👑');
  const [gameMode,        setGameMode]        = useState('OFFLINE');
  const [aiPersonalityKey,setAiPersonality]   = useState('TACTICAL');
  const [opponentName,    setOpponentName]    = useState('Captain Sharp');
  const [opponentAvatar,  setOpponentAvatar]  = useState('🤖');
  const [peerService,     setPeerService]     = useState(null);
  const [isHost,          setIsHost]          = useState(false);
  const [initialUserRole, setInitialUserRole] = useState('BAT');
  const [matchResult,     setMatchResult]     = useState(null);
  const [isMuted,         setIsMuted]         = useState(false);
  const [isRulesOpen,     setIsRulesOpen]     = useState(false);

  const handleProfileComplete = (name, avatar) => {
    setPlayerName(name);
    setPlayerAvatar(avatar);
    setScreen('MODE_SELECT');
  };

  const handleSelectOffline = (aiKey) => {
    setGameMode('OFFLINE');
    setAiPersonality(aiKey);
    const names = {
      TACTICAL: 'Captain Sharp',
      SMASHER:  'Power Smasher',
      SPINNER:  'Mystery Spinner',
      DEFENDER: 'Steady Anchor',
    };
    setOpponentName(names[aiKey] || 'Captain Sharp');
    setOpponentAvatar('🤖');
    setScreen('TOSS');
  };

  const handleSelectOnline = () => {
    setGameMode('ONLINE');
    setScreen('ONLINE_LOBBY');
  };

  const handleOnlineMatchReady = ({ roomCode, peerService: svc, isHost: host, opponentName: oName, opponentAvatar: oAvatar }) => {
    setPeerService(svc);
    setIsHost(host);
    setOpponentName(oName || 'Friend');
    setOpponentAvatar(oAvatar || '🏏');
    setScreen('TOSS');
  };

  const handleTossComplete = ({ userRole }) => {
    setInitialUserRole(userRole);
    setScreen('GAME');
  };

  const handleMatchEnd = (result) => {
    setMatchResult(result);
    setScreen('SUMMARY');
  };

  const handleRematch = () => setScreen('TOSS');

  const handleGoHome = () => {
    if (peerService) { peerService.disconnect(); setPeerService(null); }
    setScreen(playerName ? 'MODE_SELECT' : 'PROFILE');
  };

  return (
    <div className="relative min-h-screen flex flex-col font-outfit text-c-text">

      <StadiumBackground />

      <Navbar
        playerName={playerName}
        playerAvatar={playerAvatar}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenRules={() => setIsRulesOpen(true)}
        onGoHome={handleGoHome}
      />

      <main className="flex-1 z-10 flex flex-col min-h-0">
        {screen === 'PROFILE'      && <ProfileSetup onComplete={handleProfileComplete} />}
        {screen === 'MODE_SELECT'  && <ModeSelect onSelectOffline={handleSelectOffline} onSelectOnline={handleSelectOnline} />}
        {screen === 'ONLINE_LOBBY' && (
          <OnlineLobby playerName={playerName} playerAvatar={playerAvatar}
            onMatchReady={handleOnlineMatchReady} onBack={() => setScreen('MODE_SELECT')} />
        )}
        {screen === 'TOSS' && (
          <CoinToss playerName={playerName} playerAvatar={playerAvatar}
            opponentName={opponentName} opponentAvatar={opponentAvatar}
            isOnline={gameMode === 'ONLINE'} isHost={isHost} peerService={peerService}
            onTossComplete={handleTossComplete} />
        )}
        {screen === 'GAME' && (
          <GameArena
            playerName={playerName} playerAvatar={playerAvatar}
            opponentName={opponentName} opponentAvatar={opponentAvatar}
            isOnline={gameMode === 'ONLINE'} isHost={isHost} peerService={peerService}
            aiPersonalityKey={aiPersonalityKey}
            initialUserRole={initialUserRole}
            onMatchEnd={handleMatchEnd}
          />
        )}
        {screen === 'SUMMARY' && matchResult && (
          <MatchSummary
            winnerName={matchResult.winnerName}
            winnerAvatar={matchResult.winnerName === playerName ? playerAvatar : opponentAvatar}
            isUserWinner={matchResult.isUserWinner}
            userScore={matchResult.userScore}
            opponentScore={matchResult.opponentScore}
            playerName={playerName} opponentName={opponentName}
            ballHistory={matchResult.ballHistory}
            onRematch={handleRematch} onGoHome={handleGoHome}
          />
        )}
      </main>

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <footer className="z-10 py-1.5 text-center text-[11px] font-semibold text-c-muted border-t border-c-border bg-c-nav flex-shrink-0">
        Hand Cricket Arena 🏏 · India Edition · Play Online & Offline
      </footer>
    </div>
  );
}
