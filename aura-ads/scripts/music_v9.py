"""V9 (kinetic) : musique 150 BPM (1 temps = 12 images à 30 i/s), mezoued + darbouka + trap.
Structure calée sur la vidéo (118 temps) : 0-8 accroche (tension), 8-20 montée (darbouka filtrée + riser),
20 = drop (1er produit), puis le groove jusqu'à la fin. Sortie : public/audio/v9/music9.wav."""
import numpy as np
from pathlib import Path
from sfx_v8 import SR, t, bp, lp, hp, env, reverb, sub_boom, sweep_filter, rng, save

BPM = 150
BEAT = 60 / BPM
BEATS = 118
DROP = 20
OUT = Path(__file__).resolve().parent.parent / 'public' / 'audio' / 'v9'
N = int((BEATS + 2) * BEAT * SR)
L = np.zeros(N)
R = np.zeros(N)


def add(sig, at_beat, g=1.0, pan=0.0):
    i = int(at_beat * BEAT * SR)
    if i >= N or i < 0:
        return
    k = min(len(sig), N - i)
    L[i:i + k] += sig[:k] * g * np.sqrt((1 - pan) / 2) * 1.414
    R[i:i + k] += sig[:k] * g * np.sqrt((1 + pan) / 2) * 1.414


mtof = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------- instruments ----------
kick = np.tanh(sub_boom(0.5, 170, 42) * 2.2)
kick[:240] += rng.standard_normal(240) * 0.35


def clap():
    x = np.zeros(int(0.35 * SR))
    for o in [0, 0.009, 0.019]:
        i = int(o * SR)
        n = int(0.28 * SR)
        b = bp(rng.standard_normal(n), 900, 6000) * env(n, 0.0005, 0.07, 5)
        x[i:i + n] += b[: len(x) - i]
    return reverb(x, 0.7, 0.22)


CLAP = clap()
HAT = hp(rng.standard_normal(int(0.04 * SR)), 8500) * env(int(0.04 * SR), 0.0005, 0.012, 5)


def doum():
    d = 0.35
    tt = t(d)
    f = 95 * (1 + 0.6 * np.exp(-tt * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.001, 0.18, 4) + bp(rng.standard_normal(len(tt)), 200, 900) * env(len(tt), 0.0005, 0.02, 6) * 0.3


def tek():
    d = 0.12
    tt = t(d)
    return (bp(rng.standard_normal(len(tt)), 2500, 7000) * 0.7 + np.sin(2 * np.pi * 1700 * tt) * 0.5) * env(len(tt), 0.0003, 0.02, 6)


DOUM, TEK = doum(), tek()


def mezoued(m, d, vib=True):
    """Lead nasal type mezoued : dents de scie + bourdon, filtre passe-bande, vibrato."""
    tt = t(d)
    f = mtof(m) * (1 + (0.006 * np.sin(2 * np.pi * 6 * tt) * np.clip(tt / 0.15, 0, 1) if vib else 0))
    ph = np.cumsum(f) / SR
    saw = 2 * (ph % 1) - 1
    saw2 = 2 * ((ph * 1.004) % 1) - 1
    x = bp(saw + saw2, 700, 3800, 2) * 0.6 + lp(saw, 2500, 2) * 0.3
    a = np.minimum(1, tt / 0.012) * np.minimum(1, (d - tt) / 0.03)
    return np.tanh(x * a * 1.4)


def bass808(m, d):
    tt = t(d)
    f = mtof(m - 24)
    s = np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-tt * 40))) / SR)
    return (np.tanh(s * 1.4) * 0.5 + np.sin(2 * np.pi * f * tt) * 0.7) * env(len(tt), 0.003, d, 1.0)


