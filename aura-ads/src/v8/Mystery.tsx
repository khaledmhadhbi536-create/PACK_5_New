import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {N, T, YELLOW} from '../v2/WinStill';
import {Abs, Sfx, useStage} from '../v4/kit';
import {HOOKBA_DUR, HookBA} from './HookBA';

/**
 * V8 · secondes 3 à 8 : « استعمل 5 حاجات… » puis 1 ? 2 ? 3 ? 4 ? 5 ?, aucun produit montré.
 * Fin sur « تحب تعرفهم؟ » et un silence (suspense pour la suite).
 */

export const MYSTERY_DUR = 150;
const DROPS = [24, 48, 69, 90, 108]; // le rythme accélère
const ASK = 117;

const Num: React.FC<{n: number; at: number; big: boolean}> = ({n, at, big}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (f < at) return null;
	const p = spring({frame: f - at, fps, config: {damping: 9, stiffness: 220}});
	const blink = f >= ASK ? (Math.floor((f - ASK) / 5) % 2 === 0 ? 1 : 0.45) : 1;
	const size = big ? 215 : 178;
	return (
		<div style={{transform: `translateY(${(1 - p) * -500}px) scale(${big && f - at < 14 ? 1.25 - 0.25 * Math.min(1, (f - at) / 14) : 1})`, opacity: blink}}>
			<div style={{width: size, height: size, borderRadius: '50%', background: 'rgba(10,10,10,0.75)', border: `6px solid ${YELLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 12px 30px rgba(0,0,0,0.6)', direction: 'ltr'}}>
				<N style={{fontSize: size * 0.48, color: '#fff'}}>{n}</N>
				<N style={{fontSize: size * 0.48, color: YELLOW}}>?</N>
			</div>
		</div>
	);
};

export const Mystery: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical, top} = useStage();
	const hi = vertical ? top + 20 : 50;
	const glow = 0.35 + 0.15 * Math.max(0, Math.sin(f * 0.55));
	const last = DROPS.filter((d) => f >= d).length - 1;
	const shake = DROPS.some((d) => f - d >= 0 && f - d < 8) ? Math.sin(f * 3.1) * 6 : 0;
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<AbsoluteFill style={{filter: 'blur(26px) brightness(0.45)', transform: 'scale(1.2)'}}>
				<Img src={staticFile('photos/perso/apres.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, rgba(255,212,59,${glow * 0.25}) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)`}} />
			<AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
				<Abs top={hi} left={30} right={30}>
					{f < ASK ? (
						<T size={100} style={{textAlign: 'center', textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>
							استعمل <N style={{color: YELLOW}}>5</N> حاجات…
						</T>
					) : (
						<T size={104} color={YELLOW} style={{textAlign: 'center', textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>
							تحب تعرفهم؟
						</T>
					)}
				</Abs>
				<Abs top={vertical ? top + 420 : 470} left={10} right={10}>
					<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, maxWidth: 1060, margin: '0 auto'}}>
						{DROPS.map((d, i) => (
							<Num key={i} n={i + 1} at={d} big={i === last && f < ASK} />
						))}
					</div>
				</Abs>
			</AbsoluteFill>
			<Audio src={staticFile('audio/v8/suspense_numeros.wav')} volume={0.85} />
			<Sequence from={2} layout="none">
				<Audio src={staticFile('voice/v8/mystere_1.wav')} volume={1.4} />
			</Sequence>
			<Sequence from={109} layout="none">
				<Audio src={staticFile('voice/v8/mystere_2.wav')} volume={1.4} />
			</Sequence>
			{DROPS.map((d, i) => (
				<React.Fragment key={i}>
					<Sfx at={d - 2} s="tick" v={0.6} />
					<Sfx at={d} s="stamp" v={0.45 + i * 0.08} />
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};

/** Les 8 premières secondes : accroche avant/après (3 s) + suspense des 5 numéros (5 s). */
export const INTRO8_DUR = HOOKBA_DUR + MYSTERY_DUR;
export const Intro8: React.FC = () => (
	<AbsoluteFill>
		<Sequence from={0} durationInFrames={HOOKBA_DUR}>
			<HookBA />
		</Sequence>
		<Sequence from={HOOKBA_DUR}>
			<Mystery />
		</Sequence>
	</AbsoluteFill>
);
