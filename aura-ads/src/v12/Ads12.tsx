import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IconCheck, IconClock, IconLeaf, IconPhone, IconTruck} from '../components/Icons';
import {F} from '../theme/brand';
import {Clip, FmtProvider, useStage} from '../v4/kit';
import {Sfx8} from '../v8/sound8';
import {theme} from '../v10/theme10';
import {TIMINGS} from './timings12';

/** Effet sonore légèrement en avance sur l'image (règle du skill : un son en retard paraît décalé). */
const Sfx: React.FC<React.ComponentProps<typeof Sfx8>> = ({at, ...r}) => <Sfx8 at={Math.max(0, at - theme.sfxLead)} {...r} />;
import {Blink, Cam, Fill, Grade, Grain, Kicker, P, Push, Rays, Slam, Vignette, b, tw, typeOn, useShake} from '../v10/kin10';

/**
 * V12 · les vidéos AURA6 « offres » refaites : pack de 4 (sans applicateur), 39 DT au lieu de 64, livraison 8 DT,
 * voix derja continue (accroche + corps, sans blanc), écran partagé usage + nouvelle photo produit, « انزل على كومندي ».
 * V01 offre, V03 prix barré, V05 « tout ça pour 39 » : 3 accroches chacune (seules les 2-3 premières secondes changent).
 * Style et couches V10/V11 (skills remotion-motion-graphics, ad-creative ; export ffmpeg-skill).
 */

const LEAD = 2;
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
	const sl = at === 0 ? 1 : tw(f, at, 5); // la frame 0 doit être nette (accroche)
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

