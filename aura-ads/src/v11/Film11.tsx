import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IconPhone, IconTruck} from '../components/Icons';
import {F} from '../theme/brand';
import {Clip, FmtProvider, useStage} from '../v4/kit';
import {Sfx8} from '../v8/sound8';
import {theme} from '../v10/theme10';

/** Effet sonore légèrement en avance sur l'image (règle du skill : un son en retard paraît décalé). */
const Sfx: React.FC<React.ComponentProps<typeof Sfx8>> = ({at, ...r}) => <Sfx8 at={Math.max(0, at - theme.sfxLead)} {...r} />;
import {Blink, Cam, Fill, Grade, Grain, Kicker, P, Push, Rays, Slam, Vignette, b, tw, typeOn, useShake} from '../v10/kin10';

/**
 * V11 · pack de 4 (sans applicateur), 39 DT au lieu de 64, livraison 8 DT, « انزل على كومندي ».
 * Une seule prise de voix derja continue (public/voice/v11/voix_v11.wav) : tout le montage suit ses mots.
 * Rushs réels : l'homme qui utilise les produits + les vrais produits du pack (rushs/real/v2_*).
 * Style et couches de la V10 (skills remotion-motion-graphics + ffmpeg-skill).
 */

// minutage calé sur la voix (images à 30 i/s, mesuré mot à mot)
const HOOK = 60;
const MYST = 58;
const DURS = [157, 211, 131, 155];
const END = 278;
export const FILM11_DUR = HOOK + MYST + DURS.reduce((a, d) => a + d, 0) + END;
const LEAD = 2; // les mots apparaissent 2 images avant d'être dits

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

// ---------------------------------------------------------------- accroche (« كيفاش شعرو من هكا، ولّى هكا؟ »)

