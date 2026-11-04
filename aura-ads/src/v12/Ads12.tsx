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

type Split = {name: string; tag: string; img: string; clip: string; trim: number; pos: string; rate?: number; ground: 'paper' | 'accent'; photo?: boolean};
const SPLITS: Split[] = [
	{name: 'سدر طبيعي', tag: 'ينظّف جلدة الراس', img: 'products/v8/sidr.png', clip: 'rushs/perso/sidr_front.mp4', trim: 0.6, pos: '50% 40%', ground: 'paper'},
	{name: 'زيت إكليل الجبل', tag: 'ينشّط الدورة الدموية', img: 'products/v8/huile.png', clip: 'photos/v12/homme_huile.jpg', trim: 0, pos: '50% 72%', ground: 'accent', photo: true},
	{name: 'ديرما رولر 540', tag: 'يعاون الزيت يدخل للجذور', img: 'products/v8/derma.png', clip: 'rushs/derma_roll_crown.mp4', trim: 0.5, pos: '50% 50%', ground: 'paper'},
	{name: 'بروس الماساج', tag: 'يرتّحلك جلدة الراس', img: 'products/v8/brosse.png', clip: 'rushs/perso/brosse_massage.mp4', trim: 0.4, pos: '50% 50%', ground: 'accent'},
];

const SplitShot: React.FC<{s: Split; i: number; dur: number; tagAt?: number}> = ({s, i, dur, tagAt = 6}) => {
	const f = useCurrentFrame();
	const {vertical, W, H, top, h} = useLay();
	// 9:16 : la ligne de partage au milieu de la zone utile ; 4:5 : moitié gauche / droite
	const splitY = vertical ? top + h * 0.5 : 0;
	const enter = tw(f, 0, 6, theme.ease.out);
	const sg = i % 2 === 0 ? 1 : -1;
	const half: React.CSSProperties = vertical ? {position: 'absolute', left: 0, right: 0} : {position: 'absolute', top: 0, bottom: 0};
	const pp = spring({frame: f - 2, fps: 30, config: theme.spring.bouncy});
	const prodH = vertical ? (H - splitY) * 0.62 : H * 0.55;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{/* vidéo d'utilisation */}
			<div style={{...half, ...(vertical ? {top: 0, height: splitY} : {left: 0, width: W / 2}), overflow: 'hidden', transform: vertical ? `translateX(${sg * (1 - enter) * W}px)` : `translateY(${sg * (1 - enter) * H}px)`}}>
				{s.photo ? <Push src={s.clip} dur={dur} pos={s.pos} from={1.05} to={1.2} pan={30} /> : <Clip src={s.clip} trim={s.trim} rate={s.rate} pos={s.pos} zoom={1.1} />}
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.25), transparent 30%, transparent 70%, rgba(0,0,0,0.35))'}} />
			</div>
			{/* le produit (nouvelle photo) */}
			<div style={{...half, ...(vertical ? {top: splitY, bottom: 0} : {right: 0, width: W / 2}), overflow: 'hidden', transform: vertical ? `translateX(${-sg * (1 - enter) * W}px)` : `translateY(${-sg * (1 - enter) * H}px)`}}>
				<Fill g={s.ground} />
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: vertical ? 'flex-end' : 'center', justifyContent: 'center', paddingBottom: vertical ? 70 : 0}}>
					<Img src={staticFile(s.img)} style={{height: prodH, maxWidth: (vertical ? W : W / 2) * 0.62, width: 'auto', objectFit: 'contain', transform: `translateY(${(1 - pp) * 120 + Math.sin(f / 8) * 4}px) scale(${0.8 + 0.2 * pp}) rotate(${(1 - pp) * sg * 10}deg)`, filter: 'drop-shadow(0 22px 30px rgba(0,0,0,0.4))'}} />
				</div>
			</div>
			{/* ligne de partage + nom du produit dessus */}
			<div style={{position: 'absolute', ...(vertical ? {left: 0, right: 0, top: splitY - 5, height: 10} : {top: 0, bottom: 0, left: W / 2 - 5, width: 10}), background: P.accent, boxShadow: '0 0 30px rgba(0,0,0,0.5)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? splitY - 70 : H - 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
				<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16, background: P.ink, borderRadius: 18, padding: '4px 30px 12px', boxShadow: '0 14px 30px rgba(0,0,0,0.45)', opacity: Math.min(1, pp * 1.5), transform: `scale(${(0.7 + 0.3 * pp) * (1 + Math.sin(f / 9) * 0.015)})`}}>
					<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 64, color: P.accent}}>{i + 1}</span>
					<span style={{fontFamily: F.display, fontSize: 84, color: P.paper, whiteSpace: 'nowrap'}}>{s.name}</span>
				</div>
				<div dir="rtl" style={{background: P.paper, color: P.ink, fontFamily: F.body, fontWeight: 900, fontSize: 52, padding: '0 26px 8px', borderRadius: 12, opacity: tw(f, tagAt, 5), transform: `translateY(${(1 - tw(f, tagAt, 5)) * 20}px) scale(${0.9 + 0.1 * tw(f, tagAt, 5)})`}}>
					{s.tag}
				</div>
			</div>
			<Blink at={0} len={2} />
			{f >= dur - 3 ? <AbsoluteFill style={{background: '#fff', opacity: 0.25 * tw(f, dur - 3, 3)}} /> : null}
		</AbsoluteFill>
	);
};

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

