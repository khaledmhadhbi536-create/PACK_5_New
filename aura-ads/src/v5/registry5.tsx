import React from 'react';
import {Fmt, FmtProvider} from '../v4/kit';
import {L01, L01_DUR} from './LongA';
import {L03, L03_DUR, L07, L07_DUR, L08, L08_DUR} from './LongA2';
import {L02, L02_DUR, L06, L06_DUR} from './LongB';
import {L04, L04_DUR, L05, L05_DUR, L09, L09_DUR, L10, L10_DUR} from './LongC';

/** Vidéos longues V5 : id = nom du fichier final. */
export type V5Entry = {id: string; fmt: Fmt; dur: number; C: React.FC};

const COMPS: Record<string, {C: React.FC; dur: number}> = {
	L01: {C: L01, dur: L01_DUR},
	L02: {C: L02, dur: L02_DUR},
	L03: {C: L03, dur: L03_DUR},
	L04: {C: L04, dur: L04_DUR},
	L05: {C: L05, dur: L05_DUR},
	L06: {C: L06, dur: L06_DUR},
	L07: {C: L07, dur: L07_DUR},
	L08: {C: L08, dur: L08_DUR},
	L09: {C: L09, dur: L09_DUR},
	L10: {C: L10, dur: L10_DUR},
};

const mk = (key: string, slug: string, fmt: Fmt): V5Entry => ({id: `W5-${key}-${slug}-${fmt}`, fmt, dur: COMPS[key].dur, C: COMPS[key].C});

export const V5_VIDEOS: V5Entry[] = [
	mk('L01', 'guide', '9x16'),
	mk('L01', 'guide', '4x5'),
	mk('L02', 'faq', '9x16'),
	mk('L03', 'pourquoi49', '9x16'),
	mk('L03', 'pourquoi49', '4x5'),
	mk('L04', 'rituel', '9x16'),
	mk('L05', 'sidibousaid', '9x16'),
	mk('L06', 'derma', '9x16'),
	mk('L07', '5raisons', '9x16'),
	mk('L07', '5raisons', '4x5'),
	mk('L08', 'colis', '9x16'),
	mk('L08', 'colis', '4x5'),
	mk('L09', 'hdiya', '9x16'),
	mk('L10', 'minuteur', '9x16'),
];

export const V5Video: React.FC<{id: string}> = ({id}) => {
	const e = V5_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<e.C />
		</FmtProvider>
	);
};