const CUT = 41; // « ولّى هكا »
const Hook11: React.FC = () => {
	const {vertical, top, h, H, cy} = useLay();
	const sh = useShake([0, CUT], 18);
	const low = vertical ? top + h - 40 : H - 60;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
				<Sequence durationInFrames={CUT}>
					<Cam id="hk1" dur={CUT} whipIn={null} whipOut="x" push={0.12}>
						<Push src="photos/perso/avant.png" dur={CUT} from={1.05} to={1.2} pan={18} dim={0.35} />
						<Slam at={0} from={1.12} text="كيفاش" y={cy - 280} max={300} echo />
						<Slam at={10 - LEAD} text="شعرو" y={cy - 20} max={330} color={P.accent} />
						<Slam at={24 - LEAD} text="من هكا…" y={cy + 250} max={230} />
					</Cam>
				</Sequence>
				<Sequence from={CUT} durationInFrames={HOOK - CUT}>
					<Cam id="hk2" dur={HOOK - CUT} whipIn="x" whipOut="y" push={0.1}>
						<Push src="photos/perso/apres.png" dur={HOOK - CUT} from={1.05} to={1.15} pan={-18} dim={0.3} />
						<Slam at={0} text="ولّى هكا؟" y={cy - 60} max={300} color={P.accent} echo echoColor={P.paper} />
					</Cam>
					<Rays at={0} y={cy - 60} />
					<Blink at={0} />
				</Sequence>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 30, right: 30, top: low, textAlign: 'center', fontFamily: F.body, fontWeight: 700, fontSize: 26, color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 8px rgba(0,0,0,0.9)'}} dir="rtl">
				تجربة شخصية · النتيجة تختلف من شخص لآخر
			</div>
			<Sfx at={0} s="hit" v={0.5} />
			<Sfx at={10} s="swipe" v={0.3} />
			<Sfx at={CUT - 5} s="whoosh" v={0.4} />
			<Sfx at={CUT} s="impact" v={0.7} />
			<Sfx at={HOOK - 5} s="whoosh" v={0.4} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- « استعمل أربعة حاجات، تحب تعرفهم شنوّة؟ »

const ROW = 29; // « تحب تعرفهم » : les 4 ronds 1? à 4?
const ASK = 44; // « شنوّة؟ »
const Mystery11: React.FC = () => {
	const f = useCurrentFrame();
	const {cy, W} = useLay();
	const ground = f < 10 ? 'bg' : f < 19 ? 'accent' : f < ROW ? 'paper' : f < ASK - LEAD ? 'bg' : 'accent';
	const sh = useShake([10, ROW, ASK], 14);
	const zo = tw(f, MYST - 6, 6, (u: number) => u * u * u); // on traverse le « ؟ »
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id="my" dur={MYST} whipIn="y" whipOut={null} push={0.08}>
				<Fill g={ground} />
				<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) scale(${1 + zo * 7})`, opacity: 1 - zo * 0.6}}>
					<Slam at={0} from={1.2} text="استعمل" y={cy} max={300} echo until={10 - LEAD} />
					<Num at={10 - LEAD} text="4" y={cy} size={760} color={P.ink} until={19 - LEAD} />
					<Slam at={19 - LEAD} text="حاجات" y={cy} max={320} color={P.ink} until={ROW - LEAD} />
					{f >= ROW - LEAD && f < ASK - LEAD ? (
						<>
							<Slam at={ROW - LEAD} text="تحب تعرفهم" y={cy - 200} max={210} />
							<div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: cy + 20, display: 'flex', justifyContent: 'center', gap: 18}}>
								{[0, 1, 2, 3].map((i) => {
									const p = f < ROW - LEAD + i * 2 ? 0 : spring({frame: f - (ROW - LEAD) - i * 2, fps: 30, config: theme.spring.bouncy});
									return (
										<div key={i} style={{width: (W - 140) / 4, height: (W - 140) / 4, borderRadius: '50%', border: `8px solid ${P.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, p * 1.5), transform: `scale(${p}) translateY(${(1 - p) * 40}px)`, fontFamily: F.latin, fontWeight: 800, fontSize: 100, color: P.paper}}>
											{i + 1}
											<span style={{color: P.accent}}>?</span>
										</div>
									);
								})}
							</div>
						</>
					) : null}
					<Slam at={ASK - LEAD} text="شنوّة؟" y={cy} max={460} color={P.ink} echo />
				</AbsoluteFill>
				<Rays at={10 - LEAD} color={P.ink} />
				<Rays at={ASK - LEAD} color={P.ink} />
			</Cam>
			<Sfx at={0} s="whoosh" v={0.4} />
			<Sfx at={10} s="impact" v={0.5} />
			<Sfx at={19} s="swipe" v={0.3} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} at={ROW + i * 2} s={`pop${i + 1}` as 'pop1'} v={0.3} />
			))}
			<Sfx at={ASK} s="hit" v={0.55} />
			<Sfx at={MYST - 8} s="riser" v={0.4} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- un produit révélé

/** Icône « études » dessinée en SVG (le skill interdit les émojis : couleurs hors charte). */
const BookIcon: React.FC = () => (
	<svg width={46} height={40} viewBox="0 0 46 40">
		<path d="M3 6 Q13 2 23 7 Q33 2 43 6 V36 Q33 32 23 37 Q13 32 3 36 Z" fill={theme.colors.accent} stroke={theme.colors.ink} strokeWidth={3} strokeLinejoin="round" />
		<path d="M23 7 V37" stroke={theme.colors.ink} strokeWidth={3} />
	</svg>
);

// ---------------------------------------------------------------- les 4 produits

const OPEN = 8; // le numéro énorme pendant « واحد / زوز / ثلاثة / أربعة »
type Shot9 = {src: string; trim?: number; rate?: number; frames: number; pos?: string; photo?: boolean; contain?: string; band?: boolean; from?: number; to?: number; pan?: number};
type Spec11 = {n: number; name: string; nameAt: number; product: string; productH: number; header?: {t: string; at: number}; benefits: {t: string; at: number; pre?: string}[]; shots: Shot9[]};

