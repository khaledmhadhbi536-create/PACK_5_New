import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IconPhone, IconTruck} from '../components/Icons';
import {F} from '../theme/brand';
import {Clip, FmtProvider, useStage} from '../v4/kit';
import {REVEALS} from '../v8/Reveal';
import {Sfx8} from '../v8/sound8';
import {Blink, Cam, Fill, Grain, Kicker, P, Push, Rays, Slam, Vignette, b, tw, typeOn, useShake} from './kin9';

/**
 * V9 · même pub que V8 (mêmes voix, produits et rushs), refaite en « kinetic typography »
 * selon la méthode du skill scenario-kinetic-film : un mot énorme par temps (150 BPM, 1 temps = 12 images),
 * whips avec flou de mouvement, sols qui changent de couleur, caméra jamais immobile, drop sur le 1er produit.
 */

const HOOK = b(8);
const MYST = b(12);
const DURS = [b(14), b(21), b(17), b(16), b(13)];
const END = b(17);
export const FILM9_DUR = HOOK + MYST + DURS.reduce((a, d) => a + d, 0) + END;

const useLay = () => {
	const {vertical, top, h, W, H} = useStage();
	const cy = vertical ? top + h / 2 : H / 2;
	return {vertical, top, h, W, H, cy};
};

/** Texte latin (chiffres) qui claque. */
const Num: React.FC<{
	at: number;
	text: string;
	y: number;
	size: number;
	color: string;
	until?: number;
}> = ({at, text, y, size, color, until}) => {
	const f = useCurrentFrame();
	if (f < at || (until !== undefined && f >= until)) return null;
	const sl = tw(f, at, 5);
	const s = (1.7 - 0.7 * sl) * (1 + 0.04 * ((f - at) / 30));
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: y - size * 0.6,
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<div
				dir="ltr"
				style={{
					fontFamily: F.latin,
					fontWeight: 800,
					fontSize: size,
					lineHeight: 1.1,
					color,
					transform: `scale(${s})`,
					filter: sl < 0.95 ? `blur(${(1 - sl) * 12}px)` : undefined,
				}}
			>
				{text}
			</div>
		</div>
	);
};

// ---------------------------------------------------------------- accroche (8 temps)

const Hook9: React.FC = () => {
	const {vertical, top, h, H, cy} = useLay();
	const sh = useShake([0, 48], 18);
	const low = vertical ? top + h - 40 : H - 60;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
				<Sequence durationInFrames={48}>
					<Cam id="hk1" dur={48} whipIn={null} whipOut="x" push={0.12}>
						<Push src="photos/perso/avant.png" dur={48} from={1.05} to={1.2} pan={18} dim={0.35} />
						<Slam at={0} from={1.12} text="كيفاش" y={cy - 280} max={300} echo />
						<Slam at={12} text="شعرو" y={cy - 20} max={330} color={P.accent} />
						<Slam at={24} text="من هكا…" y={cy + 250} max={230} />
					</Cam>
				</Sequence>
				<Sequence from={48} durationInFrames={48}>
					<Cam id="hk2" dur={48} whipIn="x" whipOut="y" push={0.1}>
						<Push src="photos/perso/apres.png" dur={48} from={1.05} to={1.18} pan={-18} dim={0.3} />
						<Slam at={0} text="ولّى هكا؟" y={cy - 120} max={300} color={P.accent} echo echoColor={P.paper} />
						<Slam at={22} text="شنوّة السرّ؟" y={cy + 200} max={170} />
					</Cam>
					<Rays at={0} y={cy - 120} />
					<Blink at={0} />
				</Sequence>
			</AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 30,
					right: 30,
					top: low,
					textAlign: 'center',
					fontFamily: F.body,
					fontWeight: 700,
					fontSize: 26,
					color: 'rgba(255,255,255,0.85)',
					textShadow: '0 2px 8px rgba(0,0,0,0.9)',
				}}
				dir="rtl"
			>
				تجربة شخصية · النتيجة تختلف من شخص لآخر
			</div>
			<Sfx8 at={0} s="hit" v={0.55} />
			<Sfx8 at={12} s="swipe" v={0.35} />
			<Sfx8 at={24} s="pop2" v={0.35} />
			<Sfx8 at={43} s="whoosh" v={0.45} />
			<Sfx8 at={48} s="impact" v={0.8} />
			<Sfx8 at={70} s="pop4" v={0.35} />
			<Sfx8 at={90} s="whoosh" v={0.45} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- les 5 « ? » (12 temps)

