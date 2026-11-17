import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {F} from '../theme/brand';
import {CITIES, COAST, Icon, IconK, MAPH, MAPW, px, py} from './Mozon';
import {M} from './themeMozon';

/**
 * Al Mozon Academy · 3 images fixes (Meta), chacune en 4:5 (fil) et 9:16 (Stories/Reels).
 * Skill ad-creative : 3 modèles différents, un angle chacun.
 *  S1 « grille » (tier A) : chaque profil trouve son niveau (Ausbildung B1, santé B2, études B2, regroupement A1).
 *  S2 « photo + preuves » : une vraie classe du centre, petits groupes, ce qu'on y trouve.
 *  S3 « local » : la carte de Ben Arous, Radès en orange (même angle que les vidéos « tout le monde »).
 * Offre identique partout : test de niveau gratuit + remise de 25 %, WhatsApp 99 008 008.
 * En 9:16, rien d'important dans les 270 px du haut ni les 380 px du bas (zones couvertes par l'interface).
 */

type Fmt = '4x5' | '9x16';
const SIZE: Record<Fmt, {W: number; H: number; top: number; bot: number}> = {
	'4x5': {W: 1080, H: 1350, top: 64, bot: 56},
	'9x16': {W: 1080, H: 1920, top: 270, bot: 380},
};
const pic = (t: string) => staticFile(`mozon/static/v2_${t}.jpg`);

const Logo: React.FC<{w: number; white?: boolean}> = ({w, white}) => <Img src={staticFile(white ? 'mozon/logo_blanc.png' : 'mozon/logo.png')} style={{width: w}} />;

/** Bloc final commun : offre + WhatsApp. */
const Offer: React.FC<{dark?: boolean}> = ({dark}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
		<div style={{display: 'flex', gap: 14}}>
			<Pill text="Test de niveau gratuit" bg={dark ? M.white : M.ink} color={dark ? M.ink : M.white} />
			<Pill text="Remise -25 %" bg={M.orange} color={M.white} />
		</div>
		<div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#25D366', color: M.white, borderRadius: 999, padding: '14px 44px 16px 30px', boxShadow: '0 14px 30px rgba(0,0,0,0.25)'}}>
			<Icon k="wa" size={64} color={M.white} />
			<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 70, letterSpacing: 1}}>99 008 008</span>
		</div>
	</div>
);

const Pill: React.FC<{text: string; bg: string; color: string; size?: number}> = ({text, bg, color, size = 38}) => (
	<div style={{background: bg, color, fontFamily: F.latin, fontWeight: 800, fontSize: size, padding: `${size * 0.28}px ${size * 0.62}px`, borderRadius: 999, whiteSpace: 'nowrap'}}>{text}</div>
);

