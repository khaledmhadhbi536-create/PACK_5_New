# V12 : les vidéos « offres » d'AURA6 refaites (pack de 4)

Nouvelle offre partout : **pack de 4** (sidr, huile de romarin, derma roller 540, brosse de massage ; plus d'applicateur), **39 DT au lieu de 64**, **livraison 8 DT**, paiement à la livraison, appel final **« انزل على كومندي »** avec la flèche vers le bouton de la pub.

Chaque vidéo existe en **9:16** (Stories, Reels) et **4:5** (fil). Planches de contrôle dans `_qa/` (1ʳᵉ image = frame 0).

## Ce qui change par rapport à AURA6

- **Voix derja 100 %**, même voix partout (accent de Tunis), en une prise continue : l'accroche s'enchaîne sur la suite sans blanc.
- **Écran partagé** pour chaque produit, au moment où la voix le nomme : l'homme qui l'utilise (en haut, ou à gauche en 4:5 ; pour l'huile, sa photo avec la bouteille Aura Bio en main) + la nouvelle photo du produit (en bas, ou à droite), avec le nom et le bienfait dit par la voix.
- **Rythme posé** : voix à vitesse naturelle et une phrase de bienfait par produit (« ينظّف جلدة الراس », « ينشّط الدورة الدموية », « يعاون الزيت يدخل للجذور », « يرتّحلك جلدة الراس ») : chaque produit reste environ 2,5 s à l'écran.
- Style « motion » (skill remotion-motion-graphics) : fonds en dégradé mobile, étalonnage, grain, mots qui claquent au rythme de la voix.
- Son traité avec ffmpeg-skill : −14 LUFS (le niveau d'Instagram/Facebook), couleurs taguées BT.709, contrôle Reels/Facebook passé.

## Les vidéos

Seules les 2-3 premières secondes (l'accroche) changent entre h1, h2 et h3 : le test A/B mesure uniquement l'accroche.

| Vidéo | h1 | h2 | h3 |
|---|---|---|---|
| **V01 offre** | Panneau STOP : « ستوب! ما تشريش حاجات شعرك بالقطعة! » | « شوف الفرق » : بالقطعة 64 ✗ / في الباك 39 ✓ | Gros « 4 » : « أربعة قطع لشعرك، وكل قطعة بأقل من عشرة دينارات! » |
| **V03 prix barré** | « قدّاش تحسب يسوى الباك هذا؟ » + gros « ? » | « السوم طاح! » : 64 qui tombe → 39 | Sur le vrai rush : « قبل ما تشري أي حاجة لشعرك، شوف هذا! » |
| **V05 tout ça pour 39** | Vraie vidéo des produits : « حلّينا الكرتونة، شوف آش فيها! » | « أربعة حاجات في كرتونة وحدة! » | Vraie vidéo : « هذا اللي يوصلك بتسعة وثلاثين دينار! » |

Fichiers : `videos/AURA12_<vidéo>_h<n>_<format>_<durée>.mp4` (20 à 24 s).

Suite commune :
- **V01** : « باك Aura Bio فيه أربعة حاجات… » → les 4 produits en écran partagé → « الكل » → 39 (64 barré) → livraison 8 DT → « تخلّص كي يوصلك » → « انزل على كومندي ».
- **V03** : « أربعة قطع لشعرك » → les 4 produits → « بالقطعة 64 » barré → « أما في الباك » → 39 → livraison → paiement → appel.
- **V05** : les 4 produits tout de suite → 39 → livraison → paiement → appel.

## Textes Ads Manager

**Texte principal** (V01, V03, V05) :
```
باك Aura Bio للشعر: 4 قطع بـ 39 د.ت عوض 64 🔥
✅ سدر طبيعي ✅ زيت إكليل الجبل ✅ ديرما رولر 540 ✅ بروس الماساج
🚚 التوصيل بـ 8 د.ت لكامل الولايات، وتخلّص كي يوصلك.
👇 انزل على كومندي
📞 50 500 051
```
**Titre :** `4 قطع بـ 39 د.ت` · **Description :** `تخلّص كي يوصلك`

Variante pour V05 (« tout ça pour 39 ») :
```
هذا اللي يوصلك في الباك 👇
4 قطع لشعرك، الكل بـ 39 د.ت (أقل من 10 د.ت للقطعة).
التوصيل بـ 8 د.ت، وتخلّص كي يوصلك.
📞 50 500 051
```

Pas de promesse de repousse dans les textes : Meta refuse les annonces qui promettent un résultat sur la santé ou le corps.

## Test conseillé

Un ensemble par vidéo (V01, V03, V05), les 3 accroches en 3 pubs dans le même ensemble, 5 à 6 $/jour, Tunisie 20-50 ans, ciblage large. Après 3-4 jours, garde la meilleure accroche de chaque vidéo (taux de lecture 3 s / impressions, coût par commande) et mets-les ensemble dans une campagne CBO.

## Refaire

```bash
cd aura-ads
node scripts/render-v12.mjs                 # tout
node scripts/render-v12.mjs V03 9x16        # filtre : tous les mots doivent correspondre
```
Code : `aura-ads/src/v12/Ads12.tsx` (minutage mesuré mot à mot sur chaque voix, dans `BODIES` et `ADS`). Voix : `aura-ads/public/voice/v12/`.
