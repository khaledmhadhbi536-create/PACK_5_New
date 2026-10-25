# aura-ads : le générateur de pubs Aura Bio (Remotion)

Toutes les pubs vidéo et image du Pack Pousse Homme sortent de ce projet. Les **données** (textes, prix, liste des pubs) sont séparées du **rendu** (composants, scènes) : pour une nouvelle pub, on ne touche qu'aux données.

## Démarrer

```bash
cd aura-ads
npm install            # une seule fois
npm run studio         # aperçu interactif dans le navigateur (toutes les pubs, frame par frame)
npm run render:all     # rend TOUT dans ../out (vidéos + images) puis régénère le catalogue
node scripts/render-all.mjs --only C01        # seulement ce qui contient « C01 »
node scripts/render-all.mjs --only C01 --qa   # + captures de contrôle dans ../out/_qa
node scripts/catalogue.mjs                    # régénère ../out/CATALOGUE.md
```

## Créer une nouvelle pub en 2 minutes

**Changer un hook** : dans `src/data/ads.ts`, en bas, copie une ligne et change le texte :

```ts
C01('9x16', 'h5', 'روتين *الأحد* في الدار', {type: 'pack'}, 'روتين الأحد في الدار'),
//   format  variante  hook (*mot* = surligné, \n = retour à la ligne)  visuel  libellé catalogue
```

Puis `node scripts/render-all.mjs --only C01-rituel-9x16 --qa`. Le fichier sort sous le nom `AURA_C01_rituel_9x16_31s_h5.mp4`.

**Changer de format** : remplace `'9x16'` par `'4x5'` ou `'1x1'`. Les mises en page s'adaptent seules.

**Changer le prix, le téléphone, les frais de livraison** : `src/data/product.ts`. Toutes les pubs suivent au prochain rendu.
- `deliveryFee: 7` → la mention « توصيل لكامل ولايات تونس (7 DT) » apparaît partout.

**Changer un texte produit / une phrase** : `src/data/copy.ts` (banque de phrases en derja).

**Nouvelle image** : `src/data/stills.ts`, copie une ligne (`layout` = mise en page : `packOffer`, `grid5`, `steps`, `heritage`, `gift`, `trust`, `macro`, `derma`, `carousel`, `beard`, `ritualPhoto`).

**Nouveau concept complet** : dans `ads.ts`, une fonction qui assemble des scènes :

| Scène (`kind`) | Ce qu'elle montre |
|---|---|
| `hook` | Accroche (texte) sur un visuel : `pack`, `product`, `rush` (vidéo) ou `photo` |
| `rush` | Un rush vidéo ou une photo, avec étape numérotée, titre, sous-titre en pastille, produit incrusté |
| `product` | Un produit détouré + nom + bénéfice (+ compteur 1/5) |
| `pack` / `grid` | Les 5 produits ensemble / en grille |
| `steps` | Récap du rituel en 4 étapes + lavage |
| `offer` | Pack + badge prix + réassurance |
| `cta` | Logo + prix + téléphone + réassurance + Instagram |
| `text` | Phrase choc typographique |
| `tip` | Conseil numéroté sur un visuel |
| `heritage` | Calligraphie + arche tunisienne (zellige, frise bleue) |

Styles (`style`) : `nat` (nature premium), `ugc` (Reels natif), `souk` (offre pop), `her` (héritage), `stu` (studio clair).
Musiques (`music`) : `rituel`, `darbuka`, `punch`, `heritage`. Transitions : `fade`, `slide`, `wipe`, `none`.

## Remplacer les visuels

| Fichier | Rôle |
|---|---|
| `public/products/*.png` | Produits détourés (fond transparent). Garde le même nom pour remplacer. |
| `public/products/huile.png` | **À ajouter** dès que tu as une vraie photo du flacon d'huile, puis mets `image: 'products/huile.png'` pour `huile` dans `product.ts` (sinon le flacon dessiné est utilisé). |
| `public/rushs/*.mp4` | Rushs découpés. Ajoute tes propres vidéos ici, puis lance `python scripts/rush_durations.py`. |
| `public/voice/*.mp3` | Voix off (voir `../out/SCRIPTS_VOIX_OFF.md`). |
| `public/audio/*.wav` | Musiques et effets (générés par `scripts/music.py`, libres de droits). |

Outils annexes : `scripts/cutout_ai.py` (détourage IA d'une photo produit), `scripts/logo_alpha.py` (logo transparent), `scripts/music.py` (musiques), `scripts/voiceover.py` (voix de test).

## Règles intégrées au système

- Texte arabe en RTL animé **par mot** (les lettres restent liées) ; les mots latins et les chiffres sont regroupés pour ne pas s'inverser.
- `SafeArea` : en 9:16, aucun texte dans les 14 % du haut ni les 35 % du bas.
- Le produit est visible dès la première scène de chaque pub.
- Les rushs plus courts que leur scène sont ralentis automatiquement (jamais d'image noire).
