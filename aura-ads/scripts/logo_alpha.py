"""Extrait le logo Aura Bio (fond blanc) en PNG transparent, méthode « color to alpha ».

Produit :
  public/brand/logo_mark.png        symbole couleur d'origine (vert -> doré)
  public/brand/logo_mark_light.png  symbole crème pour fonds sombres
  public/brand/logo_full.png        symbole + « Aura Bio » couleur d'origine
"""
import sys
import numpy as np
from scipy import ndimage
from PIL import Image

src, outdir = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")


def color_to_alpha(region):
    a = np.asarray(region).astype(np.float32) / 255.0
    alpha = np.max(1.0 - a, axis=2)
    alpha = np.clip((alpha - 0.035) / 0.965, 0, 1)  # supprime le léger voile du fond
    safe = np.maximum(alpha, 1e-4)[..., None]
    rgb = np.clip((a - (1 - safe)) / safe, 0, 1)
    lab, n = ndimage.label(alpha > 0.04)
    if n:
        sizes = ndimage.sum(np.ones_like(alpha), lab, range(1, n + 1))
        small = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s < 60])
        alpha[small] = 0
    out = np.dstack([rgb, alpha]) * 255
    img = Image.fromarray(out.astype(np.uint8), "RGBA")
    return img.crop(img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())


mark = color_to_alpha(im.crop((540, 110, 870, 398)))
mark = mark.resize((mark.width * 3, mark.height * 3), Image.LANCZOS)
mark.save(f"{outdir}/logo_mark.png")

light = np.asarray(mark).copy()
light[..., 0], light[..., 1], light[..., 2] = 246, 238, 214
Image.fromarray(light, "RGBA").save(f"{outdir}/logo_mark_light.png")

full = color_to_alpha(im.crop((500, 110, 910, 660)))
full = full.resize((full.width * 2, full.height * 2), Image.LANCZOS)
full.save(f"{outdir}/logo_full.png")
print(mark.size, full.size)
