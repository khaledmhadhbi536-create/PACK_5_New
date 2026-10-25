import React from 'react';
import RUSH_DURATIONS from '../data/rush-durations.json';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const grade = (warm = 0) =>
	`contrast(1.08) saturate(1.12) brightness(1.03) sepia(${warm})`;

/**
 * Rush vidéo.
 *  - mode "cover" : plein cadre (léger zoom lent)
 *  - mode "card"  : carte arrondie au centre sur fond flou de la même vidéo
 *                   (idéal pour les rushs basse définition)
 */
export const Rush: React.FC<{
	src: string;
	mode?: 'cover' | 'card';
	trim?: number;
	rate?: number;
	zoom?: [number, number];
	focusY?: number;
	focusX?: number;
	cardTop?: number;
	cardHeight?: number;
	cardWidth?: number;
	warm?: number;
	darken?: number;
}> = ({
	src,
	mode = 'cover',
	trim = 0,
	rate = 1,
	zoom = [1.04, 1.14],
	focusY = 50,
	focusX = 50,
	cardTop,
	cardHeight,
	cardWidth,
	warm = 0.06,
	darken = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames, width, height} = useVideoConfig();
	const z = interpolate(frame, [0, durationInFrames], zoom);
	const isImage = /\.(jpe?g|png|webp)$/i.test(src);
	// Si le rush est plus court que la scène, on le ralentit pour qu'il la couvre entièrement.
	const srcDur = (RUSH_DURATIONS as Record<string, number>)[src] ?? Infinity;
	const playbackRate = Math.min(rate, (srcDur - trim - 0.05) / (durationInFrames / fps + 0.1));
	const video = (style: React.CSSProperties) =>
		isImage ? (
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />
		) : (
		<OffthreadVideo
			src={staticFile(src)}
			muted
			trimBefore={Math.round(trim * fps)}
			playbackRate={Math.max(0.25, playbackRate)}
			style={{width: '100%', height: '100%', objectFit: 'cover', ...style}}
		/>
	);
	if (mode === 'cover') {
		return (
			<AbsoluteFill style={{overflow: 'hidden'}}>
				{video({scale: String(z), objectPosition: `${focusX}% ${focusY}%`, filter: grade(warm)})}
				{darken ? <AbsoluteFill style={{background: `rgba(0,0,0,${darken})`}} /> : null}
			</AbsoluteFill>
		);
	}
	const cw = cardWidth ?? width * 0.84;
	const ch = cardHeight ?? height * 0.5;
	const ct = cardTop ?? (height - ch) / 2;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{video({scale: '1.35', filter: `blur(38px) brightness(0.55) saturate(1.2)`})}
			<div
				style={{
					position: 'absolute',
					left: (width - cw) / 2,
					top: ct,
					width: cw,
					height: ch,
					borderRadius: 38,
					overflow: 'hidden',
					boxShadow: '0 40px 80px rgba(0,0,0,0.45)',
					border: '3px solid rgba(255,255,255,0.18)',
				}}
			>
				{video({scale: String(z), objectPosition: `${focusX}% ${focusY}%`, filter: grade(warm)})}
			</div>
			{darken ? <AbsoluteFill style={{background: `rgba(0,0,0,${darken})`}} /> : null}
		</AbsoluteFill>
	);
};

/** Photo avec mouvement Ken Burns. */
export const KenBurns: React.FC<{
	src: string;
	from?: number;
	to?: number;
	focusY?: number;
	darken?: number;
	style?: React.CSSProperties;
}> = ({src, from = 1.05, to = 1.18, focusY = 50, darken = 0, style}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill style={{overflow: 'hidden', ...style}}>
			<Img
				src={staticFile(src)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					objectPosition: `50% ${focusY}%`,
					scale: String(interpolate(frame, [0, durationInFrames], [from, to])),
				}}
			/>
			{darken ? <AbsoluteFill style={{background: `rgba(0,0,0,${darken})`}} /> : null}
		</AbsoluteFill>
	);
};

/** Dégradé pour garantir la lisibilité du texte sur une image. */
export const Scrim: React.FC<{from?: number; to?: number; color?: string; dir?: 'top' | 'bottom' | 'mid'}> = ({
	from = 0,
	to = 0.75,
	color = '0,0,0',
	dir = 'mid',
}) => {
	const bg =
		dir === 'mid'
			? `linear-gradient(180deg, rgba(${color},${from}) 0%, rgba(${color},${to}) 30%, rgba(${color},${to}) 62%, rgba(${color},${from}) 100%)`
			: dir === 'top'
				? `linear-gradient(180deg, rgba(${color},${to}) 0%, rgba(${color},${from}) 60%)`
				: `linear-gradient(0deg, rgba(${color},${to}) 0%, rgba(${color},${from}) 60%)`;
	return <AbsoluteFill style={{background: bg}} />;
};
