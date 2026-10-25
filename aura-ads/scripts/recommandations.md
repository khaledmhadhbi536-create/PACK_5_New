
---

## Recommandations : quoi lancer en premier, et comment tester

### 1. Le premier lancement (semaine 1) : trouver le bon angle

On teste **les angles** avant les détails. Une campagne, un seul ensemble de publicités large, 6 pubs très différentes :

| # | Pub | Pourquoi |
|---|---|---|
| 1 | `AURA_C02_unboxing_9x16_17s_h1` | Valeur perçue : on voit les 5 produits, puis le prix. C'est souvent le meilleur vendeur sur un pack. |
| 2 | `AURA_C01_rituel_9x16_31s_h1` | Rassure (« c'est simple ») et éduque. Bon pour la conversion. |
| 3 | `AURA_C03_heritage_9x16_19s_h1` | Ton angle différenciant (le sidr, la Tunisie). Personne ne le fait. |
| 4 | `AURA_C07_derma_9x16_15s_h1` | Curiosité « 540 aiguilles » : fort taux d'arrêt du scroll. |
| 5 | `AURA_C04_offre_9x16_10s_long` | Direct : prix + paiement à la livraison. Sert de référence. |
| 6 | `AURA_I01_pack_4x5_nat` (image) | Contrôle statique : certaines audiences tunisiennes répondent mieux aux images. |

**Réglages conseillés**
- Objectif : **Ventes** si ton pixel / ta boutique remonte les achats ; sinon **Messages** (WhatsApp / Messenger), très efficace en Tunisie pour le paiement à la livraison.
- Audience : Tunisie, 20-45 ans, **hommes et femmes** (les femmes achètent aussi pour un homme), ciblage Advantage+ (large). Placements Advantage+ : Meta choisira Reels / Stories / Fil.
- Budget : ~25 à 35 DT par jour pour l'ensemble, pendant 5 à 7 jours **sans toucher** (la phase d'apprentissage a besoin de calme).
- Ajoute pour chaque pub la version 4:5 correspondante quand elle existe : Meta l'utilisera dans le fil.

**Lecture des résultats (après 3-4 jours)**
- **Taux d'accroche** (lectures de 3 s ÷ impressions) : visé > 25 %. En dessous, c'est le hook qui ne marche pas.
- **Taux de rétention** (ThruPlay ÷ lectures de 3 s) : visé > 15 %. En dessous, c'est le milieu de la vidéo qui lâche.
- **Coût par message / par commande** : c'est le juge final. Coupe une pub qui a dépensé 2× ton coût d'acquisition cible sans aucune commande.

### 2. Semaine 2 : exploiter le gagnant

- Prends **le concept gagnant** et lance ses variantes de hook (h1, h2, h3…). Seul le texte des 2 premières secondes change : tu sauras exactement quel message accroche le mieux.
  - Ex. si C01 gagne : `C01 h1` vs `C01 h2` vs `C01 h3` vs `C01 h4` (même texte que h2, mais avec un rush en accroche au lieu du pack).
- Teste la **version courte** (`C01 …20s_court`) contre la longue : en Tunisie, les Reels courts coûtent souvent moins cher.
- Duplique l'ensemble gagnant avec +20 % de budget tous les 3-4 jours (pas plus vite).

### 3. En continu : retargeting (audiences chaudes)

Ensemble séparé : personnes ayant vu 50 % d'une vidéo, interagi avec la page ou Instagram, ou envoyé un message dans les 30 derniers jours.
- `AURA_C10_guide_9x16_44s_v1` : la version longue répond à toutes les questions.
- `AURA_C04_offre_9x16_6s_cod` + `AURA_I06_confiance_1x1_v1` : lèvent le dernier frein (« je paie à la réception »).
- Le **carrousel** `I07` (7 cartes) est excellent ici.
- Budget : 20-30 % du budget total.

### 4. L'angle cadeau (femmes)

`C05` (vidéos) et `I05` (images) dans un ensemble à part, femmes 22-45 ans. À pousser avant les **fêtes** (Aïd, fête des pères, anniversaires, Saint-Valentin…).

### 5. Rafraîchir les créatifs

- Une pub fatigue quand la **fréquence dépasse ~3** et que le coût monte. Le système permet de sortir de nouvelles variantes en quelques minutes : nouveau hook dans `src/data/copy.ts`, une ligne dans `src/data/ads.ts`, `npm run render:one -- C01`.
- Idées de prochains hooks à tester : « سدر + روماران = الكومبو الصحيح؟ », « علاش الماساج مهم؟ », « روتين الأحد في الدار »…
- **Le plus gros gain possible : une vraie vidéo de toi** (ou d'un proche consentant) qui ouvre le pack et fait le rituel, filmée au téléphone, à la verticale. Un rush original net vaudra plus que tous les rushs internet. Le système l'intégrera directement (dépose-la dans `public/rushs/`).

### 6. Garde-fous Meta (déjà respectés dans tous les créatifs)

- Ne jamais écrire dans le texte d'annonce « تطيح شعرك؟ » ou « عندك صلعة؟ » (attribut personnel = refus).
- Pas de « résultat garanti » ni de « en 2 semaines ».
- Pas d'avant/après.
- Si une pub est refusée : demande un nouvel examen depuis Ads Manager ; le plus souvent, c'est le texte principal qu'il faut adoucir, pas la vidéo.
