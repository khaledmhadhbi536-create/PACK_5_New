import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {F} from '../theme/brand';
import {useStage} from '../v4/kit';

/**
 * V9 · boîte à outils « kinetic » (méthode du skill scenario-kinetic-film, adaptée à Remotion,
 * au vertical et à l'arabe) : un temps = 12 images (150 BPM à 30 i/s), un mot énorme par temps,
 * transitions en « whip » avec flou de mouvement, sols qui changent de couleur, caméra jamais immobile.
 * Les mots arabes sont animés en entier (jamais lettre par lettre : la liaison des lettres resterait cassée).
 */

export const BEAT = 12;
export const b = (k: number) => Math.round(k * BEAT);

export const P = {bg: '#0E2416', accent: '#FFD43B', paper: '#F6F0E2', ink: '#111111', hot: '#F07A2A', green: '#7BC67E'};
export type Ground = keyof typeof P;
export const typeOn = (g: Ground) => (g === 'accent' || g === 'paper' ? P.ink : P.paper);

const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const outExpo = (u: number) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(u)));
export const inExpo = (u: number) => (u <= 0 ? 0 : Math.pow(2, 10 * clamp(u) - 10));
export const tw = (f: number, a: number, d: number, e = outExpo) => e(clamp((f - a) / d));

/** Largeur approximative d'un mot en Lalezar (em par caractère). */
const est = (s: string) => [...s].reduce((a, ch) => a + (ch === ' ' ? 0.28 : /[0-9]/.test(ch) ? 0.55 : /[ًٌٍَُِّْ]/.test(ch) ? 0 : 0.5), 0);
/** Taille qui remplit `w` px sans dépasser `max`. */
export const fit = (s: string, w: number, max: number) => Math.min(max, Math.floor(w / Math.max(1, est(s))));

/** Filtre de flou directionnel (flou de mouvement des whips). */
export const MotionBlur: React.FC<{id: string; x: number; y?: number; children: React.ReactNode}> = ({id, x, y = 0, children}) => {
	const on = x > 0.4 || y > 0.4;
	return (
		<AbsoluteFill style={{filter: on ? `url(#${id})` : undefined}}>
			{on ? (
				<svg width={0} height={0} style={{position: 'absolute'}}>
					<filter id={id} x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur stdDeviation={`${x.toFixed(1)} ${y.toFixed(1)}`} />
					</filter>
				</svg>
			) : null}
			{children}
		</AbsoluteFill>
	);
};

/**
 * Caméra d'une scène : poussée lente + petit roulis tout le long (jamais d'image figée),
 * whip d'entrée (les `inF` premières images) et de sortie (les `outF` dernières), avec flou de mouvement.
 */
