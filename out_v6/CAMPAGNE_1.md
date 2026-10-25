# Campagne 1 : test des créas, Pack 5 Aura Bio

But : trouver quel **type** de créa vend le mieux (offre, vrais produits, image, format long) avant d'y mettre du budget.
4 ensembles de publicités, 4 pubs par ensemble, chaque pub contient son **9:16 et son 4:5**.

## Réglages

| Niveau | Réglage |
|---|---|
| Campagne | Objectif **Ventes**. Budget **au niveau des ensembles** (ABO, pas d'Advantage+ campaign budget) : chaque ensemble dépense son budget, la comparaison est juste. Nom : `C1_TEST_CREAS_<date>` |
| Lieu de conversion | Site web si ton pixel remonte les achats ; sinon **Applications de messagerie** (WhatsApp / Messenger) ou **Appels**, et le bouton « Envoyer un message » / « Appeler » |
| Ensembles (×4) | Budget **5 à 6 $ par jour chacun** (20 à 24 $ par jour au total). Tunisie, **20-50 ans, hommes et femmes**, ciblage large (pas d'intérêts). Exclure les acheteurs (audience personnalisée « clients », liste de téléphones). Placements Advantage+ |
| Pubs (×4 par ensemble) | Une pub = 1 vidéo en 2 formats : dans « Médias », ajoute le **9:16** pour Stories / Reels et le **4:5** pour le fil (personnalisation des éléments par placement). Pour les images : le 4:5 seul (Meta l'adapte en Stories) |

Noms conseillés : ensemble `C1_<ensemble>`, pub `<n°>_<concept>` (ex. `C1_OFFRE` / `V01_offre_h1`).

## Ensemble 1 · `C1_OFFRE` : offre et prix

| Pub | 9:16 | 4:5 |
|---|---|---|
| V01 offre (accroche h1 « ستوب ») | `out_v6/videos/AURA6_V01_offre_h1_9x16_12s_voix.mp4` | `out_v6/videos/AURA6_V01_offre_h1_4x5_12s_voix.mp4` |
| V03 prix barré (accroche h1 « قدّاش تحسب يسوى؟ ») | `out_v6/videos/AURA6_V03_prixbarre_h1_9x16_10s_voix.mp4` | `out_v6/videos/AURA6_V03_prixbarre_h1_4x5_10s_voix.mp4` |
| V02 le calcul | `out_v4/videos/AURA4_V02_calcul_9x16_10s.mp4` | `out_v4/videos/AURA4_V02_calcul_4x5_10s.mp4` |
| V04 comparatif | `out_v4/videos/AURA4_V04_comparatif_9x16_10s.mp4` | `out_v6/videos/AURA6_V04_comparatif_4x5_10s_sansvoix.mp4` |

**Texte principal** (texte A de V4, le même pour les 4 pubs) :
```
باك الشعر واللحية للرجال: 5 قطع بـ 49 د.ت عوض 110 🔥
✅ سدر بيو ✅ ديرما رولر 540 ✅ زيت إكليل الجبل ✅ مشط الجذور ✅ فرشة التدليك
🚚 توصيل لكامل ولايات تونس، والخلاص عند الاستلام.
📞 اطلب توّا: 50 500 051
```
**Titre :** `5 قطع بـ 49 د.ت` · **Description :** `الخلاص عند الاستلام`

## Ensemble 2 · `C1_PRODUITS` : vrais produits

| Pub | 9:16 | 4:5 |
|---|---|---|
| V05 tout ça pour 49 (accroche h1 « حلّينا الكرتونة ») | `out_v6/videos/AURA6_V05_toutca_h1_9x16_15s_voix.mp4` | `out_v6/videos/AURA6_V05_toutca_h1_4x5_15s_voix.mp4` |
| V14 POV | `out_v4/videos/AURA4_V14_pov_9x16_8s.mp4` | `out_v6/videos/AURA6_V14_pov_4x5_8s_sansvoix.mp4` |
| V13 ASMR | `out_v4/videos/AURA4_V13_asmr_9x16_12s.mp4` | `out_v6/videos/AURA6_V13_asmr_4x5_12s_sansvoix.mp4` |
| V09 paiement à la livraison | `out_v4/videos/AURA4_V09_cod_9x16_8s.mp4` | `out_v6/videos/AURA6_V09_cod_4x5_7s_sansvoix.mp4` |

**Texte principal** (texte B de V4) :
```
هذا اللي يوصلك في الباك 👇
5 قطع للشعر واللحية، الكل بـ 49 د.ت (أقل من 10 د.ت للقطعة).
تخلّص كي يوصلك، والتوصيل لكامل تونس.
📞 50 500 051
```
**Titre :** `أقل من 10 د.ت للقطعة` (pour V09 : `الخلاص عند الاستلام`) · **Description :** `توصيل لكامل ولايات تونس`

## Ensemble 3 · `C1_IMAGES` : images V3

| Pub | Fichier (4:5, tous placements) |
|---|---|
| R1 offre exceptionnelle | `out_v3/images/AURA3_R1_exception_4x5.jpg` |
| N1 prix barré | `out_v3/images/AURA3_N1_prixbarre_4x5.jpg` |
| R2 le calcul | `out_v3/images/AURA3_R2_calcul_4x5.jpg` |
| R5 paiement à la livraison | `out_v3/images/AURA3_R5_cod_4x5.jpg` |

**Texte principal** (texte A de V4 : les 4 images parlent de l'offre) :
```
باك الشعر واللحية للرجال: 5 قطع بـ 49 د.ت عوض 110 🔥
✅ سدر بيو ✅ ديرما رولر 540 ✅ زيت إكليل الجبل ✅ مشط الجذور ✅ فرشة التدليك
🚚 توصيل لكامل ولايات تونس، والخلاص عند الاستلام.
📞 اطلب توّا: 50 500 051
```
**Titre :** `5 قطع بـ 49 د.ت` (R2 : `أقل من 10 د.ت للقطعة` ; R5 : `الخلاص عند الاستلام`)

## Ensemble 4 · `C1_LONG` : formats longs, audience froide

| Pub | 9:16 | 4:5 |
|---|---|---|
| L03 pourquoi 49 | `out_v5/videos/AURA5_L03_pourquoi49_9x16_29s.mp4` | `out_v5/videos/AURA5_L03_pourquoi49_4x5_29s.mp4` |
| L07 5 raisons (V6) | `out_v6/videos/AURA6_L07_5raisons_9x16_35s_voix.mp4` | `out_v6/videos/AURA6_L07_5raisons_4x5_35s_voix.mp4` |
| L01 guide (V6) | `out_v6/videos/AURA6_L01_guide_9x16_42s_voix.mp4` | `out_v6/videos/AURA6_L01_guide_4x5_42s_voix.mp4` |

(3 pubs : la liste en donne 3. Pour une 4ᵉ, ajoute `AURA6_L08_colis` V6, la vidéo de confiance.)

**Textes principaux** (V5, un par pub) :

L03 et L07 :
```
5 أسباب باش تاخو باك الشعر واللحية: كل شي في باك واحد، أقل من 10 د.ت للقطعة، طبيعي، تخلّص كي يوصلك، والتوصيل لكامل الولايات.
49 د.ت عوض 110 🔥 📞 50 500 051
```
L01 (et L08 si tu l'ajoutes) :
```
كل شي على باك الشعر واللحية في دقيقة 👇
5 قطع: سدر بيو، ديرما رولر 540، زيت إكليل الجبل، مشط الجذور وفرشة التدليك.
الباك الكامل بـ 49 د.ت عوض 110، تخلّص كي يوصلك والتوصيل لكامل ولايات تونس.
📞 50 500 051
```
**Titre :** `روتين كامل للشعر واللحية` · **Description :** `5 قطع بـ 49 د.ت`

## Voix ou sans voix ?

Dans ce plan, les vidéos V6 sont en version **voix** : en Tunisie, une bonne partie des Reels et Stories sont regardés avec le son. Pour mesurer l'effet de la voix, duplique plus tard la pub gagnante avec le fichier `…_sansvoix.mp4` (même vidéo, sans voix) dans le même ensemble.

## Lire les résultats

Ne touche à rien pendant **3 à 4 jours** (phase d'apprentissage). Ensuite :

1. **Par pub** : taux d'accroche (lectures de 3 s ÷ impressions, viser > 25 %), ThruPlay, coût par achat ou par conversation.
2. **Coupe** une pub qui a dépensé 2 fois ton coût par commande cible sans commande.
3. **Par ensemble** : compare le coût par commande des 4 ensembles. L'ensemble gagnant reçoit le budget des autres (+20 % tous les 3-4 jours, pas plus vite).
4. **Longues** : une longue qui garde plus de 20 % des gens jusqu'à 15 s est une bonne longue, même si son coût par clic est plus élevé.

## Semaine 2

- **Accroches** : prends la meilleure vidéo parmi V01, V03, V05 et lance ses 3 accroches (`_h1`, `_h2`, `_h3`) dans un nouvel ensemble. Seules les 2 premières secondes changent : tu sauras quelle phrase arrête le scroll.
- **Retargeting** (vues 50 % ou interactions, 30 jours) : L08 (confiance), L02 (FAQ, V5), L04 (marque, V6), V08 (routine, V6).
