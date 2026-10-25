#!/usr/bin/env bash
# Découpe des extraits 1080x1920 (h264) dans les vidéos 8K « pack 5 » et « pack 5 V2 ».
# Étalonnage léger : on enlève une partie de la dominante orange de la lumière d'intérieur.
# Usage : bash scripts/cut_real.sh            (depuis aura-ads/)
set -e
SRC=".."
OUT="public/rushs/real"
mkdir -p "$OUT"
GRADE="scale=1080:1920:flags=lanczos,colorbalance=rs=-0.06:gs=0.0:bs=0.06:rm=-0.05:bm=0.04,eq=contrast=1.06:saturation=1.08,unsharp=5:5:0.5"

cut () { # fichier debut duree nom
	[ -s "$OUT/$4.mp4" ] && { echo "existe $4"; return; }
	ffmpeg -v error -threads 2 -y -ss "$2" -t "$3" -i "$SRC/$1" -vf "$GRADE,fps=30" \
		-c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -ac 2 "$OUT/$4.mp4"
	echo "ok $4"
}

V2="pack 5 V2.mp4"
P5="pack 5.mp4"
cut "$V2" 0.0 6.0 v2_sidr
cut "$V2" 34.0 7.0 v2_applicateur
cut "$V2" 47.0 6.0 v2_derma
cut "$V2" 53.0 4.5 v2_huile
cut "$V2" 58.0 11.0 v2_brosse
cut "$V2" 69.0 8.3 v2_tous
cut "$P5" 3.5 2.5 p5_sidr
cut "$P5" 8.0 2.5 p5_notice
cut "$P5" 12.3 3.0 p5_huile
cut "$P5" 17.5 3.0 p5_derma
cut "$P5" 24.0 3.0 p5_applicateur
cut "$P5" 29.0 6.5 p5_fermeture