const StopSign: React.FC<{size: number}> = ({size}) => {
	const f = useCurrentFrame();
	const p = f === 0 ? 1 : spring({frame: f, fps: 30, config: theme.spring.bouncy});
	const pts = Array.from({length: 8}, (_, i) => {
		const a = (Math.PI / 8) * (2 * i + 1);
		return `${50 + 48 * Math.cos(a)},${50 + 48 * Math.sin(a)}`;
	}).join(' ');
	return (
		<div style={{width: size, height: size, transform: `scale(${(0.85 + 0.15 * p) * (1 + Math.sin(f / 6) * 0.02)}) rotate(${-6 + Math.sin(f / 10) * 2}deg)`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'}}>
			<svg viewBox="0 0 100 100" width={size} height={size}>
				<polygon points={pts} fill="#D7263D" stroke="#fff" strokeWidth={4} />
				<text x="50" y="62" textAnchor="middle" fontFamily={F.latin} fontWeight={800} fontSize={27} fill="#fff">STOP</text>
			</svg>
		</div>
	);
};

type ClipS = {src: string; trim?: number; pos?: string; rate?: number; photo?: boolean};
type Split = {name: string; img: string; ground: 'paper' | 'accent'; clips: ClipS[]; chips: string[]; head?: string; pre?: string};
const SPLITS: Split[] = [
	{
		name: 'سدر طبيعي', img: 'products/v8/sidr.png', ground: 'paper', pre: 'يساعد في',
		chips: ['تنظيف جلدة الراس', 'التخلّص من القشرة', 'تقوية الجذور', 'كثافة ولمعة الشعر'],
		clips: [{src: 'rushs/perso/sidr_front.mp4', trim: 0.3, pos: '50% 40%'}, {src: 'rushs/perso/sidr_top.mp4', trim: 0.4, pos: '50% 40%'}, {src: 'rushs/real/v2_sidr.mp4', trim: 1.0, pos: '50% 50%'}],
	},
	{
		name: 'زيت إكليل الجبل', img: 'products/v8/huile.png', ground: 'accent', head: 'حسب الدراسات', pre: 'يساعد في',
		chips: ['تنشيط الدورة الدموية', 'تقوية البصيلات', 'التخلّص من القشرة والحكّة', 'مظهر شعر أكثف'],
		// l'homme tient la bouteille, puis il met l'huile sur sa tête (vue de dessus), puis il masse
		clips: [{src: 'photos/v12/homme_huile.jpg', pos: '50% 72%', photo: true}, {src: 'rushs/perso/huile_application.mp4', trim: 0, rate: 0.65, pos: '50% 45%'}, {src: 'rushs/perso/massage.mp4', trim: 0.4, pos: '50% 35%'}],
	},
	{
		name: 'ديرما رولر 540', img: 'products/v8/derma.png', ground: 'paper', head: 'قبل الزيت',
		chips: ['يعاون الزيت يدخل للجذور', 'تنشيط جلدة الراس'],
		clips: [{src: 'rushs/derma_roll_crown.mp4', trim: 0, pos: '50% 50%'}, {src: 'rushs/real/v2_derma.mp4', trim: 0.5, pos: '50% 50%'}],
	},
	{
		name: 'بروس الماساج', img: 'products/v8/brosse.png', ground: 'accent', pre: 'يساعد في',
		chips: ['تنشيط الدورة الدموية', 'توزيع الزيت والسدر', 'تنظيف جلدة الراس بالعمق'],
		clips: [{src: 'rushs/perso/brosse_massage.mp4', trim: 0, pos: '50% 50%'}, {src: 'rushs/real/v2_brosse.mp4', trim: 1.0, pos: '50% 50%'}],
	},
];

/** Un bienfait (puce) qui entre au moment où la voix le dit. */
const Chip: React.FC<{at: number; text: string; size: number; dark?: boolean}> = ({at, text, size, dark}) => {
	const f = useCurrentFrame();
	if (f < at) return null;
	const p = spring({frame: f - at, fps: 30, config: theme.spring.snappy});
	return (
		<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 12, background: dark ? P.ink : P.paper, color: dark ? P.paper : P.ink, fontFamily: F.body, fontWeight: 900, fontSize: size, lineHeight: 1.25, padding: `${size * 0.1}px ${size * 0.45}px ${size * 0.22}px`, borderRadius: 14, boxShadow: '0 8px 20px rgba(0,0,0,0.25)', opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 120}px) scale(${0.85 + 0.15 * p})`, whiteSpace: 'nowrap'}}>
			<IconCheck size={size * 0.9} color={dark ? P.accent : '#2FA35A'} />
			{text}
		</div>
	);
};

const SplitShot: React.FC<{s: Split; i: number; dur: number; tags: number[]; head: number | null}> = ({s, i, dur, tags, head}) => {
	const f = useCurrentFrame();
	const {vertical, W, H, top, h} = useLay();
	// 9:16 : partage au milieu de la zone utile ; 4:5 : moitié gauche / droite
	const splitY = vertical ? top + h * 0.5 : 0;
	const enter = tw(f, 0, 6, theme.ease.out);
	const sg = i % 2 === 0 ? 1 : -1;
	const half: React.CSSProperties = vertical ? {position: 'absolute', left: 0, right: 0} : {position: 'absolute', top: 0, bottom: 0};
	const pp = spring({frame: f - 2, fps: 30, config: theme.spring.bouncy});
	const n = s.clips.length;
	const per = Math.ceil(dur / n);
	const chipSize = vertical ? 50 : 36;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{/* plans d'utilisation, à la suite */}
			<div style={{...half, ...(vertical ? {top: 0, height: splitY} : {left: 0, width: W / 2}), overflow: 'hidden', transform: vertical ? `translateX(${sg * (1 - enter) * W}px)` : `translateY(${sg * (1 - enter) * H}px)`}}>
				{s.clips.map((c, k) => (
					<Sequence key={k} from={k * per} durationInFrames={per}>
						{c.photo ? <Push src={c.src} dur={per} pos={c.pos} from={1.05} to={1.2} pan={30} /> : <Clip src={c.src} trim={c.trim} rate={c.rate} pos={c.pos} zoom={1.1} />}
						<Blink at={0} len={2} />
					</Sequence>
				))}
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.25), transparent 30%, transparent 70%, rgba(0,0,0,0.35))'}} />
			</div>
			{/* le produit (nouvelle photo) + la liste des bienfaits */}
			<div style={{...half, ...(vertical ? {top: splitY, bottom: 0} : {right: 0, width: W / 2}), overflow: 'hidden', transform: vertical ? `translateX(${-sg * (1 - enter) * W}px)` : `translateY(${-sg * (1 - enter) * H}px)`}}>
				<Fill g={s.ground} />
				<Img
					src={staticFile(s.img)}
					style={{
						position: 'absolute',
						...(vertical ? {left: 30, bottom: 60, height: (H - splitY) * 0.5, maxWidth: W * 0.36} : {left: '50%', top: 60, height: H * 0.34, maxWidth: W * 0.4, marginLeft: -W * 0.2}),
						width: 'auto',
						objectFit: 'contain',
						transform: `translateY(${(1 - pp) * 120 + Math.sin(f / 8) * 4}px) scale(${0.8 + 0.2 * pp}) rotate(${(1 - pp) * sg * 10}deg)`,
						filter: 'drop-shadow(0 22px 30px rgba(0,0,0,0.4))',
					}}
				/>
				<div style={{position: 'absolute', ...(vertical ? {right: 30, top: 110, left: W * 0.3} : {left: 20, right: 20, top: H * 0.34 + 110}), display: 'flex', flexDirection: 'column', alignItems: vertical ? 'flex-end' : 'center', gap: vertical ? 18 : 10}}>
					{s.head && head !== null ? (
						<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 12, background: P.ink, color: P.accent, fontFamily: F.body, fontWeight: 900, fontSize: chipSize, padding: '2px 20px 8px', borderRadius: 12, opacity: tw(f, head, 5), transform: `rotate(-2deg) scale(${0.85 + 0.15 * tw(f, head, 5)})`}}>
							<BookIcon />
							{s.head}
						</div>
					) : null}
					{s.pre && tags.length ? (
						<div dir="rtl" style={{fontFamily: F.body, fontWeight: 900, fontSize: chipSize * 0.85, color: P.ink, opacity: tw(f, tags[0] - 4, 5)}}>
							{s.pre}:
						</div>
					) : null}
					{s.chips.map((c, k) => (tags[k] !== undefined ? <Chip key={k} at={tags[k]} text={c} size={chipSize} dark={s.ground === 'accent' && k % 2 === 1} /> : null))}
				</div>
			</div>
			{/* ligne de partage + nom du produit dessus */}
			<div style={{position: 'absolute', ...(vertical ? {left: 0, right: 0, top: splitY - 5, height: 10} : {top: 0, bottom: 0, left: W / 2 - 5, width: 10}), background: P.accent, boxShadow: '0 0 30px rgba(0,0,0,0.5)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? splitY - 70 : H - 170, display: 'flex', justifyContent: 'center'}}>
				<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16, background: P.ink, borderRadius: 18, padding: '4px 30px 12px', boxShadow: '0 14px 30px rgba(0,0,0,0.45)', opacity: Math.min(1, pp * 1.5), transform: `scale(${(0.7 + 0.3 * pp) * (1 + Math.sin(f / 9) * 0.015)})`}}>
					<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 64, color: P.accent}}>{i + 1}</span>
					<span style={{fontFamily: F.display, fontSize: 84, color: P.paper, whiteSpace: 'nowrap'}}>{s.name}</span>
				</div>
			</div>
			<Blink at={0} len={2} />
			{f >= dur - 3 ? <AbsoluteFill style={{background: '#fff', opacity: 0.25 * tw(f, dur - 3, 3)}} /> : null}
		</AbsoluteFill>
	);
};

/** Icône « études » dessinée en SVG (pas d'émoji). */
const BookIcon: React.FC = () => (
	<svg width={46} height={40} viewBox="0 0 46 40">
		<path d="M3 6 Q13 2 23 7 Q33 2 43 6 V36 Q33 32 23 37 Q13 32 3 36 Z" fill={theme.colors.accent} stroke={theme.colors.paper} strokeWidth={3} strokeLinejoin="round" />
		<path d="M23 7 V37" stroke={theme.colors.paper} strokeWidth={3} />
	</svg>
);

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


// ---------------------------------------------------------------- données : minutage mesuré mot à mot sur chaque voix

// Minutage mesuré mot à mot sur la prise unique de chaque pub (scripts/align_v12.py -> timings12.ts).
type Tm = {
	hookDur: number;
	hk: readonly number[];
	intro: number | null;
	prods: readonly number[];
	tags: readonly (readonly number[])[];
	heads: readonly (number | null)[];
	extra: readonly number[];
	offer: {start: number; price: number; strike: number; deliv: number; cod: number; cta: number; bridge?: number};
	end: number;
};
const HOLD = 60; // l'écran final reste 2 s après la voix

// ---------------------------------------------------------------- accroches

type HookP = {dur: number; k: readonly number[]};
const HookWrap: React.FC<{id: string; dur: number; g?: string; hits?: number[]; children: React.ReactNode; after?: React.ReactNode}> = ({id, dur, g = 'bg', hits = [0], children, after}) => {
	const sh = useShake(hits, 18);
	return (
		<AbsoluteFill>
			<Cam id={id} dur={dur} whipIn={null} whipOut="x" push={0.1}>
				<Fill g={g} />
				<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>{children}</AbsoluteFill>
			</Cam>
			{after}
			<Sfx at={0} s="impact" v={0.55} />
			<Sfx at={dur - 5} s="whoosh" v={0.4} />
		</AbsoluteFill>
	);
};

/** V01 h1 : « ستوب! ما تشريش حاجات شعرك بالقطعة! » */
const HookStop: React.FC<HookP> = ({dur, k}) => {
	const {vertical, cy, W} = useLay();
	return (
		<HookWrap id="hs" dur={dur} hits={[0, k[0] - LEAD]} after={<><Blink at={k[0] - LEAD} len={3} /><Sfx at={k[0]} s="hit" v={0.5} /></>}>
			<div style={{position: 'absolute', left: 0, right: 0, top: cy - (vertical ? 560 : 520), display: 'flex', justifyContent: 'center'}}>
				<StopSign size={vertical ? 420 : 340} />
			</div>
			<Slam at={0} from={1.1} text="ما تشريش" y={cy + (vertical ? 60 : 10)} max={190} width={W * 0.8} />
			<Slam at={k[0] - LEAD} text="بالقطعة!" y={cy + (vertical ? 290 : 230)} max={210} color={P.accent} />
			<Rays at={k[0] - LEAD} y={cy + 290} />
		</HookWrap>
	);
};

/** Une étiquette de prix (barrée ✗ ou validée ✓). */
const PriceCard: React.FC<{at: number; label: string; price: string; ok: boolean; y: number}> = ({at, label, price, ok, y}) => {
	const f = useCurrentFrame();
	if (f < at) return null;
	const p = spring({frame: f - at, fps: 30, config: theme.spring.bouncy});
	const strike = ok ? 0 : tw(f, at + 8, 8);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 60}px) scale(${(0.85 + 0.15 * p) * 1.45})`}}>
			<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 26, background: ok ? P.accent : P.paper, borderRadius: 26, padding: '14px 40px 22px', boxShadow: '0 18px 40px rgba(0,0,0,0.4)', position: 'relative'}}>
				<span style={{fontFamily: F.display, fontSize: 70, color: P.ink}}>{label}</span>
				<span style={{position: 'relative', fontFamily: F.latin, fontWeight: 800, fontSize: 130, color: P.ink, lineHeight: 1}}>
					{price}
					{!ok ? <span style={{position: 'absolute', right: -10, top: '48%', height: 14, width: `calc(${strike * 100}% + 20px)`, background: theme.colors.danger, borderRadius: 7, transform: 'rotate(-10deg)', transformOrigin: 'right center'}} /> : null}
				</span>
				<span style={{width: 86, height: 86, borderRadius: '50%', background: ok ? '#2FA35A' : theme.colors.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: F.latin, fontWeight: 800, fontSize: 60}}>{ok ? '✓' : '✗'}</span>
			</div>
		</div>
	);
};

