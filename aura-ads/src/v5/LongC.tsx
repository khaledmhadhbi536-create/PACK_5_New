import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {T} from '../v2/WinStill';
import {byKey, PKey, Pack, Prod} from '../v3/V3Still';
import {Abs, ease, Flash, In, Sfx, Stage, useStage} from '../v4/kit';
import {GiftBox, Sparkles} from '../v4/Rushes';
import {Framed, KText, longDuration, ProductHero, RushShot, Sc, TextCard, Timeline} from './kit5';
import {Frieze, ThemeBg} from './theme';

// ======================= L04 · le rituel du dimanche (éditorial, 40 s) =======================

const EditoPack: React.FC = () => {
	const {vertical} = useStage();
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<ThemeBg t="edito" />
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% ${vertical ? 52 : 50}%, rgba(201,164,92,${0.25 + 0.1 * Math.sin(f / 10)}) 0%, transparent 45%)`}} />
			<Stage>
				<Abs top={vertical ? 120 : 120} left={60} right={60}>
					<KText text="روتين Aura Bio" size={92} color="#F3EBDD" accent="#C9A45C" stagger={5} />
				</Abs>
				<Abs top={vertical ? 240 : 250} left={60} right={60}>
					<KText text="خمسة قطع… ووقت ليك" size={44} color="#C9A45C" display={false} delay={14} />
				</Abs>
				<Abs top={vertical ? 340 : 380}>
					<In at={6} kind="fade">
						<div style={{transform: `scale(${1 + f * 0.0008})`}}>
							<Pack W={900} H={vertical ? 520 : 640} shadow="rgba(201,164,92,0.25)" />
						</div>
					</In>
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const L04_SCENES: Sc[] = [
	{dur: 150, el: <RushShot src="rushs/sidr_spoon_grass.mp4" rate={0.85} title="الأحد… وقت ليك" />},
	{dur: 150, el: <RushShot src="rushs/sidr_chantilly.mp4" trim={1} rate={0.8} title="سدر بيو" sub="رغوة خفيفة، كيما في الحمّام" />},
	{dur: 140, el: <RushShot photo="photos/goutte_romarin.jpg" title="زيت إكليل الجبل" sub="قطرات على العروق" />},
	{dur: 120, el: <RushShot src="rushs/derma_in_hand.mp4" rate={0.75} title="ديرما رولر 540" sub="بالشوية" />},
	{dur: 150, el: <RushShot src="rushs/sidr_massage_b.mp4" rate={0.8} title="ماساج" sub="بفرشة التدليك، على خاطرك" />},
	{dur: 140, el: <RushShot src="rushs/sidr_rinse.mp4" rate={0.8} title="وشلّل" />},
	{dur: 120, el: <EditoPack />, sfx: <Sfx at={4} s="sparkle" v={0.4} />},
];
const L04_END = 210;
export const L04_DUR = longDuration(L04_SCENES, L04_END);
export const L04: React.FC = () => <Timeline t="edito" scenes={L04_SCENES} endDur={L04_END} mid={600} musicVol={0.5} cutSfxVol={0.3} endTitle="روتين كامل للشعر واللحية" />;

// ======================= L05 · le sidr, Sidi Bou Saïd (35 s) =======================

/** Arche bleue avec portes blanches qui s'ouvrent sur la vidéo. */
const SbsArch: React.FC<{title: string; sub?: string; src: string; trim?: number; rate?: number; doors?: boolean}> = ({title, sub, src, trim, rate, doors}) => {
	const {vertical} = useStage();
	const f = useCurrentFrame();
	const open = doors ? ease(f, 4, 26) : 1;
	const W = 640;
	const H = vertical ? 600 : 760;
	return (
		<AbsoluteFill>
			<ThemeBg t="sbs" />
			<Stage>
				<Abs top={vertical ? 70 : 70} left={50} right={50}>
					<KText text={title} size={vertical ? 100 : 104} color="#123E73" accent="#E7B422" stagger={4} />
				</Abs>
				{sub ? (
					<Abs top={vertical ? 205 : 210} left={50} right={50}>
						<KText text={sub} size={42} color="#3E5F86" display={false} delay={10} />
					</Abs>
				) : null}
				<Abs top={vertical ? 290 : 320}>
					<div style={{position: 'relative'}}>
						<Framed src={src} trim={trim} rate={rate} w={W} h={H} kind="arch" />
						{doors ? (
							<div style={{position: 'absolute', left: 12, top: 12, width: W, height: H, borderRadius: `${W / 2}px ${W / 2}px 10px 10px`, overflow: 'hidden', pointerEvents: 'none'}}>
								{[0, 1].map((s) => (
									<div
										key={s}
										style={{
											position: 'absolute',
											top: 0,
											bottom: 0,
											width: W / 2,
											left: s === 0 ? 0 : W / 2,
											background: 'linear-gradient(180deg,#F7F4EE,#E9E1D2)',
											border: '3px solid #1E5A96',
											boxSizing: 'border-box',
											transform: `translateX(${(s === 0 ? -1 : 1) * open * (W / 2 + 10)}px)`,
										}}
									>
										<div style={{position: 'absolute', top: '45%', [s === 0 ? 'right' : 'left']: 24, width: 18, height: 18, borderRadius: '50%', background: '#E7B422'} as React.CSSProperties} />
										{[0, 1, 2].map((r) => (
											<div key={r} style={{position: 'absolute', left: 30, right: 30, top: 140 + r * 150, height: 110, border: '3px solid #1E5A96', borderRadius: 8}} />
										))}
									</div>
								))}
							</div>
						) : null}
					</div>
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const SbsFour: React.FC = () => {
	const {vertical} = useStage();
	const ks: PKey[] = ['derma', 'huile', 'applicateur', 'brosse'];
	return (
		<AbsoluteFill>
			<ThemeBg t="sbs" />
			<Stage>
				<Abs top={70} left={50} right={50}>
					<KText text="وزدنالو *4 قطع*" size={104} color="#123E73" accent="#E7B422" />
				</Abs>
				<Abs top={vertical ? 230 : 260}>
					<div dir="rtl" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26}}>
						{ks.map((k, i) => (
							<In key={k} at={8 + i * 10} kind="pop">
								<div style={{width: 400, height: vertical ? 300 : 400, borderRadius: '200px 200px 18px 18px', background: '#fff', border: '6px solid #1E5A96', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 18, boxSizing: 'border-box', boxShadow: '0 12px 30px rgba(18,62,115,0.18)'}}>
									<Prod k={k} w={250} h={vertical ? 190 : 280} />
									<T size={32} color="#123E73" style={{whiteSpace: 'nowrap'}}>{byKey(k).name}</T>
								</div>
							</In>
						))}
					</div>
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const SbsPack: React.FC = () => {
	const {vertical} = useStage();
	return (
		<AbsoluteFill>
			<ThemeBg t="sbs" />
			<Stage>
				<Abs top={70} left={50} right={50}>
					<KText text="روتين *تونسي* للشعر واللحية" size={92} color="#123E73" accent="#E7B422" />
				</Abs>
				<Abs top={vertical ? 300 : 330}>
					<In at={4} kind="up" dist={140}>
						<div style={{width: 900, height: vertical ? 560 : 760, borderRadius: '450px 450px 24px 24px', background: 'linear-gradient(180deg,#DCE8F5,#fff)', border: '10px solid #1E5A96', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 30, boxSizing: 'border-box', overflow: 'hidden', position: 'relative'}}>
							<Frieze h={30} style={{position: 'absolute', top: vertical ? 200 : 260, left: 0, right: 0, opacity: 0.25}} />
							<Pack W={760} H={vertical ? 380 : 520} shadow="rgba(18,62,115,0.25)" />
						</div>
					</In>
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const L05_SCENES: Sc[] = [
	{dur: 120, el: <SbsArch title="السدر" sub="سدر بيو من Aura Bio" src="rushs/sidr_chantilly.mp4" trim={2} doors />, sfx: <Sfx at={4} s="whoosh" v={0.4} />},
	{dur: 140, el: <SbsArch title="سرّ الحمّام متاع جدودنا" src="rushs/sidr_spoon_grass.mp4" rate={0.9} />},
	{dur: 140, el: <SbsArch title="اليوم… في روتينك" sub="مع شويّة ماء دافي" src="rushs/sidr_whisk.mp4" />},
	{dur: 200, el: <SbsFour />, sfx: <>{[0, 1, 2, 3].map((i) => <Sfx key={i} at={8 + i * 10} s={`pop${i + 2}` as 'pop2'} v={0.6} />)}</>},
	{dur: 150, el: <SbsPack />, sfx: <Sfx at={4} s="sparkle" v={0.4} />},
];
const L05_END = 230;
export const L05_DUR = longDuration(L05_SCENES, L05_END);
export const L05: React.FC = () => <Timeline t="sbs" scenes={L05_SCENES} endDur={L05_END} musicVol={0.5} endTitle="روتين تونسي كامل" />;

// ======================= L09 · la hdiya (cadeau, 30 s) =======================

const WHO = ['لبوك', 'لخوك', 'لراجلك', 'لصاحبك'];

const BlushGift: React.FC<{open: boolean}> = ({open}) => {
	const {vertical} = useStage();
	const f = useCurrentFrame();
	const wig = open ? 0 : Math.sin(f / 2.5) * (f % 40 < 14 ? 5 : 0);
	const rise = open ? ease(f, 6, 30) : 0;
	const wi = open ? Math.min(3, Math.floor(Math.max(0, f - 40) / 20)) : -1;
	return (
		<AbsoluteFill>
			<ThemeBg t="blush" />
			<Stage>
				<Abs top={vertical ? 60 : 70} left={50} right={50}>
					<KText text={open ? 'باك كامل للشعر واللحية' : 'تلوّج على *هدية* للراجل؟'} size={open ? 76 : 92} color="#4A1712" accent="#C8202A" />
				</Abs>
				{open ? (
					<Abs top={vertical ? 190 : 200}>
						<div dir="rtl" style={{display: 'flex', gap: 16}}>
							{WHO.map((w, i) => (
								<In key={w} at={40 + i * 20} kind="pop">
									<div style={{background: i === wi ? '#C8202A' : 'rgba(255,255,255,0.85)', borderRadius: 999, padding: '2px 26px 10px'}}>
										<T size={46} color={i === wi ? '#fff' : '#4A1712'}>{w}</T>
									</div>
								</In>
							))}
						</div>
					</Abs>
				) : null}
				<Abs top={vertical ? 330 : 400}>
					<div style={{position: 'relative', width: 900, height: 520, display: 'flex', justifyContent: 'center'}}>
						{open ? (
							<div style={{position: 'absolute', bottom: 40 + rise * 200, transform: `scale(${0.5 + 0.5 * rise})`, transformOrigin: 'bottom center', opacity: Math.min(1, rise * 3), zIndex: 3}}>
								<Pack W={620} H={360} shadow="rgba(0,0,0,0.2)" />
							</div>
						) : null}
						<div style={{position: 'absolute', bottom: 0, zIndex: 2, transform: `rotate(${wig}deg)`, transformOrigin: 'bottom center'}}>
							<GiftBox openAt={open ? 2 : 99999} />
						</div>
					</div>
				</Abs>
			</Stage>
			{open ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? 269 + 330 - 200 : 300, height: 900}}>
					<Sparkles at={4} />
				</div>
			) : null}
			{open ? <Flash at={4} max={0.45} /> : null}
		</AbsoluteFill>
	);
};

const L09_SCENES: Sc[] = [
	{dur: 100, el: <BlushGift open={false} />, sfx: <Sfx at={2} s="pop1" v={0.5} />},
	{
		dur: 150,
		el: <BlushGift open />,
		sfx: (
			<>
				<Sfx at={2} s="boxpop" v={0.9} />
				<Sfx at={4} s="sparkle" v={0.7} />
				{WHO.map((_, i) => <Sfx key={i} at={40 + i * 20} s={`pop${i + 2}` as 'pop2'} v={0.6} />)}
			</>
		),
	},
	{dur: 54, el: <ProductHero k="sidr" n={1} role="سدر بيو للغسيل" />},
	{dur: 54, el: <ProductHero k="derma" n={2} role="ديرما رولر 540" />},
	{dur: 54, el: <ProductHero k="huile" n={3} role="زيت إكليل الجبل" />},
	{dur: 54, el: <ProductHero k="applicateur" n={4} role="مشط الجذور" />},
	{dur: 54, el: <ProductHero k="brosse" n={5} role="فرشة التدليك" />},
	{dur: 110, el: <RushShot src="rushs/real/p5_fermeture.mp4" trim={1} title="توصل لباب الدار" sub="وتخلّص كي توصل" />},
];
const L09_END = 230;
export const L09_DUR = longDuration(L09_SCENES, L09_END);
export const L09: React.FC = () => <Timeline t="blush" scenes={L09_SCENES} endDur={L09_END} mid={420} endTitle="هدية كاملة للراجل" />;

// ======================= L10 · 10 minutes par semaine (minuteur, 25 s) =======================

const STEPS_T = [
	{at: 60, dur: 120, m: 2},
	{at: 180, dur: 100, m: 3},
	{at: 280, dur: 130, m: 8},
	{at: 410, dur: 110, m: 10},
];

const Timer: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical, top} = useStage();
	if (f < 60 || f >= 520) return null;
	const pts = [60, ...STEPS_T.map((s) => s.at + s.dur)];
	const vals = [0, ...STEPS_T.map((s) => s.m * 60)];
	const secs = interpolate(f, pts, vals, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const mm = String(Math.floor(secs / 60)).padStart(2, '0');
	const ss = String(Math.floor(secs % 60)).padStart(2, '0');
	return (
		<div style={{position: 'absolute', top: (vertical ? top : 30) + 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 60}}>
			<div style={{background: '#10231A', borderRadius: 24, padding: '6px 34px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.35)', border: '3px solid #1FA463'}}>
				<div style={{width: 20, height: 20, borderRadius: '50%', background: '#1FA463'}} />
				<span style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 72, color: '#fff', direction: 'ltr'}}>{mm}:{ss}</span>
			</div>
		</div>
	);
};

const L10_SCENES: Sc[] = [
	{dur: 60, el: <TextCard text={'*10 دقايق* في الجمعة\nهذا الكل'} size={100} marker="rgba(31,164,99,0.22)" />, sfx: <Sfx at={0} s="pop2" v={0.6} />},
	{dur: 120, el: <RushShot src="rushs/derma_roll_crown.mp4" n={1} title="الديرما رولر" sub="دقيقتين" />},
	{dur: 100, el: <RushShot photo="photos/rituel_huile.jpg" n={2} title="زيت إكليل الجبل" sub="دقيقة بمشط الجذور" />},
	{dur: 130, el: <RushShot src="rushs/sidr_massage.mp4" trim={2} n={3} title="ماساج بفرشة التدليك" sub="5 دقايق" />},
	{dur: 110, el: <RushShot src="rushs/sidr_rinse.mp4" trim={1} n={4} title="وفي الغسيل" sub="سدر بيو وماء دافي" />},
];
const L10_END = 230;
export const L10_DUR = longDuration(L10_SCENES, L10_END);
export const L10: React.FC = () => <Timeline t="clean" scenes={L10_SCENES} endDur={L10_END} overlay={<Timer />} endTitle="روتين ساهل في الدار" />;

