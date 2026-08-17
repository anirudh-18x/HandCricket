// Hand Cricket AI Agent — patterns-based adaptive engine (no avatar field)

export const AI_PERSONALITIES = {
  TACTICAL: {
    id: 'TACTICAL',
    name: 'Captain Sharp',
    role: 'Tactical Mastermind',
    desc: 'Analyzes your patterns and counter-predicts.',
  },
  SMASHER: {
    id: 'SMASHER',
    name: 'Power Smasher',
    role: 'Aggressive Finisher',
    desc: 'Loves big shots — 4s, 6s, and 10s!',
  },
  SPINNER: {
    id: 'SPINNER',
    name: 'Mystery Spinner',
    role: 'Unpredictable Trickster',
    desc: 'Mixes odd numbers to trap you.',
  },
  DEFENDER: {
    id: 'DEFENDER',
    name: 'Steady Anchor',
    role: 'Calculated Defender',
    desc: 'Plays safe singles — tough to get out.',
  }
};

export class HandCricketAI {
  constructor(personality = AI_PERSONALITIES.TACTICAL) {
    this.personality = personality;
    this.userHistory = [];
    this.aiHistory   = [];
  }

  setPersonality(key) {
    if (AI_PERSONALITIES[key]) this.personality = AI_PERSONALITIES[key];
  }

  recordTurn(userNum, aiNum) {
    this.userHistory.push(userNum);
    this.aiHistory.push(aiNum);
  }

  reset() {
    this.userHistory = [];
    this.aiHistory   = [];
  }

  makeMove({ isAiBatting, target = null, currentScore = 0 }) {
    const histLen  = this.userHistory.length;
    const lastUser = histLen > 0 ? this.userHistory[histLen - 1] : null;

    const pickWeighted = (options) => {
      const total = options.reduce((s, o) => s + o.weight, 0);
      let rand = Math.random() * total;
      for (const o of options) {
        if (rand < o.weight) return o.val;
        rand -= o.weight;
      }
      return options[Math.floor(Math.random() * options.length)].val;
    };

    const getMostFreq = (n = 5) => {
      if (!histLen) return null;
      const recent = this.userHistory.slice(-n);
      const freq   = {};
      recent.forEach(x => freq[x] = (freq[x] || 0) + 1);
      let max = 0, best = null;
      Object.entries(freq).forEach(([num, f]) => { if (f > max) { max = f; best = +num; } });
      return best;
    };

    const mostFreq = getMostFreq(5);

    // BOWLING — try to match user number
    if (!isAiBatting) {
      if (this.personality.id === 'TACTICAL') {
        if (lastUser  && Math.random() < 0.45) return lastUser;
        if (mostFreq  && Math.random() < 0.35) return mostFreq;
      }
      if (this.personality.id === 'SMASHER') {
        if (Math.random() < 0.6) return [4, 6, 10, 5][Math.floor(Math.random() * 4)];
      }
      if (this.personality.id === 'SPINNER') {
        if (Math.random() < 0.7) return [1, 3, 5, 7, 9][Math.floor(Math.random() * 5)];
      }
      if (this.personality.id === 'DEFENDER') {
        if (Math.random() < 0.65) return [1, 2, 3, 4][Math.floor(Math.random() * 4)];
      }
      return Math.floor(Math.random() * 10) + 1;
    }

    // BATTING — avoid user's bowling picks, maximize score
    if (isAiBatting) {
      if (target !== null) {
        const need = target - currentScore;
        if (need <= 3) {
          const safe = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(n => n !== lastUser && n !== mostFreq);
          if (need <= 2) return Math.min(need, safe[0] || 1);
        }
      }

      if (this.personality.id === 'SMASHER') {
        return pickWeighted([
          { val: 6, weight: 30 }, { val: 4, weight: 25 }, { val: 5, weight: 15 },
          { val: 10, weight: 15 }, { val: 3, weight: 5 }, { val: 2, weight: 5 }, { val: 1, weight: 5 },
        ]);
      }
      if (this.personality.id === 'DEFENDER') {
        return pickWeighted([
          { val: 2, weight: 30 }, { val: 3, weight: 25 }, { val: 1, weight: 20 },
          { val: 4, weight: 15 }, { val: 5, weight: 5  }, { val: 6, weight: 5  },
        ]);
      }

      const candidates = [1,2,3,4,5,6,7,8,9,10].map(val => {
        let w = 10;
        if (val === lastUser)  w -= 6;
        if (val === mostFreq)  w -= 5;
        if (val === 4 || val === 6) w += 4;
        return { val, weight: Math.max(w, 1) };
      });
      return pickWeighted(candidates);
    }

    return Math.floor(Math.random() * 10) + 1;
  }
}
