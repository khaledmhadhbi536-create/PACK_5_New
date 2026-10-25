import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme/brand';
import {OFFER2 as O} from '../v2/offer';
import {N, RED, Rays, Stars, T, YELLOW} from '../v2/WinStill';
import {Card, P, Pack, Prod, TITLE} from '../v3/V3Still';
import {Abs, Below, Counter, CtaAnim, ease, Flash, FooterPill, In, Music, Pulse, Sfx, Shake, Spin, Stage, StrikeAnim, Ticks, useStage} from './kit';

/** Pack décoratif du bas (9:16) ou pack central (4:5). */
const BottomPack: React.FC<{shadow?: string}> = ({shadow}) => (
	<Below>
		<In at={0} kind="up" dist={200}>
			<div style={{display: 'flex', justifyContent: 'center', paddingTop: 34}}>
				<Pack W={980} H={600} shadow={shadow} />
			</div>
		</In>
	</Below>
);

// ======================= V03 · prix barré géant (6 s) =======================

export const V03_DUR = 180;
export const V03: React.FC = () => {
	const {vertical, fmt} = useStage();
	const sq = fmt === '1x1';
	const frame = useCurrentFrame();
	const L = vertical
		? {chip: 10, num: 110, sub: 440, per: 540, cta: 690, foot: 889}
		: sq
			? {chip: 20, num: 80, sub: 385, per: 0, cta: 838, foot: 990}
			: {chip: 30, num: 110, sub: 430, per: 0, cta: 1040, foot: 1236};
	const red = ease(frame, 16, 40);
	return (
		<AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, rgba(255,210,205,${0.4 + 0.6 * red}) 0%, #fff 62%)`}} />
			<Shake hits={[8, 40]} amp={14}>
				<BottomPack shadow="rgba(0,0,0,0.22)" />
				<Stage>
					<Abs top={L.chip}>
						<In at={50} kind="down">
							<T size={40} style={{background: RED, padding: '2px 34px 8px', borderRadius: 999}}>{TITLE}</T>
						</In>
					</Abs>
					{/* 110 barré, puis le compteur descend jusqu'à 49 */}
					<Abs top={L.num}>
						<In at={0} kind="zoom" out={16} outKind="shrink">
							<div style={{position: 'relative'}}>
								<N style={{fontSize: 280, color: '#8E8E8E', lineHeight: 1.1}}>{O.oldPrice}</N>
								<div style={{position: 'absolute', right: -20, top: '48%', height: 26, borderRadius: 13, background: RED, transform: 'rotate(-10deg)', transformOrigin: 'right center', width: `${ease(frame, 6, 14) * 110}%`}} />
							</div>
						</In>
					</Abs>
					<Abs top={L.num}>
						<In at={16} kind="pop">
							<div style={{display: 'flex', alignItems: 'baseline', gap: 16, direction: 'ltr'}}>
								<Counter at={16} dur={24} from={110} to={49} style={{fontSize: 290, color: interpolate(frame, [16, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) > 0.5 ? RED : '#8E8E8E', lineHeight: 1.1}} />
								<T size={90} color={RED}>د.ت</T>
							</div>
						</In>
					</Abs>
					<Abs top={L.sub}>
						<In at={46} kind="up">
							<T size={58} color="#111">
								الباك الكامل، <N>5</N> قطع
							</T>
						</In>
					</Abs>
					{vertical ? (
						<Abs top={L.per}>
							<In at={60} kind="fade">
								<StrikeAnim at={64} size={50} color="#555" />
							</In>
						</Abs>
					) : (
						<Abs top={sq ? 460 : 540}>
							<In at={0} kind="up" dist={100}>
								<Pack W={sq ? 620 : 780} H={sq ? 360 : 470} shadow="rgba(0,0,0,0.22)" />
							</In>
						</Abs>
					)}
					<Abs top={L.cta}>
						<CtaAnim at={92} size={sq ? 54 : 62} bg={RED} />
					</Abs>
					<Abs top={L.foot} left={0} right={0}>
						<FooterPill at={104} />
					</Abs>
				</Stage>
			</Shake>
			<Flash at={40} color="#FFD9D4" max={0.6} />
			<Music src="audio/v4/beat_promo.wav" vol={0.4} start={4} />
			<Sfx at={0} s="bass" v={0.6} />
			<Sfx at={6} s="marker" v={0.9} />
			<Ticks a={16} b={40} every={2} />
			<Sfx at={40} s="cash" v={0.8} />
			<Sfx at={46} s="whoosh" v={0.45} />
			<Sfx at={64} s="marker" v={0.5} />
			<Sfx at={92} s="pop4" v={0.6} />
		</AbsoluteFill>
	);
};

// ======================= V02 · le calcul (10 s) =======================

export const V02_DUR = 300;
export const V02: React.FC = () => {
	const {vertical} = useStage();
	const L = vertical
		? {head: 20, tiles: 330, eq: 640, strike: 790, cta: 750, foot: 889}
		: {head: 40, tiles: 420, eq: 790, strike: 960, cta: 1060, foot: 1236};
	const tileW = 182;
	return (
		<AbsoluteFill style={{background: YELLOW, overflow: 'hidden'}}>
			<Spin speed={0.1}>
				<Rays color="#fff" opacity={0.35} cy="40%" />
			</Spin>
			<Shake hits={[112, 200]} amp={12}>
				<BottomPack shadow="rgba(0,0,0,0.25)" />
				<Stage>
					{/* hook : 49 ÷ 5 = ? */}
					<Abs top={L.head}>
						<In at={0} kind="pop" out={104} outKind="up">
							<div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'ltr'}}>
								<N style={{fontSize: 150, color: '#111'}}>49 ÷ 5 =</N>
								<div style={{minWidth: 230, textAlign: 'center'}}>
									<CalcResult />
								</div>
							</div>
						</In>
					</Abs>
					<Abs top={L.head - 10}>
						<In at={110} kind="drop" out={vertical ? 230 : undefined} outKind="up">
							<div style={{textAlign: 'center'}}>
								<T size={128} color="#111" style={{lineHeight: 1.05}}>
									أقل من <N style={{color: RED}}>10</N> د.ت
								</T>
								<T size={84} color={RED} style={{transform: 'rotate(-2deg)'}}>للقطعة!</T>
							</div>
						</In>
					</Abs>
					{/* produits + étiquettes 9.8 */}
					<Abs top={L.tiles}>
						<div dir="rtl" style={{display: 'flex', gap: 10}}>
							{P.map((p, i) => (
								<In key={p.key} at={2 + i * 3} kind="up" dist={80}>
									<div style={{width: tileW, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
										<div style={{width: tileW, height: 220, borderRadius: 24, background: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,0.2)', padding: 12, boxSizing: 'border-box'}}>
											<Prod k={p.key} w={tileW - 24} h={196} />
										</div>
										<In at={62 + i * 8} kind="drop" dist={40}>
											<div style={{marginTop: -26, background: RED, borderRadius: 14, padding: '2px 14px 6px', boxShadow: '0 6px 0 rgba(0,0,0,0.2)', transform: `rotate(${i % 2 ? 4 : -4}deg)`}}>
												<T size={30}>
													<N style={{fontSize: 32}}>{O.perPiece}</N> د.ت
												</T>
											</div>
										</In>
										<T size={25} color="#111" style={{marginTop: 6, whiteSpace: 'nowrap'}}>{p.name}</T>
									</div>
								</In>
							))}
						</div>
					</Abs>
					{/* équation */}
					<Abs top={L.eq} left={40} right={40}>
						<In at={150} kind="up" out={vertical ? 232 : undefined} outKind="fade">
							<div dir="rtl" style={{background: '#fff', borderRadius: 30, boxShadow: '0 14px 0 rgba(0,0,0,0.15)', padding: '18px 10px 26px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
								<T size={54} color="#111"><N>5</N> قطع</T>
								<N style={{fontSize: 54, color: '#888'}}>×</N>
								<T size={54} color="#111"><N>{O.perPiece}</N></T>
								<N style={{fontSize: 54, color: '#888'}}>=</N>
								<In at={168} kind="pop">
									<T size={84} color={RED}><N style={{fontSize: 90}}>{O.price}</N> د.ت</T>
								</In>
							</div>
						</In>
					</Abs>
					{/* fin (9:16 : remplace le titre et l'équation) */}
					{vertical ? (
						<>
							<Abs top={60}>
								<In at={236} kind="zoom">
									<div style={{background: '#111', borderRadius: 34, padding: '0 46px'}}>
										<T size={150} color={YELLOW} style={{lineHeight: 1.25}}><N style={{fontSize: 160}}>{O.price}</N> د.ت</T>
									</div>
								</In>
							</Abs>
							<Abs top={640}>
								<In at={240} kind="fade"><StrikeAnim at={244} size={50} color="#111" prefix="عوض" /></In>
							</Abs>
						</>
					) : (
						<Abs top={L.strike}>
							<In at={190} kind="fade"><StrikeAnim at={194} size={50} color="#111" prefix="عوض" /></In>
						</Abs>
					)}
					<Abs top={L.cta}>
						<CtaAnim at={vertical ? 252 : 206} bg="#111" color={YELLOW} size={60} />
					</Abs>
					<Abs top={L.foot} left={0} right={0}>
						<FooterPill at={vertical ? 262 : 220} />
					</Abs>
				</Stage>
			</Shake>
			<Flash at={112} max={0.5} />
			<Music src="audio/v4/beat_promo.wav" vol={0.4} start={8} />
			<Sfx at={0} s="slam" v={0.7} />
			{P.map((_, i) => <Sfx key={i} at={2 + i * 3} s="pop1" v={0.35} />)}
			<Ticks a={30} b={54} every={2} />
			<Sfx at={54} s="check" v={0.7} />
			{P.map((_, i) => <Sfx key={'t' + i} at={62 + i * 8} s={`pop${i + 1}` as 'pop1'} v={0.7} />)}
			<Sfx at={104} s="whoosh" v={0.6} />
			<Sfx at={110} s="slam" v={0.85} />
			<Sfx at={150} s="whoosh" v={0.5} />
			<Sfx at={168} s="cash" v={0.75} />
			{vertical ? <Sfx at={236} s="stamp" v={0.9} /> : null}
			<Sfx at={vertical ? 244 : 194} s="marker" v={0.8} />
		</AbsoluteFill>
	);
};

const CalcResult: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame < 30) {
		return (
			<Pulse from={4} amp={0.12} speed={0.4}>
				<N style={{fontSize: 150, color: RED}}>?</N>
			</Pulse>
		);
	}
	return <Counter at={30} dur={24} from={0} to={9.8} decimals={1} style={{fontSize: 150, color: RED}} />;
};

// ======================= V04 · comparatif (10 s) =======================

export const V04_DUR = 300;
export const V04: React.FC = () => {
	const {vertical} = useStage();
	const frame = useCurrentFrame();
	const L = vertical
		? {title: 0, sub: 105, cols: 175, colH: 560, cta: 765, foot: 889}
		: {title: 30, sub: 140, cols: 220, colH: 760, cta: 1030, foot: 1236};
	const total = Math.round(interpolate(frame, [12, 68], [0, 110], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	return (
		<AbsoluteFill style={{background: '#F4F1EA', overflow: 'hidden'}}>
			<Shake hits={[2, 90]} amp={12}>
				<BottomPack shadow="rgba(0,0,0,0.2)" />
				<Stage>
					<Abs top={L.title}>
						<In at={0} kind="drop">
							<T size={84} color="#111">علاش تشري بالقطعة؟</T>
						</In>
					</Abs>
					<Abs top={L.sub}>
						<In at={10} kind="fade">
							<T size={40} color="#555">{TITLE}</T>
						</In>
					</Abs>
					<Abs top={L.cols} left={40} right={40}>
						<div dir="rtl" style={{display: 'flex', gap: 26}}>
							{/* à la pièce */}
							<div style={{flex: 1, height: L.colH, background: '#fff', borderRadius: 30, border: '4px solid #E2E2E2', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<T size={44} color="#777">بالقطعة</T>
								<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 14}}>
									{P.map((p, i) => (
										<In key={p.key} at={12 + i * 12} kind="drop" dist={30}>
											<Prod k={p.key} w={130} h={vertical ? 130 : 160} />
										</In>
									))}
								</div>
								<div style={{marginTop: 'auto', position: 'relative'}}>
									<T size={80} color={frame > 120 ? '#999' : '#111'}>
										<N style={{fontSize: 92}}>{total}</N> د.ت
									</T>
									<div style={{position: 'absolute', right: -10, top: '52%', height: 14, background: RED, transform: 'rotate(-8deg)', transformOrigin: 'right center', borderRadius: 7, width: `${ease(frame, 122, 132) * 110}%`}} />
								</div>
							</div>
							{/* le pack */}
							<div style={{flex: 1, height: L.colH, background: '#1F3A28', borderRadius: 30, border: `6px solid ${C.gold}`, padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.25)'}}>
								<T size={44} color={C.goldLight}>في الباك</T>
								<In at={88} kind="drop" dist={60}>
									<div style={{marginTop: 20}}>
										<Pack W={420} H={vertical ? 300 : 380} />
									</div>
								</In>
								<div style={{marginTop: 'auto'}}>
									<In at={104} kind="zoom">
										<div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
											<N style={{fontSize: 130, color: '#fff', lineHeight: 1}}>{O.price}</N>
											<T size={60}>د.ت</T>
										</div>
									</In>
								</div>
							</div>
						</div>
					</Abs>
					<Abs top={L.cta} z={5}>
						<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 30}}>
							<In at={142} kind="pop">
								<Pulse from={160} amp={0.04}>
									<div style={{background: RED, borderRadius: 999, padding: '4px 36px 12px', boxShadow: '0 10px 0 rgba(0,0,0,0.2)', transform: 'rotate(-3deg)'}}>
										<T size={56}>
											وفّر <N>61</N> د.ت
										</T>
									</div>
								</Pulse>
							</In>
							<CtaAnim at={176} size={56} bg="#111" />
						</div>
					</Abs>
					<Abs top={L.foot} left={0} right={0}>
						<FooterPill at={196} />
					</Abs>
				</Stage>
			</Shake>
			<Music src="audio/v4/beat_promo.wav" vol={0.38} start={12} />
			<Sfx at={0} s="slam" v={0.7} />
			{P.map((_, i) => <Sfx key={i} at={12 + i * 12} s={`pop${i + 1}` as 'pop1'} v={0.65} />)}
			<Ticks a={12} b={68} every={4} v={0.35} />
			<Sfx at={88} s="slam" v={0.8} />
			<Sfx at={104} s="cash" v={0.8} />
			<Sfx at={122} s="marker" v={0.8} />
			<Sfx at={142} s="sparkle" v={0.6} />
			<Sfx at={176} s="pop4" v={0.5} />
		</AbsoluteFill>
	);
};

// ======================= V12 · Black Friday (7 s) =======================

const Glitch: React.FC<{text: string; size: number; color: string; until: number}> = ({text, size, color, until}) => {
	const frame = useCurrentFrame();
	const g = frame < until && frame % 3 !== 2;
	const dx = g ? ((frame * 37) % 23) - 11 : 0;
	const base: React.CSSProperties = {fontFamily: F.latin, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: 2};
	return (
		<div style={{position: 'relative'}}>
			{g ? <span style={{...base, position: 'absolute', left: dx, color: '#FF2D55', opacity: 0.8}}>{text}</span> : null}
			{g ? <span style={{...base, position: 'absolute', left: -dx, color: '#2DE1FF', opacity: 0.8}}>{text}</span> : null}
			<span style={{...base, position: 'relative', color, clipPath: g ? `inset(${(frame * 13) % 40}% 0 ${(frame * 7) % 30}% 0)` : undefined}}>{text}</span>
		</div>
	);
};

export const V12_DUR = 210;
export const V12: React.FC = () => {
	const {vertical, fmt} = useStage();
	const sq = fmt === '1x1';
	const L = vertical
		? {black: 0, friday: 125, title: 265, pack: 0, bar: 360, strike: 640, cta: 740, foot: 889}
		: sq
			? {black: 20, friday: 140, title: 265, pack: 320, bar: 695, strike: 885, cta: 860, foot: 990}
			: {black: 30, friday: 160, title: 300, pack: 380, bar: 880, strike: 1030, cta: 1110, foot: 1236};
	return (
		<AbsoluteFill style={{background: '#0B0B0B', overflow: 'hidden'}}>
			<Spin speed={0.1}>
				<Rays color={YELLOW} opacity={0.08} cy="50%" />
			</Spin>
			<Shake hits={[0, 34, 60]} amp={16}>
				<BottomPack shadow="rgba(255,212,59,0.2)" />
				<Stage>
					<Abs top={L.black}><Glitch text="BLACK" size={sq ? 125 : 150} color={YELLOW} until={14} /></Abs>
					<Abs top={L.friday}><Glitch text="FRIDAY" size={sq ? 125 : 150} color="#fff" until={16} /></Abs>
					<Abs top={L.title}>
						<In at={20} kind="up"><T size={46}>{TITLE}</T></In>
					</Abs>
					{vertical ? null : (
						<Abs top={L.pack}>
							<In at={0} kind="up" dist={100}><Pack W={sq ? 620 : 780} H={sq ? 370 : 470} shadow="rgba(255,212,59,0.2)" /></In>
						</Abs>
					)}
					<Abs top={vertical ? 370 : 400} left={vertical ? 800 : 50} z={6}>
						<In at={34} kind="drop">
							<div style={{width: 230, height: 230, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)', boxShadow: '0 12px 30px rgba(0,0,0,0.5)', border: '6px solid #fff'}}>
								<N style={{fontSize: 86, color: '#fff'}}>-55%</N>
							</div>
						</In>
					</Abs>
					<Abs top={L.bar} left={40} right={vertical ? 300 : 40}>
						<In at={60} kind="right">
							<div dir="rtl" style={{background: YELLOW, borderRadius: 28, padding: '10px 30px 18px', display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between'}}>
								<T size={54} color="#111">الباك كامل بـ</T>
								<T size={sq ? 90 : 110} color="#111"><N style={{fontSize: sq ? 100 : 120}}>{O.price}</N> د.ت</T>
							</div>
						</In>
					</Abs>
					<Abs top={L.strike} right={sq ? 70 : undefined}>
						<In at={80} kind="fade"><StrikeAnim at={84} size={46} /></In>
					</Abs>
					<Abs top={L.cta} left={sq ? 60 : undefined}>
						<CtaAnim at={104} size={sq ? 54 : 60} bg={YELLOW} color="#111" />
					</Abs>
					<Abs top={L.foot} left={0} right={0}>
						<FooterPill at={116} bg="#000" accent={YELLOW} />
					</Abs>
				</Stage>
			</Shake>
			<Flash at={34} color={RED} max={0.35} />
			<Music src="audio/v4/beat_promo.wav" vol={0.45} start={0} />
			<Sfx at={0} s="bass" v={0.9} />
			<Sfx at={0} s="glitch" v={0.7} />
			<Sfx at={20} s="whoosh" v={0.4} />
			<Sfx at={34} s="stamp" v={0.9} />
			<Sfx at={60} s="whoosh" v={0.6} />
			<Sfx at={66} s="cash" v={0.7} />
			<Sfx at={84} s="marker" v={0.8} />
			<Sfx at={104} s="pop5" v={0.5} />
		</AbsoluteFill>
	);
};

// ======================= V10 · l'hiver (8 s) =======================

const Snow: React.FC<{n?: number}> = ({n = 70}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{Array.from({length: n}, (_, i) => {
				const r = (k: number) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
				const size = 6 + r(1) * 16;
				const speed = 2 + r(2) * 4;
				const x = r(3) * 1080 + Math.sin((frame + i * 20) / 22) * 20;
				const yv = ((r(4) * 2000 + frame * speed) % 2050) - 60;
				return <div key={i} style={{position: 'absolute', left: x, top: yv, width: size, height: size, borderRadius: '50%', background: '#fff', opacity: 0.35 + r(5) * 0.5, filter: size > 16 ? 'blur(2px)' : undefined}} />;
			})}
		</AbsoluteFill>
	);
};

export const V10_DUR = 240;
export const V10: React.FC = () => {
	const {vertical} = useStage();
	const frame = useCurrentFrame();
	const L = vertical
		? {title: 0, sub: 215, sub2: 300, cards: 390, block: 380, strike: 660, cta: 760, foot: 889}
		: {title: 30, sub: 260, sub2: 350, cards: 470, block: 560, strike: 870, cta: 1040, foot: 1236};
	const blur = interpolate(frame, [0, 14], [18, 0], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #2F6BB0 0%, #173A6B 55%, #0B1E3D 100%)', overflow: 'hidden'}}>
			<Stars color="#000" opacity={0.1} />
			<Spin speed={0.08}>
				<Rays color="#CFE3FF" opacity={0.12} cy="50%" />
			</Spin>
			<Snow />
			<Shake hits={[124]} amp={10}>
				<BottomPack shadow="rgba(0,0,0,0.35)" />
				<Stage>
					<Abs top={L.title}>
						<In at={0} kind="zoom">
							<T size={170} font={F.display} weight={400} color="#EAF4FF" style={{lineHeight: 1.15, filter: `blur(${blur}px)`, textShadow: '0 8px 0 #0B1E3D, 0 0 40px rgba(160,200,255,0.5)', WebkitTextStroke: '3px #0B1E3D'}}>
								الشتاء جاي
							</T>
						</In>
					</Abs>
					<Abs top={L.sub}>
						<In at={20} kind="up"><T size={58}>روتين كامل للشعر واللحية</T></In>
					</Abs>
					<Abs top={L.sub2}>
						<In at={32} kind="fade"><T size={42} color="#FFE7A8"><N>5</N> قطع في باك واحد</T></In>
					</Abs>
					{!vertical ? (
						<Abs top={L.cards - 0}>
							<In at={0} kind="up" dist={100} out={42} outKind="shrink">
								<Pack W={760} H={460} shadow="rgba(0,0,0,0.35)" />
							</In>
						</Abs>
					) : null}
					<Abs top={L.cards}>
						<div dir="rtl" style={{display: 'flex', gap: 12}}>
							{P.map((p, i) => (
								<In key={p.key} at={46 + i * 7} kind="left" out={108} outKind="fade">
									<Card i={i} w={186} h={250} nameSize={22} />
								</In>
							))}
						</div>
					</Abs>
					<Abs top={L.block} left={60} right={60}>
						<In at={114} kind="right">
							<div dir="rtl" style={{height: 250, background: YELLOW, clipPath: 'polygon(1% 8%, 6% 2%, 30% 6%, 55% 0%, 80% 5%, 97% 1%, 100% 30%, 98% 62%, 100% 94%, 75% 98%, 50% 93%, 22% 100%, 3% 95%, 0% 60%, 2% 30%)', transform: 'rotate(-2deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30}}>
								<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
									<T size={56} color="#111">الباك كامل بـ</T>
									<T size={76} color="#111">دينار</T>
								</div>
								<In at={124} kind="zoom">
									<N style={{fontSize: 200, color: RED, lineHeight: 1, textShadow: '6px 6px 0 #111'}}>{O.price}</N>
								</In>
							</div>
						</In>
					</Abs>
					<Abs top={L.strike}>
						<In at={146} kind="fade"><StrikeAnim at={150} size={50} /></In>
					</Abs>
					<Abs top={L.cta}>
						<CtaAnim at={168} size={58} />
					</Abs>
					<Abs top={L.foot} left={0} right={0}>
						<FooterPill at={180} bg="#08142A" />
					</Abs>
				</Stage>
			</Shake>
			<Music src="audio/v4/beat_promo.wav" vol={0.38} start={16} />
			<Sfx at={0} s="snow" v={0.9} />
			<Sfx at={20} s="whoosh" v={0.4} />
			{P.map((_, i) => <Sfx key={i} at={46 + i * 7} s={`pop${i + 1}` as 'pop1'} v={0.6} />)}
			<Sfx at={108} s="whoosh" v={0.6} />
			<Sfx at={124} s="stamp" v={0.9} />
			<Sfx at={130} s="cash" v={0.6} />
			<Sfx at={150} s="marker" v={0.8} />
			<Sfx at={168} s="pop4" v={0.5} />
		</AbsoluteFill>
	);
};
