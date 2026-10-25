/**
 * Rendu de la bibliothèque Aura Bio.
 *
 *   node scripts/render-all.mjs                 tout (vidéos + images + catalogue)
 *   node scripts/render-all.mjs --only C01      seulement ce qui contient « C01 »
 *   node scripts/render-all.mjs --qa            + captures de contrôle (out/_qa)
 *   node scripts/render-all.mjs --qa-only       captures seulement (rapide)
 *   node scripts/render-all.mjs --skip-existing ne refait pas les fichiers déjà rendus
 *   node scripts/render-all.mjs --videos | --images
 */
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia, renderStill} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(ROOT, '..', 'out');
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const QA = flag('--qa') || flag('--qa-only');
const QA_ONLY = flag('--qa-only');
const SKIP = flag('--skip-existing');
const wantVideos = !flag('--images');
const wantImages = !flag('--videos');
const T = 8;

const fileName = (id) => id.replace(/-/g, '_');

fs.mkdirSync(path.join(OUT, 'videos'), {recursive: true});
fs.mkdirSync(path.join(OUT, 'images'), {recursive: true});
if (QA) fs.mkdirSync(path.join(OUT, '_qa'), {recursive: true});

console.log('Bundling…');
const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src/index.ts'), publicDir: path.join(ROOT, 'public')});
const comps = await getCompositions(serveUrl);

/** frames de contrôle : 0,5 s, 2 s (hook), milieu de chaque scène, fin */
const qaFrames = (comp) => {
	const ad = comp.props.ad;
	const t = ad.transition === 'none' ? 0 : T;
	const frames = new Set([15, 60]);
	let acc = 0;
	for (const s of ad.scenes) {
		const d = Math.round(s.dur * 30);
		frames.add(Math.min(comp.durationInFrames - 1, acc + Math.round(d * 0.6)));
		acc += d - t;
	}
	frames.add(comp.durationInFrames - 2);
	return [...frames].filter((f) => f < comp.durationInFrames).sort((a, b) => a - b);
};

const sheet = (dir, outFile, cols) => {
	const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jpeg') || f.endsWith('.png')).sort();
	if (!files.length) return;
	const n = files.length;
	const c = cols ?? Math.min(n, 6);
	const rows = Math.ceil(n / c);
	execFileSync('ffmpeg', [
		'-v', 'error', '-y',
		'-i', path.join(dir, 'qa_%02d.jpeg'),
		'-vf', `scale=360:-1,pad=iw+8:ih+8:4:4:color=white,tile=${c}x${rows}`,
		'-frames:v', '1', outFile,
	]);
};

const selected = comps.filter((c) => !only || c.id.includes(only));
const isStill = (c) => !!c.props.spec;
const videos = selected.filter((c) => !isStill(c));
const stills = selected.filter(isStill);

let i = 0;
if (wantVideos) {
	for (const comp of videos) {
		i++;
		const name = fileName(comp.id);
		const folder = comp.props.ad.voiceover ? 'voix_off_a_valider' : 'videos';
		fs.mkdirSync(path.join(OUT, folder), {recursive: true});
		const dest = path.join(OUT, folder, `${name}.mp4`);
		if (!QA_ONLY && !(SKIP && fs.existsSync(dest))) {
			const t0 = Date.now();
			let last = -1;
			await renderMedia({
				composition: comp,
				serveUrl,
				codec: 'h264',
				crf: 21,
				audioCodec: 'aac',
				outputLocation: dest,
				concurrency: 6,
				imageFormat: 'jpeg',
				jpegQuality: 92,
				onProgress: ({progress}) => process.stdout.write(`\r[${i}/${videos.length}] ${name} ${(progress * 100).toFixed(0)}%   `),
			});
			console.log(`\r[${i}/${videos.length}] ${name} ✓ ${((Date.now() - t0) / 1000).toFixed(0)}s          `);
		}
		if (QA) {
			const dir = path.join(OUT, '_qa', name);
			fs.rmSync(dir, {recursive: true, force: true});
			fs.mkdirSync(dir, {recursive: true});
			const frames = qaFrames(comp);
			for (let k = 0; k < frames.length; k++) {
				await renderStill({
					composition: comp,
					serveUrl,
					frame: frames[k],
					output: path.join(dir, `qa_${String(k).padStart(2, '0')}.jpeg`),
					imageFormat: 'jpeg',
					jpegQuality: 85,
				});
			}
			sheet(dir, path.join(OUT, '_qa', `${name}.jpg`));
		}
	}
}

if (wantImages) {
	let j = 0;
	for (const comp of stills) {
		j++;
		const name = fileName(comp.id);
		const dest = path.join(OUT, 'images', `${name}.jpg`);
		if (SKIP && fs.existsSync(dest)) continue;
		await renderStill({composition: comp, serveUrl, output: dest, frame: 150, imageFormat: 'jpeg', jpegQuality: 95});
		console.log(`[img ${j}/${stills.length}] ${name} ✓`);
	}
}

// Données pour le catalogue
const catalogue = comps.map((c) => ({
	id: c.id,
	file: fileName(c.id) + (isStill(c) ? '.jpg' : '.mp4'),
	type: isStill(c) ? 'image' : 'video',
	seconds: +(c.durationInFrames / 30).toFixed(1),
	width: c.width,
	height: c.height,
	spec: c.props.ad ?? c.props.spec,
}));
fs.writeFileSync(path.join(ROOT, 'catalogue.json'), JSON.stringify(catalogue, null, 2));
console.log('Terminé.');