type Offer = {start: number; price: number; strike: number; deliv: number; cod: number; cta: number; strikeFirst?: boolean; bridge?: number};
type Body = {intro?: 'pack' | 'four'; prods: number[]; tags: number[]; offer: Offer; end: number};
// tout est en images (30 i/s) depuis le début du corps (voix à vitesse normale)
const BODIES: Record<'V01' | 'V03' | 'V05', Body> = {
	// « باك Aura Bio فيه أربعة حاجات: السدر الطبيعي، ينظّف… زيت… ينشّط… الديرما… يعاون… بروس… يرتّحلك… الكل… »
	V01: {intro: 'pack', prods: [62, 132, 208, 284], tags: [94, 166, 233, 314], offer: {start: 356, price: 370, strike: 415, deliv: 445, cod: 494, cta: 520}, end: 550},
	// « أربعة قطع لشعرك: … بالقطعة يجيو أربعة وستين… أما في الباك تسعة وثلاثين… »
	V03: {intro: 'four', prods: [41, 112, 187, 270], tags: [75, 142, 214, 301], offer: {start: 349, strike: 380, bridge: 413, price: 439, deliv: 478, cod: 530, cta: 559, strikeFirst: true}, end: 587},
	// « السدر الطبيعي، ينظّف… الكل بتسعة وثلاثين… »
	V05: {prods: [0, 77, 159, 239], tags: [36, 111, 185, 270], offer: {start: 320, price: 333, strike: 383, deliv: 422, cod: 476, cta: 514}, end: 540},
};
const HOLD = 60; // l'écran final reste 2 s après la voix

// ---------------------------------------------------------------- accroches

