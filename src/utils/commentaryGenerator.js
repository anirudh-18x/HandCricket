// Commentary Generator for Hand Cricket matches
// Inspired by Ian Bishop's dramatic, emotional commentary style

const BALL_COMMENTARY = {
  1: [
    "Just a single there. Rotated the strike, keeping the scoreboard ticking.",
    "Soft hands, nudged to mid-wicket. One run, and the strike changes.",
    "Clever cricket! Takes a sharp single, great awareness of the field."
  ],
  2: [
    "Good running between the wickets! Two runs, nicely converted.",
    "Pushed into the gap, and they come back for two. Smart batting!",
    "Placed it wide of mid-off, hustled back. Two runs to the total."
  ],
  3: [
    "Oh beautiful placement! Three runs, and the fielder couldn't cut that off!",
    "Right in the gap! Three big runs, and the momentum is shifting!",
    "Glorious drive, just stops short of the rope. Three runs — quality stroke!"
  ],
  4: [
    "FOUR! Oh that is magnificent! Timing is everything in this game! 💥",
    "BOUNDARY! You don't need power when you have that kind of placement!",
    "FOUR RUNS! He's middled that beautifully — races away to the fence! 🏏",
    "Shot! SHOT! That is pure class — four runs all the way!"
  ],
  5: [
    "Five runs! Overthrow at the stumps, and the batting side gains!",
    "Oh the drama! Five runs taken, some chaotic fielding there!",
    "Five! That is outstanding running, matched with a fielding error!"
  ],
  6: [
    "SIX! OH REMEMBER THE NAME! That has gone into the stands! 🚀",
    "MAXIMUM! He has launched it into orbit! That is SENSATIONAL hitting!",
    "SIX! You cannot — CANNOT — bowl there to a player of this calibre! 💥",
    "OUT OF THE GROUND! You know what, that is one of the shots of the match! 🌟"
  ],
  7: [
    "Seven! SEVEN RUNS! Overthrows and absolute pandemonium on the field!",
    "Oh my word — seven runs! This game is producing extraordinary drama!"
  ],
  8: [
    "EIGHT RUNS! I have never— this is UNBELIEVABLE cricket!",
    "Eight! The wheels have come off the fielding! Absolute mayhem!"
  ],
  9: [
    "NINE RUNS off a single ball! This — this is what dreams are made of!",
    "Nine! The crowd cannot believe it, and frankly, neither can I!"
  ],
  10: [
    "TEN! TEN RUNS! I — I don't have the words! That is PERFECTION! 🏆",
    "THE PERFECT TEN! Ladies and gentlemen, you are witnessing history! 🌟"
  ]
};

const WICKET_COMMENTARY = [
  "GONE! HE'S GONE! Same number — both chose it, and the batter has to walk! ☝️",
  "OUT! Oh that is CRUEL! Matched numbers, and the innings hangs by a thread! 💥",
  "WICKET! Can you believe it?! Same choice — the bowler is ECSTATIC! 🔥",
  "HE IS OUT! The stumps are shattered — figuratively and literally! What a moment! 🏏",
  "CLEANED UP! Identical numbers! The pavilion awaits — that is a BIG wicket!"
];

export function getCommentary(runs, isWicket = false, batterName = "Batter") {
  if (isWicket) {
    const quote = WICKET_COMMENTARY[Math.floor(Math.random() * WICKET_COMMENTARY.length)];
    return `${batterName} IS OUT! ${quote}`;
  }

  const list = BALL_COMMENTARY[runs] || [`${runs} runs scored by ${batterName}! Outstanding!`];
  const quote = list[Math.floor(Math.random() * list.length)];
  return quote;
}
