import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {IconCheck, IconPhone} from '../components/Icons';
import {C, F} from '../theme/brand';
import {OFFER2 as O, REAL} from './offer';

/**
 * Images V2 : la mécanique des pubs gagnantes (prix barré, 5 cartes numérotées,
 * bouton, bandeau de pied de page) avec les VRAIES photos des produits.
 */
export type WinLayout = 'exception' | 'calcul' | 'vraiePhoto' | 'hiver' | 'commande';
export type WinSpec = {id: string; layout: WinLayout; theme?: 'or' | 'foret' | 'nuit'};

export const RED = '#E2343B';
export const YELLOW = '#FFD43B';

// ---------- éléments communs ----------

export const T: React.FC<{size: number; color?: string; weight?: number; font?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({
	size,
	color = '#fff',
	weight = 900,
	font = F.body,
	style,
	children,
}) => (
	<div dir="rtl" style={{fontFamily: font, fontWeight: weight, fontSize: size, color, lineHeight: 1.25, ...style}}>
		{children}
	</div>
);

/** Chiffres et latin : toujours Montserrat 800, en LTR. */
export const N: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<span dir="ltr" style={{fontFamily: F.latin, fontWeight: 800, unicodeBidi: 'isolate', ...style}}>
		{children}
	</span>
);

export const Rays: React.FC<{color: string; opacity: number; cy?: string}> = ({color, opacity, cy = '42%'}) => (
	<AbsoluteFill
		style={{
			opacity,
			background: `repeating-conic-gradient(from 0deg at 50% ${cy}, ${color} 0deg 7deg, transparent 7deg 18deg)`,
			maskImage: `radial-gradient(circle at 50% ${cy}, black 10%, transparent 75%)`,
			WebkitMaskImage: `radial-gradient(circle at 50% ${cy}, black 10%, transparent 75%)`,
		}}
	/>
);

/** Motif d'étoiles à 8 branches (comme le fond des pubs gagnantes). */
export const Stars: React.FC<{color: string; opacity: number; cell?: number}> = ({color, opacity, cell = 150}) => {
	const svg = encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' width='${cell}' height='${cell}' viewBox='0 0 100 100'><g fill='none' stroke='${color}' stroke-width='2'><rect x='26' y='26' width='48' height='48'/><rect x='26' y='26' width='48' height='48' transform='rotate(45 50 50)'/><circle cx='50' cy='50' r='12'/></g></svg>`,
	);
	return <AbsoluteFill style={{opacity, backgroundImage: `url("data:image/svg+xml,${svg}")`, backgroundSize: cell}} />;
};

export const Footer: React.FC<{bg?: string; color?: string; accent?: string}> = ({bg = '#15140F', color = '#fff', accent = C.gold}) => (
	<div
		dir="rtl"
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			height: 100,
			background: bg,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 30,
			color,
		}}
	>
		<span style={{fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: 6, fontSize: 36, color: accent}}>
			<span dir="ltr">{O.brand}</span>
		</span>
		<span style={{width: 10, height: 10, background: color, opacity: 0.7}} />
		<span style={{fontFamily: F.body, fontWeight: 800, fontSize: 36}}>{O.cod}</span>
		<span style={{width: 10, height: 10, background: color, opacity: 0.7}} />
		<span style={{display: 'flex', alignItems: 'center', gap: 12}}>
			<IconPhone size={34} color={color} />
			<N style={{fontSize: 38}}>{O.phone}</N>
		</span>
	</div>
);

