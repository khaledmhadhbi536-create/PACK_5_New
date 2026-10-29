"""V8 : effets sonores « pro » + nappes de suspense + musique de fond, synthétisés (numpy/scipy).
Sortie : public/audio/v8/sfx/*.wav, public/audio/v8/suspense8.wav, public/audio/v8/beat8.wav (48 kHz stéréo)."""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile
from pathlib import Path

SR = 48000
OUT = Path(__file__).resolve().parent.parent / 'public' / 'audio' / 'v8'
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(d * SR)) / SR


def bp(x, lo, hi, o=4):
    return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)


def lp(x, f, o=4):
    return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)


def hp(x, f, o=4):
    return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)


def sweep_filter(x, f0, f1, kind='band', width=0.6, steps=64):
    """Filtre dont la fréquence glisse de f0 à f1 (par blocs, fondus)."""
    n = len(x)
    out = np.zeros(n)
    edges = np.linspace(0, n, steps + 1).astype(int)
    for i in range(steps):
        a, b = edges[i], edges[i + 1]
        f = f0 * (f1 / f0) ** (i / (steps - 1))
        lo, hi = max(30, f * (1 - width / 2)), min(SR / 2 - 100, f * (1 + width / 2))
        pad = 2048
        seg = x[max(0, a - pad):b]
        y = bp(seg, lo, hi, 2) if kind == 'band' else lp(seg, f, 2)
        out[a:b] = y[-(b - a):]
    return out


def env(n, a, d, curve=4.0):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    tt = np.arange(n - na) / SR
    e[na:] = np.exp(-curve * tt / max(d, 1e-3))
    return e


def reverb(x, dur=1.6, mix=0.3, bright=6000):
    n = int(dur * SR)
    ir = rng.standard_normal(n) * np.exp(-6.0 * np.arange(n) / n)
    ir = lp(ir, bright, 2)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = np.zeros(len(x) + n)
    c = fftconvolve(x, ir)[: len(x) + n]
    wet[: len(c)] = c
    dry = np.concatenate([x, np.zeros(n)])
    return dry * (1 - mix) + wet * mix


def stereo(x, width=0.0, pan=0.0):
    """width : petit délai (Haas) sur un canal, pan -1..1."""
    d = int(width * SR)
    l = x.copy()
    r = np.concatenate([np.zeros(d), x])[: len(x)] if d else x.copy()
    gl, gr = np.sqrt((1 - pan) / 2) * 1.414, np.sqrt((1 + pan) / 2) * 1.414
    return np.stack([l * gl, r * gr], 1)


def save(path, x, peak=0.89):
    if x.ndim == 1:
        x = stereo(x)
    # fondu de sortie anti-clic
    f = min(len(x), int(0.01 * SR))
    x[-f:] *= np.linspace(1, 0, f)[:, None]
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    path.parent.mkdir(parents=True, exist_ok=True)
    wavfile.write(str(path), SR, (x * 32767).astype(np.int16))
    print(path.name, round(len(x) / SR, 2))


def sub_boom(d=1.6, f0=110, f1=34):
    tt = t(d)
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-tt * 9)) / SR
    return np.sin(ph) * env(len(tt), 0.002, d * 0.55, 3.5)


def noise_burst(d, lo, hi, dec):
    tt = t(d)
    return bp(rng.standard_normal(len(tt)), lo, hi) * env(len(tt), 0.001, dec, 5)


# ---------------- effets ----------------

def impact():
    """Gros impact cinéma : sub + claquement + queue réverbérée."""
    d = 2.2
    x = sub_boom(d) * 1.0
    x[: int(0.4 * SR)] += noise_burst(0.4, 800, 9000, 0.12) * 0.55
    x[: int(0.15 * SR)] += noise_burst(0.15, 150, 900, 0.05) * 0.8
    x = np.tanh(x * 1.6)
    return stereo(reverb(x, 2.0, 0.28, 4500), 0.012)


def braam():
    """« Braaam » de bande-annonce (cuivres graves désaccordés)."""
    d = 2.6
    tt = t(d)
    x = np.zeros(len(tt))
    for f, det in [(55, 0), (55, 0.7), (82.4, -0.5), (110, 0.4), (41.2, 0)]:
        ph = 2 * np.pi * (f + det) * tt
        saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
        x += saw
    x = sweep_filter(x, 300, 1800, kind='low', steps=48) * 0.5 + lp(x, 400) * 0.5
    x *= env(len(tt), 0.03, 1.3, 2.5)
    x += sub_boom(d) * 1.2
    x = np.tanh(x * 1.3)
    return stereo(reverb(x, 2.4, 0.3, 3500), 0.015)