/** V01 h2 : « شوف الفرق: بالقطعة أربعة وستين، في الباك تسعة وثلاثين! » */
const HookDiff: React.FC<HookP> = ({dur, k}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="hd" dur={dur} hits={[0, k[0] - LEAD, k[1] - LEAD]} after={<><Sfx at={k[0]} s="hit" v={0.45} /><Sfx at={k[0] + 9} s="scribble" v={0.5} /><Sfx at={k[1]} s="coin" v={0.45} /></>}>
			<Slam at={0} from={1.1} text="شوف الفرق" y={cy - (vertical ? 380 : 380)} max={200} />
			<PriceCard at={k[0] - LEAD} label="بالقطعة" price="64" ok={false} y={cy - (vertical ? 170 : 180)} />
			<PriceCard at={k[1] - LEAD} label="في الباك" price="39" ok y={cy + (vertical ? 170 : 120)} />
			{vertical ? <PackRow at={k[1] + 3} y={cy + 330} h={300} /> : null}
			<Rays at={k[1] - LEAD} y={cy + 200} />
		</HookWrap>
	);
};

/** V01 h3 : « أربعة قطع لشعرك، وكل قطعة بأقل من عشرة دينارات! » */
const HookFour: React.FC<HookP> = ({dur, k}) => {
	const {vertical, cy} = useLay();
	const packH = vertical ? 380 : 300;
	return (
		<HookWrap id="hf" dur={dur} g="accent" hits={[0, k[0] - LEAD]} after={<Sfx at={k[0]} s="coin" v={0.45} />}>
			<Num at={0} text="4" y={cy - (vertical ? 360 : 330)} size={vertical ? 420 : 340} color={P.ink} />
			<Slam at={10} text="قطع لشعرك" y={cy - (vertical ? 90 : 120)} max={170} color={P.ink} shadow={false} />
			<PackRow at={16} y={cy + (vertical ? 20 : -20)} h={packH} />
			<Pill at={k[0] - LEAD} y={cy + (vertical ? 460 : 330)} bg={P.ink} color={P.paper}>
				كل قطعة بأقل من <span style={{fontFamily: F.latin, fontWeight: 800, color: P.accent, fontSize: 64}}>10</span> د.ت
			</Pill>
		</HookWrap>
	);
};

