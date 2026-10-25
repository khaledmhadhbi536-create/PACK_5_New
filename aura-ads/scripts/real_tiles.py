"""Vraies photos produits (recadrées + étalonnées) depuis les images 8K des vidéos.

Usage : python scripts/real_tiles.py
Sortie : public/photos/real/<nom>.jpg (1400 px max)
"""
import os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FULL = os.path.join(ROOT, '..', 'out_v2', '_work', 'full')
DEST = os.path.join(ROOT, 'public', 'photos', 'real')
os.makedirs(DEST, exist_ok=True)

# nom: (image, x0, y0, x1, y1) en fractions
JOBS = {
    'sidr': ('p5_5.0.jpg', 0.00, 0.10, 0.84, 1.00),
    'applicateur': ('v2_44.0.jpg', 0.00, 0.10, 1.00, 0.98),
    'derma': ('v2_52.75.jpg', 0.00, 0.20, 0.88, 0.92),
    'huile': ('v2_54.3.jpg', 0.00, 0.09, 0.92, 0.80),
    'brosse': ('v2_66.0.jpg', 0.00, 0.06, 1.00, 0.80),
    'ensemble': ('v2_74.25.jpg', 0.00, 0.38, 1.00, 0.98),
    'ensemble_b': ('v2_77.0.jpg', 0.00, 0.10, 1.00, 0.95),
    'commande': ('p5_14.0.jpg', 0.00, 0.00, 1.00, 1.00),
    'commande_b': ('p5_13.6.jpg', 0.00, 0.00, 1.00, 1.00),
}


def grade(im):
    a = np.asarray(im).astype(np.float32)
    m = a.reshape(-1, 3).mean(0)
    a *= (m.mean() / m) ** 0.45          # enlève une partie de la dominante orange
    a = np.clip((a - 128) * 1.07 + 132, 0, 255)
    out = Image.fromarray(a.astype(np.uint8))
    out = ImageEnhance.Color(out).enhance(1.08)
    return out.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))


for name, (src, x0, y0, x1, y1) in JOBS.items():
    im = Image.open(os.path.join(FULL, src)).convert('RGB')
    w, h = im.size
    im = im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
    im.thumbnail((1400, 1400), Image.LANCZOS)
    grade(im).save(os.path.join(DEST, name + '.jpg'), quality=92)
    print(name, im.size)
