import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Abs, Clip, useStage} from '../v4/kit';
import {Caption} from '../v5/kit5';

/** Rush « massage à la brosse » : tête pleine de sidr, recadré sans texte (576×452). */
export const BRUSH = {src: 'rushs/perso/brosse_massage.mp4', ratio: 576 / 452, len: 4.46};

/** Rate pour que le rush couvre `frames` images sans dépasser sa fin. */
export const brushRate = (frames: number) => Math.min(1, (BRUSH.len - 0.05) / (frames / 30));

/** Petit logo Aura Bio posé dans le coin du plan. */
export const AuraTag: React.FC<{size?: number}> = ({size = 34}) => (
	<div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(15,22,17,0.78)', borderRadius: 999, padding: `${size * 0.22}px ${size * 0.6}px ${size * 0.22}px ${size * 0.3}px`, boxShadow: '0 6px 18px rgba(0,0,0,0.35)'}}>
		<Img src={staticFile('brand/logo_mark_light.png')} style={{height: size * 1.1, width: 'auto'}} />
		<span style={{fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: size * 0.8, letterSpacing: size * 0.16, color: '#EBD49C', whiteSpace: 'nowrap'}}>AURA BIO</span>
	</div>
);

/**
 * Le rush brosse en bandeau (image entière, nette) sur un fond flouté du même plan,
 * logo Aura Bio dans le coin, légende de l'étape (selon la vidéo) en bas.
 * `w9x16` / `top9x16` (et `w4x5` / `top4x5`) : taille et position du bandeau (pour laisser la place aux titres).
 */
export const BrushShot: React.FC<{
	frames: number;
	title?: string;
	sub?: string;
	n?: number;
	w9x16?: number;
	top9x16?: number;
	w4x5?: number;
	top4x5?: number;
	caption?: boolean;
}> = ({frames, title, sub, n, w9x16 = 900, top9x16 = 30, w4x5 = 1080, top4x5, caption = true}) => {
	const {vertical, top: st, h, H} = useStage();
	const f = useCurrentFrame();
	const rate = brushRate(frames);
	const w = vertical ? w9x16 : w4x5;
	const bh = Math.round(w / BRUSH.ratio);
	const bt = vertical ? st + top9x16 : (top4x5 ?? Math.round((H - bh) / 2) - 140);
	const low = vertical ? st + h - 250 : 1350 - 300;
	const s = interpolate(f, [0, 8], [1.04, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: 'blur(30px) brightness(0.5) saturate(0.85)', transform: 'scale(1.2)'}}>
				<Clip src={BRUSH.src} rate={rate} />
			</AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: (1080 - w) / 2,
					width: w,
					top: bt,
					height: bh,
					overflow: 'hidden',
					borderRadius: w < 1080 ? 26 : 0,
					border: w < 1080 ? '4px solid rgba(255,255,255,0.85)' : undefined,
					borderTop: '4px solid rgba(255,255,255,0.85)',
					borderBottom: '4px solid rgba(255,255,255,0.85)',
					boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
					transform: `scale(${s})`,
				}}
			>
				<Clip src={BRUSH.src} rate={rate} zoom={1.02} />
				<div style={{position: 'absolute', left: 18, bottom: 18}}>
					<AuraTag size={vertical ? 30 : 34} />
				</div>
			</div>
			{caption && title ? (
				<Abs top={low} left={60} right={60}>
					<Caption title={title} sub={sub} n={n} />
				</Abs>
			) : null}
		</AbsoluteFill>
	);
};
