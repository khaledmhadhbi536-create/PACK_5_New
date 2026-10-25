import React, {createContext, useContext} from 'react';
import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	OffthreadVideo,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {IconPhone} from '../components/Icons';
import {F} from '../theme/brand';
import {OFFER2 as O} from '../v2/offer';
import {N, RED, T} from '../v2/WinStill';

/**
 * Kit d'animation V4 : scène (zone de sécurité), entrées, compteurs,
 * prix barré animé, bouton qui pulse, secousse, flash, effets sonores.
 */

// ---------------- scène / formats ----------------

export type Fmt = '9x16' | '4x5' | '1x1';
type StageInfo = {fmt: Fmt; top: number; h: number; W: number; H: number};
const StageCtx = createContext<StageInfo>({fmt: '9x16', top: 269, h: 979, W: 1080, H: 1920});

export const stageFor = (fmt: Fmt): StageInfo =>
	fmt === '9x16'
		? {fmt, top: 269, h: 979, W: 1080, H: 1920}
		: fmt === '4x5'
			? {fmt, top: 0, h: 1350, W: 1080, H: 1350}
			: {fmt, top: 0, h: 1080, W: 1080, H: 1080};

export const useStage = () => {
	const s = useContext(StageCtx);
	/** position verticale exprimée sur une scène de référence de 979 px (la zone utile du 9:16) */
	const y = (px: number) => Math.round((px * s.h) / 979);
	return {...s, y, vertical: s.fmt === '9x16'};
};

/** Pose le contexte de format pour toute la vidéo. */
export const FmtProvider: React.FC<{fmt: Fmt; children: React.ReactNode}> = ({fmt, children}) => (
	<StageCtx.Provider value={stageFor(fmt)}>{children}</StageCtx.Provider>
);

/** Zone utile : en 9:16, entre 14 % du haut et 35 % du bas. */
export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => {
	const s = useStage();
	return <div style={{position: 'absolute', left: 0, right: 0, top: s.top, height: s.h, ...style}}>{children}</div>;
};

/** Bas de l'écran 9:16 (sous l'interface Reels) : uniquement du visuel. */
export const Below: React.FC<{children: React.ReactNode}> = ({children}) => {
	const s = useStage();
	if (s.fmt !== '9x16') return null;
	return <div style={{position: 'absolute', left: 0, right: 0, top: s.top + s.h, bottom: 0}}>{children}</div>;
};

// ---------------- animation ----------------

export const useSpring = (at: number, cfg: {damping?: number; stiffness?: number; mass?: number} = {}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - at, fps, config: {damping: 12, stiffness: 170, mass: 0.8, ...cfg}});
};

export const ease = (frame: number, a: number, b: number, from = 0, to = 1) =>
	interpolate(frame, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});

type InKind = 'pop' | 'up' | 'down' | 'drop' | 'left' | 'right' | 'fade' | 'zoom';

/** Entrée (et sortie optionnelle) d'un élément. */
export const In: React.FC<{
	at: number;
	kind?: InKind;
	out?: number;
	outKind?: 'up' | 'fade' | 'left' | 'right' | 'down' | 'shrink';
	dist?: number;
	style?: React.CSSProperties;
	children: React.ReactNode;
}> = ({at, kind = 'up', out, outKind = 'fade', dist = 120, style, children}) => {
	const frame = useCurrentFrame();
	const p = useSpring(at, kind === 'drop' ? {damping: 9, stiffness: 200} : kind === 'pop' ? {damping: 10, stiffness: 220} : {});
	if (frame < at) return null;
	let tx = 0;
	let ty = 0;
	let sc = 1;
	let op = Math.min(1, p * 2);
	if (kind === 'pop') sc = p;
	if (kind === 'zoom') sc = 1.6 - 0.6 * p;
	if (kind === 'up') ty = (1 - p) * dist;
	if (kind === 'down') ty = -(1 - p) * dist;
	if (kind === 'drop') ty = -(1 - p) * dist * 4;
	if (kind === 'left') tx = -(1 - p) * dist * 3;
	if (kind === 'right') tx = (1 - p) * dist * 3;
	if (kind === 'fade') op = ease(frame, at, at + 10);
	if (out !== undefined && frame >= out) {
		const q = ease(frame, out, out + 9);
		if (outKind === 'fade') op *= 1 - q;
		if (outKind === 'up') {
			ty -= q * 400;
			op *= 1 - q;
		}
		if (outKind === 'down') {
			ty += q * 400;
			op *= 1 - q;
		}
		if (outKind === 'left') tx -= q * 1200;
		if (outKind === 'right') tx += q * 1200;
		if (outKind === 'shrink') {
			sc *= 1 - q;
			op *= 1 - q;
		}
		if (q >= 1) return null;
	}
	return <div style={{transform: `translate(${tx}px, ${ty}px) scale(${sc})`, opacity: op, ...style}}>{children}</div>;
};

