"""Synthèse des musiques et effets sonores Aura Bio (100 % originaux, libres de droits).

Usage : python scripts/music.py public/audio
Pistes (~64 s, coupées/fondues dans Remotion) :
  rituel.wav    84 BPM  nappe chaude + kalimba + shaker  -> tutoriels, ASMR
  darbuka.wav  100 BPM  maqsoum darbouka + oud Hijaz      -> héritage, unboxing
  punch.wav    120 BPM  808 + clap + hats + cloche        -> offre, bumpers
  heritage.wav  72 BPM  bendir + oud + ney + bourdon      -> storytelling sidr
SFX : whoosh, pop, riser, impact, ding, tick
"""
import os
import sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44100
rng = np.random.default_rng(7)
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/audio"
os.makedirs(OUT, exist_ok=True)


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.005, d=0.3, curve=4.0):
    t = np.arange(n) / SR
    e = np.exp(-t / max(d, 1e-4) * (curve / 4))
    att = np.clip(t / max(a, 1e-4), 0, 1)
    return e * att


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lp(x, fc, order=2):
    b, a = signal.butter(order, min(fc / (SR / 2), 0.99), "low")
    return signal.lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), min(hi / (SR / 2), 0.99)], "band")
    return signal.lfilter(b, a, x)


def place(buf, x, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= buf.shape[0]:
        return
    x = x[: buf.shape[0] - i]
    l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    buf[i : i + len(x), 0] += x * gain * l * 1.414
    buf[i : i + len(x), 1] += x * gain * r * 1.414


def reverb(x, seconds=1.8, mix=0.25, damp=5000):
    n = int(seconds * SR)
    ir = rng.standard_normal((n, 2)) * np.exp(-np.arange(n) / SR * 5 / seconds)[:, None]
    ir[:, 0], ir[:, 1] = lp(ir[:, 0], damp), lp(ir[:, 1], damp)
    ir /= np.sqrt((ir**2).sum(axis=0))
    wet = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
    return x * (1 - mix) + wet * mix


def master(x, drive=1.15):
    x = x - x.mean(axis=0)
    x = x / (np.abs(x).max() + 1e-9)
    x = np.tanh(x * drive * 1.6) / np.tanh(drive * 1.6)
    x = x / (np.abs(x).max() + 1e-9) * 0.89
    # fondus d'entrée et de sortie
    f = int(0.02 * SR)
    x[:f] *= np.linspace(0, 1, f)[:, None]
    g = int(2.5 * SR)
    x[-g:] *= np.linspace(1, 0, g)[:, None]
    return x


def save(name, x):
    wavfile.write(os.path.join(OUT, name), SR, (x * 32767).astype(np.int16))
    print(name, f"{len(x)/SR:.1f}s")


# ---------- instruments ----------
def kick(dur=0.45, f0=150, f1=48, punch=1.0):
    t = t_(dur)
    f = f1 + (f0 - f1) * np.exp(-t * 30)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) * punch + 0.3 * np.sin(ph) * np.exp(-t * 40)


def kick808(note=33, dur=0.9):
    t = t_(dur)
    f = midi(note) + 120 * np.exp(-t * 35)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(1.8 * np.sin(ph) * np.exp(-t * 2.8))


def clap():
    t = t_(0.25)
    n = rng.standard_normal(len(t))
    e = np.zeros_like(t)
    for k, o in enumerate([0, 0.011, 0.022]):
        e += (t >= o) * np.exp(-(t - o).clip(0) * (90 if k < 2 else 22))
    return bp(n * e, 900, 5000) * 0.9


def hat(open_=False):
    t = t_(0.25 if open_ else 0.06)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * (14 if open_ else 70)) * 0.5


def shaker():
    t = t_(0.09)
    return bp(rng.standard_normal(len(t)), 4000, 11000) * np.sin(np.pi * t / t[-1]) ** 2 * 0.35


