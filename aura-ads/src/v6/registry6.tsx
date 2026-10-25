import React from 'react';
import {Sequence} from 'remotion';
import {Fmt, FmtProvider} from '../v4/kit';
import {V03, V03_DUR, V04, V04_DUR} from '../v4/Offers';
import {V09, V09_DUR, V13, V13_DUR, V14, V14_DUR} from '../v4/Rushes';
import {L01_6, L01_6_DUR, L04_6, L04_6_DUR, L07_6, L07_6_DUR, L08_6, L08_6_DUR, L10_6, L10_6_DUR} from './Long6';
import {V01_6, V01_6_DUR, V03_6, V03_6_DUR, V05_6, V05_6_DUR, V08_6, V08_6_DUR} from './Short6';

/**
 * Vidéos V6 : id = nom du fichier final (« W6- » → « AURA6_ »).
 * `voice` = clé de la piste voix off (scripts/voice_v6.json) ; absente = pas de version voix.
 */
export type V6Entry = {id: string; fmt: Fmt; dur: number; C: React.FC; voice?: string};

const mk = (key: string, slug: string, fmt: Fmt, C: React.FC, dur: number, voice?: string): V6Entry => ({id: `W6-${key}-${slug}-${fmt}`, fmt, dur, C, voice});

const hook = <P extends {v: 1 | 2 | 3}>(Comp: React.FC<P>, v: 1 | 2 | 3): React.FC => {
	const H: React.FC = () => <Comp {...({v} as P)} />;
	return H;
};

const BOTH: Fmt[] = ['9x16', '4x5'];

/** Démarre la vidéo V4 `skip` images plus loin : les titres sont déjà posés à la frame 0. */
const SKIP = 8;
const late = (C: React.FC): React.FC => {
	const L: React.FC = () => (
		<Sequence from={-SKIP}>
			<C />
		</Sequence>
	);
	return L;
};

export const V6_VIDEOS: V6Entry[] = [
	// 1. longues : accroche lisible dès la frame 0
	...BOTH.map((f) => mk('L01', 'guide', f, L01_6, L01_6_DUR, 'L01')),
	...BOTH.map((f) => mk('L07', '5raisons', f, L07_6, L07_6_DUR, 'L07')),
	...BOTH.map((f) => mk('L08', 'colis', f, L08_6, L08_6_DUR, 'L08')),
	// 2. plan « lavage » (et « massage ») net
	...BOTH.map((f) => mk('V08', 'etapes', f, V08_6, V08_6_DUR, 'V08')),
	mk('L10', 'minuteur', '9x16', L10_6, L10_6_DUR, 'L10'),
	mk('L04', 'rituel', '9x16', L04_6, L04_6_DUR, 'L04'),
	// 3. trois accroches pour V01, V03, V05
	...([1, 2, 3] as const).flatMap((v) => BOTH.map((f) => mk('V01', `offre-h${v}`, f, hook(V01_6, v), V01_6_DUR, `V01_h${v}`))),
	...([1, 2, 3] as const).flatMap((v) => BOTH.map((f) => mk('V03', `prixbarre-h${v}`, f, hook(V03_6, v), V03_6_DUR, `V03_h${v}`))),
	...([1, 2, 3] as const).flatMap((v) => BOTH.map((f) => mk('V05', `toutca-h${v}`, f, hook(V05_6, v), V05_6_DUR, `V05_h${v}`))),
	// 4:5 manquants en V4 (pour la campagne : 9:16 + 4:5 dans la même pub), sans voix
	mk('V03', 'prixbarre', '4x5', late(V03), V03_DUR - SKIP),
	mk('V04', 'comparatif', '4x5', V04, V04_DUR),
	mk('V09', 'cod', '4x5', late(V09), V09_DUR - SKIP),
	mk('V13', 'asmr', '4x5', late(V13), V13_DUR - SKIP),
	mk('V14', 'pov', '4x5', late(V14), V14_DUR - SKIP),
];

export const V6Video: React.FC<{id: string}> = ({id}) => {
	const e = V6_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<e.C />
		</FmtProvider>
	);
};