type HookP = {dur: number};
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
const HookStop: React.FC<HookP> = ({dur}) => {
	const {vertical, cy, W} = useLay();
	return (
		<HookWrap id="hs" dur={dur} hits={[0, 53]} after={<><Blink at={53} len={3} /><Sfx at={55} s="hit" v={0.5} /></>}>
			<div style={{position: 'absolute', left: 0, right: 0, top: cy - (vertical ? 560 : 520), display: 'flex', justifyContent: 'center'}}>
				<StopSign size={vertical ? 420 : 340} />
			</div>
			<Slam at={0} from={1.1} text="ما تشريش" y={cy + (vertical ? 60 : 10)} max={190} width={W * 0.8} />
			<Slam at={53} text="بالقطعة!" y={cy + (vertical ? 290 : 230)} max={210} color={P.accent} />
			<Rays at={53} y={cy + 290} />
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
const HookDiff: React.FC<HookP> = ({dur}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="hd" dur={dur} hits={[0, 24, 78]} after={<><Sfx at={24} s="hit" v={0.45} /><Sfx at={33} s="scribble" v={0.5} /><Sfx at={78} s="coin" v={0.45} /></>}>
			<Slam at={0} from={1.1} text="شوف الفرق" y={cy - (vertical ? 380 : 380)} max={200} />
			<PriceCard at={24} label="بالقطعة" price="64" ok={false} y={cy - (vertical ? 170 : 180)} />
			<PriceCard at={78} label="في الباك" price="39" ok y={cy + (vertical ? 170 : 120)} />
			{vertical ? <PackRow at={83} y={cy + 330} h={300} /> : null}
			<Rays at={78} y={cy + 200} />
		</HookWrap>
	);
};

/** V01 h3 : « أربعة قطع لشعرك، وكل قطعة بأقل من عشرة دينارات! » */
const HookFour: React.FC<HookP> = ({dur}) => {
	const {vertical, cy} = useLay();
	const packH = vertical ? 380 : 300;
	return (
		<HookWrap id="hf" dur={dur} g="accent" hits={[0, 59]} after={<Sfx at={59} s="coin" v={0.45} />}>
			<Num at={0} text="4" y={cy - (vertical ? 360 : 330)} size={vertical ? 420 : 340} color={P.ink} />
			<Slam at={10} text="قطع لشعرك" y={cy - (vertical ? 90 : 120)} max={170} color={P.ink} shadow={false} />
			<PackRow at={16} y={cy + (vertical ? 20 : -20)} h={packH} />
			<Pill at={59} y={cy + (vertical ? 460 : 330)} bg={P.ink} color={P.paper}>
				كل قطعة بأقل من <span style={{fontFamily: F.latin, fontWeight: 800, color: P.accent, fontSize: 64}}>10</span> د.ت
			</Pill>
		</HookWrap>
	);
};

/** V03 h1 : « قدّاش تحسب يسوى الباك هذا؟ » */
const HookAsk: React.FC<HookP> = ({dur}) => {
	const f = useCurrentFrame();
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="ha" dur={dur} hits={[0, 17]}>
			<Slam at={0} from={1.1} text="قدّاش تحسب" y={cy - (vertical ? 440 : 400)} max={190} />
			<Slam at={15} text="يسوى الباك؟" y={cy - (vertical ? 250 : 230)} max={190} color={P.accent} />
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
const HookBefore: React.FC<HookP> = ({dur}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="hb" dur={dur} hits={[0, 47]} after={<Sfx at={49} s="hit" v={0.5} />}>
			<AbsoluteFill>
				<Clip src="rushs/perso/sidr_top.mp4" trim={0.5} pos="50% 40%" zoom={1.1} />
				<AbsoluteFill style={{background: 'rgba(0,0,0,0.45)'}} />
			</AbsoluteFill>
			<Slam at={0} from={1.1} text="قبل ما تشري" y={cy - (vertical ? 260 : 240)} max={210} />
			<Slam at={18} text="أي حاجة لشعرك" y={cy - (vertical ? 50 : 50)} max={180} />
			<Slam at={47} text="شوف هذا!" y={cy + (vertical ? 210 : 180)} max={240} color={P.accent} />
			<Rays at={47} y={cy + 210} />
		</HookWrap>
	);
};

/** V05 h1 : « حلّينا الكرتونة، شوف آش فيها! » sur la vraie vidéo des produits. */
const HookUnbox: React.FC<HookP> = ({dur}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="hu" dur={dur} hits={[0, 31]} after={<Sfx at={33} s="hit" v={0.45} />}>
			<AbsoluteFill>
				<Clip src="rushs/real/v2_tous.mp4" trim={0.5} pos="50% 50%" zoom={1.06} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.5))'}} />
			</AbsoluteFill>
			<Slam at={0} from={1.1} text="حلّينا الكرتونة" y={cy - (vertical ? 380 : 360)} max={190} />
			<Slam at={31} text="شوف آش فيها!" y={cy + (vertical ? 300 : 240)} max={210} color={P.accent} />
		</HookWrap>
	);
};

/** V05 h2 : « أربعة حاجات في كرتونة وحدة! » */
const HookBox4: React.FC<HookP> = ({dur}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="h4" dur={dur} g="accent" hits={[0, 25]}>
			<Num at={0} text="4" y={cy - (vertical ? 380 : 340)} size={vertical ? 400 : 320} color={P.ink} />
			<Slam at={10} text="حاجات" y={cy - (vertical ? 130 : 150)} max={190} color={P.ink} shadow={false} />
			<Slam at={25} text="في كرتونة وحدة!" y={cy + (vertical ? 40 : -10)} max={160} color={P.ink} shadow={false} />
			<PackRow at={5} y={cy + (vertical ? 170 : 110)} h={vertical ? 400 : 260} />
		</HookWrap>
	);
};

