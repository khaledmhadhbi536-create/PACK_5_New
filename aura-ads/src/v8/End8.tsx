import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IconCheck, IconPhone} from '../components/Icons';
import {N, RED, T, YELLOW} from '../v2/WinStill';
import {Abs, Below, Flash, useStage} from '../v4/kit';
import {Bed8, Sfx8} from './sound8';

/**
 * V8 · écran de fin : le pack (5 produits v8), 49 د.ت (110 barré), réassurance,
 * « اطلب توّا » + téléphone, et une flèche qui rebondit vers le bouton de la pub.
 * Tout est calé sur la voix (public/voice/v8/fin_offre.wav).
 */

export const END8_DUR = 240;
const V = 6; // départ de la voix
const T_PRICE = V + 42; // « بتسعة وأربعين »
const T_STRIKE = V + 81; // « عوض مية وعشرة »
const T_COD = V + 110; // « تخلّص كي يوصلك »
const T_CTA = V + 135; // « اطلب توّا من هنا »

const useSpring = (at: number, cfg = {damping: 11, stiffness: 180}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return f < at ? 0 : spring({frame: f - at, fps, config: cfg});
};

/** Les 5 produits réunis. */
const Pack8: React.FC<{h: number}> = ({h}) => {
	const items: {src: string; h: number; at: number; dx: number; z: number}[] = [
		{src: 'products/v8/derma.png', h: 0.5, at: 0, dx: -330, z: 2},
		{src: 'products/v8/huile.png', h: 0.88, at: 3, dx: -150, z: 1},
		{src: 'products/v8/sidr.png', h: 1, at: 6, dx: 10, z: 3},
		{src: 'products/v8/applicateur.png', h: 0.86, at: 9, dx: 175, z: 1},
		{src: 'products/v8/brosse.png', h: 0.46, at: 12, dx: 320, z: 4},
	];
	return (
		<div style={{position: 'relative', width: 1000, height: h}}>
			{items.map((it, i) => (
				<PackItem key={i} {...it} H={h} />
			))}
		</div>
	);
};
const PackItem: React.FC<{src: string; h: number; at: number; dx: number; z: number; H: number}> = ({src, h, at, dx, z, H}) => {
	const p = useSpring(at, {damping: 10, stiffness: 160});
	return (
		<div style={{position: 'absolute', left: '50%', bottom: 0, zIndex: z, transform: `translateX(calc(-50% + ${dx}px)) translateY(${(1 - p) * 300}px) scale(${0.5 + 0.5 * p})`, opacity: Math.min(1, p * 2)}}>
			<Img src={staticFile(src)} style={{height: H * h, width: 'auto', filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.55))'}} />
		</div>
	);
};

