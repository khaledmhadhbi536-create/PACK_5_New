import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PRODUCTS, ProductKey} from '../data/product';
import {C, F} from '../theme/brand';

/**
 * Flacon d'huile de romarin dessiné (aucune photo fournie).
 * Remplaçable : mettre une photo détourée dans public/products/huile.png
 * et renseigner `image` dans src/data/product.ts.
 */
export const OilBottle: React.FC<{height: number; style?: React.CSSProperties; labelAr?: string}> = ({
	height,
	style,
	labelAr = 'زيت الروماران',
}) => {
	const w = (height * 200) / 470;
	return (
		<svg width={w} height={height} viewBox="0 0 200 470" style={{display: 'block', overflow: 'visible', ...style}}>
			<defs>
				<linearGradient id="glass" x1="0" x2="1">
					<stop offset="0" stopColor="#5A2A08" />
					<stop offset="0.18" stopColor="#9A4F12" />
					<stop offset="0.45" stopColor="#C9741C" />
					<stop offset="0.7" stopColor="#8E4710" />
					<stop offset="1" stopColor="#4A2206" />
				</linearGradient>
				<linearGradient id="cap" x1="0" x2="1">
					<stop offset="0" stopColor="#0d0d0d" />
					<stop offset="0.35" stopColor="#3a3a3a" />
					<stop offset="0.6" stopColor="#1a1a1a" />
					<stop offset="1" stopColor="#050505" />
				</linearGradient>
				<linearGradient id="label" x1="0" x2="1">
					<stop offset="0" stopColor="#E6DCC6" />
					<stop offset="0.4" stopColor="#FBF6EA" />
					<stop offset="1" stopColor="#D9CDB2" />
				</linearGradient>
			</defs>
			{/* poire de la pipette */}
			<path d="M78 20 Q78 0 100 0 Q122 0 122 20 L124 92 L76 92 Z" fill="url(#cap)" />
			{/* bague */}
			<rect x="62" y="88" width="76" height="62" rx="8" fill="url(#cap)" />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<rect key={i} x={66 + i * 12} y="94" width="3" height="50" fill="#000" opacity="0.35" />
			))}
			{/* col */}
			<rect x="70" y="148" width="60" height="18" fill="#6B3410" />
			{/* corps verre */}
			<path
				d="M70 166 Q24 176 22 230 L22 440 Q22 470 52 470 L148 470 Q178 470 178 440 L178 230 Q176 176 130 166 Z"
				fill="url(#glass)"
			/>
			{/* reflets */}
			<path d="M40 236 Q40 200 64 188 L60 450 Q42 448 40 430 Z" fill="#fff" opacity="0.16" />
			<rect x="150" y="240" width="8" height="190" rx="4" fill="#fff" opacity="0.12" />
			{/* étiquette */}
			<rect x="30" y="262" width="140" height="160" rx="6" fill="url(#label)" />
			<rect x="30" y="262" width="140" height="10" fill={C.forest} />
			<rect x="30" y="412" width="140" height="10" fill={C.forest} />
			<circle cx="100" cy="304" r="18" fill="none" stroke={C.sage} strokeWidth="3" />
			<path d="M100 290 Q110 304 100 318 Q90 304 100 290 Z" fill={C.sage} />
			<text x="100" y="346" textAnchor="middle" fontFamily={F.latin} fontWeight={700} fontSize="19" fill={C.forest}>
				Aura Bio
			</text>
			<text x="100" y="370" textAnchor="middle" fontFamily={F.latin} fontWeight={500} fontSize="11" fill={C.forest} letterSpacing="1.5">
				HUILE DE ROMARIN
			</text>
			<text x="100" y="396" textAnchor="middle" fontFamily={F.body} fontWeight={700} fontSize={labelAr.length > 12 ? 14 : 15} fill={C.terracotta} direction="rtl">
				{labelAr}
			</text>
		</svg>
	);
};

/** Image d'un produit (détourée) ou flacon dessiné. */
export const ProductVisual: React.FC<{product: ProductKey; height: number; style?: React.CSSProperties}> = ({
	product,
	height,
	style,
}) => {
	const p = PRODUCTS[product];
	if (!p.image) return <OilBottle height={height} style={style} />;
	return <Img src={staticFile(p.image)} style={{height, width: 'auto', display: 'block', ...style}} />;
};

/** Produit avec entrée en ressort + flottement doux + ombre portée. */
export const FloatingProduct: React.FC<{
	product: ProductKey;
	height: number;
	delay?: number;
	float?: number;
	rotate?: number;
	shadow?: boolean;
	dim?: number;
	style?: React.CSSProperties;
}> = ({product, height, delay = 0, float = 10, rotate = 0, shadow = true, dim = 0, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 120, mass: 0.8}});
	const y = Math.sin((frame + delay * 7) / 22) * float;
	return (
		<div
			style={{
				translate: `0 ${(1 - s) * 260 + y}px`,
				scale: String(0.55 + 0.45 * s),
				opacity: Math.min(1, s * 2),
				rotate: `${rotate + (1 - s) * 12}deg`,
				filter: `${shadow ? 'drop-shadow(0 28px 30px rgba(0,0,0,0.33))' : ''} brightness(${1 - dim})`,
				...style,
			}}
		>
			<ProductVisual product={product} height={height} />
		</div>
	);
};

/** Mise en place des 5 produits (le « pack shot »). */
const LAYOUT: {key: ProductKey; x: number; bottom: number; h: number; rot: number; z: number}[] = [
	{key: 'derma', x: 0.19, bottom: 0.83, h: 0.74, rot: -9, z: 1},
	{key: 'flacon', x: 0.81, bottom: 0.82, h: 0.66, rot: 8, z: 1},
	{key: 'huile', x: 0.5, bottom: 0.78, h: 0.6, rot: 0, z: 2},
	{key: 'sidr', x: 0.3, bottom: 1.0, h: 0.3, rot: 0, z: 3},
	{key: 'brosse', x: 0.72, bottom: 1.0, h: 0.29, rot: -6, z: 3},
];

export const PackShot: React.FC<{
	width: number;
	delay?: number;
	stagger?: number;
	focus?: ProductKey | null;
	plinth?: string;
	style?: React.CSSProperties;
}> = ({width, delay = 0, stagger = 5, focus = null, plinth = 'rgba(0,0,0,0.18)', style}) => {
	const frame = useCurrentFrame();
	const H = width * 0.9;
	const plinthIn = interpolate(frame, [delay, delay + 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	return (
		<div style={{position: 'relative', width, height: H, ...style}}>
			<div
				style={{
					position: 'absolute',
					left: '8%',
					right: '8%',
					bottom: -H * 0.02,
					height: H * 0.12,
					borderRadius: '50%',
					background: `radial-gradient(ellipse, ${plinth} 0%, transparent 70%)`,
					scale: `${plinthIn} 1`,
				}}
			/>
			{LAYOUT.map((it, i) => {
				const h = it.h * width;
				return (
					<div
						key={it.key}
						style={{
							position: 'absolute',
							left: it.x * width,
							top: it.bottom * H,
							translate: '-50% -100%',
							zIndex: it.z,
						}}
					>
						<FloatingProduct
							product={it.key}
							height={h}
							delay={delay + i * stagger}
							rotate={it.rot}
							float={6}
							dim={focus && focus !== it.key ? 0.55 : 0}
						/>
					</div>
				);
			})}
		</div>
	);
};