def doum():
    t = t_(0.5)
    f = 72 + 55 * np.exp(-t * 25)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)
    slap = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 60) * 0.4
    return body + slap


def tek(bright=1.0):
    t = t_(0.12)
    n = bp(rng.standard_normal(len(t)), 2500, 9000) * np.exp(-t * 55)
    ring = np.sin(2 * np.pi * 1850 * t) * np.exp(-t * 45) * 0.35
    return (n + ring) * bright


def bendir():
    t = t_(0.7)
    f = 60 + 25 * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    snare = bp(rng.standard_normal(len(t)), 300, 2500) * np.exp(-t * 9) * 0.25  # cordes du bendir
    return body + snare


def pluck_ks(freq, dur=1.6, bright=0.5, decay=0.996):
    """Karplus-Strong : sonorité de oud / luth."""
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    buf = lp(rng.standard_normal(p), 1500 + 6000 * bright, 1)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = decay * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    att = np.clip(np.arange(n) / (0.002 * SR), 0, 1)
    return out * att / (np.abs(out).max() + 1e-9)


def kalimba(freq, dur=1.4):
    t = t_(dur)
    return (np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t * 9)) * np.exp(-t * 3.2)


def bell(freq, dur=1.6):
    t = t_(dur)
    mod = np.sin(2 * np.pi * freq * 3.5 * t) * 2.2 * np.exp(-t * 3)
    return np.sin(2 * np.pi * freq * t + mod) * np.exp(-t * 2.6)


def pad(freqs, dur, cutoff=1400):
    t = t_(dur)
    x = np.zeros(len(t))
    for f in freqs:
        for det in (-0.12, 0.0, 0.11):
            ff = f * 2 ** (det / 12)
            x += signal.sawtooth(2 * np.pi * ff * t + rng.uniform(0, 6)) * 0.33
    x = lp(x, cutoff, 2)
    a = int(0.6 * SR)
    e = np.ones(len(t))
    e[:a] = np.linspace(0, 1, a)
    e[-a:] = np.linspace(1, 0, a)
    return x * e / len(freqs)


