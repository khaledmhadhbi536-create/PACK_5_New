import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {IconCheck} from '../components/Icons';
import {C} from '../theme/brand';
import {OFFER2 as O} from '../v2/offer';
import {Badge, N, RED, Rays, Stars, T, THEMES, YELLOW} from '../v2/WinStill';
import {byKey, PKey, Pack, Prod, TITLE} from '../v3/V3Still';
import {Abs, Below, Clip, CtaAnim, FooterPill, In, Music, Pulse, Sfx, Spin, Stage, StrikeAnim, Tag, useStage} from '../v4/kit';
import {V01, V01_DUR} from '../v4/V01';
import {V03, V03_DUR} from '../v4/Offers';
import {Breathe, MASSAGE, WASH} from '../v6/kit6';

/**
 * Courtes V7 : copie de V6 (V6 reste intact). Seul V08 change : étapes huile, massage et sidr
 * filmées avec la personne des rushs « perso ».
 *
 * Rappel V6 :
 *  - V08 : étapes « massage » et « lavage » sur un plan net (bandeau 16:9 sur fond flouté).
 *  - V01, V03, V05 : 3 accroches différentes pour les 2 premières secondes.
 * Chaque accroche est lisible dès la frame 0.
 */

// ---------------------------------------------------------------- briques (copiées de V4)

const Punch: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, 7], [1.1, 1], {extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

const Photo: React.FC<{src: string; pos?: string}> = ({src, pos = '50% 50%'}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${1.05 + f * 0.0015})`}} />
		</AbsoluteFill>
	);
};

const Scrim: React.FC<{top?: number; bottom?: number}> = ({top = 0.55, bottom = 0.35}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,${top}) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 62%, rgba(0,0,0,${bottom}) 100%)`}} />
);

const Big: React.FC<{size?: number; color?: string; children: React.ReactNode}> = ({size = 96, color = '#fff', children}) => (
	<T size={size} color={color} style={{textAlign: 'center', lineHeight: 1.15, textShadow: '0 6px 22px rgba(0,0,0,0.75), 0 2px 0 rgba(0,0,0,0.6)'}}>
		{children}
	</T>
);

const ProdTag: React.FC<{n: number; k: PKey; at?: number}> = ({n, k, at = 4}) => (
	<In at={at} kind="pop">
		<div style={{position: 'relative'}}>
			<Tag size={60}>{byKey(k).name}</Tag>
			<Badge n={n} size={78} style={{top: -34, right: -30}} />
		</div>
	</In>
);

/** Plan 16:9 net en bandeau sur fond flouté (version courte). */
const Band: React.FC<{src: string; trim: number; rate: number}> = ({src, trim, rate}) => {
	const {vertical, top, H} = useStage();
	const bandW = vertical ? 960 : 1080;
	const bandH = Math.round((bandW * 9) / 16);
	const bandTop = vertical ? top + 190 : Math.round((H - bandH) / 2) - 110;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: 'blur(28px) brightness(0.55) saturate(0.8)', transform: 'scale(1.15)'}}>
				<Clip src={src} trim={trim} rate={rate} />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: (1080 - bandW) / 2, width: bandW, top: bandTop, height: bandH, overflow: 'hidden', borderRadius: vertical ? 24 : 0, border: vertical ? '4px solid rgba(255,255,255,0.85)' : undefined, borderTop: '4px solid rgba(255,255,255,0.85)', borderBottom: '4px solid rgba(255,255,255,0.85)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)'}}>
				<Clip src={src} trim={trim} rate={rate} zoom={1.06} />
			</div>
		</AbsoluteFill>
	);
};

