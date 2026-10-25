import React from 'react';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {F} from '../theme/brand';

/**
 * V5 : univers visuels des formats longs.
 * Un thème = palette + polices + texture de fond + transition + musique.
 */

loadFont({family: 'El Messiri', url: staticFile('fonts/ElMessiri.ttf'), weight: '400'});
loadFont({family: 'El Messiri', url: staticFile('fonts/ElMessiri.ttf'), weight: '700'});
loadFont({family: 'Changa', url: staticFile('fonts/Changa.ttf'), weight: '500'});
loadFont({family: 'Changa', url: staticFile('fonts/Changa.ttf'), weight: '800'});

export type ThemeKey = 'kraft' | 'brutal' | 'sbs' | 'tech' | 'edito' | 'mag' | 'doc' | 'blush' | 'clean';
export type CutKind = 'paper' | 'slam' | 'arch' | 'scan' | 'fade' | 'wipe';

export type Theme = {
	bg: string;
	ink: string;
	sub: string;
	accent: string;
	accent2: string;
	card: string;
	cardInk: string;
	display: string;
	dWeight: number;
	body: string;
	music: string;
	cut: CutKind;
	cutSfx: string;
	footBg: string;
	footAccent: string;
	ctaBg: string;
	ctaInk: string;
	progress: string;
};

export const THEMES5: Record<ThemeKey, Theme> = {
	kraft: {
		bg: '#C9A274', ink: '#1E1A14', sub: '#4A3B28', accent: '#2F6B2A', accent2: '#B23A26', card: '#FBF6EA', cardInk: '#1E1A14',
		display: F.body, dWeight: 900, body: F.body, music: 'audio/v5/lofi.wav', cut: 'paper', cutSfx: 'audio/v5/paper.wav',
		footBg: '#1E1A14', footAccent: '#E8C88E', ctaBg: '#2F6B2A', ctaInk: '#fff', progress: '#2F6B2A',
	},
	brutal: {
		bg: '#FFD43B', ink: '#0A0A0A', sub: '#222', accent: '#E2343B', accent2: '#0A0A0A', card: '#fff', cardInk: '#0A0A0A',
		display: F.body, dWeight: 900, body: F.body, music: 'audio/v5/afro.wav', cut: 'slam', cutSfx: 'audio/v4/whoosh.wav',
		footBg: '#0A0A0A', footAccent: '#FFD43B', ctaBg: '#0A0A0A', ctaInk: '#FFD43B', progress: '#E2343B',
	},
	sbs: {
		bg: '#F7F4EE', ink: '#123E73', sub: '#3E5F86', accent: '#1E5A96', accent2: '#E7B422', card: '#fff', cardInk: '#123E73',
		display: F.ruqaa, dWeight: 700, body: F.body, music: 'audio/v5/oud.wav', cut: 'arch', cutSfx: 'audio/v5/swish.wav',
		footBg: '#123E73', footAccent: '#E7B422', ctaBg: '#1E5A96', ctaInk: '#fff', progress: '#1E5A96',
	},
	tech: {
		bg: '#08132B', ink: '#EAF6FF', sub: '#8FB8D8', accent: '#22D3EE', accent2: '#FF6FB5', card: 'rgba(34,211,238,0.08)', cardInk: '#EAF6FF',
		display: F.body, dWeight: 800, body: F.body, music: 'audio/v5/electro.wav', cut: 'scan', cutSfx: 'audio/v5/beep.wav',
		footBg: '#030A18', footAccent: '#22D3EE', ctaBg: '#22D3EE', ctaInk: '#04121F', progress: '#22D3EE',
	},
	edito: {
		bg: '#0C0B09', ink: '#F3EBDD', sub: '#B9AC94', accent: '#C9A45C', accent2: '#F3EBDD', card: 'rgba(255,255,255,0.04)', cardInk: '#F3EBDD',
		display: 'El Messiri', dWeight: 700, body: 'El Messiri', music: 'audio/v5/oud.wav', cut: 'fade', cutSfx: 'audio/v5/swish.wav',
		footBg: '#000', footAccent: '#C9A45C', ctaBg: 'linear-gradient(180deg,#E0C27E,#A9823A)', ctaInk: '#0C0B09', progress: '#C9A45C',
	},
	mag: {
		bg: '#F4EBDD', ink: '#151312', sub: '#5B524A', accent: '#D7322D', accent2: '#151312', card: '#fff', cardInk: '#151312',
		display: 'El Messiri', dWeight: 700, body: F.body, music: 'audio/v5/afro.wav', cut: 'wipe', cutSfx: 'audio/v4/whoosh.wav',
		footBg: '#151312', footAccent: '#F4EBDD', ctaBg: '#D7322D', ctaInk: '#fff', progress: '#D7322D',
	},
	doc: {
		bg: '#0E0E0E', ink: '#FFFFFF', sub: '#BDBDBD', accent: '#FFC53D', accent2: '#FF3B30', card: 'rgba(0,0,0,0.6)', cardInk: '#fff',
		display: 'Changa', dWeight: 800, body: 'Changa', music: 'audio/v5/lofi.wav', cut: 'fade', cutSfx: 'audio/v5/shutter.wav',
		footBg: '#000', footAccent: '#FFC53D', ctaBg: '#FFC53D', ctaInk: '#0E0E0E', progress: '#FFC53D',
	},
	blush: {
		bg: '#F9DCD0', ink: '#4A1712', sub: '#7A3A30', accent: '#C8202A', accent2: '#E7B422', card: '#fff', cardInk: '#4A1712',
		display: F.body, dWeight: 900, body: F.body, music: 'audio/v5/lofi.wav', cut: 'wipe', cutSfx: 'audio/v5/swish.wav',
		footBg: '#4A1712', footAccent: '#F9DCD0', ctaBg: '#C8202A', ctaInk: '#fff', progress: '#C8202A',
	},
	clean: {
		bg: '#F6F8F5', ink: '#10231A', sub: '#4E6458', accent: '#1FA463', accent2: '#10231A', card: '#fff', cardInk: '#10231A',
		display: F.body, dWeight: 900, body: F.body, music: 'audio/v5/electro.wav', cut: 'wipe', cutSfx: 'audio/v4/whoosh.wav',
		footBg: '#10231A', footAccent: '#7FE0AE', ctaBg: '#1FA463', ctaInk: '#fff', progress: '#1FA463',
	},
};

