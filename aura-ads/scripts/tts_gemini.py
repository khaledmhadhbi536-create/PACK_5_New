"""
Voix off V6 en derja tunisienne avec Gemini TTS.

    python scripts/tts_gemini.py              # toutes les pistes de scripts/voice_v6.json
    python scripts/tts_gemini.py L01 V03      # seulement ces enregistrements
    python scripts/tts_gemini.py --force      # réenregistre même si le cache existe
    python scripts/tts_gemini.py --assemble   # refait seulement les pistes à partir du cache

Principe (quota gratuit Gemini : ~10 requêtes TTS par jour et par modèle) :
  1. UNE requête par enregistrement : toutes les phrases d'une vidéo sont lues d'un coup,
     une par ligne, avec une pause nette entre elles. Pour V01/V03/V05, les 3 accroches
     et la suite sont dans le même enregistrement (même voix, même ton : test A/B propre).
  2. Découpage sur les pauses → public/voice/v6/seg/<enregistrement>_<n>.wav
  3. Chaque phrase est posée à son `at` (accélérée si elle dépasse `max`, jamais > x1.25)
     → public/voice/v6/<piste>.wav, de la durée exacte de la vidéo.

La consigne de style passe dans les « notes de réalisation » du prompt : le modèle ne lit
que la partie TRANSCRIPT. Modèles essayés dans l'ordre de voice_v6.json (« models ») :
si le quota du premier est épuisé (HTTP 429), on passe au suivant.
Clé : GEMINI_API_KEY (en-tête x-goog-api-key) si elle est définie.
"""
import array
import base64
import json
import math
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / 'scripts' / 'voice_v6.json').read_text(encoding='utf-8'))
OUT = ROOT / 'public' / 'voice' / 'v6'
SEG = OUT / 'seg'
RATE = 24000  # Gemini TTS : PCM 16 bits mono 24 kHz
MAX_SPEED = 1.25


def ph(t: str) -> str:
    return t.replace('{phone}', CFG['phone'])


def recordings():
    """{enregistrement: {style, lines: [{id, text}]}} : ce qu'on demande à Gemini."""
    rec = {}
    for key, t in CFG['tracks'].items():
        if 'base' in t:
            r = rec.setdefault(t['base'], {'style': CFG['style'], 'lines': []})
            r['lines'].insert(sum(1 for l in r['lines'] if l['id'].startswith(t['base'] + '_h')), {'id': f'{key}', 'text': ph(t['hook'])})
        else:
            rec[key] = {'style': t.get('style', CFG['style']), 'lines': [{'id': f'{key}_{i:02d}', 'text': ph(s['text'])} for i, s in enumerate(t['segments'])]}
    for base, segs in CFG['bases'].items():
        if base.startswith('_'):
            continue
        rec[base]['lines'] += [{'id': f'{base}_suite_{i:02d}', 'text': ph(s['text'])} for i, s in enumerate(segs)]
    return rec


def tracks():
    """{piste: {total, segments: [{at, max, id}]}} : comment on pose les phrases."""
    out = {}
    for key, t in CFG['tracks'].items():
        if 'base' in t:
            segs = [{'at': 0.05, 'max': 1.9, 'id': key}]
            segs += [{**b, 'id': f"{t['base']}_suite_{i:02d}"} for i, b in enumerate(CFG['bases'][t['base']])]
        else:
            segs = [{**s, 'id': f'{key}_{i:02d}'} for i, s in enumerate(t['segments'])]
        out[key] = {'total': t['total'], 'segments': segs}
    return out


def prompt(style: str, lines: list[str]) -> str:
    return (
        "### DIRECTOR'S NOTES\n"
        f'Style: {style}\n'
        'Langue : arabe tunisien (derja), prononciation tunisienne naturelle, pas d\'arabe littéraire.\n'
        'Rythme de pub : soutenu et énergique, sans traîner à l\'intérieur d\'une phrase.\n'
        'Chaque ligne du TRANSCRIPT est une phrase séparée : marque une pause nette d\'une seconde entre deux lignes.\n'
        'Ne lis jamais ces notes : lis uniquement le TRANSCRIPT, sans rien ajouter.\n\n'
        '### TRANSCRIPT\n' + '\n'.join(lines)
    )


class Quota(Exception):
    pass


