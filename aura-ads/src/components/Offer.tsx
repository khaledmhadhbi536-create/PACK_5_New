import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COPY} from '../data/copy';
import {OFFER} from '../data/product';
import {C, F} from '../theme/brand';
import {ArabicText} from './ArabicText';
import {IconCash, IconInsta, IconPhone, IconTruck} from './Icons';

const usePop = (delay: number, damping = 11) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping, stiffness: 140}});
};

/** Badge prix rond façon sticker : « 49 دينار ». */
export const PriceBadge: React.FC<{
	size?: number;
	delay?: number;
	bg?: string;
	color?: string;
	ring?: string;
	label?: string;
	style?: React.CSSProperties;
}> = ({size = 300, delay = 0, bg = C.terracotta, color = C.cream, ring = C.gold, label = 'الباك الكامل', style}) => {
	const frame = useCurrentFrame();
	const s = usePop(delay, 9);
	const wobble = Math.sin(frame / 9) * 2;
	const teeth = 22;
	const pts = Array.from({length: teeth * 2}, (_, i) => {
		const a = (Math.PI / teeth) * i;
		const r = i % 2 === 0 ? 50 : 46.5;
		return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
	}).join(' ');
	return (
		<div
			style={{
				position: 'relative',
				width: size,
				height: size,
				scale: String(s),
				rotate: `${-10 + wobble + (1 - s) * -40}deg`,
				...style,
			}}
		>
			<svg viewBox="0 0 100 100" width={size} height={size} style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.35))'}}>
				<polygon points={pts} fill={bg} />
				<circle cx="50" cy="50" r="41" fill="none" stroke={ring} strokeWidth="1.4" strokeDasharray="2 2.2" />
			</svg>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					color,
					lineHeight: 1,
				}}
			>
				<div dir="rtl" style={{fontFamily: F.body, fontWeight: 800, fontSize: size * 0.1, marginBottom: size * 0.01}}>
					{label}
				</div>
				<div style={{fontFamily: F.latin, fontWeight: 800, fontSize: size * 0.36, letterSpacing: -size * 0.01}}>
					{OFFER.price}
				</div>
				<div dir="rtl" style={{fontFamily: F.display, fontSize: size * 0.15, marginTop: size * 0.005, color: ring}}>
					{OFFER.currencyAr}
				</div>
			</div>
		</div>
	);
};

/** Ligne de réassurance : paiement à la livraison + livraison partout. */
export const TrustRow: React.FC<{
	color?: string;
	iconBg?: string;
	size?: number;
	delay?: number;
	stacked?: boolean;
}> = ({color = C.cream, iconBg = 'rgba(255,255,255,0.14)', size = 34, delay = 0, stacked = false}) => {
	const frame = useCurrentFrame();
	const items = [
		{icon: IconCash, text: COPY.cod},
		{
			icon: IconTruck,
			text: OFFER.deliveryFee == null ? COPY.delivery : `${COPY.delivery} (${OFFER.deliveryFee} DT)`,
		},
	];
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: stacked ? 'column' : 'row',
				gap: size * 0.8,
				alignItems: 'center',
				justifyContent: 'center',
				flexWrap: 'wrap',
			}}
			dir="rtl"
		>
			{items.map((it, i) => {
				const p = interpolate(frame, [delay + i * 6, delay + i * 6 + 12], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const Ico = it.icon;
				return (
					<div
						key={i}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: size * 0.35,
							opacity: p,
							translate: `0 ${(1 - p) * 20}px`,
						}}
					>
						<div
							style={{
								width: size * 1.6,
								height: size * 1.6,
								borderRadius: '50%',
								background: iconBg,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Ico size={size * 1.05} color={color} />
						</div>
						<span style={{fontFamily: F.body, fontWeight: 800, fontSize: size, color, whiteSpace: 'nowrap'}}>{it.text}</span>
					</div>
				);
			})}
		</div>
	);
};