// ---------------- textures de fond ----------------

const noise = (seed: number, freq = 0.8, op = 0.35) =>
	`url("data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' seed='${seed}'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${op} 0'/></filter><rect width='400' height='400' filter='url(#n)'/></svg>`,
	)}")`;

const Grid: React.FC<{color: string; cell?: number; op?: number}> = ({color, cell = 60, op = 0.12}) => (
	<AbsoluteFill
		style={{
			opacity: op,
			backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
			backgroundSize: `${cell}px ${cell}px`,
		}}
	/>
);

/** Frise tunisienne (bandeau de losanges bleus). */
export const Frieze: React.FC<{color?: string; h?: number; style?: React.CSSProperties}> = ({color = '#1E5A96', h = 34, style}) => {
	const svg = encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' width='48' height='${h}' viewBox='0 0 48 34'><rect width='48' height='34' fill='${color}'/><path d='M0 17 L12 5 L24 17 L12 29 Z M24 17 L36 5 L48 17 L36 29 Z' fill='none' stroke='white' stroke-width='2'/><circle cx='24' cy='17' r='2.5' fill='white'/></svg>`,
	);
	return <div style={{height: h, backgroundImage: `url("data:image/svg+xml,${svg}")`, backgroundSize: `48px ${h}px`, ...style}} />;
};

export const ThemeBg: React.FC<{t: ThemeKey}> = ({t}) => {
	const th = THEMES5[t];
	const frame = useCurrentFrame();
	if (t === 'kraft')
		return (
			<AbsoluteFill style={{background: th.bg}}>
				<AbsoluteFill style={{backgroundImage: noise(3, 0.9, 0.12)}} />
				<AbsoluteFill style={{backgroundImage: noise(8, 0.015, 0.07)}} />
				<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, rgba(255,244,222,0.45), rgba(120,80,30,0.18) 95%)'}} />
			</AbsoluteFill>
		);
	if (t === 'brutal')
		return (
			<AbsoluteFill style={{background: th.bg}}>
				<AbsoluteFill style={{opacity: 0.12, backgroundImage: 'radial-gradient(#000 2px, transparent 2.5px)', backgroundSize: '22px 22px'}} />
			</AbsoluteFill>
		);
	if (t === 'sbs')
		return (
			<AbsoluteFill style={{background: th.bg}}>
				<AbsoluteFill style={{backgroundImage: noise(5, 0.7, 0.05)}} />
				<Frieze h={30} style={{position: 'absolute', top: 0, left: 0, right: 0}} />
				<Frieze h={30} style={{position: 'absolute', bottom: 0, left: 0, right: 0}} />
			</AbsoluteFill>
		);
	if (t === 'tech')
		return (
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #12305E 0%, #08132B 60%, #030A18 100%)'}}>
				<div style={{position: 'absolute', inset: 0, transform: `translateY(${(frame * 0.6) % 60}px)`}}>
					<Grid color="#22D3EE" op={0.1} />
				</div>
			</AbsoluteFill>
		);
	if (t === 'edito')
		return (
			<AbsoluteFill style={{background: th.bg}}>
				<AbsoluteFill style={{backgroundImage: noise(9, 0.8, 0.18)}} />
				<div style={{position: 'absolute', inset: 34, border: `1.5px solid ${th.accent}`, opacity: 0.45}} />
			</AbsoluteFill>
		);
	if (t === 'mag')
		return (
			<AbsoluteFill style={{background: th.bg}}>
				<AbsoluteFill style={{backgroundImage: noise(4, 0.8, 0.07)}} />
			</AbsoluteFill>
		);
	if (t === 'doc')
		return (
			<AbsoluteFill style={{background: th.bg}}>
				<AbsoluteFill style={{backgroundImage: noise(frame % 7, 0.9, 0.25)}} />
			</AbsoluteFill>
		);
	if (t === 'blush')
		return <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #FFF3EE 0%, #F9DCD0 60%, #EFB9A6 100%)'}} />;
	return (
		<AbsoluteFill style={{background: th.bg}}>
			<Grid color="#10231A" cell={90} op={0.04} />
		</AbsoluteFill>
	);
};
