import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {F} from '../theme/brand';
import {Clip, FmtProvider, useStage} from '../v4/kit';
import {Sfx8} from '../v8/sound8';
import {Cam, Grain, Vignette, tw, useShake} from '../v10/kin10';
import {M} from './themeMozon';
import {TIMINGS} from './timingsMozon';

/**
 * Al Mozon Academy (Radès) · vidéo « tout le monde » : voix derja + français en une seule prise (Fenrir).
 * Accroche locale (carte de Ben Arous) → « Al Mozon Academy à Radès » (carte → le centre) → qualité de la formation
 * (A1→B2, profs, petits groupes, dès le 1er jour, horaires, examens) → accompagnement (dossier, CV, traduction,
 * orientation) → test gratuit + remise → WhatsApp 99 008 008. Vrais plans du centre (dossier Drive « Mozon sans modification »).
 * Skills : remotion-motion-graphics (5 couches, ressorts, décalages), ad-creative (image + voix + texte complémentaires).
 */

const LEAD = 2; // le texte devance la voix de 2 images
const HOLD = 60; // l'écran final reste 2 s après la voix
const Sfx: React.FC<React.ComponentProps<typeof Sfx8>> = ({at, ...r}) => <Sfx8 at={Math.max(0, at - M.sfxLead)} {...r} />;

const useLay = () => {
	const {vertical, top, h, W, H} = useStage();
	return {vertical, top, h, W, H, cy: vertical ? top + h / 2 : H / 2};
};

// ---------------------------------------------------------------- petits éléments

/** Mot ou phrase qui entre (ressort : opacité + montée + échelle) et sort plus vite. */
const Word: React.FC<{at: number; text: string; y: number; size: number; color?: string; font?: string; weight?: number; until?: number; latin?: boolean; shadow?: boolean}> = ({
	at, text, y, size, color = M.white, font, weight, until, latin, shadow = true,
}) => {
	const f = useCurrentFrame();
	const {W} = useStage();
	if (f < at || (until !== undefined && f >= until)) return null;
	const p = at === 0 ? 1 : spring({frame: f - at, fps: 30, config: M.spring.snappy});
	const ex = until !== undefined ? tw(f, until - 6, 6, M.ease.in) : 0;
	const per = latin ? 0.7 : 0.5;
	const fs = Math.min(size, Math.floor((W * 0.9) / Math.max(1, [...text].length * per)));
	const breathe = 1 + Math.sin((f - at) / 22) * 0.012;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y - fs * 0.6, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
			<div
				dir={latin ? 'ltr' : 'rtl'}
				style={{
					fontFamily: font ?? (latin ? F.latin : F.display),
					fontWeight: weight ?? (latin ? 800 : 400),
					fontSize: fs,
					lineHeight: 1.12,
					color,
					whiteSpace: 'nowrap',
					opacity: Math.min(1, p * 1.6) * (1 - ex),
					transform: `translateY(${(1 - p) * 50 - ex * 30}px) scale(${(0.82 + 0.18 * p) * breathe})`,
					textShadow: shadow ? '0 8px 28px rgba(0,0,0,0.45)' : undefined,
				}}
			>
				{text}
			</div>
		</div>
	);
};