export const CtaButton: React.FC<{bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({
	bg = 'linear-gradient(180deg,#E3BE6E,#B98C35)',
	color = '#fff',
	size = 54,
	style,
}) => (
	<div
		dir="rtl"
		style={{
			background: bg,
			color,
			fontFamily: F.body,
			fontWeight: 900,
			fontSize: size,
			padding: `${size * 0.22}px ${size * 0.95}px`,
			borderRadius: 999,
			boxShadow: '0 10px 0 rgba(0,0,0,0.22), 0 18px 40px rgba(0,0,0,0.3)',
			display: 'inline-flex',
			alignItems: 'center',
			gap: 16,
			...style,
		}}
	>
		{O.cta}
		<span style={{fontSize: size * 0.8, lineHeight: 1}}>‹</span>
	</div>
);

export const Strike: React.FC<{size?: number; color?: string; prefix?: string}> = ({size = 48, color = '#fff', prefix = 'بلاصة'}) => (
	<div dir="rtl" style={{position: 'relative', display: 'inline-block', fontFamily: F.body, fontWeight: 900, fontSize: size, color}}>
		{prefix} <N>{O.oldPrice}</N> د.ت
		<div
			style={{
				position: 'absolute',
				left: -8,
				right: -8,
				top: '52%',
				height: size * 0.12,
				background: RED,
				borderRadius: 4,
				transform: 'rotate(-6deg)',
			}}
		/>
	</div>
);

export const Badge: React.FC<{n: number; size?: number; style?: React.CSSProperties}> = ({n, size = 64, style}) => (
	<div
		style={{
			position: 'absolute',
			width: size,
			height: size,
			borderRadius: '50%',
			background: RED,
			border: `${size * 0.08}px solid #fff`,
			boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			color: '#fff',
			...style,
		}}
	>
		<N style={{fontSize: size * 0.5}}>{n}</N>
	</div>
);

const Photo: React.FC<{i: number; style?: React.CSSProperties}> = ({i, style}) => (
	<Img
		src={staticFile(REAL[i].photo)}
		style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: REAL[i].pos, display: 'block', ...style}}
	/>
);

