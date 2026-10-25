"""Musiques (48 s) et effets de la série V5 (formats longs). Synthèse, libres de droits.

Usage : python scripts/music_v5.py
Sortie : public/audio/v5/*.wav
"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'audio', 'v5')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(11)
D = 48.0
N = int(D * SR)


def t_(d):
    return np.arange(int(d * SR)) / SR


def lp(x, f):
    return sosfilt(butter(4, f / (SR / 2), output='sos'), x)


def hp(x, f):
    return sosfilt(butter(4, f / (SR / 2), btype='high', output='sos'), x)


def bp(x, a, b):
    return sosfilt(butter(4, [a / (SR / 2), b / (SR / 2)], btype='band', output='sos'), x)


def env(n, a, dcy):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(dcy, 1e-4))


def sweep(f0, f1, d):
    t = t_(d)
    return np.sin(2 * np.pi * np.cumsum(f0 * (f1 / f0) ** (t / d)) / SR)


def reverb(x, mix=0.25):
    ir = rng.normal(0, 1, int(1.6 * SR)) * np.exp(-np.arange(int(1.6 * SR)) / SR * 3.2)
    ir = lp(ir, 5000)
    w = np.convolve(x, ir)[: len(x)]
    w /= np.max(np.abs(w)) + 1e-9
    return x * (1 - mix) + w * mix * np.max(np.abs(x))


def save(name, x, stereo_delay=0.012):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    d = int(stereo_delay * SR)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    st = np.stack([x, x * 0.7 + r * 0.3], 1)
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (st * 32767).astype(np.int16))


class Mix:
    def __init__(self):
        self.m = np.zeros(N)

    def add(self, x, at, g=1.0):
        s = int(at * SR)
        if s >= N:
            return
        e = min(N, s + len(x))
        self.m[s:e] += x[: e - s] * g


def fade(x, a=1.0, b=2.0):
    f = np.ones(len(x))
    f[: int(a * SR)] = np.linspace(0, 1, int(a * SR))
    f[-int(b * SR):] = np.linspace(1, 0, int(b * SR))
    return x * f


def ks(f, d, damp=0.996):
    """Corde pincée (Karplus-Strong)."""
    n = int(d * SR)
    p = int(SR / f)
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = damp * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out


kick = sweep(130, 42, 0.4) * env(int(0.4 * SR), 0.001, 0.12)
snare = bp(rng.normal(0, 1, int(0.3 * SR)), 900, 6000) * env(int(0.3 * SR), 0.001, 0.07) + np.sin(2 * np.pi * 190 * t_(0.3)) * env(int(0.3 * SR), 0.001, 0.05) * 0.5
hat = hp(rng.normal(0, 1, int(0.07 * SR)), 7000) * env(int(0.07 * SR), 0.0005, 0.015)
rim = bp(rng.normal(0, 1, int(0.05 * SR)), 1500, 4000) * env(int(0.05 * SR), 0.0005, 0.01)


def chord_tone(fs, d, bright=0.3):
    tt = t_(d)
    x = sum(np.sin(2 * np.pi * f * tt) + bright * np.sin(4 * np.pi * f * tt) * np.exp(-tt * 3) for f in fs)
    return x * env(len(tt), 0.01, d * 0.5) * (1 + 0.15 * np.sin(2 * np.pi * 5 * tt))


# ---------- 1. lo-fi (82 bpm) : styles kraft / téléphone ----------
m = Mix()
bt = 60 / 82
prog = [[220, 261.6, 329.6, 392], [174.6, 220, 261.6, 329.6], [196, 246.9, 293.7, 349.2], [164.8, 207.7, 246.9, 329.6]]
bar = 0
t = 0.0
while t < D:
    for b in range(4):
        sw = 0.06 if b % 2 else 0
        m.add(kick, t + b * bt, 0.8 if b in (0, 2) else 0)
        if b in (1, 3):
            m.add(snare, t + b * bt, 0.35)
        m.add(hat, t + b * bt + sw, 0.18)
        m.add(hat, t + b * bt + bt / 2 + sw + 0.03, 0.12)
    m.add(lp(chord_tone(prog[bar % 4], 4 * bt, 0.2), 2200), t, 0.22)
    m.add(lp(np.sin(2 * np.pi * prog[bar % 4][0] / 2 * t_(4 * bt)) * env(int(4 * bt * SR), 0.02, 2.5), 300), t, 0.35)
    t += 4 * bt
    bar += 1
crackle = (rng.random(N) > 0.9993) * rng.normal(0, 1, N) * 0.5 + lp(rng.normal(0, 1, N), 3000) * 0.01
save('lofi', fade(lp(m.m, 9000) + crackle))

# ---------- 2. afro / trap (104 bpm) : néo-brutal ----------
m = Mix()
bt = 60 / 104
notes = [110, 110, 130.8, 98]
bar = 0
t = 0.0
mar = [440, 523.3, 659.3, 587.3, 523.3, 440, 392, 440]
while t < D:
    pat = [0, 0.75, 1.5, 2.5, 3.25]
    for p in pat:
        m.add(kick, t + p * bt, 0.9)
    for b in (1, 3):
        m.add(snare, t + b * bt, 0.5)
    for k in range(16):
        m.add(hat, t + k * bt / 4, 0.12 + (0.08 if k % 4 == 2 else 0))
    for k in (0.5, 1.75, 2.75):
        m.add(rim, t + k * bt, 0.4)
    f = notes[bar % 4]
    L = 4 * bt
    tt = t_(L)
    b808 = np.tanh(np.sin(2 * np.pi * np.cumsum(f / 2 * (1 + 0.5 * np.exp(-tt * 20))) / SR) * 2.5) * np.exp(-tt * 0.7)
    m.add(lp(b808, 300), t, 0.55)
    for k in range(8):
        tt2 = t_(0.25)
        m.add(np.sin(2 * np.pi * mar[(k + bar) % 8] * tt2) * np.exp(-tt2 * 18) * 0.25, t + k * bt / 2 + (0.0 if k % 2 == 0 else 0.05))
    t += L
    bar += 1
save('afro', fade(np.tanh(m.m * 0.8)))

# ---------- 3. oud / ambiance (70 bpm) : Sidi Bou Saïd, éditorial ----------
m = Mix()
bt = 60 / 70
hijaz = [146.8, 155.6, 185.0, 196.0, 220.0, 233.1, 261.6, 293.7]
pad = sum(np.sin(2 * np.pi * f * t_(D) + rng.uniform(0, 6)) for f in (73.4, 110, 146.8, 220.2)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.05 * t_(D)))
m.add(lp(pad, 1200), 0, 0.12)
t = 0.0
phrase = [0, 2, 3, 4, 3, 2, 1, 0, 4, 5, 4, 3, 2, 3, 1, 0]
i = 0
while t < D:
    f = hijaz[phrase[i % len(phrase)]]
    m.add(lp(ks(f, 1.4, 0.994), 3500), t, 0.5)
    if i % 4 == 0:
        m.add(sweep(110, 50, 0.4) * env(int(0.4 * SR), 0.002, 0.15), t, 0.35)  # tambour sur cadre (dum)
    if i % 4 == 2:
        m.add(bp(rng.normal(0, 1, int(0.15 * SR)), 1500, 5000) * env(int(0.15 * SR), 0.001, 0.03), t, 0.2)  # tek
    t += bt / 2 if i % 3 else bt
    i += 1
save('oud', fade(reverb(m.m, 0.35), 1.5, 2.5))

# ---------- 4. électro légère (120 bpm) : infographie ----------
m = Mix()
bt = 0.5
arp = [329.6, 392, 493.9, 587.3, 493.9, 392, 329.6, 293.7]
t = 0.0
bar = 0
while t < D:
    for b in range(4):
        m.add(kick, t + b * bt, 0.55)
        m.add(hat, t + b * bt + bt / 2, 0.2)
    m.add(snare * 0.6, t + bt, 0.25)
    m.add(snare * 0.6, t + 3 * bt, 0.25)
    for k in range(16):
        tt = t_(0.12)
        f = arp[(k + bar * 2) % 8] * (2 if bar % 4 == 3 else 1)
        saw = 2 * ((f * tt) % 1) - 1
        m.add(lp(saw * np.exp(-tt * 25), 2500 + 1500 * np.sin(bar)), t + k * bt / 4, 0.18)
    tt = t_(2.0)
    m.add(lp(np.sin(2 * np.pi * 82.4 * tt) * np.exp(-tt * 1.2), 200), t, 0.35)
    t += 4 * bt
    bar += 1
save('electro', fade(m.m))

# ---------- effets ----------
def sfx(name, x):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (np.stack([x, x], 1) * 32767).astype(np.int16))


d = 0.55  # papier qui se déchire
n = int(d * SR)
x = bp(rng.normal(0, 1, n), 1200, 8000) * (0.4 + 0.6 * (rng.random(n) > 0.6)) * np.sin(np.pi * t_(d) / d) ** 0.5
sfx('paper', lp(x, 9000))

typing = np.zeros(int(1.2 * SR))  # clavier
for k in range(14):
    s = int((k * 0.075 + rng.uniform(0, 0.02)) * SR)
    c = bp(rng.normal(0, 1, int(0.03 * SR)), 2000, 7000) * env(int(0.03 * SR), 0.0003, 0.006)
    typing[s:s + len(c)] += c * rng.uniform(0.5, 1)
sfx('typing', typing)

tt = t_(0.6)  # notification
x = np.sin(2 * np.pi * 1046.5 * tt) * np.exp(-tt * 10)
s = int(0.09 * SR)
x[s:] += np.sin(2 * np.pi * 1568 * tt[:-s]) * np.exp(-tt[:-s] * 8)
sfx('notif', x)

tt = t_(0.35)  # bulle envoyée (whoop)
sfx('bubble', sweep(500, 1200, 0.35) * np.exp(-tt * 12))

d = 0.25  # appareil photo
n = int(d * SR)
x = bp(rng.normal(0, 1, n), 1500, 8000) * env(n, 0.0005, 0.02)
s = int(0.09 * SR)
x[s:] += bp(rng.normal(0, 1, n - s), 1500, 8000) * env(n - s, 0.0005, 0.03)
sfx('shutter', x)

d = 0.8  # souffle doux (transition élégante)
n = int(d * SR)
sfx('swish', lp(rng.normal(0, 1, n), 2500) * np.sin(np.pi * t_(d) / d) ** 2)

tt = t_(1.6)  # carillon (cloche douce)
sfx('chime', sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, k in [(1318.5, 2.5), (1975.5, 3.5), (2637, 5)]))

tt = t_(0.5)  # validation « bip » tech
sfx('beep', np.sign(np.sin(2 * np.pi * 1760 * tt)) * np.exp(-tt * 18) * 0.5 + np.sin(2 * np.pi * 2640 * tt) * np.exp(-tt * 14))
print(sorted(os.listdir(OUT)))
