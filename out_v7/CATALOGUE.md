# Vidéos V7 : les étapes du rituel avec ton personnage

V7 = les vidéos V6 dont les étapes **huile**, **massage** et **sidr** montrent désormais la personne de tes séquences (accord de la personne donné, d'après toi : garde-en une trace écrite).
Tout le reste (accroches, textes, voix off, musique, écran de fin, durées) est identique à V6. V6 n'est pas modifié.

Chaque vidéo existe en `_voix` (voix derja V6, musique baissée sous la voix) et `_sansvoix`. Planches de contrôle dans `_qa/` (1ʳᵉ image = frame 0).

## Les nouveaux rushs (`aura-ads/public/rushs/perso/`)

Découpés dans tes séquences, **recadrés pour enlever tout texte incrusté** :

| Rush | Contenu | Durée |
|---|---|---|
| `sidr_bol.mp4` | Le bol de sidr préparé | 0,9 s |
| `sidr_front.mp4` | Application du sidr au pinceau, de face | 3,3 s |
| `sidr_top.mp4` | Application du sidr sur tout le dessus de la tête | 4,9 s |
| `huile_goutte.mp4` | Pipette d'huile en gros plan | 1,4 s |
| `massage.mp4` | Massage du cuir chevelu aux doigts (plus utilisé : remplacé par la brosse) | 5,3 s |
| `brosse_massage.mp4` | **Massage à la brosse** sur une tête pleine de sidr (vu de dos), recadré pour enlever le texte et la signature « Sidra_hair7 » (accord du propriétaire, d'après toi) | 4,5 s |

**Étape massage** : le plan brosse est affiché en entier, en bandeau net sur un fond flouté, avec le logo **AURA BIO** dans le coin ; sous le plan, la légende de l'étape propre à chaque vidéo (« ماساج بفرشة التدليك » + durée).

**Retiré exprès** : toutes les dates (« 1 day », « 15/6/2024 »…), les plans « avant / après » et « Today », « رحلة مع الصلع الوراثي », « بضمان 100% », les noms et numéros des autres vendeurs (Pie Khan, Mielle, +972…, « الأصلي »), et le flacon Mielle (plan non utilisé). Raison : Meta refuse les avant/après et les promesses de résultat sur les cheveux, et ces plans attribueraient à ton pack un résultat obtenu avec autre chose.

## Les vidéos

| N° | Fichiers | Durée | Plans remplacés |
|---|---|---|---|
| **V08** 4 étapes | `AURA7_V08_etapes_9x16_18s`, `_4x5` | 18 s | Étape 2 huile (pipette), 3 massage à la brosse, 4 sidr |
| **L01** guide | `AURA7_L01_guide_9x16_42s`, `_4x5` | 42 s | Étapes 2, 3 (brosse), 4 du rituel |
| **L08** colis | `AURA7_L08_colis_9x16_33s`, `_4x5` | 33 s | « ماساج » (brosse) et « وفي الغسيل: سدر بيو » |
| **L10** minuteur | `AURA7_L10_minuteur_9x16_25s` | 25 s | Étapes 2, 3 (brosse), 4 |
| **L04** rituel | `AURA7_L04_rituel_9x16_39s` | 39 s | « ماساج » (brosse) et « وشلّل » |

Textes Ads Manager : les mêmes que V6 (voir `out_v6/CATALOGUE.md`). Ne pas y ajouter de promesse de repousse.

## Refaire

```bash
cd aura-ads
node scripts/render-v7.mjs            # tout (sans voix + voix + planches)
node scripts/render-v7.mjs V08        # une vidéo
```
