import React from 'react';
import {Fmt, FmtProvider} from '../v4/kit';
import {L01_7, L01_7_DUR, L04_7, L04_7_DUR, L08_7, L08_7_DUR, L10_7, L10_7_DUR} from './Long7';
import {V08_7, V08_7_DUR} from './Short7';

/**
 * Vidéos V7 : les vidéos V6 dont les étapes huile, massage et sidr sont remplacées par les
 * rushs « perso ». Mêmes durées que V6 : on réutilise les voix V6 (public/voice/v6/<voice>.wav).
 * id = nom du fichier final (« W7- » → « AURA7_ »).
 */
export type V7Entry = {id: string; fmt: Fmt; dur: number; C: React.FC; voice?: string};

const mk = (key: string, slug: string, fmt: Fmt, C: React.FC, dur: number, voice?: string): V7Entry => ({id: `W7-${key}-${slug}-${fmt}`, fmt, dur, C, voice});
const BOTH: Fmt[] = ['9x16', '4x5'];

export const V7_VIDEOS: V7Entry[] = [
	...BOTH.map((f) => mk('V08', 'etapes', f, V08_7, V08_7_DUR, 'V08')),
	...BOTH.map((f) => mk('L01', 'guide', f, L01_7, L01_7_DUR, 'L01')),
	...BOTH.map((f) => mk('L08', 'colis', f, L08_7, L08_7_DUR, 'L08')),
	mk('L10', 'minuteur', '9x16', L10_7, L10_7_DUR, 'L10'),
	mk('L04', 'rituel', '9x16', L04_7, L04_7_DUR, 'L04'),
];

export const V7Video: React.FC<{id: string}> = ({id}) => {
	const e = V7_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<e.C />
		</FmtProvider>
	);
};
