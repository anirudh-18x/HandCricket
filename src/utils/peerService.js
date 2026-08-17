// PeerJS & BroadcastChannel Realtime Peer-to-Peer Manager for Online Mode

import Peer from 'peerjs';

export class OnlinePeerService {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.broadcastChannel = null;
    this.roomCode = null;
    this.isHost = false;
    this.onMessageCallback = null;
    this.onStatusChangeCallback = null;
  }

  // Generate a random 4-digit room code (1000 to 9999)
  static generate4DigitCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Setup BroadcastChannel for local/two-tab testing fallback
  setupBroadcastChannel(code) {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
    const channelName = `hand_cricket_room_${code}`;
    this.broadcastChannel = new BroadcastChannel(channelName);
    this.broadcastChannel.onmessage = (event) => {
      if (event.data && this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };
  }

  sendData(data) {
    // Send via PeerJS connection if open
    if (this.conn && this.conn.open) {
      this.conn.send(data);
    }
    // Send via BroadcastChannel for local/same-browser tabs
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(data);
    }
  }

  // Host creates a room with 4-digit code
  createRoom(roomCode, playerName, avatar, onStatusChange, onMessage) {
    this.roomCode = roomCode;
    this.isHost = true;
    this.onStatusChangeCallback = onStatusChange;
    this.onMessageCallback = onMessage;

    this.setupBroadcastChannel(roomCode);
    this.onStatusChangeCallback({ status: 'WAITING', message: 'Waiting for friend to join with code: ' + roomCode });

    const hostPeerId = `hc-room-${roomCode}-host`;

    try {
      this.peer = new Peer(hostPeerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', (id) => {
        console.log('Host Peer opened with ID:', id);
      });

      this.peer.on('connection', (connection) => {
        this.conn = connection;
        this.setupConnectionHandlers(playerName, avatar);
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS Host notice:', err);
      });
    } catch (e) {
      console.warn('PeerJS fallback to BroadcastChannel:', e);
    }

    // Auto send heartbeats / ready ping over BroadcastChannel
    const pingInterval = setInterval(() => {
      this.sendData({
        type: 'HOST_PING',
        playerName,
        avatar
      });
    }, 1000);

    this.cleanupPing = () => clearInterval(pingInterval);
  }

  // Guest joins a room using 4-digit code
  joinRoom(roomCode, playerName, avatar, onStatusChange, onMessage) {
    this.roomCode = roomCode;
    this.isHost = false;
    this.onStatusChangeCallback = onStatusChange;
    this.onMessageCallback = onMessage;

    this.setupBroadcastChannel(roomCode);
    this.onStatusChangeCallback({ status: 'CONNECTING', message: 'Connecting to room ' + roomCode + '...' });

    // Announce join on BroadcastChannel
    this.sendData({
      type: 'GUEST_JOIN',
      playerName,
      avatar
    });

    const guestPeerId = `hc-room-${roomCode}-guest-${Math.floor(Math.random() * 1000)}`;
    const hostPeerId = `hc-room-${roomCode}-host`;

    try {
      this.peer = new Peer(guestPeerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', () => {
        this.conn = this.peer.connect(hostPeerId, { reliable: true });
        this.setupConnectionHandlers(playerName, avatar);
      });

      this.peer.on('error', (err) => {
        console.warn('PeerJS Guest notice:', err);
      });
    } catch (e) {
      console.warn('PeerJS fallback to BroadcastChannel:', e);
    }
  }

  setupConnectionHandlers(myPlayerName, myAvatar) {
    if (!this.conn) return;

    this.conn.on('open', () => {
      this.onStatusChangeCallback({ status: 'CONNECTED', message: 'Friend Connected!' });
      // Send handshake metadata
      this.sendData({
        type: 'PLAYER_INFO',
        playerName: myPlayerName,
        avatar: myAvatar,
        isHost: this.isHost
      });
    });

    this.conn.on('data', (data) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }
    });

    this.conn.on('close', () => {
      if (this.onStatusChangeCallback) {
        this.onStatusChangeCallback({ status: 'DISCONNECTED', message: 'Peer disconnected' });
      }
    });
  }

  disconnect() {
    if (this.cleanupPing) this.cleanupPing();
    if (this.conn) this.conn.close();
    if (this.peer) this.peer.destroy();
    if (this.broadcastChannel) this.broadcastChannel.close();
  }
}
