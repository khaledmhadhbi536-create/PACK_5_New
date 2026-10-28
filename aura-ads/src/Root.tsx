import React from 'react';
import {Composition, Folder} from 'remotion';
import {ADS, VO_TESTS} from './data/ads';
import {STILLS} from './data/stills';
import type {AdSpec, StillSpec} from './data/types';
import {AdStill} from './stills/AdStill';
import {AdVideo, adDuration} from './templates/AdVideo';
import {FORMATS, FPS} from './theme/brand';
import './theme/fonts';
import {WIN_STILLS, WinStill} from './v2/WinStill';
import {V3_STILLS, V3Still} from './v3/V3Still';
import {V4_VIDEOS, V4Video} from './v4/registry';
import {stageFor} from './v4/kit';
import {V5_VIDEOS, V5Video} from './v5/registry5';
import {V6_VIDEOS, V6Video} from './v6/registry6';
import {V7_VIDEOS, V7Video} from './v7/registry7';

/** Identifiant = nom du fichier final (les « - » deviennent « _ »). */
export const adId = (ad: AdSpec) => {
	const secs = Math.round(adDuration(ad) / FPS);
	return `AURA-${ad.concept}-${ad.slug}-${ad.format}-${secs}s-${ad.variant}`;
};
/** Les images sont rendues à cette frame : toutes les animations sont terminées. */
export const STILL_FRAME = 150;
export const stillId = (s: StillSpec) => `AURA-${s.concept}-${s.slug}-${s.format}-${s.variant}`;

const byConcept = <T extends {concept: string}>(items: T[]) => {
	const m = new Map<string, T[]>();
	for (const it of items) m.set(it.concept, [...(m.get(it.concept) ?? []), it]);
	return [...m.entries()];
};

export const Root: React.FC = () => (
	<>
		<Folder name="Videos">
			{byConcept([...ADS, ...VO_TESTS]).map(([concept, ads]) => (
				<Folder key={concept} name={concept}>
					{ads.map((ad) => (
						<Composition
							key={adId(ad)}
							id={adId(ad)}
							component={AdVideo}
							durationInFrames={adDuration(ad)}
							fps={FPS}
							width={FORMATS[ad.format].width}
							height={FORMATS[ad.format].height}
							defaultProps={{ad}}
						/>
					))}
				</Folder>
			))}
		</Folder>
		<Folder name="Images">
			{byConcept(STILLS).map(([concept, stills]) => (
				<Folder key={concept} name={concept}>
					{stills.map((s) => (
						<Composition
							key={stillId(s)}
							id={stillId(s)}
							component={AdStill}
							durationInFrames={STILL_FRAME + 1}
							fps={FPS}
							width={FORMATS[s.format].width}
							height={FORMATS[s.format].height}
							defaultProps={{spec: s}}
						/>
					))}
				</Folder>
			))}
		</Folder>
		<Folder name="V2-Images">
			{WIN_STILLS.map((s) => (
				<Composition key={s.id} id={s.id} component={WinStill} durationInFrames={1} fps={FPS} width={1080} height={1350} defaultProps={{spec: s}} />
			))}
		</Folder>
		<Folder name="V3-Images">
			{V3_STILLS.map((s) => (
				<Composition key={s.id} id={s.id} component={V3Still} durationInFrames={1} fps={FPS} width={1080} height={1350} defaultProps={{spec: s}} />
			))}
		</Folder>
		<Folder name="V4-Videos">
			{V4_VIDEOS.map((v) => (
				<Composition key={v.id} id={v.id} component={V4Video} durationInFrames={v.dur} fps={FPS} width={stageFor(v.fmt).W} height={stageFor(v.fmt).H} defaultProps={{id: v.id}} />
			))}
		</Folder>
		<Folder name="V5-Long">
			{V5_VIDEOS.map((v) => (
				<Composition key={v.id} id={v.id} component={V5Video} durationInFrames={v.dur} fps={FPS} width={stageFor(v.fmt).W} height={stageFor(v.fmt).H} defaultProps={{id: v.id}} />
			))}
		</Folder>
		<Folder name="V6">
			{V6_VIDEOS.map((v) => (
				<Composition key={v.id} id={v.id} component={V6Video} durationInFrames={v.dur} fps={FPS} width={stageFor(v.fmt).W} height={stageFor(v.fmt).H} defaultProps={{id: v.id}} />
			))}
		</Folder>
		<Folder name="V7">
			{V7_VIDEOS.map((v) => (
				<Composition key={v.id} id={v.id} component={V7Video} durationInFrames={v.dur} fps={FPS} width={stageFor(v.fmt).W} height={stageFor(v.fmt).H} defaultProps={{id: v.id}} />
			))}
		</Folder>
	</>
);
