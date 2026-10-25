import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {ArabicText} from '../components/ArabicText';
import {Backdrop, Frieze, Grain, Logo, SafeArea, Zellige} from '../components/Brand';
import {IconCash, IconCheck, IconGift, IconLeaf, IconTruck} from '../components/Icons';
import {KenBurns, Scrim} from '../components/Media';
import {InstaHandle, PhonePill, PriceBadge, StepBadge, Sticker, TrustRow} from '../components/Offer';
import {FloatingProduct, PackShot, ProductVisual} from '../components/Products';
import {COPY} from '../data/copy';
import {OFFER, PRODUCT_ORDER, PRODUCTS} from '../data/product';
import type {StillSpec} from '../data/types';
import {AdContext, useAd} from '../scenes/context';
import {C, F, STYLES, useFormat} from '../theme/brand';

/** Bandeau d'offre en bas de chaque image : prix + téléphone + réassurance. */
const OfferFooter: React.FC<{compact?: boolean; showPrice?: boolean}> = ({compact, showPrice = true}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const k = fmt.k * (compact ? 0.85 : 1);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 * k}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 34 * k, flexDirection: 'row-reverse'}}>
				{showPrice ? (
					<PriceBadge
						size={210 * k}
						bg={theme.dark ? C.gold : C.terracotta}
						color={theme.dark ? C.forestDeep : C.cream}
						ring={theme.dark ? C.forest : C.goldLight}
					/>
				) : null}
				<PhonePill size={60 * k} bg={theme.dark ? C.gold : C.forest} color={theme.dark ? C.forestDeep : C.cream} pulse={false} />
			</div>
			<TrustRow color={theme.text} iconBg={theme.dark ? 'rgba(255,255,255,0.12)' : 'rgba(31,46,37,0.1)'} size={28 * k} />
		</div>
	);
};

const Title: React.FC<{text: string; scale?: number; color?: string; accent?: string; shadow?: string}> = ({text, scale = 1, color, accent, shadow}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const base = theme.titleFont === F.body ? 92 : theme.titleFont === F.ruqaa ? 104 : 108;
	return (
		<ArabicText
			text={text}
			size={base * fmt.k * scale}
			font={theme.titleFont}
			weight={theme.titleWeight}
			lineHeight={theme.titleFont === F.ruqaa ? 1.5 : 1.25}
			color={color ?? theme.text}
			accent={accent ?? theme.accent}
			shadow={shadow}
			anim="none"
		/>
	);
};

const Bg: React.FC = () => {
	const {theme, style} = useAd();
	return (
		<Backdrop
			bg={theme.bg}
			bg2={theme.bg2}
			glow={theme.dark ? 'rgba(210,176,106,0.35)' : 'rgba(255,255,255,0.7)'}
			pattern={style === 'her' ? 'zellige' : 'none'}
			patternColor={C.terracotta}
		/>
	);
};

const packW = (fmt: ReturnType<typeof useFormat>, f = 1) =>
	(fmt.vertical ? 820 : fmt.key === '4x5' ? 640 : 470) * f;

/** 9:16 : le visuel occupe le tiers bas (zone image, sans texte). */
const BottomVisual: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 1090}) => (
	<div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>{children}</div>
);

const BottomMark: React.FC = () => {
	const {theme} = useAd();
	return (
		<BottomVisual top={1340}>
			<Img src={staticFile(theme.dark ? 'brand/logo_mark_light.png' : 'brand/logo_mark.png')} style={{width: 480, height: 480, opacity: theme.dark ? 0.08 : 0.12}} />
		</BottomVisual>
	);
};