def whoosh(d=0.7, f0=400, f1=5000, rev=False):
    tt = t(d)
    n = rng.standard_normal(len(tt))
    x = sweep_filter(n, f0, f1, width=0.9)
    e = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2
    e = e ** (0.6)
    x *= e
    if rev:
        x = x[::-1]
    # mouvement gauche → droite
    pan = np.linspace(-0.7, 0.7, len(x))
    l, r = x * np.sqrt((1 - pan) / 2), x * np.sqrt((1 + pan) / 2)
    y = np.stack([l, r], 1) * 1.4
    return np.stack([reverb(y[:, 0], 0.8, 0.2), reverb(y[:, 1], 0.8, 0.2)], 1)


def swipe():
    return whoosh(0.32, 1200, 7000)


def riser(d=1.6):
    """Montée tendue (bruit qui s'ouvre + glissando) qui s'arrête net."""
    tt = t(d)
    n = rng.standard_normal(len(tt))
    x = sweep_filter(n, 300, 9000, width=0.7) * 0.7
    f = 180 * (8 ** (tt / d))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x += (np.sin(ph) + 0.5 * np.sin(2.01 * ph)) * 0.25
    x *= (tt / d) ** 2.2
    return stereo(x, 0.01)


def rev_swell(d=1.0):
    """Cymbale inversée (aspiration avant l'impact)."""
    tt = t(d)
    x = hp(rng.standard_normal(len(tt)), 3000) * env(len(tt), 0.001, d * 0.7, 4)
    x = reverb(x, 0.6, 0.4)[: len(tt)]
    return stereo(x[::-1], 0.008)


def shimmer(d=1.4):
    """Scintillement cristallin (révélation du produit)."""
    tt = t(d)
    x = np.zeros(len(tt))
    notes = [1318.5, 1567.98, 1975.53, 2637.0, 3135.96, 3951.07]
    for i, f in enumerate(notes):
        s = int((0.035 * i + rng.uniform(0, 0.02)) * SR)
        k = len(tt) - s
        tk = np.arange(k) / SR
        x[s:] += (np.sin(2 * np.pi * f * tk) + 0.3 * np.sin(2 * np.pi * f * 2.76 * tk)) * np.exp(-tk * 4.5) * 0.4
    x += hp(rng.standard_normal(len(tt)), 7000) * env(len(tt), 0.05, 0.6, 4) * 0.08
    x = lp(x, 6500, 2)
    return stereo(reverb(x, 1.8, 0.45, 7000), 0.018)


def pop(f0=900):
    """Pop « UI » propre (bulle)."""
    d = 0.16
    tt = t(d)
    f = f0 * (1.6 - 0.6 * np.exp(-tt * 60))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * env(len(tt), 0.001, 0.05, 5)
    x[: 120] += rng.standard_normal(120) * 0.2
    return stereo(reverb(x, 0.3, 0.12), 0.004)


def tick():
    """Tic d'horloge boisé."""
    d = 0.09
    tt = t(d)
    x = bp(rng.standard_normal(len(tt)), 1800, 4200) * env(len(tt), 0.0005, 0.01, 6)
    x += np.sin(2 * np.pi * 2300 * tt) * env(len(tt), 0.0005, 0.02, 6) * 0.4
    return stereo(reverb(x, 0.25, 0.15), 0.002)


def heartbeat():
    """Battement de cœur grave (deux coups)."""
    d = 0.9
    x = np.zeros(int(d * SR))
    for s, a in [(0, 1.0), (0.24, 0.75)]:
        b = sub_boom(0.4, 75, 38) * a
        b[: int(0.03 * SR)] += lp(rng.standard_normal(int(0.03 * SR)), 300) * 0.3 * a
        i = int(s * SR)
        x[i:i + len(b)] += b[: len(x) - i]
    return stereo(np.tanh(x * 1.5), 0)


def hit():
    """Impact court et sec (tampon prix, numéros)."""
    d = 0.7
    x = sub_boom(d, 140, 50) * 0.9
    x[: int(0.08 * SR)] += noise_burst(0.08, 1500, 12000, 0.02) * 1.1
    x[: int(0.05 * SR)] += noise_burst(0.05, 300, 2500, 0.015) * 0.7
    x = np.tanh(x * 1.6)
    return stereo(reverb(x, 0.7, 0.18, 5000), 0.006)


