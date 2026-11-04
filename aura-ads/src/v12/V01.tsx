import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IconPhone, IconTruck} from '../components/Icons';
import {F} from '../theme/brand';
import {Clip, FmtProvider, useStage} from '../v4/kit';
import {Sfx8} from '../v8/sound8';
import {theme} from '../v10/theme10';

/** Effet sonore légèrement en avance sur l'image (règle du skill : un son en retard paraît décalé). */
const Sfx: React.FC<React.ComponentProps<typeof Sfx8>> = ({at, ...r}) => <Sfx8 at={Math.max(0, at - theme.sfxLead)} {...r} />;
import {Blink, Cam, Fill, Grade, Grain, Kicker, P, Push, Rays, Slam, Vignette, b, tw, typeOn, useShake} from '../v10/kin10';

/**
 * V12 · V01 « offre », accroche h1 (STOP) : pack de 4 (sans applicateur), 39 DT au lieu de 64, livraison 8 DT.
 * Une seule prise de voix derja (public/voice/v12/v01_h1.wav) ; chaque produit en écran partagé :
 * l'homme qui l'utilise (moitié haute, ou gauche en 4:5) + la nouvelle photo du produit.
 * Style et couches de la V10/V11 (skills remotion-motion-graphics + ffmpeg-skill).
 */

const LEAD = 2;
const useLay = () => {
	const {vertical, top, h, W, H} = useStage();
	const cy = vertical ? top + h / 2 : H / 2;
	return {vertical, top, h, W, H, cy};
};

/** Texte latin (chiffres) qui claque. */
const Num: React.FC<{
	at: number;
	text: string;
	y: number;
	size: number;
	color: string;
	until?: number;
}> = ({at, text, y, size, color, until}) => {
	const f = useCurrentFrame();
	if (f < at || (until !== undefined && f >= until)) return null;
	const sl = tw(f, at, 5);
	const s = (1.7 - 0.7 * sl) * (1 + 0.04 * ((f - at) / 30));
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: y - size * 0.6,
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<div
				dir="ltr"
				style={{
					fontFamily: F.latin,
					fontWeight: 800,
					fontSize: size,
					lineHeight: 1.1,
					color,
					transform: `scale(${s})`,
					filter: sl < 0.95 ? `blur(${(1 - sl) * 12}px)` : undefined,
				}}
			>
				{text}
			</div>
		</div>
	);
};

// ---------------------------------------------------------------- minutage (mots de la voix, images à 30 i/s)

const T_INTRO = 60; // « باك Aura Bio فيه »
const T_PROD = [97, 117, 140, 162]; // سدر · زيت · درما · بروس
const T_ALL = 184; // « الكل »
const VOICE_END = 340;
export const V01_DUR = 400;
// offre (relatif à T_ALL)
const T_PRICE = 196 - T_ALL; // « تسعة وثلاثين »
const T_STRIKE = 231 - T_ALL; // « عوض أربعة وستين »
const T_DELIV = 257 - T_ALL; // « التوصيل بثمنية دينارات »
const T_COD = 295 - T_ALL; // « تخلّص كي يوصلك »
const T_CTA = 317 - T_ALL; // « انزل على كومندي »
const END = V01_DUR - T_ALL;

// ---------------------------------------------------------------- accroche h1 : STOP

