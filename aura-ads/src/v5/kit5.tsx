import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ArabicText} from '../components/ArabicText';
import {IconCheck} from '../components/Icons';
import {OFFER2 as O} from '../v2/offer';
import {Badge, N, T} from '../v2/WinStill';
import {byKey, PKey, Pack, Prod} from '../v3/V3Still';
import {Abs, Below, Clip, CtaAnim, ease, FooterPill, In, Music, Sfx, Stage, StrikeAnim, useStage} from '../v4/kit';
import {CutKind, THEMES5, Theme, ThemeBg, ThemeKey} from './theme';

// ---------------- contexte de thème ----------------

const ThemeCtx = createContext<{k: ThemeKey; th: Theme}>({k: 'kraft', th: THEMES5.kraft});
export const useTheme = () => useContext(ThemeCtx);

// ---------------- texte ----------------

/** Texte animé mot par mot (arabe RTL, chiffres en LTR), aux couleurs du thème. */
export const KText: React.FC<{
	text: string;
	size: number;
	color?: string;
	accent?: string;
	display?: boolean;
	delay?: number;
	stagger?: number;
	marker?: string;
	maxWidth?: number;
	shadow?: string;
	align?: 'center' | 'right' | 'left';
}> = ({text, size, color, accent, display = true, delay = 0, stagger = 3, marker, maxWidth = 960, shadow, align = 'center'}) => {
	const {th} = useTheme();
	return (
		<ArabicText
			text={text}
			size={size}
			color={color ?? th.ink}
			accent={accent ?? th.accent}
			font={display ? th.display : th.body}
			weight={display ? th.dWeight : 800}
			delay={delay}
			stagger={stagger}
			marker={marker}
			maxWidth={maxWidth}
			shadow={shadow}
			align={align}
			lineHeight={1.3}
		/>
	);
};

// ---------------- légendes (selon le thème) ----------------

/** Légende de plan : titre (+ sous-titre) habillé selon l'univers. */
export const Caption: React.FC<{title: string; sub?: string; n?: number; at?: number}> = ({title, sub, n, at = 4}) => {
	const {k, th} = useTheme();
	const box: React.CSSProperties = {position: 'relative', padding: '16px 34px 22px', maxWidth: 940};
	let wrap: React.CSSProperties = {};
	let titleColor = th.cardInk;
	let subColor = th.sub;
	if (k === 'kraft') wrap = {background: th.card, transform: 'rotate(-1.5deg)', boxShadow: '0 10px 24px rgba(0,0,0,0.3)'};
	if (k === 'brutal') wrap = {background: '#0A0A0A', border: '5px solid #0A0A0A', boxShadow: '10px 10px 0 #E2343B'};
	if (k === 'brutal') {
		titleColor = '#FFD43B';
		subColor = '#fff';
	}
	if (k === 'sbs') wrap = {background: '#fff', border: `5px solid ${th.accent}`, borderRadius: 36, boxShadow: '0 12px 30px rgba(18,62,115,0.25)'};
	if (k === 'tech') wrap = {background: 'rgba(3,10,24,0.72)', border: `2px solid ${th.accent}`, borderRadius: 14, boxShadow: `0 0 30px ${th.accent}55`};
	if (k === 'edito') {
		wrap = {background: 'transparent'};
		titleColor = th.ink;
		subColor = th.accent;
	}
	if (k === 'mag') wrap = {background: '#fff', borderRight: `14px solid ${th.accent}`, boxShadow: '0 12px 30px rgba(0,0,0,0.2)'};
	if (k === 'doc') {
		wrap = {background: 'rgba(0,0,0,0.78)', borderRight: `12px solid ${th.accent}`};
		titleColor = '#fff';
		subColor = th.accent;
	}
	if (k === 'blush' || k === 'clean') wrap = {background: '#fff', borderRadius: 30, boxShadow: '0 12px 30px rgba(0,0,0,0.18)'};
	const shadow = k === 'edito' ? '0 4px 20px rgba(0,0,0,0.9)' : undefined;
	return (
		<In at={at} kind={k === 'edito' ? 'fade' : k === 'brutal' ? 'pop' : 'up'}>
			<div dir="rtl" style={{...box, ...wrap}}>
				{k === 'kraft' ? (
					<>
						<div style={{position: 'absolute', top: -16, right: 40, width: 120, height: 34, background: 'rgba(255,255,255,0.55)', transform: 'rotate(4deg)'}} />
						<div style={{position: 'absolute', top: -16, left: 40, width: 120, height: 34, background: 'rgba(255,255,255,0.55)', transform: 'rotate(-5deg)'}} />
					</>
				) : null}
				<KText text={title} size={58} color={titleColor} delay={at + 2} shadow={shadow} />
				{sub ? (
					<div style={{marginTop: 4}}>
						<KText text={sub} size={36} color={subColor} display={false} delay={at + 8} stagger={2} shadow={shadow} />
					</div>
				) : null}
				{k === 'edito' ? <div style={{margin: '14px auto 0', width: 160, height: 2, background: th.accent}} /> : null}
				{n !== undefined ? <Badge n={n} size={80} style={{top: -38, right: -24}} /> : null}
			</div>
		</In>
	);
};

