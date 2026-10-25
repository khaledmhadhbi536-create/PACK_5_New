import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F, useFormat} from '../theme/brand';

/** Logo Aura Bio : symbole (PNG détouré) + nom en Montserrat comme sur le logo. */
export const Logo: React.FC<{
	size?: number;
	light?: boolean;
	layout?: 'row' | 'stack';
	style?: React.CSSProperties;
}> = ({size = 64, light = false, layout = 'row', style}) => (
	<div
		dir="ltr"
		style={{
			display: 'flex',
			flexDirection: layout === 'row' ? 'row' : 'column',
			alignItems: 'center',
			gap: size * 0.22,
			...style,
		}}
	>
		<Img
			src={staticFile(light ? 'brand/logo_mark_light.png' : 'brand/logo_mark.png')}
			style={{width: size, height: size, objectFit: 'contain'}}
		/>
		<div
			style={{
				fontFamily: F.latin,
				fontWeight: 500,
				fontSize: size * 0.58,
				letterSpacing: size * 0.01,
				color: light ? C.cream : C.forest,
				lineHeight: 1,
				whiteSpace: 'nowrap',
			}}
		>
			Aura Bio
		</div>
	</div>
);

/**
 * Conteneur limité à la zone de sécurité du format.
 * En 9:16 : entre 14 % du haut et 35 % du bas.
 */
export const SafeArea: React.FC<{
	children: React.ReactNode;
	justify?: React.CSSProperties['justifyContent'];
	gap?: number;
	style?: React.CSSProperties;
}> = ({children, justify = 'center', gap = 24, style}) => {
	const {safe} = useFormat();
	return (
		<AbsoluteFill
			style={{
				top: safe.top,
				bottom: safe.bottom,
				left: safe.x,
				right: safe.x,
				height: 'auto',
				width: 'auto',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: justify,
				gap,
				...style,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/** Grain filmique léger : unifie rushs basse définition et éléments nets. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
	const frame = useCurrentFrame();
	const ox = (frame * 137) % 512;
	const oy = (frame * 251) % 512;
	return (
		<AbsoluteFill
			style={{
				backgroundImage: `url(${staticFile('brand/grain.png')})`,
				backgroundPosition: `${ox}px ${oy}px`,
				opacity,
				mixBlendMode: 'overlay',
				pointerEvents: 'none',
			}}
		/>
	);
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
	<AbsoluteFill
		style={{
			background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`,
			pointerEvents: 'none',
		}}
	/>
);

/** Motif géométrique tunisien (étoile à 8 branches, type zellige / Sidi Bou Saïd). */
export const Zellige: React.FC<{
	color?: string;
	opacity?: number;
	cell?: number;
	drift?: boolean;
	style?: React.CSSProperties;
}> = ({color = C.terracotta, opacity = 0.14, cell = 120, drift = true, style}) => {
	const frame = useCurrentFrame();
	const shift = drift ? (frame * 0.4) % cell : 0;
	const s = cell;
	const h = s / 2;
	const r1 = s * 0.42;
	const r2 = s * 0.2;
	const star = Array.from({length: 16}, (_, i) => {
		const a = (Math.PI / 8) * i - Math.PI / 2;
		const r = i % 2 === 0 ? r1 : r2 * 1.55;
		return `${h + r * Math.cos(a)},${h + r * Math.sin(a)}`;
	}).join(' ');
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'><g fill='none' stroke='${color}' stroke-width='${s * 0.025}'><polygon points='${star}'/><rect x='${h - r2}' y='${h - r2}' width='${r2 * 2}' height='${r2 * 2}' transform='rotate(45 ${h} ${h})'/><circle cx='0' cy='0' r='${s * 0.12}'/><circle cx='${s}' cy='0' r='${s * 0.12}'/><circle cx='0' cy='${s}' r='${s * 0.12}'/><circle cx='${s}' cy='${s}' r='${s * 0.12}'/></g></svg>`;
	return (
		<AbsoluteFill
			style={{
				backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
				backgroundSize: `${s}px ${s}px`,
				backgroundPosition: `${shift}px ${shift * 0.5}px`,
				opacity,
				pointerEvents: 'none',
				...style,
			}}
		/>
	);
};

/** Frise horizontale (bande de motif) pour le style héritage. */
export const Frieze: React.FC<{color?: string; bg?: string; height?: number; style?: React.CSSProperties}> = ({
	color = C.cream,
	bg = C.blue,
	height = 56,
	style,
}) => {
	const s = height;
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'><rect width='${s}' height='${s}' fill='${bg}'/><g fill='none' stroke='${color}' stroke-width='${s * 0.06}'><path d='M0 ${s / 2} L${s / 4} ${s * 0.2} L${s / 2} ${s / 2} L${(s * 3) / 4} ${s * 0.8} L${s} ${s / 2}'/><circle cx='${s / 4}' cy='${s * 0.62}' r='${s * 0.07}' fill='${color}'/><circle cx='${(s * 3) / 4}' cy='${s * 0.38}' r='${s * 0.07}' fill='${color}'/></g></svg>`;
	return (
		<div
			style={{
				height,
				width: '100%',
				backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
				backgroundSize: `${s}px ${s}px`,
				...style,
			}}
		/>
	);
};

/** Fond animé selon le style. */
export const Backdrop: React.FC<{bg: string; bg2: string; glow?: string; pattern?: 'zellige' | 'none'; patternColor?: string}> = ({
	bg,
	bg2,
	glow,
	pattern = 'none',
	patternColor,
}) => {
	const frame = useCurrentFrame();
	const a = interpolate(frame, [0, 300], [0, 30]);
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% ${38 + Math.sin(frame / 40) * 4}%, ${bg2} 0%, ${bg} 70%)`}}>
			{glow ? (
				<AbsoluteFill
					style={{
						background: `radial-gradient(circle at ${50 + Math.cos(frame / 50) * 10}% 35%, ${glow} 0%, transparent 45%)`,
						opacity: 0.55,
						rotate: `${a}deg`,
					}}
				/>
			) : null}
			{pattern === 'zellige' ? <Zellige color={patternColor} /> : null}
		</AbsoluteFill>
	);
};