type IconK = 'sun' | 'moon' | 'cal' | 'folder' | 'doc' | 'trad' | 'compass' | 'people' | 'check' | 'wa' | 'pin' | 'book' | 'pct' | 'mic';
const Icon: React.FC<{k: IconK; size: number; color?: string}> = ({k, size, color = M.ink}) => {
	const s = {stroke: color, strokeWidth: 7, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	return (
		<svg width={size} height={size} viewBox="0 0 100 100">
			{k === 'sun' ? (<><circle cx={50} cy={50} r={18} {...s} />{Array.from({length: 8}, (_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={50 + Math.cos(a) * 30} y1={50 + Math.sin(a) * 30} x2={50 + Math.cos(a) * 42} y2={50 + Math.sin(a) * 42} {...s} />; })}</>)
			: k === 'moon' ? <path d="M64 18 A34 34 0 1 0 82 66 A28 28 0 1 1 64 18 Z" {...s} />
			: k === 'cal' ? (<><rect x={14} y={22} width={72} height={64} rx={10} {...s} /><line x1={14} y1={42} x2={86} y2={42} {...s} /><line x1={34} y1={12} x2={34} y2={30} {...s} /><line x1={66} y1={12} x2={66} y2={30} {...s} /><circle cx={62} cy={64} r={6} fill={color} /></>)
			: k === 'folder' ? <path d="M10 28 H40 L48 38 H90 V82 H10 Z" {...s} />
			: k === 'doc' ? (<><path d="M24 10 H62 L80 28 V90 H24 Z" {...s} /><line x1={36} y1={50} x2={68} y2={50} {...s} /><line x1={36} y1={66} x2={60} y2={66} {...s} /><circle cx={44} cy={32} r={6} {...s} /></>)
			: k === 'trad' ? (<><path d="M12 22 H48 M30 14 V22 M18 22 Q26 48 46 56 M42 22 Q36 44 16 56" {...s} /><path d="M56 88 L70 48 L84 88 M61 74 H79" {...s} /></>)
			: k === 'compass' ? (<><circle cx={50} cy={50} r={38} {...s} /><path d="M62 38 L54 54 L38 62 L46 46 Z" {...s} fill={color} /></>)
			: k === 'people' ? (<><circle cx={34} cy={36} r={12} {...s} /><circle cx={68} cy={36} r={12} {...s} /><path d="M12 84 Q14 58 34 58 Q54 58 56 84 M48 84 Q50 58 68 58 Q88 58 90 84" {...s} /></>)
			: k === 'check' ? <path d="M18 52 L40 74 L84 28" {...s} strokeWidth={11} />
			: k === 'wa' ? (<><path d="M50 12 A38 38 0 0 0 18 70 L12 90 L32 84 A38 38 0 1 0 50 12 Z" {...s} /><path d="M38 34 Q34 42 42 56 Q52 70 64 68 L68 60 L58 54 L54 58 Q46 54 44 46 L48 42 L44 32 Z" fill={color} /></>)
			: k === 'pin' ? (<><path d="M50 92 C30 64 20 52 20 38 A30 30 0 0 1 80 38 C80 52 70 64 50 92 Z" {...s} /><circle cx={50} cy={38} r={10} {...s} /></>)
			: k === 'book' ? (<><path d="M50 26 Q30 14 12 20 V82 Q30 76 50 88 Q70 76 88 82 V20 Q70 14 50 26 Z" {...s} /><line x1={50} y1={26} x2={50} y2={88} {...s} /></>)
			: k === 'pct' ? (<><line x1={24} y1={80} x2={76} y2={20} {...s} /><circle cx={30} cy={30} r={10} {...s} /><circle cx={70} cy={70} r={10} {...s} /></>)
			: (<><rect x={36} y={12} width={28} height={50} rx={14} {...s} /><path d="M24 48 Q24 74 50 74 Q76 74 76 48 M50 74 V88" {...s} /></>)}
		</svg>
	);
};

/** Pastille icône + texte (bienfait, horaire, service). */
const Chip: React.FC<{at: number; icon?: IconK; text: string; size: number; bg?: string; color?: string; latin?: boolean; from?: 'left' | 'right'}> = ({at, icon, text, size, bg = M.white, color = M.ink, latin, from = 'right'}) => {
	const f = useCurrentFrame();
	if (f < at) return null;
	const p = spring({frame: f - at, fps: 30, config: M.spring.snappy});
	const bob = Math.sin((f - at) / 18) * 3;
	return (
		<div dir={latin ? 'ltr' : 'rtl'} style={{display: 'flex', alignItems: 'center', gap: size * 0.35, background: bg, color, fontFamily: latin ? F.latin : F.body, fontWeight: 900, fontSize: size, lineHeight: 1.2, padding: `${size * 0.22}px ${size * 0.55}px`, borderRadius: size * 0.5, boxShadow: '0 12px 28px rgba(0,0,0,0.3)', whiteSpace: 'nowrap', opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * (from === 'right' ? 140 : -140)}px) translateY(${bob}px) scale(${0.85 + 0.15 * p})`}}>
			{icon ? <Icon k={icon} size={size * 1.15} color={bg === M.orange ? M.white : M.orange} /> : null}
			{text}
		</div>
	);
};

/** Bandeau orange en haut (amorce). */
const Kick: React.FC<{at: number; text: string; y: number; size?: number; latin?: boolean; bg?: string; color?: string; until?: number}> = ({at, text, y, size = 60, latin, bg = M.orange, color = M.white, until}) => {
	const f = useCurrentFrame();
	if (f < at || (until !== undefined && f >= until)) return null;
	const p = at === 0 ? 1 : spring({frame: f - at, fps: 30, config: M.spring.snappy});
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
			<div dir={latin ? 'ltr' : 'rtl'} style={{background: bg, color, fontFamily: latin ? F.latin : F.body, fontWeight: 900, fontSize: size, padding: `${size * 0.12}px ${size * 0.5}px ${size * 0.2}px`, borderRadius: 14, transform: `rotate(-2deg) translateY(${(1 - p) * -40}px) scale(${0.8 + 0.2 * p})`, opacity: Math.min(1, p * 1.6), boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}}>{text}</div>
		</div>
	);
};

/** Plan du centre, plein cadre, avec un dégradé pour lire le texte. */
const Shot: React.FC<{src: string; trim: number; pos?: string; rate?: number; dark?: number}> = ({src, trim, pos = '50% 50%', rate = 1, dark = 0.55}) => (
	<AbsoluteFill>
		<Clip src={src} trim={trim} pos={pos} rate={rate} zoom={1.04} />
		<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,${dark}) 0%, rgba(0,0,0,0.05) 38%, rgba(0,0,0,0.05) 58%, rgba(0,0,0,${dark}) 100%)`}} />
	</AbsoluteFill>
);

