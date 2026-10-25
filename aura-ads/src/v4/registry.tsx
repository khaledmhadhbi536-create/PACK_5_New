import React from 'react';
import {Fmt, FmtProvider} from './kit';
import {V01, V01_DUR} from './V01';
import {V05, V05_DUR, V06, V06_DUR, V07, V07_DUR, V08, V08_DUR, V09, V09_DUR, V11, V11_DUR, V13, V13_DUR, V14, V14_DUR} from './Rushes';
import {V02, V02_DUR, V03, V03_DUR, V04, V04_DUR, V10, V10_DUR, V12, V12_DUR} from './Offers';

/** Les vidéos V4 : id = nom du fichier final. */
export type V4Entry = {id: string; fmt: Fmt; dur: number; C: React.FC};

const COMPS: Record<string, {C: React.FC; dur: number}> = {
	V01: {C: V01, dur: V01_DUR},
	V02: {C: V02, dur: V02_DUR},
	V03: {C: V03, dur: V03_DUR},
	V04: {C: V04, dur: V04_DUR},
	V10: {C: V10, dur: V10_DUR},
	V12: {C: V12, dur: V12_DUR},
	V05: {C: V05, dur: V05_DUR},
	V06: {C: V06, dur: V06_DUR},
	V07: {C: V07, dur: V07_DUR},
	V08: {C: V08, dur: V08_DUR},
	V09: {C: V09, dur: V09_DUR},
	V11: {C: V11, dur: V11_DUR},
	V13: {C: V13, dur: V13_DUR},
	V14: {C: V14, dur: V14_DUR},
};

const mk = (key: string, slug: string, fmt: Fmt): V4Entry => ({
	id: `W4-${key}-${slug}-${fmt}`,
	fmt,
	dur: COMPS[key].dur,
	C: COMPS[key].C,
});

export const V4_VIDEOS: V4Entry[] = [
	mk('V01', 'offre', '9x16'),
	mk('V01', 'offre', '4x5'),
	mk('V02', 'calcul', '9x16'),
	mk('V02', 'calcul', '4x5'),
	mk('V03', 'prixbarre', '9x16'),
	mk('V03', 'prixbarre', '1x1'),
	mk('V04', 'comparatif', '9x16'),
	mk('V10', 'hiver', '9x16'),
	mk('V10', 'hiver', '4x5'),
	mk('V12', 'blackfriday', '9x16'),
	mk('V12', 'blackfriday', '1x1'),
	mk('V05', 'toutca', '9x16'),
	mk('V05', 'toutca', '4x5'),
	mk('V06', 'sidr', '9x16'),
	mk('V07', 'derma540', '9x16'),
	mk('V08', 'etapes', '9x16'),
	mk('V08', 'etapes', '4x5'),
	mk('V09', 'cod', '9x16'),
	mk('V11', 'cadeau', '9x16'),
	mk('V13', 'asmr', '9x16'),
	mk('V14', 'pov', '9x16'),
];

export const V4Video: React.FC<{id: string}> = ({id}) => {
	const e = V4_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<e.C />
		</FmtProvider>
	);
};