const CUTS = [36, 48, 60, 66, 72]; // la série accélère
const Mystery9: React.FC = () => {
	const f = useCurrentFrame();
	const {cy, W} = useLay();
	const ground = f < 14 ? 'bg' : f < 26 ? 'accent' : f < 36 ? 'paper' : f < 84 ? (['bg', 'accent', 'paper', 'bg', 'accent'] as const)[CUTS.filter((c) => f >= c).length - 1] : f < 100 ? 'bg' : 'accent';
	const sh = useShake([14, ...CUTS, 112], 14);
	// sortie : on traverse le « ؟ »
	const zo = tw(f, 132, 12, (u) => u * u * u);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id="my" dur={MYST} whipIn="y" whipOut={null} push={0.08}>
				<Fill g={ground} />
				<AbsoluteFill
					style={{
						transform: `translate(${sh.x}px, ${sh.y}px) scale(${1 + zo * 7})`,
						opacity: 1 - zo * 0.6,
					}}
				>
					<Slam at={0} from={1.2} text="استعمل" y={cy} max={300} echo until={14} />
					<Num at={14} text="5" y={cy} size={760} color={P.ink} until={26} />
					<Slam at={26} text="حاجات" y={cy} max={320} color={P.ink} until={36} />
					{CUTS.map((c, i) => (
						<Num key={c} at={c} text={`${i + 1}?`} y={cy} size={i % 3 === 0 ? 640 : 600} color={typeOn((['bg', 'accent', 'paper', 'bg', 'accent'] as const)[i])} until={CUTS[i + 1] ?? 84} />
					))}
					{f >= 84 && f < 100 ? (
						<div
							dir="ltr"
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: cy - 80,
								display: 'flex',
								justifyContent: 'center',
								gap: 14,
							}}
						>
							{[0, 1, 2, 3, 4].map((i) => {
								const p =
									f < 84 + i * 2
										? 0
										: spring({
												frame: f - 84 - i * 2,
												fps: 30,
												config: {damping: 9, stiffness: 260},
											});
								return (
									<div
										key={i}
										style={{
											width: (W - 120) / 5,
											height: (W - 120) / 5,
											borderRadius: '50%',
											border: `8px solid ${P.accent}`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											transform: `scale(${p})`,
											fontFamily: F.latin,
											fontWeight: 800,
											fontSize: 90,
											color: P.paper,
										}}
									>
										{i + 1}
										<span style={{color: P.accent}}>?</span>
									</div>
								);
							})}
						</div>
					) : null}
					<Slam at={100} text="تحب تعرفهم" y={cy - 170} max={230} color={P.ink} shadow={false} />
					<Slam at={112} text="شنوّة؟" y={cy + 120} max={420} color={P.ink} echo />
				</AbsoluteFill>
				<Rays at={14} color={P.ink} />
				<Rays at={112} color={P.ink} />
			</Cam>
			<Blink at={36} len={3} />
			<Sequence from={2} layout="none">
				<Audio src={staticFile('voice/v8/mystere_1.wav')} volume={1.4} />
			</Sequence>
			<Sequence from={100} layout="none">
				<Audio src={staticFile('voice/v8/mystere_2.wav')} volume={1.4} />
			</Sequence>
			<Sfx8 at={0} s="whoosh" v={0.4} />
			<Sfx8 at={14} s="impact" v={0.55} />
			<Sfx8 at={26} s="swipe" v={0.35} />
			{CUTS.map((c, i) => (
				<Sfx8 key={c} at={c} s="hit" v={0.35 + i * 0.06} />
			))}
			{[0, 1, 2, 3, 4].map((i) => (
				<Sfx8 key={`p${i}`} at={84 + i * 2} s={`pop${i + 1}` as 'pop1'} v={0.3} />
			))}
			<Sfx8 at={100} s="swipe" v={0.3} />
			<Sfx8 at={112} s="hit" v={0.55} />
			<Sfx8 at={128} s="riser" v={0.5} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- un produit révélé

