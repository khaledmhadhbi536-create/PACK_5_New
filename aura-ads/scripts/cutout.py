"""Détourage simple des photos produits sur fond blanc.

Usage : python scripts/cutout.py <source> <dest.png> [x0 y0 x1 y1] [--thr 235] [--scale 2]
Le fond clair relié aux bords de l'image devient transparent (flood fill),
les bords sont adoucis. Les fichiers d'origine ne sont jamais modifiés.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

args = [a for a in sys.argv[1:] if not a.startswith("--")]
opts = dict(zip(sys.argv[1:], sys.argv[2:]))
thr = int(opts.get("--thr", 235))
scale = float(opts.get("--scale", 2))

src, dst = args[0], args[1]
im = Image.open(src).convert("RGB")
if len(args) >= 6:
    im = im.crop(tuple(int(v) for v in args[2:6]))
if scale != 1:
    im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)

a = np.asarray(im).astype(np.int16)
light = (a.min(axis=2) >= thr) & ((a.max(axis=2) - a.min(axis=2)) < 22)
lab, _ = ndimage.label(light)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(border))
# petits trous de fond enfermés (ex. entre les picots de la brosse) : on garde
fg = ~bg
fg = ndimage.binary_opening(fg, iterations=1)
fg = ndimage.binary_fill_holes(fg) if "--fill" in sys.argv else fg
# on ne garde que les gros composants
lab2, n = ndimage.label(fg)
if n:
    sizes = ndimage.sum(fg, lab2, range(1, n + 1))
    keep = [i + 1 for i, s in enumerate(sizes) if s > 0.02 * fg.sum()]
    fg = np.isin(lab2, keep)
alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
out = im.convert("RGBA")
out.putalpha(alpha)
bbox = alpha.point(lambda v: 255 if v > 10 else 0).getbbox()
out = out.crop(bbox)
out.save(dst)
print(dst, out.size)