/** Positionnement absolu horizontalement centré. */
export const Abs: React.FC<{top: number; left?: number; right?: number; center?: boolean; z?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	top,
	left,
	right,
	center = left === undefined && right === undefined,
	z,
	children,
	style,
}) => (
	<div
		style={{
			position: 'absolute',
			top,
			left: center ? 0 : left,
			right: center ? 0 : right,
			display: center ? 'flex' : undefined,
			justifyContent: center ? 'center' : undefined,
			zIndex: z,
			...style,
		}}
	>
		{children}
	</div>
);

/** Secousse après un impact. */
export const Shake: React.FC<{hits: number[]; amp?: number; children: React.ReactNode}> = ({hits, amp = 18, children}) => {
	const frame = useCurrentFrame();
	let x = 0;
	let y = 0;
	for (const h of hits) {
		const d = frame - h;
		if (d >= 0 && d < 12) {
			const k = amp * Math.exp(-d / 3);
			x += Math.sin(d * 2.7) * k;
			y += Math.cos(d * 3.3) * k * 0.6;
		}
	}
	return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px)`}}>{children}</AbsoluteFill>;
};

export const Flash: React.FC<{at: number; color?: string; dur?: number; max?: number}> = ({at, color = '#fff', dur = 7, max = 0.8}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at, at + 1, at + dur], [0, max, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none', zIndex: 50}} />;
};

/** Légère respiration continue (bouton, tampon). */
export const Pulse: React.FC<{from: number; amp?: number; speed?: number; children: React.ReactNode}> = ({from, amp = 0.05, speed = 0.28, children}) => {
	const frame = useCurrentFrame();
	const s = frame < from ? 1 : 1 + amp * Math.max(0, Math.sin((frame - from) * speed));
	return <div style={{transform: `scale(${s})`}}>{children}</div>;
};

/** Rotation lente des rayons de fond. */
export const Spin: React.FC<{speed?: number; children: React.ReactNode}> = ({speed = 0.15, children}) => {
	const frame = useCurrentFrame();
	return <AbsoluteFill style={{transform: `rotate(${frame * speed}deg) scale(1.6)`}}>{children}</AbsoluteFill>;
};

// ---------------- prix ----------------

/** « بلاصة 110 د.ت » barré au marqueur (le trait se dessine à partir de `at`). */
export const StrikeAnim: React.FC<{at: number; size?: number; color?: string; prefix?: string}> = ({at, size = 48, color = '#fff', prefix = 'بلاصة'}) => {
	const frame = useCurrentFrame();
	const p = ease(frame, at, at + 9);
	return (
		<div dir="rtl" style={{position: 'relative', display: 'inline-block', fontFamily: F.body, fontWeight: 900, fontSize: size, color}}>
			{prefix} <N>{O.oldPrice}</N> د.ت
			<div
				style={{
					position: 'absolute',
					right: -8,
					top: '52%',
					height: size * 0.17,
					width: `calc(${p * 100}% + ${16 * p}px)`,
					background: RED,
					borderRadius: 4,
					transform: 'rotate(-6deg)',
					transformOrigin: 'right center',
				}}
			/>
		</div>
	);
};

/** Compteur qui défile (ex. 110 → 49). */
export const Counter: React.FC<{at: number; dur: number; from: number; to: number; decimals?: number; style?: React.CSSProperties}> = ({at, dur, from, to, decimals = 0, style}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [at, at + dur], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return <N style={style}>{v.toFixed(decimals)}</N>;
};

export const CtaAnim: React.FC<{at: number; bg?: string; color?: string; size?: number}> = ({at, bg = 'linear-gradient(180deg,#E3BE6E,#B98C35)', color = '#fff', size = 56}) => (
	<In at={at} kind="pop">
		<Pulse from={at + 12}>
			<div
				dir="rtl"
				style={{
					background: bg,
					color,
					fontFamily: F.body,
					fontWeight: 900,
					fontSize: size,
					padding: `${size * 0.22}px ${size * 0.95}px`,
					borderRadius: 999,
					boxShadow: '0 10px 0 rgba(0,0,0,0.22), 0 18px 40px rgba(0,0,0,0.3)',
					display: 'inline-flex',
					alignItems: 'center',
					gap: 16,
				}}
			>
				{O.cta}
				<span style={{fontSize: size * 0.8, lineHeight: 1}}>‹</span>
			</div>
		</Pulse>
	</In>
);

/** Pied de page (marque · paiement à la livraison · téléphone), en pastille. */
export const FooterPill: React.FC<{at: number; bg?: string; color?: string; accent?: string}> = ({at, bg = '#15140F', color = '#fff', accent = '#D2B06A'}) => (
	<In at={at} kind="up" dist={60}>
		<div
			dir="rtl"
			style={{
				margin: '0 30px',
				height: 86,
				borderRadius: 999,
				background: bg,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 24,
				color,
				boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
			}}
		>
			<span style={{fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: 5, fontSize: 30, color: accent}}>
				<span dir="ltr">{O.brand}</span>
			</span>
			<span style={{width: 8, height: 8, background: color, opacity: 0.7}} />
			<span style={{fontFamily: F.body, fontWeight: 800, fontSize: 32}}>{O.cod}</span>
			<span style={{width: 8, height: 8, background: color, opacity: 0.7}} />
			<span style={{display: 'flex', alignItems: 'center', gap: 10}}>
				<IconPhone size={30} color={color} />
				<N style={{fontSize: 34}}>{O.phone}</N>
			</span>
		</div>
	</In>
);

// ---------------- son ----------------

export type SfxName =
	| 'stamp' | 'slam' | 'marker' | 'cash' | 'pop1' | 'pop2' | 'pop3' | 'pop4' | 'pop5' | 'tick' | 'check'
	| 'sparkle' | 'snow' | 'bass' | 'glitch' | 'whoosh' | 'riser' | 'boxpop'
	| `v5/${string}`;

export const Sfx: React.FC<{at: number; s: SfxName; v?: number}> = ({at, s, v = 0.8}) => (
	<Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none">
		<Audio src={staticFile(s.startsWith('v5/') ? `audio/${s}.wav` : `audio/v4/${s}.wav`)} volume={v * 0.8} />
	</Sequence>
);

/** Ticks de compteur réguliers entre a et b. */
export const Ticks: React.FC<{a: number; b: number; every?: number; v?: number}> = ({a, b, every = 2, v = 0.45}) => (
	<>
		{Array.from({length: Math.floor((b - a) / every)}, (_, i) => (
			<Sfx key={i} at={a + i * every} s="tick" v={v} />
		))}
	</>
);

export const Music: React.FC<{src: string; start?: number; vol?: number}> = ({src, start = 0, vol = 0.45}) => {
	const {durationInFrames, fps} = useVideoConfig();
	return (
		<Audio
			src={staticFile(src)}
			startFrom={Math.round(start * fps)}
			volume={(f) => vol * interpolate(f, [0, 6, durationInFrames - 18, durationInFrames - 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
		/>
	);
};

// ---------------- vidéo ----------------

/** Rush plein cadre (cover), ralenti si besoin. */
export const Clip: React.FC<{src: string; trim?: number; rate?: number; muted?: boolean; vol?: number; pos?: string; zoom?: number; style?: React.CSSProperties}> = ({
	src,
	trim = 0,
	rate = 1,
	muted = true,
	vol = 1,
	pos = '50% 50%',
	zoom = 1,
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const z = zoom + frame * 0.0012;
	return (
		<AbsoluteFill style={{overflow: 'hidden', ...style}}>
			<OffthreadVideo
				src={staticFile(src)}
				trimBefore={Math.round(trim * fps)}
				playbackRate={rate}
				muted={muted}
				volume={vol}
				style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${z})`}}
			/>
		</AbsoluteFill>
	);
};

/** Bandeau de texte (pastille) pour les vidéos à rush. */
export const Tag: React.FC<{children: React.ReactNode; bg?: string; color?: string; size?: number; rotate?: number}> = ({children, bg = '#fff', color = '#111', size = 52, rotate = 0}) => (
	<div style={{display: 'inline-block', background: bg, borderRadius: size * 0.4, padding: `${size * 0.08}px ${size * 0.5}px ${size * 0.2}px`, boxShadow: '0 10px 0 rgba(0,0,0,0.18)', transform: `rotate(${rotate}deg)`}}>
		<T size={size} color={color} style={{whiteSpace: 'nowrap'}}>
			{children}
		</T>
	</div>
);
