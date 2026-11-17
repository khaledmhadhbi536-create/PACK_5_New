"""Al Mozon : minutage mot à mot de chaque prise (voix derja + français), écrit dans src/mozon/timingsMozon.ts.
Deux passes faster-whisper : en arabe pour le nom « المزون » (fin de l'accroche), en français pour les mots repères."""
import json, re, subprocess, sys, unicodedata
from difflib import SequenceMatcher
from pathlib import Path
import numpy as np
from faster_whisper import WhisperModel

FPS = 30
def norm(w):
    w = unicodedata.normalize('NFKD', w.lower())
    w = ''.join(c for c in w if not unicodedata.combining(c))
    w = re.sub('[أإآ]', 'ا', w)
    return re.sub(r'[^\w]', '', w)
def sim(a, b):
    if not a or not b: return 0
    if b in a or (a in b and len(a) >= 3): return 1
    return SequenceMatcher(None, a, b).ratio()
def find(words, cands, t0, ahead=None):
    cn = [norm(c) for c in cands]
    for st, w, en in words:
        if st < t0: continue
        if ahead is not None and st > t0 + ahead: break
        if any(sim(norm(w), c) >= 0.75 for c in cn): return st, en
    raise ValueError(f'introuvable : {cands} après {t0:.2f}s')

# repères (mot français), dans l'ordre de la voix
KEYS = [('qual', ['formation', 'informations']), ('profs', ['profs', 'prof']), ('groups', ['groupes', 'groupe']),
        ('day1', ['interactifs', 'interactif']), ('cours', ['cours']), ('exam', ['préparation', 'preparation', 'ciblée']), ('acc', ['accompagnement', 'accompagne', 'complet']),
        ('dossier', ['dossier']), ('cv', ['cv']), ('trad', ['traduction']), ('orient', ['orientation']),
        ('test', ['test']), ('remise', ['remise'])]

def main():
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    m = WhisperModel('medium', device='cpu', compute_type='int8')
    res = {}
    for wav in sorted(list(src.glob('M_h*.wav')) + list(src.glob('P*.wav'))):
        a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', str(wav), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout, np.float32)
        ar = [(w.start, w.word.strip(), w.end) for s in m.transcribe(a[:16000 * 14], language='ar', word_timestamps=True)[0] for w in s.words]
        ar_end = [(w.start + len(a) / 16000 - 7, w.word.strip(), w.end + len(a) / 16000 - 7) for s in m.transcribe(a[-16000 * 7:], language='ar', word_timestamps=True)[0] for w in s.words]
        fr = [(w.start, w.word.strip(), w.end) for s in m.transcribe(a, language='fr', word_timestamps=True, condition_on_previous_text=False)[0] for w in s.words]
        # le nom = le mot juste avant « أكاديمي » (évite de confondre « مدن » et « موزون »)
        ac = [i for i, w in enumerate(ar) if sim(norm(w[1]), norm('اكاديمي')) >= 0.75 or 'academ' in norm(w[1])]
        frac = [i for i, w in enumerate(fr) if 'academ' in norm(w[1]) and w[0] > 1.0]
        if ac:
            name = ar[ac[0] - 1][0]
        elif frac:
            name = fr[max(0, frac[0] - 1)][0]
        else:
            name = find(ar, ['المزون', 'الموزون', 'مزون', 'موزون'], 0)[0]
        t = {'name': name}
        cur = name
        keys = KEYS
        if wav.stem.startswith('P6'):
            keys = [(k, c) for k, c in KEYS if k not in ('dossier', 'cv', 'trad', 'orient')]
            keys = [(k, ['suivi', 'progrès'] if k == 'acc' else c) for k, c in keys]
        for k, c in keys:
            try:
                st, en = find(fr, c, cur, ahead=8)
            except ValueError:
                st = cur + 0.6
                print(f'  {wav.stem} : {k} estimé', flush=True)
            t[k] = st
            cur = st + 0.05
        for k in ('dossier', 'cv', 'trad', 'orient'):
            t.setdefault(k, t['acc'])
        # « WhatsApp » / numéro : dernier tiers de la prise
        try:
            t['cta'] = find(ar_end + fr, ['واتساب', 'whatsapp', 'مساج', 'message'], cur)[0]
        except ValueError:
            t['cta'] = cur + 1.5
        hook = round(name * FPS)
        r = {k: round(v * FPS) - hook for k, v in t.items() if k != 'name'}
        r = {k: r[k] for k in ['qual', 'profs', 'groups', 'day1', 'cours', 'exam', 'acc', 'dossier', 'cv', 'trad', 'orient', 'test', 'remise', 'cta']}
        r['hookDur'] = hook
        r['end'] = round(len(a) / 16000 * FPS) - hook
        res[wav.stem] = r
        print(wav.stem, json.dumps(r), flush=True)
    out.write_text('// Généré par scripts/align_mozon.py : minutage mesuré mot à mot (images à 30 i/s), relatif à la fin de l\'accroche (hookDur).\n'
                   f'export const TIMINGS = {json.dumps(res, indent=1)} as const;\n')

if __name__ == '__main__':
    main()
