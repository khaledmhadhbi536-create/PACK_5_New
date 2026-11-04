"""V12 : mesure le minutage de chaque pub sur sa prise de voix unique (faster-whisper, mots horodatés).

Usage : python3 align_v12.py <dossier des wav> <sortie.ts>
Chaque wav (V01_h1.wav …) est une seule prise : accroche + produits + « باك فعّال… » + offre + appel.
On cherche dans l'ordre les mots repères ci-dessous (comparaison approchée : la transcription derja
n'est pas exacte) et on écrit les images (30 i/s) dans un fichier TypeScript lu par Ads12.tsx.
"""
import json, re, subprocess, sys
from difflib import SequenceMatcher
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

FPS = 30


def norm(w: str) -> str:
    w = re.sub(r'[ً-ْـ]', '', w)  # harakat, tatwil
    w = re.sub('[أإآ]', 'ا', w).replace('ة', 'ه').replace('ى', 'ي')
    return re.sub(r'[^\w%]', '', w).lower()


def sim(a: str, b: str) -> float:
    if not a or not b:
        return 0
    if b in a or (a in b and len(a) >= 3):
        return 1
    return SequenceMatcher(None, a, b).ratio()


HOOK_KEYS = {
    'stop': [['بالقطعه']],
    'diff': [['بالقطعه'], ['الباك', 'باك']],
    'four': [['باقل', 'اقل']],
    'ask': [['يسوي', 'يسوى', 'يوسف', 'يسوا']],
    'drop': [],
    'before': [['اي', 'حاجه'], ['شوف']],
    'unbox': [['شوف', 'شوفيش']],
    'box4': [['كرتونه', 'كرتونا']],
    'deliver': [['بتسعه', '39', 'ب39']],
}
FIRST = {'V01': ['باك', 'pak'], 'V03': ['اربعه', 'اربع'], 'V05': ['السدر', 'سدر', 'السدل', 'صدر']}
PRODS = [
    ('prod', ['السدر', 'سدر', 'صدر', 'السدل']), ('tag', ['ينظفلك', 'ينظف', 'ينحي']), ('tag', ['ينحيلك', 'ينحي']), ('tag', ['يقوي', 'يقوى', 'يقول']), ('tag', ['ويعطي', 'يعطي']),
    ('prod', ['زيت', 'زيتك', 'زيد']), ('head', ['حسب']), ('tag', ['يعاون']), ('tag', ['يقوي', 'يقوى', 'يقول']), ('tag', ['ينحي', 'يناحي']), ('tag', ['ويخلي', 'يخلي']),
    ('prod', ['الديرما', 'درما', 'الدرما', 'ديرما']), ('head', ['نستعملوه', 'نستعمله']), ('tag', ['يعاون']), ('tag', ['وينشط', 'ينشط']),
    ('prod', ['وبروس', 'بروس', 'وبراس']), ('tag', ['ينشط', 'ينشيط']), ('tag', ['يفرق']), ('tag', ['وينظف', 'ينظف']),
]
EXTRA = [('ex', ['باك', 'فعال', 'pak']), ('ex', ['والاهم']), ('ex', ['صالح']), ('ex', ['وطريقه', 'طريقه']), ('ex', ['ساهله', 'سهله'])]
OFFER = {
    'V01': [('start', ['الكل']), ('price', ['39', 'ب39', 'بتسعه']), ('strike', ['عوض', 'عيوض', '64', 'وستين']), ('deliv', ['والتوصيل']), ('cod', ['وتخلص', 'تخلص']), ('cta', ['انزل', 'ونزل'])],
    'V03': [('start', ['بالقطعه']), ('strike', ['64', 'وستين', 'يجيو']), ('bridge', ['اما']), ('price', ['39', 'تسعه', 'ب39']), ('deliv', ['والتوصيل']), ('cod', ['وتخلص', 'تخلص']), ('cta', ['انزل', 'ونزل'])],
}
OFFER['V05'] = OFFER['V01']
HOOK_OF = {'V01_h1': 'stop', 'V01_h2': 'diff', 'V01_h3': 'four', 'V03_h1': 'ask', 'V03_h2': 'drop', 'V03_h3': 'before', 'V05_h1': 'unbox', 'V05_h2': 'box4', 'V05_h3': 'deliver'}


def find(words, cands, i0):
    cn = [norm(c) for c in cands]
    for i in range(i0, len(words)):
        w = norm(words[i][1])
        if any(sim(w, c) >= 0.75 for c in cn):
            return i
    raise ValueError(f'introuvable : {cands} après le mot {i0}')


def main():
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    model = WhisperModel('medium', device='cpu', compute_type='int8')
    res = {}
    for wav in sorted(src.glob('V0*_h*.wav')):
        name = wav.stem
        concept = name[:3]
        pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(wav), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout
        a = np.frombuffer(pcm, np.float32)
        segs, _ = model.transcribe(a, language='ar', word_timestamps=True)
        words = [(w.start, w.word.strip()) for s in segs for w in s.words]
        fr = lambda i: round(words[i][0] * FPS)
        i = 0
        hk = []
        for cands in HOOK_KEYS[HOOK_OF[name]]:
            i = find(words, cands, i)
            hk.append(fr(i))
            i += 1
        i = find(words, FIRST[concept], i)
        hook = fr(i)
        body0 = i
        rel = lambda j: fr(j) - hook
        intro = None
        if concept in ('V01', 'V03'):
            intro = 0
            i += 1
        prods, tags, heads, cur = [], [], [None, None, None, None], -1
        for kind, cands in PRODS:
            i = find(words, cands, i)
            if kind == 'prod':
                cur += 1
                prods.append(rel(i))
                tags.append([])
            elif kind == 'head':
                heads[cur] = rel(i)
            else:
                tags[cur].append(rel(i))
            i += 1
        ex = []
        for _, cands in EXTRA:
            i = find(words, cands, i)
            ex.append(rel(i))
            i += 1
        offer = {}
        for key, cands in OFFER[concept]:
            i = find(words, cands, i)
            offer[key] = rel(i)
            i += 1
        end = round(len(a) / 16000 * FPS) - hook
        res[name] = dict(hookDur=hook, hk=hk, intro=intro, prods=prods, tags=tags, heads=heads, extra=ex, offer=offer, end=end)
        print(name, json.dumps(res[name], ensure_ascii=False), flush=True)
    out.write_text('// Généré par scripts/align_v12.py : minutage mesuré mot à mot sur chaque prise (images à 30 i/s).\n'
                   '// prods/tags/heads/extra/offer/end sont relatifs à la fin de l\'accroche (hookDur).\n'
                   f'export const TIMINGS = {json.dumps(res, ensure_ascii=False, indent=1)} as const;\n')


if __name__ == '__main__':
    main()