def ney(freq, dur):
    t = t_(dur)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.clip(t / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(freq * vib) / SR
    tone = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    breath = bp(rng.standard_normal(len(t)), freq * 0.8, freq * 4) * 0.12
    e = np.clip(t / 0.25, 0, 1) * np.clip((dur - t) / 0.4, 0, 1)
    return (tone + breath) * e


def sub(note, dur):
    t = t_(dur)
    e = np.clip(t / 0.01, 0, 1) * np.exp(-t * 1.2)
    return np.sin(2 * np.pi * midi(note) * t) * e


LEN = 64.0

# ---------- 1. RITUEL (84 BPM) ----------
def track_rituel():
    bpm, b = 84, 60 / 84
    buf = np.zeros((int(LEN * SR), 2))
    chords = [[50, 57, 60, 64, 65], [46, 53, 57, 62, 65], [41, 53, 57, 60, 64], [48, 55, 59, 62, 67]]  # Dm9 Bbmaj7 Fmaj7 Cadd9
    bar = 4 * b
    nb = int(LEN / bar) + 1
    for i in range(nb):
        ch = chords[i % 4]
        place(buf, pad([midi(m) for m in ch[1:]], bar + 0.8, 1100), i * bar, 0.5)
        place(buf, sub(ch[0] - 12, bar), i * bar, 0.45)
        arp = [ch[2] + 12, ch[3] + 12, ch[4] + 12, ch[3] + 12, ch[1] + 12, ch[4] + 12, ch[2] + 24, ch[3] + 12]
        for k, m in enumerate(arp):
            if i >= 1:
                place(buf, kalimba(midi(m)), i * bar + k * b / 2, 0.22, pan=0.35 * np.sin(k))
        if i >= 2:
            for k in range(8):
                place(buf, shaker(), i * bar + k * b / 2 + (0.02 if k % 2 else 0), 0.5 if k % 2 else 0.3, pan=0.3)
            place(buf, kick(0.4, 110, 45, 0.8), i * bar, 0.55)
            place(buf, kick(0.4, 110, 45, 0.8), i * bar + 2.5 * b, 0.4)
            place(buf, clap() * 0.5, i * bar + b, 0.25)
            place(buf, clap() * 0.5, i * bar + 3 * b, 0.25)
    return master(reverb(buf, 2.4, 0.3), 1.0)


# ---------- 2. DARBUKA (100 BPM, maqsoum) ----------
HIJAZ_D = [62, 63, 66, 67, 69, 70, 72, 74]  # Ré Hijaz


def track_darbuka():
    b = 60 / 100
    buf = np.zeros((int(LEN * SR), 2))
    bar = 4 * b
    nb = int(LEN / bar) + 1
    # maqsoum : D T . T D . T .  (croches)
    pattern = ["D", "T", None, "T", "D", None, "T", None]
    melody = [0, 1, 2, 1, 0, None, 3, 2, 4, 3, 2, 1, 2, None, 1, 0, 4, 5, 4, 3, 2, 3, 2, 1, 0, None, 2, 1, 0, None, None, None]
    for i in range(nb):
        t0 = i * bar
        for k, h in enumerate(pattern):
            st = t0 + k * b / 2
            if h == "D":
                place(buf, doum(), st, 0.9, -0.05)
            elif h == "T":
                place(buf, tek(), st, 0.55, 0.15)
            if i >= 2 and h is None:
                place(buf, tek(0.45), st + b / 4 if k == 7 else st, 0.3, 0.25)  # ka (remplissage)
        place(buf, sub(38, bar * 0.9), t0, 0.35)
        if i >= 1:
            place(buf, pad([midi(50), midi(57), midi(62)], bar + 0.6, 800), t0, 0.22)
        if i >= 2:
            for k in range(8):
                idx = melody[(i * 8 + k) % len(melody)]
                if idx is not None:
                    note = HIJAZ_D[idx]
                    place(buf, pluck_ks(midi(note), 1.2, 0.55), t0 + k * b / 2, 0.42, pan=-0.25)
        if i >= 6 and i % 4 == 3:  # petit roulement fin de phrase
            for r in range(6):
                place(buf, tek(0.5 + r * 0.08), t0 + 3 * b + r * b / 6, 0.35, 0.2)
    return master(reverb(buf, 1.6, 0.2), 1.25)


# ---------- 3. PUNCH (120 BPM) ----------
def track_punch():
    b = 60 / 120
    buf = np.zeros((int(LEN * SR), 2))
    bar = 4 * b
    nb = int(LEN / bar) + 1
    bass = [38, 38, 41, 36]
    bells = [74, 77, 81, 79, 77, 74, 72, 74]
    for i in range(nb):
        t0 = i * bar
        bn = bass[i % 4]
        place(buf, kick808(bn - 12, 0.9), t0, 0.8)
        place(buf, kick808(bn - 12, 0.5), t0 + 1.5 * b, 0.55)
        place(buf, kick(0.3, 180, 55), t0 + 2.75 * b, 0.45 if i % 2 else 0.0)
        place(buf, clap(), t0 + b, 0.55)
        place(buf, clap(), t0 + 3 * b, 0.55)
        for k in range(16):
            vel = 0.55 if k % 4 == 2 else 0.3
            if i % 4 == 3 and k >= 12:
                for r in range(2):
                    place(buf, hat(), t0 + k * b / 4 + r * b / 8, vel, 0.3)
            else:
                place(buf, hat(k % 8 == 6), t0 + k * b / 4, vel, 0.3)
        if i >= 2:
            for k, m in enumerate(bells):
                if (k + i) % 3 != 2:
                    place(buf, bell(midi(m - 12)), t0 + k * b / 2, 0.16, pan=-0.3)
        place(buf, pad([midi(bn + 12), midi(bn + 19), midi(bn + 24)], bar + 0.3, 1800), t0, 0.15)
    return master(reverb(buf, 1.2, 0.12), 1.35)


# ---------- 4. HERITAGE (72 BPM) ----------
def track_heritage():
    b = 60 / 72
    buf = np.zeros((int(LEN * SR), 2))
    bar = 4 * b
    nb = int(LEN / bar) + 1
    drone = pad([midi(50), midi(57)], LEN, 600)
    buf[: len(drone), 0] += drone * 0.35
    buf[: len(drone), 1] += drone * 0.35
    phrase = [(0, 1.0), (2, 0.5), (1, 0.5), (0, 1.0), (3, 1.0), (4, 2.0), (3, 0.5), (2, 0.5), (1, 1.0), (0, 2.0)]
    for i in range(nb):
        t0 = i * bar
        place(buf, bendir(), t0, 0.8)
        place(buf, tek(0.35), t0 + b, 0.25)
        place(buf, bendir() * 0.6, t0 + 2 * b, 0.6)
        place(buf, tek(0.35), t0 + 2.5 * b, 0.2)
        place(buf, tek(0.35), t0 + 3 * b, 0.25)
    t = 2 * bar
    k = 0
    while t < LEN - 3:
        idx, d = phrase[k % len(phrase)]
        place(buf, pluck_ks(midi(HIJAZ_D[idx]), 1.8, 0.45, 0.997), t, 0.45, -0.2)
        if k % 10 == 4 and t > 4 * bar:
            place(buf, ney(midi(HIJAZ_D[4] + 12), 3.0), t, 0.18, 0.3)
        t += d * b
        k += 1
    return master(reverb(buf, 2.8, 0.32), 1.05)


# ---------- SFX ----------
def sfx_whoosh():
    d = 0.6
    t = t_(d)
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    seg = 256
    for s in range(0, len(t), seg):
        c = 400 + 5000 * np.sin(np.pi * s / len(t)) ** 2
        out[s : s + seg] = bp(n[s : s + seg + 0], c * 0.7, c * 1.3, 1)[: len(out[s : s + seg])]
    e = np.sin(np.pi * t / d) ** 2
    x = lp(out * e, 8000)
    return np.stack([x, x], 1)


def sfx_pop():
    t = t_(0.12)
    f = 900 * np.exp(-t * 18) + 280
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35)
    return np.stack([x, x], 1)


