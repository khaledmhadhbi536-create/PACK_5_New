/**
 * Rend les créas V2 dans ../out_v2.
 *   node scripts/render-v2.mjs                 toutes les images V2  -> ../out_v2
 *   node scripts/render-v2.mjs P1 P3           seulement celles dont l'id contient P1 ou P3
 *   node scripts/render-v2.mjs --set 3 [N2]    série V3 (ids « W3- »)  -> ../out_v3
 * Le bundle temporaire est supprimé à la fin (le disque C: est presque plein).
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const si = args.indexOf('--set');
const set = si >= 0 ? args.splice(si, 2)[1] : '2';
const OUT = path.join(ROOT, '..', `out_v${set}`);
fs.mkdirSync(path.join(OUT, 'images'), {recursive: true});
const only = args;

const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src', 'index.ts'), publicDir: path.join(ROOT, 'public')});
try {
	const comps = (await getCompositions(serveUrl)).filter(
		(c) => c.id.startsWith(`W${set}-`) && (only.length === 0 || only.some((o) => c.id.includes(o))),
	);
	for (const comp of comps) {
		const name = comp.id.replace(/^W\d-/, `AURA${set}_`).replace(/-/g, '_');
		const output = path.join(OUT, 'images', `${name}.jpg`);
		await renderStill({composition: comp, serveUrl, output, frame: 0, imageFormat: 'jpeg', jpegQuality: 95});
		console.log('ok', name);
	}
} finally {
	fs.rmSync(serveUrl, {recursive: true, force: true});
}