/** Plusieurs plans à la suite dans une scène. */
const Shots: React.FC<{dur: number; list: {src: string; trim: number; pos?: string}[]}> = ({dur, list}) => {
	const per = Math.ceil(dur / list.length);
	return (
		<>
			{list.map((c, i) => (
				<Sequence key={i} from={i * per} durationInFrames={per}>
					<Shot {...c} />
				</Sequence>
			))}
		</>
	);
};

/** Fond « maille » crème qui bouge doucement (jamais d'aplat). */
const Mesh: React.FC<{base?: string}> = ({base = M.cream}) => {
	const f = useCurrentFrame();
	const a = Math.sin(f / 50) * 60;
	const b = Math.cos(f / 65) * 50;
	return (
		<AbsoluteFill style={{background: base}}>
			<AbsoluteFill style={{background: `radial-gradient(circle at ${30 + a / 10}% ${25 + b / 10}%, rgba(245,115,42,0.22), transparent 55%), radial-gradient(circle at ${75 - b / 10}% ${80 + a / 12}%, rgba(245,115,42,0.14), transparent 50%)`}} />
		</AbsoluteFill>
	);
};

const MGrade: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<AbsoluteFill style={{backgroundColor: M.orange, mixBlendMode: 'soft-light', opacity: 0.08}} />
	</AbsoluteFill>
);

// ---------------------------------------------------------------- carte de Ben Arous

// coordonnées approximatives des 12 délégations (lon, lat) ; dx/dy : place de l'étiquette
const CITIES: {n: string; lon: number; lat: number; dx: number; dy: number}[] = [
	{n: 'راداس', lon: 10.275, lat: 36.768, dx: 0, dy: -44},
	{n: 'الزهراء', lon: 10.307, lat: 36.744, dx: 70, dy: -26},
	{n: 'حمام الأنف', lon: 10.338, lat: 36.727, dx: 6, dy: -34},
	{n: 'حمام الشط', lon: 10.374, lat: 36.709, dx: -80, dy: 50},
	{n: 'مقرين', lon: 10.232, lat: 36.771, dx: -60, dy: -30},
	{n: 'بن عروس', lon: 10.224, lat: 36.751, dx: -105, dy: 10},
	{n: 'المدينة الجديدة', lon: 10.255, lat: 36.728, dx: -70, dy: 46},
	{n: 'بومهل', lon: 10.300, lat: 36.721, dx: 50, dy: 46},
	{n: 'المروج', lon: 10.200, lat: 36.733, dx: -70, dy: 26},
	{n: 'فوشانة', lon: 10.168, lat: 36.699, dx: -10, dy: 40},
	{n: 'المحمدية', lon: 10.150, lat: 36.676, dx: 60, dy: 44},
	{n: 'مرناق', lon: 10.290, lat: 36.683, dx: 0, dy: 40},
];
const MAPW = 1000;
const MAPH = 600;
// cadre resserré sur les 12 délégations (lon 10.13 → 10.39, lat 36.79 → 36.665)
const px = (lon: number) => ((lon - 10.13) / 0.26) * MAPW;
const py = (lat: number) => ((36.79 - lat) / 0.125) * MAPH;
const COAST: [number, number][] = [[10.285, 36.84], [10.29, 36.8], [10.3, 36.781], [10.316, 36.762], [10.331, 36.745], [10.35, 36.733], [10.39, 36.716], [10.45, 36.7], [10.45, 36.84]];
const RADES = CITIES[0];