/** Bouton d'appel : téléphone + « كوموندي توّا ». */
export const PhonePill: React.FC<{
	size?: number;
	delay?: number;
	bg?: string;
	color?: string;
	label?: string;
	pulse?: boolean;
}> = ({size = 64, delay = 0, bg = C.gold, color = C.forestDeep, label = COPY.order, pulse = true}) => {
	const frame = useCurrentFrame();
	const s = usePop(delay, 12);
	const beat = pulse ? 1 + Math.max(0, Math.sin((frame - delay) / 6)) * 0.025 : 1;
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: size * 0.18,
				scale: String(s * beat),
			}}
		>
			<div
				dir="rtl"
				style={{fontFamily: F.display, fontSize: size * 0.82, color: bg, lineHeight: 1.1, textShadow: '0 4px 18px rgba(0,0,0,0.25)'}}
			>
				{label}
			</div>
			<div
				dir="ltr"
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: size * 0.3,
					background: bg,
					color,
					borderRadius: size,
					padding: `${size * 0.2}px ${size * 0.55}px`,
					boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
				}}
			>
				<IconPhone size={size * 0.8} color={color} />
				<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: size, letterSpacing: size * 0.02}}>{OFFER.phone}</span>
			</div>
		</div>
	);
};

export const InstaHandle: React.FC<{color?: string; size?: number}> = ({color = C.cream, size = 30}) => (
	<div dir="ltr" style={{display: 'flex', alignItems: 'center', gap: size * 0.35, color, opacity: 0.9}}>
		<IconInsta size={size} color={color} />
		<span style={{fontFamily: F.latin, fontWeight: 700, fontSize: size}}>{OFFER.instagram}</span>
	</div>
);

/** Petite étiquette inclinée (« جديد », « 5 في 1 »…). */
export const Sticker: React.FC<{
	text: string;
	size?: number;
	bg?: string;
	color?: string;
	rotate?: number;
	delay?: number;
	font?: string;
}> = ({text, size = 44, bg = C.gold, color = C.forestDeep, rotate = -6, delay = 0, font = F.display}) => {
	const s = usePop(delay, 10);
	return (
		<div
			dir="rtl"
			style={{
				display: 'inline-block',
				background: bg,
				color,
				fontFamily: font,
				fontWeight: 800,
				fontSize: size,
				lineHeight: 1.25,
				padding: `${size * 0.16}px ${size * 0.5}px`,
				borderRadius: size * 0.3,
				rotate: `${rotate}deg`,
				scale: String(s),
				boxShadow: '0 10px 24px rgba(0,0,0,0.22)',
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** Pastille numérotée d'étape. */
export const StepBadge: React.FC<{n: number; size?: number; bg?: string; color?: string; delay?: number}> = ({
	n,
	size = 84,
	bg = C.gold,
	color = C.forestDeep,
	delay = 0,
}) => {
	const s = usePop(delay, 10);
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				background: bg,
				color,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: F.latin,
				fontWeight: 800,
				fontSize: size * 0.52,
				scale: String(s),
				boxShadow: '0 10px 24px rgba(0,0,0,0.3)',
				flexShrink: 0,
			}}
		>
			{n}
		</div>
	);
};

/** Sous-titre en pastille (style Reels) — pour les textes posés sur une vidéo. */
export const CaptionPill: React.FC<{
	text: string;
	size?: number;
	delay?: number;
	mode?: 'pill' | 'shadow';
	bg?: string;
	color?: string;
	accent?: string;
	maxWidth?: number;
}> = ({text, size = 58, delay = 0, mode = 'pill', bg = 'rgba(255,255,255,0.96)', color = C.ink, accent = C.terracotta, maxWidth = 900}) => {
	const s = usePop(delay, 14);
	if (mode === 'shadow') {
		return (
			<div style={{scale: String(0.9 + 0.1 * s), opacity: s}}>
				<ArabicText
					text={text}
					size={size}
					color={C.white}
					accent={C.goldLight}
					weight={900}
					delay={delay}
					stagger={2}
					maxWidth={maxWidth}
					shadow="0 4px 0 rgba(0,0,0,0.55), 0 0 28px rgba(0,0,0,0.65)"
				/>
			</div>
		);
	}
	return (
		<div
			style={{
				background: bg,
				borderRadius: size * 0.42,
				padding: `${size * 0.16}px ${size * 0.5}px ${size * 0.24}px`,
				boxShadow: '0 14px 34px rgba(0,0,0,0.28)',
				scale: String(0.85 + 0.15 * s),
				opacity: s,
				maxWidth,
			}}
		>
			<ArabicText text={text} size={size} color={color} accent={accent} weight={900} delay={delay} stagger={2} />
		</div>
	);
};