// `at` : image (depuis le début du produit) où le mot est dit
const REV: Spec11[] = [
	{
		n: 1, name: 'سدر طبيعي', nameAt: 9, product: 'products/v8/sidr.png', productH: 560,
		benefits: [{t: 'تنظيف جلدة الراس', at: 34}, {t: 'التخلّص من القشرة', at: 65}, {t: 'تقوية الجذور', at: 86}, {t: 'كثافة ولمعة الشعر', at: 109}],
		shots: [
			{src: 'rushs/perso/sidr_front.mp4', trim: 0.3, frames: 55},
			{src: 'rushs/real/v2_sidr.mp4', trim: 1.0, frames: 44, pos: '50% 50%'},
			{src: 'rushs/perso/sidr_top.mp4', trim: 0.4, frames: 50},
		],
	},
	{
		n: 2, name: 'زيت إكليل الجبل', nameAt: 15, product: 'products/v8/huile.png', productH: 560,
		header: {t: 'حسب الدراسات', at: 35},
		benefits: [{t: 'تنشيط الدورة الدموية', at: 61}, {t: 'تقوية البصيلات', at: 109}, {t: 'التخلّص من القشرة والحكّة', at: 136}, {t: 'مظهر شعر أكثف', at: 169}],
		shots: [
			{src: 'rushs/real/v2_huile.mp4', trim: 0.5, frames: 55, pos: '50% 50%'},
			{src: 'rushs/perso/huile_goutte.mp4', trim: 0, frames: 40, pos: '50% 50%'},
			{src: 'rushs/perso/massage.mp4', trim: 0.4, frames: 108},
		],
	},
	{
		n: 3, name: 'ديرما رولر 540', nameAt: 15, product: 'products/v8/derma.png', productH: 420,
		header: {t: 'قبل الزيت', at: 50},
		benefits: [{t: 'يعاون الزيت يدخل للجذور', at: 68, pre: ''}, {t: 'تنشيط جلدة الراس', at: 96}],
		shots: [
			{src: 'rushs/real/v2_derma.mp4', trim: 0.5, frames: 45, pos: '50% 50%'},
			{src: 'rushs/derma_roll_crown.mp4', trim: 0, frames: 78, pos: '50% 50%'},
		],
	},
	{
		n: 4, name: 'بروس الماساج', nameAt: 19, product: 'products/v8/brosse.png', productH: 300,
		benefits: [{t: 'تنشيط الدورة الدموية', at: 37}, {t: 'توزيع الزيت والسدر', at: 73}, {t: 'تنظيف جلدة الراس بالعمق', at: 109}],
		shots: [
			{src: 'rushs/real/v2_brosse.mp4', trim: 1.0, frames: 50, pos: '50% 50%'},
			{src: 'rushs/perso/brosse_massage.mp4', trim: 0, rate: 1, frames: 97, band: true},
		],
	},
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
	const out = tw(f, until - 4, 4, (x: number) => x * x);
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

const Reveal11: React.FC<{i: number; dur: number}> = ({i, dur}) => {
	const f = useCurrentFrame();
	const spec = REV[i];
	const {vertical, top, W, cy} = useLay();
	const shots = spec.shots;
	const sh = useShake([0, OPEN], 16);
	let acc = OPEN;
	const seq = shots.map((s) => {
		const start = acc;
		acc += s.frames;
		return {...s, start};
	});
	const benefits = spec.benefits;
	const PILL = spec.nameAt + 18; // le nom se range en haut
	const hits = [PILL, ...benefits.map((bn) => bn.at - LEAD), ...(spec.header ? [spec.header.at - LEAD] : [])];
	const punch = 1 + hits.reduce((a, h) => a + 0.05 * tw(f, h, 6), 0);
	const tilt = hits.reduce((a, h, k) => a + (k % 2 ? -0.8 : 0.8) * tw(f, h, 6), 0);
	const zoomIn = tw(f, OPEN - 4, 4, (u: number) => u * u);
	const titleY = vertical ? top + 24 : 30;
	const nameOn = f >= OPEN && f < PILL;
	const dirs = ['x', '-y', '-x', 'y'] as const;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id={`rv${i}`} dur={dur} whipIn={dirs[i]} whipOut={dirs[(i + 1) % 4]} push={0.05} roll={0.8}>
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
					{nameOn ? <Slam at={Math.max(OPEN, spec.nameAt - LEAD)} text={spec.name} y={cy - 60} max={vertical ? 190 : 170} echo color={P.paper} /> : null}
					{f >= PILL ? (
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: titleY,
								display: 'flex',
								justifyContent: 'center',
								transform: `translateY(${(1 - tw(f, PILL, 6)) * (cy - titleY - 100) + Math.sin(f / 30) * 3}px) scale(${(1.5 - 0.5 * tw(f, PILL, 6)) * (1 + Math.sin(f / 22) * 0.012)})`,
							}}
						>
							<div
								dir="rtl"
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 18,
									background: P.paper,
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
					{spec.header && f >= spec.header.at - LEAD ? (
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
									transform: `rotate(3deg) scale(${spring({frame: f - (spec.header.at - LEAD), fps: 30, config: {damping: 8, stiffness: 240}})})`,
									boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
								}}
							>
								<span style={{display: 'inline-flex', alignItems: 'center', gap: 14}}>
									<BookIcon />
									{spec.header.t}
								</span>
							</div>
						</div>
					) : null}

					<Product src={spec.product} h={vertical ? Math.min(560, spec.productH) : Math.min(380, spec.productH * 0.75)} at={PILL - 4} />

					{benefits.map((bn, k) => (
						<Benefit key={k} i={k} at={bn.at - LEAD} until={k + 1 < benefits.length ? benefits[k + 1].at - LEAD : dur} text={bn.t} pre={bn.pre ?? 'يساعد في'} />
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
			<Sfx at={0} s="hit" v={0.6} />
			<Sfx at={OPEN - 4} s="whoosh" v={0.4} />
			<Sfx at={OPEN} s="shimmer" v={0.35} />
			<Sfx at={PILL - 4} s="pop3" v={0.35} />
			{spec.header ? <Sfx at={spec.header.at - LEAD} s="ding" v={0.3} /> : null}
			{benefits.map((bn, k) => (
				<Sfx key={k} at={bn.at - LEAD} s="swipe" v={0.3} />
			))}
			<Sfx at={dur - 5} s="whoosh" v={0.35} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- l'offre (calée sur la voix)

const T_PRICE = 60; // « تسعة وثلاثين »
const T_STRIKE = 80; // « عوض أربعة وستين »
const T_DELIV = 106; // « التوصيل بثمنية دينارات »
const T_COD = 148; // « وتخلّص كي يوصلك »
const T_CTA = 177; // « انزل على كومندي »

const PACK = [
	{src: 'products/v8/derma.png', h: 0.5, dx: -300, z: 2},
	{src: 'products/v8/huile.png', h: 0.88, dx: -105, z: 1},
	{src: 'products/v8/sidr.png', h: 1, dx: 95, z: 3},
	{src: 'products/v8/brosse.png', h: 0.46, dx: 300, z: 4},
];

const Pill: React.FC<{at: number; y: number; children: React.ReactNode; bg?: string; color?: string}> = ({at, y, children, bg = P.paper, color = P.ink}) => {
	const f = useCurrentFrame();
	if (f < at) return null;
	const p = spring({frame: f - at, fps: 30, config: theme.spring.snappy});
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + 0.08 * p})`}}>
			<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16, background: bg, color, fontFamily: F.body, fontWeight: 900, fontSize: 54, padding: '6px 32px 14px', borderRadius: 16, boxShadow: '0 10px 24px rgba(0,0,0,0.25)'}}>
				{children}
			</div>
		</div>
	);
};

const End11: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical, top, h, H, cy} = useLay();
	const ground = f < T_PRICE - LEAD ? 'paper' : f < T_DELIV - LEAD ? 'accent' : f < T_COD - LEAD ? 'bg' : f < T_CTA - LEAD ? 'paper' : 'accent';
	const sh = useShake([T_PRICE, T_DELIV, T_COD, T_CTA].map((t) => t - LEAD), 16);
	const packH = vertical ? 430 : 360;
	const arrowY = vertical ? top + h - 150 : H - 200;
	const strike = tw(f, T_STRIKE + 4, 8);
	const bounce = Math.abs(Math.sin((f - T_CTA) / 5)) * 40;
	const L = (t: number) => t - LEAD;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id="end" dur={END} whipIn="y" whipOut={null} push={0.06} roll={0.6}>
				<Fill g={ground} />
				<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
					{/* le pack de 4 */}
					{f < L(T_PRICE) ? (
						<>
							<Kicker at={0} text="الباك الكامل" y={vertical ? top + 30 : 40} size={70} bg={P.ink} color={P.accent} />
							<Num at={2} text="4" y={vertical ? cy - 170 : cy - 230} size={420} color={P.ink} />
							<Slam at={8} text="قطع" y={vertical ? cy + 40 : cy - 40} max={170} color={P.ink} shadow={false} />
							<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? cy + 140 : cy + 90, height: packH}}>
								{PACK.map((it, k) => {
									const p = f < 4 + k * 4 ? 0 : spring({frame: f - 4 - k * 4, fps: 30, config: theme.spring.bouncy});
									return (
										<div key={k} style={{position: 'absolute', left: '50%', bottom: 0, zIndex: it.z, opacity: Math.min(1, p * 1.5), transform: `translateX(calc(-50% + ${it.dx}px)) translateY(${(1 - p) * 400 + Math.sin((f + k * 9) / 18) * 4}px) scale(${0.5 + 0.5 * p})`}}>
											<Img src={staticFile(it.src)} style={{height: packH * it.h, width: 'auto', filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.4))'}} />
										</div>
									);
								})}
							</div>
						</>
					) : null}
					{/* le prix : 39 au lieu de 64 */}
					{f >= L(T_PRICE) && f < L(T_DELIV) ? (
						<>
							<Num at={L(T_PRICE)} text="39" y={cy - 40} size={vertical ? 560 : 480} color={P.ink} />
							<Slam at={L(T_PRICE) + 4} text="دينار برك" y={cy + (vertical ? 280 : 230)} max={170} color={P.ink} shadow={false} />
							{f >= L(T_STRIKE) ? (
								<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? top + 40 : 40, display: 'flex', justifyContent: 'center'}}>
									<div style={{position: 'relative', display: 'inline-block', opacity: tw(f, L(T_STRIKE), 4), transform: `scale(${1.3 - 0.3 * tw(f, L(T_STRIKE), 5)})`}}>
										<div dir="rtl" style={{fontFamily: F.display, fontSize: 150, color: P.ink, whiteSpace: 'nowrap', opacity: 0.85}}>
											عوض <span style={{fontFamily: F.latin, fontWeight: 800}}>64</span>
										</div>
										<div style={{position: 'absolute', right: -20, top: '52%', height: 18, width: `calc(${strike * 100}% + 40px)`, background: theme.colors.danger, borderRadius: 9, transform: 'rotate(-8deg)', transformOrigin: 'right center'}} />
									</div>
								</div>
							) : null}
						</>
					) : null}
					{/* livraison 8 DT */}
					{f >= L(T_DELIV) && f < L(T_COD) ? (
						<>
							<Slam at={L(T_DELIV)} text="التوصيل" y={cy - 260} max={250} echo />
							<Num at={L(T_DELIV) + 12} text="8" y={cy + 30} size={vertical ? 460 : 400} color={P.accent} />
							<Slam at={L(T_DELIV) + 18} text="دينارات" y={cy + (vertical ? 290 : 250)} max={170} />
						</>
					) : null}
					{/* paiement à la livraison */}
					{f >= L(T_COD) && f < L(T_CTA) ? (
						<>
							<Slam at={L(T_COD)} text="تخلّص" y={cy - 190} max={300} color={P.ink} shadow={false} echo echoColor={P.ink} />
							<Slam at={L(T_COD) + 10} text="كي يوصلك" y={cy + 80} max={260} color={P.ink} shadow={false} />
							<Pill at={L(T_COD) + 14} y={cy + 270} bg={P.ink} color={P.paper}>
								<IconTruck size={58} color={P.paper} /> توصيل لكامل الولايات
							</Pill>
						</>
					) : null}
					{/* appel à l'action : « انزل على كومندي » + flèche vers le bouton */}
					{f >= L(T_CTA) ? (
						<>
							<Slam at={L(T_CTA)} text="انزل على كومندي" y={vertical ? cy - 270 : cy - 320} max={210} color={P.ink} shadow={false} />
							<Pill at={L(T_CTA) + 8} y={vertical ? cy - 90 : cy - 150} bg={P.ink} color={P.paper}>
								<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 64, color: P.accent}}>39</span> د.ت
								<span style={{opacity: 0.5}}>·</span> التوصيل <span style={{fontFamily: F.latin, fontWeight: 800}}>8</span> د.ت
							</Pill>
							<Pill at={L(T_CTA) + 14} y={vertical ? cy + 40 : cy - 20}>
								تخلّص كي يوصلك
							</Pill>
							<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? cy + 170 : cy + 110, display: 'flex', justifyContent: 'center', opacity: tw(f, L(T_CTA) + 20, 5)}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: F.latin, fontWeight: 800, fontSize: 52, color: P.ink}} dir="ltr">
									<IconPhone size={50} color={P.ink} /> 50 500 051
								</div>
							</div>
							<div style={{position: 'absolute', left: 0, right: 0, top: arrowY, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${bounce}px)`, opacity: tw(f, L(T_CTA) + 6, 4)}}>
								{[0, 1].map((k) => (
									<svg key={k} width={150} height={93} viewBox="0 0 100 62" style={{marginTop: k ? -34 : 0, opacity: k ? 0.55 : 1}}>
										<path d="M8 8 L50 50 L92 8" fill="none" stroke={P.ink} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								))}
							</div>
						</>
					) : null}
				</AbsoluteFill>
				<Rays at={L(T_PRICE)} color={P.ink} />
				<Rays at={L(T_CTA)} color={P.ink} />
			</Cam>
			<Blink at={L(T_PRICE)} len={3} />
			<Blink at={L(T_DELIV)} len={3} />
			<Blink at={L(T_COD)} len={3} />
			<Blink at={L(T_CTA)} len={3} />
			<Sfx at={0} s="whoosh" v={0.4} />
			{[4, 8, 12, 16].map((d, k) => (
				<Sfx key={k} at={d} s={`pop${k + 1}` as 'pop1'} v={0.3} />
			))}
			<Sfx at={T_PRICE} s="impact" v={0.6} />
			<Sfx at={T_PRICE + 4} s="coin" v={0.4} />
			<Sfx at={T_STRIKE + 4} s="scribble" v={0.55} />
			<Sfx at={T_DELIV} s="hit" v={0.45} />
			<Sfx at={T_COD} s="hit" v={0.5} />
			<Sfx at={T_COD + 14} s="ding" v={0.35} />
			<Sfx at={T_CTA} s="impact" v={0.55} />
			<Sfx at={T_CTA + 6} s="shimmer" v={0.3} />
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
const END_AT = STARTS[3] + DURS[3];
const VOICE_END = 975; // fin de la voix (32,5 s)

