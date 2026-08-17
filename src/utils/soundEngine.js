// Web Audio API Synthesizer - Soothing, smooth, cheerful audio generator

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.35; // Controlled, smooth volume
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(isMuted) {
    this.muted = isMuted;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Soft UI Click
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Smooth Coin Flip sound effect
  playCoinFlip() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const timeOffset = i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + i * 80, now + timeOffset);

      gain.gain.setValueAtTime(this.volume * 0.2, now + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + 0.06);
    }
  }

  // Soft Coin Catch Result Tone
  playCoinLand(isWin = true) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = isWin ? [523.25, 659.25, 783.99] : [440, 392, 349.23];

    freqs.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.09);

      gain.gain.setValueAtTime(this.volume * 0.3, now + index * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.09 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.09);
      osc.stop(now + index * 0.09 + 0.25);
    });
  }

  // Soft Acoustic Bat Shot (Runs Scored)
  playBatShot(runs = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Wood impact sine pulse
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Higher runs produce slightly brighter, higher tone
    const baseFreq = 220 + runs * 40;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.12);

    // Warm cheerful chime if 4 or 6
    if (runs >= 4) {
      setTimeout(() => {
        this.playCheerChime(runs === 6);
      }, 100);
    }
  }

  // Cheerful soft chime for boundaries
  playCheerChime(isSix = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = isSix ? [523.25, 659.25, 783.99, 1046.50] : [440, 554.37, 659.25];

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(this.volume * 0.25, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.3);
    });
  }

  // Soothing Wicket OUT sound (Soft bell & smooth bass drop)
  playWicket() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Soft wood clash
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

    gain.gain.setValueAtTime(this.volume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);

    // Warm descending minor chime
    [392, 349.23, 293.66].forEach((freq, i) => {
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq, now + 0.1 + i * 0.08);

      gain2.gain.setValueAtTime(this.volume * 0.25, now + 0.1 + i * 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + i * 0.08 + 0.3);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(now + 0.1 + i * 0.08);
      osc2.stop(now + 0.1 + i * 0.08 + 0.3);
    });
  }

  // Warm, uplifting, soothing Victory Fanfare
  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.50, d: 0.4 }, // C6
    ];

    let current = now;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, current);

      gain.gain.setValueAtTime(this.volume * 0.35, current);
      gain.gain.exponentialRampToValueAtTime(0.001, current + note.d + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(current);
      osc.stop(current + note.d + 0.1);
      current += note.d;
    });
  }
}

export const soundEngine = new SoundEngine();
