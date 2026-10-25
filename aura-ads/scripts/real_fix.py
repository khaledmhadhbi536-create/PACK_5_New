"""Deux produits que rembg ne sait pas détourer (kraft sur bois, flacon tenu au pouce).

- huile : GrabCut sur v2_54.3, le pouce est retiré (couleur peau), la silhouette
  du flacon est complétée par son enveloppe convexe et le trou est retouché (inpaint).
- sidr  : le sachet kraft est recomposé à partir des vraies textures de v2_3.63
  (kraft, fenêtre verte, étiquette « سدر طبيعي aura bio »).
Sortie : public/products/real/{huile,sidr}.png
"""
import os
import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FULL = os.path.join(ROOT, '..', 'out_v2', '_work', 'full')
DEST = os.path.join(ROOT, 'public', 'products', 'real')


def grade(bgr):
    a = bgr.astype(np.float32)
    m = a.reshape(-1, 3).mean(0)
    a *= (m.mean() / m) ** 0.55
    a = (a - 128) * 1.08 + 128
    return np.clip(a, 0, 255).astype(np.uint8)


# ---------- huile ----------
src = cv2.imread(os.path.join(FULL, 'v2_54.3.jpg'))
k = src.shape[1] / 540  # coordonnées relevées sur une vignette 540 px
x0, y0, x1, y1 = [int(v * k) for v in (40, 110, 350, 730)]
crop = src[y0:y1, x0:x1].copy()
s = 1200 / crop.shape[0]
small = cv2.resize(crop, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
h, w = small.shape[:2]
mask = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
mask[:, :int(w * 0.07)] = cv2.GC_BGD
mask[:, int(w * 0.95):] = cv2.GC_BGD
mask[int(h * 0.97):, :] = cv2.GC_BGD
# corps du flacon (sûr) et bouchon (sûr)
PY = lambda g: int((g - 110) * k * s)
PX = lambda g: int((g - 40) * k * s)
mask[PY(420):PY(680), PX(110):PX(300)] = cv2.GC_FGD
mask[PY(140):PY(212), PX(90):PX(235)] = cv2.GC_FGD
bgd, fgd = np.zeros((1, 65)), np.zeros((1, 65))
cv2.grabCut(small, mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
# pouce : teinte peau (brun), on l'enlève puis on reconstruit par enveloppe convexe
hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
skin = cv2.inRange(hsv, (0, 40, 40), (22, 200, 255))
ty0, ty1 = PY(215), PY(395)
thumb = np.zeros_like(skin)
thumb[ty0:ty1, :] = skin[ty0:ty1, :]
thumb = cv2.morphologyEx(thumb, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
thumb = cv2.dilate(thumb, np.ones((15, 15), np.uint8))
fg[thumb > 0] = 0
fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
n, lab, stats, _ = cv2.connectedComponentsWithStats(fg)
keep = np.zeros_like(fg)
for i in range(1, n):
    if stats[i, cv2.CC_STAT_AREA] > 4000:
        keep[lab == i] = 255
cnts, _ = cv2.findContours(keep, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
hull = cv2.convexHull(np.vstack(cnts))
sil = np.zeros_like(fg)
cv2.fillPoly(sil, [hull], 255)
hole = cv2.bitwise_and(sil, cv2.bitwise_not(keep))
hole = cv2.bitwise_or(hole, cv2.bitwise_and(thumb, sil))
img = cv2.inpaint(small, hole, 9, cv2.INPAINT_TELEA)
img = grade(img)
sil = cv2.GaussianBlur(sil, (5, 5), 0)
ys, xs = np.where(sil > 20)
img, sil = img[ys.min():ys.max(), xs.min():xs.max()], sil[ys.min():ys.max(), xs.min():xs.max()]
cv2.imwrite(os.path.join(DEST, 'huile.png'), np.dstack([img, sil]))
cv2.imwrite(os.path.join(ROOT, '..', 'out_v2', '_work', 'huile_hole.jpg'), hole)
print('huile', img.shape)

# ---------- sidr (sachet recomposé) ----------
src = cv2.imread(os.path.join(FULL, 'v2_3.63.jpg'))
k = src.shape[1] / 540
g = lambda x0, y0, x1, y1: grade(src[int(y0 * k):int(y1 * k), int(x0 * k):int(x1 * k)])
kraft = g(250, 330, 520, 520)
window = g(260, 610, 500, 760)
label = g(426, 636, 540, 690)
W, H = 900, 1260
kr = cv2.resize(kraft, (W, H), interpolation=cv2.INTER_CUBIC)
kr = cv2.GaussianBlur(kr, (0, 0), 6)
noise = (np.random.default_rng(3).normal(0, 5, (H, W, 1))).astype(np.float32)
pouch = np.clip(kr.astype(np.float32) + noise, 0, 255)
# éclairage doux : plus clair au centre-haut, bords assombris (volume du sachet)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
light = 1.06 - 0.22 * ((xx - W * 0.45) / W) ** 2 * 4 - 0.08 * (yy / H)
pouch *= light[..., None]
# fenêtre verte
wy0, wy1 = int(H * 0.52), int(H * 0.80)
win = cv2.resize(window, (int(W * 0.86), wy1 - wy0), interpolation=cv2.INTER_CUBIC)
win = cv2.GaussianBlur(win, (0, 0), 3).astype(np.float32)
wx0 = int(W * 0.07)
pouch[wy0:wy1, wx0:wx0 + win.shape[1]] = win * light[wy0:wy1, wx0:wx0 + win.shape[1], None]
cv2.rectangle(pouch, (wx0, wy0), (wx0 + win.shape[1], wy1), (150, 170, 190), 2)
# zip + soudure du haut
cv2.line(pouch, (14, int(H * 0.11)), (W - 14, int(H * 0.11)), (120, 150, 175), 4)
cv2.line(pouch, (14, int(H * 0.115)), (W - 14, int(H * 0.115)), (205, 220, 235), 2)
for x in range(0, W, 9):
    cv2.line(pouch, (x, 4), (x, 36), (140, 165, 190), 1)
# étiquette réelle
lw = int(W * 0.46)
lab = cv2.resize(label, (lw, int(lw * label.shape[0] / label.shape[1])), interpolation=cv2.INTER_CUBIC)
lab = cv2.detailEnhance(lab, sigma_s=6, sigma_r=0.15)
ly, lx = int(H * 0.60), (W - lw) // 2
pouch[ly:ly + lab.shape[0], lx:lx + lw] = lab
pouch = np.clip(pouch, 0, 255).astype(np.uint8)
alpha = np.zeros((H, W), np.uint8)
cv2.rectangle(alpha, (10, 0), (W - 10, H), 255, -1)
alpha = cv2.GaussianBlur(alpha, (5, 5), 0)
cv2.imwrite(os.path.join(DEST, 'sidr.png'), np.dstack([pouch, alpha]))
print('sidr', pouch.shape)
