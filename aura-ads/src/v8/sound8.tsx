import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

/** Effets sonores V8 (synthétisés par scripts/sfx_v8.py). */
export type Sfx8Name =
	| 'impact' | 'braam' | 'whoosh' | 'swipe' | 'riser' | 'rev_swell' | 'shimmer'
	| 'pop1' | 'pop2' | 'pop3' | 'pop4' | 'pop5' | 'tick' | 'heartbeat' | 'hit' | 'coin' | 'ding' | 'scribble';

export const Sfx8: React.FC<{at: number; s: Sfx8Name; v?: number}> = ({at, s, v = 0.8}) => (
	<Sequence from={Math.max(0, Math.round(at))} durationInFrames={150} layout="none">
		<Audio src={staticFile(`audio/v8/sfx/${s}.wav`)} volume={v} />
	</Sequence>
);

/**
 * Musique de fond (audio/v8/beat8.wav) baissée pendant la voix.
 * `voice` : fenêtres [début, fin] (en images, relatives au début de la musique) où la voix parle.
 */
export const Bed8: React.FC<{voice: [number, number][]; dur: number; hi?: number; lo?: number}> = ({voice, dur, hi = 0.3, lo = 0.11}) => {
	const R = 8; // rampes
	const duck = (f: number) => {
		let d = 0;
		for (const [a, b] of voice) {
			if (f >= a - R && f <= b + R) {
				const k = f < a ? (f - (a - R)) / R : f > b ? 1 - (f - b) / R : 1;
				d = Math.max(d, k);
			}
		}
		return d;
	};
	return (
		<Audio
			src={staticFile('audio/v8/beat8.wav')}
			loop
			volume={(f) => {
				const fadeIn = Math.min(1, f / 10);
				const fadeOut = Math.min(1, (dur - 1 - f) / 20);
				return Math.max(0, (hi - (hi - lo) * duck(f)) * fadeIn * Math.max(0, fadeOut));
			}}
		/>
	);
};
