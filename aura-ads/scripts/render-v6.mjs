/**
 * Rend les vidéos V6 dans ../out_v6 :
 *   videos/AURA6_<n°>_<concept>_<format>_<durée>s_sansvoix.mp4   (musique + effets)
 *   videos/AURA6_<n°>_<concept>_<format>_<durée>s_voix.mp4       (voix off derja, musique baissée sous la voix)
 *   _qa/<nom>.jpg                                                (planche : frame 0 puis 11 images réparties)
 *
 *   node scripts/render-v6.mjs                toutes
 *   node scripts/render-v6.mjs L01 V03_h2     seulement les ids qui contiennent ces textes
 *   --qa-only                                 uniquement les planches
 *   --mix-only                                refait seulement les versions voix (mp4 sans voix déjà rendus)
 *
 * Les pistes voix viennent de scripts/tts_gemini.py (public/voice/v6/<clé>.wav).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia, renderStill} from '@remotion/renderer';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, '..', 'out_v6');
const args = process.argv.slice(2);
const qaOnly = args.includes('--qa-only');
const mixOnly = args.includes('--mix-only');
const only = args.filter((a) => !a.startsWith('--'));
fs.mkdirSync(path.join(OUT, 'videos'), {recursive: true});
fs.mkdirSync(path.join(OUT, '_qa'), {recursive: true});

// clé voix de chaque id (lue dans le registre, sans exécuter le TSX)
const reg = fs.readFileSync(path.join(ROOT, 'src', 'v6', 'registry6.tsx'), 'utf8');
const voiceOf = (id) => {
	const [, key, slug, extra] = id.split('-');
	if (/^h[123]$/.test(extra)) return `${key}_${extra}`;
	const line = reg.split('\n').find((l) => l.includes(`mk('${key}', '${slug}'`));
	const m = line && line.match(/, '([A-Z0-9_]+)'\)\)?,?\s*$/);
	return m ? m[1] : null;
};

const ff = (...a) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a]);
const probeDur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

/** Version sans voix : on garde la vidéo, on ajoute un fondu de fin au son (0,5 s). */
const finishSilent = (raw, out) => {
	const d = probeDur(raw);
	ff('-i', raw, '-af', `afade=t=out:st=${(d - 0.5).toFixed(2)}:d=0.5`, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out);
};

/**
 * Version voix : la musique est compressée par la voix (sidechain) → elle baisse
 * d'environ 10 dB pendant que la voix parle et remonte dans les silences.
 */
const mixVoice = (silent, voice, out) => {
	const d = probeDur(silent);
	const fc = [
		'[1:a]aresample=48000,aformat=channel_layouts=stereo,volume=1.6,asplit=2[vk][vm]',
		'[0:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.9[bg]',
		'[bg][vk]sidechaincompress=threshold=0.02:ratio=9:attack=15:release=380:makeup=1[duck]',
		`[duck][vm]amix=inputs=2:normalize=0:duration=first,afade=t=out:st=${(d - 0.5).toFixed(2)}:d=0.5,alimiter=limit=0.93[a]`,
	].join(';');
	ff('-i', silent, '-i', voice, '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out);
};

const serveUrl = mixOnly ? null : await bundle({entryPoint: path.join(ROOT, 'src', 'index.ts'), publicDir: path.join(ROOT, 'public')});
try {
	const comps = mixOnly
		? []
		: (await getCompositions(serveUrl)).filter((c) => c.id.startsWith('W6-') && (only.length === 0 || only.some((o) => c.id.includes(o))));
	const names = [];
	for (const comp of comps) {
		const secs = Math.round(comp.durationInFrames / comp.fps);
		const name = comp.id.replace(/^W6-/, 'AURA6_').replace(/-/g, '_') + `_${secs}s`;
		names.push([comp.id, name]);
		// planche : frame 0 (contrôle de l'accroche) puis 11 images réparties
		const qdir = path.join(OUT, '_qa', name);
		fs.mkdirSync(qdir, {recursive: true});
		const frames = [0, ...Array.from({length: 11}, (_, i) => Math.min(comp.durationInFrames - 1, Math.round(((i + 1) / 12) * comp.durationInFrames)))];
		for (let i = 0; i < frames.length; i++) {
			await renderStill({composition: comp, serveUrl, output: path.join(qdir, `qa_${String(i).padStart(2, '0')}.jpeg`), frame: frames[i], imageFormat: 'jpeg', jpegQuality: 70});
		}
		const cols = comp.height > comp.width ? 6 : 4;
		ff('-i', path.join(qdir, 'qa_%02d.jpeg'), '-vf', `scale=360:-1,tile=${cols}x${Math.ceil(frames.length / cols)}`, '-frames:v', '1', path.join(OUT, '_qa', `${name}.jpg`));
		if (!qaOnly) {
			const raw = path.join(os.tmpdir(), `${name}_raw.mp4`);
			await renderMedia({composition: comp, serveUrl, codec: 'h264', crf: 20, audioCodec: 'aac', audioBitrate: '256k', outputLocation: raw, concurrency: 4});
			finishSilent(raw, path.join(OUT, 'videos', `${name}_sansvoix.mp4`));
			fs.rmSync(raw, {force: true});
		}
		console.log('ok', name);
	}
	// versions voix
	if (!qaOnly) {
		const list = mixOnly
			? fs
					.readdirSync(path.join(OUT, 'videos'))
					.filter((f) => f.endsWith('_sansvoix.mp4') && (only.length === 0 || only.some((o) => f.includes(o))))
					.map((f) => {
						const base = f.replace('_sansvoix.mp4', '');
						// AURA6_V01_offre_h1_9x16_12s → W6-V01-offre-h1-9x16
						const parts = base.split('_').slice(1, -1);
						return [`W6-${parts.join('-')}`, base];
					})
			: names;
		for (const [id, name] of list) {
			const key = voiceOf(id);
			if (!key) continue;
			const voice = path.join(ROOT, 'public', 'voice', 'v6', `${key}.wav`);
			if (!fs.existsSync(voice)) {
				console.log('  (pas de voix pour', key, ')');
				continue;
			}
			mixVoice(path.join(OUT, 'videos', `${name}_sansvoix.mp4`), voice, path.join(OUT, 'videos', `${name}_voix.mp4`));
			console.log('ok voix', name, '←', key);
		}
	}
} finally {
	if (serveUrl) fs.rmSync(serveUrl, {recursive: true, force: true});
}
