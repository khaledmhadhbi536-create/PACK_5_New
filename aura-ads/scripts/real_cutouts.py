"""Détoure les 5 vrais produits à partir des images 8K extraites de « pack 5 V2.mp4 ».

Usage : python scripts/real_cutouts.py [nom ...]
Sources : out_v2/_work/full/v2_<t>.jpg  ->  public/products/real/<nom>.png
La zone est donnée en fractions de l'image ; la couleur est corrigée
(dominante chaude de la lumière d'intérieur) avant détourage.
"""
import os, sys
import numpy as np
from PIL import Image, ImageEnhance
from rembg import remove, new_session

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FULL = os.path.join(ROOT, '..', 'out_v2', '_work', 'full')
DEST = os.path.join(ROOT, 'public', 'products', 'real')
os.makedirs(DEST, exist_ok=True)

# nom: (image, x0, y0, x1, y1)
JOBS = {
    'sidr': ('v2_8.0.jpg', 0.10, 0.18, 1.00, 1.00),
    'applicateur': ('v2_46.87.jpg', 0.36, 0.22, 0.90, 1.00),
    'derma': ('v2_52.75.jpg', 0.00, 0.26, 0.76, 0.93),
    'huile': ('v2_76.75.jpg', 0.00, 0.17, 0.38, 0.60),
    'brosse': ('v2_66.0.jpg', 0.00, 0.04, 1.00, 0.82),
}


def grade(im: Image.Image) -> Image.Image:
    """Balance des blancs partielle (gray world) + un peu de contraste."""
    a = np.asarray(im).astype(np.float32)
    means = a.reshape(-1, 3).mean(0)
    gain = (means.mean() / means) ** 0.55
    a = np.clip(a * gain, 0, 255).astype(np.uint8)
    out = Image.fromarray(a)
    out = ImageEnhance.Contrast(out).enhance(1.08)
    out = ImageEnhance.Color(out).enhance(1.05)
    return out


session = new_session('isnet-general-use')
names = sys.argv[1:] or list(JOBS)
for name in names:
    src, x0, y0, x1, y1 = JOBS[name]
    im = Image.open(os.path.join(FULL, src)).convert('RGB')
    w, h = im.size
    im = im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
    # le modèle travaille mieux autour de 1600 px
    k = 1600 / max(im.size)
    small = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    mask = remove(small, session=session, only_mask=True, post_process_mask=True)
    mask = mask.resize(im.size, Image.LANCZOS)
    im = grade(im)
    im.putalpha(mask)
    bbox = mask.point(lambda v: 255 if v > 20 else 0).getbbox()
    im = im.crop(bbox)
    # taille finale raisonnable (max 1400 px)
    k = min(1, 1400 / max(im.size))
    im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    p = os.path.join(DEST, name + '.png')
    im.save(p)
    print(name, im.size)
