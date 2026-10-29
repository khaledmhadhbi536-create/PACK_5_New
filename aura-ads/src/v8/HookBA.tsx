import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {T, YELLOW} from '../v2/WinStill';
import {Abs, Flash, useStage} from '../v4/kit';
import {Sfx8} from './sound8';

/**
 * V8 · accroche 3 s « كيفاش شعرو من هكا… ولّى هكا؟ »
 * Photos de la personne (accord donné), dates et textes d'origine retirés par recadrage.
 * Mention « تجربة شخصية » conservée : résultat d'une personne, pas une promesse.
 */

export const HOOKBA_DUR = 90;
const CUT = 45; // révélation à 1,5 s

const Photo: React.FC<{src: string; from: number; to: number}> = ({src, from, to}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, 45], [from, to], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: `scale(${s})`}} />
		</AbsoluteFill>
	);
};

const Line: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 110, color = '#fff'}) => (
	<T size={size} color={color} style={{textAlign: 'center', lineHeight: 1.15, textShadow: '0 6px 24px rgba(0,0,0,0.9), 0 2px 0 rgba(0,0,0,0.7)'}}>
		{children}
	</T>
);

export const HookBA: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical, top, h} = useStage();
	const hi = vertical ? top + 20 : 50;
	const low = vertical ? top + h - 70 : 1350 - 80;
	const pulse = f < CUT ? 1 + 0.02 * Math.sin(f * 0.9) : 1;
	const shake = f >= CUT && f < CUT + 10 ? Math.sin((f - CUT) * 3) * (CUT + 10 - f) * 2 : 0;
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden', transform: `translate(${shake}px, ${shake * 0.4}px)`}}>
			<Sequence from={0} durationInFrames={CUT}>
				<Photo src="photos/perso/avant.png" from={1.0} to={1.12} />
				{/* vignette sombre qui se resserre : tension */}
				<AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, rgba(0,0,0,0) ${interpolate(f, [0, CUT], [55, 35])}%, rgba(0,0,0,0.85) 100%)`}} />
			</Sequence>
			<Sequence from={CUT}>
				<Photo src="photos/perso/apres.png" from={1.12} to={1.0} />
				<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)'}} />
			</Sequence>

			<Abs top={hi} left={30} right={30}>
				<div style={{transform: `scale(${pulse})`}}>
					<Line>كيفاش شعرو</Line>
					{f < CUT ? <Line color="#fff">من هكا…</Line> : <Line color={YELLOW}>ولّى هكا؟</Line>}
				</div>
			</Abs>

			<Abs top={low} left={40} right={40}>
				<T size={26} color="rgba(255,255,255,0.85)" weight={700} style={{textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>
					تجربة شخصية · النتيجة تختلف من شخص لآخر
				</T>
			</Abs>

			<Flash at={CUT} max={0.85} dur={6} />
			<Audio src={staticFile('audio/v8/suspense8_hook.wav')} volume={0.9} />
			<Sfx8 at={CUT - 30} s="rev_swell" v={0.55} />
			<Sfx8 at={CUT} s="impact" v={0.95} />
			<Sfx8 at={CUT + 1} s="whoosh" v={0.35} />
		</AbsoluteFill>
	);
};
