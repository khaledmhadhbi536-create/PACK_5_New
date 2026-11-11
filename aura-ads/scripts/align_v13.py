"""V13 (concepts problème / contradiction) : mesure le minutage de chaque pub sur sa prise de voix unique (faster-whisper, mots horodatés).

Usage : python3 align_v12.py <dossier des wav> <sortie.ts>
Chaque wav (V01_h1.wav …) est une seule prise : accroche + amorce (problème ou contradiction) + produits + « باك فعّال… » + offre + appel.
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
    'C2_h1': [['مخده', 'مخدق', 'مخدة', 'مخدا']], 'C2_h2': [['والشعر'], ['يخفاف', 'يخفيف']], 'C2_h3': [['الدوش'], ['مخده', 'مخدق'], ['يطيح']],
    'C3_h1': [['عشره'], ['مازال', 'زال']], 'C3_h2': [['جلده']], 'C3_h3': [['السدر', 'الصدر']],
}
FIRST = {'C2': ['وكل'], 'C3': ['الشامبو', 'الشومبو', 'شامبو']}
LEAD = {'C2': [['الحل'], ['بروتين', 'بروتيين'], ['باك', 'pack']], 'C3': [['اما'], ['كي', 'كيتكون'], ['وهذا'], ['باك', 'pack']]}
PRODS = [
    ('prod', ['السدر', 'سدر', 'صدر', 'السدل', 'الصدر']), ('tag', ['ينظفلك', 'ينظف', 'ينحي']), ('tag', ['ينحيلك', 'ينحي']), ('tag', ['يقوي', 'يقوى', 'يقول']), ('tag', ['ويعطي', 'يعطي']),
    ('prod', ['زيت', 'زيتك', 'زيد']), ('head', ['حسب']), ('tag', ['يعاون']), ('tag', ['يقوي', 'يقوى', 'يقول']), ('tag', ['ينحي', 'يناحي']), ('tag', ['ويخلي', 'يخلي']),
    ('prod', ['الديرما', 'درما', 'الدرما', 'ديرما']), ('head', ['نستعملوه', 'نستعمله']), ('tag', ['يعاون']), ('tag', ['وينشط', 'ينشط']),
    ('prod', ['وبروس', 'بروس', 'وبراس']), ('tag', ['ينشط', 'ينشيط']), ('tag', ['يفرق']), ('tag', ['وينظف', 'ينظف']),
]
EXTRA = [('ex', ['باك', 'فعال', 'pak']), ('ex', ['والاهم']), ('ex', ['صالح']), ('ex', ['وطريقه', 'طريقه']), ('ex', ['ساهله', 'سهله'])]
OFFER = [('start', ['الكل', 'الكله']), ('price', ['39', 'ب39', 'بتسعه']), ('strike', ['عوض', 'عيوض', '64', 'وستين']), ('deliv', ['والتوصيل', 'وتوصيل']), ('cod', ['وتخلص', 'تخلص']), ('cta', ['انزل', 'ونزل'])]


def find(words, cands, i0, ahead=None):
    cn = [norm(c) for c in cands]
    for i in range(i0, len(words) if ahead is None else min(len(words), i0 + ahead)):
        w = norm(words[i][1])
        if any(sim(w, c) >= 0.75 for c in cn):
            return i
    raise ValueError(f'introuvable : {cands} après le mot {i0}')


def main():
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    model = WhisperModel('medium', device='cpu', compute_type='int8')
    res = {}
    for wav in sorted(src.glob('C*_h*.wav')):
        name = wav.stem
        concept = name[:2]
        pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(wav), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout
        a = np.frombuffer(pcm, np.float32)
        segs, _ = model.transcribe(a, language='ar', word_timestamps=True)
        words = [(w.start, w.word.strip(), w.end) for s in segs for w in s.words]
        fr = lambda i: round(words[i][0] * FPS)
        i = 0
        hk = []
        for cands in HOOK_KEYS[name]:
            i = find(words, cands, i)
            hk.append(fr(i))
            i += 1
        i = find(words, FIRST[concept], i)
        hook = fr(i)
        rel = lambda j: fr(j) - hook
        i += 1
        lead = []
        for cands in LEAD[concept]:
            i = find(words, cands, i)
            lead.append(rel(i))
            i += 1
        prods, tags, heads, cur = [], [], [None, None, None, None], -1
        for kind, cands in PRODS:
            # mot raté par la transcription : on l'estime juste après le mot précédent
            try:
                j = find(words, cands, i, ahead=14 if kind == 'prod' else 7)
                t = rel(j)
                i = j + 1
            except ValueError:
                t = round(words[i - 1][2] * FPS) + 3 - hook
                print(f'  {name} : {cands[0]} estimé à {t}', flush=True)
            if kind == 'prod':
                cur += 1
                prods.append(t)
                tags.append([])
            elif kind == 'head':
                heads[cur] = t
            else:
                tags[cur].append(t)
        ex = []
        for _, cands in EXTRA:
            try:
                j = find(words, cands, i, ahead=7)
                ex.append(rel(j))
                i = j + 1
            except ValueError:
                ex.append(round(words[i - 1][2] * FPS) + 3 - hook)
                print(f'  {name} : {cands[0]} estimé à {ex[-1]}', flush=True)
        offer = {}
        for key, cands in OFFER:
            try:
                i = find(words, cands, i)
            except ValueError:
                # fin de prise mal transcrite : on réécoute la fin seule et on reprend
                t0 = words[i - 1][2] - 0.3
                tail = a[int(t0 * 16000):]
                ts, _ = model.transcribe(tail, language='ar', beam_size=1, temperature=0, word_timestamps=True)
                words = words[:i] + [(w.start + t0, w.word.strip(), w.end + t0) for s2 in ts for w in s2.words]
                i = find(words, cands, i)
            offer[key] = rel(i)
            i += 1
        end = round(len(a) / 16000 * FPS) - hook
        res[name] = dict(hookDur=hook, hk=hk, lead=lead, prods=prods, tags=tags, heads=heads, extra=ex, offer=offer, end=end)
        print(name, json.dumps(res[name], ensure_ascii=False), flush=True)
    out.write_text('// Généré par scripts/align_v13.py : minutage mesuré mot à mot sur chaque prise (images à 30 i/s).\n'
                   '// lead/prods/tags/heads/extra/offer/end sont relatifs à la fin de l\'accroche (hookDur).\n'
                   f'export const TIMINGS = {json.dumps(res, ensure_ascii=False, indent=1)} as const;\n')


if __name__ == '__main__':
    main()