const StopSign: React.FC<{size: number}> = ({size}) => {
	const f = useCurrentFrame();
	const p = f === 0 ? 1 : spring({frame: f, fps: 30, config: theme.spring.bouncy});
	const pts = Array.from({length: 8}, (_, i) => {
		const a = (Math.PI / 8) * (2 * i + 1);
		return `${50 + 48 * Math.cos(a)},${50 + 48 * Math.sin(a)}`;
	}).join(' ');
	return (
		<div style={{width: size, height: size, transform: `scale(${(0.85 + 0.15 * p) * (1 + Math.sin(f / 6) * 0.02)}) rotate(${-6 + Math.sin(f / 10) * 2}deg)`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'}}>
			<svg viewBox="0 0 100 100" width={size} height={size}>
				<polygon points={pts} fill="#D7263D" stroke="#fff" strokeWidth={4} />
				<text x="50" y="62" textAnchor="middle" fontFamily={F.latin} fontWeight={800} fontSize={27} fill="#fff">STOP</text>
			</svg>
		</div>
	);
};

const Hook12: React.FC = () => {
	const {vertical, cy, W} = useLay();
	const sh = useShake([0, 12, 46], 18);
	return (
		<AbsoluteFill>
			<Cam id="h1" dur={T_INTRO} whipIn={null} whipOut="x" push={0.1}>
				<Fill g="bg" />
				<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: cy - (vertical ? 560 : 520), display: 'flex', justifyContent: 'center'}}>
						<StopSign size={vertical ? 420 : 340} />
					</div>
					<Slam at={0} from={1.1} text="ما تشريش" y={cy + (vertical ? 60 : 10)} max={190} width={W * 0.8} />
					<Slam at={44 - LEAD} text="بالقطعة!" y={cy + (vertical ? 290 : 230)} max={210} color={P.accent} />
				</AbsoluteFill>
				<Rays at={44 - LEAD} y={cy + 300} />
			</Cam>
			<Blink at={44 - LEAD} len={3} />
			<Sfx at={0} s="impact" v={0.6} />
			<Sfx at={44} s="hit" v={0.5} />
			<Sfx at={T_INTRO - 5} s="whoosh" v={0.4} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- « باك Aura Bio فيه… »

const Intro12: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical, top, cy} = useLay();
	const dur = T_PROD[0] - T_INTRO;
	const packH = vertical ? 520 : 420;
	return (
		<AbsoluteFill>
			<Cam id="in" dur={dur} whipIn="x" whipOut="y" push={0.08}>
				<Fill g="paper" />
				<Kicker at={0} text="باك AURA BIO" y={vertical ? top + 40 : 50} size={78} bg={P.ink} color={P.accent} />
				<div style={{position: 'absolute', left: 0, right: 0, top: cy - packH / 2 + 30, height: packH}}>
					{PACK.map((it, k) => {
						const p = f < 2 + k * 3 ? 0 : spring({frame: f - 2 - k * 3, fps: 30, config: theme.spring.bouncy});
						return (
							<div key={k} style={{position: 'absolute', left: '50%', bottom: 0, zIndex: it.z, opacity: Math.min(1, p * 1.5), transform: `translateX(calc(-50% + ${it.dx * 1.15}px)) translateY(${(1 - p) * 400 + Math.sin((f + k * 9) / 14) * 5}px) scale(${0.5 + 0.5 * p})`}}>
								<Img src={staticFile(it.src)} style={{height: packH * it.h, width: 'auto', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.35))'}} />
							</div>
						);
					})}
				</div>
				<Slam at={22} text="فيه…" y={cy + packH / 2 + (vertical ? 150 : 110)} max={200} color={P.ink} shadow={false} />
			</Cam>
			{[2, 5, 8, 11].map((d, k) => (
				<Sfx key={k} at={d} s={`pop${k + 1}` as 'pop1'} v={0.3} />
			))}
			<Sfx at={dur - 5} s="whoosh" v={0.4} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- écran partagé : l'homme qui utilise + le produit

type Split = {name: string; tag: string; img: string; clip: string; trim: number; pos: string; rate?: number; ground: 'paper' | 'accent'};
const SPLITS: Split[] = [
	{name: 'سدر طبيعي', tag: 'ينظّف وينحّي القشرة', img: 'products/v8/sidr.png', clip: 'rushs/perso/sidr_front.mp4', trim: 0.6, pos: '50% 40%', ground: 'paper'},
	{name: 'زيت إكليل الجبل', tag: 'ينشّط الدورة الدموية', img: 'products/v8/huile.png', clip: 'rushs/perso/huile_goutte.mp4', trim: 0.2, pos: '50% 50%', ground: 'accent'},
	{name: 'ديرما رولر 540', tag: 'قبل الزيت', img: 'products/v8/derma.png', clip: 'rushs/derma_roll_crown.mp4', trim: 0.5, pos: '50% 50%', ground: 'paper'},
	{name: 'بروس الماساج', tag: 'ماساج لجلدة الراس', img: 'products/v8/brosse.png', clip: 'rushs/perso/brosse_massage.mp4', trim: 0.4, pos: '50% 50%', ground: 'accent'},
];

const SplitShot: React.FC<{s: Split; i: number; dur: number}> = ({s, i, dur}) => {
	const f = useCurrentFrame();
	const {vertical, W, H, top, h} = useLay();
	// 9:16 : la ligne de partage au milieu de la zone utile ; 4:5 : moitié gauche / droite
	const splitY = vertical ? top + h * 0.5 : 0;
	const enter = tw(f, 0, 6, theme.ease.out);
	const sg = i % 2 === 0 ? 1 : -1;
	const half: React.CSSProperties = vertical ? {position: 'absolute', left: 0, right: 0} : {position: 'absolute', top: 0, bottom: 0};
	const pp = spring({frame: f - 2, fps: 30, config: theme.spring.bouncy});
	const prodH = vertical ? (H - splitY) * 0.62 : H * 0.55;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{/* vidéo d'utilisation */}
			<div style={{...half, ...(vertical ? {top: 0, height: splitY} : {left: 0, width: W / 2}), overflow: 'hidden', transform: vertical ? `translateX(${sg * (1 - enter) * W}px)` : `translateY(${sg * (1 - enter) * H}px)`}}>
				<Clip src={s.clip} trim={s.trim} rate={s.rate} pos={s.pos} zoom={1.1} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.25), transparent 30%, transparent 70%, rgba(0,0,0,0.35))'}} />
			</div>
			{/* le produit (nouvelle photo) */}
			<div style={{...half, ...(vertical ? {top: splitY, bottom: 0} : {right: 0, width: W / 2}), overflow: 'hidden', transform: vertical ? `translateX(${-sg * (1 - enter) * W}px)` : `translateY(${-sg * (1 - enter) * H}px)`}}>
				<Fill g={s.ground} />
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: vertical ? 'flex-end' : 'center', justifyContent: 'center', paddingBottom: vertical ? 70 : 0}}>
					<Img src={staticFile(s.img)} style={{height: prodH, maxWidth: (vertical ? W : W / 2) * 0.62, width: 'auto', objectFit: 'contain', transform: `translateY(${(1 - pp) * 120 + Math.sin(f / 8) * 4}px) scale(${0.8 + 0.2 * pp}) rotate(${(1 - pp) * sg * 10}deg)`, filter: 'drop-shadow(0 22px 30px rgba(0,0,0,0.4))'}} />
				</div>
			</div>
			{/* ligne de partage + nom du produit dessus */}
			<div style={{position: 'absolute', ...(vertical ? {left: 0, right: 0, top: splitY - 5, height: 10} : {top: 0, bottom: 0, left: W / 2 - 5, width: 10}), background: P.accent, boxShadow: '0 0 30px rgba(0,0,0,0.5)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? splitY - 70 : H - 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
				<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16, background: P.ink, borderRadius: 18, padding: '4px 30px 12px', boxShadow: '0 14px 30px rgba(0,0,0,0.45)', opacity: Math.min(1, pp * 1.5), transform: `scale(${(0.7 + 0.3 * pp) * (1 + Math.sin(f / 9) * 0.015)})`}}>
					<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 64, color: P.accent}}>{i + 1}</span>
					<span style={{fontFamily: F.display, fontSize: 84, color: P.paper, whiteSpace: 'nowrap'}}>{s.name}</span>
				</div>
				<div dir="rtl" style={{background: P.paper, color: P.ink, fontFamily: F.body, fontWeight: 900, fontSize: 42, padding: '0 22px 6px', borderRadius: 12, opacity: tw(f, 6, 5), transform: `translateY(${(1 - tw(f, 6, 5)) * 20}px)`}}>
					{s.tag}
				</div>
			</div>
			<Blink at={0} len={2} />
			{f >= dur - 3 ? <AbsoluteFill style={{background: '#fff', opacity: 0.25 * tw(f, dur - 3, 3)}} /> : null}
		</AbsoluteFill>
	);
};

