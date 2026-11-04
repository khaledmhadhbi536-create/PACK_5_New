// Provisoire : V01 mesuré, V03/V05 en attente (remplacé par scripts/align_v12.py dès que les 9 prises sont là).
const T = {hookDur: 60, hk: [53, 80], intro: 0, prods: [62, 220, 420, 560], tags: [[90, 120, 150, 180], [270, 310, 340, 370], [470, 500], [590, 620, 650]], heads: [null, 250, 450, null], extra: [700, 730, 790, 830, 900], offer: {start: 950, price: 965, strike: 1000, bridge: 1000, deliv: 1030, cod: 1080, cta: 1110}, end: 1140};
export const TIMINGS = {
  V01_h1: {"hookDur": 70, "hk": [53], "intro": 0, "prods": [69, 261, 508, 664], "tags": [[104, 143, 175, 207], [329, 384, 418, 462], [573, 625], [694, 741, 784]], "heads": [null, 297, 535, null], "extra": [833, 858, 904, 940, 997], "offer": {"start": 1034, "price": 1049, "strike": 1092, "deliv": 1120, "cod": 1165, "cta": 1194}, "end": 1220},
  V01_h2: {"hookDur": 122, "hk": [23, 83], "intro": 0, "prods": [66, 247, 497, 644], "tags": [[96, 131, 162, 189], [312, 372, 404, 452], [561, 609], [673, 711, 750]], "heads": [null, 284, 522, null], "extra": [798, 822, 876, 909, 969], "offer": {"start": 1005, "price": 1022, "strike": 1065, "deliv": 1080, "cod": 1124, "cta": 1156}, "end": 1181},
  V01_h3: {"hookDur": 103, "hk": [63], "intro": 0, "prods": [61, 261, 507, 661], "tags": [[95, 137, 171, 202], [322, 384, 418, 463], [572, 622], [690, 730, 766]], "heads": [null, 294, 534, null], "extra": [814, 841, 895, 931, 987], "offer": {"start": 1030, "price": 1042, "strike": 1080, "deliv": 1115, "cod": 1156, "cta": 1185}, "end": 1212},
  V03_h1: T, V03_h2: T, V03_h3: T, V05_h1: T, V05_h2: T, V05_h3: T,
} as const;