# ---------- intro : drone + battements (0-8), montée darbouka filtrée (8-20) ----------
tt = t(DROP * BEAT)
drone = sum(np.sin(2 * np.pi * f * tt + p) for f, p in [(55, 0), (55.3, 1), (82.4, 2), (116.5, 3)])  # la + si bémol (hijaz)
drone = lp(drone + lp(rng.standard_normal(len(tt)), 300) * 0.5, 600) * 0.22 * (0.5 + 0.5 * tt / tt[-1])
add(reverb(drone, 2.0, 0.3)[: len(tt)], 0, 1.0)
for b in range(0, 8, 2):  # battements de coeur
    add(sub_boom(0.4, 80, 40), b, 0.9)
    add(sub_boom(0.4, 80, 40), b + 0.5, 0.65)
build = np.zeros(int(12 * BEAT * SR) + SR)
for k in range(12 * 2):  # darbouka en croches, s'ouvre
    b = 8 + k * 0.5
    pat = [DOUM, TEK, TEK, DOUM][k % 4]
    add(pat, b, 0.25 + 0.5 * k / 24, 0.2 if pat is TEK else 0)
for k in range(16):  # roulement final (doubles croches) sur 18-20
    add(TEK, 18 + k * 0.125, 0.3 + 0.4 * k / 16, 0.3)
# riser bruit sur 16-20
rd = 4 * BEAT
rr = t(rd)
riser = sweep_filter(rng.standard_normal(len(rr)), 300, 9000, width=0.6) * (rr / rd) ** 2.2 * 0.6
add(riser, 16, 1.0)
for k in range(8):  # mezoued filtré annonce le thème
    add(lp(mezoued([69, 70, 73, 74, 76, 74, 73, 70][k], BEAT * 0.9), 1200), 12 + k * 0.5, 0.22, -0.2)

# ---------- groove (20 -> fin) ----------
# hijaz sur la : la si♭ do# ré mi fa sol
riff = [(0, 76, .5), (.5, 77, .5), (1, 76, .5), (1.5, 74, .5), (2, 73, 1), (3, 74, .5), (3.5, 73, .5),
        (4, 70, .5), (4.5, 73, .5), (5, 74, 1), (6, 73, .5), (6.5, 70, .5), (7, 69, 1)]
roots = [57, 55, 53, 52]  # la sol fa mi
for bar in range(DROP, BEATS, 4):
    seg = (bar - DROP) // 4
    root = roots[seg % 4]
    # kick (demi-temps trap) et clap sur le 3
    for s in ([0, 1.75, 2.5] if seg % 2 == 0 else [0, 1.75, 2.5, 3.5]):
        add(kick, bar + s, 0.85)
    add(CLAP, bar + 2, 0.5)
    # charleston doubles croches + roulements
    for k in range(8):
        add(HAT, bar + k * 0.5, 0.2 if k % 2 else 0.26, 0.35)
    if seg % 2 == 1:
        for k in range(6):
            add(HAT, bar + 3 + k / 6, 0.16, 0.35)
    # darbouka maqsum
    for s, h in [(0, DOUM), (0.5, TEK), (1.5, TEK), (2, DOUM), (3, TEK), (3.5, TEK)]:
        add(h, bar + s, 0.35, 0.25 if h is TEK else -0.1)
    # 808
    add(bass808(root, 1.7 * BEAT), bar, 0.55)
    add(bass808(root, 1.2 * BEAT), bar + 2.5, 0.45)
    # mezoued : riff sur 8 temps, une mesure sur deux en entier, l'autre en écho plus doux
    if seg % 2 == 0:
        for s, m, d in riff:
            add(mezoued(m, d * BEAT * 0.95), bar + s, 0.2, -0.15)
for b in range(DROP, BEATS, 16):  # crash/impact à chaque phrase
    add(np.tanh(sub_boom(1.2, 120, 38) * 1.5), b, 0.7)
    add(hp(rng.standard_normal(int(1.5 * SR)), 5000) * env(int(1.5 * SR), 0.001, 0.8, 4), b, 0.18)

y = np.stack([L, R], 1)
y = np.stack([reverb(y[:, 0], 1.0, 0.1, 7000)[:N], reverb(y[:, 1], 1.0, 0.1, 7000)[:N]], 1)
y = np.tanh(y * 1.1)
save(OUT / 'music9.wav', y, 0.85)