/** Musique : basse sous la voix (qui parle sans arrêt), remonte pour l'écran final. */
const Music11: React.FC = () => (
	<Audio
		src={staticFile('audio/v9/music9.wav')}
		volume={(f) => {
			const up = interpolate(f, [VOICE_END, VOICE_END + 10], [0.15, 0.5], {easing: theme.ease.out, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
			const out = interpolate(f, [FILM11_DUR - 24, FILM11_DUR - 1], [1, 0], {easing: theme.ease.in, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
			return up * out;
		}}
	/>
);

export const Film11: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Sequence durationInFrames={HOOK}>
			<Hook11 />
		</Sequence>
		<Sequence from={HOOK} durationInFrames={MYST}>
			<Mystery11 />
		</Sequence>
		{STARTS.map((s, i) => (
			<Sequence key={i} from={s} durationInFrames={DURS[i]}>
				<Reveal11 i={i} dur={DURS[i]} />
			</Sequence>
		))}
		<Sequence from={END_AT} durationInFrames={END}>
			<End11 />
		</Sequence>
		<Grade />
		<Grain />
		<Vignette a={0.3} />
		<Audio src={staticFile('voice/v11/voix_v11.wav')} volume={1.4} />
		<Music11 />
	</AbsoluteFill>
);

export const V11_VIDEOS = [
	{id: 'W11-pack4-9x16', fmt: '9x16' as const, dur: FILM11_DUR},
	{id: 'W11-pack4-4x5', fmt: '4x5' as const, dur: FILM11_DUR},
];

export const V11Video: React.FC<{id: string}> = ({id}) => {
	const e = V11_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<Film11 />
		</FmtProvider>
	);
};