/** La carte : villes qui s'allument (popAt), Radès en orange ; zoom sur Radès de zoomAt à zoomAt + 24. */
const BenArousMap: React.FC<{popAt: number[]; hot?: {i: number; at: number}[]; zoomAt?: number; ring?: number}> = ({popAt, hot = [], zoomAt, ring}) => {
	const f = useCurrentFrame();
	const {W, cy, vertical} = useLay();
	const w = vertical ? W * 0.86 : W * 0.84;
	const h = (w * MAPH) / MAPW;
	const z = zoomAt !== undefined ? interpolate(f, [zoomAt, zoomAt + 24], [1, 2.4], {easing: M.ease.inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
	const drift = 1 + Math.sin(f / 40) * 0.01;
	const ox = (px(RADES.lon) / MAPW) * 100;
	const oy = (py(RADES.lat) / MAPH) * 100;
	return (
		<div style={{position: 'absolute', left: (W - w) / 2, top: cy - h / 2 + (vertical ? 100 : 70), width: w, height: h, transform: `scale(${z * drift})`, transformOrigin: `${ox}% ${oy}%`}}>
			<svg width={w} height={h} viewBox={`0 0 ${MAPW} ${MAPH}`} style={{overflow: 'visible'}}>
				<rect x={-200} y={-200} width={MAPW + 400} height={MAPH + 400} fill={M.land} />
				<polygon points={COAST.map(([lo, la]) => `${px(lo)},${py(la)}`).join(' ')} fill={M.sea} stroke={M.white} strokeWidth={6} />
				<text x={px(10.372)} y={py(36.765)} textAnchor="middle" fontFamily={F.body} fontWeight={700} fontSize={30} fill="#8FAABA">البحر</text>
				{/* routes stylisées vers Radès */}
				{CITIES.slice(1).map((c, i) => {
					const p = tw(f, popAt[i + 1] ?? 0, 12, M.ease.out);
					return <line key={i} x1={px(RADES.lon)} y1={py(RADES.lat)} x2={px(RADES.lon) + (px(c.lon) - px(RADES.lon)) * p} y2={py(RADES.lat) + (py(c.lat) - py(RADES.lat)) * p} stroke={M.landEdge} strokeWidth={5} strokeDasharray="10 10" />;
				})}
				{ring !== undefined && f >= ring ? (
					<ellipse cx={px(10.26)} cy={py(36.725)} rx={430 * tw(f, ring, 14)} ry={260 * tw(f, ring, 14)} fill="none" stroke={M.orange} strokeWidth={8} strokeDasharray="22 16" strokeDashoffset={-f * 2} />
				) : null}
				{CITIES.map((c, i) => {
					const t = popAt[i] ?? 0;
					if (f < t) return null;
					const p = t === 0 && f < 1 ? 1 : spring({frame: f - t, fps: 30, config: M.spring.bouncy});
					const isR = i === 0;
					const hh = hot.find((x) => x.i === i && f >= x.at);
					const big = isR || !!hh;
					const pulse = isR ? 1 + Math.sin(f / 5) * 0.12 : 1;
					return (
						<g key={i} transform={`translate(${px(c.lon)} ${py(c.lat)}) scale(${p})`}>
							{isR ? <circle r={34 * pulse} fill={M.glow} /> : null}
							<circle r={big ? 19 : 13} fill={isR || hh ? M.orange : M.ink} stroke={M.white} strokeWidth={4} />
							<text x={c.dx} y={c.dy} textAnchor="middle" fontFamily={F.body} fontWeight={900} fontSize={big ? 50 : 36} fill={isR || hh ? M.orangeDeep : M.ink} stroke={M.land} strokeWidth={8} paintOrder="stroke">{c.n}</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
};

// ---------------------------------------------------------------- accroches

type HookP = {dur: number};
const HookFrame: React.FC<{id: string; dur: number; children: React.ReactNode; sfx?: number[]}> = ({id, dur, children, sfx = []}) => (
	<AbsoluteFill>
		<Cam id={id} dur={dur} whipIn={null} whipOut="y" push={0.06} roll={0}>
			<AbsoluteFill style={{background: M.land}} />
			{children}
		</Cam>
		<Sfx at={0} s="impact" v={0.45} />
		{sfx.map((t, i) => <Sfx key={i} at={t} s="pop2" v={0.35} />)}
		<Sfx at={dur - 5} s="whoosh" v={0.4} />
	</AbsoluteFill>
);

/** h1 : « تسكن في وحدة من مدن بن عروس؟ » */
const Hook1: React.FC<HookP> = ({dur}) => {
	const {vertical, top} = useLay();
	const k = Math.round(dur * 0.42);
	return (
		<HookFrame id="mh1" dur={dur} sfx={[k, k + 8, k + 16]}>
			<BenArousMap popAt={CITIES.map(() => 0)} hot={CITIES.map((_, i) => ({i, at: k + i * 2}))} />
			<Word at={0} text="تسكن في وحدة" y={vertical ? top + 70 : 130} size={130} color={M.ink} shadow={false} />
			<Word at={k} text="من مدن بن عروس؟" y={vertical ? top + 220 : 270} size={140} color={M.orange} shadow={false} />
		</HookFrame>
	);
};

/** h2 : « راداس، الزهراء، حمام الأنف، مقرين… تسكن في وحدة منهم؟ » (chaque ville s'allume quand elle est dite) */
const Hook2: React.FC<HookP> = ({dur}) => {
	const {vertical, top} = useLay();
	const said = [0, 0.2, 0.4, 0.59].map((k) => Math.round(k * dur));
	const pops = CITIES.map((_, i) => (i === 0 ? 0 : i === 1 ? said[1] : i === 2 ? said[2] : i === 4 ? said[3] : Math.round(dur * 0.78) + i));
	return (
		<HookFrame id="mh2" dur={dur} sfx={said.slice(1)}>
			<BenArousMap popAt={pops} hot={[{i: 1, at: said[1]}, {i: 2, at: said[2]}, {i: 4, at: said[3]}]} />
			{['راداس', 'الزهراء', 'حمام الأنف', 'مقرين'].map((n, i) => (
				<Word key={i} at={said[i]} until={i < 3 ? said[i + 1] : Math.round(dur * 0.8)} text={n} y={vertical ? top + 130 : 160} size={150} color={M.orange} shadow={false} />
			))}
			<Word at={Math.round(dur * 0.8)} text="تسكن في وحدة منهم؟" y={vertical ? top + 130 : 160} size={130} color={M.ink} shadow={false} />
		</HookFrame>
	);
};

/** h3 : « تسكن في بن عروس ولا حذاها؟ » */
const Hook3: React.FC<HookP> = ({dur}) => {
	const {vertical, top} = useLay();
	const k = Math.round(dur * 0.55);
	return (
		<HookFrame id="mh3" dur={dur} sfx={[k]}>
			<BenArousMap popAt={CITIES.map(() => 0)} ring={k} />
			<Word at={0} text="تسكن في بن عروس" y={vertical ? top + 70 : 130} size={130} color={M.ink} shadow={false} />
			<Word at={k} text="ولا حذاها؟" y={vertical ? top + 220 : 270} size={150} color={M.orange} shadow={false} />
		</HookFrame>
	);
};
const HOOKS = {h1: Hook1, h2: Hook2, h3: Hook3};

// ---------------------------------------------------------------- corps

/** « Al Mozon Academy à Radès » : zoom sur Radès, puis le centre (enseigne, logo). */
const NameScene: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {vertical, top, h, W} = useLay();
	const cut = Math.min(24, Math.round(dur * 0.4));
	const lw = vertical ? W * 0.62 : W * 0.5;
	const p = spring({frame: f - 4, fps: 30, config: M.spring.bouncy});
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id="mn" dur={dur} whipIn={null} whipOut="x" push={0.05} roll={0}>
				{f < cut ? (
					<>
						<AbsoluteFill style={{background: M.land}} />
						<BenArousMap popAt={CITIES.map(() => 0)} zoomAt={0} />
					</>
				) : (
					<Sequence from={cut} layout="none">
						<Shot src="mozon/visite1.mp4" trim={4.9} pos="50% 40%" dark={0.6} />
					</Sequence>
				)}
			</Cam>
			<div style={{position: 'absolute', left: (W - lw) / 2, top: vertical ? top + h * 0.6 : 760, width: lw, transform: `scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 1.6), filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.45))'}}>
				<Img src={staticFile(f < cut ? 'mozon/logo.png' : 'mozon/logo_blanc.png')} style={{width: '100%'}} />
			</div>
			<Kick at={cut + 2} text="à Radès" latin y={vertical ? top + 60 : 110} size={78} />
			<Sfx at={4} s="shimmer" v={0.4} />
			<Sfx at={cut} s="swipe" v={0.4} />
			<Sfx at={dur - 5} s="whoosh" v={0.4} />
		</AbsoluteFill>
	);
};

/** Scène sur plans du centre : titre en haut, éléments en bas de la zone utile. */
const Scene: React.FC<{id: string; dur: number; shots: {src: string; trim: number; pos?: string}[]; hits?: number[]; children: React.ReactNode}> = ({id, dur, shots, hits = [0], children}) => {
	const sh = useShake(hits, 10);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id={id} dur={dur} whipIn="x" whipOut="x" push={0.05} roll={0.4}>
				<Shots dur={dur} list={shots} />
			</Cam>
			<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>{children}</AbsoluteFill>
			<Sfx at={0} s="swipe" v={0.35} />
			<Sfx at={dur - 5} s="whoosh" v={0.35} />
		</AbsoluteFill>
	);
};

/** Barre des niveaux A1 → B2. */
const Levels: React.FC<{at: number; y: number}> = ({at, y}) => {
	const f = useCurrentFrame();
	const {vertical} = useLay();
	const s = vertical ? 120 : 100;
	return (
		<div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14}}>
			{['A1', 'A2', 'B1', 'B2'].map((l, i) => {
				const t = at + i * 4;
				const p = f < t ? 0 : spring({frame: f - t, fps: 30, config: M.spring.bouncy});
				const last = i === 3;
				return (
					<React.Fragment key={l}>
						<div style={{width: s * (last ? 1.25 : 1), height: s * (last ? 1.25 : 1), borderRadius: 22, background: last ? M.orange : M.white, color: last ? M.white : M.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.latin, fontWeight: 800, fontSize: s * (last ? 0.5 : 0.42), opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 60}px) scale(${0.6 + 0.4 * p})`, boxShadow: '0 12px 26px rgba(0,0,0,0.35)'}}>{l}</div>
						{i < 3 ? <div style={{width: 26, height: 8, borderRadius: 4, background: M.orange, opacity: tw(f, t + 3, 5)}} /> : null}
					</React.Fragment>
				);
			})}
		</div>
	);
};

/** Pastille « tampon » qui tourne (Prêt ✓, Remise, Gratuit). */
const Stamp: React.FC<{at: number; text: string; y: number; size: number; icon?: IconK}> = ({at, text, y, size, icon}) => {
	const f = useCurrentFrame();
	if (f < at) return null;
	const p = spring({frame: f - at, fps: 30, config: M.spring.bouncy});
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
			<div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 16, background: M.orange, color: M.white, fontFamily: F.latin, fontWeight: 800, fontSize: size, padding: `${size * 0.15}px ${size * 0.6}px`, borderRadius: size, border: `6px solid ${M.white}`, transform: `rotate(${-6 + Math.sin((f - at) / 10) * 2}deg) scale(${(1.6 - 0.6 * p) * (1 + Math.sin((f - at) / 8) * 0.02)})`, opacity: Math.min(1, p * 2), boxShadow: `0 0 40px ${M.glow}`}}>
				{icon ? <Icon k={icon} size={size * 0.9} color={M.white} /> : null}
				{text}
			</div>
		</div>
	);
};

