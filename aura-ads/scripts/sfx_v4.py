"""Effets sonores et musique de la série V4 (synthèse, libres de droits).

Usage : python scripts/sfx_v4.py
Sortie : public/audio/v4/*.wav (44,1 kHz, stéréo)
"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'audio', 'v4')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.002, d=0.2, curve=4.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) * curve / max(d, 1e-4))
    return e


def bp(x, lo, hi, order=4):
    sos = butter(order, [lo / (SR / 2), min(hi / (SR / 2), 0.99)], btype='band', output='sos')
    return sosfilt(sos, x)


def lp(x, f, order=4):
    return sosfilt(butter(order, f / (SR / 2), output='sos'), x)


def hp(x, f, order=4):
    return sosfilt(butter(order, f / (SR / 2), btype='high', output='sos'), x)


def save(name, x, width=0.0):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    if width:
        d = int(0.011 * SR)
        r = np.concatenate([np.zeros(d), x[:-d]])
        st = np.stack([x, x * (1 - width) + r * width], 1)
    else:
        st = np.stack([x, x], 1)
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (st * 32767).astype(np.int16))


def sweep(f0, f1, d):
    t = t_(d)
    f = f0 * (f1 / f0) ** (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


# --- tampon : coup sourd + claquement
d = 0.5
thud = sweep(150, 45, d) * env(int(d * SR), 0.001, 0.12, 3)
clk = hp(rng.normal(0, 1, int(d * SR)), 1500) * env(int(d * SR), 0.0005, 0.02, 6)
save('stamp', thud * 1.0 + clk * 0.5)

# --- impact lourd (slam)
d = 1.0
boom = sweep(110, 35, d) * env(int(d * SR), 0.001, 0.35, 3)
crack = bp(rng.normal(0, 1, int(d * SR)), 800, 6000) * env(int(d * SR), 0.0005, 0.06, 5)
save('slam', boom + crack * 0.6, 0.3)

# --- marqueur qui barre (frottement)
d = 0.42
n = int(d * SR)
scr = bp(rng.normal(0, 1, n), 1800, 7000) * (0.6 + 0.4 * np.sin(2 * np.pi * 38 * t_(d)) ** 2)
e = np.minimum(1, t_(d) / 0.03) * np.minimum(1, (d - t_(d)) / 0.08)
save('marker', scr * e)

# --- caisse enregistreuse (ka-ching)
d = 1.3
n = int(d * SR)
drawer = lp(rng.normal(0, 1, n), 1200) * env(n, 0.002, 0.08, 4)
bell = np.zeros(n)
for k, (f, st) in enumerate([(2637, 0.09), (3520, 0.12), (5274, 0.12)]):
    s = int(st * SR)
    tt = t_(d - st)
    bell[s:] += sum(np.sin(2 * np.pi * f * m * tt) * a for m, a in [(1, 1), (2.76, 0.4), (5.4, 0.2)]) * np.exp(-tt * 4.5)
save('cash', drawer * 0.7 + bell * 0.35, 0.4)

# --- pops accordés (pop1 … pop5, montée de ton)
for i, f in enumerate([520, 620, 740, 880, 1040], 1):
    d = 0.16
    x = sweep(f * 1.8, f, d) * env(int(d * SR), 0.001, 0.05, 4)
    x += hp(rng.normal(0, 1, int(d * SR)), 3000) * env(int(d * SR), 0.0005, 0.008, 6) * 0.3
    save(f'pop{i}', x)

# --- tic de compteur
d = 0.04
save('tick', bp(rng.normal(0, 1, int(d * SR)), 2500, 9000) * env(int(d * SR), 0.0003, 0.008, 5))

# --- coche validée (ding court à 2 notes)
d = 0.5
tt = t_(d)
x = np.sin(2 * np.pi * 1318 * tt) * np.exp(-tt * 9)
s = int(0.07 * SR)
x[s:] += np.sin(2 * np.pi * 1976 * tt[:-s]) * np.exp(-tt[:-s] * 7)
save('check', x, 0.3)

# --- étincelles (arpège cristallin)
d = 1.4
n = int(d * SR)
x = np.zeros(n)
for k, f in enumerate([2093, 2637, 3136, 3951, 4186, 5274]):
    s = int(k * 0.06 * SR)
    tt = t_(d)[: n - s]
    x[s:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 5) * (0.8 + 0.2 * rng.random())
save('sparkle', x, 0.6)

# --- souffle glacé (neige) : vent filtré + carillon
d = 1.6
n = int(d * SR)
wind = bp(rng.normal(0, 1, n), 400, 2500) * np.sin(np.pi * t_(d) / d) ** 2
x = wind * 0.6 + np.concatenate([np.zeros(int(0.5 * SR)), np.sin(2 * np.pi * 2349 * t_(d - 0.5)) * np.exp(-t_(d - 0.5) * 3)]) * 0.25
save('snow', x, 0.5)

# --- basse 808 (drop)
d = 1.4
tt = t_(d)
x = np.sin(2 * np.pi * np.cumsum(45 + 80 * np.exp(-tt * 25)) / SR) * np.exp(-tt * 1.6)
save('bass', np.tanh(x * 2.2))

# --- glitch numérique
d = 0.45
n = int(d * SR)
x = np.zeros(n)
pos = 0
while pos < n:
    L = int(rng.uniform(0.01, 0.04) * SR)
    seg = np.sign(np.sin(2 * np.pi * rng.uniform(200, 2000) * t_(L / SR))) * rng.uniform(0.3, 1)
    if rng.random() < 0.4:
        seg = rng.normal(0, 1, L) * 0.6
    x[pos:pos + L] = seg[: n - pos]
    pos += L + int(rng.uniform(0, 0.015) * SR)
save('glitch', lp(x, 7000))

# --- whoosh rapide
d = 0.5
n = int(d * SR)
nz = rng.normal(0, 1, n)
cut = np.linspace(300, 5000, n)
x = bp(nz, 500, 4000) * np.sin(np.pi * t_(d) / d) ** 3
save('whoosh', x, 0.5)

# --- montée (riser) 1,2 s
d = 1.2
n = int(d * SR)
x = bp(rng.normal(0, 1, n), 800, 8000) * (t_(d) / d) ** 2 + sweep(200, 1200, d) * (t_(d) / d) ** 2 * 0.3
save('riser', x, 0.4)

# --- boîte cadeau (couvercle qui saute)
d = 0.5
x = sweep(300, 900, d) * env(int(d * SR), 0.002, 0.1, 4) + bp(rng.normal(0, 1, int(d * SR)), 1000, 5000) * env(int(d * SR), 0.001, 0.03, 5) * 0.5
save('boxpop', x)


# ================= musique : beat promo 118 bpm, 40 s =================
BPM = 118
beat = 60 / BPM
D = 40.0
N = int(D * SR)
mix = np.zeros(N)


def add(x, at, g=1.0):
    s = int(at * SR)
    if s >= N:
        return
    e = min(N, s + len(x))
    mix[s:e] += x[: e - s] * g


kick = sweep(140, 42, 0.35) * env(int(0.35 * SR), 0.001, 0.12, 3)
clap = bp(rng.normal(0, 1, int(0.25 * SR)), 900, 5000) * env(int(0.25 * SR), 0.001, 0.05, 4)
hat = hp(rng.normal(0, 1, int(0.06 * SR)), 7000) * env(int(0.06 * SR), 0.0005, 0.01, 5)
# basse : la mineur, motif sur 2 mesures
notes = [55.0, 55.0, 65.41, 49.0]
for bar in range(int(D / (4 * beat)) + 1):
    t0 = bar * 4 * beat
    for b in range(4):
        add(kick, t0 + b * beat, 1.0)
        add(hat, t0 + b * beat + beat / 2, 0.35)
        add(hat, t0 + b * beat + beat * 0.75, 0.18)
        if b in (1, 3):
            add(clap, t0 + b * beat, 0.55)
    f = notes[bar % 4]
    L = 4 * beat
    tt = t_(L)
    bass = np.tanh(np.sin(2 * np.pi * f * tt) * 1.8) * np.exp(-((tt % beat) * 3))
    add(lp(bass, 400), t0, 0.5)
    # accords pluck (darbouka-pop) : la mineur / fa / do / sol
    chord = {55.0: [440, 523.25, 659.25], 65.41: [349.23, 440, 523.25], 49.0: [392, 493.88, 587.33]}[f]
    for b8 in (0, 3, 6):
        st = t0 + b8 * beat / 2
        for cf in chord:
            tt2 = t_(0.4)
            add(np.sin(2 * np.pi * cf * tt2) * np.exp(-tt2 * 9) * 0.12, st)
mix = np.tanh(mix * 0.9)
fade = np.ones(N)
fade[-int(1.5 * SR):] = np.linspace(1, 0, int(1.5 * SR))
save('beat_promo', mix * fade, 0.2)
print('ok', sorted(os.listdir(OUT)))