/** Écran de fin commun (copie de V4). */
const EndCard: React.FC<{title?: React.ReactNode}> = ({
	title = (
		<>
			كل هذا بـ <N style={{fontSize: 110, color: C.goldLight}}>{O.price}</N> دينار
		</>
	),
}) => {
	const {vertical} = useStage();
	const bg = 'radial-gradient(circle at 50% 45%, #34573F 0%, #1C3325 60%, #0E1B13 100%)';
	return (
		<AbsoluteFill style={{background: bg}}>
			<Stars color="#000" opacity={0.12} />
			<Spin speed={0.12}>
				<Rays color="#CDE8B5" opacity={0.12} cy="50%" />
			</Spin>
			<Below>
				<In at={2} kind="up" dist={200}>
					<div style={{display: 'flex', justifyContent: 'center', paddingTop: 20}}>
						<Pack W={1000} H={620} />
					</div>
				</In>
			</Below>
			{vertical ? (
				<Stage>
					<Abs top={10}>
						<In at={0} kind="drop">
							<T size={88} style={{textShadow: '0 6px 18px rgba(0,0,0,0.4)'}}>{title}</T>
						</In>
					</Abs>
					<Abs top={170}>
						<In at={8} kind="up">
							<T size={58}>
								<N>5</N> قطع بـ
							</T>
						</In>
					</Abs>
					<Abs top={265} z={4}>
						<In at={14} kind="zoom">
							<div style={{background: '#FFF3C4', borderRadius: 34, padding: '0 50px', boxShadow: '0 16px 0 rgba(0,0,0,0.25)'}}>
								<T size={170} color="#111" style={{lineHeight: 1.25}}>
									<N style={{fontSize: 180}}>{O.price}</N> د.ت
								</T>
							</div>
						</In>
					</Abs>
					<Abs top={540}>
						<In at={24} kind="fade">
							<StrikeAnim at={28} size={54} />
						</In>
					</Abs>
					<Abs top={650}>
						<CtaAnim at={40} size={62} />
					</Abs>
					<Abs top={889} left={0} right={0}>
						<FooterPill at={50} bg="#0A0F0C" />
					</Abs>
				</Stage>
			) : (
				<Stage>
					<Abs top={40}>
						<In at={0} kind="drop">
							<T size={92} style={{textShadow: '0 6px 18px rgba(0,0,0,0.4)'}}>{title}</T>
						</In>
					</Abs>
					<Abs top={200}>
						<In at={4} kind="up" dist={160}>
							<Pack W={900} H={640} />
						</In>
					</Abs>
					<Abs top={200} left={36} z={6}>
						<In at={14} kind="drop">
							<div style={{width: 230, height: 230, borderRadius: '50%', background: RED, border: '7px solid #fff', boxShadow: '0 16px 40px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)', boxSizing: 'border-box'}}>
								<T size={26}>الباك كامل</T>
								<N style={{fontSize: 96, color: '#fff', lineHeight: 1}}>{O.price}</N>
								<T size={30}>دينار</T>
							</div>
						</In>
					</Abs>
					<Abs top={930} left={50} right={50} center={false}>
						<div dir="rtl" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
							<In at={24} kind="fade">
								<StrikeAnim at={28} size={48} />
							</In>
							<CtaAnim at={40} size={58} />
						</div>
					</Abs>
					<Abs top={1236} left={0} right={0}>
						<FooterPill at={50} bg="#0A0F0C" />
					</Abs>
				</Stage>
			)}
			<Sfx at={0} s="whoosh" v={0.6} />
			<Sfx at={14} s="stamp" v={0.9} />
			<Sfx at={28} s="marker" v={0.75} />
			<Sfx at={36} s="cash" v={0.6} />
		</AbsoluteFill>
	);
};

const useLow = () => {
	const {vertical, top, h} = useStage();
	return vertical ? top + h - 210 : 1350 - 260;
};
const useHigh = () => {
	const {vertical, top} = useStage();
	return vertical ? top + 10 : 60;
};

// ======================= V08 · 4 étapes (plans nets) =======================

