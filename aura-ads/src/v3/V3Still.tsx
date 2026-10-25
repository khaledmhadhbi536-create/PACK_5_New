import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {IconCheck} from '../components/Icons';
import {OilBottle} from '../components/Products';
import {C, F} from '../theme/brand';
import {OFFER2 as O} from '../v2/offer';
import {Badge, CtaButton, Footer, N, RED, Rays, Stars, Strike, T, THEMES, YELLOW} from '../v2/WinStill';

/**
 * V3 : orienté vente, produits lisibles en un coup d'œil (détourés),
 * titres simples et sans promesse.
 */
export type V3Layout =
	| 'exception'
	| 'calcul'
	| 'toutCa'
	| 'hiver'
	| 'cod'
	| 'prixBarre'
	| 'sidr'
	| 'derma'
	| 'comparatif'
	| 'etapes'
	| 'cadeau'
	| 'blackFriday';
export type V3Spec = {id: string; layout: V3Layout};

export const TITLE = 'باك الشعر واللحية للرجال';

export type PKey = 'sidr' | 'derma' | 'huile' | 'applicateur' | 'brosse';
export const P: {key: PKey; name: string; img?: string}[] = [
	{key: 'sidr', name: 'سدر بيو', img: 'products/sidr.png'},
	{key: 'derma', name: 'ديرما رولر 540', img: 'products/derma.png'},
	{key: 'huile', name: 'زيت إكليل الجبل'},
	{key: 'applicateur', name: 'مشط الجذور', img: 'products/applicateur_noir.png'},
	{key: 'brosse', name: 'فرشة التدليك', img: 'products/brosse_bleue.png'},
];
export const byKey = (k: PKey) => P.find((p) => p.key === k)!;

/** Produit détouré, contenu dans une boîte w × h. */
export const Prod: React.FC<{k: PKey; w: number; h: number; style?: React.CSSProperties}> = ({k, w, h, style}) => {
	const p = byKey(k);
	return (
		<div style={{width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style}}>
			{p.img ? (
				<Img src={staticFile(p.img)} style={{maxWidth: w, maxHeight: h, objectFit: 'contain', filter: 'drop-shadow(0 12px 14px rgba(0,0,0,0.25))'}} />
			) : (
				<OilBottle height={Math.min(h, (w * 470) / 200) * 0.96} labelAr="زيت إكليل الجبل" style={{filter: 'drop-shadow(0 12px 14px rgba(0,0,0,0.25))'}} />
			)}
		</div>
	);
};

/** Les 5 produits regroupés (pack shot). Boîte W × H, posés en bas. */
export const Pack: React.FC<{W: number; H: number; style?: React.CSSProperties; shadow?: string}> = ({W, H, style, shadow = 'rgba(0,0,0,0.35)'}) => {
	const at = (x: number, w: number, h: number, z: number, k: PKey, lift = 0) => (
		<div key={k} style={{position: 'absolute', left: x * W, bottom: lift * H, zIndex: z}}>
			<Prod k={k} w={w * W} h={h * H} style={{alignItems: 'flex-end'}} />
		</div>
	);
	return (
		<div style={{position: 'relative', width: W, height: H, ...style}}>
			<div style={{position: 'absolute', left: W * 0.06, right: W * 0.06, bottom: -H * 0.04, height: H * 0.1, borderRadius: '50%', background: `radial-gradient(closest-side, ${shadow}, transparent)`}} />
			{at(0.04, 0.22, 0.98, 1, 'derma', 0.06)}
			{at(0.37, 0.24, 0.84, 1, 'huile', 0.1)}
			{at(0.7, 0.22, 0.9, 1, 'applicateur', 0.08)}
			{at(0.0, 0.48, 0.46, 2, 'sidr')}
			{at(0.52, 0.44, 0.48, 2, 'brosse')}
		</div>
	);
};