/** V03 h1 : « قدّاش تحسب يسوى الباك هذا؟ » */
const HookAsk: React.FC<HookP> = ({dur, k}) => {
	const f = useCurrentFrame();
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="ha" dur={dur} hits={[0, k[0] - LEAD]}>
			<Slam at={0} from={1.1} text="قدّاش تحسب" y={cy - (vertical ? 440 : 400)} max={190} />
			<Slam at={k[0] - LEAD} text="يسوى الباك؟" y={cy - (vertical ? 250 : 230)} max={190} color={P.accent} />
			<PackRow at={2} y={cy - 40} h={vertical ? 400 : 300} />
			<div style={{position: 'absolute', left: 0, right: 0, top: cy + (vertical ? 330 : 230), display: 'flex', justifyContent: 'center'}}>
				<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: vertical ? 240 : 180, lineHeight: 1, color: P.accent, transform: `scale(${1 + Math.abs(Math.sin(f / 4)) * 0.12}) rotate(${Math.sin(f / 6) * 6}deg)`, textShadow: `0 0 50px ${theme.colors.glow}`}}>?</div>
			</div>
		</HookWrap>
	);
};

/** V03 h2 : « السوم طاح! » : le prix tombe de 64 à 39. */
const HookDrop: React.FC<HookP> = ({dur}) => {
	const f = useCurrentFrame();
	const {vertical, cy} = useLay();
	const fall = tw(f, 5, 12, theme.ease.inOut);
	return (
		<HookWrap id="hp" dur={dur} hits={[0, 16]} after={<Sfx at={14} s="hit" v={0.5} />}>
			<Slam at={0} from={1.1} text="السوم طاح!" y={cy - (vertical ? 400 : 380)} max={230} color={P.accent} />
			<div style={{position: 'absolute', left: 0, right: 0, top: cy - 120, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30}} dir="ltr">
				<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: vertical ? 230 : 190, color: P.paper, opacity: 1 - fall * 0.6, transform: `translateY(${fall * 260}px) rotate(${fall * 25}deg)`, textDecoration: 'line-through', textDecorationColor: theme.colors.danger}}>64</div>
				<svg width={130} height={230} viewBox="0 0 70 120" style={{opacity: tw(f, 7, 5)}}><path d="M35 5 V100 M10 75 L35 105 L60 75" stroke={P.accent} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
				<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: vertical ? 320 : 260, color: P.accent, opacity: tw(f, 14, 5), transform: `scale(${1.6 - 0.6 * tw(f, 14, 7)})`}}>39</div>
			</div>
		</HookWrap>
	);
};

/** V03 h3 : « قبل ما تشري أي حاجة لشعرك، شوف هذا! » sur le vrai rush. */
const HookBefore: React.FC<HookP> = ({dur, k}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="hb" dur={dur} hits={[0, k[1] - LEAD]} after={<Sfx at={k[1]} s="hit" v={0.5} />}>
			<AbsoluteFill>
				<Clip src="rushs/perso/sidr_top.mp4" trim={0.5} pos="50% 40%" zoom={1.1} />
				<AbsoluteFill style={{background: 'rgba(0,0,0,0.45)'}} />
			</AbsoluteFill>
			<Slam at={0} from={1.1} text="قبل ما تشري" y={cy - (vertical ? 260 : 240)} max={210} />
			<Slam at={k[0] - LEAD} text="أي حاجة لشعرك" y={cy - (vertical ? 50 : 50)} max={180} />
			<Slam at={k[1] - LEAD} text="شوف هذا!" y={cy + (vertical ? 210 : 180)} max={240} color={P.accent} />
			<Rays at={k[1] - LEAD} y={cy + 210} />
		</HookWrap>
	);
};

/** V05 h1 : « حلّينا الكرتونة، شوف آش فيها! » sur la vraie vidéo des produits. */
const HookUnbox: React.FC<HookP> = ({dur, k}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="hu" dur={dur} hits={[0, k[0] - LEAD]} after={<Sfx at={k[0]} s="hit" v={0.45} />}>
			<AbsoluteFill>
				<Clip src="rushs/real/v2_tous.mp4" trim={0.5} pos="50% 50%" zoom={1.06} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.5))'}} />
			</AbsoluteFill>
			<Slam at={0} from={1.1} text="حلّينا الكرتونة" y={cy - (vertical ? 380 : 360)} max={190} />
			<Slam at={k[0] - LEAD} text="شوف آش فيها!" y={cy + (vertical ? 300 : 240)} max={210} color={P.accent} />
		</HookWrap>
	);
};

