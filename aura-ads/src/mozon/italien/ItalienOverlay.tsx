import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {F} from '../../theme/brand';
import {Icon} from '../Mozon';
import {M} from '../themeMozon';

/**
 * Al Mozon · vidéo « Italien » (présentatrice) : l'ancien numéro (29 66 38 46) est coupé au montage (ffmpeg).
 * Ces images transparentes ajoutent le nouveau numéro WhatsApp 99 008 008 :
 *  - MZI-pill : pastille WhatsApp en bas de l'image, posée sur la fin de la vidéo ;
 *  - MZI-end  : écran de fin (logo + « ابعثلنا message » + 99 008 008), à la place de l'écran noir.
 */

const Pill: React.FC<{size?: number}> = ({size = 70}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#25D366', color: M.white, borderRadius: 999, padding: '14px 44px 16px 30px', boxShadow: '0 14px 30px rgba(0,0,0,0.35)', border: `5px solid ${M.white}`}}>
		<Icon k="wa" size={size * 0.9} color={M.white} />
		<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: size, letterSpacing: 1}}>99 008 008</span>
	</div>
);

export const ItalienPill: React.FC = () => (
	<AbsoluteFill style={{background: 'transparent'}}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
			<Pill />
		</div>
	</AbsoluteFill>
);

export const ItalienEnd: React.FC = () => (
	<AbsoluteFill style={{background: M.cream, alignItems: 'center', justifyContent: 'center'}}>
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 46}}>
			<Img src={staticFile('mozon/logo.png')} style={{width: 460}} />
			<div dir="rtl" style={{fontFamily: F.display, fontSize: 110, color: M.ink}}>ابعثلنا message</div>
			<Pill size={92} />
			<div style={{fontFamily: F.latin, fontWeight: 700, fontSize: 46, color: M.ink}}>
				Cours d'italien · <span style={{color: M.orangeDeep}}>Radès</span>
			</div>
		</div>
	</AbsoluteFill>
);

/** Texte jaune (même style que les sous-titres de la vidéo d'origine), remis par-dessus les plans de coupe. */
const Cap: React.FC<{text: string}> = ({text}) => (
	<AbsoluteFill style={{background: 'transparent'}}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 1395, display: 'flex', justifyContent: 'center'}}>
			<div style={{fontFamily: F.latin, fontWeight: 900, fontSize: 66, color: '#FFE81A', textTransform: 'uppercase', letterSpacing: 1, WebkitTextStroke: '3px #1a1a1a', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,0.55)'}}>{text}</div>
		</div>
	</AbsoluteFill>
);
const CAPS: Record<string, string> = {certifiee: 'Formation certifiée', soir: 'Cours du soir', weekend: 'Et les week-ends', presentiel: 'Présentiel'};

export const ITALIEN_STILLS = [
	...Object.entries(CAPS).map(([k, t]) => ({id: `MZI-cap-${k}`, C: () => <Cap text={t} />})),
	{id: 'MZI-pill', C: ItalienPill},
	{id: 'MZI-end', C: ItalienEnd},
];