def sfx_riser():
    d = 1.5
    t = t_(d)
    f = 200 * 2 ** (t / d * 3)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + hp(rng.standard_normal(len(t)), 2000) * 0.3 * t / d
    x *= (t / d) ** 2
    return np.stack([x, x], 1)


def sfx_impact():
    t = t_(1.2)
    x = kick(1.2, 120, 38) * 1.2 + lp(rng.standard_normal(len(t)), 400) * np.exp(-t * 6) * 0.5
    return np.stack([x, x], 1)


def sfx_ding():
    x = bell(midi(84), 1.4) * 0.7 + bell(midi(91), 1.4) * 0.4
    return np.stack([x, x], 1)


def sfx_tick():
    t = t_(0.03)
    x = hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 300)
    return np.stack([x, x], 1)


if __name__ == "__main__":
    for name, fn in [("rituel", track_rituel), ("darbuka", track_darbuka), ("punch", track_punch), ("heritage", track_heritage)]:
        save(f"{name}.wav", fn())
    for name, fn in [("whoosh", sfx_whoosh), ("pop", sfx_pop), ("riser", sfx_riser), ("impact", sfx_impact), ("ding", sfx_ding), ("tick", sfx_tick)]:
        x = fn()
        x = x / (np.abs(x).max() + 1e-9) * 0.8
        save(f"sfx_{name}.wav", x)