/** V05 h2 : « أربعة حاجات في كرتونة وحدة! » */
const HookBox4: React.FC<HookP> = ({dur, k}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="h4" dur={dur} g="accent" hits={[0, k[0] - LEAD]}>
			<Num at={0} text="4" y={cy - (vertical ? 380 : 340)} size={vertical ? 400 : 320} color={P.ink} />
			<Slam at={10} text="حاجات" y={cy - (vertical ? 130 : 150)} max={190} color={P.ink} shadow={false} />
			<Slam at={k[0] - LEAD} text="في كرتونة وحدة!" y={cy + (vertical ? 40 : -10)} max={160} color={P.ink} shadow={false} />
			<PackRow at={5} y={cy + (vertical ? 170 : 110)} h={vertical ? 400 : 260} />
		</HookWrap>
	);
};

/** V05 h3 : « هذا اللي يوصلك بتسعة وثلاثين دينار! » */
const HookDeliver: React.FC<HookP> = ({dur, k}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="hv" dur={dur} hits={[0, k[0] - LEAD]} after={<Sfx at={k[0]} s="coin" v={0.45} />}>
			<AbsoluteFill>
				<Clip src="rushs/real/v2_tous.mp4" trim={2.5} pos="50% 50%" zoom={1.06} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.55))'}} />
			</AbsoluteFill>
			<Slam at={0} from={1.1} text="هذا اللي يوصلك" y={cy - (vertical ? 380 : 360)} max={190} />
			<div style={{position: 'absolute', left: 0, right: 0, top: cy + (vertical ? 220 : 160)}}>
				<Pill at={k[0] - LEAD} y={0} bg={P.accent} color={P.ink}>
					<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 110, lineHeight: 1}}>39</span>
					<span style={{fontSize: 70}}>د.ت</span>
				</Pill>
			</div>
		</HookWrap>
	);
};

const HOOKS = {stop: HookStop, diff: HookDiff, four: HookFour, ask: HookAsk, drop: HookDrop, before: HookBefore, unbox: HookUnbox, box4: HookBox4, deliver: HookDeliver};

// ---------------------------------------------------------------- éléments communs du corps

/** Les 4 produits (nouvelles photos) qui tombent en place. */
const PackRow: React.FC<{at: number; y: number; h: number}> = ({at, y, h}) => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, height: h}}>
			{PACK.map((it, k) => {
				const p = f < at + k * 2 ? 0 : spring({frame: f - at - k * 2, fps: 30, config: {damping: 12, stiffness: 240, mass: 0.6}});
				return (
					<div key={k} style={{position: 'absolute', left: '50%', bottom: 0, zIndex: it.z, opacity: Math.min(1, p * 1.5), transform: `translateX(calc(-50% + ${it.dx * (h / 430)}px)) translateY(${(1 - p) * 300 + Math.sin((f + k * 9) / 14) * 4}px) scale(${0.5 + 0.5 * p})`}}>
						<Img src={staticFile(it.src)} style={{height: h * it.h, width: 'auto', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.35))'}} />
					</div>
				);
			})}
		</div>
	);
};

/** Ouverture du corps : « باك Aura Bio فيه… » ou « أربعة قطع لشعرك… ». */
const Intro: React.FC<{kind: 'pack' | 'four'; dur: number}> = ({kind, dur}) => {
	const {vertical, top, cy} = useLay();
	const packH = vertical ? 520 : 400;
	return (
		<AbsoluteFill>
			<Cam id="in" dur={dur} whipIn="x" whipOut="y" push={0.08}>
				<Fill g="paper" />
				{kind === 'pack' ? (
					<>
						<Kicker at={0} text="باك AURA BIO" y={vertical ? top + 40 : 50} size={78} bg={P.ink} color={P.accent} />
						<PackRow at={2} y={cy - packH / 2 + 30} h={packH} />
						<Slam at={20} text="فيه…" y={cy + packH / 2 + (vertical ? 150 : 110)} max={200} color={P.ink} shadow={false} />
					</>
				) : (
					<>
						<Num at={0} text="4" y={vertical ? top + 200 : 170} size={vertical ? 300 : 240} color={P.ink} />
						<Slam at={8} text="قطع لشعرك" y={vertical ? top + 440 : 370} max={170} color={P.ink} shadow={false} />
						<PackRow at={4} y={cy + (vertical ? 20 : 40)} h={vertical ? 440 : 300} />
					</>
				)}
			</Cam>
			{[2, 5, 8, 11].map((d, k) => (
				<Sfx key={k} at={d} s={`pop${k + 1}` as 'pop1'} v={0.3} />
			))}
			<Sfx at={dur - 5} s="whoosh" v={0.4} />
		</AbsoluteFill>
	);
};

