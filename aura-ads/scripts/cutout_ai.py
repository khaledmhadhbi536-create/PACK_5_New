"""Détourage IA (rembg) d'une zone d'une photo produit.

Usage : python scripts/cutout_ai.py <source> <dest.png> [x0 y0 x1 y1] [--scale 2]
"""
import sys
from PIL import Image
from rembg import remove, new_session

args = [a for a in sys.argv[1:] if not a.startswith("--")]
opts = dict(zip(sys.argv[1:], sys.argv[2:]))
scale = float(opts.get("--scale", 2))
model = opts.get("--model", "isnet-general-use")

im = Image.open(args[0]).convert("RGB")
if len(args) >= 6:
    im = im.crop(tuple(int(v) for v in args[2:6]))
if scale != 1:
    im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
out = remove(im, session=new_session(model), post_process_mask=True)
out = out.crop(out.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox())
out.save(args[1])
print(args[1], out.size)