// ------------------------------------------------------------------ layouts
const PackOffer: React.FC<{spec: StillSpec}> = ({spec}) => {
	const fmt = useFormat();
	const {theme} = useAd();
	if (fmt.vertical) {
		return (
			<>
				<Bg />
				<SafeArea justify="flex-start" gap={34} style={{paddingTop: 10}}>
					<Logo size={52} light={theme.dark} />
					<Title text={spec.title ?? COPY.hooks.unbox5} />
					<OfferFooter />
				</SafeArea>
				<BottomVisual>
					<PackShot width={900} plinth={theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(31,46,37,0.22)'} />
				</BottomVisual>
			</>
		);
	}
	return (
		<>
			<Bg />
			<SafeArea justify="space-between" gap={10}>
				<Logo size={52 * fmt.k} light={useAd().theme.dark} />
				<Title text={spec.title ?? COPY.hooks.unbox5} scale={0.9} />
				<PackShot width={packW(fmt, 0.95)} />
				<OfferFooter />
			</SafeArea>
		</>
	);
};

const Grid5: React.FC<{spec: StillSpec}> = ({spec}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const cell = fmt.vertical ? 280 : fmt.key === '4x5' ? 250 : 200;
	const rows = [PRODUCT_ORDER.slice(0, 3), PRODUCT_ORDER.slice(3)];
	return (
		<>
			<Bg />
			<SafeArea justify="space-between" gap={8}>
				<Title text={spec.title ?? COPY.pack5} scale={0.82} />
				<div style={{display: 'flex', flexDirection: 'column', gap: 18 * fmt.k}}>
					{rows.map((row, ri) => (
						<div key={ri} dir="rtl" style={{display: 'flex', gap: 18 * fmt.k, justifyContent: 'center'}}>
							{row.map((k) => {
								const flat = k === 'sidr' || k === 'brosse';
								return (
									<div
										key={k}
										style={{
											width: cell,
											height: cell * 1.1,
											borderRadius: 28,
											background: 'rgba(255,255,255,0.8)',
											border: '2px solid rgba(31,46,37,0.08)',
											boxShadow: '0 12px 26px rgba(31,46,37,0.12)',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'space-between',
											padding: '14px 6px 10px',
										}}
									>
										<div style={{flex: 1, display: 'flex', alignItems: 'center', position: 'relative'}}>
											<ProductVisual product={k} height={cell * (flat ? 0.46 : 0.68)} style={{filter: 'drop-shadow(0 12px 14px rgba(0,0,0,0.2))'}} />
										</div>
										<div dir="rtl" style={{fontFamily: F.body, fontWeight: 800, fontSize: cell * 0.105, color: theme.text}}>
											{PRODUCTS[k].nameAr}
										</div>
									</div>
								);
							})}
						</div>
					))}
				</div>
				<OfferFooter compact />
			</SafeArea>
			{fmt.vertical ? <BottomMark /> : null}
		</>
	);
};

const Steps: React.FC<{spec: StillSpec}> = ({spec}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const fs = fmt.vertical ? 44 : fmt.key === '4x5' ? 40 : 32;
	const rows = [...COPY.steps.map((s) => ({n: s.n, title: s.title, text: s.text})), {n: 0, title: COPY.wash.title, text: COPY.wash.text}];
	return (
		<>
			<Bg />
			<SafeArea justify="space-between" gap={8}>
				<Title text={spec.title ?? 'روتين الشعر واللحية\nفي *4 خطوات*'} scale={0.72} />
				<div style={{display: 'flex', flexDirection: 'column', gap: fs * 0.36, width: '100%'}}>
					{rows.map((r, i) => (
						<div
							key={i}
							dir="rtl"
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: fs * 0.5,
								background: theme.dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.8)',
								borderRadius: fs * 0.6,
								padding: `${fs * 0.28}px ${fs * 0.5}px`,
							}}
						>
							{r.n ? (
								<StepBadge n={r.n} size={fs * 1.6} bg={theme.accent} color={theme.dark ? C.forestDeep : C.cream} />
							) : (
								<div style={{width: fs * 1.6, height: fs * 1.6, borderRadius: '50%', background: theme.accent2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
									<IconCheck size={fs} color={C.cream} />
								</div>
							)}
							<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
								<div style={{fontFamily: F.body, fontWeight: 900, fontSize: fs * 0.9, color: theme.text, lineHeight: 1.25}}>{r.title}</div>
								<ArabicText text={r.text} size={fs * 0.78} weight={700} color={theme.muted} accent={theme.accent} anim="none" align="right" lineHeight={1.3} />
							</div>
						</div>
					))}
				</div>
				<OfferFooter compact />
			</SafeArea>
			{fmt.vertical ? <BottomMark /> : null}
		</>
	);
};

