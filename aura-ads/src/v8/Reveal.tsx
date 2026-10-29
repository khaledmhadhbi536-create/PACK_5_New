import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IconCheck} from '../components/Icons';
import {N, T, YELLOW} from '../v2/WinStill';
import {Abs, Clip, Flash, Sfx, useStage} from '../v4/kit';
import {INTRO8_DUR, Intro8} from './Mystery';

/**
 * V8 · ouverture des « ? » un par un. Chaque révélation :
 * le rond n° n grossit et s'ouvre, puis la vidéo d'utilisation, le produit détouré
 * et son nom ; les autres « ? » restent en haut (le suspense continue).
 */

type Shot = {src: string; trim?: number; rate?: number; frames: number; pos?: string};
export type RevealSpec = {n: number; name: string; sub: string; product: string; productH: number; shots: Shot[]; voice: string; dur: number};

const OPEN = 14; // le rond s'ouvre

/** Rangée des 5 ronds en haut : ceux déjà ouverts cochés, les autres en « ? ». */
const Row: React.FC<{opened: number}> = ({opened}) => (
	<div style={{display: 'flex', justifyContent: 'center', gap: 12, direction: 'ltr'}}>
		{[1, 2, 3, 4, 5].map((i) => (
			<div key={i} style={{width: 84, height: 84, borderRadius: '50%', background: i <= opened ? '#2FA35A' : 'rgba(10,10,10,0.75)', border: `4px solid ${i <= opened ? '#fff' : YELLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, boxShadow: '0 6px 16px rgba(0,0,0,0.5)'}}>
				<N style={{fontSize: 38, color: '#fff'}}>{i}</N>
				{i <= opened ? <IconCheck size={26} color="#fff" /> : <N style={{fontSize: 38, color: YELLOW}}>?</N>}
			</div>
		))}
	</div>
);

export const Reveal: React.FC<{spec: RevealSpec}> = ({spec}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {vertical, top, h} = useStage();
	const hi = vertical ? top + 10 : 30;
	const VH = vertical ? 1250 : 930; // hauteur de la vidéo ; le reste = panneau produit
	const PH = vertical ? Math.min(spec.productH, 1920 - VH - 80) : 1350 - VH - 36;
	// 1) le rond n grossit jusqu'à remplir l'écran
	const grow = interpolate(f, [0, OPEN], [1, 14], {extrapolateRight: 'clamp', easing: (x) => x * x});
	// 2) vidéos d'utilisation
	let acc = OPEN;
	const seq = spec.shots.map((s) => {
		const from = acc;
		acc += s.frames;
		return {...s, from};
	});
	const pp = spring({frame: f - (OPEN + 14), fps, config: {damping: 11, stiffness: 160}});
	const tp = spring({frame: f - (OPEN + 4), fps, config: {damping: 12, stiffness: 180}});
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			{/* vidéo d'utilisation en haut */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: VH, overflow: 'hidden'}}>
				{seq.map((s, i) => (
					<Sequence key={i} from={s.from} durationInFrames={s.frames}>
						<Clip src={s.src} trim={s.trim} rate={s.rate} pos={s.pos ?? '50% 35%'} />
					</Sequence>
				))}
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.85) 100%)'}} />
			</div>
			{/* panneau produit en bas */}
			<div style={{position: 'absolute', left: 0, right: 0, top: VH, bottom: 0, background: 'radial-gradient(circle at 50% 30%, #3A3216 0%, #121008 60%, #050505 100%)', borderTop: `5px solid ${YELLOW}`}} />

			{/* rangée des « ? » (le n° en cours se coche à l'ouverture) */}
			<Abs top={hi}>
				<Row opened={f >= OPEN ? spec.n : spec.n - 1} />
			</Abs>

			{/* titre du produit */}
			{f >= OPEN ? (
				<Abs top={hi + 110} left={30} right={30}>
					<div style={{transform: `scale(${tp})`, display: 'flex', justifyContent: 'center'}}>
						<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(255,255,255,0.96)', borderRadius: 999, padding: '6px 14px 6px 52px', flexShrink: 0, boxShadow: '0 12px 30px rgba(0,0,0,0.45)'}}>
							<div style={{width: 86, height: 86, borderRadius: '50%', background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<N style={{fontSize: 52, color: '#111'}}>{spec.n}</N>
							</div>
							<div style={{flexShrink: 0, width: 'max-content'}}>
								<T size={60} color="#111" style={{whiteSpace: 'nowrap'}}>
									{spec.name}
								</T>
								<T size={32} color="#444" weight={700} style={{whiteSpace: 'nowrap', marginTop: -4}}>
									{spec.sub}
								</T>
							</div>
						</div>
					</div>
				</Abs>
			) : null}

			{/* produit détouré, centré dans le panneau du bas */}
			{f >= OPEN + 14 ? (
				<Abs top={VH + (vertical ? 40 : 18)}>
					<div style={{transform: `translateY(${(1 - pp) * 400}px) scale(${0.6 + 0.4 * pp}) rotate(${(1 - pp) * 10}deg)`}}>
						<Img src={staticFile(spec.product)} style={{height: PH, width: 'auto', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} />
					</div>
				</Abs>
			) : null}

			{/* ouverture du rond */}
			{f < OPEN + 2 ? (
				<AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: f < OPEN ? 'rgba(0,0,0,0.85)' : 'transparent'}}>
					<div style={{width: 200, height: 200, borderRadius: '50%', background: YELLOW, transform: `scale(${grow})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, direction: 'ltr', opacity: f < OPEN ? 1 : 0}}>
						<N style={{fontSize: 96, color: '#111'}}>{spec.n}</N>
						<N style={{fontSize: 96, color: '#111'}}>?</N>
					</div>
				</AbsoluteFill>
			) : null}
			<Flash at={OPEN} max={0.9} dur={7} />

			<Sequence from={OPEN} layout="none">
				<Audio src={staticFile(spec.voice)} volume={1.4} />
			</Sequence>
			<Sfx at={0} s="riser" v={0.5} />
			<Sfx at={OPEN} s="slam" v={0.7} />
			<Sfx at={OPEN + 1} s="sparkle" v={0.6} />
			<Sfx at={OPEN + 4} s="pop2" v={0.6} />
			<Sfx at={OPEN + 14} s="pop4" v={0.7} />
		</AbsoluteFill>
	);
};

export const REVEALS: RevealSpec[] = [
	{
		n: 1,
		name: 'سدر طبيعي',
		sub: 'ينظّف جلدة الراس بالشوية',
		product: 'products/v8/sidr.png',
		productH: 560,
		voice: 'voice/v8/reveal_1_sidr.wav',
		dur: 140,
		shots: [
			{src: 'rushs/perso/sidr_front.mp4', trim: 0.3, frames: 52},
			{src: 'rushs/perso/sidr_top.mp4', trim: 0.6, frames: 74},
		],
	},
];

/** Intro (8 s) + révélations déjà faites, à la suite. */
export const PART_DUR = INTRO8_DUR + REVEALS.reduce((a, r) => a + r.dur, 0);
export const Part: React.FC = () => {
	let acc = INTRO8_DUR;
	return (
		<AbsoluteFill>
			<Sequence from={0} durationInFrames={INTRO8_DUR}>
				<Intro8 />
			</Sequence>
			{REVEALS.map((r) => {
				const from = acc;
				acc += r.dur;
				return (
					<Sequence key={r.n} from={from} durationInFrames={r.dur}>
						<Reveal spec={r} />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