/** Carte blanche numérotée avec produit détouré (style ad1). */
export const Card: React.FC<{i: number; w: number; h: number; nameSize?: number}> = ({i, w, h, nameSize = 36}) => {
	const nameH = nameSize * 1.9;
	return (
		<div style={{position: 'relative', width: w, height: h, background: '#fff', borderRadius: 26, boxShadow: '0 14px 30px rgba(0,0,0,0.25)', padding: 14, boxSizing: 'border-box'}}>
			<Prod k={P[i].key} w={w - 28} h={h - 28 - nameH} />
			<T size={nameSize} color="#1A1A1A" style={{height: nameH, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap'}}>
				{P[i].name}
			</T>
			<Badge n={i + 1} size={nameSize * 1.55} style={{top: -nameSize * 0.45, right: -nameSize * 0.35}} />
		</div>
	);
};

export const Center: React.FC<{top: number; children: React.ReactNode; gap?: number; style?: React.CSSProperties}> = ({top, children, gap = 0, style}) => (
	<div dir="rtl" style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap, ...style}}>
		{children}
	</div>
);

export const PriceBox: React.FC<{top: number; right?: number; dark?: boolean}> = ({top, right = 54, dark}) => (
	<div dir="rtl" style={{position: 'absolute', top, right, display: 'flex', alignItems: 'center', gap: 18}}>
		<T size={52} color={dark ? '#111' : '#fff'}>
			<N>5</N> قطع بـ
		</T>
		<div style={{background: dark ? '#111' : '#FFF3C4', borderRadius: 22, padding: '0 30px', boxShadow: '0 10px 0 rgba(0,0,0,0.2)'}}>
			<T size={96} color={dark ? YELLOW : '#111'}>
				<N style={{fontSize: 96}}>{O.price}</N> د.ت
			</T>
		</div>
	</div>
);

export const Stamp: React.FC<{size?: number; top: number; left: number; bg?: string; color?: string; rotate?: number}> = ({size = 280, top, left, bg = RED, color = '#fff', rotate = -8}) => (
	<div
		style={{
			position: 'absolute',
			top,
			left,
			width: size,
			height: size,
			borderRadius: '50%',
			background: bg,
			border: '8px solid #fff',
			boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			transform: `rotate(${rotate}deg)`,
			boxSizing: 'border-box',
			zIndex: 5,
		}}
	>
		<T size={size * 0.11} color={color}>الباك كامل</T>
		<N style={{fontSize: size * 0.4, color, lineHeight: 1}}>{O.price}</N>
		<T size={size * 0.13} color={color}>دينار</T>
	</div>
);

