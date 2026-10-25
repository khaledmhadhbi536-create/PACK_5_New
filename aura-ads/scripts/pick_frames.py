"""Extrait des images candidates des vidéos 8K et les classe par netteté.

Usage : python scripts/pick_frames.py <video> <debut> <fin> <prefixe> [pas]
Écrit des JPG 1080 px dans out_v2/_work/cand/<prefixe>_<t>.jpg et affiche
les 6 plus nettes (variance du laplacien sur la zone centrale).
"""
import subprocess, sys, os, glob
import cv2

video, t0, t1, prefix = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
step = float(sys.argv[5]) if len(sys.argv) > 5 else 0.25
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
out = os.path.join(root, 'out_v2', '_work', 'cand')
os.makedirs(out, exist_ok=True)
for f in glob.glob(os.path.join(out, prefix + '_*.jpg')):
    os.remove(f)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-threads', '2', '-ss', str(t0), '-to', str(t1), '-i', video,
                '-vf', f'fps={1/step},scale=1080:-1', '-q:v', '3',
                os.path.join(out, prefix + '_%03d.jpg')], check=True)
scores = []
for f in sorted(glob.glob(os.path.join(out, prefix + '_*.jpg'))):
    img = cv2.imread(f, cv2.IMREAD_GRAYSCALE)
    h, w = img.shape
    c = img[h // 5: 4 * h // 5, w // 6: 5 * w // 6]
    s = cv2.Laplacian(c, cv2.CV_64F).var()
    idx = int(os.path.basename(f).split('_')[-1][:3]) - 1
    scores.append((s, round(t0 + idx * step, 2), f))
scores.sort(reverse=True)
for s, t, f in scores[:6]:
    print(f'{t:7.2f}s  net={s:8.1f}  {os.path.basename(f)}')