const Products12: React.FC = () => (
	<AbsoluteFill>
		{SPLITS.map((s, i) => {
			const from = T_PROD[i] - LEAD - T_PROD[0];
			const to = (i + 1 < T_PROD.length ? T_PROD[i + 1] : T_ALL) - LEAD - T_PROD[0];
			return (
				<Sequence key={i} from={Math.max(0, from)} durationInFrames={to - Math.max(0, from)}>
					<SplitShot s={s} i={i} dur={to - Math.max(0, from)} />
				</Sequence>
			);
		})}
		{T_PROD.map((t, i) => (
			<React.Fragment key={i}>
				<Sfx at={t - T_PROD[0]} s="swipe" v={0.4} />
				<Sfx at={t - T_PROD[0] + 2} s={`pop${i + 1}` as 'pop1'} v={0.3} />
			</React.Fragment>
		))}
	</AbsoluteFill>
);

const PACK = [
	{src: 'products/v8/derma.png', h: 0.5, dx: -300, z: 2},
	{src: 'products/v8/huile.png', h: 0.88, dx: -105, z: 1},
	{src: 'products/v8/sidr.png', h: 1, dx: 95, z: 3},
	{src: 'products/v8/brosse.png', h: 0.46, dx: 300, z: 4},
];

const Pill: React.FC<{at: number; y: number; children: React.ReactNode; bg?: string; color?: string}> = ({at, y, children, bg = P.paper, color = P.ink}) => {
	const f = useCurrentFrame();
	if (f < at) return null;
	const p = spring({frame: f - at, fps: 30, config: theme.spring.snappy});
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + 0.08 * p})`}}>
			<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16, background: bg, color, fontFamily: F.body, fontWeight: 900, fontSize: 54, padding: '6px 32px 14px', borderRadius: 16, boxShadow: '0 10px 24px rgba(0,0,0,0.25)'}}>
				{children}
			</div>
		</div>
	);
};

const Offer12: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical, top, h, H, cy} = useLay();
	const ground = f < T_PRICE - LEAD ? 'paper' : f < T_DELIV - LEAD ? 'accent' : f < T_COD - LEAD ? 'bg' : f < T_CTA - LEAD ? 'paper' : 'accent';
	const sh = useShake([T_PRICE, T_DELIV, T_COD, T_CTA].map((t) => t - LEAD), 16);
	const packH = vertical ? 430 : 360;
	const arrowY = vertical ? top + h - 150 : H - 200;
	const strike = tw(f, T_STRIKE + 4, 8);
	const bounce = Math.abs(Math.sin((f - T_CTA) / 5)) * 40;
	const L = (t: number) => t - LEAD;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam id="end" dur={END} whipIn="y" whipOut={null} push={0.06} roll={0.6}>
				<Fill g={ground} />
				<AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
					{/* « الكل » : le pack de 4 */}
					{f < L(T_PRICE) ? (
						<>
							<Slam at={0} text="الكل" y={vertical ? cy - 120 : cy - 200} max={300} color={P.ink} shadow={false} />
							<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? cy + 140 : cy + 90, height: packH}}>
								{PACK.map((it, k) => {
									const p = f < k * 2 ? 0 : spring({frame: f - k * 2, fps: 30, config: {damping: 12, stiffness: 260, mass: 0.5}});
									return (
										<div key={k} style={{position: 'absolute', left: '50%', bottom: 0, zIndex: it.z, opacity: Math.min(1, p * 1.5), transform: `translateX(calc(-50% + ${it.dx}px)) translateY(${(1 - p) * 400 + Math.sin((f + k * 9) / 18) * 4}px) scale(${0.5 + 0.5 * p})`}}>
											<Img src={staticFile(it.src)} style={{height: packH * it.h, width: 'auto', filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.4))'}} />
										</div>
									);
								})}
							</div>
						</>
					) : null}
					{/* le prix : 39 au lieu de 64 */}
					{f >= L(T_PRICE) && f < L(T_DELIV) ? (
						<>
							<Num at={L(T_PRICE)} text="39" y={cy - 40} size={vertical ? 560 : 480} color={P.ink} />
							<Slam at={L(T_PRICE) + 4} text="دينار برك" y={cy + (vertical ? 280 : 230)} max={170} color={P.ink} shadow={false} />
							{f >= L(T_STRIKE) ? (
								<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? top + 40 : 40, display: 'flex', justifyContent: 'center'}}>
									<div style={{position: 'relative', display: 'inline-block', opacity: tw(f, L(T_STRIKE), 4), transform: `scale(${1.3 - 0.3 * tw(f, L(T_STRIKE), 5)})`}}>
										<div dir="rtl" style={{fontFamily: F.display, fontSize: 150, color: P.ink, whiteSpace: 'nowrap', opacity: 0.85}}>
											عوض <span style={{fontFamily: F.latin, fontWeight: 800}}>64</span>
										</div>
										<div style={{position: 'absolute', right: -20, top: '52%', height: 18, width: `calc(${strike * 100}% + 40px)`, background: theme.colors.danger, borderRadius: 9, transform: 'rotate(-8deg)', transformOrigin: 'right center'}} />
									</div>
								</div>
							) : null}
						</>
					) : null}
					{/* livraison 8 DT */}
					{f >= L(T_DELIV) && f < L(T_COD) ? (
						<>
							<Slam at={L(T_DELIV)} text="التوصيل" y={cy - 260} max={250} echo />
							<Num at={L(T_DELIV) + 12} text="8" y={cy + 30} size={vertical ? 460 : 400} color={P.accent} />
							<Slam at={L(T_DELIV) + 18} text="دينارات" y={cy + (vertical ? 290 : 250)} max={170} />
						</>
					) : null}
					{/* paiement à la livraison */}
					{f >= L(T_COD) && f < L(T_CTA) ? (
						<>
							<Slam at={L(T_COD)} text="تخلّص" y={cy - 190} max={300} color={P.ink} shadow={false} echo echoColor={P.ink} />
							<Slam at={L(T_COD) + 10} text="كي يوصلك" y={cy + 80} max={260} color={P.ink} shadow={false} />
							<Pill at={L(T_COD) + 14} y={cy + 270} bg={P.ink} color={P.paper}>
								<IconTruck size={58} color={P.paper} /> توصيل لكامل الولايات
							</Pill>
						</>
					) : null}
					{/* appel à l'action : « انزل على كومندي » + flèche vers le bouton */}
					{f >= L(T_CTA) ? (
						<>
							<Slam at={L(T_CTA)} text="انزل على كومندي" y={vertical ? cy - 270 : cy - 320} max={210} color={P.ink} shadow={false} />
							<Pill at={L(T_CTA) + 8} y={vertical ? cy - 90 : cy - 150} bg={P.ink} color={P.paper}>
								<span style={{fontFamily: F.latin, fontWeight: 800, fontSize: 64, color: P.accent}}>39</span> د.ت
								<span style={{opacity: 0.5}}>·</span> التوصيل <span style={{fontFamily: F.latin, fontWeight: 800}}>8</span> د.ت
							</Pill>
							<Pill at={L(T_CTA) + 14} y={vertical ? cy + 40 : cy - 20}>
								تخلّص كي يوصلك
							</Pill>
							<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? cy + 170 : cy + 110, display: 'flex', justifyContent: 'center', opacity: tw(f, L(T_CTA) + 20, 5)}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: F.latin, fontWeight: 800, fontSize: 52, color: P.ink}} dir="ltr">
									<IconPhone size={50} color={P.ink} /> 50 500 051
								</div>
							</div>
							<div style={{position: 'absolute', left: 0, right: 0, top: arrowY, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${bounce}px)`, opacity: tw(f, L(T_CTA) + 6, 4)}}>
								{[0, 1].map((k) => (
									<svg key={k} width={150} height={93} viewBox="0 0 100 62" style={{marginTop: k ? -34 : 0, opacity: k ? 0.55 : 1}}>
										<path d="M8 8 L50 50 L92 8" fill="none" stroke={P.ink} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								))}
							</div>
						</>
					) : null}
				</AbsoluteFill>
				<Rays at={L(T_PRICE)} color={P.ink} />
				<Rays at={L(T_CTA)} color={P.ink} />
			</Cam>
			<Blink at={L(T_PRICE)} len={3} />
			<Blink at={L(T_DELIV)} len={3} />
			<Blink at={L(T_COD)} len={3} />
			<Blink at={L(T_CTA)} len={3} />
			<Sfx at={0} s="whoosh" v={0.4} />
			{[4, 8, 12, 16].map((d, k) => (
				<Sfx key={k} at={d} s={`pop${k + 1}` as 'pop1'} v={0.3} />
			))}
			<Sfx at={T_PRICE} s="impact" v={0.6} />
			<Sfx at={T_PRICE + 4} s="coin" v={0.4} />
			<Sfx at={T_STRIKE + 4} s="scribble" v={0.55} />
			<Sfx at={T_DELIV} s="hit" v={0.45} />
			<Sfx at={T_COD} s="hit" v={0.5} />
			<Sfx at={T_COD + 14} s="ding" v={0.35} />
			<Sfx at={T_CTA} s="impact" v={0.55} />
			<Sfx at={T_CTA + 6} s="shimmer" v={0.3} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- la vidéo