/** Les 4 écrans partagés, chacun calé sur le nom dit par la voix ; ses bienfaits entrent mot à mot. */
const Products: React.FC<{tm: Tm}> = ({tm}) => {
	const t0 = tm.prods[0] - LEAD;
	return (
		<AbsoluteFill>
			{SPLITS.map((s, i) => {
				const from = tm.prods[i] - LEAD - t0;
				const to = (i + 1 < 4 ? tm.prods[i + 1] : tm.extra[0]) - LEAD - t0;
				const rel = (t: number) => t - LEAD - t0 - from;
				return (
					<Sequence key={i} from={from} durationInFrames={to - from}>
						<SplitShot s={s} i={i} dur={to - from} tags={tm.tags[i].map(rel)} head={tm.heads[i] !== null ? rel(tm.heads[i] as number) : null} />
					</Sequence>
				);
			})}
			{tm.tags.flat().map((t, k) => (
				<Sfx key={`t${k}`} at={t - LEAD - t0} s="pop2" v={0.28} />
			))}
			{tm.prods.map((t, i) => (
				<React.Fragment key={i}>
					<Sfx at={t - LEAD - t0} s="swipe" v={0.4} />
					<Sfx at={t - t0} s="shimmer" v={0.25} />
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};

/** « باك فعّال، والأهم طبيعي مية بالمية! صالح زادة للّحية. وطريقة الاستعمال توصلك مع الباك: ساهلة وما تاخوش وقت. »
 * Juste après les produits. `ex` = débuts des 5 phrases (relatifs au début de la scène). */
const ExtraScene: React.FC<{ex: readonly number[]; dur: number}> = ({ex, dur}) => {
	const f = useCurrentFrame();
	const {vertical, top, h, H, cy} = useLay();
	const [X1, X2, X3, X4] = [ex[1], ex[2], ex[3], ex[4]];
	const xs = f < X1 ? 0 : f < X2 ? 1 : f < X3 ? 2 : f < X4 ? 3 : 4;
	const ground = (['paper', 'bg', 'accent', 'paper', 'bg'] as const)[xs];
	const sh = useShake([0, X1, X2, X3, X4], 16);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id="ex" dur={dur} whipIn="x" whipOut="y" push={0.06} roll={0.6}>
				<Fill g={ground} />
				<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
						<>
							{xs === 0 ? (
								<>
									{/* « باك فعّال » : son avant / après (même homme, même plantes) */}
									<div style={{position: 'absolute', ...(vertical ? {left: 0, right: 0, top: 0, height: '50%'} : {left: 0, top: 0, bottom: 0, width: '50%'}), overflow: 'hidden'}}>
										<Push src="photos/perso/avant.png" dur={X1} pos="50% 30%" from={1.05} to={1.15} pan={10} />
									</div>
									<div style={{position: 'absolute', ...(vertical ? {left: 0, right: 0, bottom: 0, height: '50%'} : {right: 0, top: 0, bottom: 0, width: '50%'}), overflow: 'hidden', transform: `translate${vertical ? 'X' : 'Y'}(${(1 - tw(f, 4, 6)) * 100}%)`}}>
										<Push src="photos/perso/apres.png" dur={X1} pos="50% 30%" from={1.05} to={1.15} pan={-10} />
									</div>
									<div style={{position: 'absolute', ...(vertical ? {left: 0, right: 0, top: '50%', height: 10, marginTop: -5} : {top: 0, bottom: 0, left: '50%', width: 10, marginLeft: -5}), background: P.accent}} />
									<Slam at={0} text="باك فعّال" y={vertical ? cy - 300 : cy - 40} max={240} />
									<div dir="rtl" style={{position: 'absolute', left: 30, right: 30, top: vertical ? top + h - 40 : H - 50, textAlign: 'center', fontFamily: F.body, fontWeight: 700, fontSize: 26, color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>
										تجربة شخصية · النتيجة تختلف من شخص لآخر
									</div>
								</>
							) : null}
							{xs === 1 ? (
								<>
									<Kicker at={X1} text="والأهم" y={cy - 380} size={70} bg={P.accent} color={P.ink} />
									<Slam at={X1 + 8} text="طبيعي" y={cy - 120} max={300} />
									<Num at={X1 + 30} text="100%" y={cy + 170} size={vertical ? 300 : 250} color={P.accent} />
									<div style={{position: 'absolute', left: 0, right: 0, top: cy + 330, display: 'flex', justifyContent: 'center', opacity: tw(f, X1 + 30, 6)}}>
										<IconLeaf size={170} color={theme.colors.accent} />
									</div>
								</>
							) : null}
							{xs === 2 ? (
								<>
									<Sequence from={X2} durationInFrames={X3 - X2} layout="none">
									<AbsoluteFill>
										<AbsoluteFill style={{filter: 'blur(26px) brightness(0.5)', transform: 'scale(1.25)'}}>
											<Clip src="rushs/perso/barbe_sidr.mp4" trim={0} rate={0.85} />
										</AbsoluteFill>
										<div style={{position: 'absolute', left: vertical ? 110 : 90, right: vertical ? 110 : 90, top: cy + (vertical ? 20 : 0) - (vertical ? 860 : 900) * (540 / 576) / 2, height: (vertical ? 860 : 900) * (540 / 576), overflow: 'hidden', border: `6px solid ${P.accent}`, borderRadius: 24}}>
											<Clip src="rushs/perso/barbe_sidr.mp4" trim={0} rate={0.85} pos="50% 50%" zoom={1.03} />
										</div>
									</AbsoluteFill>
									</Sequence>
									<Slam at={X2} text="صالح زادة" y={vertical ? top + 30 : cy - 520} max={vertical ? 150 : 190} />
									<Slam at={X2 + 18} text="للّحية" y={cy + (vertical ? 500 : 520)} max={vertical ? 190 : 230} color={P.accent} />
								</>
							) : null}
							{xs === 3 ? (
								<>
									<Slam at={X3} text="طريقة الاستعمال" y={cy - 220} max={210} color={P.ink} shadow={false} />
									<Slam at={X3 + 14} text="توصلك مع الباك" y={cy - 20} max={190} color={P.ink} shadow={false} />
									<Pill at={X3 + 30} y={cy + 170} bg={P.ink} color={P.paper}>
										<IconCheck size={56} color={P.accent} /> خطوة بخطوة
									</Pill>
								</>
							) : null}
							{xs === 4 ? (
								<>
									<div style={{position: 'absolute', left: 0, right: 0, top: cy - (vertical ? 420 : 360), display: 'flex', justifyContent: 'center', transform: `rotate(${Math.sin(f / 5) * 8}deg)`}}>
										<IconClock size={vertical ? 200 : 160} color={P.accent} />
									</div>
									<Slam at={X4} text="ساهلة" y={cy} max={300} />
									<Slam at={X4 + 10} text="وما تاخوش وقت" y={cy + (vertical ? 260 : 220)} max={190} color={P.accent} />
								</>
							) : null}
						</>
				</AbsoluteFill>
			</Cam>
			{[0, X1, X2, X3, X4].map((t, k) => (
				<React.Fragment key={k}>
					<Blink at={t} len={3} />
					<Sfx at={t} s={k === 1 ? 'shimmer' : 'hit'} v={k === 1 ? 0.35 : 0.4} />
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};

/** L'offre : 39 au lieu de 64, livraison 8 DT, paiement à la livraison, « انزل على كومندي ». Temps relatifs au début de l'offre. */
const OfferScene: React.FC<{o: Tm['offer']; dur: number; strikeFirst: boolean}> = ({o, dur, strikeFirst}) => {
	const f = useCurrentFrame();
	const {vertical, top, h, H, cy} = useLay();
	const r = (t: number) => t - o.start - LEAD;
	const [PR, ST, DL, CD, CT] = [r(o.price), r(o.strike), r(o.deliv), r(o.cod), r(o.cta)];
	const BR = o.bridge !== undefined ? r(o.bridge) : -1;
	// étapes : « الكل » | (« بالقطعة 64 » → « أما في الباك ») → 39 → livraison → paiement → appel
	const stage = f >= CT ? 'cta' : f >= CD ? 'cod' : f >= DL ? 'deliv' : f >= PR ? 'price' : strikeFirst ? (f >= BR ? 'bridge' : 'piece') : 'all';
	const ground = {all: 'paper', piece: 'bg', bridge: 'paper', price: 'accent', deliv: 'bg', cod: 'paper', cta: 'accent'}[stage];
	const sh = useShake([0, PR, DL, CD, CT], 16);
	const strike = tw(f, ST + 4, 8);
	const bounce = Math.abs(Math.sin((f - CT) / 5)) * 40;
	const arrowY = vertical ? top + h - 150 : H - 200;
	const packH = vertical ? 430 : 330;
	const struck = (
		<div style={{position: 'relative', display: 'inline-block'}}>
			<div dir="rtl" style={{fontFamily: F.display, fontSize: 150, color: stage === 'piece' ? P.paper : P.ink, whiteSpace: 'nowrap', opacity: 0.9}}>
				{strikeFirst ? 'بالقطعة' : 'عوض'} <span style={{fontFamily: F.latin, fontWeight: 800}}>64</span>
			</div>
			<div style={{position: 'absolute', right: -20, top: '52%', height: 18, width: `calc(${strike * 100}% + 40px)`, background: theme.colors.danger, borderRadius: 9, transform: 'rotate(-8deg)', transformOrigin: 'right center'}} />
		</div>
	);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id="of" dur={dur} whipIn="y" whipOut={null} push={0.06} roll={0.6}>
				<Fill g={ground} />
				<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
					{stage === 'all' ? (
						<>
							<Slam at={0} text="الكل" y={vertical ? cy - 160 : cy - 220} max={300} color={P.ink} shadow={false} />
							<PackRow at={0} y={vertical ? cy : cy - 40} h={packH} />
						</>
					) : null}
					{stage === 'piece' ? (
						<>
							<Slam at={0} text="بالقطعة" y={cy - 260} max={250} />
							<Num at={ST - 2} text="64" y={cy + 60} size={vertical ? 480 : 400} color={P.paper} />
							{f >= ST ? (
								<div style={{position: 'absolute', left: '15%', right: '15%', top: cy + 40, height: 26, background: theme.colors.danger, borderRadius: 13, transform: `rotate(-10deg) scaleX(${strike})`, transformOrigin: 'right center'}} />
							) : null}
						</>
					) : null}
					{stage === 'bridge' ? (
						<>
							<Slam at={BR} text="أما في الباك…" y={vertical ? cy - 220 : cy - 260} max={220} color={P.ink} shadow={false} />
							<PackRow at={BR} y={vertical ? cy - 20 : cy - 60} h={packH} />
						</>
					) : null}
					{stage === 'price' ? (
						<>
							<Num at={PR} text="39" y={cy - 40} size={vertical ? 560 : 480} color={P.ink} />
							<Slam at={PR + 4} text="دينار برك" y={cy + (vertical ? 280 : 230)} max={170} color={P.ink} shadow={false} />
							{strikeFirst || f >= ST ? (
								<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? top + 40 : 40, display: 'flex', justifyContent: 'center', opacity: strikeFirst ? 1 : tw(f, ST, 4)}}>
									{struck}
								</div>
							) : null}
						</>
					) : null}
					{stage === 'deliv' ? (
						<>
							<Slam at={DL} text="التوصيل" y={cy - 260} max={250} />
							<Num at={DL + 10} text="8" y={cy + 30} size={vertical ? 460 : 400} color={P.accent} />
							<Slam at={DL + 16} text="دينارات" y={cy + (vertical ? 290 : 250)} max={170} />
						</>
					) : null}
					{stage === 'cod' ? (
						<>
							<Slam at={CD} text="تخلّص" y={cy - 190} max={300} color={P.ink} shadow={false} />
							<Slam at={CD + 8} text="كي يوصلك" y={cy + 80} max={260} color={P.ink} shadow={false} />
							<Pill at={CD + 12} y={cy + 270} bg={P.ink} color={P.paper}>
								<IconTruck size={58} color={P.paper} /> توصيل لكامل الولايات
							</Pill>
						</>
					) : null}
					{stage === 'cta' ? (
						<>
							<Slam at={CT} text="انزل على كومندي" y={vertical ? cy - 270 : cy - 320} max={210} color={P.ink} shadow={false} />
							<Pill at={CT + 6} y={vertical ? cy - 90 : cy - 150} bg={P.ink} color={P.paper}>
								<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 64, color: P.accent}}>39</span> د.ت
								<span style={{opacity: 0.5}}>·</span> التوصيل <span style={{fontFamily: F.latin, fontWeight: 800}}>8</span> د.ت
							</Pill>
							<Pill at={CT + 12} y={vertical ? cy + 40 : cy - 20}>تخلّص كي يوصلك</Pill>
							<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? cy + 170 : cy + 110, display: 'flex', justifyContent: 'center', opacity: tw(f, CT + 18, 5)}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: F.latin, fontWeight: 800, fontSize: 52, color: P.ink}} dir="ltr">
									<IconPhone size={50} color={P.ink} /> 50 500 051
								</div>
							</div>
							<div style={{position: 'absolute', left: 0, right: 0, top: arrowY, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${bounce}px)`, opacity: tw(f, CT + 4, 4)}}>
								{[0, 1].map((k) => (
									<svg key={k} width={150} height={93} viewBox="0 0 100 62" style={{marginTop: k ? -34 : 0, opacity: k ? 0.55 : 1}}>
										<path d="M8 8 L50 50 L92 8" fill="none" stroke={P.ink} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								))}
							</div>
						</>
					) : null}
				</AbsoluteFill>
				<Rays at={PR} color={P.ink} />
				<Rays at={CT} color={P.ink} />
			</Cam>
			{[PR, DL, CD, CT].map((t, k) => (
				<Blink key={k} at={t} len={3} />
			))}
			{strikeFirst ? <Sfx at={0} s="hit" v={0.45} /> : <Sfx at={0} s="whoosh" v={0.4} />}
			<Sfx at={PR} s="impact" v={0.6} />
			<Sfx at={PR + 4} s="coin" v={0.4} />
			<Sfx at={ST + 4} s="scribble" v={0.55} />
			{BR >= 0 ? <Sfx at={BR} s="swipe" v={0.4} /> : null}
			<Sfx at={DL} s="hit" v={0.45} />
			<Sfx at={CD} s="hit" v={0.5} />
			<Sfx at={CD + 12} s="ding" v={0.35} />
			<Sfx at={CT} s="impact" v={0.55} />
			<Sfx at={CT + 6} s="shimmer" v={0.3} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- une pub = accroche + corps

type Ad = {id: string; concept: 'V01' | 'V03' | 'V05'; hook: keyof typeof HOOKS; voice: keyof typeof TIMINGS};

const AdFilm: React.FC<{ad: Ad}> = ({ad}) => {
	const tm = TIMINGS[ad.voice] as unknown as Tm;
	const H0 = tm.hookDur;
	const Hook = HOOKS[ad.hook];
	const voiceEnd = H0 + tm.end;
	const total = voiceEnd + HOLD;
	const p0 = H0 + tm.prods[0] - LEAD; // début des produits
	const e0 = H0 + tm.extra[0] - LEAD; // « باك فعّال »
	const o0 = H0 + tm.offer.start - LEAD; // l'offre
	const ex = tm.extra.map((t) => t - tm.extra[0]);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Sequence durationInFrames={Math.max(1, p0 > H0 && tm.intro !== null ? H0 : p0)}>
				<Hook dur={Math.max(1, p0 > H0 && tm.intro !== null ? H0 : p0)} k={tm.hk} />
			</Sequence>
			{tm.intro !== null && p0 - H0 > 0 ? (
				<Sequence from={H0} durationInFrames={p0 - H0}>
					<Intro kind={ad.concept === 'V03' ? 'four' : 'pack'} dur={p0 - H0} />
				</Sequence>
			) : null}
			<Sequence from={p0} durationInFrames={e0 - p0}>
				<Products tm={tm} />
			</Sequence>
			<Sequence from={e0} durationInFrames={o0 - e0}>
				<ExtraScene ex={ex} dur={o0 - e0} />
			</Sequence>
			<Sequence from={o0} durationInFrames={total - o0}>
				<OfferScene o={tm.offer} dur={total - o0} strikeFirst={ad.concept === 'V03'} />
			</Sequence>
			<Grade />
			<Grain />
			<Vignette a={0.3} />
			<Audio src={staticFile(`voice/v12/${ad.voice}.wav`)} volume={1.4} />
			<Audio
				src={staticFile('audio/v9/music9.wav')}
				loop
				volume={(f) => {
					const up = interpolate(f, [voiceEnd, voiceEnd + 10], [0.16, 0.5], {easing: theme.ease.out, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					const out = interpolate(f, [total - 20, total - 1], [1, 0], {easing: theme.ease.in, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return up * out;
				}}
			/>
		</AbsoluteFill>
	);
};

const ADS: Ad[] = [
	{id: 'V01-offre-h1', concept: 'V01', hook: 'stop', voice: 'V01_h1'},
	{id: 'V01-offre-h2', concept: 'V01', hook: 'diff', voice: 'V01_h2'},
	{id: 'V01-offre-h3', concept: 'V01', hook: 'four', voice: 'V01_h3'},
	{id: 'V03-prixbarre-h1', concept: 'V03', hook: 'ask', voice: 'V03_h1'},
	{id: 'V03-prixbarre-h2', concept: 'V03', hook: 'drop', voice: 'V03_h2'},
	{id: 'V03-prixbarre-h3', concept: 'V03', hook: 'before', voice: 'V03_h3'},
	{id: 'V05-toutca-h1', concept: 'V05', hook: 'unbox', voice: 'V05_h1'},
	{id: 'V05-toutca-h2', concept: 'V05', hook: 'box4', voice: 'V05_h2'},
	{id: 'V05-toutca-h3', concept: 'V05', hook: 'deliver', voice: 'V05_h3'},
];

export const V12_VIDEOS = ADS.flatMap((ad) =>
	(['9x16', '4x5'] as const).map((fmt) => ({id: `W12-${ad.id}-${fmt}`, fmt, dur: TIMINGS[ad.voice].hookDur + TIMINGS[ad.voice].end + HOLD, ad})),
);

export const V12Video: React.FC<{id: string}> = ({id}) => {
	const e = V12_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<AdFilm ad={e.ad} />
		</FmtProvider>
	);
};