const OPEN = 12;
type Shot9 = {
	src: string;
	trim?: number;
	rate?: number;
	frames: number;
	pos?: string;
	photo?: boolean;
	contain?: string;
	band?: boolean;
	from?: number;
	to?: number;
	pan?: number;
};
const SHOTS: Shot9[][] = [
	[
		{src: 'rushs/perso/sidr_front.mp4', trim: 0.3, frames: 64},
		{src: 'rushs/perso/sidr_top.mp4', trim: 0.4, frames: 92},
	],
	[
		{
			src: 'photos/v8/huile_scene.jpg',
			frames: 78,
			photo: true,
			pos: '50% 72%',
		},
		{src: 'rushs/perso/massage.mp4', trim: 0.4, rate: 0.91, frames: 162},
	],
	[
		{src: 'rushs/derma_roll_crown.mp4', trim: 0, frames: 110, pos: '50% 50%'},
		{src: 'photos/v8/derma_scene.jpg', frames: 40, photo: true, contain: '#FFFFFF', from: 0.9, to: 1.25, pan: 160},
		{src: 'photos/v8/derma_scene.jpg', frames: 42, photo: true, pos: '50% 50%', from: 1.5, to: 1.15, pan: -200},
	],
	[
		{
			src: 'rushs/perso/brosse_massage.mp4',
			trim: 0,
			rate: 0.75,
			frames: 180,
			band: true,
		},
	],
	[
		{src: 'photos/rituel_huile.jpg', frames: 48, photo: true, pos: '50% 40%', from: 1.1, to: 1.5, pan: 220},
		{src: 'photos/rituel_huile.jpg', frames: 55, photo: true, pos: '35% 60%', from: 1.7, to: 1.3, pan: -240},
		{src: 'photos/rituel_huile.jpg', frames: 41, photo: true, pos: '65% 30%', from: 1.25, to: 1.7, pan: 200},
	],
];

const Product: React.FC<{src: string; h: number; at: number}> = ({src, h, at}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {vertical, W} = useLay();
	if (f < at) return null;
	const p = spring({
		frame: f - at,
		fps,
		config: {damping: 10, stiffness: 170},
	});
	const fl = Math.sin((f - at) / 14) * 10;
	return (
		<div
			style={{
				position: 'absolute',
				right: vertical ? 40 : 30,
				bottom: vertical ? 70 : 24,
				transform: `translateY(${(1 - p) * 500 + fl}px) rotate(${(1 - p) * 25 + Math.sin((f - at) / 22) * 2.5}deg) scale(${0.6 + 0.4 * p})`,
				transformOrigin: 'bottom center',
			}}
		>
			<Img
				src={staticFile(src)}
				style={{
					height: h,
					width: 'auto',
					maxWidth: W * 0.42,
					objectFit: 'contain',
					filter: 'drop-shadow(0 22px 30px rgba(0,0,0,0.65))',
				}}
			/>
		</div>
	);
};

/** Bienfait : petit « يساعد في » + gros mot posé sur une bande inclinée qui entre en whip. */
const Benefit: React.FC<{
	at: number;
	until: number;
	text: string;
	pre: string;
	i: number;
}> = ({at, until, text, pre, i}) => {
	const f = useCurrentFrame();
	const {vertical, W, cy} = useLay();
	if (f < at || f >= until) return null;
	const u = tw(f, at, 5);
	const out = tw(f, until - 4, 4, (x) => x * x);
	const band = i % 2 === 0 ? P.accent : P.ink;
	const col = i % 2 === 0 ? P.ink : P.paper;
	const y = vertical ? cy + 300 : cy + 130;
	const size = Math.min(vertical ? 130 : 120, Math.floor((W * 0.88) / Math.max(1, [...text].length * 0.5)));
	const sg = i % 2 === 0 ? 1 : -1;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: y,
				transform: `translateX(${sg * ((1 - u) * W * 1.1 - out * W * 1.1)}px)`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: -60,
					right: -60,
					top: -size * 0.75,
					height: size * 1.45,
					background: band,
					transform: 'rotate(-3deg)',
					boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
				}}
			/>
			{pre ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: -size * 0.75 - 92,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<div
						dir="rtl"
						style={{
							background: i % 2 === 0 ? P.ink : P.accent,
							color: i % 2 === 0 ? P.paper : P.ink,
							fontFamily: F.body,
							fontWeight: 900,
							fontSize: 50,
							padding: '0 26px 8px',
							borderRadius: 12,
							transform: 'rotate(-3deg)',
						}}
					>
						{pre}
					</div>
				</div>
			) : null}
			<div
				dir="rtl"
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: -size * 0.68,
					textAlign: 'center',
					fontFamily: F.display,
					fontSize: size,
					lineHeight: 1.15,
					color: col,
					whiteSpace: 'nowrap',
					transform: `rotate(-3deg) scale(${1.25 - 0.25 * u + 0.03 * ((f - at) / 30)})`,
				}}
			>
				{text}
			</div>
		</div>
	);
};