const Music12: React.FC = () => (
	<Audio
		src={staticFile('audio/v9/music9.wav')}
		volume={(f) => {
			const up = interpolate(f, [VOICE_END, VOICE_END + 10], [0.16, 0.5], {easing: theme.ease.out, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
			const out = interpolate(f, [V01_DUR - 20, V01_DUR - 1], [1, 0], {easing: theme.ease.in, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
			return up * out;
		}}
	/>
);

export const V01: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Sequence durationInFrames={T_INTRO}>
			<Hook12 />
		</Sequence>
		<Sequence from={T_INTRO} durationInFrames={T_PROD[0] - LEAD - T_INTRO}>
			<Intro12 />
		</Sequence>
		<Sequence from={T_PROD[0] - LEAD} durationInFrames={T_ALL - T_PROD[0]}>
			<Products12 />
		</Sequence>
		<Sequence from={T_ALL - LEAD} durationInFrames={END + LEAD}>
			<Offer12 />
		</Sequence>
		<Grade />
		<Grain />
		<Vignette a={0.3} />
		<Audio src={staticFile('voice/v12/v01_h1.wav')} volume={1.4} />
		<Music12 />
	</AbsoluteFill>
);

export const V12_VIDEOS = [
	{id: 'W12-V01-offre-h1-9x16', fmt: '9x16' as const, dur: V01_DUR, C: V01},
	{id: 'W12-V01-offre-h1-4x5', fmt: '4x5' as const, dur: V01_DUR, C: V01},
];

export const V12Video: React.FC<{id: string}> = ({id}) => {
	const e = V12_VIDEOS.find((v) => v.id === id)!;
	return (
		<FmtProvider fmt={e.fmt}>
			<e.C />
		</FmtProvider>
	);
};
