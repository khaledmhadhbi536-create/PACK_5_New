/**
 * Génère out/CATALOGUE.md à partir de catalogue.json (écrit par render-all.mjs).
 *   node scripts/catalogue.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(ROOT, '..', 'out');
const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalogue.json'), 'utf8'));

const FORMAT = {'9x16': '9:16 (Reels / Stories)', '4x5': '4:5 (Fil)', '1x1': '1:1 (Fil / carrousel)'};
const STYLE = {nat: 'Nature premium', ugc: 'Natif Reels', souk: 'Offre pop', her: 'Héritage tunisien', stu: 'Studio clean'};
const plain = (t) => t.replace(/\*/g, '').replace(/\n/g, ' ');
const exists = (it) => {
	const folder = it.type === 'image' ? 'images' : it.spec.voiceover ? 'voix_off_a_valider' : 'videos';
	return fs.existsSync(path.join(OUT, folder, it.file)) ? folder : null;
};

const videos = items.filter((i) => i.type === 'video' && !i.spec.voiceover);
const vo = items.filter((i) => i.type === 'video' && i.spec.voiceover);
const images = items.filter((i) => i.type === 'image');

const group = (arr) => {
	const m = new Map();
	for (const it of arr) m.set(it.spec.concept, [...(m.get(it.spec.concept) ?? []), it]);
	return [...m.entries()];
};

let md = `# Aura Bio · Pack Pousse Homme : catalogue des créatifs Meta

> Généré automatiquement depuis \`aura-ads/src/data/\`. Pour le mettre à jour : \`npm run render:all\` dans \`aura-ads/\`.

**${videos.length} vidéos** (dossier \`videos/\`) · **${images.length} images** (dossier \`images/\`) · **${vo.length} vidéos avec voix off de test** (dossier \`voix_off_a_valider/\`).

Rappels :
- Les **textes d'annonce** sont en derja, prêts à coller dans *Texte principal*. Le **titre** va dans *Titre*.
- Bouton d'action conseillé : **Envoyer un message** (WhatsApp / Messenger) ou **Appeler** si tu prends les commandes par téléphone.
- Les frais de livraison et le lien produit ne sont pas encore affichés (à compléter dans \`aura-ads/src/data/product.ts\`).

---

## Sommaire

| Concept | Approche | Vidéos | Images |
|---|---|---|---|
`;

const concepts = new Map();
for (const it of [...videos, ...images]) {
	const c = it.spec.concept;
	const e = concepts.get(c) ?? {approach: it.spec.meta.approach, v: 0, i: 0};
	if (it.type === 'video') e.v++;
	else e.i++;
	concepts.set(c, e);
}
for (const [c, e] of concepts) md += `| ${c} | ${e.approach} | ${e.v || '–'} | ${e.i || '–'} |\n`;

md += `\n---\n\n## Vidéos\n`;
for (const [concept, arr] of group(videos)) {
	const first = arr[0].spec;
	md += `\n### ${concept} · ${first.meta.approach}\n\nStyle : ${STYLE[first.style]} · musique : \`${first.music}\`\n\n`;
	md += `| Fichier | Format | Durée | Hook (2 premières secondes) | Titre Meta |\n|---|---|---|---|---|\n`;
	for (const it of arr) {
		const ok = exists(it) ? '' : ' ⚠️ non rendu';
		md += `| \`${it.file}\`${ok} | ${FORMAT[it.spec.format]} | ${Math.round(it.seconds)} s | ${it.spec.meta.hook} | ${it.spec.meta.headline} |\n`;
	}
	md += `\n**Texte principal (à copier) :**\n\n\`\`\`\n${first.meta.primaryText}\n\`\`\`\n`;
	const hooks = [...new Set(arr.map((a) => plain(a.spec.scenes[0].text ?? '')))].filter(Boolean);
	if (hooks.length > 1) md += `\nVariantes de hook testées : ${hooks.map((h) => `« ${h} »`).join(' · ')}\n`;
}

md += `\n---\n\n## Images\n`;
for (const [concept, arr] of group(images)) {
	const first = arr[0].spec;
	md += `\n### ${concept} · ${first.meta.approach}\n\n| Fichier | Format | Style | Hook | Titre Meta |\n|---|---|---|---|---|\n`;
	for (const it of arr) {
		const ok = exists(it) ? '' : ' ⚠️ non rendu';
		md += `| \`${it.file}\`${ok} | ${FORMAT[it.spec.format]} | ${STYLE[it.spec.style]} | ${it.spec.meta.hook} | ${it.spec.meta.headline} |\n`;
	}
	md += `\n**Texte principal :**\n\n\`\`\`\n${first.meta.primaryText}\n\`\`\`\n`;
	if (concept === 'I07') {
		md += `\n> Carrousel : importer les 7 cartes **dans l'ordre** (carte1 → carte7) dans une seule annonce au format carrousel. Titre par carte : nom du produit ; dernière carte : « كوموندي توّا ».\n`;
	}
}

md += `\n---\n\n## Voix off de test (à valider à l'oreille)\n\n`;
md += `Voix de synthèse tunisienne (Microsoft \`ar-TN-HediNeural\`). Je n'ai pas pu juger l'accent moi-même : **écoute avant toute diffusion**. Si ça sonne littéraire ou pas tunisien, ne les utilise pas (cf. \`SCRIPTS_VOIX_OFF.md\` pour enregistrer ta voix).\n\n`;
for (const it of vo) md += `- \`voix_off_a_valider/${it.file}\` (${Math.round(it.seconds)} s) : ${it.spec.meta.hook}\n`;

md += fs.readFileSync(path.join(ROOT, 'scripts', 'recommandations.md'), 'utf8');
fs.writeFileSync(path.join(OUT, 'CATALOGUE.md'), md);
console.log('out/CATALOGUE.md écrit :', videos.length, 'vidéos,', images.length, 'images,', vo.length, 'VO');