/** V05 h3 : « هذا اللي يوصلك بتسعة وثلاثين دينار! » */
const HookDeliver: React.FC<HookP> = ({dur}) => {
	const {vertical, cy} = useLay();
	return (
		<HookWrap id="hv" dur={dur} hits={[0, 23]} after={<Sfx at={25} s="coin" v={0.45} />}>
			<AbsoluteFill>
				<Clip src="rushs/real/v2_tous.mp4" trim={2.5} pos="50% 50%" zoom={1.06} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.55))'}} />
			</AbsoluteFill>
			<Slam at={0} from={1.1} text="هذا اللي يوصلك" y={cy - (vertical ? 380 : 360)} max={190} />
			<div style={{position: 'absolute', left: 0, right: 0, top: cy + (vertical ? 220 : 160)}}>
				<Pill at={23} y={0} bg={P.accent} color={P.ink}>
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

/** Les 4 écrans partagés, chacun calé sur le nom dit par la voix. */
const Products: React.FC<{times: number[]; tags: number[]; end: number}> = ({times, tags, end}) => (
	<AbsoluteFill>
		{SPLITS.map((s, i) => {
			const from = i === 0 ? 0 : times[i] - LEAD - times[0];
			const to = (i + 1 < times.length ? times[i + 1] - LEAD : end - LEAD) - times[0];
			return (
				<Sequence key={i} from={from} durationInFrames={to - from}>
					<SplitShot s={s} i={i} dur={to - from} tagAt={tags[i] - LEAD - times[0] - from} />
				</Sequence>
			);
		})}
		{tags.map((t, i) => (
			<Sfx key={`t${i}`} at={t - times[0]} s="ding" v={0.25} />
		))}
		{times.map((t, i) => (
			<React.Fragment key={i}>
				<Sfx at={t - times[0]} s="swipe" v={0.4} />
				<Sfx at={t - times[0] + 2} s={`pop${i + 1}` as 'pop1'} v={0.3} />
			</React.Fragment>
		))}
	</AbsoluteFill>
);

