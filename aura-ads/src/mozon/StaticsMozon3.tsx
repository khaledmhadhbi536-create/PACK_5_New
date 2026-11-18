import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {F} from '../theme/brand';
import {CITIES, COAST, Icon, IconK, MAPH, MAPW, px, py} from './Mozon';
import {M} from './themeMozon';

/**
 * V3 · S4 « carte + profils » = combinaison de S1 (grille des profils) et S3 (carte locale).
 * Reprend les aides de la V2 (même charte, « رادس »).
 * Ancien en-tête V2 : (autres photos, « رادس ») · Al Mozon Academy · 3 images fixes (Meta), chacune en 4:5 (fil) et 9:16 (Stories/Reels).
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
const pic = (t: string) => staticFile(`mozon/static/${t}.jpg`);
const RADES_AR = 'رادس';

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
						<text x={c.dx} y={c.dy} textAnchor="middle" fontFamily={F.body} fontWeight={900} fontSize={r ? 54 : 36} fill={r ? M.orangeDeep : M.ink} stroke={M.land} strokeWidth={8} paintOrder="stroke">{r ? RADES_AR : c.n}</text>
					</g>
				);
			})}
		</svg>
	);
};


const TILES = [
	{t: 'v1_32.6', l: 'Ausbildung', lvl: 'B1', pos: '50% 60%'},
	{t: 'v1_14.6', l: 'Santé', lvl: 'B2', pos: '50% 78%'},
	{t: 'v1_31.8', l: 'Études', lvl: 'B2', pos: '50% 55%'},
	{t: 'v1_2.0', l: 'Famille', lvl: 'A1', pos: '50% 50%'},
];

/** S4 : « تسكن في بن عروس؟ » + carte (Radès en orange) + 4 profils avec leur niveau + offre. */
const S4: React.FC<{fmt: Fmt}> = ({fmt}) => {
	const {W, top, bot} = SIZE[fmt];
	const v = fmt === '9x16';
	const side = 44;
	const mw = W - 2 * side;
	const gap = 12;
	const tw = (mw - 3 * gap) / 4;
	const th = v ? 250 : 220;
	return (
		<AbsoluteFill style={{background: M.cream}}>
			<div style={{position: 'absolute', left: side, right: side, top, bottom: bot, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{textAlign: 'center'}}>
					<div dir="rtl" style={{fontFamily: F.display, fontSize: 104, lineHeight: 1.05, color: M.ink}}>تسكن في بن عروس؟</div>
					<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: 46, color: M.ink, marginTop: 4}}>
						L'allemand <span style={{color: M.orangeDeep}}>à Radès</span>, pour ton projet
					</div>
				</div>
				<div style={{position: 'relative', width: mw, height: (mw * MAPH) / MAPW}}>
					<Map w={mw} />
					<div style={{position: 'absolute', left: 18, top: 16, background: M.white, borderRadius: 18, padding: '8px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.12)'}}>
						<Logo w={120} />
					</div>
				</div>
				<div style={{display: 'flex', gap}}>
					{TILES.map((x) => (
						<div key={x.l} style={{position: 'relative', width: tw, height: th, borderRadius: 22, overflow: 'hidden', boxShadow: '0 10px 24px rgba(0,0,0,0.16)'}}>
							<Img src={pic(x.t)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: x.pos}} />
							<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.78) 100%)'}} />
							<div style={{position: 'absolute', top: 10, right: 10, width: 74, height: 74, borderRadius: 999, background: M.orange, border: `4px solid ${M.white}`, color: M.white, fontFamily: F.latin, fontWeight: 800, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{x.lvl}</div>
							<div style={{position: 'absolute', left: 12, right: 8, bottom: 12, fontFamily: F.latin, fontWeight: 800, fontSize: 32, lineHeight: 1.05, color: M.white}}>{x.l}</div>
						</div>
					))}
				</div>
				<Offer />
			</div>
		</AbsoluteFill>
	);
};

export const MOZON_STATICS3 = (['4x5', '9x16'] as Fmt[]).map((fmt) => ({id: `MZS3-S4-carte-profils-${fmt}`, fmt, ...SIZE[fmt]}));
export const MozonStatic3: React.FC<{id: string}> = ({id}) => <S4 fmt={MOZON_STATICS3.find((x) => x.id === id)!.fmt} />;