def coin():
    """Ding de pièce / caisse (inharmonique, brillant)."""
    d = 1.2
    tt = t(d)
    x = np.zeros(len(tt))
    for f, a in [(2093, 1), (2093 * 2.41, 0.5), (2093 * 3.9, 0.3), (2637, 0.7)]:
        x += np.sin(2 * np.pi * f * tt) * a * np.exp(-tt * 5)
    x2 = np.zeros_like(x)
    s = int(0.07 * SR)
    x2[s:] = x[:-s] * 0.7
    return stereo(reverb(x + x2, 1.0, 0.3, 10000), 0.01)


def ding():
    """Validation (deux notes montantes)."""
    d = 0.7
    x = np.zeros(int(d * SR))
    for s, f in [(0, 1318.5), (0.09, 1975.5)]:
        i = int(s * SR)
        tk = np.arange(len(x) - i) / SR
        x[i:] += (np.sin(2 * np.pi * f * tk) + 0.25 * np.sin(4 * np.pi * f * tk)) * np.exp(-tk * 7)
    return stereo(reverb(x, 0.8, 0.25), 0.006)


def scribble():
    """Trait de feutre (prix barré)."""
    d = 0.35
    tt = t(d)
    x = bp(rng.standard_normal(len(tt)), 1500, 6000) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * tt) ** 2)
    x *= np.sin(np.pi * tt / d) ** 0.5
    return stereo(x, 0.003)


# ---------------- nappes ----------------

def suspense(d, beats=(), clock=True, dark=True):
    """Nappe de suspense cinéma : drone grave désaccordé + tic d'horloge + battements."""
    tt = t(d)
    x = np.zeros(len(tt))
    for f in [36.7, 36.95, 55.0, 73.4, 77.8]:  # ré grave + seconde mineure (tension)
        x += np.sin(2 * np.pi * f * tt + rng.uniform(0, 6))
    x += lp(rng.standard_normal(len(tt)), 400) * 0.6
    x *= 0.25 * (0.6 + 0.4 * tt / d)
    hi = np.sin(2 * np.pi * 1174.7 * tt) * 0.03 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.3 * tt))
    x = x + hi
    y = stereo(reverb(x, 2.5, 0.35, 2500)[: len(tt)], 0.02)
    if clock:
        tk = tick()
        for k in np.arange(0, d - 0.1, 0.5):
            i = int(k * SR)
            y[i:i + len(tk)] += tk[: len(y) - i] * (0.35 if int(k * 2) % 2 else 0.5)
    hb = heartbeat()
    for s in beats:
        i = int(s * SR)
        y[i:i + len(hb)] += hb[: len(y) - i] * 0.9
    fade = int(0.25 * SR)
    y[:fade] *= np.linspace(0, 1, fade)[:, None]
    return y


# ---------------- musique ----------------