type Step = {k: PKey; t: string; s: string; src?: string; photo?: string; trim?: number; rate?: number; band?: boolean};
const STEPS: Step[] = [
	{k: 'derma', t: 'الديرما رولر', s: 'بالشوية على راس نظيف', src: 'rushs/derma_roll_crown.mp4', trim: 0, rate: 1},
	{k: 'huile', t: 'زيت إكليل الجبل', s: 'بمشط الجذور، طول على العروق', src: 'rushs/perso/huile_goutte.mp4', trim: 0, rate: 0.5},
	{k: 'brosse', t: 'ماساج', s: 'بفرشة التدليك، 3 لـ 5 دقايق', src: 'rushs/perso/massage.mp4', trim: 0.3, rate: 1},
	{k: 'sidr', t: 'وقت الغسيل', s: 'سدر بيو وماء دافي', src: 'rushs/perso/sidr_top.mp4', trim: 0.8, rate: 1},
];
const ST = 84;
const V08_END = 205; // écran de fin plus long que V4 pour laisser la voix dire prix et téléphone
export const V08_7_DUR = ST * 4 + V08_END;
export const V08_7: React.FC = () => {
	const low = useLow();
	const high = useHigh();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{STEPS.map((s, i) => (
				<Sequence key={i} from={i * ST} durationInFrames={ST}>
					{s.band ? <Band src={s.src!} trim={s.trim!} rate={s.rate!} /> : <Punch>{s.src ? <Clip src={s.src} trim={s.trim} rate={s.rate} /> : <Photo src={s.photo!} />}</Punch>}
					<Scrim top={0.5} bottom={0.5} />
					<Abs top={low - 40} left={40} right={40} center={false}>
						<In at={i === 0 ? -30 : 3} kind="up">
							<div dir="rtl" style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(255,255,255,0.95)', borderRadius: 30, padding: '14px 26px', boxShadow: '0 14px 30px rgba(0,0,0,0.35)'}}>
								<div style={{width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Prod k={s.k} w={130} h={130} />
								</div>
								<div>
									<T size={56} color="#111">
										{s.t}
									</T>
									<T size={36} color="#555" weight={700}>
										{s.s}
									</T>
								</div>
								<Badge n={i + 1} size={86} style={{top: -36, right: -24}} />
							</div>
						</In>
					</Abs>
				</Sequence>
			))}
			<Sequence from={0} durationInFrames={ST * 4}>
				<Abs top={high}>
					<Big size={86}>
						روتين ساهل في{' '}
						<span style={{color: YELLOW}}>
							<N>4</N> خطوات
						</span>
					</Big>
				</Abs>
				<Abs top={high + 120}>
					<Tag size={40} bg="rgba(255,255,255,0.9)">
						<N>2</N> ولا <N>3</N> مرات في الجمعة
					</Tag>
				</Abs>
			</Sequence>
			<Sequence from={ST * 4}>
				<EndCard
					title={
						<>
							روتين كامل بـ <N style={{fontSize: 110, color: C.goldLight}}>{O.price}</N> دينار
						</>
					}
				/>
			</Sequence>
			<Music src="audio/v4/beat_promo.wav" vol={0.4} start={10} />
			{STEPS.map((_, i) => (
				<React.Fragment key={i}>
					{i > 0 ? <Sfx at={i * ST} s="whoosh" v={0.5} /> : null}
					<Sfx at={i * ST + 3} s={`pop${i + 1}` as 'pop1'} v={0.7} />
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};

// ======================= accroches : éléments graphiques =======================

const HOOK = 60; // 2 secondes

const Cross: React.FC<{size?: number}> = ({size = 90}) => (
	<div style={{width: size, height: size, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid #fff'}}>
		<svg width={size * 0.5} height={size * 0.5} viewBox="0 0 10 10">
			<path d="M1 1L9 9M9 1L1 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
		</svg>
	</div>
);
const Check: React.FC<{size?: number}> = ({size = 90}) => (
	<div style={{width: size, height: size, borderRadius: '50%', background: '#2FA35A', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid #fff'}}>
		<IconCheck size={size * 0.6} color="#fff" />
	</div>
);

/** Panneau « ستوب » octogonal. */
const StopSign: React.FC<{size?: number}> = ({size = 260}) => (
	<div style={{width: size, height: size, background: '#fff', clipPath: 'polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<div style={{width: size - 18, height: size - 18, background: RED, clipPath: 'polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<T size={size * 0.3}>ستوب</T>
		</div>
	</div>
);

/** Fond doré de V01 (rayons qui tournent). */
const GoldBg: React.FC = () => {
	const th = THEMES.or;
	return (
		<AbsoluteFill style={{background: th.bg}}>
			<Spin speed={0.12}>
				<Rays color={th.ray} opacity={0.18} cy="45%" />
			</Spin>
			<Stars color={th.star} opacity={0.12} />
		</AbsoluteFill>
	);
};

/** Pack bien visible : sous la zone utile en 9:16, dans la scène en 4:5. */
const HookPack: React.FC<{top4x5: number; shadow?: string}> = ({top4x5, shadow}) => {
	const {vertical} = useStage();
	return vertical ? (
		<Below>
			<div style={{display: 'flex', justifyContent: 'center', paddingTop: 30}}>
				<Pack W={980} H={600} shadow={shadow} />
			</div>
		</Below>
	) : (
		<Stage>
			<Abs top={top4x5}>
				<Pack W={820} H={500} shadow={shadow} />
			</Abs>
		</Stage>
	);
};

// ---------- V01 (offre exceptionnelle, fond doré) ----------

const V01Hook: React.FC<{v: 1 | 2 | 3}> = ({v}) => {
	const {vertical, y} = useStage();
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<GoldBg />
			<HookPack top4x5={790} />
			<Stage>
				{v === 1 ? (
					<>
						<Abs top={vertical ? y(40) : 40}>
							<div style={{transform: `rotate(${Math.sin(f / 4) * 3}deg)`}}>
								<StopSign size={vertical ? 300 : 280} />
							</div>
						</Abs>
						<Abs top={vertical ? y(400) : 370} left={40} right={40}>
							<Breathe>
								<T size={vertical ? 110 : 104} style={{textAlign: 'center', textShadow: '0 6px 18px rgba(0,0,0,0.45)'}}>
									ما تشريش
									<br />
									<span style={{color: '#FFF3C4'}}>بالقطعة!</span>
								</T>
							</Breathe>
						</Abs>
					</>
				) : null}
				{v === 2 ? (
					<>
						<Abs top={vertical ? y(30) : 40}>
							<T size={84} style={{textShadow: '0 6px 18px rgba(0,0,0,0.45)'}}>شوف الفرق</T>
						</Abs>
						<Abs top={vertical ? y(200) : 200} left={60} right={60} center={false}>
							<div dir="rtl" style={{display: 'flex', flexDirection: 'column', gap: 34}}>
								<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.35)', borderRadius: 30, padding: '10px 40px'}}>
									<T size={60} color="#ddd">بالقطعة</T>
									<div style={{position: 'relative'}}>
										<T size={110} color="#ddd"><N>{O.oldPrice}</N> د.ت</T>
										<div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 14, background: RED, transform: 'rotate(-7deg)', borderRadius: 7}} />
									</div>
									<Cross />
								</div>
								<Breathe amp={0.035} speed={0.25}>
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF3C4', borderRadius: 30, padding: '10px 40px', boxShadow: '0 14px 0 rgba(0,0,0,0.22)'}}>
										<T size={60} color="#111">الباك كامل</T>
										<T size={130} color="#111"><N>{O.price}</N> د.ت</T>
										<Check />
									</div>
								</Breathe>
							</div>
						</Abs>
					</>
				) : null}
				{v === 3 ? (
					<>
						<Abs top={vertical ? y(30) : 50}>
							<div style={{background: RED, padding: '0 40px 10px', borderRadius: 26, boxShadow: '0 12px 0 rgba(0,0,0,0.22)', transform: 'rotate(-2deg)'}}>
								<T size={vertical ? 120 : 110}>
									<N>5</N> قطع
								</T>
							</div>
						</Abs>
						<Abs top={vertical ? y(215) : 220}>
							<T size={vertical ? 96 : 92} style={{whiteSpace: 'nowrap', textShadow: '0 6px 18px rgba(0,0,0,0.45)'}}>
								بسوم قطعة وحدة
							</T>
						</Abs>
						<Abs top={vertical ? y(400) : 380}>
							<div dir="rtl" style={{display: 'flex', gap: 14}}>
								{(['sidr', 'derma', 'huile', 'applicateur', 'brosse'] as PKey[]).map((k, i) => (
									<div key={k} style={{width: 170, height: 170, borderRadius: 26, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.25)', transform: `translateY(${Math.sin(f / 5 + i) * 8}px)`}}>
										<Prod k={k} w={140} h={140} />
									</div>
								))}
							</div>
						</Abs>
					</>
				) : null}
			</Stage>
			<Music src="audio/v4/beat_promo.wav" vol={0.42} />
			<Sfx at={0} s="slam" v={0.9} />
			<Sfx at={HOOK - 8} s="whoosh" v={0.5} />
		</AbsoluteFill>
	);
};

/** Accroche de 2 s, puis la vidéo d'origine reprise à `skip`, et `hold` images de plus sur l'écran final. */
const HookThen: React.FC<{hook: React.ReactNode; Base: React.FC; skip: number}> = ({hook, Base, skip}) => (
	<AbsoluteFill style={{background: '#000'}}>
		<Sequence from={HOOK}>
			<Sequence from={-skip}>
				<Base />
			</Sequence>
		</Sequence>
		<Sequence from={0} durationInFrames={HOOK}>
			{hook}
		</Sequence>
	</AbsoluteFill>
);

const V01_SKIP = 30;
const HOLD = 60; // écran final prolongé de 2 s : la voix a le temps de dire prix et téléphone
export const V01_7_DUR = HOOK + V01_DUR - V01_SKIP + HOLD;
export const V01_7: React.FC<{v: 1 | 2 | 3}> = ({v}) => <HookThen hook={<V01Hook v={v} />} Base={V01} skip={V01_SKIP} />;

// ---------- V03 (prix barré, fond blanc) ----------

const V03Hook: React.FC<{v: 1 | 2 | 3}> = ({v}) => {
	const {vertical, y} = useStage();
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, rgba(255,210,205,0.6) 0%, #fff 62%)'}} />
			<HookPack top4x5={720} shadow="rgba(0,0,0,0.22)" />
			<Stage>
				{v === 1 ? (
					<>
						<Abs top={vertical ? y(30) : 50} left={40} right={40}>
							<T size={vertical ? 112 : 104} color="#111" style={{textAlign: 'center', lineHeight: 1.2}}>
								قدّاش تحسب
								<br />
								<span style={{color: RED}}>يسوى الباك؟</span>
							</T>
						</Abs>
						<Abs top={vertical ? y(360) : 340}>
							<Pulse from={0} amp={0.12} speed={0.35}>
								<div style={{width: 300, height: 300, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 40px rgba(226,52,59,0.4)'}}>
									<N style={{fontSize: 220, color: '#fff', lineHeight: 1}}>?</N>
								</div>
							</Pulse>
						</Abs>
					</>
				) : null}
				{v === 2 ? (
					<>
						<Abs top={vertical ? y(40) : 50}>
							<Breathe amp={0.04} speed={0.3}>
								<T size={vertical ? 150 : 140} color={RED} style={{textShadow: '0 8px 0 rgba(0,0,0,0.12)'}}>
									السوم طاح!
								</T>
							</Breathe>
						</Abs>
						<Abs top={vertical ? y(290) : 280}>
							<div style={{transform: `translateY(${(f % 20) * 3}px)`}}>
								<svg width="240" height="300" viewBox="0 0 24 30">
									<path d="M8 0h8v18h7L12 30 1 18h7z" fill={RED} />
								</svg>
							</div>
						</Abs>
					</>
				) : null}
				{v === 3 ? (
					<>
						<Abs top={vertical ? y(40) : 50} left={40} right={40}>
							<T size={vertical ? 92 : 88} color="#111" style={{textAlign: 'center', lineHeight: 1.25}}>
								قبل ما تشري
								<br />
								أي حاجة لشعرك…
							</T>
						</Abs>
						<Abs top={vertical ? y(330) : 320}>
							<Breathe amp={0.05} speed={0.3}>
								<div style={{background: RED, borderRadius: 999, padding: '6px 60px 18px', boxShadow: '0 12px 0 rgba(0,0,0,0.18)', transform: 'rotate(-3deg)'}}>
									<T size={100}>شوف هذا</T>
								</div>
							</Breathe>
						</Abs>
					</>
				) : null}
			</Stage>
			<Music src="audio/v4/beat_promo.wav" vol={0.4} />
			<Sfx at={0} s={v === 2 ? 'bass' : 'slam'} v={0.8} />
			<Sfx at={HOOK - 8} s="whoosh" v={0.5} />
		</AbsoluteFill>
	);
};

export const V03_7_DUR = HOOK + V03_DUR + HOLD;
export const V03_7: React.FC<{v: 1 | 2 | 3}> = ({v}) => <HookThen hook={<V03Hook v={v} />} Base={V03} skip={0} />;

// ---------- V05 (vrais produits) : copie de V05, seule l'accroche change ----------

const V05_SHOTS: {src: string; trim: number; k: PKey}[] = [
	{src: 'rushs/real/v2_derma.mp4', trim: 1.0, k: 'derma'},
	{src: 'rushs/real/v2_huile.mp4', trim: 0.0, k: 'huile'},
	{src: 'rushs/real/v2_brosse.mp4', trim: 2.4, k: 'brosse'},
	{src: 'rushs/real/v2_applicateur.mp4', trim: 3.0, k: 'applicateur'},
	{src: 'rushs/real/v2_sidr.mp4', trim: 1.0, k: 'sidr'},
];
const SH = 46;
const V05_END = 220;
export const V05_7_DUR = SH * 5 + V05_END;

const V05HookText: React.FC<{v: 1 | 2 | 3}> = ({v}) => {
	const high = useHigh();
	const f = useCurrentFrame();
	if (v === 1)
		return (
			<Abs top={high} left={40} right={40}>
				<Breathe>
					<Big size={96}>
						حلّينا الكرتونة…
						<br />
						<span style={{color: YELLOW}}>شوف آش فيها</span>
					</Big>
				</Breathe>
			</Abs>
		);
	if (v === 2)
		return (
			<>
				<Abs top={high} left={40} right={40}>
					<Big size={100}>
						<span style={{color: YELLOW}}>
							<N>5</N> حاجات
						</span>
						<br />
						في كرتونة وحدة
					</Big>
				</Abs>
				<Abs top={high + 270}>
					<div dir="rtl" style={{display: 'flex', gap: 18}}>
						{[1, 2, 3, 4, 5].map((n) => (
							<div key={n} style={{width: 74, height: 74, borderRadius: '50%', background: n <= 1 + Math.floor(f / 12) ? RED : 'rgba(255,255,255,0.35)', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<N style={{fontSize: 36, color: '#fff'}}>{n}</N>
							</div>
						))}
					</div>
				</Abs>
			</>
		);
	return (
		<Abs top={high} left={40} right={40}>
			<Big size={92}>هذا اللي يوصلك</Big>
			<div style={{display: 'flex', justifyContent: 'center', marginTop: 16}}>
				<Breathe amp={0.05} speed={0.3}>
					<div style={{background: YELLOW, borderRadius: 30, padding: '0 46px', boxShadow: '0 12px 0 rgba(0,0,0,0.25)'}}>
						<T size={120} color="#111" style={{lineHeight: 1.25}}>
							بـ <N style={{fontSize: 130}}>{O.price}</N> د.ت
						</T>
					</div>
				</Breathe>
			</div>
		</Abs>
	);
};

export const V05_7: React.FC<{v: 1 | 2 | 3}> = ({v}) => {
	const low = useLow();
	const high = useHigh();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{/* 1er plan : tous les produits sur la table (accroche), puis les 5 produits un par un */}
			<Sequence from={0} durationInFrames={HOOK}>
				<Clip src="rushs/real/v2_tous.mp4" trim={0.4} />
				<Scrim top={0.65} bottom={0.4} />
				<V05HookText v={v} />
			</Sequence>
			{V05_SHOTS.map((s, i) => (
				<Sequence key={i} from={HOOK + i * 34} durationInFrames={34}>
					<Punch>
						<Clip src={s.src} trim={s.trim} />
					</Punch>
					<Scrim top={0.5} bottom={0.45} />
					<Abs top={low}>
						<ProdTag n={i + 1} k={s.k} at={2} />
					</Abs>
				</Sequence>
			))}
			<Sequence from={HOOK} durationInFrames={SH * 5 - HOOK}>
				<Abs top={high}>
					<Big size={80}>شوف آش فمّا في الباك</Big>
				</Abs>
				<Abs top={high + 120}>
					<Tag bg={YELLOW} size={44}>
						<N>5</N> قطع بـ <N>{O.price}</N> د.ت
					</Tag>
				</Abs>
			</Sequence>
			<Sequence from={SH * 5}>
				<EndCard />
			</Sequence>
			<Music src="audio/v4/beat_promo.wav" vol={0.42} />
			<Sfx at={0} s="slam" v={0.7} />
			{V05_SHOTS.map((_, i) => (
				<React.Fragment key={i}>
					<Sfx at={HOOK + i * 34} s="whoosh" v={0.4} />
					<Sfx at={HOOK + i * 34 + 2} s={`pop${i + 1}` as 'pop1'} v={0.7} />
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};