const Check: React.FC<{icon: IconK; text: string; size?: number}> = ({icon, text, size = 42}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 20, fontFamily: F.latin, fontWeight: 700, fontSize: size, color: M.ink}}>
		<div style={{width: size * 1.5, height: size * 1.5, borderRadius: 999, background: M.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
			<Icon k={icon} size={size} color={M.white} />
		</div>
		{text}
	</div>
);

// ---------------------------------------------------------------- S1 · grille des profils

const TILES = [
	{t: '24.0', l: 'Ausbildung', lvl: 'B1'},
	{t: '21.0', l: 'Diplôme de santé', lvl: 'B2'},
	{t: '29.6', l: 'Études', lvl: 'B2'},
	{t: '12.0', l: 'Regroupement familial', lvl: 'A1'},
];

const S1: React.FC<{fmt: Fmt}> = ({fmt}) => {
	const {W, H, top, bot} = SIZE[fmt];
	const v = fmt === '9x16';
	const gap = 18;
	const tw = (W - 2 * 56 - gap) / 2;
	const th = v ? 420 : 330;
	return (
		<AbsoluteFill style={{background: M.cream}}>
			<div style={{position: 'absolute', left: 56, right: 56, top: top, bottom: bot, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{textAlign: 'center'}}>
					<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: 76, lineHeight: 1.05, color: M.ink}}>Ton projet en Allemagne</div>
					<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: 76, lineHeight: 1.1, color: M.orange}}>Quel niveau ?</div>
				</div>
				<div style={{display: 'grid', gridTemplateColumns: `${tw}px ${tw}px`, gap}}>
					{TILES.map((x) => (
						<div key={x.l} style={{position: 'relative', width: tw, height: th, borderRadius: 28, overflow: 'hidden', boxShadow: '0 14px 30px rgba(0,0,0,0.18)'}}>
							<Img src={pic(x.t)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
							<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)'}} />
							<div style={{position: 'absolute', top: 18, right: 18, width: 104, height: 104, borderRadius: 999, background: M.orange, border: `5px solid ${M.white}`, color: M.white, fontFamily: F.latin, fontWeight: 800, fontSize: 46, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{x.lvl}</div>
							<div style={{position: 'absolute', left: 22, right: 22, bottom: 20, fontFamily: F.latin, fontWeight: 800, fontSize: x.l.length > 16 ? 36 : 42, lineHeight: 1.1, color: M.white}}>{x.l}</div>
						</div>
					))}
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
					<Logo w={110} />
					<div style={{fontFamily: F.latin, fontWeight: 700, fontSize: 38, color: M.ink, lineHeight: 1.25}}>
						Al Mozon Academy, <span style={{color: M.orangeDeep}}>à Radès</span>
						<br />
						Allemand de A1 jusqu'à B2
					</div>
				</div>
				<Offer />
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S2 · une vraie classe

const S2: React.FC<{fmt: Fmt}> = ({fmt}) => {
	const {W, H, top, bot} = SIZE[fmt];
	const v = fmt === '9x16';
	const photoH = v ? 1000 : 760;
	return (
		<AbsoluteFill style={{background: M.cream}}>
			<Img src={pic('30.4')} style={{position: 'absolute', left: 0, top: 0, width: W, height: photoH + (v ? 0 : 0), objectFit: 'cover', objectPosition: v ? '50% 45%' : '50% 27%'}} />
			<div style={{position: 'absolute', left: 0, top: 0, width: W, height: photoH, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 75%, rgba(255,246,238,1) 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: top, textAlign: 'center'}}>
				<div dir="rtl" style={{fontFamily: F.display, fontSize: 96, lineHeight: 1.15, color: M.white, textShadow: '0 6px 24px rgba(0,0,0,0.5)'}}>قرايتك للألماني في راداس</div>
				<div style={{display: 'inline-block', marginTop: 10, background: M.orange, color: M.white, fontFamily: F.latin, fontWeight: 800, fontSize: 50, padding: '6px 28px 10px', borderRadius: 14, transform: 'rotate(-2deg)'}}>en petits groupes</div>
			</div>
			<div style={{position: 'absolute', left: 64, right: 64, top: photoH - (v ? 60 : 40), bottom: bot, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: v ? 26 : 20}}>
					<Check icon="people" text="Profs qualifiés et expérimentés" />
					<Check icon="cal" text="En journée, le soir ou le week-end" />
					<Check icon="check" text="Préparation Goethe, ÖSD et telc" />
				</div>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: v ? 34 : 22}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
						<Logo w={120} />
						<div style={{fontFamily: F.latin, fontWeight: 700, fontSize: 38, color: M.ink, lineHeight: 1.25}}>
							Al Mozon Academy, <span style={{color: M.orangeDeep}}>à Radès</span>
							<br />
							Allemand de A1 jusqu'à B2
						</div>
					</div>
					<Offer />
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- S3 · la carte de Ben Arous

const Map: React.FC<{w: number}> = ({w}) => {
	const h = (w * MAPH) / MAPW;
	return (
		<svg width={w} height={h} viewBox={`0 0 ${MAPW} ${MAPH}`} style={{overflow: 'hidden', borderRadius: 36, background: M.land, boxShadow: `inset 0 0 0 4px ${M.landEdge}`}}>
			<polygon points={COAST.map(([lo, la]) => `${px(lo)},${py(la)}`).join(' ')} fill={M.sea} stroke={M.white} strokeWidth={6} />
			<text x={px(10.372)} y={py(36.765)} textAnchor="middle" fontFamily={F.body} fontWeight={700} fontSize={30} fill="#8FAABA">البحر</text>
			{CITIES.slice(1).map((c, i) => (
				<line key={i} x1={px(CITIES[0].lon)} y1={py(CITIES[0].lat)} x2={px(c.lon)} y2={py(c.lat)} stroke={M.landEdge} strokeWidth={5} strokeDasharray="10 10" />
			))}
			{CITIES.map((c, i) => {
				const r = i === 0;
				return (
					<g key={i} transform={`translate(${px(c.lon)} ${py(c.lat)})`}>
						{r ? <circle r={40} fill={M.glow} /> : null}
						<circle r={r ? 20 : 13} fill={r ? M.orange : M.ink} stroke={M.white} strokeWidth={4} />
						<text x={c.dx} y={c.dy} textAnchor="middle" fontFamily={F.body} fontWeight={900} fontSize={r ? 54 : 36} fill={r ? M.orangeDeep : M.ink} stroke={M.land} strokeWidth={8} paintOrder="stroke">{c.n}</text>
					</g>
				);
			})}
		</svg>
	);
};

const S3: React.FC<{fmt: Fmt}> = ({fmt}) => {
	const {W, top, bot} = SIZE[fmt];
	const v = fmt === '9x16';
	const mw = v ? 980 : 900;
	return (
		<AbsoluteFill style={{background: M.cream}}>
			<div style={{position: 'absolute', left: 50, right: 50, top, bottom: bot, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{textAlign: 'center'}}>
					<div dir="rtl" style={{fontFamily: F.display, fontSize: 118, lineHeight: 1.1, color: M.ink}}>تسكن في بن عروس؟</div>
					<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: 54, color: M.ink, marginTop: 6}}>
						Cours d'allemand <span style={{color: M.orangeDeep}}>à Radès</span>
					</div>
				</div>
				<div style={{position: 'relative', width: mw, height: (mw * MAPH) / MAPW}}>
					<Map w={mw} />
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 28, background: M.white, borderRadius: 32, padding: '22px 32px', boxShadow: '0 14px 30px rgba(0,0,0,0.12)'}}>
					<Img src={pic('0.6')} style={{width: 150, height: 150, borderRadius: 999, objectFit: 'cover', objectPosition: '45% 30%', border: `5px solid ${M.orange}`}} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
						<Logo w={170} />
						<div style={{fontFamily: F.latin, fontWeight: 700, fontSize: 34, color: M.ink}}>De A1 jusqu'à B2 · petits groupes</div>
					</div>
				</div>
				<Offer />
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- compositions

const KINDS = {grille: S1, classe: S2, carte: S3};
export const MOZON_STATICS = (Object.keys(KINDS) as (keyof typeof KINDS)[]).flatMap((k, i) =>
	(['4x5', '9x16'] as Fmt[]).map((fmt) => ({id: `MZS-S${i + 1}-${k}-${fmt}`, k, fmt, ...SIZE[fmt]})),
);
export const MozonStatic: React.FC<{id: string}> = ({id}) => {
	const s = MOZON_STATICS.find((x) => x.id === id)!;
	const C = KINDS[s.k];
	return <C fmt={s.fmt} />;
};