const Heritage: React.FC<{spec: StillSpec}> = ({spec}) => {
	const fmt = useFormat();
	const archW = fmt.vertical ? 720 : fmt.key === '4x5' ? 470 : 340;
	const arch = (
		<div
			style={{
				width: archW,
				height: archW * (fmt.vertical ? 1.15 : 0.95),
				borderRadius: `${archW / 2}px ${archW / 2}px 22px 22px`,
				overflow: 'hidden',
				position: 'relative',
				border: `9px solid ${C.blue}`,
				outline: `3px solid ${C.gold}`,
				outlineOffset: 5,
				background: C.cream,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<PackShot width={archW * 0.9} />
		</div>
	);
	if (fmt.vertical) {
		return (
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${C.cream} 0%, ${C.sand} 75%)`}}>
				<Zellige color={C.terracotta} opacity={0.12} drift={false} />
				<div style={{position: 'absolute', top: fmt.safe.top - 60, left: 0, right: 0}}>
					<Frieze height={36} />
				</div>
				<SafeArea justify="flex-start" gap={26} style={{paddingTop: 20}}>
					<ArabicText text={spec.title ?? COPY.hooks.heritageSecret} size={96} font={F.ruqaa} weight={700} lineHeight={1.5} color={C.forest} accent={C.terracotta} anim="none" />
					{spec.sub ? <ArabicText text={spec.sub} size={46} weight={800} color={C.forest} accent={C.terracotta} anim="none" /> : null}
					<OfferFooter compact />
				</SafeArea>
				<BottomVisual top={1130}>{arch}</BottomVisual>
			</AbsoluteFill>
		);
	}
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${C.cream} 0%, ${C.sand} 75%)`}}>
			<Zellige color={C.terracotta} opacity={0.12} drift={false} />
			<div style={{position: 'absolute', top: Math.max(0, fmt.safe.top - 60), left: 0, right: 0}}>
				<Frieze height={36} />
			</div>
			<SafeArea justify="space-between" gap={8} style={{paddingTop: 10}}>
				<ArabicText text={spec.title ?? COPY.hooks.heritageSecret} size={(fmt.vertical ? 92 : 80) * fmt.k} font={F.ruqaa} weight={700} lineHeight={1.5} color={C.forest} accent={C.terracotta} anim="none" />
				<div
					style={{
						width: archW,
						height: archW * 0.95,
						borderRadius: `${archW / 2}px ${archW / 2}px 22px 22px`,
						overflow: 'hidden',
						position: 'relative',
						border: `9px solid ${C.blue}`,
						outline: `3px solid ${C.gold}`,
						outlineOffset: 5,
						background: C.cream,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<PackShot width={archW * 0.9} />
				</div>
				{spec.sub ? <ArabicText text={spec.sub} size={44 * fmt.k} weight={800} color={C.forest} accent={C.terracotta} anim="none" /> : null}
				<OfferFooter compact />
			</SafeArea>
		</AbsoluteFill>
	);
};

const Gift: React.FC<{spec: StillSpec}> = ({spec}) => {
	const fmt = useFormat();
	const vertical = fmt.vertical;
	return (
		<>
			<Bg />
			{vertical ? (
				<BottomVisual>
					<PackShot width={900} plinth="rgba(31,46,37,0.22)" />
				</BottomVisual>
			) : null}
			<SafeArea justify={vertical ? 'flex-start' : 'space-between'} gap={vertical ? 34 : 8} style={{paddingTop: vertical ? 10 : 0}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, flexDirection: 'row-reverse'}}>
					<div style={{width: 84 * fmt.k, height: 84 * fmt.k, borderRadius: '50%', background: C.terracotta, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<IconGift size={50 * fmt.k} color={C.cream} />
					</div>
					<Sticker text="فكرة هدية" size={44 * fmt.k} bg={C.forest} color={C.cream} rotate={-4} />
				</div>
				<Title text={spec.title ?? COPY.hooks.giftWho} scale={vertical ? 1 : 0.82} />
				{vertical ? null : <PackShot width={packW(fmt, 0.85)} />}
				<OfferFooter compact={!vertical} />
			</SafeArea>
		</>
	);
};

const Trust: React.FC<{spec: StillSpec}> = ({spec}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const items = [
		{icon: IconCash, t: COPY.cod, s: 'ما تخلّص شي قبل'},
		{icon: IconTruck, t: COPY.delivery, s: OFFER.deliveryFee == null ? 'وين ما كنت' : `${OFFER.deliveryFee} DT`},
		{icon: IconLeaf, t: COPY.natural, s: 'سدر + زيت الروماران'},
	];
	const fs = fmt.vertical ? 46 : 40 * fmt.k;
	return (
		<>
			<Bg />
			<SafeArea justify="space-between" gap={8}>
				<Title text={spec.title ?? 'كوموندي *وانت مرتاح*'} scale={0.8} />
				<div style={{display: 'flex', alignItems: 'center', gap: 24 * fmt.k, flexDirection: 'row-reverse', width: '100%', justifyContent: 'center'}}>
					<div style={{display: 'flex', flexDirection: 'column', gap: fs * 0.45}}>
						{items.map((it, i) => {
							const Ico = it.icon;
							return (
								<div key={i} dir="rtl" style={{display: 'flex', alignItems: 'center', gap: fs * 0.45}}>
									<div style={{width: fs * 1.7, height: fs * 1.7, borderRadius: '50%', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
										<Ico size={fs} color={C.cream} />
									</div>
									<div>
										<div style={{fontFamily: F.body, fontWeight: 900, fontSize: fs * 0.85, color: theme.text, lineHeight: 1.2}}>{it.t}</div>
										<div style={{fontFamily: F.body, fontWeight: 700, fontSize: fs * 0.62, color: theme.muted}}>{it.s}</div>
									</div>
								</div>
							);
						})}
					</div>
					<PackShot width={packW(fmt, 0.6)} />
				</div>
				<OfferFooter compact />
			</SafeArea>
		</>
	);
};

const Macro: React.FC<{spec: StillSpec}> = ({spec}) => {
	const fmt = useFormat();
	return (
		<AbsoluteFill style={{background: C.ink}}>
			<KenBurns src="photos/goutte_romarin.jpg" from={1.02} to={1.02} focusY={30} style={fmt.vertical ? {top: 470, height: 'auto'} : undefined} />
			{fmt.vertical ? <div style={{position: 'absolute', left: 0, right: 0, top: 468, height: 360, background: `linear-gradient(180deg, ${C.ink} 0%, rgba(14,22,17,0) 100%)`}} /> : null}
			<Scrim dir="bottom" to={0.75} />
			<SafeArea justify="space-between" gap={8}>
				<Logo size={50 * fmt.k} light />
				<Title text={spec.title ?? 'زيت *الروماران*'} color={C.cream} accent={C.goldLight} shadow="0 4px 24px rgba(0,0,0,0.6)" />
				<div style={{flex: 1}} />
				{spec.sub ? <ArabicText text={spec.sub} size={44 * fmt.k} weight={800} color={C.cream} accent={C.goldLight} anim="none" /> : null}
				<OfferFooter compact />
			</SafeArea>
		</AbsoluteFill>
	);
};

const Derma: React.FC<{spec: StillSpec}> = ({spec}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	return (
		<>
			<Bg />
			<SafeArea justify="space-between" gap={6}>
				<div dir="rtl" style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
					<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 170 * fmt.k, color: theme.accent, lineHeight: 1}}>540</span>
					<span style={{fontFamily: F.display, fontSize: 70 * fmt.k, color: theme.text}}>إبرة صغيرة</span>
				</div>
				<ArabicText text={spec.title ?? 'تنشّط جلدة الراس\nوالزيت *يدخل خير*'} size={60 * fmt.k} weight={900} color={theme.text} accent={theme.accent} anim="none" />
				<div style={{display: 'flex', alignItems: 'flex-end', gap: 10}}>
					<FloatingProduct product="huile" height={300 * fmt.k} float={0} />
					<Img src={staticFile('products/derma_head.png')} style={{height: 330 * fmt.k, filter: 'drop-shadow(0 24px 26px rgba(0,0,0,0.4))'}} />
				</div>
				<ArabicText text={COPY.safetyDerma} size={32 * fmt.k} weight={700} color={theme.muted} anim="none" />
				<OfferFooter compact />
			</SafeArea>
		</>
	);
};

const CarouselCard: React.FC<{spec: StillSpec}> = ({spec}) => {
	const {theme} = useAd();
	const fmt = useFormat();
	const card = spec.card ?? 0;
	if (card === 0) {
		return (
			<>
				<Bg />
				<SafeArea justify="space-between" gap={6}>
					<Logo size={46} light={theme.dark} />
					<Title text={spec.title ?? '*5 حوايج*\nفي باك واحد'} scale={0.92} />
					<PackShot width={560} />
					<div dir="rtl" style={{fontFamily: F.body, fontWeight: 800, fontSize: 34, color: theme.muted}}>
						اسحب ← وشوف شنوّة فيه
					</div>
				</SafeArea>
			</>
		);
	}
	if (card === 6) {
		return (
			<>
				<Bg />
				<SafeArea justify="space-evenly" gap={8}>
					<Title text={COPY.packFull} scale={0.62} />
					<OfferFooter />
					<InstaHandle color={theme.text} size={28} />
				</SafeArea>
			</>
		);
	}
	const p = PRODUCTS[PRODUCT_ORDER[card - 1]];
	const flat = p.key === 'sidr' || p.key === 'brosse';
	return (
		<>
			<Bg />
			<SafeArea justify="space-between" gap={6}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, flexDirection: 'row-reverse'}}>
					<StepBadge n={p.n} size={70} bg={theme.accent} color={theme.dark ? C.forestDeep : C.cream} />
					<ArabicText text={p.nameAr} size={76} font={F.display} weight={400} color={theme.text} anim="none" />
				</div>
				<FloatingProduct product={p.key} height={flat ? 320 : 520} float={0} />
				<ArabicText text={p.benefit} size={44} weight={800} color={theme.text} accent={theme.accent} anim="none" />
				<div dir="ltr" style={{fontFamily: F.latin, fontWeight: 700, fontSize: 26, color: theme.muted}}>
					{p.n} / 5 · {OFFER.price} DT
				</div>
			</SafeArea>
		</>
	);
};

const Beard: React.FC<{spec: StillSpec}> = ({spec}) => {
	const fmt = useFormat();
	return (
		<>
			<Bg />
			<SafeArea justify="space-between" gap={8}>
				<Title text={spec.title ?? COPY.hooks.beard} scale={0.9} />
				<div style={{display: 'flex', alignItems: 'flex-end', gap: 20 * fmt.k}}>
					<FloatingProduct product="brosse" height={200 * fmt.k} float={0} />
					<FloatingProduct product="huile" height={440 * fmt.k} float={0} />
					<FloatingProduct product="derma" height={480 * fmt.k} float={0} rotate={8} />
				</div>
				<OfferFooter compact />
			</SafeArea>
		</>
	);
};

const RitualPhoto: React.FC<{spec: StillSpec}> = ({spec}) => {
	const fmt = useFormat();
	return (
		<AbsoluteFill style={{background: C.ink}}>
			<KenBurns src="photos/rituel_huile.jpg" from={1.02} to={1.02} focusY={45} style={fmt.vertical ? {top: 380, height: 'auto'} : undefined} />
			{fmt.vertical ? <div style={{position: 'absolute', left: 0, right: 0, top: 378, height: 360, background: `linear-gradient(180deg, ${C.ink} 0%, rgba(14,22,17,0) 100%)`}} /> : null}
			<Scrim dir="top" to={0.7} />
			<Scrim dir="bottom" to={0.85} />
			<SafeArea justify="space-between" gap={8}>
				<Title text={spec.title ?? 'روتين الشعر واللحية\n*في الدار*'} color={C.white} accent={C.goldLight} shadow="0 4px 24px rgba(0,0,0,0.7)" scale={0.85} />
				<div style={{flex: 1}} />
				{spec.sub ? <ArabicText text={spec.sub} size={42 * fmt.k} weight={800} color={C.white} accent={C.goldLight} anim="none" shadow="0 2px 14px rgba(0,0,0,0.7)" /> : null}
				<AdContext.Provider value={{style: 'nat', theme: STYLES.nat}}>
					<OfferFooter compact />
				</AdContext.Provider>
			</SafeArea>
		</AbsoluteFill>
	);
};

const LAYOUTS: Record<StillSpec['layout'], React.FC<{spec: StillSpec}>> = {
	packOffer: PackOffer,
	grid5: Grid5,
	steps: Steps,
	heritage: Heritage,
	gift: Gift,
	trust: Trust,
	macro: Macro,
	derma: Derma,
	carousel: CarouselCard,
	beard: Beard,
	ritualPhoto: RitualPhoto,
};

export const AdStill: React.FC<{spec: StillSpec}> = ({spec}) => {
	const Layout = LAYOUTS[spec.layout];
	const theme = STYLES[spec.style];
	return (
		<AdContext.Provider value={{style: spec.style, theme}}>
			{/* rendue à la frame 150 (cf. STILL_FRAME) : animations terminées */}
			<AbsoluteFill style={{background: theme.bg}}>
				<Layout spec={spec} />
				<Grain opacity={0.04} />
			</AbsoluteFill>
		</AdContext.Provider>
	);
};