def tts(model: str, text: str) -> bytes:
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?alt=sse'
    body = {
        'contents': [{'parts': [{'text': text}]}],
        'generationConfig': {
            'responseModalities': ['AUDIO'],
            'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': CFG['voiceName']}}},
        },
    }
    headers = {'Content-Type': 'application/json'}
    if os.environ.get('GEMINI_API_KEY'):
        headers['x-goog-api-key'] = os.environ['GEMINI_API_KEY']
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers, method='POST')
    pcm = b''
    try:
        with urllib.request.urlopen(req, timeout=900) as r:
            for raw in r:
                line = raw.decode('utf-8').strip()
                if not line.startswith('data:'):
                    continue
                for c in json.loads(line[5:]).get('candidates', []):
                    for p in c.get('content', {}).get('parts', []):
                        if 'inlineData' in p:
                            pcm += base64.b64decode(p['inlineData']['data'])
    except urllib.error.HTTPError as e:
        msg = e.read().decode('utf-8', 'ignore')
        if e.code == 429 and ('per day' in msg.lower() or 'perday' in msg.lower()):
            raise Quota(model)
        raise RuntimeError(f'HTTP {e.code} : {msg[:300]}')
    if not pcm:
        raise RuntimeError('réponse sans audio')
    return pcm


def ff(*args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *args], check=True)


def dur(p: Path) -> float:
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)], capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def silences(wav: Path, noise='-40dB', d=0.25):
    r = subprocess.run(['ffmpeg', '-i', str(wav), '-af', f'silencedetect=n={noise}:d={d}', '-f', 'null', '-'], capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r.stderr)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r.stderr)]
    return list(zip(starts, ends))


def weight(text: str) -> float:
    """Durée relative attendue d'une phrase : lettres + petites pauses de ponctuation."""
    letters = sum(1 for ch in text if ch.isalpha())
    return letters + 4 * sum(1 for ch in text if ch in '،,.!?؟:…')


ALIGN_MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3-flash-preview', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.1-flash-lite-preview', 'gemini-flash-lite-latest']


def norm(t: str) -> str:
    """Texte arabe simplifié pour comparer script et transcription."""
    t = re.sub('[\u064B-\u0652\u0640]', '', t)  # voyelles, tatweel
    for a, b in (('أ', 'ا'), ('إ', 'ا'), ('آ', 'ا'), ('ة', 'ه'), ('ى', 'ي'), ('ؤ', 'و'), ('ئ', 'ي')):
        t = t.replace(a, b)
    return ''.join(ch for ch in t if ch.isalpha())


def sim(a: str, b: str) -> float:
    """Similarité (Dice sur les paires de lettres)."""
    a, b = norm(a), norm(b)
    if len(a) < 2 or len(b) < 2:
        return 0.0
    pa = [a[i : i + 2] for i in range(len(a) - 1)]
    pb = [b[i : i + 2] for i in range(len(b) - 1)]
    rest = list(pb)
    hit = 0
    for x in pa:
        if x in rest:
            rest.remove(x)
            hit += 1
    return 2 * hit / (len(pa) + len(pb))


def gemini_text(parts: list, what: str) -> dict:
    """Appel d'un modèle texte Gemini (réponse JSON, en streaming), avec modèles de repli."""
    body = {'contents': [{'parts': parts}], 'generationConfig': {'responseMimeType': 'application/json'}}
    headers = {'Content-Type': 'application/json'}
    if os.environ.get('GEMINI_API_KEY'):
        headers['x-goog-api-key'] = os.environ['GEMINI_API_KEY']
    for attempt in range(4 * len(ALIGN_MODELS)):
        model = ALIGN_MODELS[attempt % len(ALIGN_MODELS)]
        try:
            url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?alt=sse'
            req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers)
            txt = ''
            with urllib.request.urlopen(req, timeout=600) as r:
                for raw in r:
                    line = raw.decode('utf-8').strip()
                    if line.startswith('data:'):
                        for c in json.loads(line[5:]).get('candidates', []):
                            for p in c.get('content', {}).get('parts', []):
                                if not p.get('thought'):
                                    txt += p.get('text', '')
            return json.loads(txt)
        except Exception as e:
            print(f'  ! {what} ({model}), essai {attempt + 1} : {e}', flush=True)
            time.sleep(8 if attempt < len(ALIGN_MODELS) else 45)
    raise RuntimeError(f'{what} impossible')