const Reveal9: React.FC<{i: number; dur: number}> = ({i, dur}) => {
	const f = useCurrentFrame();
	const spec = REVEALS[i];
	const {vertical, top, W, cy} = useLay();
	const shots = SHOTS[i];
	const sh = useShake([0, OPEN], 16);
	let acc = OPEN;
	const seq = shots.map((s) => {
		const start = acc;
		acc += s.frames;
		return {...s, start};
	});
	const benefits = spec.benefits ?? [];
	const hits = [OPEN + 24, ...benefits.map((bn) => OPEN + bn.at), ...(spec.header ? [OPEN + spec.header.at] : [])];
	const punch = 1 + hits.reduce((a, h) => a + 0.05 * tw(f, h, 6), 0);
	const tilt = hits.reduce((a, h, k) => a + (k % 2 ? -0.8 : 0.8) * tw(f, h, 6), 0);
	const zoomIn = tw(f, 7, 5, (u) => u * u);
	const titleY = vertical ? top + 24 : 30;
	const nameOn = f >= OPEN && f < OPEN + 24;
	const dirs = ['x', '-y', '-x', 'y', 'x'] as const;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id={`rv${i}`} dur={dur} whipIn={dirs[i]} whipOut={dirs[(i + 1) % 5]} push={0.05} roll={0.8}>
				<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
					{/* rushs : toujours en mouvement, + un coup de zoom sur chaque mot (règle du skill : jamais d'image figée) */}
					<AbsoluteFill style={{transform: `scale(${punch}) rotate(${tilt}deg)`}}>
						{seq.map((s, k) => (
							<Sequence key={k} from={s.start} durationInFrames={s.frames}>
								{s.photo ? (
									<Push src={s.src} dur={s.frames} pos={s.pos} contain={s.contain} from={s.from ?? (s.contain ? 0.92 : 1.08)} to={s.to ?? (s.contain ? 1.3 : 1.4)} pan={s.pan ?? 160} />
								) : s.band ? (
									<AbsoluteFill>
										<AbsoluteFill
											style={{
												filter: 'blur(26px) brightness(0.55)',
												transform: 'scale(1.25)',
											}}
										>
											<Clip src={s.src} trim={s.trim} rate={s.rate} />
										</AbsoluteFill>
										<div
											style={{
												position: 'absolute',
												left: 0,
												right: 0,
												top: vertical ? top + 140 : 150,
												height: Math.round(W / (576 / 452)),
												overflow: 'hidden',
												borderTop: `6px solid ${P.accent}`,
												borderBottom: `6px solid ${P.accent}`,
											}}
										>
											<Clip src={s.src} trim={s.trim} rate={s.rate} zoom={1.04} />
										</div>
									</AbsoluteFill>
								) : (
									<Clip src={s.src} trim={s.trim} rate={s.rate} pos={s.pos ?? '50% 35%'} zoom={1.08} />
								)}
							</Sequence>
						))}
					</AbsoluteFill>
					<AbsoluteFill
						style={{
							background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)',
						}}
					/>
					<Vignette a={0.45} />

					{/* nom du produit : claque au centre, puis se range en haut */}
					{nameOn ? <Slam at={OPEN} text={spec.name} y={cy - 60} max={vertical ? 190 : 170} echo color={P.paper} /> : null}
					{f >= OPEN + 24 ? (
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: titleY,
								display: 'flex',
								justifyContent: 'center',
								transform: `translateY(${(1 - tw(f, OPEN + 24, 6)) * (cy - titleY - 100)}px) scale(${1.5 - 0.5 * tw(f, OPEN + 24, 6)})`,
							}}
						>
							<div
								dir="rtl"
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 18,
									background: P.accent,
									borderRadius: 18,
									padding: '2px 30px 10px',
									boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
								}}
							>
								<span
									style={{
										fontFamily: F.latin,
										fontWeight: 800,
										fontSize: 60,
										color: P.ink,
									}}
								>
									{spec.n}
								</span>
								<span
									style={{
										fontFamily: F.display,
										fontSize: 76,
										color: P.ink,
										whiteSpace: 'nowrap',
									}}
								>
									{spec.name}
								</span>
							</div>
						</div>
					) : null}
					{spec.header && f >= OPEN + spec.header.at ? (
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: titleY + 130,
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<div
								dir="rtl"
								style={{
									background: P.paper,
									color: P.ink,
									fontFamily: F.body,
									fontWeight: 900,
									fontSize: 52,
									padding: '0 28px 8px',
									borderRadius: 14,
									transform: `rotate(3deg) scale(${spring({frame: f - OPEN - spec.header.at, fps: 30, config: {damping: 8, stiffness: 240}})})`,
									boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
								}}
							>
								📚 {spec.header.t}
							</div>
						</div>
					) : null}

					<Product src={spec.product} h={vertical ? Math.min(560, spec.productH) : Math.min(380, spec.productH * 0.75)} at={OPEN + 14} />

					{benefits.map((bn, k) => (
						<Benefit key={k} i={k} at={OPEN + bn.at} until={k + 1 < benefits.length ? OPEN + benefits[k + 1].at : dur} text={bn.t} pre={bn.pre ?? 'يساعد في'} />
					))}
				</AbsoluteFill>

				{/* ouverture : le numéro énorme sur fond jaune, puis on le traverse */}
				{f < OPEN ? (
					<AbsoluteFill style={{opacity: 1 - zoomIn}}>
						<Fill g="accent" />
						<div
							style={{
								position: 'absolute',
								inset: 0,
								transform: `scale(${1 + zoomIn * 6})`,
							}}
						>
							<Num at={0} text={`${spec.n}`} y={cy} size={vertical ? 900 : 760} color={P.ink} />
						</div>
					</AbsoluteFill>
				) : null}
				<Rays at={0} color={P.ink} />
			</Cam>
			<Blink at={OPEN} len={3} />
			<Grain />
			<Sequence from={OPEN} layout="none">
				<Audio src={staticFile(spec.voice)} volume={1.4} />
			</Sequence>
			<Sfx8 at={0} s="hit" v={0.6} />
			<Sfx8 at={7} s="whoosh" v={0.4} />
			<Sfx8 at={OPEN} s="shimmer" v={0.35} />
			<Sfx8 at={OPEN + 14} s="pop3" v={0.35} />
			{spec.header ? <Sfx8 at={OPEN + spec.header.at} s="ding" v={0.3} /> : null}
			{benefits.map((bn, k) => (
				<Sfx8 key={k} at={OPEN + bn.at} s="swipe" v={0.3} />
			))}
			<Sfx8 at={dur - 5} s="whoosh" v={0.35} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- fin (17 temps)

