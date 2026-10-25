# Vidéos V6 : corrections, accroches et voix off, Pack 5 Aura Bio

Toutes les vidéos sont dans `videos/` et les planches de contrôle dans `_qa/`.
Chaque vidéo existe en **deux versions** :
- `…_voix.mp4` : voix off en derja tunisienne, musique baissée automatiquement sous la voix ;
- `…_sansvoix.mp4` : musique et effets seuls (comme V4/V5).

Noms : `AURA6_<n°>_<concept>[_h<accroche>]_<format>_<durée>_<voix|sansvoix>.mp4`.
Sur chaque planche `_qa/*.jpg`, **la 1ʳᵉ image est la frame 0** (ce que voit la personne avant même que la vidéo démarre), puis 11 images réparties.

V1 à V5 n'ont pas été modifiés : tout le nouveau est dans `aura-ads/src/v6`, `scripts/render-v6.mjs`, `scripts/tts_gemini.py`, `scripts/voice_v6.json` et `public/voice/v6`.

---

## 1. Longues corrigées : l'accroche est lisible dès la frame 0

En V5, ces vidéos s'ouvraient sur un écran vide ou une animation qui partait de zéro (L01 : texte qui apparaît mot par mot, L07 : « 5 » qui arrive en zoom, L08 : écran noir avec machine à écrire). En V6, la première image contient déjà tout le message, puis l'image « respire » (léger mouvement) pour garder l'attention.