def align(wav: Path, texts: list[str], log: Path | None = None):
    """
    Découpe l'enregistrement à ses pauses (>= 0,2 s), fait transcrire chaque morceau par
    Gemini, puis répartit les morceaux consécutifs entre les lignes du script en maximisant
    la ressemblance des textes (programmation dynamique, ordre respecté).
    Renvoie les bornes (en secondes) des N phrases, ou None.
    """
    total = dur(wav)
    sil = [(a, b) for a, b in silences(wav, '-40dB', 0.2) if a > 0.15 and b < total - 0.15]
    cuts = [0.0] + [(a + b) / 2 for a, b in sil] + [total]
    m, n = len(cuts) - 1, len(texts)
    if m < n:
        return None
    cache = wav.with_name(wav.stem + '_transcription.json')
    key = [round(c, 3) for c in cuts]
    tr = None
    if cache.exists():
        c = json.loads(cache.read_text(encoding='utf-8'))
        if c.get('cuts') == key:
            tr = c['textes']
    pcm = read_pcm(wav)
    parts = []
    for k in range(m if tr is None else 0):
        tmp = SEG / f'_chunk_{k:03d}.wav'
        write_pcm(tmp, pcm[int(cuts[k] * RATE) : int(cuts[k + 1] * RATE)])
        parts.append({'text': f'Morceau {k + 1} :'})
        parts.append({'inlineData': {'mimeType': 'audio/wav', 'data': base64.b64encode(tmp.read_bytes()).decode()}})
        tmp.unlink()
    parts.append({'text': (
        f'Transcris séparément chacun des {m} morceaux audio ci-dessus (arabe tunisien), mot à mot, en écriture arabe, '
        'nombres écrits en toutes lettres. Chaque morceau est court (quelques mots) : ne fusionne jamais '
        'deux morceaux, ne mets pas le texte d\'un morceau dans un autre. '
        f'Réponds en JSON : {{"morceaux": [{{"n": 1, "texte": "..."}}, ..., {{"n": {m}, "texte": "..."}}]}}'
    )})
    for attempt in range(3):
        if tr is not None:
            break
        try:
            got = gemini_text(parts, 'transcription')['morceaux']
            by_n = {int(x['n']): str(x.get('texte', '')) for x in got}
            cand = [by_n.get(k + 1, '') for k in range(m)]
            # contrôle : chaque morceau transcrit, aucun morceau démesuré
            empty = sum(1 for t in cand if not norm(t))
            longest = max(len(norm(t)) for t in cand)
            if empty > m // 5 or longest > 3 * len(norm(' '.join(cand))) / m + 40:
                print(f'  ! transcription incohérente ({empty} vides), on recommence', flush=True)
                continue
            tr = cand
        except Exception as e:
            print(f'  ! {e}', flush=True)
            return None
    if tr is None:
        return None
    if not cache.exists() or json.loads(cache.read_text(encoding='utf-8')).get('cuts') != key:
        cache.write_text(json.dumps({'cuts': key, 'textes': tr}, ensure_ascii=False, indent=1), encoding='utf-8')
    tr = (tr + [''] * m)[:m]
    # dp[k][i] : meilleur score avec les k premiers morceaux répartis sur les i premières lignes
    NEG = -1e9
    dp = [[NEG] * (n + 1) for _ in range(m + 1)]
    back = [[0] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = 0.0
    for k in range(1, m + 1):
        for i in range(1, n + 1):
            for j in range(i - 1, k):  # la ligne i reçoit les morceaux j..k-1
                if dp[j][i - 1] <= NEG:
                    continue
                v = dp[j][i - 1] + sim(' '.join(tr[j:k]), texts[i - 1])
                if v > dp[k][i]:
                    dp[k][i], back[k][i] = v, j
    if dp[m][n] <= NEG:
        return None
    starts, k = [], m
    for i in range(n, 0, -1):
        j = back[k][i]
        starts.append(j)
        k = j
    starts.reverse()
    scores = []
    for i in range(n):
        j0, j1 = starts[i], (starts[i + 1] if i + 1 < n else m)
        scores.append(sim(' '.join(tr[j0:j1]), texts[i]))
    weak = [f'{i + 1}:{sc:.2f}' for i, sc in enumerate(scores) if sc < 0.45]
    if log:
        detail = []
        for i in range(n):
            j0, j1 = starts[i], (starts[i + 1] if i + 1 < n else m)
            detail.append({'ligne': texts[i], 'entendu': ' | '.join(tr[j0:j1]), 'debut': round(cuts[j0], 2), 'fin': round(cuts[j1], 2), 'ressemblance': round(scores[i], 2)})
        log.write_text(json.dumps(detail, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'  alignement : {m} morceaux, ressemblance moyenne {sum(scores) / n:.2f}' + (f' (faibles : {" ".join(weak)})' if weak else ''), flush=True)
    return [cuts[j] for j in starts] + [total]


def split(name: str, wav: Path, ids: list[str], texts: list[str]):
    """
    Coupe l'enregistrement en N phrases. On choisit N-1 pauses parmi toutes celles
    détectées, en équilibrant deux critères (programmation dynamique) :
      - chaque morceau doit avoir une durée proche de celle attendue pour son texte ;
      - on préfère couper sur les pauses longues (celles demandées entre deux lignes).
    """
    bounds = align(wav, texts, SEG / f'_{name}_alignement.json')
    if bounds:
        cut_and_save(wav, ids, bounds)
        return
    print('  alignement indisponible : découpage sur les durées attendues', flush=True)
    total = dur(wav)
    n = len(ids)
    sil = [(a, b) for a, b in silences(wav, '-40dB', 0.15) if a > 0.15 and b < total - 0.15]
    if len(sil) < n - 1:
        raise RuntimeError(f'{name} : {len(sil)} pauses trouvées pour {n} phrases')
    w = [weight(t) for t in texts]
    exp = [total * x / sum(w) for x in w]
    cand = [((a + b) / 2, b - a) for a, b in sil]
    m = len(cand)
    INF = float('inf')

    def seg_cost(d, e):
        return math.log(max(d, 0.05) / e) ** 2

    def cut_cost(length):
        return 0.15 / max(length, 0.05)

    # dp[k][j] : meilleur coût avec k+1 coupes, la dernière sur le candidat j
    dp = [[INF] * m for _ in range(n - 1)]
    back = [[-1] * m for _ in range(n - 1)]
    for j in range(m):
        dp[0][j] = seg_cost(cand[j][0], exp[0]) + cut_cost(cand[j][1])
    for k in range(1, n - 1):
        for j in range(k, m):
            best, arg = INF, -1
            for i in range(k - 1, j):
                if dp[k - 1][i] == INF:
                    continue
                c = dp[k - 1][i] + seg_cost(cand[j][0] - cand[i][0], exp[k])
                if c < best:
                    best, arg = c, i
            if arg >= 0:
                dp[k][j] = best + cut_cost(cand[j][1])
                back[k][j] = arg
    if n == 1:
        cuts = []
    else:
        last = min(range(m), key=lambda j: dp[n - 2][j] + seg_cost(total - cand[j][0], exp[n - 1]))
        cuts = [last]
        for k in range(n - 2, 0, -1):
            cuts.append(back[k][cuts[-1]])
        cuts.reverse()
    bounds = [0.0] + [cand[j][0] for j in cuts] + [total]
    cut_and_save(wav, ids, bounds)


def cut_and_save(wav: Path, ids: list[str], bounds: list[float]):
    pcm = read_pcm(wav)
    for i, sid in enumerate(ids):
        out = SEG / f'{sid}.wav'
        part = pcm[int(bounds[i] * RATE) : int(bounds[i + 1] * RATE)]
        write_pcm(out, tighten(part))
        print(f'    {sid}: {dur(out):.2f} s', flush=True)


def read_pcm(wav: Path) -> array.array:
    with wave.open(str(wav), 'rb') as w:
        a = array.array('h', w.readframes(w.getnframes()))
    return a


def write_pcm(path: Path, a: array.array):
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(a.tobytes())


def tighten(a: array.array, thr_db=-42.0, keep=0.18, edge=0.03) -> array.array:
    """Enlève le silence en tête/queue (garde `edge` s) et ramène chaque pause interne à `keep` s."""
    win = int(0.02 * RATE)
    thr = 32768 * 10 ** (thr_db / 20)
    loud = []
    for k in range(0, len(a), win):
        chunk = a[k : k + win]
        rms = (sum(x * x for x in chunk) / max(1, len(chunk))) ** 0.5
        loud.append(rms > thr)
    if not any(loud):
        return a
    first = loud.index(True)
    last = len(loud) - 1 - loud[::-1].index(True)
    out = array.array('h')
    out.extend(a[max(0, first * win - int(edge * RATE)) : first * win])
    k = first
    keep_w = int(keep / 0.02)
    while k <= last:
        if loud[k]:
            out.extend(a[k * win : (k + 1) * win])
            k += 1
            continue
        j = k
        while j <= last and not loud[j]:
            j += 1
        n = j - k  # longueur de la pause (en fenêtres)
        if n <= keep_w:
            out.extend(a[k * win : j * win])
        else:  # garde le début et la fin de la pause (fondu naturel)
            h = keep_w // 2
            out.extend(a[k * win : (k + h) * win])
            out.extend(a[(j - (keep_w - h)) * win : j * win])
        k = j
    out.extend(a[(last + 1) * win : (last + 1) * win + int(edge * RATE)])
    return out


def record(name: str, r: dict, force: bool):
    wav = SEG / f'_{name}_full.wav'
    meta = SEG / f'_{name}_full.json'
    lines = [l['text'] for l in r['lines']]
    p = prompt(r['style'], lines)
    if wav.exists() and meta.exists() and not force and json.loads(meta.read_text(encoding='utf-8')).get('prompt') == p:
        print(f'{name} : en cache', flush=True)
    else:
        pcm = None
        for model in CFG['models']:
            for attempt in range(3):
                try:
                    print(f'{name} : {len(lines)} phrases → {model}…', flush=True)
                    t0 = time.time()
                    pcm = tts(model, p)
                    break
                except Quota:
                    print(f'  quota du jour épuisé pour {model}, modèle suivant', flush=True)
                    break
                except Exception as e:  # réseau, limite par minute : on attend et on réessaie
                    print(f'  ! essai {attempt + 1} : {e}', flush=True)
                    time.sleep(30 * (attempt + 1))
            if pcm:
                break
        if not pcm:
            raise RuntimeError('quota épuisé sur tous les modèles : relancer demain (cache conservé)')
        raw = SEG / f'_{name}.pcm'
        raw.write_bytes(pcm)
        ff('-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', str(raw), str(wav))
        raw.unlink()
        meta.write_text(json.dumps({'model': model, 'voice': CFG['voiceName'], 'prompt': p, 'lines': r['lines']}, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f'  reçu {dur(wav):.1f} s en {time.time() - t0:.0f} s', flush=True)
    split(name, wav, [l['id'] for l in r['lines']], [l['text'] for l in r['lines']])


def assemble(key: str, t: dict):
    """Pose chaque phrase à son `at` sur une piste de la durée de la vidéo."""
    inputs, filters, labels, report = [], [], [], []
    free = -1.0  # fin de la phrase précédente
    segs = t['segments']
    for i, s in enumerate(segs):
        p = SEG / f"{s['id']}.wav"
        d = dur(p)
        start = max(s['at'], free + 0.12)
        # place disponible : jusqu'au départ prévu de la phrase suivante (ou la fin de la vidéo)
        limit = (segs[i + 1]['at'] if i + 1 < len(segs) else t['total'] - 0.25) - start
        limit = max(limit, s['max'] * 0.6)
        speed = max(1.0, d / limit)
        if speed > MAX_SPEED:
            speed = MAX_SPEED
        end = start + d / speed
        if start > s['at'] + 0.05:
            report.append(f'    {s["id"]} décalé de {start - s["at"]:.2f} s')
        if speed > 1.0:
            report.append(f'    {s["id"]} accéléré x{speed:.2f}')
        if i + 1 == len(segs) and end > t['total'] - 0.1:
            report.append(f'    ⚠ {s["id"]} finit à {end:.2f} s pour une vidéo de {t["total"]} s')
        free = end
        inputs += ['-i', str(p)]
        chain = f'[{i}:a]' + (f'atempo={speed:.4f},' if speed > 1.0 else '') + f'adelay={int(start * 1000)}:all=1[s{i}]'
        filters.append(chain)
        labels.append(f'[s{i}]')
    filters.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0:dropout_transition=0,apad,atrim=0:{t['total']},loudnorm=I=-16:TP=-1.5:LRA=11,aresample={RATE}[out]")
    out = OUT / f'{key}.wav'
    ff(*inputs, '-filter_complex', ';'.join(filters), '-map', '[out]', '-ac', '1', '-ar', str(RATE), str(out))
    print(f'piste {out.name} ({dur(out):.2f} s)')
    for r in report:
        print(r)


def main():
    args = sys.argv[1:]
    force = '--force' in args
    only = [a for a in args if not a.startswith('--')]
    SEG.mkdir(parents=True, exist_ok=True)
    if '--assemble' not in args:
        for name, r in recordings().items():
            if not only or name in only:
                record(name, r, force)
    for key, t in tracks().items():
        if not only or key in only or key.split('_h')[0] in only:
            if all((SEG / f"{s['id']}.wav").exists() for s in t['segments']):
                assemble(key, t)
            else:
                print(f'piste {key} : segments manquants')


if __name__ == '__main__':
    main()