def beat(bpm=104, bars=26):
    """Boucle type Reels / TikTok (trap-pop moderne) : kick, clap, charleston (roulements), 808, accords pluck."""
    spb = 60 / bpm
    step = spb / 4
    n = int(bars * 16 * step * SR) + SR * 2
    L = np.zeros(n)
    R = np.zeros(n)

    def add(sig, at, g=1.0, pan=0.0):
        i = int(at * SR)
        if i >= n:
            return
        k = min(len(sig), n - i)
        L[i:i + k] += sig[:k] * g * np.sqrt((1 - pan) / 2) * 1.414
        R[i:i + k] += sig[:k] * g * np.sqrt((1 + pan) / 2) * 1.414

    kick = sub_boom(0.45, 160, 45)
    kick[:200] += rng.standard_normal(200) * 0.4
    kick = np.tanh(kick * 2)
    clap = np.zeros(int(0.3 * SR))
    for o in [0, 0.008, 0.017]:
        i = int(o * SR)
        b = bp(rng.standard_normal(int(0.25 * SR)), 900, 5000) * env(int(0.25 * SR), 0.0005, 0.06, 5)
        clap[i:i + len(b)] += b[: len(clap) - i]
    clap = reverb(clap, 0.6, 0.25)
    hat = hp(rng.standard_normal(int(0.05 * SR)), 8000) * env(int(0.05 * SR), 0.0005, 0.015, 5)
    ohat = hp(rng.standard_normal(int(0.25 * SR)), 7000) * env(int(0.25 * SR), 0.001, 0.12, 4)

    # la mineur : Am  F  C  G  (fondamentales 808)
    prog = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [55, 60, 64]), (55, [55, 59, 62])]
    mtof = lambda m: 440 * 2 ** ((m - 69) / 12)

    def pluck(m, d=0.5):
        tt = t(d)
        f = mtof(m)
        s = sum(np.sin(2 * np.pi * f * h * tt) / h ** 1.3 for h in range(1, 7))
        s = s * np.exp(-tt * 7)
        return lp(s, 3500, 2)

    def bass808(m, d):
        tt = t(d)
        f = mtof(m - 24)
        f_t = f * (1 + 0.5 * np.exp(-tt * 40))
        s = np.sin(2 * np.pi * np.cumsum(f_t) / SR)
        sub = np.sin(2 * np.pi * f * tt)
        return (np.tanh(s * 1.3) * 0.6 + sub * 0.7) * env(len(tt), 0.003, d, 1.2)

    pluck_rhythm = [0, 3, 6, 8, 10, 12, 14]
    for bar in range(bars):
        t0 = bar * 16 * step
        root, chord = prog[bar % 4]
        intro = bar < 1
        # kick : 1, (et du 2), 3 + variations
        for s in ([0, 7, 10] if bar % 2 == 0 else [0, 7, 10, 14]):
            if not intro:
                add(kick, t0 + s * step, 0.9)
        # clap sur 2 et 4
        for s in [4, 12]:
            if not intro:
                add(clap, t0 + s * step, 0.5, 0.05)
        # charleston 1/8 + roulements en fin de mesure
        for s in range(0, 16, 2):
            add(hat, t0 + s * step, 0.22 if s % 4 else 0.3, 0.3)
        if bar % 2 == 1:
            for k in range(6):
                add(hat, t0 + (12 + k * 0.666) * step, 0.18, 0.3)
        add(ohat, t0 + 14 * step, 0.12, -0.3)
        # 808
        if not intro:
            add(bass808(root, 6 * step), t0, 0.55)
            add(bass808(root, 4 * step), t0 + 10 * step, 0.45)
        # accords pluck (arpège)
        for j, s in enumerate(pluck_rhythm):
            m = chord[j % 3] + 12
            add(pluck(m), t0 + s * step, 0.16, -0.4 + 0.8 * (j % 2))
        # nappe douce
        tt = t(16 * step)
        pad = sum(np.sin(2 * np.pi * mtof(c) * tt) + 0.5 * np.sin(2 * np.pi * mtof(c) * 1.003 * tt) for c in chord)
        pad = lp(pad, 1200) * np.minimum(1, np.minimum(tt / 0.3, (16 * step - tt) / 0.3)) * 0.035
        add(pad, t0, 1.0)
    y = np.stack([L, R], 1)
    y = np.stack([reverb(y[:, 0], 1.2, 0.12, 7000)[:n], reverb(y[:, 1], 1.2, 0.12, 7000)[:n]], 1)
    return np.tanh(y * 1.2)


if __name__ == '__main__':
    S = OUT / 'sfx'
    save(S / 'impact.wav', impact())
    save(S / 'braam.wav', braam())
    save(S / 'whoosh.wav', whoosh())
    save(S / 'swipe.wav', swipe())
    save(S / 'riser.wav', riser(), 0.7)
    save(S / 'rev_swell.wav', rev_swell(), 0.7)
    save(S / 'shimmer.wav', shimmer(), 0.6)
    for i, f in enumerate([700, 820, 950, 1100, 1300]):
        save(S / f'pop{i + 1}.wav', pop(f), 0.6)
    save(S / 'tick.wav', tick(), 0.6)
    save(S / 'heartbeat.wav', heartbeat())
    save(S / 'hit.wav', hit())
    save(S / 'coin.wav', coin(), 0.6)
    save(S / 'ding.wav', ding(), 0.6)
    save(S / 'scribble.wav', scribble(), 0.5)
    save(OUT / 'suspense8_hook.wav', suspense(3.2, beats=(0.1, 0.95)), 0.8)
    save(OUT / 'suspense8_numeros.wav', suspense(5.2, beats=(0.0, 1.6, 3.2), clock=True), 0.75)
    save(OUT / 'beat8.wav', beat(), 0.85)