/** Pastille de chapitre (« 2 · كيفاش تستعملو؟ »). */
export const Chapter: React.FC<{n: number; text: string; at?: number}> = ({n, text, at = 0}) => {
	const {th} = useTheme();
	return (
		<In at={at} kind="down" dist={60}>
			<div dir="rtl" style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: th.footBg, borderRadius: 999, padding: '6px 26px 10px 10px'}}>
				<div style={{width: 52, height: 52, borderRadius: '50%', background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<N style={{fontSize: 28, color: th.ctaInk === '#fff' ? '#fff' : th.footBg}}>{n}</N>
				</div>
				<T size={36} color="#fff" style={{whiteSpace: 'nowrap'}}>{text}</T>
			</div>
		</In>
	);
};

// ---------------- médias ----------------

export const Photo: React.FC<{src: string; pos?: string}> = ({src, pos = '50% 50%'}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${1.05 + f * 0.0012})`}} />
		</AbsoluteFill>
	);
};

/** Vidéo dans un cadre (polaroid, arche, fenêtre arrondie). */
export const Framed: React.FC<{
	src?: string;
	photo?: string;
	trim?: number;
	rate?: number;
	w: number;
	h: number;
	kind?: 'polaroid' | 'arch' | 'round' | 'phone';
	rotate?: number;
	pos?: string;
	muted?: boolean;
	vol?: number;
}> = ({src, photo, trim, rate, w, h, kind = 'round', rotate = 0, pos, muted, vol}) => {
	const inner = src ? <Clip src={src} trim={trim} rate={rate} pos={pos} muted={muted ?? true} vol={vol} /> : <Photo src={photo!} pos={pos} />;
	if (kind === 'polaroid')
		return (
			<div style={{background: '#fff', padding: '18px 18px 70px', boxShadow: '0 18px 40px rgba(0,0,0,0.35)', transform: `rotate(${rotate}deg)`, position: 'relative'}}>
				<div style={{width: w, height: h, position: 'relative', overflow: 'hidden'}}>{inner}</div>
				<div style={{position: 'absolute', top: -18, left: '50%', marginLeft: -70, width: 140, height: 36, background: 'rgba(255,255,255,0.6)', transform: 'rotate(-3deg)'}} />
			</div>
		);
	if (kind === 'arch')
		return (
			<div style={{width: w + 24, height: h + 24, borderRadius: `${(w + 24) / 2}px ${(w + 24) / 2}px 20px 20px`, background: '#1E5A96', padding: 12, boxSizing: 'border-box', transform: `rotate(${rotate}deg)`, boxShadow: '0 18px 40px rgba(18,62,115,0.35)'}}>
				<div style={{width: w, height: h, position: 'relative', overflow: 'hidden', borderRadius: `${w / 2}px ${w / 2}px 10px 10px`}}>{inner}</div>
			</div>
		);
	return (
		<div style={{width: w, height: h, position: 'relative', overflow: 'hidden', borderRadius: kind === 'phone' ? 28 : 36, transform: `rotate(${rotate}deg)`, boxShadow: '0 18px 40px rgba(0,0,0,0.35)', border: '6px solid #fff'}}>
			{inner}
		</div>
	);
};

/** Assombrissement haut/bas pour lire le texte sur la vidéo. */
export const Scrim: React.FC<{top?: number; bottom?: number}> = ({top = 0.5, bottom = 0.5}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,${top}) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 58%, rgba(0,0,0,${bottom}) 100%)`}} />
);

