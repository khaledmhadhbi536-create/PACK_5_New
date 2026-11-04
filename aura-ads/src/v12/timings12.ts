// Provisoire : remplacé par scripts/align_v12.py dès que les 9 prises sont enregistrées.
const T = {hookDur: 60, hk: [53, 80], intro: 0, prods: [62, 220, 420, 560], tags: [[90, 120, 150, 180], [270, 310, 340, 370], [470, 500], [590, 620, 650]], heads: [null, 250, 450, null], extra: [700, 730, 790, 830, 900], offer: {start: 950, price: 965, strike: 1000, bridge: 1000, deliv: 1030, cod: 1080, cta: 1110}, end: 1140};
export const TIMINGS = {V01_h1: T, V01_h2: T, V01_h3: T, V03_h1: T, V03_h2: T, V03_h3: T, V05_h1: T, V05_h2: T, V05_h3: T} as const;