| N° | Fichiers | Durée | Frame 0 |
|---|---|---|---|
| **L01** guide | `AURA6_L01_guide_9x16_42s`, `_4x5` | 42 s | Tes vrais produits + « كل شي على الباك في 45 ثانية » + étiquette « باك الشعر واللحية للرجال » |
| **L07** 5 raisons | `AURA6_L07_5raisons_9x16_35s`, `_4x5` | 35 s | Couverture magazine complète : AURA BIO, le grand « 5 », « أسباب باش تاخو الباك », le pack |
| **L08** colis | `AURA6_L08_colis_9x16_33s`, `_4x5` | 33 s | Vraie préparation de commande (flacon d'huile en main), « من الكوموند… لروتينك » en jaune, REC qui tourne |

Le reste de chaque vidéo est identique à V5, sauf les plans massage et lavage (voir 2). L01 garde son écran de fin 0,5 s de plus pour que la voix finisse le téléphone.

Même règle appliquée en passant à **L10** (« 10 دقايق في الجمعة… هذا الكل » + le pack dès la frame 0, au lieu d'un écran blanc) et **L04** (« الأحد… وقت ليك » posé d'emblée sur le sidr).

## 2. Plan « وقت الغسيل » net (et plan massage)

**Le problème** : les rushs de lavage sont des vidéos 16:9 en 640×360. Recadrés plein écran en 9:16, ils étaient agrandis environ 5 fois : on ne voyait qu'un gros plan flou et rose de la main.

**La correction** :
- lavage : passage net de `sidr_massage` (1,95 → 2,8 s : cheveux pleins de mousse de sidr), vérifié image par image, légèrement ralenti ;
- massage : passage le plus net de `sidr_massage_b` (à partir de 4,6 s) ;
- les deux sont affichés **en bandeau 16:9 sur toute la largeur**, sur un fond flouté du même plan. L'image n'est plus agrandie que 1,7 fois : elle reste nette.

| N° | Fichiers | Durée | Ce qui change |
|---|---|---|---|
| **V08** 4 étapes | `AURA6_V08_etapes_9x16_18s`, `_4x5` | 18 s | Étapes 3 (massage) et 4 (lavage) en bandeau net. Écran de fin un peu plus long pour la voix |
| **L10** minuteur | `AURA6_L10_minuteur_9x16_25s` | 25 s | Étapes 3 et 4 en bandeau net |
| **L04** rituel | `AURA6_L04_rituel_9x16_39s` | 39 s | « ماساج » et « وشلّل » en bandeau net |
| L01, L08 | (voir 1) | | Mêmes étapes corrigées |

## 3. Trois accroches (2 premières secondes) pour V01, V03 et V05

Seules les 2 premières secondes changent ; la suite est la même vidéo (et la même voix) : le test A/B mesure uniquement l'accroche. Toutes sont lisibles dès la frame 0 avec le pack visible.

| Vidéo | h1 | h2 | h3 | Fichiers | Durée |
|---|---|---|---|---|---|
| **V01** offre | Panneau « ستوب » + « ما تشريش بالقطعة! » | « شوف الفرق » : 110 د.ت barré ✗ / 49 د.ت ✓ | « 5 قطع » + « بسوم قطعة وحدة » et les 5 produits | `AURA6_V01_offre_h1_9x16_12s` … `_h3_4x5` | 12 s |
| **V03** prix barré | « قدّاش تحسب يسوى الباك؟ » + gros « ? » qui pulse | « السوم طاح! » + flèche qui descend | « قبل ما تشري أي حاجة لشعرك… شوف هذا » | `AURA6_V03_prixbarre_h1_9x16_10s` … `_h3_4x5` | 10 s |
| **V05** tout ça pour 49 | Vraie vidéo des produits + « حلّينا الكرتونة… شوف آش فيها » | « 5 حاجات في كرتونة وحدة » + compteur 1 à 5 | « هذا اللي يوصلك بـ 49 د.ت » | `AURA6_V05_toutca_h1_9x16_15s` … `_h3_4x5` | 15 s |

Après l'accroche : V01 reprend à l'arrivée des 5 cartes, V03 reprend au « 110 » barré, V05 enchaîne les 5 vrais produits. L'écran final reste 2 s de plus pour laisser la voix dire le prix et le téléphone.

## 4. Voix off en derja tunisienne

- **Moteur** : Gemini TTS. Modèle stable courant au 25/10/2026 : `gemini-3.8-flash-tts`. Son quota gratuit du jour était épuisé, donc les voix ont été faites avec `gemini-3.1-flash-tts-preview` (même famille, lecture fidèle en derja). Voix « Puck ».
- **Consigne de style** : « dialecte tunisien (derja), ton chaleureux et dynamique, voix d'homme pour une pub Instagram/Facebook » (L04 : version plus posée, premium). La consigne est passée en « notes de réalisation » : elle n'est pas lue à voix haute.
- **Textes** : `aura-ads/scripts/voice_v6.json` (une phrase par plan, avec son moment de départ). Partout : « تسعة وأربعين دينار », « تخلّص كي يوصلك » et le téléphone « خمسين، خمسمية، صفر خمسة واحد » (50 500 051).
- **Calage** : chaque phrase est posée sur son plan ; si elle est trop longue, elle est légèrement accélérée (au plus ×1,25) ou décalée de quelques dixièmes. Les pauses à l'intérieur des phrases sont raccourcies.
- **Mixage** : la musique baisse d'environ 10 dB quand la voix parle et remonte dans les silences ; fondu de 0,5 s à la fin.
- **Contrôle** : chaque enregistrement a été retranscrit par Gemini et comparé au script, phrase par phrase (ressemblance moyenne 0,86 à 0,98). Un premier enregistrement de L07 où le modèle comptait « خمسة، ستة، سبعة » au lieu de lire les dernières phrases a été refait, avec « السبب الأول، الثاني… » à la place de « واحد، زوز… ».

**À écouter avant de lancer** : je ne peux pas écouter le son moi-même. La transcription confirme les mots, l'ordre et le dialecte, mais pas le naturel de l'accent. Écoute au moins une vidéo par série ; si un mot sonne faux, corrige-le dans `voice_v6.json` et relance (voir plus bas).

Pas de voix sur les 4:5 ajoutés pour la campagne (V03, V04, V09, V13, V14 : voir 5) ; V13 est une vidéo ASMR, elle doit rester sans voix.

## 5. Formats 4:5 ajoutés pour la campagne

La campagne met le 9:16 et le 4:5 dans la même pub. Ces vidéos V4 n'avaient pas de 4:5 : ce sont les mêmes vidéos, mises en page en 4:5 (sans voix). V03, V09, V13 et V14 démarrent 0,27 s plus loin que V4 pour que le titre soit déjà posé à la frame 0.

| N° | Fichier | Durée | Avec le 9:16 de V4 |
|---|---|---|---|
| V03 prix barré | `AURA6_V03_prixbarre_4x5_6s_sansvoix` | 6 s | `out_v4/videos/AURA4_V03_prixbarre_9x16_6s.mp4` |
| V04 comparatif | `AURA6_V04_comparatif_4x5_10s_sansvoix` | 10 s | `AURA4_V04_comparatif_9x16_10s.mp4` |
| V09 paiement à la livraison | `AURA6_V09_cod_4x5_7s_sansvoix` | 7 s | `AURA4_V09_cod_9x16_8s.mp4` |
| V13 ASMR | `AURA6_V13_asmr_4x5_12s_sansvoix` | 12 s | `AURA4_V13_asmr_9x16_12s.mp4` |
| V14 POV | `AURA6_V14_pov_4x5_8s_sansvoix` | 8 s | `AURA4_V14_pov_9x16_8s.mp4` |

## Textes pour Ads Manager

Repris des catalogues V4 et V5 (voir aussi `CAMPAGNE_1.md`, ensemble par ensemble).

**V01, V03 (offre) :** texte A de V4
> باك الشعر واللحية للرجال: 5 قطع بـ 49 د.ت عوض 110 🔥
> ✅ سدر بيو ✅ ديرما رولر 540 ✅ زيت إكليل الجبل ✅ مشط الجذور ✅ فرشة التدليك
> 🚚 توصيل لكامل ولايات تونس، والخلاص عند الاستلام.
> 📞 اطلب توّا: 50 500 051

**V05 (vrais produits) :** texte B de V4
> هذا اللي يوصلك في الباك 👇
> 5 قطع للشعر واللحية، الكل بـ 49 د.ت (أقل من 10 د.ت للقطعة).
> تخلّص كي يوصلك، والتوصيل لكامل تونس.
> 📞 50 500 051

**V08, L10 (routine) :** texte C de V4 / L10 de V5
> روتين ساهل في الدار، 2 ولا 3 مرات في الجمعة:
> 1️⃣ ديرما رولر 2️⃣ زيت إكليل الجبل 3️⃣ ماساج بالفرشة 4️⃣ سدر بيو في الغسيل
> الباك الكامل بـ 49 د.ت عوض 110، والخلاص عند الاستلام.
> 📞 50 500 051

**L01, L08 (guide / confiance) :** texte L01-L08 de V5
> كل شي على باك الشعر واللحية في دقيقة 👇
> 5 قطع: سدر بيو، ديرما رولر 540، زيت إكليل الجبل، مشط الجذور وفرشة التدليك.
> الباك الكامل بـ 49 د.ت عوض 110، تخلّص كي يوصلك والتوصيل لكامل ولايات تونس.
> 📞 50 500 051

**L07 (raisons) :** texte L03-L07 de V5
> 5 أسباب باش تاخو باك الشعر واللحية: كل شي في باك واحد، أقل من 10 د.ت للقطعة، طبيعي، تخلّص كي يوصلك، والتوصيل لكامل الولايات.
> 49 د.ت عوض 110 🔥 📞 50 500 051

**L04 (marque) :** texte L04-L05 de V5
> السدر، سرّ الحمّام متاع جدودنا، في روتين كامل للشعر واللحية.
> سدر بيو + ديرما رولر 540 + زيت إكليل الجبل + مشط الجذور + فرشة التدليك، الكل بـ 49 د.ت.
> الخلاص عند الاستلام. 📞 50 500 051

**Titres :** « 5 قطع بـ 49 د.ت » · « الخلاص عند الاستلام » · « أقل من 10 د.ت للقطعة » · « روتين كامل للشعر واللحية »

## Refaire ou modifier

```bash
cd aura-ads
python scripts/tts_gemini.py                 # voix (cache : seuls les textes modifiés sont réenregistrés)
python scripts/tts_gemini.py L07 --force     # réenregistrer une vidéo
node scripts/render-v6.mjs                   # tout rendre (sans voix + voix + planches)
node scripts/render-v6.mjs V01 --qa-only     # planches seulement
node scripts/render-v6.mjs --mix-only        # refaire seulement les versions voix
```

Quota gratuit Gemini : environ 10 enregistrements par jour et par modèle TTS. Le script fait **un seul appel par vidéo** (toutes les phrases d'un coup), puis découpe l'enregistrement phrase par phrase : un appel de transcription Gemini sert à retrouver où commence chaque phrase. S'il manque de quota, il passe au modèle suivant de la liste `models` de `voice_v6.json`. La clé est lue dans `GEMINI_API_KEY`.
