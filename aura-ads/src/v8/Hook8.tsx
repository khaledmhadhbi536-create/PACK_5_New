import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {N, T, YELLOW} from '../v2/WinStill';
import {Abs, Clip, FmtProvider, In, Music, Sfx, useStage} from '../v4/kit';
import {HOOKBA_DUR, HookBA} from './HookBA';
import {INTRO8_DUR, Intro8} from './Mystery';
import {PART_DUR, Part} from './Reveal';

/**
 * V8 · accroche (4 s) : l'homme des rushs « perso » (accord donné) applique le sidr.
 * Bienfaits du sidr + romarin, pas d'avant/après ni de promesse de repousse.
 * Visuels produits : public/products/v8.
 */

const Scrim: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)'}} />
);

const Big: React.FC<{size?: number; children: React.ReactNode}> = ({size = 92, children}) => (
	<T size={size} style={{textAlign: 'center', lineHeight: 1.2, textShadow: '0 6px 22px rgba(0,0,0,0.85), 0 2px 0 rgba(0,0,0,0.6)'}}>
		{children}
	</T>
);

const Chip: React.FC<{children: React.ReactNode; bg?: string; color?: string}> = ({children, bg = YELLOW, color = '#111'}) => (
	<div style={{background: bg, borderRadius: 999, padding: '4px 34px 12px', boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>
		<T size={50} color={color} style={{whiteSpace: 'nowrap'}}>
			{children}
		</T>
	</div>
);

/** Produit détouré qui entre par le bas. */
const ProdPop: React.FC<{src: string; h: number; at: number}> = ({src, h, at}) => (
	<In at={at} kind="up" dist={220}>
		<Img src={staticFile(src)} style={{height: h, width: 'auto', filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.55))'}} />
	</In>
);

export const HOOK8_DUR = 120;

export const Hook8: React.FC = () => {
	const {vertical, top} = useStage();
	const f = useCurrentFrame();
	const hi = vertical ? top + 30 : 60;
	const shake = f < 10 ? Math.sin(f * 2.4) * (10 - f) * 0.8 : 0;
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			{/* 0–1,2 s : le bol de sidr, regard caméra */}
			<Sequence from={0} durationInFrames={36}>
				<AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
					<Clip src="rushs/perso/sidr_bol.mp4" rate={0.6} pos="50% 30%" />
				</AbsoluteFill>
				<Scrim />
			</Sequence>
			{/* 1,2–2,8 s : application au pinceau */}
			<Sequence from={36} durationInFrames={48}>
				<Clip src="rushs/perso/sidr_front.mp4" trim={0.4} pos="50% 35%" />
				<Scrim />
			</Sequence>
			{/* 2,8–4 s : tête couverte de sidr + les produits */}
			<Sequence from={84} durationInFrames={36}>
				<Clip src="rushs/perso/sidr_top.mp4" trim={2.6} pos="50% 30%" />
				<Scrim />
			</Sequence>

			{/* textes (zone utile 9:16) */}
			<Sequence from={0} durationInFrames={36}>
				<Abs top={hi} left={40} right={40}>
					<Big size={104}>
						شوف آش حطّ
						<br />
						على <span style={{color: YELLOW}}>راسو</span>
					</Big>
				</Abs>
			</Sequence>
			<Sequence from={36} durationInFrames={48}>
				<Abs top={hi} left={40} right={40}>
					<Big size={96}>
						<span style={{color: '#B8E07A'}}>سدر</span> + <span style={{color: '#B8E07A'}}>إكليل الجبل</span>
					</Big>
				</Abs>
				<Abs top={hi + 150}>
					<In at={4} kind="pop">
						<Chip>سرّ جدودنا للشعر واللحية</Chip>
					</In>
				</Abs>
			</Sequence>
			<Sequence from={84} durationInFrames={36}>
				<Abs top={hi} left={40} right={40}>
					<Big size={92}>
						روتين كامل بـ <span style={{color: YELLOW}}><N>49</N> د.ت</span>
					</Big>
				</Abs>
				<Abs top={vertical ? top + 560 : 760}>
					<div style={{display: 'flex', alignItems: 'flex-end', gap: 30}}>
						<ProdPop src="products/v8/huile.png" h={vertical ? 420 : 380} at={2} />
						<ProdPop src="products/v8/sidr.png" h={vertical ? 460 : 420} at={0} />
					</div>
				</Abs>
			</Sequence>

			<Music src="audio/v4/beat_promo.wav" vol={0.4} />
			<Sfx at={0} s="slam" v={0.8} />
			<Sfx at={36} s="whoosh" v={0.5} />
			<Sfx at={40} s="pop2" v={0.6} />
			<Sfx at={84} s="whoosh" v={0.5} />
			<Sfx at={84} s="stamp" v={0.7} />
		</AbsoluteFill>
	);
};

export const V8_VIDEOS = [
	{id: 'W8-hook-preview-9x16', fmt: '9x16' as const, dur: HOOK8_DUR, C: Hook8},
	{id: 'W8-hook-preview-4x5', fmt: '4x5' as const, dur: HOOK8_DUR, C: Hook8},
	{id: 'W8-hook-avantapres-9x16', fmt: '9x16' as const, dur: HOOKBA_DUR, C: HookBA},
	{id: 'W8-hook-avantapres-4x5', fmt: '4x5' as const, dur: HOOKBA_DUR, C: HookBA},
	{id: 'W8-intro8-9x16', fmt: '9x16' as const, dur: INTRO8_DUR, C: Intro8},
	{id: 'W8-intro8-4x5', fmt: '4x5' as const, dur: INTRO8_DUR, C: Intro8},
	{id: 'W8-suite-9x16', fmt: '9x16' as const, dur: PART_DUR, C: Part},
	{id: 'W8-suite-4x5', fmt: '4x5' as const, dur: PART_DUR, C: Part},
];

export const V8Video: React.FC<{id: string}> = ({id}) => {
	const e = V8_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<e.C />
		</FmtProvider>
	);
};