const V = 6;
const T_PRICE = V + 38;
const T_STRIKE = V + 74;
const T_COD = V + 101;
const T_CTA = V + 124;

const PACK = [
	{src: 'products/v8/derma.png', h: 0.5, dx: -330, z: 2},
	{src: 'products/v8/huile.png', h: 0.88, dx: -150, z: 1},
	{src: 'products/v8/sidr.png', h: 1, dx: 10, z: 3},
	{src: 'products/v8/applicateur.png', h: 0.86, dx: 175, z: 1},
	{src: 'products/v8/brosse.png', h: 0.46, dx: 320, z: 4},
];

const End9: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical, top, h, H, cy} = useLay();
	const ground = f < T_PRICE ? 'paper' : f < T_COD ? 'accent' : f < T_CTA ? 'bg' : 'accent';
	const sh = useShake([T_PRICE, T_COD, T_CTA], 16);
	const packH = vertical ? 430 : 360;
	const arrowY = vertical ? top + h - 150 : H - 230;
	const strike = tw(f, T_STRIKE + 4, 8);
	const bounce = Math.abs(Math.sin((f - T_CTA) / 5)) * 40;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id="end" dur={END} whipIn="y" whipOut={null} push={0.06} roll={0.6}>
				<Fill g={ground} />
				<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
					{/* le pack */}
					{f < T_PRICE ? (
						<>
							<Kicker at={0} text="الباك الكامل" y={vertical ? top + 30 : 40} size={70} bg={P.ink} color={P.accent} />
							<Num at={4} text="5" y={vertical ? cy - 170 : cy - 230} size={420} color={P.ink} />
							<Slam at={10} text="قطع" y={vertical ? cy + 40 : cy - 40} max={170} color={P.ink} shadow={false} />
							<div
								style={{
									position: 'absolute',
									left: 0,
									right: 0,
									top: vertical ? cy + 140 : cy + 90,
									height: packH,
								}}
							>
								{PACK.map((it, k) => {
									const p =
										f < 4 + k * 3
											? 0
											: spring({
													frame: f - 4 - k * 3,
													fps: 30,
													config: {damping: 10, stiffness: 170},
												});
									return (
										<div
											key={k}
											style={{
												position: 'absolute',
												left: '50%',
												bottom: 0,
												zIndex: it.z,
												transform: `translateX(calc(-50% + ${it.dx}px)) translateY(${(1 - p) * 400}px) scale(${0.5 + 0.5 * p})`,
											}}
										>
											<Img
												src={staticFile(it.src)}
												style={{
													height: packH * it.h,
													width: 'auto',
													filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.4))',
												}}
											/>
										</div>
									);
								})}
							</div>
						</>
					) : null}
					{/* le prix */}
					{f >= T_PRICE && f < T_COD ? (
						<>
							<Num at={T_PRICE} text="49" y={cy - 40} size={vertical ? 560 : 480} color={P.ink} />
							<Slam at={T_PRICE + 4} text="دينار برك" y={cy + (vertical ? 280 : 230)} max={170} color={P.ink} shadow={false} />
							{f >= T_STRIKE ? (
								<div
									style={{
										position: 'absolute',
										left: 0,
										right: 0,
										top: vertical ? top + 40 : 40,
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<div
										style={{
											position: 'relative',
											display: 'inline-block',
											transform: `scale(${1.3 - 0.3 * tw(f, T_STRIKE, 5)})`,
										}}
									>
										<div
											dir="rtl"
											style={{
												fontFamily: F.display,
												fontSize: 150,
												color: P.ink,
												whiteSpace: 'nowrap',
												opacity: 0.85,
											}}
										>
											عوض <span style={{fontFamily: F.latin, fontWeight: 800}}>110</span>
										</div>
										<div
											style={{
												position: 'absolute',
												right: -20,
												top: '52%',
												height: 18,
												width: `calc(${strike * 100}% + 40px)`,
												background: '#D7263D',
												borderRadius: 9,
												transform: 'rotate(-8deg)',
												transformOrigin: 'right center',
											}}
										/>
									</div>
								</div>
							) : null}
						</>
					) : null}
					{/* paiement à la livraison */}
					{f >= T_COD && f < T_CTA ? (
						<>
							<Slam at={T_COD} text="تخلّص" y={cy - 190} max={300} echo />
							<Slam at={T_COD + 6} text="كي يوصلك" y={cy + 90} max={260} color={P.accent} />
							<div
								style={{
									position: 'absolute',
									left: 0,
									right: 0,
									top: cy + 280,
									display: 'flex',
									justifyContent: 'center',
									opacity: tw(f, T_COD + 10, 5),
								}}
							>
								<div
									dir="rtl"
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 16,
										background: P.paper,
										color: P.ink,
										fontFamily: F.body,
										fontWeight: 900,
										fontSize: 52,
										padding: '6px 30px 14px',
										borderRadius: 16,
									}}
								>
									<IconTruck size={58} color={P.ink} /> توصيل لكامل الولايات
								</div>
							</div>
						</>
					) : null}
					{/* appel à l'action */}
					{f >= T_CTA ? (
						<>
							<Slam at={T_CTA} text="اطلب توّا" y={vertical ? cy - 250 : cy - 300} max={300} color={P.ink} shadow={false} echo echoColor={P.ink} />
							<div
								style={{
									position: 'absolute',
									left: 0,
									right: 0,
									top: vertical ? cy - 40 : cy - 90,
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 20,
										background: P.ink,
										borderRadius: 999,
										padding: '14px 46px',
										transform: `scale(${spring({frame: Math.max(0, f - T_CTA - 6), fps: 30, config: {damping: 9, stiffness: 200}}) * (1 + 0.04 * Math.sin((f - T_CTA) * 0.3))})`,
									}}
								>
									<IconPhone size={70} color={P.accent} />
									<span
										dir="ltr"
										style={{
											fontFamily: F.latin,
											fontWeight: 800,
											fontSize: 92,
											color: P.paper,
											letterSpacing: 2,
										}}
									>
										50 500 051
									</span>
								</div>
							</div>
							<div
								style={{
									position: 'absolute',
									left: 0,
									right: 0,
									top: vertical ? cy + 120 : cy + 80,
									display: 'flex',
									justifyContent: 'center',
									opacity: tw(f, T_CTA + 10, 5),
								}}
							>
								<div
									dir="rtl"
									style={{
										fontFamily: F.body,
										fontWeight: 900,
										fontSize: 54,
										color: P.ink,
									}}
								>
									<span style={{fontFamily: F.latin, fontWeight: 800}}>49</span> د.ت · تخلّص كي يوصلك
								</div>
							</div>
							<div
								style={{
									position: 'absolute',
									left: 0,
									right: 0,
									top: arrowY,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									transform: `translateY(${bounce}px)`,
									opacity: tw(f, T_CTA + 14, 4),
								}}
							>
								{[0, 1].map((k) => (
									<svg key={k} width={150} height={93} viewBox="0 0 100 62" style={{marginTop: k ? -34 : 0, opacity: k ? 0.55 : 1}}>
										<path d="M8 8 L50 50 L92 8" fill="none" stroke={P.ink} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								))}
							</div>
						</>
					) : null}
				</AbsoluteFill>
				<Rays at={T_PRICE} color={P.ink} />
				<Rays at={T_CTA} color={P.ink} />
			</Cam>
			<Blink at={T_PRICE} len={3} />
			<Blink at={T_COD} len={3} />
			<Blink at={T_CTA} len={3} />
			<Grain />
			<Sequence from={V} layout="none">
				<Audio src={staticFile('voice/v8/fin_offre.wav')} volume={1.4} />
			</Sequence>
			<Sfx8 at={0} s="whoosh" v={0.4} />
			{[4, 7, 10, 13, 16].map((d, k) => (
				<Sfx8 key={k} at={d} s={`pop${k + 1}` as 'pop1'} v={0.3} />
			))}
			<Sfx8 at={T_PRICE} s="impact" v={0.6} />
			<Sfx8 at={T_PRICE + 4} s="coin" v={0.4} />
			<Sfx8 at={T_STRIKE + 4} s="scribble" v={0.55} />
			<Sfx8 at={T_COD} s="hit" v={0.5} />
			<Sfx8 at={T_COD + 10} s="ding" v={0.35} />
			<Sfx8 at={T_CTA} s="impact" v={0.55} />
			<Sfx8 at={T_CTA + 6} s="shimmer" v={0.3} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- le film