export const Checks: React.FC<{top: number; right: number; items: string[]; color?: string; size?: number}> = ({top, right, items, color = '#fff', size = 42}) => (
	<div dir="rtl" style={{position: 'absolute', top, right, display: 'flex', flexDirection: 'column', gap: 16}}>
		{items.map((s) => (
			<div key={s} style={{display: 'flex', alignItems: 'center', gap: 14}}>
				<div style={{width: size * 1.2, height: size * 1.2, borderRadius: '50%', background: '#2FA35A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<IconCheck size={size * 0.8} color="#fff" />
				</div>
				<T size={size} color={color}>{s}</T>
			</div>
		))}
	</div>
);

// ====================== 5 itérations ======================

const Exception: React.FC = () => {
	const th = THEMES.or;
	return (
		<AbsoluteFill style={{background: th.bg}}>
			<Stars color={th.star} opacity={0.12} />
			<Rays color={th.ray} opacity={0.16} />
			<Center top={34}>
				<T size={88} style={{background: RED, padding: '4px 54px 14px', borderRadius: 30, transform: 'rotate(-2deg)', boxShadow: '0 12px 0 rgba(0,0,0,0.2)'}}>عرض استثنائي!</T>
			</Center>
			<T size={72} style={{position: 'absolute', top: 176, width: '100%', textAlign: 'center', textShadow: '0 4px 14px rgba(0,0,0,0.35)'}}>{TITLE}</T>
			<T size={44} color="#FFE7A8" style={{position: 'absolute', top: 272, width: '100%', textAlign: 'center'}}>
				أقل من <N>10</N> د.ت للقطعة
			</T>
			<Center top={372} gap={26}>
				{[0, 1, 2].map((i) => <Card key={i} i={i} w={312} h={318} />)}
			</Center>
			<Center top={718} gap={26}>
				{[3, 4].map((i) => <Card key={i} i={i} w={312} h={318} />)}
			</Center>
			<PriceBox top={1048} />
			<div style={{position: 'absolute', top: 1170, right: 70}}><Strike size={40} /></div>
			<div style={{position: 'absolute', top: 1076, left: 54}}><CtaButton size={52} /></div>
			<Footer />
		</AbsoluteFill>
	);
};

const Calcul: React.FC = () => (
	<AbsoluteFill style={{background: YELLOW}}>
		<Rays color="#fff" opacity={0.35} cy="30%" />
		<Center top={46}>
			<T size={40} style={{background: '#111', padding: '2px 34px 8px', borderRadius: 999}}>{TITLE}</T>
		</Center>
		<T size={150} color="#111" style={{position: 'absolute', top: 130, width: '100%', textAlign: 'center', lineHeight: 1.05}}>
			أقل من <N style={{color: RED}}>10</N> د.ت
		</T>
		<T size={96} color={RED} style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', transform: 'rotate(-2deg)'}}>للقطعة!</T>
		<Center top={470} gap={16} style={{alignItems: 'flex-start'}}>
			{P.map((p) => (
				<div key={p.key} style={{width: 188, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<div style={{width: 188, height: 230, borderRadius: 24, background: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,0.2)', padding: 12, boxSizing: 'border-box'}}>
						<Prod k={p.key} w={164} h={206} />
					</div>
					<div style={{marginTop: -26, background: RED, borderRadius: 14, padding: '2px 14px 6px', boxShadow: '0 6px 0 rgba(0,0,0,0.2)'}}>
						<T size={30}><N style={{fontSize: 32}}>{O.perPiece}</N> د.ت</T>
					</div>
					<T size={26} color="#111" style={{marginTop: 8, textAlign: 'center', whiteSpace: 'nowrap'}}>{p.name}</T>
				</div>
			))}
		</Center>
		<div dir="rtl" style={{position: 'absolute', top: 830, left: 60, right: 60, background: '#fff', borderRadius: 30, boxShadow: '0 14px 0 rgba(0,0,0,0.15)', padding: '22px 10px 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22}}>
			<T size={56} color="#111"><N>5</N> قطع</T>
			<N style={{fontSize: 56, color: '#888'}}>×</N>
			<T size={56} color="#111"><N>{O.perPiece}</N></T>
			<N style={{fontSize: 56, color: '#888'}}>=</N>
			<T size={88} color={RED}><N style={{fontSize: 92}}>{O.price}</N> د.ت</T>
		</div>
		<div style={{position: 'absolute', top: 1030, right: 80}}><Strike size={50} color="#111" prefix="عوض" /></div>
		<T size={34} color="#333" weight={800} style={{position: 'absolute', top: 1128, right: 80}}>
			الباك الكامل، <N>5</N> قطع
		</T>
		<div style={{position: 'absolute', top: 1050, left: 60}}><CtaButton bg="#111" color={YELLOW} size={56} /></div>
		<Footer />
	</AbsoluteFill>
);

/** (remplace « la vraie photo ») : « كل هذا بـ 49 دينار » */
const ToutCa: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #34573F 0%, #1C3325 60%, #0E1B13 100%)'}}>
		<Stars color="#000" opacity={0.12} />
		<Rays color="#CDE8B5" opacity={0.1} cy="55%" />
		<T size={120} style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center', lineHeight: 1.1}}>كل هذا</T>
		<T size={96} color={C.goldLight} style={{position: 'absolute', top: 180, width: '100%', textAlign: 'center'}}>
			بـ <N style={{fontSize: 110}}>{O.price}</N> دينار
		</T>
		<Center top={330}>
			<Pack W={860} H={560} />
		</Center>
		<Center top={920} gap={12} style={{flexWrap: 'wrap', left: 50, right: 50}}>
			{P.map((p, i) => (
				<div key={p.key} style={{background: 'rgba(255,255,255,0.95)', borderRadius: 999, padding: '2px 18px 6px', display: 'flex', alignItems: 'center', gap: 8}}>
					<N style={{fontSize: 24, color: RED}}>{i + 1}</N>
					<T size={28} color="#111">{p.name}</T>
				</div>
			))}
		</Center>
		<div style={{position: 'absolute', top: 1090, right: 70}}><Strike size={48} /></div>
		<div style={{position: 'absolute', top: 1070, left: 60}}><CtaButton size={54} /></div>
		<Footer bg="#0A0F0C" />
	</AbsoluteFill>
);

export const FLAKES = [
	[60, 60, 70, 0.5], [930, 80, 90, 0.55], [820, 300, 40, 0.4], [120, 330, 46, 0.35], [990, 640, 50, 0.3], [30, 760, 60, 0.3], [500, 22, 36, 0.35], [700, 200, 30, 0.3],
] as const;
export const Flake: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
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

const Hiver: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #2F6BB0 0%, #173A6B 55%, #0B1E3D 100%)'}}>
		<Stars color="#000" opacity={0.1} />
		<Rays color="#CFE3FF" opacity={0.14} cy="55%" />
		{FLAKES.map(([x, y, s, o], i) => <Flake key={i} x={x} y={y} s={s} o={o} />)}
		<T size={170} font={F.display} weight={400} color="#EAF4FF" style={{position: 'absolute', top: 30, width: '100%', textAlign: 'center', lineHeight: 1.1, textShadow: '0 8px 0 #0B1E3D, 0 0 40px rgba(160,200,255,0.5)', WebkitTextStroke: '3px #0B1E3D'}}>
			الشتاء جاي
		</T>
		<T size={58} style={{position: 'absolute', top: 258, width: '100%', textAlign: 'center'}}>روتين كامل للشعر واللحية</T>
		<T size={40} color="#FFE7A8" style={{position: 'absolute', top: 345, width: '100%', textAlign: 'center'}}>
			<N>5</N> قطع في باك واحد
		</T>
		<Center top={440} gap={14}>
			{P.map((p, i) => <Card key={p.key} i={i} w={190} h={250} nameSize={22} />)}
		</Center>
		<div dir="rtl" style={{position: 'absolute', top: 760, left: 70, right: 70, height: 250, background: YELLOW, clipPath: 'polygon(1% 8%, 6% 2%, 30% 6%, 55% 0%, 80% 5%, 97% 1%, 100% 30%, 98% 62%, 100% 94%, 75% 98%, 50% 93%, 22% 100%, 3% 95%, 0% 60%, 2% 30%)', transform: 'rotate(-2deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30}}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<T size={56} color="#111">الباك كامل بـ</T>
				<T size={76} color="#111">دينار</T>
			</div>
			<N style={{fontSize: 200, color: RED, lineHeight: 1, textShadow: '6px 6px 0 #111'}}>{O.price}</N>
		</div>
		<div style={{position: 'absolute', top: 1070, right: 90}}><Strike size={50} /></div>
		<div style={{position: 'absolute', top: 1060, left: 70}}><CtaButton size={54} /></div>
		<Footer bg="#08142A" />
	</AbsoluteFill>
);

/** (remplace « la commande ») : paiement à la livraison */
const Cod: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF5E8 0%, #EFE2C6 100%)'}}>
		<Stars color={C.terracotta} opacity={0.08} />
		<Center top={40}>
			<T size={36} style={{background: '#111', padding: '2px 28px 8px', borderRadius: 999}}>{TITLE}</T>
		</Center>
		<T size={92} color="#111" style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', lineHeight: 1.15}}>
			اطلب توّا
			<br />
			<span style={{color: '#2F8F4E'}}>وخلّص كي يوصلك</span>
		</T>
		<Center top={360}>
			<Pack W={800} H={500} shadow="rgba(80,50,10,0.35)" />
		</Center>
		<Stamp top={330} left={40} size={250} />
		<Checks top={900} right={70} color="#111" items={['5 قطع في باك واحد', 'الخلاص عند الاستلام', 'توصيل لكامل ولايات تونس']} />
		<div style={{position: 'absolute', top: 1110, left: 60}}><CtaButton size={52} bg={RED} /></div>
		<div style={{position: 'absolute', top: 1165, right: 70}}><Strike size={40} color="#111" /></div>
		<Footer />
	</AbsoluteFill>
);

// ====================== 7 nouvelles ======================

/** Prix barré géant */
const PrixBarre: React.FC = () => (
	<AbsoluteFill style={{background: '#fff'}}>
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 70%, #FFE3E0 0%, #fff 60%)'}} />
		<Center top={44}>
			<T size={40} style={{background: RED, padding: '2px 34px 8px', borderRadius: 999}}>{TITLE}</T>
		</Center>
		<Center top={130} gap={40}>
			<div style={{position: 'relative'}}>
				<N style={{fontSize: 170, color: '#9A9A9A'}}>{O.oldPrice}</N>
				<div style={{position: 'absolute', left: -10, right: -10, top: '50%', height: 18, background: RED, transform: 'rotate(-10deg)', borderRadius: 9}} />
			</div>
			<T size={90} color="#9A9A9A">‹</T>
			<div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
				<N style={{fontSize: 230, color: RED, lineHeight: 1}}>{O.price}</N>
				<T size={70} color={RED}>د.ت</T>
			</div>
		</Center>
		<T size={50} color="#111" style={{position: 'absolute', top: 400, width: '100%', textAlign: 'center'}}>
			الباك الكامل، <N>5</N> قطع
		</T>
		<Center top={490}>
			<Pack W={860} H={540} shadow="rgba(0,0,0,0.25)" />
		</Center>
		<Center top={1080} gap={40}>
			<CtaButton size={58} bg={RED} />
			<T size={36} color="#333" weight={800}>
				أقل من <N>10</N> د.ت للقطعة
			</T>
		</Center>
		<Footer />
	</AbsoluteFill>
);

/** Focus sidr : on comprend tout de suite que c'est du sidr */
const SidrHero: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, #F3F7EA 0%, #DDE8C6 100%)'}}>
		<Stars color={C.sage} opacity={0.1} />
		<T size={110} color="#2E4A22" style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center'}}>سدر بيو</T>
		<T size={50} color="#111" style={{position: 'absolute', top: 182, width: '100%', textAlign: 'center'}}>
			وزيد معاه <N>4</N> قطع للشعر واللحية
		</T>
		<Center top={270}>
			<Prod k="sidr" w={760} h={520} />
		</Center>
		<Stamp top={300} left={40} size={240} bg="#2F8F4E" />
		<Center top={800} gap={22}>
			{(['derma', 'huile', 'applicateur', 'brosse'] as PKey[]).map((k) => (
				<div key={k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
					<div style={{width: 200, height: 200, borderRadius: '50%', background: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Prod k={k} w={150} h={160} />
					</div>
					<T size={26} color="#111" style={{whiteSpace: 'nowrap'}}>{byKey(k).name}</T>
				</div>
			))}
		</Center>
		<div style={{position: 'absolute', top: 1110, right: 70}}><Strike size={44} color="#111" /></div>
		<div style={{position: 'absolute', top: 1095, left: 60}}><CtaButton size={52} bg="#2F8F4E" /></div>
		<Footer />
	</AbsoluteFill>
);

/** Focus derma roller 540 */
const DermaHero: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(circle at 60% 40%, #3A2A3F 0%, #1A141D 60%, #0D0A0F 100%)'}}>
		<Rays color="#F4B6E0" opacity={0.08} cy="40%" />
		<T size={100} style={{position: 'absolute', top: 40, right: 60}}>
			ديرما رولر <N style={{color: '#FF6FB5'}}>540</N>
		</T>
		<T size={44} color="#E9D9F0" style={{position: 'absolute', top: 175, right: 60}}>مع زيت إكليل الجبل، في نفس الباك</T>
		<div style={{position: 'absolute', top: 250, left: 40, transform: 'rotate(-18deg)'}}>
			<Prod k="derma" w={420} h={760} />
		</div>
		<div dir="rtl" style={{position: 'absolute', top: 300, right: 60, display: 'flex', flexDirection: 'column', gap: 18}}>
			{(['huile', 'sidr', 'applicateur', 'brosse'] as PKey[]).map((k) => (
				<div key={k} style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '10px 18px', width: 470, boxSizing: 'border-box'}}>
					<div style={{width: 110, height: 110, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Prod k={k} w={90} h={96} />
					</div>
					<T size={34}>+ {byKey(k).name}</T>
				</div>
			))}
		</div>
		<Stamp top={900} left={60} size={240} bg="#E0428F" />
		<div style={{position: 'absolute', top: 960, right: 60}}><Strike size={46} /></div>
		<div style={{position: 'absolute', top: 1050, right: 60}}><CtaButton size={52} /></div>
		<Footer bg="#08060A" />
	</AbsoluteFill>
);

/** Comparatif : à la pièce vs le pack */
const Comparatif: React.FC = () => (
	<AbsoluteFill style={{background: '#F4F1EA'}}>
		<T size={80} color="#111" style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center'}}>علاش تشري بالقطعة؟</T>
		<T size={40} color="#555" style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center'}}>{TITLE}</T>
		<div dir="rtl" style={{position: 'absolute', top: 250, left: 50, right: 50, display: 'flex', gap: 30}}>
			{/* à la pièce */}
			<div style={{flex: 1, height: 760, background: '#fff', borderRadius: 30, border: '4px solid #E2E2E2', padding: 24, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<T size={44} color="#777">بالقطعة</T>
				<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 20, filter: 'grayscale(0.6)', opacity: 0.85}}>
					{P.map((p) => <Prod key={p.key} k={p.key} w={135} h={150} />)}
				</div>
				<div style={{marginTop: 'auto', position: 'relative'}}>
					<T size={80} color="#888"><N style={{fontSize: 90}}>{O.oldPrice}</N> د.ت</T>
					<div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 12, background: RED, transform: 'rotate(-8deg)', borderRadius: 6}} />
				</div>
			</div>
			{/* le pack */}
			<div style={{flex: 1, height: 760, background: '#1F3A28', borderRadius: 30, border: `6px solid ${C.gold}`, padding: 24, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.25)'}}>
				<T size={44} color={C.goldLight}>في الباك</T>
				<div style={{marginTop: 30}}>
					<Pack W={420} H={360} />
				</div>
				<div style={{marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: 10}}>
					<N style={{fontSize: 130, color: '#fff', lineHeight: 1}}>{O.price}</N>
					<T size={60}>د.ت</T>
				</div>
			</div>
		</div>
		<Center top={1060} gap={30}>
			<CtaButton size={58} bg={RED} />
			<T size={38} color="#111">وخلّص كي يوصلك</T>
		</Center>
		<Footer />
	</AbsoluteFill>
);

/** Le rituel en 4 étapes, côté vente */
const ETAPES: {k: PKey; t: string; s: string}[] = [
	{k: 'derma', t: 'الديرما رولر', s: 'بالشوية على راس نظيف'},
	{k: 'huile', t: 'زيت إكليل الجبل', s: 'بمشط الجذور، طول على العروق'},
	{k: 'brosse', t: 'ماساج', s: 'بفرشة التدليك، 3 لـ 5 دقايق'},
	{k: 'sidr', t: 'وقت الغسيل', s: 'سدر بيو وماء دافي'},
];
const Etapes: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, #FBF5E8 0%, #F1E5CC 100%)'}}>
		<T size={78} color="#111" style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center'}}>
			روتين ساهل في <span style={{color: RED}}><N>4</N> خطوات</span>
		</T>
		<T size={40} color="#555" style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center'}}>
			<N>2</N> ولا <N>3</N> مرات في الجمعة
		</T>
		<div dir="rtl" style={{position: 'absolute', top: 236, left: 50, right: 50, display: 'flex', flexDirection: 'column', gap: 16}}>
			{ETAPES.map((e, i) => (
				<div key={e.k} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 26, background: '#fff', borderRadius: 26, padding: '14px 26px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)'}}>
					<div style={{width: 140, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Prod k={e.k} w={140} h={128} />
					</div>
					<div>
						<T size={48} color="#111">{e.t}</T>
						<T size={32} color="#666" weight={700}>{e.s}</T>
					</div>
					<Badge n={i + 1} size={64} style={{top: -14, left: -14}} />
				</div>
			))}
		</div>
		<PriceBox top={1040} dark />
		<div style={{position: 'absolute', top: 1165, right: 70}}><Strike size={40} color="#111" /></div>
		<div style={{position: 'absolute', top: 1068, left: 54}}><CtaButton size={52} bg={RED} /></div>
		<Footer />
	</AbsoluteFill>
);

/** Cadeau pour un homme */
export const Bow: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
	<svg width={size} height={size * 0.62} viewBox="0 0 200 124" style={style}>
		<path d="M100 62 C60 0 0 10 10 50 C18 86 70 80 100 62 Z" fill="#C8202A" />
		<path d="M100 62 C140 0 200 10 190 50 C182 86 130 80 100 62 Z" fill="#C8202A" />
		<path d="M92 66 L60 124 L78 120 L96 70 Z M108 66 L140 124 L122 120 L104 70 Z" fill="#A5141D" />
		<circle cx="100" cy="62" r="16" fill="#E2343B" />
	</svg>
);
const Cadeau: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #FFF2EC 0%, #F7D3C4 70%, #EDB9A6 100%)'}}>
		<Stars color={C.terracotta} opacity={0.1} />
		<T size={96} color="#5A1A12" style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center'}}>فكرة هدية للراجل</T>
		<T size={46} color="#111" style={{position: 'absolute', top: 175, width: '100%', textAlign: 'center'}}>لبوك، لخوك ولا لراجلك</T>
		<Center top={270}>
			<div style={{position: 'relative'}}>
				<Pack W={820} H={540} shadow="rgba(90,26,18,0.35)" />
				<Bow size={220} style={{position: 'absolute', top: -60, left: 300, zIndex: 9, filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.25))'}} />
			</div>
		</Center>
		<T size={44} color="#111" style={{position: 'absolute', top: 850, width: '100%', textAlign: 'center'}}>
			روتين كامل للشعر واللحية، <N>5</N> قطع
		</T>
		<PriceBox top={940} dark right={60} />
		<div style={{position: 'absolute', top: 1062, right: 76}}><Strike size={40} color="#111" /></div>
		<div style={{position: 'absolute', top: 1120, left: 60}}><CtaButton size={52} bg={RED} /></div>
		<Footer />
	</AbsoluteFill>
);

/** Black Friday */
const BlackFriday: React.FC = () => (
	<AbsoluteFill style={{background: '#0B0B0B'}}>
		<Rays color="#FFD43B" opacity={0.08} cy="55%" />
		<Center top={40}>
			<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 132, color: YELLOW, letterSpacing: 2, lineHeight: 1}}>BLACK</span>
		</Center>
		<Center top={170}>
			<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 132, color: '#fff', letterSpacing: 2, lineHeight: 1, WebkitTextStroke: '0px'}}>FRIDAY</span>
		</Center>
		<T size={46} style={{position: 'absolute', top: 320, width: '100%', textAlign: 'center'}}>{TITLE}</T>
		<Center top={400}>
			<Pack W={820} H={520} shadow="rgba(255,212,59,0.18)" />
		</Center>
		<div style={{position: 'absolute', top: 400, left: 40, width: 220, height: 220, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)', boxShadow: '0 12px 30px rgba(0,0,0,0.5)', zIndex: 5}}>
			<N style={{fontSize: 84, color: '#fff'}}>-55%</N>
		</div>
		<div dir="rtl" style={{position: 'absolute', top: 960, left: 60, right: 60, background: YELLOW, borderRadius: 28, padding: '10px 30px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
			<T size={58} color="#111">الباك كامل بـ</T>
			<T size={100} color="#111"><N style={{fontSize: 110}}>{O.price}</N> د.ت</T>
		</div>
		<div style={{position: 'absolute', top: 1130, right: 70}}><Strike size={44} /></div>
		<div style={{position: 'absolute', top: 1110, left: 60}}><CtaButton size={52} bg={YELLOW} color="#111" /></div>
		<Footer bg="#000" accent={YELLOW} />
	</AbsoluteFill>
);

const MAP: Record<V3Layout, React.FC> = {
	exception: Exception,
	calcul: Calcul,
	toutCa: ToutCa,
	hiver: Hiver,
	cod: Cod,
	prixBarre: PrixBarre,
	sidr: SidrHero,
	derma: DermaHero,
	comparatif: Comparatif,
	etapes: Etapes,
	cadeau: Cadeau,
	blackFriday: BlackFriday,
};

export const V3Still: React.FC<{spec: V3Spec}> = ({spec}) => {
	const L = MAP[spec.layout];
	return <L />;
};

export const V3_STILLS: V3Spec[] = [
	{id: 'W3-R1-exception-4x5', layout: 'exception'},
	{id: 'W3-R2-calcul-4x5', layout: 'calcul'},
	{id: 'W3-R3-toutca-4x5', layout: 'toutCa'},
	{id: 'W3-R4-hiver-4x5', layout: 'hiver'},
	{id: 'W3-R5-cod-4x5', layout: 'cod'},
	{id: 'W3-N1-prixbarre-4x5', layout: 'prixBarre'},
	{id: 'W3-N2-sidr-4x5', layout: 'sidr'},
	{id: 'W3-N3-derma-4x5', layout: 'derma'},
	{id: 'W3-N4-comparatif-4x5', layout: 'comparatif'},
	{id: 'W3-N5-etapes-4x5', layout: 'etapes'},
	{id: 'W3-N6-cadeau-4x5', layout: 'cadeau'},
	{id: 'W3-N7-blackfriday-4x5', layout: 'blackFriday'},
];
