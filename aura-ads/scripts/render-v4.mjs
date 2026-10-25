/**
 * Rend les vidéos V4 dans ../out_v4/videos (+ planches de contrôle dans ../out_v4/_qa).
 *   node scripts/render-v4.mjs              toutes
 *   node scripts/render-v4.mjs V01 V03      seulement ces vidéos
 *   --qa-only                               uniquement les planches (pas de mp4)
 *   --set 5                                 série V5 (ids « W5- ») -> ../out_v5
 * Le bundle temporaire est supprimé à la fin (disque C: presque plein).
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia, renderStill} from '@remotion/renderer';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const si = args.indexOf('--set');
const SET = si >= 0 ? args.splice(si, 2)[1] : '4';
const OUT = path.join(ROOT, '..', `out_v${SET}`);
const qaOnly = args.includes('--qa-only');
const only = args.filter((a) => !a.startsWith('--'));
fs.mkdirSync(path.join(OUT, 'videos'), {recursive: true});
fs.mkdirSync(path.join(OUT, '_qa'), {recursive: true});

const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src', 'index.ts'), publicDir: path.join(ROOT, 'public')});
try {
	const comps = (await getCompositions(serveUrl)).filter(
		(c) => c.id.startsWith(`W${SET}-`) && (only.length === 0 || only.some((o) => c.id.includes(o))),
	);
	for (const comp of comps) {
		const secs = Math.round(comp.durationInFrames / comp.fps);
		const name = comp.id.replace(/^W\d-/, `AURA${SET}_`).replace(/-/g, '_') + `_${secs}s`;
		// planche : 12 images réparties
		const qdir = path.join(OUT, '_qa', name);
		fs.mkdirSync(qdir, {recursive: true});
		const n = 12;
		for (let i = 0; i < n; i++) {
			const frame = Math.min(comp.durationInFrames - 1, Math.round(((i + 0.5) / n) * comp.durationInFrames));
			await renderStill({composition: comp, serveUrl, output: path.join(qdir, `qa_${String(i).padStart(2, '0')}.jpeg`), frame, imageFormat: 'jpeg', jpegQuality: 70});
		}
		const cols = comp.height > comp.width ? 6 : 4;
		execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(qdir, 'qa_%02d.jpeg'), '-vf', `scale=360:-1,tile=${cols}x${Math.ceil(n / cols)}`, '-frames:v', '1', path.join(OUT, '_qa', `${name}.jpg`)]);
		if (!qaOnly) {
			await renderMedia({composition: comp, serveUrl, codec: 'h264', crf: 20, audioCodec: 'aac', outputLocation: path.join(OUT, 'videos', `${name}.mp4`), concurrency: 4});
		}
		console.log('ok', name);
	}
} finally {
	fs.rmSync(serveUrl, {recursive: true, force: true});
	// Remotion laisse des dossiers temporaires (images, assets) : on les supprime
	const tmp = process.env.TEMP || process.env.TMP;
	if (tmp) {
		for (const d of fs.readdirSync(tmp)) {
			if (d.startsWith('remotion-') || d.startsWith('react-motion-')) {
				try {
					fs.rmSync(path.join(tmp, d), {recursive: true, force: true});
				} catch {}
			}
		}
	}
}