// ---------------------------------------------------------------- appel final

const CtaScene: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {vertical, top, h, W, H} = useLay();
	const lw = vertical ? W * 0.5 : W * 0.38;
	const p = spring({frame: f, fps: 30, config: M.spring.bouncy});
	const bounce = Math.abs(Math.sin(f / 6)) * 34;
	const numP = spring({frame: f - 10, fps: 30, config: M.spring.snappy});
	return (
		<AbsoluteFill>
			<Cam id="mc" dur={dur} whipIn="y" whipOut={null} push={0.04} roll={0}>
				<Mesh />
			</Cam>
			<div style={{position: 'absolute', left: (W - lw) / 2, top: vertical ? top + 20 : 50, width: lw, transform: `scale(${(0.6 + 0.4 * p) * (1 + Math.sin(f / 20) * 0.015)})`, opacity: Math.min(1, p * 1.6)}}>
				<Img src={staticFile('mozon/logo.png')} style={{width: '100%'}} />
			</div>
			<Word at={6} text="ابعثلنا message" y={vertical ? top + h * 0.52 : H * 0.5} size={110} color={M.ink} shadow={false} font={F.display} />
			<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? top + h * 0.62 : H * 0.6, display: 'flex', justifyContent: 'center', opacity: Math.min(1, numP * 1.6), transform: `translateY(${(1 - numP) * 50}px) scale(${(0.8 + 0.2 * numP) * (1 + Math.sin(f / 9) * 0.02)})`}}>
				<div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 22, background: '#25D366', color: M.white, borderRadius: 30, padding: '18px 40px', boxShadow: '0 18px 40px rgba(0,0,0,0.3)'}}>
					<Icon k="wa" size={vertical ? 110 : 90} color={M.white} />
					<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: vertical ? 104 : 86, letterSpacing: 2}}>99 008 008</span>
				</div>
			</div>
			<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: vertical ? top + h * 0.8 : H * 0.76, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, fontFamily: F.body, fontWeight: 900, fontSize: 48, color: M.ink, opacity: tw(f, 16, 8)}}>
				<Icon k="pin" size={56} color={M.orange} />
				Al Mozon Academy · راداس
			</div>
			<svg width={110} height={130} viewBox="0 0 70 80" style={{position: 'absolute', left: W / 2 - 55, top: (vertical ? top + h - 30 : H - 170) + bounce, opacity: tw(f, 20, 6)}}>
				<path d="M12 10 L35 35 L58 10 M12 40 L35 65 L58 40" stroke={M.orange} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
			<Sfx at={0} s="impact" v={0.5} />
			<Sfx at={10} s="ding" v={0.4} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- une pub

