// Visual mapping & metadata for hand gestures 1 to 10

export const GESTURES = {
  1: {
    label: "ONE",
    symbol: "☝️",
    desc: "Index finger pointing up",
    fingers: [false, true, false, false, false], // [Thumb, Index, Middle, Ring, Pinky]
    handsCount: 1
  },
  2: {
    label: "TWO",
    symbol: "✌️",
    desc: "Victory V sign (Index + Middle)",
    fingers: [false, true, true, false, false],
    handsCount: 1
  },
  3: {
    label: "THREE",
    symbol: "🤟",
    desc: "Three fingers (Index, Middle, Ring)",
    fingers: [false, true, true, true, false],
    handsCount: 1
  },
  4: {
    label: "FOUR",
    symbol: "🖖",
    desc: "Four fingers open",
    fingers: [false, true, true, true, true],
    handsCount: 1
  },
  5: {
    label: "FIVE",
    symbol: "🖐️",
    desc: "Full open palm (5 fingers)",
    fingers: [true, true, true, true, true],
    handsCount: 1
  },
  6: {
    label: "SIX",
    symbol: "👍+☝️",
    desc: "Five + One finger (or Thumb out)",
    fingersLeft: [true, true, true, true, true],
    fingersRight: [false, true, false, false, false],
    handsCount: 2
  },
  7: {
    label: "SEVEN",
    symbol: "🖐️+✌️",
    desc: "Five + Two fingers",
    fingersLeft: [true, true, true, true, true],
    fingersRight: [false, true, true, false, false],
    handsCount: 2
  },
  8: {
    label: "EIGHT",
    symbol: "🖐️+🤟",
    desc: "Five + Three fingers",
    fingersLeft: [true, true, true, true, true],
    fingersRight: [false, true, true, true, false],
    handsCount: 2
  },
  9: {
    label: "NINE",
    symbol: "🖐️+🖖",
    desc: "Five + Four fingers",
    fingersLeft: [true, true, true, true, true],
    fingersRight: [false, true, true, true, true],
    handsCount: 2
  },
  10: {
    label: "TEN",
    symbol: "🙌",
    desc: "Both hands full open palms (5 + 5)",
    fingersLeft: [true, true, true, true, true],
    fingersRight: [true, true, true, true, true],
    handsCount: 2
  }
};
