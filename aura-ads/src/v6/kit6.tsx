import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Badge} from '../v2/WinStill';
import {Abs, Clip, useStage} from '../v4/kit';
import {Caption, KText, Photo, Scrim} from '../v5/kit5';

/**
 * Kit V6 : briques communes.
 * Règle V6 : la première image de chaque vidéo montre déjà l'accroche, lisible
 * (pas d'écran vide, pas d'aplat, pas d'entrée animée qui part de zéro).
 */

/** Texte déjà entièrement affiché à la frame 0 (KText avec un départ dans le passé). */
export const StaticText: React.FC<React.ComponentProps<typeof KText>> = (p) => <KText {...p} delay={-60} stagger={0} />;

/** Titre blanc lisible posé sur une vidéo, affiché d'emblée. */
export const OnVideoStatic: React.FC<{text: string; size?: number}> = ({text, size = 88}) => (
	<StaticText text={text} size={size} color="#fff" accent="#FFD43B" shadow="0 6px 22px rgba(0,0,0,0.85), 0 2px 0 rgba(0,0,0,0.6)" />
);

/** Légère respiration continue (l'image bouge, mais rien n'est caché au départ). */
export const Breathe: React.FC<{amp?: number; speed?: number; children: React.ReactNode}> = ({amp = 0.025, speed = 0.16, children}) => {
	const f = useCurrentFrame();
	return <div style={{transform: `scale(${1 + amp * Math.sin(f * speed)})`}}>{children}</div>;
};

/**
 * Plan d'ouverture des longues : vidéo plein cadre (sans zoom d'entrée), accroche en haut
 * et légende en bas, tout est visible dès la frame 0.
 */
export const HookShot: React.FC<{src: string; trim?: number; rate?: number; pos?: string; hook: string; hookSize?: number; title?: string; sub?: string; children?: React.ReactNode}> = ({
	src,
	trim,
	rate,
	pos,
	hook,
	hookSize = 92,
	title,
	sub,
	children,
}) => {
	const {vertical, top: st, h} = useStage();
	const low = vertical ? st + h - 250 : 1350 - 300;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Clip src={src} trim={trim} rate={rate} pos={pos} />
			<Scrim top={0.55} bottom={0.55} />
			<Abs top={vertical ? st + 90 : 90} left={50} right={50}>
				<Breathe>
					<OnVideoStatic text={hook} size={hookSize} />
				</Breathe>
			</Abs>
			{title ? (
				<Abs top={low} left={60} right={60}>
					<Caption title={title} sub={sub} at={-60} />
				</Abs>
			) : null}
			{children}
		</AbsoluteFill>
	);
};

/**
 * Plan « bandeau » : un rush 16:9 (sources 640×360) affiché en entier sur la largeur,
 * au lieu d'être recadré et agrandi 5× en 9:16 (ce qui le rendait flou et rose).
 * Fond = le même plan, flouté et assombri.
 */
export const BandShot: React.FC<{src: string; trim?: number; rate?: number; title?: string; sub?: string; n?: number; top?: React.ReactNode; zoom?: number}> = ({
	src,
	trim,
	rate,
	title,
	sub,
	n,
	top,
	zoom = 1.06,
}) => {
	const {vertical, top: st, h, H} = useStage();
	const f = useCurrentFrame();
	const bandH = Math.round((1080 * 9) / 16);
	const bandTop = vertical ? st + 118 : Math.round((H - bandH) / 2) - 140;
	const low = vertical ? st + h - 250 : 1350 - 300;
	const s = interpolate(f, [0, 8], [1.04, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: 'blur(28px) brightness(0.55) saturate(0.8)', transform: 'scale(1.15)'}}>
				<Clip src={src} trim={trim} rate={rate} />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: bandTop, height: bandH, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', borderTop: '4px solid rgba(255,255,255,0.85)', borderBottom: '4px solid rgba(255,255,255,0.85)', transform: `scale(${s})`}}>
				<Clip src={src} trim={trim} rate={rate} zoom={zoom} />
			</div>
			{top ? <Abs top={vertical ? st + 40 : 60}>{top}</Abs> : null}
			{title ? (
				<Abs top={low} left={60} right={60}>
					<Caption title={title} sub={sub} n={n} />
				</Abs>
			) : null}
		</AbsoluteFill>
	);
};

/** Photo plein cadre + légende (même rendu que RushShot de V5). */
export const PhotoShot: React.FC<{photo: string; title?: string; sub?: string; n?: number}> = ({photo, title, sub, n}) => {
	const {vertical, top: st, h} = useStage();
	const low = vertical ? st + h - 250 : 1350 - 300;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Photo src={photo} />
			<Scrim top={0.45} bottom={0.55} />
			{title ? (
				<Abs top={low} left={60} right={60}>
					<Caption title={title} sub={sub} n={n} />
				</Abs>
			) : null}
			{n !== undefined && !title ? <Badge n={n} size={80} /> : null}
		</AbsoluteFill>
	);
};

/** Le passage net du rush de lavage (mousse de sidr sur les cheveux), vérifié image par image. */
export const WASH = {src: 'rushs/sidr_massage.mp4', trim: 1.95};
/** Rate pour étirer la fenêtre nette (≈ 0,85 s de source) sur `frames` images. */
export const washRate = (frames: number) => Math.min(1, 0.85 / (frames / 30));
/** Passage le plus net du rush de massage (mains dans la mousse). */
export const MASSAGE = {src: 'rushs/sidr_massage_b.mp4', trim: 4.6};