const STARTS = (() => {
	const s: number[] = [];
	let a = HOOK + MYST;
	for (const d of DURS) {
		s.push(a);
		a += d;
	}
	return s;
})();
const END_AT = STARTS[4] + DURS[4];

/** Fenêtres où la voix parle (la musique baisse). */
const VOICE: [number, number][] = [[HOOK + 2, HOOK + 50], [HOOK + 100, HOOK + 132], ...STARTS.map((s, i): [number, number] => [s + OPEN, s + DURS[i] - 4]), [END_AT + V, END_AT + V + 150]];

const Music9: React.FC = () => (
	<Audio
		src={staticFile('audio/v9/music9.wav')}
		volume={(f) => {
			let d = 0;
			for (const [a, z] of VOICE) {
				if (f >= a - 6 && f <= z + 6) d = Math.max(d, f < a ? (f - (a - 6)) / 6 : f > z ? 1 - (f - z) / 6 : 1);
			}
			const out = interpolate(f, [FILM9_DUR - 24, FILM9_DUR - 1], [1, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			});
			return (0.55 - (0.55 - 0.16) * d) * out;
		}}
	/>
);

export const Film9: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Sequence durationInFrames={HOOK}>
			<Hook9 />
		</Sequence>
		<Sequence from={HOOK} durationInFrames={MYST}>
			<Mystery9 />
		</Sequence>
		{STARTS.map((s, i) => (
			<Sequence key={i} from={s} durationInFrames={DURS[i]}>
				<Reveal9 i={i} dur={DURS[i]} />
			</Sequence>
		))}
		<Sequence from={END_AT} durationInFrames={END}>
			<End9 />
		</Sequence>
		<Music9 />
	</AbsoluteFill>
);

export const V9_VIDEOS = [
	{id: 'W9-kinetic-9x16', fmt: '9x16' as const, dur: FILM9_DUR},
	{id: 'W9-kinetic-4x5', fmt: '4x5' as const, dur: FILM9_DUR},
];

export const V9Video: React.FC<{id: string}> = ({id}) => {
	const e = V9_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<Film9 />
		</FmtProvider>
	);
};
