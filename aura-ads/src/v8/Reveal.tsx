import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IconCheck} from '../components/Icons';
import {N, T, YELLOW} from '../v2/WinStill';
import {Abs, Clip, Flash, useStage} from '../v4/kit';
import {Bed8, Sfx8} from './sound8';
import {INTRO8_DUR, Intro8} from './Mystery';
import {END8_DUR, End8} from './End8';

/**
 * V8 · ouverture des « ? » un par un. Chaque révélation :
 * le rond n° n grossit et s'ouvre, puis la vidéo d'utilisation, le produit détouré
 * et son nom ; les autres « ? » restent en haut (le suspense continue).
 */

type Shot = {src: string; trim?: number; rate?: number; frames: number; pos?: string; band?: number; photo?: boolean; contain?: string};
export type RevealSpec = {n: number; name: string; sub: string; product: string; productH: number; productRatio: number; shots: Shot[]; voice: string; dur: number; benefits?: {t: string; at: number; pre?: string}[]; header?: {t: string; at: number}};

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

/** Photo avec lent zoom ; `contain` = photo entière sur un fond de cette couleur. */
const KenBurns: React.FC<{src: string; pos?: string; contain?: string}> = ({src, pos = '50% 50%', contain}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: contain ?? '#000'}}>
			<Img
				src={staticFile(src)}
				style={{width: '100%', height: '100%', objectFit: contain ? 'contain' : 'cover', objectPosition: pos, transform: `scale(${(contain ? 0.92 : 1.05) + f * 0.0015})`}}
			/>
		</AbsoluteFill>
	);
};

/** Rush paysage (ex. la brosse) affiché en entier, net, sur fond flouté du même plan. */
const BandIn: React.FC<{src: string; trim?: number; rate?: number; ratio: number; areaH: number}> = ({src, trim, rate, ratio, areaH}) => {
	const w = Math.min(1080, Math.round((areaH - 330) * ratio));
	const bh = Math.round(w / ratio);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{filter: 'blur(28px) brightness(0.5)', transform: 'scale(1.2)'}}>
				<Clip src={src} trim={trim} rate={rate} />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: (1080 - w) / 2, width: w, top: areaH - bh - 24, height: bh, overflow: 'hidden', borderRadius: 24, border: '4px solid rgba(255,255,255,0.85)', boxShadow: '0 18px 50px rgba(0,0,0,0.6)'}}>
				<Clip src={src} trim={trim} rate={rate} />
			</div>
		</AbsoluteFill>
	);
};

