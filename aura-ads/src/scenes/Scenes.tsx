import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArabicText} from '../components/ArabicText';
import {Backdrop, Frieze, Logo, SafeArea, Zellige} from '../components/Brand';
import {IconCheck} from '../components/Icons';
import {KenBurns, Rush, Scrim} from '../components/Media';
import {CaptionPill, InstaHandle, PhonePill, PriceBadge, StepBadge, Sticker, TrustRow} from '../components/Offer';
import {FloatingProduct, PackShot} from '../components/Products';
import {COPY} from '../data/copy';
import {PRODUCT_ORDER, PRODUCTS} from '../data/product';
import type {Scene, Visual} from '../data/types';
import {C, F, useFormat} from '../theme/brand';
import {useAd} from './context';

type S<K extends Scene['kind']> = {scene: Extract<Scene, {kind: K}>};

/** Taille de titre adaptée au style et au format. */
const useTitle = () => {
	const {theme} = useAd();
	const {k} = useFormat();
	const base = theme.titleFont === F.body ? 98 : theme.titleFont === F.ruqaa ? 112 : 116;
	return {
		size: base * k,
		font: theme.titleFont,
		weight: theme.titleWeight,
		lh: theme.titleFont === F.ruqaa ? 1.45 : theme.titleFont === F.body ? 1.3 : 1.28,
	};
};

const ON_MEDIA_SHADOW = '0 4px 0 rgba(0,0,0,0.45), 0 0 34px rgba(0,0,0,0.7)';

/** Fond d'une scène selon le visuel demandé. Retourne aussi si le texte est posé sur un média. */
const VisualLayer: React.FC<{visual?: Visual; packTop?: number}> = ({visual, packTop}) => {
	const {theme, style} = useAd();
	const fmt = useFormat();
	const frame = useCurrentFrame();
	const backdrop = (
		<Backdrop
			bg={theme.bg}
			bg2={theme.bg2}
			glow={theme.dark ? 'rgba(210,176,106,0.35)' : 'rgba(255,255,255,0.7)'}
			pattern={style === 'her' ? 'zellige' : 'none'}
			patternColor={C.terracotta}
		/>
	);
	if (!visual) {
		return (
			<>
				{backdrop}
				{fmt.vertical ? (
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 140}}>
						<Img
							src={staticFile(theme.dark ? 'brand/logo_mark_light.png' : 'brand/logo_mark.png')}
							style={{width: 520, height: 520, opacity: theme.dark ? 0.07 : 0.1, rotate: `${frame * 0.15}deg`}}
						/>
					</AbsoluteFill>
				) : null}
			</>
		);
	}
	if (visual.type === 'rush') {
		return (
			<>
				<Rush
					src={visual.src}
					trim={visual.trim}
					rate={visual.rate}
					mode={visual.mode ?? 'cover'}
					focusY={visual.focusY}
					cardHeight={fmt.height * (fmt.vertical ? 0.62 : 0.66)}
					cardTop={fmt.vertical ? fmt.safe.top + fmt.safeHeight * 0.36 : fmt.height * 0.3}
				/>
				<Scrim dir="top" to={0.72} />
			</>
		);
	}
	if (visual.type === 'photo') {
		return (
			<>
				<KenBurns src={visual.src} focusY={visual.focusY} />
				<Scrim dir="top" to={0.7} />
			</>
		);
	}
	if (visual.type === 'product') {
		const h = fmt.vertical ? 760 : fmt.key === '4x5' ? 640 : 500;
		return (
			<>
				{backdrop}
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: fmt.vertical ? 330 : fmt.height * 0.06}}>
					<FloatingProduct product={visual.product} height={visual.product === 'sidr' || visual.product === 'brosse' ? h * 0.6 : h} delay={2} />
				</AbsoluteFill>
			</>
		);
	}
	// pack
	const w = fmt.vertical ? 900 : fmt.key === '4x5' ? 700 : 540;
	const top = packTop ?? (fmt.vertical ? fmt.safe.top + 600 : fmt.key === '4x5' ? fmt.height - w * 0.9 - 70 : fmt.height - w * 0.9 - 50);
	return (
		<>
			{backdrop}
			<div style={{position: 'absolute', left: (fmt.width - w) / 2, top}}>
				<PackShot width={w} delay={3} stagger={4} plinth={theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(31,46,37,0.22)'} />
			</div>
		</>
	);
};