/** L'offre : 39 au lieu de 64, livraison 8 DT, paiement à la livraison, « انزل على كومندي ». Temps relatifs au début de l'offre. */
const OfferScene: React.FC<{o: Offer; dur: number}> = ({o, dur}) => {
	const f = useCurrentFrame();
	const {vertical, top, h, H, cy} = useLay();
	const r = (t: number) => t - o.start - LEAD;
	const [PR, ST, DL, CD, CT] = [r(o.price), r(o.strike), r(o.deliv), r(o.cod), r(o.cta)];
	const BR = o.bridge !== undefined ? r(o.bridge) : -1;
	// étapes : « الكل » | (« بالقطعة 64 » → « أما في الباك ») → 39 → livraison → paiement → appel
	const stage = f >= CT ? 'cta' : f >= CD ? 'cod' : f >= DL ? 'deliv' : f >= PR ? 'price' : o.strikeFirst ? (f >= BR ? 'bridge' : 'piece') : 'all';
	const ground = {all: 'paper', piece: 'bg', bridge: 'paper', price: 'accent', deliv: 'bg', cod: 'paper', cta: 'accent'}[stage];
	const sh = useShake([0, PR, DL, CD, CT], 16);
	const strike = tw(f, ST + 4, 8);
	const bounce = Math.abs(Math.sin((f - CT) / 5)) * 40;
	const arrowY = vertical ? top + h - 150 : H - 200;
	const packH = vertical ? 430 : 330;
	const struck = (
		<div style={{position: 'relative', display: 'inline-block'}}>
			<div dir="rtl" style={{fontFamily: F.display, fontSize: 150, color: stage === 'piece' ? P.paper : P.ink, whiteSpace: 'nowrap', opacity: 0.9}}>
				{o.strikeFirst ? 'بالقطعة' : 'عوض'} <span style={{fontFamily: F.latin, fontWeight: 800}}>64</span>
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
							{o.strikeFirst || f >= ST ? (
								<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? top + 40 : 40, display: 'flex', justifyContent: 'center', opacity: o.strikeFirst ? 1 : tw(f, ST, 4)}}>
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
			{o.strikeFirst ? <Sfx at={0} s="hit" v={0.45} /> : <Sfx at={0} s="whoosh" v={0.4} />}
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

type Ad = {id: string; concept: 'V01' | 'V03' | 'V05'; hook: keyof typeof HOOKS; hookDur: number; voice: string};

const AdFilm: React.FC<{ad: Ad}> = ({ad}) => {
	const b = BODIES[ad.concept];
	const H0 = ad.hookDur;
	const introEnd = b.prods[0] - LEAD;
	const total = H0 + b.end + HOLD;
	const Hook = HOOKS[ad.hook];
	const voiceEnd = H0 + b.end;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Sequence durationInFrames={H0}>
				<Hook dur={H0} />
			</Sequence>
			{b.intro && introEnd > 0 ? (
				<Sequence from={H0} durationInFrames={introEnd}>
					<Intro kind={b.intro} dur={introEnd} />
				</Sequence>
			) : null}
			<Sequence from={H0 + Math.max(0, introEnd)} durationInFrames={b.offer.start - Math.max(0, introEnd)}>
				<Products times={b.prods} tags={b.tags} end={b.offer.start} />
			</Sequence>
			<Sequence from={H0 + b.offer.start - LEAD} durationInFrames={total - (H0 + b.offer.start - LEAD)}>
				<OfferScene o={b.offer} dur={total - (H0 + b.offer.start - LEAD)} />
			</Sequence>
			<Grade />
			<Grain />
			<Vignette a={0.3} />
			<Audio src={staticFile(ad.voice)} volume={1.4} />
			<Audio
				src={staticFile('audio/v9/music9.wav')}
				volume={(f) => {
					const up = interpolate(f, [voiceEnd, voiceEnd + 10], [0.16, 0.5], {easing: theme.ease.out, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					const out = interpolate(f, [total - 20, total - 1], [1, 0], {easing: theme.ease.in, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return up * out;
				}}
			/>
		</AbsoluteFill>
	);
};

// durée de l'accroche = durée de sa voix (images)
const ADS: Ad[] = [
	{id: 'V01-offre-h1', concept: 'V01', hook: 'stop', hookDur: 60, voice: 'voice/v12/V01_h1.wav'},
	{id: 'V01-offre-h2', concept: 'V01', hook: 'diff', hookDur: 118, voice: 'voice/v12/V01_h2.wav'},
	{id: 'V01-offre-h3', concept: 'V01', hook: 'four', hookDur: 100, voice: 'voice/v12/V01_h3.wav'},
	{id: 'V03-prixbarre-h1', concept: 'V03', hook: 'ask', hookDur: 42, voice: 'voice/v12/V03_h1.wav'},
	{id: 'V03-prixbarre-h2', concept: 'V03', hook: 'drop', hookDur: 27, voice: 'voice/v12/V03_h2.wav'},
	{id: 'V03-prixbarre-h3', concept: 'V03', hook: 'before', hookDur: 68, voice: 'voice/v12/V03_h3.wav'},
	{id: 'V05-toutca-h1', concept: 'V05', hook: 'unbox', hookDur: 54, voice: 'voice/v12/V05_h1.wav'},
	{id: 'V05-toutca-h2', concept: 'V05', hook: 'box4', hookDur: 49, voice: 'voice/v12/V05_h2.wav'},
	{id: 'V05-toutca-h3', concept: 'V05', hook: 'deliver', hookDur: 58, voice: 'voice/v12/V05_h3.wav'},
];

export const V12_VIDEOS = ADS.flatMap((ad) =>
	(['9x16', '4x5'] as const).map((fmt) => ({id: `W12-${ad.id}-${fmt}`, fmt, dur: ad.hookDur + BODIES[ad.concept].end + HOLD, ad})),
);

export const V12Video: React.FC<{id: string}> = ({id}) => {
	const e = V12_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<AdFilm ad={e.ad} />
		</FmtProvider>
	);
};