export const Reveal: React.FC<{spec: RevealSpec}> = ({spec}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {vertical, top, h} = useStage();
	const hi = vertical ? top + 10 : 30;
	const VH = vertical ? 1250 : 930; // hauteur de la vidéo ; le reste = panneau produit
	const PH = vertical ? Math.min(spec.productH, 1920 - VH - 80) : Math.min(spec.productH, 1350 - VH - 36);
	// largeur dispo pour les bienfaits = tout l'écran moins le produit (à droite) et les marges
	const colW = 1080 - (vertical ? 24 : 34) - PH * spec.productRatio - (vertical ? 50 : 40) - 24;
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
						{s.photo ? (
							<KenBurns src={s.src} pos={s.pos} contain={s.contain} />
						) : s.band ? (
							<BandIn src={s.src} trim={s.trim} rate={s.rate} ratio={s.band} areaH={VH} />
						) : (
							<Clip src={s.src} trim={s.trim} rate={s.rate} pos={s.pos ?? '50% 35%'} />
						)}
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
								{spec.sub ? (
									<T size={32} color="#444" weight={700} style={{whiteSpace: 'nowrap', marginTop: -4}}>
										{spec.sub}
									</T>
								) : null}
							</div>
						</div>
					</div>
				</Abs>
			) : null}

			{/* produit détouré dans le panneau du bas (à droite s'il y a des bienfaits) */}
			{f >= OPEN + 14 ? (
				<Abs top={VH + (vertical ? 40 : 18)} right={spec.benefits ? (vertical ? 50 : 40) : undefined} center={!spec.benefits}>
					<div style={{transform: `translateY(${(1 - pp) * 400}px) scale(${0.6 + 0.4 * pp}) rotate(${(1 - pp) * 10}deg)`}}>
						<Img src={staticFile(spec.product)} style={{height: PH, width: 'auto', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} />
					</div>
				</Abs>
			) : null}

			{/* bienfaits qui tombent un par un, cochés */}
			{spec.benefits ? (
				<Abs top={VH + (vertical ? 50 : 22)} left={vertical ? 24 : 34} center={false}>
					<div dir="rtl" style={{display: 'flex', flexDirection: 'column', gap: vertical ? 20 : 10, alignItems: 'flex-start', width: colW}}>
						{spec.header && f >= OPEN + spec.header.at ? (
							<div style={{background: YELLOW, borderRadius: 12, padding: vertical ? '2px 18px 6px' : '0 14px 4px', transform: `scale(${spring({frame: f - (OPEN + spec.header.at), fps, config: {damping: 10, stiffness: 220}})})`, transformOrigin: 'right center'}}>
								<T size={vertical ? 36 : 28} color="#111" style={{whiteSpace: 'nowrap'}}>
									📚 {spec.header.t}
								</T>
							</div>
						) : null}
						{spec.benefits.map((b, i) => {
							const p = spring({frame: f - (OPEN + b.at), fps, config: {damping: 12, stiffness: 200}});
							if (f < OPEN + b.at) return null;
							return (
								<div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.95)', borderRadius: 999, padding: vertical ? '6px 26px 10px 10px' : '4px 20px 8px 8px', transform: `translateX(${(1 - p) * -300}px)`, opacity: Math.min(1, p * 2), boxShadow: '0 8px 20px rgba(0,0,0,0.4)'}}>
									<div style={{width: vertical ? 54 : 44, height: vertical ? 54 : 44, borderRadius: '50%', background: '#2FA35A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
										<IconCheck size={vertical ? 34 : 28} color="#fff" />
									</div>
									<T size={vertical ? 40 : 32} color="#111" style={{whiteSpace: 'nowrap'}}>
										{(b.pre ?? 'يساعد في') ? <span style={{fontWeight: 600, color: '#555', fontSize: '0.8em'}}>{b.pre ?? 'يساعد في'} </span> : null}
										{b.t}
									</T>
								</div>
							);
						})}
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
			<Sfx8 at={0} s="whoosh" v={0.45} />
			<Sfx8 at={OPEN} s="hit" v={0.55} />
			<Sfx8 at={OPEN + 1} s="shimmer" v={0.45} />
			<Sfx8 at={OPEN + 14} s="pop3" v={0.4} />
			{spec.header ? <Sfx8 at={OPEN + spec.header.at} s="ding" v={0.3} /> : null}
			{(spec.benefits ?? []).map((b, i) => (
				<Sfx8 key={i} at={OPEN + b.at} s={`pop${(i % 5) + 1}` as 'pop1'} v={0.32} />
			))}
		</AbsoluteFill>
	);
};

export const REVEALS: RevealSpec[] = [
	{
		n: 1,
		name: 'سدر طبيعي',
		sub: '',
		product: 'products/v8/sidr.png',
		productRatio: 661 / 1033,
		productH: 560,
		voice: 'voice/v8/reveal_1_sidr_bienfaits.wav',
		dur: 191,
		// calés sur la voix : « ينظّف… / ينحّي القشرة / يقوّي الجذور / كثافة ولمعة »
		benefits: [
			{t: 'تنظيف جلدة الراس', at: 44},
			{t: 'التخلّص من القشرة', at: 77},
			{t: 'تقوية الجذور', at: 99},
			{t: 'كثافة ولمعة الشعر', at: 124},
		],
		shots: [
			{src: 'rushs/perso/sidr_front.mp4', trim: 0.3, frames: 70},
			{src: 'rushs/perso/sidr_top.mp4', trim: 0.4, frames: 107},
		],
	},
	{
		n: 2,
		name: 'زيت إكليل الجبل',
		sub: '',
		product: 'products/v8/huile.png',
		productRatio: 557 / 1701,
		productH: 600,
		voice: 'voice/v8/reveal_2_huile_bienfaits.wav',
		dur: 288,
		header: {t: 'حسب الدراسات', at: 45},
		benefits: [
			{t: 'تنشيط الدورة الدموية', at: 78},
			{t: 'تقوية البصيلات', at: 132},
			{t: 'التخلّص من القشرة والحكّة', at: 172},
			{t: 'مظهر شعر أكثف', at: 222},
		],
		shots: [
			{src: 'photos/v8/huile_scene.jpg', frames: 100, photo: true, pos: '50% 72%'},
			{src: 'rushs/perso/massage.mp4', trim: 0.4, rate: 0.85, frames: 174},
		],
	},
	{
		n: 3,
		name: 'ديرما رولر 540',
		sub: '',
		product: 'products/v8/derma.png',
		productRatio: 1109 / 966,
		productH: 360,
		voice: 'voice/v8/reveal_3_derma.wav',
		dur: 251,
		header: {t: 'قبل الزيت', at: 45},
		benefits: [
			{t: 'يساعد الزيت يدخل للجذور', at: 80, pre: ''},
			{t: 'تنشيط جلدة الراس', at: 127},
			{t: '540 إبرة صغيرة', at: 164, pre: ''},
			{t: 'بالشوية، على راس نظيف', at: 207, pre: ''},
		],
		shots: [
			{src: 'rushs/derma_roll_crown.mp4', trim: 0, frames: 120, pos: '50% 50%'},
			{src: 'photos/v8/derma_scene.jpg', frames: 117, photo: true, contain: '#FFFFFF'},
		],
	},
	{
		n: 4,
		name: 'بروس الماساج',
		sub: '',
		product: 'products/v8/brosse.png',
		productRatio: 717 / 738,
		productH: 290,
		voice: 'voice/v8/reveal_4_brosse.wav',
		dur: 245,
		benefits: [
			{t: 'تنشيط الدورة الدموية', at: 45},
			{t: 'توزيع الزيت والسدر', at: 105},
			{t: 'تنظيف جلدة الراس بعمق', at: 149},
			{t: 'ماساج يرتّح', at: 197, pre: ''},
		],
		shots: [{src: 'rushs/perso/brosse_massage.mp4', trim: 0, rate: 0.58, frames: 231, band: 576 / 452}],
	},
	{
		n: 5,
		name: 'الأبليكاتور',
		sub: '',
		product: 'products/v8/applicateur.png',
		productRatio: 389 / 1408,
		productH: 600,
		voice: 'voice/v8/reveal_5_applicateur.wav',
		dur: 203,
		benefits: [
			{t: 'بالزيت', at: 53, pre: ''},
			{t: 'ولا بخلطة السدر السايلة', at: 67, pre: ''},
			{t: 'يوصّل طول للجذور', at: 116, pre: ''},
			{t: 'بلا تبذير', at: 157, pre: ''},
		],
		shots: [{src: 'photos/rituel_huile.jpg', frames: 189, photo: true}],
	},
];

/** Intro (8 s) + révélations déjà faites, à la suite. */
export const PART_DUR = INTRO8_DUR + REVEALS.reduce((a, r) => a + r.dur, 0) + END8_DUR;
// fenêtres de voix (relatives au début de la musique) pour baisser la musique
const BED_VOICE: [number, number][] = (() => {
	const w: [number, number][] = [];
	let a = 0;
	for (const r of REVEALS) {
		w.push([a + OPEN, a + r.dur - 12]);
		a += r.dur;
	}
	w.push([a + 6, a + 6 + 160]);
	return w;
})();
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
			<Sequence from={PART_DUR - END8_DUR}>
				<End8 music={false} />
			</Sequence>
			{/* une seule musique continue des révélations jusqu'à la fin, baissée sous la voix */}
			<Sequence from={INTRO8_DUR}>
				<Bed8 voice={BED_VOICE} dur={PART_DUR - INTRO8_DUR} />
			</Sequence>
		</AbsoluteFill>
	);
};
