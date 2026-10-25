"""Met à jour src/data/rush-durations.json après ajout de rushs dans public/rushs/.
Usage : python scripts/rush_durations.py"""
import json, os, subprocess

d = {}
for f in sorted(os.listdir("public/rushs")):
    if f.endswith(".mp4"):
        out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "public/rushs/" + f])
        d["rushs/" + f] = round(float(out), 2)
json.dump(d, open("src/data/rush-durations.json", "w"), indent=1)
print(len(d), "rushs")
