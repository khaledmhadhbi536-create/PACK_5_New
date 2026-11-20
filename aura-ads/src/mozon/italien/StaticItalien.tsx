import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {F} from '../../theme/brand';
import {Icon} from '../Mozon';
import {M} from '../themeMozon';

/**
 * Al Mozon Academy · image fixe « cours d'italien » (4:5 et 9:16).
 * Angle demandé : la villa (vraies images du centre, vidéo Drive « Villa italien »), l'en ligne, 3 mois.
 * Skill ad-creative : une idée par zone (accroche, deux façons d'apprendre, preuve, appel à l'action).
 * Pas d'offre (test gratuit / remise) tant qu'elle n'est pas confirmée pour l'italien.
 * En 9:16, rien d'important dans les 270 px du haut ni les 380 px du bas.
 */

type Fmt = '4x5' | '9x16';
const SIZE: Record<Fmt, {W: number; H: number; top: number; bot: number}> = {
	'4x5': {W: 1080, H: 1350, top: 60, bot: 50},
	'9x16': {W: 1080, H: 1920, top: 270, bot: 380},
};
const IT = {green: '#009246', red: '#CE2B37'};
const villa = (t: string) => staticFile(`mozon/italien/villa_${t}.jpg`);

const Flag: React.FC<{w: number}> = ({w}) => (
	<div style={{display: 'flex', width: w, height: w * 0.12, borderRadius: 6, overflow: 'hidden', boxShadow: '0 6px 16px rgba(0,0,0,0.3)'}}>
		<div style={{flex: 1, background: IT.green}} />
		<div style={{flex: 1, background: M.white}} />
		<div style={{flex: 1, background: IT.red}} />
	</div>
);

const Laptop: React.FC<{size: number; color: string}> = ({size, color}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={18} y={22} width={64} height={44} rx={6} fill="none" stroke={color} strokeWidth={8} />
		<path d="M8 78 H92 L84 70 H16 Z" fill={color} />
	</svg>
);

const Way: React.FC<{icon: React.ReactNode; title: string; sub: string; photo?: string}> = ({icon, title, sub, photo}) => (
	<div style={{flex: 1, background: M.white, borderRadius: 28, overflow: 'hidden', boxShadow: '0 14px 30px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column'}}>
		{photo ? (
			<Img src={photo} style={{width: '100%', height: 150, objectFit: 'cover', objectPosition: '30% 14%'}} />
		) : (
			<div style={{height: 150, background: `linear-gradient(135deg, ${M.orange}, ${M.orangeDeep})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
		)}
		<div style={{padding: '16px 20px 20px'}}>
			<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: 40, color: M.ink}}>{title}</div>
			<div style={{fontFamily: F.latin, fontWeight: 600, fontSize: 28, color: '#5a5048', marginTop: 4, lineHeight: 1.2}}>{sub}</div>
		</div>
	</div>
);

const ItalienStatic: React.FC<{fmt: Fmt}> = ({fmt}) => {
	const {W, H, top, bot} = SIZE[fmt];
	const v = fmt === '9x16';
	return (
		<AbsoluteFill style={{background: M.ink}}>
			<Img src={villa('8.0')} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', objectPosition: v ? '50% 50%' : '50% 40%'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,8,6,0.78) 0%, rgba(10,8,6,0.25) 38%, rgba(10,8,6,0.15) 52%, rgba(10,8,6,0.85) 78%, rgba(10,8,6,0.95) 100%)'}} />
			<div style={{position: 'absolute', left: 54, right: 54, top, bottom: bot, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
					<Flag w={180} />
					<div dir="rtl" style={{fontFamily: F.display, fontSize: v ? 108 : 98, lineHeight: 1.05, color: M.white, textShadow: '0 6px 24px rgba(0,0,0,0.5)'}}>تحب تحكي الطلياني؟</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
						<div style={{background: M.orange, color: M.white, fontFamily: F.latin, fontWeight: 900, fontSize: v ? 76 : 68, padding: '4px 30px 10px', borderRadius: 18, transform: 'rotate(-2deg)', boxShadow: `0 0 40px ${M.glow}`}}>3 mois</div>
						<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: v ? 50 : 44, color: M.white, textShadow: '0 4px 16px rgba(0,0,0,0.6)'}}>de formation certifiée</div>
					</div>
				</div>
				<div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: v ? 26 : 18, alignItems: 'center'}}>
					<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: 40, color: M.white, textShadow: '0 4px 14px rgba(0,0,0,0.6)'}}>Choisis ta façon d'apprendre</div>
					<div style={{display: 'flex', gap: 22, width: '100%'}}>
						<Way icon={<Laptop size={110} color={M.white} />} title="En ligne" sub="Depuis chez toi, partout en Tunisie" />
						<Way photo={villa('1.0')} icon={null} title="Dans notre villa" sub="En présentiel à Radès" />
					</div>
					<div style={{display: 'flex', gap: 14}}>
						{['Cours du soir', 'Week-end', 'Profs spécialisés'].map((t) => (
							<div key={t} style={{display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.14)', border: '2px solid rgba(255,255,255,0.35)', color: M.white, fontFamily: F.latin, fontWeight: 700, fontSize: 28, padding: '8px 18px', borderRadius: 999}}>
								<Icon k="check" size={26} color={M.orange} />
								{t}
							</div>
						))}
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
						<Img src={staticFile('mozon/logo_blanc.png')} style={{width: 150}} />
						<div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#25D366', color: M.white, borderRadius: 999, padding: '12px 38px 14px 26px', boxShadow: '0 14px 30px rgba(0,0,0,0.35)'}}>
							<Icon k="wa" size={58} color={M.white} />
							<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 62, letterSpacing: 1}}>99 008 008</span>
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const ITALIEN_STATICS = (['4x5', '9x16'] as Fmt[]).map((fmt) => ({id: `MZIT-S1-villa-enligne-${fmt}`, fmt, ...SIZE[fmt]}));
export const ItalienStaticComp: React.FC<{id: string}> = ({id}) => <ItalienStatic fmt={ITALIEN_STATICS.find((s) => s.id === id)!.fmt} />;
