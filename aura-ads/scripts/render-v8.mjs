/**
 * Rend les vidéos V8 dans ../out_v8 (vidéo + planche de contrôle, frame 0 en premier).
 *   node scripts/render-v8.mjs              toutes
 *   node scripts/render-v8.mjs hook 9x16    seulement les ids qui contiennent tous ces textes
 *   --qa-only                               planches seulement
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia, renderStill} from '@remotion/renderer';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, '..', 'out_v8');
const args = process.argv.slice(2);
const qaOnly = args.includes('--qa-only');
const only = args.filter((a) => !a.startsWith('--'));
fs.mkdirSync(path.join(OUT, 'videos'), {recursive: true});
fs.mkdirSync(path.join(OUT, '_qa'), {recursive: true});

const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src', 'index.ts'), publicDir: path.join(ROOT, 'public')});
try {
	const comps = (await getCompositions(serveUrl)).filter((c) => c.id.startsWith('W8-') && only.every((o) => c.id.includes(o)));
	for (const comp of comps) {
		const secs = Math.round(comp.durationInFrames / comp.fps);
		const name = comp.id.replace(/^W8-/, 'AURA8_').replace(/-/g, '_') + `_${secs}s`;
		const qdir = path.join(OUT, '_qa', name);
		fs.mkdirSync(qdir, {recursive: true});
		const n = 8;
		const frames = [0, ...Array.from({length: n - 1}, (_, i) => Math.min(comp.durationInFrames - 1, Math.round(((i + 1) / n) * comp.durationInFrames)))];
		for (let i = 0; i < frames.length; i++) {
			await renderStill({composition: comp, serveUrl, output: path.join(qdir, `qa_${String(i).padStart(2, '0')}.jpeg`), frame: frames[i], imageFormat: 'jpeg', jpegQuality: 75});
		}
		const cols = comp.height > comp.width ? 8 : 4;
		execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(qdir, 'qa_%02d.jpeg'), '-vf', `scale=320:-1,tile=${cols}x${Math.ceil(n / cols)}`, '-frames:v', '1', path.join(OUT, '_qa', `${name}.jpg`)]);
		if (!qaOnly) {
			await renderMedia({composition: comp, serveUrl, codec: 'h264', crf: 18, audioCodec: 'aac', outputLocation: path.join(OUT, 'videos', `${name}.mp4`), concurrency: 4});
		}
		console.log('ok', name);
	}
} finally {
	fs.rmSync(serveUrl, {recursive: true, force: true});
}