/** Flèche vers le bas qui rebondit. */
const Arrow: React.FC<{size: number}> = ({size}) => {
	const f = useCurrentFrame();
	const y = Math.abs(Math.sin((f - T_CTA) / 5)) * size * 0.35;
	return (
		<div style={{transform: `translateY(${y}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			{[0, 1].map((i) => (
				<svg key={i} width={size} height={size * 0.62} viewBox="0 0 100 62" style={{marginTop: i ? -size * 0.22 : 0, opacity: i ? 0.55 : 1, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))'}}>
					<path d="M8 8 L50 50 L92 8" fill="none" stroke={YELLOW} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			))}
		</div>
	);
};

export const End8: React.FC<{music?: boolean}> = ({music = true}) => {
	const f = useCurrentFrame();
	const {vertical, top} = useStage();
	const st = vertical ? top : 0;
	const L = vertical
		? {title: st + 0, pack: st + 95, packH: 380, price: st + 500, cod: st + 700, cta: st + 800, arrow: st + 930}
		: {title: 24, pack: 115, packH: 370, price: 510, cod: 720, cta: 830, arrow: 1180};
	const pPrice = useSpring(T_PRICE, {damping: 9, stiffness: 220});
	const strike = interpolate(f, [T_STRIKE, T_STRIKE + 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pCod = useSpring(T_COD);
	const pCta = useSpring(T_CTA, {damping: 9, stiffness: 200});
	const pulse = f > T_CTA + 12 ? 1 + 0.05 * Math.sin((f - T_CTA) * 0.3) : 1;
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #2F4A2B 0%, #142112 55%, #070B06 100%)', overflow: 'hidden'}}>
			<AbsoluteFill style={{opacity: 0.18, backgroundImage: `repeating-conic-gradient(from 0deg at 50% 30%, ${YELLOW} 0deg 6deg, transparent 6deg 18deg)`, transform: `rotate(${f * 0.1}deg) scale(1.6)`}} />

			<Abs top={L.title} left={30} right={30}>
				<T size={vertical ? 76 : 70} style={{textAlign: 'center', textShadow: '0 4px 16px rgba(0,0,0,0.6)'}}>
					الباك الكامل · <N style={{color: YELLOW}}>5</N> قطع
				</T>
			</Abs>
			<Abs top={L.pack}>
				<Pack8 h={L.packH} />
			</Abs>

			{/* prix */}
			<Abs top={L.price}>
				<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 26}}>
					<div style={{transform: `scale(${pPrice}) rotate(${(1 - pPrice) * -20 - 3}deg)`, background: YELLOW, borderRadius: 30, padding: '0 40px', boxShadow: '0 14px 0 rgba(0,0,0,0.3)'}}>
						<T size={150} color="#111" style={{lineHeight: 1.2}}>
							<N style={{fontSize: 160}}>49</N> د.ت
						</T>
					</div>
					{f >= T_PRICE ? (
						<div style={{position: 'relative'}}>
							<T size={64} color="rgba(255,255,255,0.85)">
								عوض <N>110</N>
							</T>
							<div style={{position: 'absolute', right: -6, left: -6, top: '55%', height: 10, borderRadius: 5, background: RED, transform: `rotate(-8deg) scaleX(${strike})`, transformOrigin: 'right center'}} />
						</div>
					) : null}
				</div>
			</Abs>

			{/* réassurance */}
			<Abs top={L.cod}>
				<div dir="rtl" style={{display: 'flex', gap: 16, transform: `translateY(${(1 - pCod) * 60}px)`, opacity: pCod}}>
					{['تخلّص كي يوصلك', 'توصيل لكامل الولايات'].map((c) => (
						<div key={c} style={{display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.95)', borderRadius: 999, padding: '4px 22px 8px 10px'}}>
							<div style={{width: 44, height: 44, borderRadius: '50%', background: '#2FA35A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<IconCheck size={28} color="#fff" />
							</div>
							<T size={36} color="#111" style={{whiteSpace: 'nowrap'}}>
								{c}
							</T>
						</div>
					))}
				</div>
			</Abs>

			{/* appel à l'action */}
			<Abs top={L.cta}>
				<div style={{transform: `scale(${pCta * pulse})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
					<div style={{background: RED, borderRadius: 999, padding: '4px 60px 14px', boxShadow: '0 10px 0 rgba(0,0,0,0.3), 0 0 40px rgba(226,52,59,0.5)'}}>
						<T size={70}>اطلب توّا</T>
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, direction: 'ltr'}}>
						<IconPhone size={38} color="#fff" />
						<N style={{fontSize: 44, color: '#fff'}}>50 500 051</N>
					</div>
				</div>
			</Abs>
			{f >= T_CTA + 6 ? (
				vertical ? (
					<Below>
						<div style={{display: 'flex', justifyContent: 'center', paddingTop: 40}}>
							<Arrow size={190} />
						</div>
					</Below>
				) : (
					<Abs top={L.arrow - 70}>
						<Arrow size={120} />
					</Abs>
				)
			) : null}

			<Flash at={T_PRICE} max={0.4} color={YELLOW} />
			{music ? <Bed8 voice={[[V, V + 160]]} dur={END8_DUR} /> : null}
			<Sequence from={V} layout="none">
				<Audio src={staticFile('voice/v8/fin_offre.wav')} volume={1.4} />
			</Sequence>
			<Sfx8 at={0} s="whoosh" v={0.45} />
			{[0, 3, 6, 9, 12].map((d, i) => (
				<Sfx8 key={i} at={d} s={`pop${i + 1}` as 'pop1'} v={0.35} />
			))}
			<Sfx8 at={T_PRICE} s="impact" v={0.6} />
			<Sfx8 at={T_PRICE + 4} s="coin" v={0.4} />
			<Sfx8 at={T_STRIKE} s="scribble" v={0.55} />
			<Sfx8 at={T_COD} s="ding" v={0.4} />
			<Sfx8 at={T_CTA} s="hit" v={0.5} />
			<Sfx8 at={T_CTA + 2} s="shimmer" v={0.3} />
		</AbsoluteFill>
	);
};