/** Carte blanche numérotée (comme ad1) avec une vraie photo. */
const Card: React.FC<{i: number; w: number; h: number; nameSize?: number; style?: React.CSSProperties}> = ({i, w, h, nameSize = 38, style}) => {
	const nameH = nameSize * 1.9;
	return (
		<div
			style={{
				position: 'relative',
				width: w,
				height: h,
				background: '#fff',
				borderRadius: 26,
				boxShadow: '0 14px 30px rgba(0,0,0,0.28)',
				padding: 12,
				boxSizing: 'border-box',
				...style,
			}}
		>
			<div style={{width: '100%', height: h - 24 - nameH, borderRadius: 18, overflow: 'hidden'}}>
				<Photo i={i} />
			</div>
			<T size={nameSize} color="#1A1A1A" style={{height: nameH, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				{REAL[i].name}
			</T>
			<Badge n={i + 1} size={nameSize * 1.55} style={{top: -nameSize * 0.45, right: -nameSize * 0.35}} />
		</div>
	);
};

export const THEMES = {
	or: {bg: 'radial-gradient(circle at 50% 40%, #C99A3A 0%, #8C6418 55%, #5A3E0C 100%)', ray: '#FFE7A8', star: '#3D2A06'},
	foret: {bg: 'radial-gradient(circle at 50% 40%, #3E6B4A 0%, #1F3A28 55%, #0F1F15 100%)', ray: '#B7E0A0', star: '#000'},
	nuit: {bg: 'radial-gradient(circle at 50% 40%, #2D4F86 0%, #16294D 55%, #0A1429 100%)', ray: '#A9C8FF', star: '#000'},
};

// ---------- 1. « عرض استثنائي! » : ad1 refaite avec les vraies photos ----------

const Exception: React.FC<{theme: keyof typeof THEMES}> = ({theme}) => {
	const th = THEMES[theme];
	const cw = 312;
	return (
		<AbsoluteFill style={{background: th.bg}}>
			<Stars color={th.star} opacity={0.12} />
			<Rays color={th.ray} opacity={0.16} />
			<div style={{position: 'absolute', top: 34, width: '100%', display: 'flex', justifyContent: 'center'}}>
				<T size={88} style={{background: RED, padding: '4px 54px 14px', borderRadius: 30, transform: 'rotate(-2deg)', boxShadow: '0 12px 0 rgba(0,0,0,0.2)'}}>
					عرض استثنائي!
				</T>
			</div>
			<T size={76} style={{position: 'absolute', top: 172, width: '100%', textAlign: 'center', textShadow: '0 4px 14px rgba(0,0,0,0.35)'}}>
				{O.title}
			</T>
			<T size={44} color="#FFE7A8" style={{position: 'absolute', top: 272, width: '100%', textAlign: 'center'}}>
				أقل من <N>10</N> د.ت للقطعة
			</T>
			{/* ma touche : on assume les vraies photos */}
			<div
				style={{
					position: 'absolute',
					top: 790,
					left: 26,
					zIndex: 3,
					width: 176,
					height: 176,
					borderRadius: '50%',
					background: '#111',
					border: '5px solid #fff',
					boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					transform: 'rotate(-10deg)',
					boxSizing: 'border-box',
				}}
			>
				<IconCheck size={40} color="#7CD67C" />
				<T size={30} style={{textAlign: 'center', lineHeight: 1.1}}>
					صور
					<br />
					حقيقية
				</T>
			</div>
			<div dir="rtl" style={{position: 'absolute', top: 372, width: '100%', display: 'flex', justifyContent: 'center', gap: 26}}>
				{[0, 1, 2].map((i) => (
					<Card key={i} i={i} w={cw} h={318} nameSize={36} />
				))}
			</div>
			<div dir="rtl" style={{position: 'absolute', top: 718, width: '100%', display: 'flex', justifyContent: 'center', gap: 26}}>
				{[3, 4].map((i) => (
					<Card key={i} i={i} w={cw} h={318} nameSize={36} />
				))}
			</div>
			<div dir="rtl" style={{position: 'absolute', top: 1048, right: 54, display: 'flex', alignItems: 'center', gap: 18}}>
				<T size={52}>
					<N>5</N> قطع بـ
				</T>
				<div style={{background: '#FFF3C4', borderRadius: 22, padding: '0 30px', boxShadow: '0 10px 0 rgba(0,0,0,0.2)'}}>
					<T size={96} color="#111">
						<N style={{fontSize: 96}}>{O.price}</N> د.ت
					</T>
				</div>
			</div>
			<div style={{position: 'absolute', top: 1170, right: 70}}>
				<Strike size={40} />
			</div>
			<div style={{position: 'absolute', top: 1076, left: 54}}>
				<CtaButton size={52} />
			</div>
			<Footer />
		</AbsoluteFill>
	);
};

// ---------- 2. Le calcul : « أقل من 10 د.ت للقطعة » ----------

const Calcul: React.FC = () => (
	<AbsoluteFill style={{background: YELLOW}}>
		<Rays color="#fff" opacity={0.35} cy="30%" />
		<div style={{position: 'absolute', top: 46, width: '100%', display: 'flex', justifyContent: 'center'}}>
			<T size={40} style={{background: '#111', padding: '2px 34px 8px', borderRadius: 999}}>
				{O.title}
			</T>
		</div>
		<T size={150} color="#111" style={{position: 'absolute', top: 130, width: '100%', textAlign: 'center', lineHeight: 1.05}}>
			أقل من <N style={{color: RED}}>10</N> د.ت
		</T>
		<T size={96} color={RED} style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', transform: 'rotate(-2deg)'}}>
			للقطعة!
		</T>
		<div dir="rtl" style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', gap: 16}}>
			{REAL.map((p, i) => (
				<div key={p.key} style={{width: 188, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<div style={{width: 188, height: 230, borderRadius: 24, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 10px 24px rgba(0,0,0,0.25)', boxSizing: 'border-box'}}>
						<Photo i={i} />
					</div>
					<div style={{marginTop: -26, background: RED, color: '#fff', borderRadius: 14, padding: '2px 14px 6px', transform: `rotate(${i % 2 ? 4 : -4}deg)`, boxShadow: '0 6px 0 rgba(0,0,0,0.2)'}}>
						<T size={30}>
							<N style={{fontSize: 32}}>{O.perPiece}</N> د.ت
						</T>
					</div>
					<T size={26} color="#111" style={{marginTop: 8, textAlign: 'center', whiteSpace: 'nowrap'}}>
						{p.name}
					</T>
				</div>
			))}
		</div>
		{/* l'équation, case par case pour que le RTL ne la mélange pas */}
		<div
			dir="rtl"
			style={{
				position: 'absolute',
				top: 830,
				left: 60,
				right: 60,
				background: '#fff',
				borderRadius: 30,
				boxShadow: '0 14px 0 rgba(0,0,0,0.15)',
				padding: '22px 10px 30px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 22,
			}}
		>
			<T size={56} color="#111">
				<N>5</N> قطع
			</T>
			<N style={{fontSize: 56, color: '#888'}}>×</N>
			<T size={56} color="#111">
				<N>{O.perPiece}</N>
			</T>
			<N style={{fontSize: 56, color: '#888'}}>=</N>
			<T size={88} color={RED}>
				<N style={{fontSize: 92}}>{O.price}</N> د.ت
			</T>
		</div>
		<div style={{position: 'absolute', top: 1030, right: 80}}>
			<Strike size={50} color="#111" prefix="عوض" />
		</div>
		<div style={{position: 'absolute', top: 1128, right: 80}}>
			<T size={34} color="#333" weight={800}>
				الباك الكامل، <N>5</N> قطع
			</T>
		</div>
		<div style={{position: 'absolute', top: 1050, left: 60}}>
			<CtaButton bg="#111" color={YELLOW} size={56} />
		</div>
		<Footer />
	</AbsoluteFill>
);

// ---------- 3. La vraie photo : « هذا اللي باش يوصلك » ----------

const PIN_NAMES: {name: string; x: number; y: number}[] = [
	{name: 'فرشة التدليك', x: 160, y: 250},
	{name: 'زيت إكليل الجبل', x: 410, y: 380},
	{name: 'ديرما رولر 540', x: 740, y: 560},
	{name: 'مشط الجذور', x: 900, y: 320},
];

const VraiePhoto: React.FC = () => (
	<AbsoluteFill style={{background: C.forestDeep}}>
		<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 900, overflow: 'hidden'}}>
			<Img src={staticFile('photos/real/ensemble.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,12,0.85) 0%, rgba(10,16,12,0) 26%, rgba(10,16,12,0) 70%, #121C16 100%)'}} />
		</div>
		<T size={74} style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center'}}>
			هذا اللي <span style={{color: C.goldLight}}>باش يوصلك</span>
		</T>
		<div style={{position: 'absolute', top: 160, right: 40, transform: 'rotate(5deg)', background: RED, borderRadius: 16, padding: '4px 22px 10px', boxShadow: '0 8px 0 rgba(0,0,0,0.25)'}}>
			<T size={36}>صورة حقيقية، مش ديزاين</T>
		</div>
		{PIN_NAMES.map((p) => (
			<div key={p.name} dir="rtl" style={{position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 8}}>
				<div style={{background: 'rgba(255,255,255,0.94)', borderRadius: 999, padding: '2px 18px 6px', boxShadow: '0 6px 16px rgba(0,0,0,0.3)'}}>
					<T size={28} color="#111" style={{whiteSpace: 'nowrap'}}>
						{p.name}
					</T>
				</div>
			</div>
		))}
		<div dir="rtl" style={{position: 'absolute', top: 760, right: 40, left: 40, display: 'flex', alignItems: 'center', gap: 14}}>
			<div style={{background: '#fff', borderRadius: 999, padding: '2px 20px 6px'}}>
				<T size={28} color="#111">+ سدر بيو</T>
			</div>
			<T size={28} color="#fff" weight={700} style={{textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>
				في نفس الباك
			</T>
		</div>
		<T size={62} style={{position: 'absolute', top: 880, right: 60}}>
			<N>5</N> قطع للشعر واللحية
		</T>
		<T size={40} color={C.goldLight} weight={800} style={{position: 'absolute', top: 970, right: 60}}>
			أقل من <N>10</N> د.ت للقطعة
		</T>
		<div style={{position: 'absolute', top: 1050, right: 60}}>
			<Strike size={44} />
		</div>
		<div style={{position: 'absolute', top: 1120, right: 60}}>
			<CtaButton size={50} />
		</div>
		{/* tampon prix */}
		<div
			style={{
				position: 'absolute',
				top: 860,
				left: 60,
				width: 300,
				height: 300,
				borderRadius: '50%',
				background: 'radial-gradient(circle at 40% 35%, #F0D58C, #C3973F)',
				border: '8px dashed rgba(255,255,255,0.75)',
				boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				transform: 'rotate(-8deg)',
				boxSizing: 'border-box',
			}}
		>
			<T size={32} color="#2A1E05">الباك كامل</T>
			<N style={{fontSize: 120, color: '#1A1203', lineHeight: 1}}>{O.price}</N>
			<T size={40} color="#2A1E05">دينار</T>
		</div>
		<Footer bg="#0A0F0C" />
	</AbsoluteFill>
);

// ---------- 4. Saison : « الشتاء جاي » (inspiré d'ad2) ----------

const Flake: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
	<svg width={s} height={s} viewBox="-10 -10 20 20" style={{position: 'absolute', left: x, top: y, opacity: o}}>
		<g stroke="#fff" strokeWidth={1.4} strokeLinecap="round">
			{[0, 60, 120].map((a) => (
				<g key={a} transform={`rotate(${a})`}>
					<line x1={0} y1={-9} x2={0} y2={9} />
					<line x1={0} y1={-6} x2={-2.5} y2={-8} />
					<line x1={0} y1={-6} x2={2.5} y2={-8} />
					<line x1={0} y1={6} x2={-2.5} y2={8} />
					<line x1={0} y1={6} x2={2.5} y2={8} />
				</g>
			))}
		</g>
	</svg>
);

const FLAKES = [
	[60, 60, 70, 0.5], [930, 80, 90, 0.55], [820, 300, 40, 0.4], [120, 330, 46, 0.35], [990, 640, 50, 0.3], [30, 760, 60, 0.3], [500, 22, 36, 0.35], [700, 200, 30, 0.3],
] as const;

const Hiver: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #2F6BB0 0%, #173A6B 55%, #0B1E3D 100%)'}}>
		<Stars color="#000" opacity={0.1} />
		<Rays color="#CFE3FF" opacity={0.14} cy="55%" />
		{FLAKES.map(([x, y, s, o], i) => (
			<Flake key={i} x={x} y={y} s={s} o={o} />
		))}
		<T
			size={170}
			font={F.display}
			weight={400}
			color="#EAF4FF"
			style={{position: 'absolute', top: 30, width: '100%', textAlign: 'center', lineHeight: 1.1, textShadow: '0 8px 0 #0B1E3D, 0 0 40px rgba(160,200,255,0.5)', WebkitTextStroke: '3px #0B1E3D'}}
		>
			الشتاء جاي
		</T>
		<T size={60} style={{position: 'absolute', top: 258, width: '100%', textAlign: 'center'}}>
			شعرك يستحقّ روتين كامل
		</T>
		<T size={40} color="#FFE7A8" style={{position: 'absolute', top: 345, width: '100%', textAlign: 'center'}}>
			<N>5</N> قطع، من السدر لفرشة التدليك
		</T>
		<div dir="rtl" style={{position: 'absolute', top: 440, width: '100%', display: 'flex', justifyContent: 'center', gap: 14}}>
			{REAL.map((p, i) => (
				<Card key={p.key} i={i} w={190} h={250} nameSize={22} />
			))}
		</div>
		{/* bloc prix façon coup de pinceau jaune */}
		<div
			dir="rtl"
			style={{
				position: 'absolute',
				top: 760,
				left: 70,
				right: 70,
				height: 250,
				background: YELLOW,
				clipPath: 'polygon(1% 8%, 6% 2%, 30% 6%, 55% 0%, 80% 5%, 97% 1%, 100% 30%, 98% 62%, 100% 94%, 75% 98%, 50% 93%, 22% 100%, 3% 95%, 0% 60%, 2% 30%)',
				transform: 'rotate(-2deg)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 30,
			}}
		>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<T size={56} color="#111">الباك كامل بـ</T>
				<T size={76} color="#111">دينار</T>
			</div>
			<N style={{fontSize: 200, color: RED, lineHeight: 1, textShadow: '6px 6px 0 #111'}}>{O.price}</N>
		</div>
		<div style={{position: 'absolute', top: 1070, right: 90}}>
			<Strike size={50} />
		</div>
		<div style={{position: 'absolute', top: 1060, left: 70}}>
			<CtaButton size={54} />
		</div>
		<Footer bg="#08142A" />
	</AbsoluteFill>
);

// ---------- 5. « الكوموند متاعك تتحضّر » : confiance ----------

const Commande: React.FC = () => (
	<AbsoluteFill style={{background: '#0E0E0E'}}>
		<Img src={staticFile('photos/real/commande.jpg')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,0.9) 72%, #000 100%)'}} />
		<div style={{position: 'absolute', top: 40, width: '100%', display: 'flex', justifyContent: 'center'}}>
			<T size={34} style={{background: RED, padding: '2px 26px 8px', borderRadius: 999}}>
				{O.title}
			</T>
		</div>
		<T size={86} style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', lineHeight: 1.15, textShadow: '0 4px 18px rgba(0,0,0,0.6)'}}>
			الكوموند متاعك
			<br />
			<span style={{color: C.goldLight}}>تتحضّر بالكفوف</span>
		</T>
		<div dir="rtl" style={{position: 'absolute', top: 770, right: 60, display: 'flex', flexDirection: 'column', gap: 18}}>
			{['5 قطع في باك واحد', 'تخلّص كي توصلك', 'توصيل لكامل ولايات تونس'].map((s) => (
				<div key={s} style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<div style={{width: 52, height: 52, borderRadius: '50%', background: '#2FA35A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<IconCheck size={34} color="#fff" />
					</div>
					<T size={44}>{s}</T>
				</div>
			))}
		</div>
		<div
			style={{
				position: 'absolute',
				top: 740,
				left: 60,
				width: 270,
				height: 270,
				borderRadius: '50%',
				background: RED,
				border: '8px solid #fff',
				boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				transform: 'rotate(-8deg)',
				boxSizing: 'border-box',
			}}
		>
			<T size={30}>الباك كامل</T>
			<N style={{fontSize: 110, color: '#fff', lineHeight: 1}}>{O.price}</N>
			<T size={36}>دينار</T>
		</div>
		<div style={{position: 'absolute', top: 1060, left: 60}}>
			<Strike size={42} />
		</div>
		<div style={{position: 'absolute', top: 1040, right: 60}}>
			<CtaButton size={54} />
		</div>
		<Footer />
	</AbsoluteFill>
);

export const WinStill: React.FC<{spec: WinSpec}> = ({spec}) => {
	switch (spec.layout) {
		case 'exception':
			return <Exception theme={spec.theme ?? 'or'} />;
		case 'calcul':
			return <Calcul />;
		case 'vraiePhoto':
			return <VraiePhoto />;
		case 'hiver':
			return <Hiver />;
		case 'commande':
			return <Commande />;
	}
};

export const WIN_STILLS: WinSpec[] = [
	{id: 'W2-P1-exception-4x5-or', layout: 'exception', theme: 'or'},
	{id: 'W2-P2-calcul-4x5-jaune', layout: 'calcul'},
	{id: 'W2-P3-vraiephoto-4x5-foret', layout: 'vraiePhoto'},
	{id: 'W2-P4-hiver-4x5-bleu', layout: 'hiver'},
	{id: 'W2-P5-commande-4x5-noir', layout: 'commande'},
];