export const Cam: React.FC<{
	id: string;
	dur: number;
	whipIn?: 'x' | '-x' | 'y' | '-y' | null;
	whipOut?: 'x' | '-x' | 'y' | '-y' | null;
	push?: number;
	roll?: number;
	children: React.ReactNode;
}> = ({id, dur, whipIn = 'x', whipOut = 'x', push = 0.07, roll = 1.2, children}) => {
	const f = useCurrentFrame();
	const {W, H} = useStage();
	const inF = 6;
	const outF = 5;
	let dx = 0;
	let dy = 0;
	let vx = 0;
	let vy = 0;
	const axis = (w: string | null | undefined) => (w ? {sx: w.endsWith('x') ? 1 : 0, sy: w.endsWith('y') ? 1 : 0, sg: w.startsWith('-') ? -1 : 1} : null);
	const A = axis(whipIn);
	if (A && f < inF) {
		const u = 1 - outExpo(f / inF);
		const u2 = 1 - outExpo((f + 1) / inF);
		dx = A.sx * A.sg * W * 0.9 * u;
		dy = A.sy * A.sg * H * 0.7 * u;
		vx = A.sx * Math.abs(u - u2) * W * 0.9;
		vy = A.sy * Math.abs(u - u2) * H * 0.7;
	}
	const O = axis(whipOut);
	if (O && f >= dur - outF) {
		const u = inExpo((f - (dur - outF)) / outF);
		const u2 = inExpo((f + 1 - (dur - outF)) / outF);
		dx = -O.sx * O.sg * W * 0.9 * u;
		dy = -O.sy * O.sg * H * 0.7 * u;
		vx = O.sx * Math.abs(u2 - u) * W * 0.9;
		vy = O.sy * Math.abs(u2 - u) * H * 0.7;
	}
	const s = 1 + push * (f / dur);
	const r = roll * Math.sin((f / dur) * Math.PI - Math.PI / 2);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<MotionBlur id={id} x={Math.min(60, vx * 0.35)} y={Math.min(60, vy * 0.35)}>
				<AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(${r}deg)`}}>{children}</AbsoluteFill>
			</MotionBlur>
		</AbsoluteFill>
	);
};

/** Fond plein (sol). */
export const Fill: React.FC<{g: Ground | string}> = ({g}) => <AbsoluteFill style={{background: (P as Record<string, string>)[g] ?? g}} />;

/** Lignes de vitesse qui convergent / explosent depuis un point (gros impacts seulement). */
export const Rays: React.FC<{at: number; x?: number; y?: number; color?: string; n?: number}> = ({at, x, y, color = P.accent, n = 26}) => {
	const f = useCurrentFrame();
	const {W, H} = useStage();
	const k = f - at;
	if (k < 0 || k > 10) return null;
	const cx = x ?? W / 2;
	const cy = y ?? H / 2;
	const u = outExpo(k / 10);
	return (
		<svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
			{Array.from({length: n}, (_, i) => {
				const a = (i / n) * Math.PI * 2 + random(`ray${at}${i}`) * 0.2;
				const r0 = 120 + u * 700;
				const r1 = r0 + 120 + random(`len${at}${i}`) * 260;
				return (
					<line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * r1} y2={cy + Math.sin(a) * r1} stroke={color} strokeWidth={10 * (1 - u) + 2} strokeLinecap="round" opacity={1 - u} />
				);
			})}
			<circle cx={cx} cy={cy} r={80 + u * 520} fill="none" stroke={color} strokeWidth={14 * (1 - u)} opacity={1 - u} />
		</svg>
	);
};

/** Flash plein écran (une à trois images). */
export const Blink: React.FC<{at: number; color?: string; len?: number}> = ({at, color = '#fff', len = 4}) => {
	const f = useCurrentFrame();
	const k = f - at;
	if (k < 0 || k >= len) return null;
	return <AbsoluteFill style={{background: color, opacity: 0.85 * (1 - k / len)}} />;
};

/** Secousse sur les impacts. */
export const useShake = (hits: number[], amp = 16) => {
	const f = useCurrentFrame();
	let x = 0;
	let y = 0;
	for (const h of hits) {
		const k = f - h;
		if (k >= 0 && k < 8) {
			const a = amp * (1 - k / 8);
			x += Math.sin(k * 2.7 + h) * a;
			y += Math.cos(k * 3.3 + h) * a * 0.7;
		}
	}
	return {x, y};
};

/**
 * Un mot énorme qui claque : entre à 160 % avec flou et se pose en 5 images, puis grossit lentement
 * (jamais immobile). `echo` : lignes fantômes du même mot (contour) qui défilent au-dessus et en dessous.
 */
export const Slam: React.FC<{
	at: number;
	text: string;
	y: number;
	color?: string;
	max?: number;
	width?: number;
	echo?: boolean;
	echoColor?: string;
	from?: number;
	until?: number;
	font?: string;
	stroke?: string;
	shadow?: boolean;
}> = ({at, text, y, color = P.paper, max = 260, width, echo = false, echoColor, from = 1.6, until, font = F.display, stroke, shadow = true}) => {
	const f = useCurrentFrame();
	const {W} = useStage();
	if (f < at || (until !== undefined && f >= until)) return null;
	const size = fit(text, width ?? W * 0.9, max);
	const k = f - at;
	const sl = tw(f, at, 5);
	const s = (from + (1 - from) * sl) * (1 + 0.035 * (k / 30));
	const blur = at === 0 ? 0 : (1 - sl) * 14; // la frame 0 doit être nette (accroche)
	const word = (o: number, c: string, outline: boolean) => (
		<div
			dir="rtl"
			style={{
				fontFamily: font,
				fontSize: size,
				lineHeight: 1.05,
				whiteSpace: 'nowrap',
				color: outline ? 'transparent' : c,
				WebkitTextStroke: outline ? `3px ${c}` : stroke ? `${Math.round(size / 40)}px ${stroke}` : undefined,
				opacity: o,
				textShadow: !outline && shadow ? '0 10px 30px rgba(0,0,0,0.45)' : undefined,
			}}
		>
			{text}
		</div>
	);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, height: 0, display: 'flex', justifyContent: 'center'}}>
			{echo
				? [-1, 1].map((sg) => (
						<div key={sg} style={{position: 'absolute', top: sg * size * 0.95 - size * 0.55, transform: `translateX(${sg * (60 + k * 9)}px)`}}>
							{word(0.45 * sl, echoColor ?? color, true)}
						</div>
					))
				: null}
			<div style={{position: 'absolute', top: -size * 0.55, transform: `scale(${s})`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>{word(1, color, false)}</div>
		</div>
	);
};

/** Petit mot d'amorce (kicker) au-dessus d'un gros mot, qui glisse depuis le côté. */
export const Kicker: React.FC<{at: number; text: string; y: number; color?: string; size?: number; bg?: string; until?: number}> = ({at, text, y, color = P.ink, size = 64, bg = P.accent, until}) => {
	const f = useCurrentFrame();
	if (f < at || (until !== undefined && f >= until)) return null;
	const u = tw(f, at, 6);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
			<div dir="rtl" style={{background: bg, color, fontFamily: F.body, fontWeight: 900, fontSize: size, padding: `0 ${size * 0.45}px ${size * 0.12}px`, borderRadius: size * 0.22, transform: `translateX(${(1 - u) * 700}px) rotate(-2deg)`, whiteSpace: 'nowrap'}}>
				{text}
			</div>
		</div>
	);
};

/** Photo en mouvement permanent (poussée + glissement). */
export const Push: React.FC<{src: string; dur: number; pos?: string; from?: number; to?: number; pan?: number; contain?: string; dim?: number}> = ({src, dur, pos = '50% 50%', from = 1.08, to = 1.22, pan = 30, contain, dim = 0}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, dur], [from, to]);
	const x = interpolate(f, [0, dur], [-pan, pan]);
	return (
		<AbsoluteFill style={{background: contain ?? '#000', overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: contain ? 'contain' : 'cover', objectPosition: pos, transform: `translateX(${x}px) scale(${s})`}} />
			{dim ? <AbsoluteFill style={{background: `rgba(0,0,0,${dim})`}} /> : null}
		</AbsoluteFill>
	);
};

/** Grain de film (déterministe). */
export const Grain: React.FC = () => {
	const f = useCurrentFrame();
	const x = Math.floor(random(`gx${f}`) * 200);
	const y = Math.floor(random(`gy${f}`) * 200);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.18}}>
			<div style={{position: 'absolute', inset: -200, backgroundImage: `url(${staticFile('brand/grain.png')})`, backgroundRepeat: 'repeat', transform: `translate(${x}px, ${y}px)`}} />
		</AbsoluteFill>
	);
};

/** Vignette (bords sombres). */
export const Vignette: React.FC<{a?: number}> = ({a = 0.55}) => <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${a}) 100%)`, pointerEvents: 'none'}} />;