type Tm = {hookDur: number; qual: number; profs: number; groups: number; day1: number; cours: number; exam: number; acc: number; dossier: number; cv: number; trad: number; orient: number; test: number; remise: number; cta: number; end: number};
type Ad = {id: string; hook: keyof typeof HOOKS; voice: keyof typeof TIMINGS};

const Film: React.FC<{ad: Ad}> = ({ad}) => {
	const tm = TIMINGS[ad.voice] as unknown as Tm;
	const H0 = tm.hookDur;
	const A = (t: number) => H0 + t - LEAD; // repère de voix → image (avec avance)
	const voiceEnd = H0 + tm.end;
	const total = voiceEnd + HOLD;
	const Hook = HOOKS[ad.hook];
	const h0 = H0 - LEAD;
	const {vertical, top, h, H} = useLay();
	const T1 = vertical ? top + 70 : 140; // ligne de titre
	const T2 = vertical ? top + 225 : 285;
	const LOW = vertical ? top + h - 260 : H - 330; // bas de la zone utile
	const seg = (a: number, b: number, el: (d: number) => React.ReactNode) => (
		<Sequence from={a} durationInFrames={Math.max(1, b - a)}>{el(Math.max(1, b - a))}</Sequence>
	);
	const r = (x: number, base: number) => A(x) - A(base); // temps relatif dans une scène
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{seg(0, h0, (d) => <Hook dur={d} />)}
			{seg(h0, A(tm.qual), (d) => <NameScene dur={d} />)}
			{seg(A(tm.qual), A(tm.profs), (d) => (
				<Scene id="sq" dur={d} shots={[{src: 'mozon/visite2.mp4', trim: 27.9}, {src: 'mozon/visite2.mp4', trim: 32.5}]}>
					<Kick at={0} text="يوفّرلك" y={T1 - 40} size={64} />
					<Word at={3} text="une formation" y={T2} size={110} latin />
					<Word at={8} text="de qualité" y={T2 + 130} size={120} latin color={M.orange} />
					<Levels at={Math.round(d * 0.5)} y={LOW} />
				</Scene>
			))}
			{seg(A(tm.profs), A(tm.groups), (d) => (
				<Scene id="sp" dur={d} shots={[{src: 'mozon/visite2.mp4', trim: 21.7, pos: '50% 40%'}, {src: 'mozon/visite1.mp4', trim: 32.3, pos: '50% 45%'}]}>
					<Word at={0} text="Des profs" y={T1} size={120} latin />
					<Word at={Math.round(d * 0.25)} text="qualifiés" y={T2} size={130} latin color={M.orange} />
					<Word at={Math.round(d * 0.5)} text="& expérimentés" y={T2 + 140} size={110} latin />
				</Scene>
			))}
			{seg(A(tm.groups), A(tm.cours), (d) => {
				const k = r(tm.day1, tm.groups);
				return (
					<Scene id="sg" dur={d} hits={[0, k]} shots={[{src: 'mozon/visite2.mp4', trim: 24.8, pos: '50% 45%'}, {src: 'mozon/visite1.mp4', trim: 30.7, pos: '50% 50%'}]}>
						<div style={{position: 'absolute', left: 0, right: 0, top: LOW, display: 'flex', justifyContent: 'center'}}>
							<Chip at={0} icon="people" text="des petits groupes" size={64} latin />
						</div>
						<Word at={k} text="Dès le 1er jour" y={T1} size={110} latin />
						<Word at={k + 8} text="تحكي في la classe!" y={T2} size={110} color={M.orange} />
					</Scene>
				);
			})}
			{seg(A(tm.cours), A(tm.exam), (d) => (
				<Scene id="sc" dur={d} shots={[{src: 'mozon/visite2.mp4', trim: 8.0}]}>
					<Word at={0} text="Les cours" y={T1} size={130} latin />
					<div style={{position: 'absolute', left: 0, right: 0, top: T2 + 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
						<Chip at={Math.round(d * 0.12)} icon="sun" text="في النهار" size={70} />
						<Chip at={Math.round(d * 0.38)} icon="moon" text="في العشية" size={70} />
						<Chip at={Math.round(d * 0.66)} icon="cal" text="le week-end" size={70} latin bg={M.orange} color={M.white} />
					</div>
				</Scene>
			))}
			{seg(A(tm.exam), A(tm.acc), (d) => (
				<Scene id="se" dur={d} hits={[0, Math.round(d * 0.72)]} shots={[{src: 'mozon/visite2.mp4', trim: 31.0}, {src: 'mozon/visite2.mp4', trim: 33.0}]}>
					<Word at={0} text="L'examen" y={T1} size={120} latin />
					<div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: T2 - 20, display: 'flex', justifyContent: 'center', gap: 18}}>
						{['Goethe', 'ÖSD', 'telc'].map((x, i) => <Chip key={x} at={Math.round(d * (0.15 + i * 0.17))} text={x} size={66} latin from="left" />)}
					</div>
					<Stamp at={Math.round(d * 0.72)} text="Prêt" icon="check" y={LOW} size={96} />
				</Scene>
			))}
			{seg(A(tm.acc), A(tm.test), (d) => {
				const ts = [tm.dossier, tm.cv, tm.trad, tm.orient].map((x) => r(x, tm.acc));
				const items: [IconK, string][] = [['folder', 'Traitement du dossier'], ['doc', 'CV'], ['trad', 'Traduction des documents'], ['compass', 'Orientation']];
				return (
					<Scene id="sa" dur={d} hits={[0, ...ts]} shots={[{src: 'mozon/visite1.mp4', trim: 13.0, pos: '50% 50%'}, {src: 'mozon/visite1.mp4', trim: 6.5, pos: '50% 40%'}]}>
						<Word at={0} text="Accompagnement" y={T1} size={110} latin />
						<Word at={5} text="complet" y={T1 + 125} size={120} latin color={M.orange} />
						<div style={{position: 'absolute', left: 0, right: 0, top: T2 + 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
							{items.map(([ic, tx], i) => <Chip key={tx} at={ts[i]} icon={ic} text={tx} size={56} latin bg={i % 2 ? M.orange : M.white} color={i % 2 ? M.white : M.ink} />)}
						</div>
						{ts.map((t, i) => <Sfx key={i} at={t} s="pop3" v={0.35} />)}
					</Scene>
				);
			})}
			{seg(A(tm.test), A(tm.cta), (d) => {
				const k = r(tm.remise, tm.test);
				return (
					<Scene id="st" dur={d} hits={[0, k]} shots={[{src: 'mozon/visite1.mp4', trim: 22.6, pos: '50% 40%'}]}>
						<Word at={0} text="Test de niveau" y={T1} size={115} latin />
						<Stamp at={4} text="GRATUIT" y={T2 - 10} size={92} />
						<Stamp at={k} text="Remise" icon="pct" y={LOW} size={96} />
						<Sfx at={k} s="coin" v={0.45} />
					</Scene>
				);
			})}
			{seg(A(tm.cta), total, (d) => <CtaScene dur={d} />)}
			<MGrade />
			<Grain />
			<Vignette a={0.25} />
			<Audio src={staticFile(`mozon/voice/${ad.voice}.wav`)} volume={1.4} />
			<Audio
				src={staticFile('audio/v9/music9.wav')}
				loop
				volume={(fr) => {
					const up = interpolate(fr, [voiceEnd, voiceEnd + 10], [0.14, 0.45], {easing: M.ease.out, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					const out = interpolate(fr, [total - 20, total - 1], [1, 0], {easing: M.ease.in, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return up * out;
				}}
			/>
		</AbsoluteFill>
	);
};

const ADS: Ad[] = [
	{id: 'tous-h1', hook: 'h1', voice: 'M_h1'},
	{id: 'tous-h2', hook: 'h2', voice: 'M_h2'},
	{id: 'tous-h3', hook: 'h3', voice: 'M_h3'},
];

export const MOZON_VIDEOS = ADS.flatMap((ad) =>
	(['9x16', '4x5'] as const).map((fmt) => ({id: `MZ-${ad.id}-${fmt}`, fmt, dur: TIMINGS[ad.voice].hookDur + TIMINGS[ad.voice].end + HOLD, ad})),
);

export const MozonVideo: React.FC<{id: string}> = ({id}) => {
	const e = MOZON_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<Film ad={e.ad} />
		</FmtProvider>
	);
};
