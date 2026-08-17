import React, { useState } from 'react';
import { Copy, Check, KeyRound, Loader2, ArrowLeft, Play } from 'lucide-react';
import { OnlinePeerService } from '../utils/peerService';
import { soundEngine } from '../utils/soundEngine';

export const OnlineLobby = ({ playerName, playerAvatar, onMatchReady, onBack }) => {
  const [tab, setTab]             = useState('CREATE');
  const [roomCode, setRoomCode]   = useState('');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied]       = useState(false);
  const [status, setStatus]       = useState('IDLE');
  const [peerService]             = useState(() => new OnlinePeerService());

  const handleCreateRoom = () => {
    soundEngine.playClick();
    const code = OnlinePeerService.generate4DigitCode();
    setRoomCode(code);
    setStatus('WAITING');
    peerService.createRoom(code, playerName, playerAvatar,
      (s) => setStatus(s.status),
      (data) => handleIncoming(data, code, true)
    );
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (inputCode.length !== 4) return;
    soundEngine.playClick();
    setStatus('CONNECTING');
    peerService.joinRoom(inputCode, playerName, playerAvatar,
      (s) => setStatus(s.status),
      (data) => handleIncoming(data, inputCode, false)
    );
  };

  const handleIncoming = (data, code, isHost) => {
    if (['PLAYER_INFO', 'HOST_PING', 'GUEST_JOIN'].includes(data.type)) {
      soundEngine.playCoinLand(true);
      onMatchReady({
        roomCode: code,
        peerService,
        isHost,
        opponentName:   data.playerName || (isHost ? 'Friend' : 'Host'),
        opponentAvatar: data.avatar || '🏏',
      });
    }
  };

  const copyCode = () => {
    if (!roomCode) return;
    soundEngine.playClick();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-sm mx-auto my-8 px-4">

      <button onClick={() => { soundEngine.playClick(); onBack(); }}
        className="flex items-center space-x-1.5 text-xs font-bold text-c-muted hover:text-c-text mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Modes</span>
      </button>

      <div className="bg-c-surface border border-c-border rounded-3xl shadow-lg p-6">

        {/* Tabs */}
        <div className="flex bg-c-bg border border-c-border p-1 rounded-2xl mb-6 gap-1">
          {[['CREATE', 'Host Match'], ['JOIN', 'Join Match']].map(([key, label]) => (
            <button key={key} type="button"
              onClick={() => { soundEngine.playClick(); setTab(key); setStatus('IDLE'); }}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                tab === key
                  ? key === 'CREATE'
                    ? 'bg-c-green text-white shadow-sm'
                    : 'bg-c-blue text-white shadow-sm'
                  : 'text-c-muted hover:text-c-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CREATE TAB */}
        {tab === 'CREATE' && (
          <div className="text-center space-y-5">
            {!roomCode ? (
              <>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-c-greenlt border border-c-greenmd flex items-center justify-center text-3xl">
                  🎲
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-c-text">Generate Room Code</h3>
                  <p className="text-xs text-c-muted mt-1">Click below — share the code with your friend!</p>
                </div>
                <button onClick={handleCreateRoom}
                  className="w-full py-3.5 rounded-2xl font-extrabold text-sm bg-c-green text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
                  <KeyRound className="w-4 h-4" />
                  <span>GENERATE CODE</span>
                </button>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-c-muted uppercase tracking-widest">Your Match Code</p>
                {/* Big 4-digit code */}
                <div className="flex justify-center space-x-2 my-1">
                  {roomCode.split('').map((d, i) => (
                    <div key={i}
                      className="w-14 h-16 bg-c-greenlt border-2 border-c-green rounded-2xl flex items-center justify-center text-3xl font-black text-c-green shadow-sm">
                      {d}
                    </div>
                  ))}
                </div>

                <button onClick={copyCode}
                  className="inline-flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-xl bg-c-bg border border-c-border text-c-muted hover:text-c-green hover:border-c-green transition-all">
                  {copied ? <Check className="w-4 h-4 text-c-green" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <div className="flex items-center justify-center space-x-2 text-xs text-c-muted bg-c-bg border border-c-border rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 text-c-green animate-spin" />
                  <span>Waiting for friend to enter <b>{roomCode}</b>…</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* JOIN TAB */}
        {tab === 'JOIN' && (
          <form onSubmit={handleJoinRoom} className="text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-c-bluelt border border-c-blue/30 flex items-center justify-center text-3xl">
              🔑
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-c-text">Enter Room Code</h3>
              <p className="text-xs text-c-muted mt-1">Ask your friend for their 4-digit code</p>
            </div>
            <input
              type="text"
              maxLength={4}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="4829"
              className="w-40 text-center text-3xl font-black tracking-widest py-3 bg-c-bg border-2 border-c-border rounded-2xl text-c-blue placeholder-c-border focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-bluelt transition-all"
              required
            />
            <button
              type="submit"
              disabled={inputCode.length !== 4 || status === 'CONNECTING'}
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm bg-c-blue text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {status === 'CONNECTING'
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>CONNECTING…</span></>
                : <><Play className="w-4 h-4" /><span>JOIN MATCH</span></>
              }
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