/** Plan vidéo plein cadre + légende en bas de la zone utile. */
export const RushShot: React.FC<{src?: string; photo?: string; trim?: number; rate?: number; title?: string; sub?: string; n?: number; pos?: string; top?: React.ReactNode}> = ({
	src,
	photo,
	trim,
	rate,
	title,
	sub,
	n,
	pos,
	top,
}) => {
	const {vertical, top: st, h} = useStage();
	const f = useCurrentFrame();
	const s = interpolate(f, [0, 8], [1.08, 1], {extrapolateRight: 'clamp'});
	const low = vertical ? st + h - 250 : 1350 - 300;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{transform: `scale(${s})`}}>{src ? <Clip src={src} trim={trim} rate={rate} pos={pos} /> : <Photo src={photo!} pos={pos} />}</AbsoluteFill>
			<Scrim top={0.45} bottom={0.55} />
			{top ? <Abs top={vertical ? st + 100 : 110}>{top}</Abs> : null}
			{title ? (
				<Abs top={low} left={60} right={60}>
					<Caption title={title} sub={sub} n={n} />
				</Abs>
			) : null}
		</AbsoluteFill>
	);
};

/** Produit en vedette (détouré, flottant) + nom + rôle, avec option polaroid du vrai produit. */
export const ProductHero: React.FC<{k: PKey; n?: number; role: string; real?: string; realTrim?: number}> = ({k, n, role, real, realTrim}) => {
	const {th, k: tk} = useTheme();
	const {vertical} = useStage();
	const f = useCurrentFrame();
	const float = Math.sin(f / 14) * 8;
	return (
		<AbsoluteFill>
			<ThemeBg t={tk} />
			<Stage>
				<Abs top={vertical ? 110 : 120}>
					<In at={0} kind="drop">
						<div style={{position: 'relative'}}>
							<T size={84} color={th.ink} font={th.display} weight={th.dWeight} style={{whiteSpace: 'nowrap'}}>
								{byKey(k).name}
							</T>
							{n !== undefined ? <Badge n={n} size={74} style={{top: -30, right: -70}} /> : null}
						</div>
					</In>
				</Abs>
				<Abs top={vertical ? 250 : 300} left={real ? 40 : 0} right={real ? undefined : 0} center={!real}>
					<In at={4} kind="zoom">
						<div style={{transform: `translateY(${float}px)`}}>
							<Prod k={k} w={real ? 520 : 760} h={vertical ? 470 : 560} />
						</div>
					</In>
				</Abs>
				{real ? (
					<Abs top={vertical ? 270 : 330} right={50}>
						<In at={12} kind="right">
							<Framed src={real} trim={realTrim} w={330} h={420} kind="polaroid" rotate={4} />
						</In>
					</Abs>
				) : null}
				<Abs top={vertical ? 760 : 960} left={60} right={60}>
					<KText text={role} size={50} display={false} delay={14} stagger={3} color={th.sub} accent={th.accent} />
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

/** Carte texte plein écran (typographie animée). */
export const TextCard: React.FC<{text: string; sub?: string; size?: number; marker?: string; children?: React.ReactNode}> = ({text, sub, size = 96, marker, children}) => {
	const {k} = useTheme();
	const {vertical} = useStage();
	return (
		<AbsoluteFill>
			<ThemeBg t={k} />
			<Stage>
				<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: vertical ? '120px 50px 60px' : '80px 60px'}}>
					<KText text={text} size={size} marker={marker} />
					{sub ? <KText text={sub} size={size * 0.45} display={false} delay={12} stagger={2} /> : null}
					{children}
				</div>
			</Stage>
		</AbsoluteFill>
	);
};

