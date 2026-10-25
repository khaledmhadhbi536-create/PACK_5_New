import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {Grain, Logo} from '../components/Brand';
import type {AdSpec, Scene} from '../data/types';
import {AdContext} from '../scenes/context';
import {SCENES} from '../scenes/Scenes';
import {FPS, STYLES, useFormat} from '../theme/brand';

export const TRANSITION_FRAMES = 8;

const sceneFrames = (s: Scene) => Math.round(s.dur * FPS);

/** Durée totale en frames (les transitions chevauchent les scènes). */
export const adDuration = (ad: AdSpec) => {
	const sum = ad.scenes.reduce((a, s) => a + sceneFrames(s), 0);
	const overlaps = ad.transition === 'none' ? 0 : TRANSITION_FRAMES * (ad.scenes.length - 1);
	return sum - overlaps;
};

/** Frame de début de chaque scène dans la timeline finale. */
const sceneStarts = (ad: AdSpec) => {
	const t = ad.transition === 'none' ? 0 : TRANSITION_FRAMES;
	const starts: number[] = [];
	let acc = 0;
	for (const s of ad.scenes) {
		starts.push(acc);
		acc += sceneFrames(s) - t;
	}
	return starts;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const presentation = (kind: AdSpec['transition']): any => {
	switch (kind) {
		case 'slide':
			return slide({direction: 'from-left'});
		case 'wipe':
			return wipe({direction: 'from-left'});
		default:
			return fade();
	}
};

const SceneSwitch: React.FC<{scene: Scene}> = ({scene}) => {
	const Comp = SCENES[scene.kind] as React.FC<{scene: Scene}>;
	return <Comp scene={scene} />;
};

/** Petit logo permanent en haut, dans la zone de sécurité. */
const BrandBug: React.FC<{dark: boolean}> = ({dark}) => {
	const {safe, k} = useFormat();
	return (
		<div style={{position: 'absolute', top: safe.top + 6, left: safe.x, opacity: 0.92}}>
			<Logo size={44 * k} light={dark} />
		</div>
	);
};

export const AdVideo: React.FC<{ad: AdSpec}> = ({ad}) => {
	const {durationInFrames} = useVideoConfig();
	const theme = STYLES[ad.style];
	const starts = sceneStarts(ad);
	const hasVo = !!ad.voiceover;
	const musicVol = hasVo ? 0.22 : 0.62;

	return (
		<AdContext.Provider value={{style: ad.style, theme}}>
			<AbsoluteFill style={{background: theme.bg}}>
				{ad.transition === 'none' ? (
					ad.scenes.map((s, i) => (
						<Sequence key={i} from={starts[i]} durationInFrames={sceneFrames(s)} name={`${i + 1}. ${s.kind}`}>
							<SceneSwitch scene={s} />
						</Sequence>
					))
				) : (
					<TransitionSeries>
						{ad.scenes.flatMap((s, i) => {
							const items = [
								<TransitionSeries.Sequence key={`s${i}`} durationInFrames={sceneFrames(s)} name={`${i + 1}. ${s.kind}`}>
									<SceneSwitch scene={s} />
								</TransitionSeries.Sequence>,
							];
							if (i < ad.scenes.length - 1) {
								items.push(
									<TransitionSeries.Transition
										key={`t${i}`}
										presentation={presentation(ad.transition)}
										timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
									/>,
								);
							}
							return items;
						})}
					</TransitionSeries>
				)}

				{/* le logo reste visible sauf sur les scènes qui l'affichent déjà en grand */}
				{ad.scenes.map((s, i) =>
					['cta', 'heritage', 'offer', 'steps', 'pack', 'grid'].includes(s.kind) ? null : (
						<Sequence key={`b${i}`} from={starts[i]} durationInFrames={sceneFrames(s)} layout="none">
							<BrandBug dark={theme.dark || s.kind === 'rush' || s.kind === 'photo' || (s.kind === 'hook' && s.visual.type !== 'pack' && s.visual.type !== 'product')} />
						</Sequence>
					),
				)}

				<Grain opacity={ad.style === 'nat' || ad.style === 'ugc' ? 0.08 : 0.05} />

				{/* musique */}
				<Audio
					src={staticFile(`audio/${ad.music}.wav`)}
					trimBefore={Math.round((ad.musicStart ?? 0) * FPS)}
					volume={(f) =>
						interpolate(f, [0, 6, durationInFrames - 24, durationInFrames - 1], [0, musicVol, musicVol, 0], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						})
					}
				/>
				{hasVo ? <Audio src={staticFile(ad.voiceover!)} volume={1} /> : null}

				{/* effets sonores aux changements de scène et sur l'offre */}
				{starts.slice(1).map((st, i) => (
					<Sequence key={`w${i}`} from={Math.max(0, st - 4)} durationInFrames={20} layout="none">
						<Audio src={staticFile('audio/sfx_whoosh.wav')} volume={0.28} />
					</Sequence>
				))}
				{ad.scenes.map((s, i) =>
					s.kind === 'offer' || s.kind === 'cta' ? (
						<Sequence key={`p${i}`} from={starts[i] + (s.kind === 'offer' ? 14 : 4)} durationInFrames={45} layout="none">
							<Audio src={staticFile('audio/sfx_ding.wav')} volume={0.35} />
						</Sequence>
					) : null,
				)}
			</AbsoluteFill>
		</AdContext.Provider>
	);
};