const onMedia = (v?: Visual) => !!v && (v.type === 'rush' || v.type === 'photo');

// ---------------------------------------------------------------- HOOK
export const HookScene: React.FC<S<'hook'>> = ({scene}) => {
	const {theme} = useAd();
	const t = useTitle();
	const fmt = useFormat();
	const media = onMedia(scene.visual);
	const ugcPill = media && theme.captionMode === 'pill';
	return (
		<AbsoluteFill>
			<VisualLayer visual={scene.visual} />
			<SafeArea justify="flex-start" gap={18 * fmt.k} style={{paddingTop: 70 * fmt.k}}>
				{scene.sticker ? <Sticker text={scene.sticker} size={40 * fmt.k} delay={0} bg={theme.accent} color={theme.dark ? C.forestDeep : C.cream} /> : null}
				{ugcPill ? (
					<CaptionPill text={scene.text} size={t.size * 0.78} mode="pill" accent={C.terracotta} />
				) : (
					<ArabicText
						text={scene.text}
						size={t.size}
						font={t.font}
						weight={t.weight}
						lineHeight={t.lh}
						color={media ? C.white : theme.text}
						accent={media ? C.goldLight : theme.accent}
						shadow={media ? ON_MEDIA_SHADOW : undefined}
						anim="rise"
						stagger={3}
					/>
				)}
				{scene.sub ? (
					<ArabicText
						text={scene.sub}
						size={46 * fmt.k}
						weight={700}
						color={media ? C.white : theme.muted}
						accent={media ? C.goldLight : theme.accent}
						shadow={media ? ON_MEDIA_SHADOW : undefined}
						delay={10}
					/>
				) : null}
			</SafeArea>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- RUSH
export const RushScene: React.FC<S<'rush'>> = ({scene}) => {
	const {theme, style} = useAd();
	const fmt = useFormat();
	return (
		<AbsoluteFill>
			<Rush
				src={scene.src}
				trim={scene.trim}
				rate={scene.rate}
				mode={scene.mode ?? 'cover'}
				focusY={scene.focusY}
				cardHeight={fmt.vertical ? 980 : fmt.height * 0.62}
				cardTop={fmt.vertical ? fmt.safe.top + 60 : fmt.height * 0.08}
			/>
			<Scrim dir="top" to={0.55} />
			<Scrim dir="bottom" to={0.35} />
			<SafeArea justify="space-between" style={{paddingTop: 70 * fmt.k, paddingBottom: 10}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 22, flexDirection: 'row-reverse'}}>
					{scene.step ? <StepBadge n={scene.step} size={92 * fmt.k} bg={theme.accent} color={theme.dark ? C.forestDeep : C.cream} /> : null}
					{scene.title ? (
						<ArabicText
							text={scene.title}
							size={64 * fmt.k}
							font={F.display}
							weight={400}
							color={C.white}
							accent={C.goldLight}
							shadow={ON_MEDIA_SHADOW}
						/>
					) : null}
				</div>
				{scene.caption ? (
					<CaptionPill
						text={scene.caption}
						size={56 * fmt.k}
						delay={4}
						mode={theme.captionMode}
						{...(style === 'nat' ? {bg: 'rgba(18,28,22,0.88)', color: C.cream, accent: C.goldLight} : {accent: C.terracotta})}
						maxWidth={fmt.safeWidth}
					/>
				) : null}
			</SafeArea>
			{scene.inset ? (
				<div style={{position: 'absolute', left: fmt.safe.x - 10, top: fmt.safe.top + 230 * fmt.k}}>
					<FloatingProduct product={scene.inset} height={(scene.inset === 'sidr' || scene.inset === 'brosse' ? 150 : 300) * fmt.k} delay={6} rotate={-8} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- PRODUCT
export const ProductScene: React.FC<S<'product'>> = ({scene}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const p = PRODUCTS[scene.product];
	const flat = scene.product === 'sidr' || scene.product === 'brosse';
	const imgH = fmt.safeHeight * (flat ? 0.34 : 0.52);
	const media = scene.withRush && p.rush;
	return (
		<AbsoluteFill>
			{media ? (
				<>
					<Rush src={p.rush!} mode="cover" />
					<AbsoluteFill style={{background: theme.dark ? 'rgba(18,28,22,0.78)' : 'rgba(245,238,223,0.82)'}} />
				</>
			) : (
				<VisualLayer />
			)}
			{fmt.vertical ? (
				<>
					<SafeArea justify="flex-start" gap={26} style={{paddingTop: 80}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 18, flexDirection: 'row-reverse'}}>
							<StepBadge n={p.n} size={84} bg={theme.accent} color={theme.dark ? C.forestDeep : C.cream} />
							<ArabicText text={p.nameAr} size={100} font={F.display} weight={400} color={theme.text} anim="rise" />
						</div>
						<ArabicText text={p.benefit} size={54} weight={800} color={theme.text} accent={theme.accent} delay={8} maxWidth={fmt.safeWidth} />
						{scene.total ? (
							<div dir="ltr" style={{fontFamily: F.latin, fontWeight: 700, fontSize: 32, color: theme.muted}}>
								{p.n} / {scene.total}
							</div>
						) : null}
					</SafeArea>
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: flat ? 330 : 230}}>
						<FloatingProduct product={p.key} height={flat ? 560 : p.key === 'huile' ? 760 : 880} delay={3} />
					</AbsoluteFill>
				</>
			) : (
			<SafeArea justify="space-evenly" gap={10}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18 * fmt.k, flexDirection: 'row-reverse'}}>
					<StepBadge n={p.n} size={78 * fmt.k} bg={theme.accent} color={theme.dark ? C.forestDeep : C.cream} />
					<ArabicText text={p.nameAr} size={92 * fmt.k} font={F.display} weight={400} color={theme.text} anim="rise" />
				</div>
				<div style={{height: imgH * 1.05, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<FloatingProduct product={p.key} height={imgH} delay={3} />
				</div>
				<ArabicText text={p.benefit} size={52 * fmt.k} weight={800} color={theme.text} accent={theme.accent} delay={8} maxWidth={fmt.safeWidth} />
				{scene.total ? (
					<div dir="ltr" style={{fontFamily: F.latin, fontWeight: 700, fontSize: 30 * fmt.k, color: theme.muted}}>
						{p.n} / {scene.total}
					</div>
				) : null}
			</SafeArea>
			)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- PACK
export const PackScene: React.FC<S<'pack'>> = ({scene}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const t = useTitle();
	const w = fmt.vertical ? 900 : fmt.key === '4x5' ? 760 : 580;
	return (
		<AbsoluteFill>
			<VisualLayer />
			<SafeArea justify="space-evenly" gap={10}>
				{scene.title ? <ArabicText text={scene.title} size={t.size * 0.9} font={t.font} weight={t.weight} lineHeight={t.lh} color={theme.text} accent={theme.accent} /> : null}
				<PackShot width={w} delay={4} plinth={theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(31,46,37,0.22)'} />
				{scene.sub ? <ArabicText text={scene.sub} size={50 * fmt.k} weight={800} color={theme.text} accent={theme.accent} delay={14} /> : null}
			</SafeArea>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- GRID 5 produits
export const GridScene: React.FC<S<'grid'>> = ({scene}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const t = useTitle();
	const cell = fmt.vertical ? 300 : fmt.key === '4x5' ? 290 : 250;
	const rows = [PRODUCT_ORDER.slice(0, 3), PRODUCT_ORDER.slice(3)];
	let idx = 0;
	return (
		<AbsoluteFill>
			<VisualLayer />
			<SafeArea justify="space-evenly" gap={8}>
				{scene.title ? <ArabicText text={scene.title} size={t.size * 0.8} font={t.font} weight={t.weight} lineHeight={t.lh} color={theme.text} accent={theme.accent} /> : null}
				{rows.map((row, ri) => (
					<div key={ri} dir="rtl" style={{display: 'flex', gap: 22 * fmt.k, justifyContent: 'center'}}>
						{row.map((k) => {
							const p = PRODUCTS[k];
							const i = idx++;
							const flat = k === 'sidr' || k === 'brosse';
							return (
								<div
									key={k}
									style={{
										width: cell,
										height: cell * 1.12,
										borderRadius: 32,
										background: theme.dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.75)',
										border: `2px solid ${theme.dark ? 'rgba(210,176,106,0.35)' : 'rgba(31,46,37,0.1)'}`,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'space-between',
										padding: '18px 8px 14px',
										boxShadow: theme.dark ? 'none' : '0 14px 30px rgba(31,46,37,0.12)',
									}}
								>
									<div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
										<FloatingProduct product={k} height={cell * (flat ? 0.48 : 0.7)} delay={4 + i * 4} float={4} />
									</div>
									<ArabicText text={p.nameAr} size={cell * 0.115} weight={800} color={theme.text} delay={8 + i * 4} anim="fade" />
								</div>
							);
						})}
					</div>
				))}
			</SafeArea>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- STEPS (récap rituel)
export const StepsScene: React.FC<S<'steps'>> = ({scene}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const t = useTitle();
	const frame = useCurrentFrame();
	const rows = [...COPY.steps.map((s) => ({n: String(s.n), title: s.title, text: s.text})), {n: '✓', title: COPY.wash.title, text: COPY.wash.text}];
	const fs = (fmt.vertical ? 48 : fmt.key === '4x5' ? 44 : 36);
	return (
		<AbsoluteFill>
			<VisualLayer />
			<SafeArea justify="space-evenly" gap={6}>
				<ArabicText text={scene.title ?? 'الروتين *2 ولا 3 مرات* في الجمعة'} size={t.size * 0.62} font={t.font} weight={t.weight} lineHeight={t.lh} color={theme.text} accent={theme.accent} />
				<div style={{display: 'flex', flexDirection: 'column', gap: fs * 0.42, width: '100%'}}>
					{rows.map((r, i) => {
						const d = 6 + i * 7;
						const p = interpolate(frame, [d, d + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
						return (
							<div
								key={i}
								dir="rtl"
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: fs * 0.5,
									background: theme.dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.78)',
									borderRadius: fs * 0.7,
									padding: `${fs * 0.32}px ${fs * 0.5}px`,
									opacity: p,
									translate: `${(1 - p) * -60}px 0`,
								}}
							>
								{r.n === '✓' ? (
									<div style={{width: fs * 1.7, height: fs * 1.7, borderRadius: '50%', background: theme.accent2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
										<IconCheck size={fs * 1.1} color={C.cream} />
									</div>
								) : (
									<StepBadge n={Number(r.n)} size={fs * 1.7} bg={theme.accent} color={theme.dark ? C.forestDeep : C.cream} delay={d} />
								)}
								<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
									<div style={{fontFamily: F.body, fontWeight: 900, fontSize: fs * 0.9, color: theme.text, lineHeight: 1.25}}>{r.title}</div>
									<ArabicText text={r.text} size={fs * 0.8} weight={700} color={theme.muted} accent={theme.accent} anim="none" align="right" lineHeight={1.3} />
								</div>
							</div>
						);
					})}
				</div>
				<ArabicText text={COPY.consistency} size={fs * 0.95} weight={800} color={theme.text} accent={theme.accent} delay={44} />
			</SafeArea>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- OFFER
export const OfferScene: React.FC<S<'offer'>> = ({scene}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const t = useTitle();
	const w = fmt.vertical ? 760 : fmt.key === '4x5' ? 640 : 480;
	return (
		<AbsoluteFill>
			<VisualLayer />
			<SafeArea justify="space-evenly" gap={6}>
				<ArabicText text={scene.title ?? COPY.packFull} size={t.size * 0.72} font={t.font} weight={t.weight} lineHeight={t.lh} color={theme.text} accent={theme.accent} />
				<div style={{position: 'relative', width: w, height: w * 0.9}}>
					<PackShot width={w} delay={2} stagger={3} plinth={theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(31,46,37,0.22)'} />
					<div style={{position: 'absolute', right: -w * 0.12, top: w * 0.2, zIndex: 10}}>
						<PriceBadge size={w * 0.4} delay={14} bg={theme.dark ? C.gold : C.terracotta} color={theme.dark ? C.forestDeep : C.cream} ring={theme.dark ? C.forest : C.goldLight} />
					</div>
				</div>
				{scene.sub ? <ArabicText text={scene.sub} size={46 * fmt.k} weight={800} color={theme.text} accent={theme.accent} delay={18} /> : null}
				<TrustRow color={theme.text} iconBg={theme.dark ? 'rgba(255,255,255,0.12)' : 'rgba(31,46,37,0.1)'} size={(fmt.vertical ? 34 : 30) * fmt.k} delay={22} stacked={fmt.key === '1x1' ? false : fmt.vertical} />
			</SafeArea>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- CTA
export const CtaScene: React.FC<S<'cta'>> = ({scene}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const pillBg = theme.dark ? C.gold : C.forest;
	const pillFg = theme.dark ? C.forestDeep : C.cream;
	return (
		<AbsoluteFill>
			<VisualLayer />
			{fmt.vertical ? (
				<div style={{position: 'absolute', left: 90, top: 1330, opacity: 0.95}}>
					<PackShot width={900} delay={0} stagger={2} plinth={theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(31,46,37,0.22)'} />
				</div>
			) : null}
			<SafeArea justify="space-evenly" gap={10}>
				<Logo size={70 * fmt.k} light={theme.dark} />
				{scene.title ? <ArabicText text={scene.title} size={62 * fmt.k} font={F.display} weight={400} color={theme.text} accent={theme.accent} /> : null}
				<div style={{display: 'flex', alignItems: 'center', gap: 30 * fmt.k, flexDirection: fmt.key === '1x1' ? 'row-reverse' : 'column'}}>
					<PriceBadge size={(fmt.vertical ? 300 : 220) * fmt.k} delay={4} bg={theme.dark ? C.gold : C.terracotta} color={theme.dark ? C.forestDeep : C.cream} ring={theme.dark ? C.forest : C.goldLight} />
					<PhonePill size={(fmt.vertical ? 84 : 70) * fmt.k} delay={10} bg={pillBg} color={pillFg} />
				</div>
				<TrustRow color={theme.text} iconBg={theme.dark ? 'rgba(255,255,255,0.12)' : 'rgba(31,46,37,0.1)'} size={(fmt.vertical ? 32 : 28) * fmt.k} delay={18} stacked={fmt.vertical} />
				<InstaHandle color={theme.text} size={28 * fmt.k} />
			</SafeArea>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- TEXT (punch typographique)
export const TextScene: React.FC<S<'text'>> = ({scene}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const t = useTitle();
	const media = onMedia(scene.visual);
	return (
		<AbsoluteFill>
			<VisualLayer visual={scene.visual} packTop={fmt.vertical ? fmt.safe.top + 470 : undefined} />
			{media ? <Scrim dir="mid" to={0.45} /> : null}
			<SafeArea justify={scene.visual?.type === 'pack' || scene.visual?.type === 'product' ? 'flex-start' : 'center'} gap={24} style={{paddingTop: scene.visual ? 70 * fmt.k : 0}}>
				<ArabicText
					text={scene.text}
					size={(scene.size ?? 1) * t.size}
					font={t.font}
					weight={t.weight}
					lineHeight={t.lh}
					color={media ? C.white : theme.text}
					accent={media ? C.goldLight : theme.accent}
					shadow={media ? ON_MEDIA_SHADOW : undefined}
					anim="pop"
					stagger={3}
				/>
				{scene.sub ? (
					<ArabicText text={scene.sub} size={48 * fmt.k} weight={800} color={media ? C.white : theme.muted} accent={media ? C.goldLight : theme.accent} shadow={media ? ON_MEDIA_SHADOW : undefined} delay={10} />
				) : null}
			</SafeArea>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- PHOTO
export const PhotoScene: React.FC<S<'photo'>> = ({scene}) => {
	const fmt = useFormat();
	const t = useTitle();
	return (
		<AbsoluteFill>
			<KenBurns src={scene.src} focusY={scene.focusY} />
			<Scrim dir="top" to={0.7} />
			<SafeArea justify="flex-start" gap={16} style={{paddingTop: 80 * fmt.k}}>
				{scene.text ? <ArabicText text={scene.text} size={t.size * 0.85} font={t.font} weight={t.weight} lineHeight={t.lh} color={C.white} accent={C.goldLight} shadow={ON_MEDIA_SHADOW} /> : null}
				{scene.sub ? <ArabicText text={scene.sub} size={48 * fmt.k} weight={800} color={C.white} accent={C.goldLight} shadow={ON_MEDIA_SHADOW} delay={10} /> : null}
			</SafeArea>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- TIP (conseil numéroté)
export const TipScene: React.FC<S<'tip'>> = ({scene}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	return (
		<AbsoluteFill>
			<VisualLayer visual={scene.visual} />
			<Scrim dir="bottom" to={0.4} />
			<SafeArea justify="flex-start" gap={20} style={{paddingTop: 60 * fmt.k}}>
				<StepBadge n={scene.n} size={120 * fmt.k} bg={theme.accent} color={theme.dark ? C.forestDeep : C.cream} />
				<CaptionPill text={scene.text} size={62 * fmt.k} mode="pill" accent={C.terracotta} maxWidth={fmt.safeWidth} delay={4} />
				{scene.sub ? (
					<ArabicText text={scene.sub} size={44 * fmt.k} weight={800} color={C.white} accent={C.goldLight} shadow={ON_MEDIA_SHADOW} delay={12} maxWidth={fmt.safeWidth} />
				) : null}
			</SafeArea>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- HERITAGE (calligraphie + arche)
export const HeritageScene: React.FC<S<'heritage'>> = ({scene}) => {
	const fmt = useFormat();
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const archW = fmt.vertical ? 800 : fmt.key === '4x5' ? 560 : 440;
	const archH = archW * (fmt.vertical ? 1.3 : 0.95);
	const open = interpolate(frame, [0, 0.7 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${C.cream} 0%, ${C.sand} 75%)`}}>
			<Zellige color={C.terracotta} opacity={0.12} />
			<div style={{position: 'absolute', top: fmt.safe.top - 70, left: 0, right: 0}}>
				<Frieze height={44} />
			</div>
			{fmt.vertical ? (
				<>
					<SafeArea justify="flex-start" gap={14} style={{paddingTop: 40}}>
						<ArabicText text={scene.text} size={100} font={F.ruqaa} weight={700} lineHeight={1.5} color={C.forest} accent={C.terracotta} stagger={4} />
						{scene.sub ? <ArabicText text={scene.sub} size={48} weight={800} color={C.forest} accent={C.terracotta} delay={12} maxWidth={fmt.safeWidth} /> : null}
					</SafeArea>
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150}}>
						{scene.visual ? (
					<div
						style={{
							width: archW,
							height: archH,
							borderRadius: `${archW / 2}px ${archW / 2}px 26px 26px`,
							overflow: 'hidden',
							position: 'relative',
							border: `10px solid ${C.blue}`,
							outline: `3px solid ${C.gold}`,
							outlineOffset: 6,
							boxShadow: '0 30px 60px rgba(80,50,20,0.3)',
							scale: String(0.85 + 0.15 * open),
							opacity: open,
						}}
					>
						{scene.visual.type === 'rush' ? (
							<Rush src={scene.visual.src} trim={scene.visual.trim} mode="cover" focusY={scene.visual.focusY} warm={0.18} />
						) : scene.visual.type === 'photo' ? (
							<KenBurns src={scene.visual.src} focusY={scene.visual.focusY} />
						) : scene.visual.type === 'product' ? (
							<AbsoluteFill style={{background: C.cream, alignItems: 'center', justifyContent: 'center'}}>
								<FloatingProduct product={scene.visual.product} height={archH * 0.45} />
							</AbsoluteFill>
						) : (
							<AbsoluteFill style={{background: C.cream, alignItems: 'center', justifyContent: 'center'}}>
								<PackShot width={archW * 0.92} />
							</AbsoluteFill>
						)}
					</div>
				) : null}
					</AbsoluteFill>
				</>
			) : (
			<SafeArea justify="space-evenly" gap={8} style={{paddingTop: 10}}>
				<ArabicText text={scene.text} size={(fmt.vertical ? 100 : 88) * fmt.k} font={F.ruqaa} weight={700} lineHeight={1.5} color={C.forest} accent={C.terracotta} stagger={4} />
				{scene.visual ? (
					<div
						style={{
							width: archW,
							height: archH,
							borderRadius: `${archW / 2}px ${archW / 2}px 26px 26px`,
							overflow: 'hidden',
							position: 'relative',
							border: `10px solid ${C.blue}`,
							outline: `3px solid ${C.gold}`,
							outlineOffset: 6,
							boxShadow: '0 30px 60px rgba(80,50,20,0.3)',
							scale: String(0.85 + 0.15 * open),
							opacity: open,
						}}
					>
						{scene.visual.type === 'rush' ? (
							<Rush src={scene.visual.src} trim={scene.visual.trim} mode="cover" focusY={scene.visual.focusY} warm={0.18} />
						) : scene.visual.type === 'photo' ? (
							<KenBurns src={scene.visual.src} focusY={scene.visual.focusY} />
						) : scene.visual.type === 'product' ? (
							<AbsoluteFill style={{background: C.cream, alignItems: 'center', justifyContent: 'center'}}>
								<FloatingProduct product={scene.visual.product} height={archH * 0.45} />
							</AbsoluteFill>
						) : (
							<AbsoluteFill style={{background: C.cream, alignItems: 'center', justifyContent: 'center'}}>
								<PackShot width={archW * 0.92} />
							</AbsoluteFill>
						)}
					</div>
				) : null}
				{scene.sub ? <ArabicText text={scene.sub} size={50 * fmt.k} weight={800} color={C.forest} accent={C.terracotta} delay={12} maxWidth={fmt.safeWidth} /> : null}
			</SafeArea>
			)}
		</AbsoluteFill>
	);
};

export const SCENES: {[K in Scene['kind']]: React.FC<S<K>>} = {
	hook: HookScene,
	rush: RushScene,
	product: ProductScene,
	pack: PackScene,
	grid: GridScene,
	steps: StepsScene,
	offer: OfferScene,
	cta: CtaScene,
	text: TextScene,
	photo: PhotoScene,
	tip: TipScene,
	heritage: HeritageScene,
};