// ---------------- transitions ----------------

const CutFx: React.FC<{kind: CutKind; at: number; th: Theme}> = ({kind, at, th}) => {
	const f = useCurrentFrame();
	const d = f - at;
	if (d < -10 || d > 10) return null;
	const p = (d + 10) / 20; // 0 → 1, couverture totale à 0.5
	if (kind === 'fade') {
		const o = 1 - Math.abs(d) / 9;
		return <AbsoluteFill style={{background: '#000', opacity: Math.max(0, o), zIndex: 80}} />;
	}
	if (kind === 'arch') {
		const s = d <= 0 ? interpolate(d, [-10, 0], [0, 2.8]) : 2.8;
		const o = d <= 0 ? 1 : interpolate(d, [0, 10], [1, 0]);
		return (
			<AbsoluteFill style={{zIndex: 80, opacity: o, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'}}>
				<div style={{width: 900, height: 1300, borderRadius: '450px 450px 0 0', background: th.accent, transform: `scale(${s})`, transformOrigin: 'bottom center', border: '14px solid #fff', boxSizing: 'border-box'}} />
			</AbsoluteFill>
		);
	}
	if (kind === 'scan') {
		const y = interpolate(d, [-10, 10], [-100, 2050]);
		const o = 1 - Math.abs(d) / 10;
		return (
			<AbsoluteFill style={{zIndex: 80, pointerEvents: 'none'}}>
				<AbsoluteFill style={{background: '#030A18', opacity: Math.max(0, o) * 0.85}} />
				<div style={{position: 'absolute', left: 0, right: 0, top: y, height: 6, background: th.accent, boxShadow: `0 0 40px 12px ${th.accent}`}} />
			</AbsoluteFill>
		);
	}
	// bande qui traverse l'écran (papier déchiré, bloc néo-brutal, aplat)
	const W = 1080;
	const x = interpolate(p, [0, 1], [W, -1.6 * W]);
	const torn = 'polygon(4% 0%, 0% 6%, 3% 13%, 0% 21%, 4% 29%, 1% 37%, 3% 45%, 0% 54%, 4% 62%, 1% 71%, 3% 79%, 0% 88%, 4% 95%, 1% 100%, 100% 100%, 96% 94%, 100% 86%, 97% 77%, 100% 69%, 96% 60%, 99% 52%, 97% 43%, 100% 35%, 96% 26%, 99% 17%, 97% 8%, 100% 0%)';
	const bg = kind === 'paper' ? '#E9D3AE' : kind === 'slam' ? '#0A0A0A' : th.accent;
	return (
		<div style={{position: 'absolute', top: -200, bottom: -200, left: x, width: 1.6 * W, zIndex: 80, transform: kind === 'slam' ? 'skewX(-12deg)' : undefined, background: bg, clipPath: kind === 'paper' ? torn : undefined, boxShadow: '0 0 60px rgba(0,0,0,0.35)'}}>
			{kind === 'slam' ? <div style={{position: 'absolute', top: 0, bottom: 0, left: '46%', width: 60, background: '#FFD43B'}} /> : null}
			{kind === 'paper' ? <AbsoluteFill style={{opacity: 0.25, backgroundImage: 'radial-gradient(#8a6a3c 1px, transparent 1.5px)', backgroundSize: '9px 9px'}} /> : null}
		</div>
	);
};

// ---------------- barre de progression, rappel d'offre ----------------

const Progress: React.FC<{total: number; th: Theme}> = ({total, th}) => {
	const f = useCurrentFrame();
	const {vertical, top} = useStage();
	if (f >= total) return null;
	const y = vertical ? top - 26 : 18;
	return (
		<div style={{position: 'absolute', left: 70, right: 70, top: y, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.35)', overflow: 'hidden', zIndex: 90, boxShadow: '0 1px 6px rgba(0,0,0,0.25)'}}>
			<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(f / total) * 100}%`, background: th.progress, borderRadius: 4}} />
		</div>
	);
};

const MidOffer: React.FC<{at: number; dur?: number; th: Theme}> = ({at, dur = 100, th}) => {
	const f = useCurrentFrame();
	const {vertical, top} = useStage();
	if (f < at || f > at + dur) return null;
	const p = ease(f, at, at + 10) * (1 - ease(f, at + dur - 10, at + dur));
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: (vertical ? top : 40) + 4, display: 'flex', justifyContent: 'center', zIndex: 85, opacity: p, transform: `translateY(${(1 - p) * -40}px)`}}>
			<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 14, background: th.footBg, borderRadius: 999, padding: '6px 28px 10px', boxShadow: '0 10px 24px rgba(0,0,0,0.35)', border: `3px solid ${th.footAccent}`}}>
				<T size={36} color="#fff">الباك كامل بـ</T>
				<T size={40} color={th.footAccent}><N style={{fontSize: 44}}>{O.price}</N> د.ت</T>
				<span style={{width: 8, height: 8, background: '#fff', opacity: 0.6}} />
				<T size={32} color="#fff">تخلّص كي يوصلك</T>
			</div>
		</div>
	);
};

// ---------------- écran de fin ----------------

const CHECKS = ['5 قطع في باك واحد', 'الخلاص عند الاستلام', 'توصيل لكامل ولايات تونس'];

export const EndCard5: React.FC<{title?: string}> = ({title = 'الباك الكامل للشعر واللحية'}) => {
	const {k, th} = useTheme();
	const {vertical} = useStage();
	const onDark = ['tech', 'edito', 'doc'].includes(k);
	const boxBg = k === 'brutal' ? '#0A0A0A' : onDark ? th.accent : '#fff';
	const boxInk = k === 'brutal' ? '#FFD43B' : onDark ? th.footBg : th.ink;
	return (
		<AbsoluteFill>
			<ThemeBg t={k} />
			<Below>
				<In at={2} kind="up" dist={200}>
					<div style={{display: 'flex', justifyContent: 'center', paddingTop: 20}}>
						<Pack W={1000} H={620} shadow="rgba(0,0,0,0.3)" />
					</div>
				</In>
			</Below>
			<Stage>
				<Abs top={vertical ? 30 : 40} left={50} right={50}>
					<KText text={title} size={vertical ? 66 : 70} delay={0} />
				</Abs>
				{!vertical ? (
					<Abs top={180}>
						<In at={4} kind="up" dist={120}>
							<Pack W={780} H={430} shadow="rgba(0,0,0,0.3)" />
						</In>
					</Abs>
				) : null}
				<Abs top={vertical ? 150 : 640}>
					<In at={10} kind="zoom">
						<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 20}}>
							<T size={54} color={th.ink} font={th.display} weight={th.dWeight}><N>5</N> قطع بـ</T>
							<div style={{background: boxBg, borderRadius: k === 'brutal' ? 0 : 30, padding: '0 40px', boxShadow: k === 'brutal' ? '10px 10px 0 #E2343B' : '0 14px 0 rgba(0,0,0,0.18)', border: k === 'brutal' ? '5px solid #0A0A0A' : undefined}}>
								<T size={150} color={boxInk} style={{lineHeight: 1.25}}><N style={{fontSize: 160}}>{O.price}</N> د.ت</T>
							</div>
						</div>
					</In>
				</Abs>
				<Abs top={vertical ? 400 : 880}>
					<In at={20} kind="fade"><StrikeAnim at={24} size={50} color={th.ink} /></In>
				</Abs>
				<Abs top={vertical ? 490 : 945} right={vertical ? 90 : 70} center={false}>
					<div dir="rtl" style={{display: 'flex', flexDirection: vertical ? 'column' : 'column', gap: 12}}>
						{CHECKS.map((c, i) => (
							<In key={c} at={34 + i * 8} kind="right">
								<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
									<div style={{width: 50, height: 50, borderRadius: '50%', background: '#2FA35A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<IconCheck size={32} color="#fff" />
									</div>
									<T size={40} color={th.ink} font={th.body} weight={800}>{c}</T>
								</div>
							</In>
						))}
					</div>
				</Abs>
				<Abs top={vertical ? 720 : 1125}>
					<CtaAnim at={64} size={60} bg={th.ctaBg} color={th.ctaInk} />
				</Abs>
				<Abs top={vertical ? 889 : 1236} left={0} right={0}>
					<FooterPill at={74} bg={th.footBg} accent={th.footAccent} />
				</Abs>
			</Stage>
			<Sfx at={10} s="stamp" v={0.85} />
			<Sfx at={24} s="marker" v={0.7} />
			{CHECKS.map((_, i) => <Sfx key={i} at={34 + i * 8} s="check" v={0.6} />)}
			<Sfx at={64} s="pop4" v={0.5} />
		</AbsoluteFill>
	);
};

// ---------------- montage ----------------

export type Sc = {dur: number; el: React.ReactNode; sfx?: React.ReactNode};

export const longDuration = (scenes: Sc[], endDur: number) => scenes.reduce((a, s) => a + s.dur, 0) + endDur;

/**
 * Enchaîne les scènes avec la transition du thème, la barre de progression,
 * un rappel de l'offre en milieu de vidéo et l'écran de fin.
 */
export const Timeline: React.FC<{t: ThemeKey; scenes: Sc[]; endDur?: number; mid?: number; endTitle?: string; musicVol?: number; musicStart?: number; cutSfxVol?: number; overlay?: React.ReactNode}> = ({
	t,
	scenes,
	endDur = 210,
	mid,
	endTitle,
	musicVol = 0.4,
	musicStart = 0,
	cutSfxVol = 0.55,
	overlay,
}) => {
	const th = THEMES5[t];
	const starts: number[] = [];
	let acc = 0;
	for (const s of scenes) {
		starts.push(acc);
		acc += s.dur;
	}
	const endAt = acc;
	return (
		<ThemeCtx.Provider value={{k: t, th}}>
			<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
				{scenes.map((s, i) => (
					<Sequence key={i} from={starts[i]} durationInFrames={s.dur + (i < scenes.length - 1 ? 0 : 0)}>
						{s.el}
						{s.sfx}
					</Sequence>
				))}
				<Sequence from={endAt}>
					<EndCard5 title={endTitle} />
				</Sequence>
				{[...starts.slice(1), endAt].map((c) => (
					<React.Fragment key={c}>
						<CutFx kind={th.cut} at={c} th={th} />
						<Sequence from={Math.max(0, c - 8)} durationInFrames={40} layout="none">
							<Audio src={staticFile(th.cutSfx)} volume={cutSfxVol} />
						</Sequence>
					</React.Fragment>
				))}
				{overlay ? <Sequence from={0} durationInFrames={endAt}>{overlay}</Sequence> : null}
				<Progress total={endAt} th={th} />
				{mid !== undefined ? <MidOffer at={mid} th={th} /> : null}
				<Music src={th.music} vol={musicVol} start={musicStart} />
			</AbsoluteFill>
		</ThemeCtx.Provider>
	);
};
