"""Génère les voix off TEST (edge-tts, voix tunisienne ar-TN) calées sur la durée des pubs.

Usage : python scripts/voiceover.py
Sortie : public/voice/<id>.mp3

⚠️ À VALIDER À L'OREILLE : si l'accent sonne littéraire ou non tunisien,
ne pas utiliser ces fichiers (enregistrer sa propre voix à la place).
Les soukouns (ْ) en fin de mot évitent les terminaisons de l'arabe littéraire.
"""
import asyncio
import os
import subprocess

import edge_tts

OUT = "public/voice"
VOICE = "ar-TN-HediNeural"

SCRIPTS = {
    # id: (durée cible en s, texte)
    "C04_long": (
        9.6,
        "تسعة وأربعينْ دينارْ برْكْ! خمسة منتوجاتْ في باكْ واحِدْ. الباكْ الكامِلْ للشّعرْ واللّحية. تخلّصْ كي يوصلكْ، والتّوصيلْ لكامِلْ تونسْ. كوموندي توّا.",
    ),
    "C02_h1": (
        15.8,
        "شنوّة فيه الباكْ هذا؟ يلّا نحلّوهْ. سدرْ طبيعي. زيتْ الرّوماران. ديرما رولرْ. فلاكونْ. وبروسْ ماساجْ. "
        "الخمسة الكلْ بتسعة وأربعينْ دينارْ، وتخلّصْ كي يوصلكْ. كوموندي توّا!",
    ),
    "C03_h1": (
        18.6,
        "السّدرْ، سرّ الحمّامْ متاعْ جدودنا. من الحمّامْ متاعْ جدّاتنا، لروتينكْ اليومْ. "
        "سدرْ طبيعي، ينظّفْ بالشّويّة ويقوّي الشّعرْ. وزدنالو زيتْ الرّوماران، ديرما رولرْ، فلاكونْ وبروسْ ماساجْ. "
        "روتينْ تونسي للشّعرْ واللّحية، بتسعة وأربعينْ دينارْ. كوموندي توّا.",
    ),
}


def duration(path):
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]
    )
    return float(out)


async def synth(text, path, rate):
    await edge_tts.Communicate(text, VOICE, rate=f"{rate:+d}%").save(path)


async def main():
    os.makedirs(OUT, exist_ok=True)
    for key, (target, text) in SCRIPTS.items():
        path = os.path.join(OUT, f"{key}.mp3")
        rate = 0
        for _ in range(4):
            await synth(text, path, rate)
            d = duration(path)
            if d <= target and d > target * 0.82:
                break
            # ajuste le débit pour tomber dans la fenêtre
            rate = int(rate + (d / (target * 0.92) - 1) * 100)
            rate = max(-20, min(35, rate))
        print(f"{key}: {d:.1f}s (cible {target}s, débit {rate:+d}%)")


asyncio.run(main())
