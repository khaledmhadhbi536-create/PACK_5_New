import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {N, T} from '../v2/WinStill';
import {P, Pack, Prod} from '../v3/V3Still';
import {Abs, Below, In, Sfx, Stage, useStage} from '../v4/kit';
import {Chapter, Framed, KText, longDuration, ProductHero, RushShot, Sc, TextCard, Timeline} from '../v5/kit5';
import {ThemeBg} from '../v5/theme';
import {BandShot, Breathe, HookShot, MASSAGE, PhotoShot, StaticText, WASH, washRate} from './kit6';

/**
 * Longues V6 : reprises de V5 (V5 reste intact).
 *  - L01, L07, L08 : la frame 0 montre déjà l'accroche.
 *  - L01, L04, L08, L10 : étapes « massage » et « lavage » sur un plan net (bandeau 16:9).
 */

// ======================= L01 · le guide complet (kraft) =======================

const L01_SCENES: Sc[] = [
	{
		dur: 75,
		el: <HookShot src="rushs/real/v2_tous.mp4" trim={0.4} hook={'كل شي على الباك\nفي *45 ثانية*'} title="باك الشعر واللحية للرجال" sub="شنوّة فيه وكيفاش تستعملو" />,
		sfx: <Sfx at={0} s="pop1" v={0.6} />,
	},
	{
		dur: 48,
		el: (
			<TextCard text="شنوّة فيه *الباك*؟" size={110}>
				<Chapter n={1} text="المحتوى" at={6} />
			</TextCard>
		),
	},
	{dur: 66, el: <ProductHero k="sidr" n={1} role="ينظّف جلدة الراس *بالشوية*، كيما في الحمّام" real="rushs/real/v2_sidr.mp4" realTrim={1} />, sfx: <Sfx at={4} s="pop1" v={0.6} />},
	{dur: 66, el: <ProductHero k="derma" n={2} role="*540* إبرة صغيرة تنشّط جلدة الراس" real="rushs/real/v2_derma.mp4" realTrim={1.2} />, sfx: <Sfx at={4} s="pop2" v={0.6} />},
	{dur: 66, el: <ProductHero k="huile" n={3} role="زيت *إكليل الجبل* للعروق" real="rushs/real/v2_huile.mp4" realTrim={0} />, sfx: <Sfx at={4} s="pop3" v={0.6} />},
	{dur: 66, el: <ProductHero k="applicateur" n={4} role="يحطّ الزيت *طول على العروق*، بلا تبذير" real="rushs/real/v2_applicateur.mp4" realTrim={3} />, sfx: <Sfx at={4} s="pop4" v={0.6} />},
	{dur: 66, el: <ProductHero k="brosse" n={5} role="*ماساج* يرتّح ويفرّق الزيت" real="rushs/real/v2_brosse.mp4" realTrim={2.5} />, sfx: <Sfx at={4} s="pop5" v={0.6} />},
	{
		dur: 48,
		el: (
			<TextCard text="كيفاش *تستعملو*؟" size={110}>
				<Chapter n={2} text="الروتين" at={6} />
			</TextCard>
		),
	},
	{dur: 105, el: <RushShot src="rushs/derma_roll_crown.mp4" n={1} title="الديرما رولر" sub="بالشوية، على راس نظيف وناشف" />},
	{dur: 105, el: <PhotoShot photo="photos/rituel_huile.jpg" n={2} title="زيت إكليل الجبل" sub="بمشط الجذور، طول على العروق" />},
	{dur: 105, el: <BandShot src={MASSAGE.src} trim={MASSAGE.trim} rate={0.45} n={3} title="ماساج بفرشة التدليك" sub="من 3 لـ 5 دقايق" />},
	{dur: 105, el: <BandShot src={WASH.src} trim={WASH.trim} rate={washRate(105)} n={4} title="وقت الغسيل" sub="سدر بيو وماء دافي، ماساج وشلّل" />},
	{dur: 90, el: <TextCard text={'*2 ولا 3* مرات\nفي الجمعة'} sub="النتيجة تحب صبر وانتظام" size={104} marker="rgba(47,107,42,0.25)" />},
];
const L01_END = 255; // +0,5 s par rapport à V5 : la voix finit le téléphone avant le fondu
export const L01_6_DUR = longDuration(L01_SCENES, L01_END);
export const L01_6: React.FC = () => <Timeline t="kraft" scenes={L01_SCENES} endDur={L01_END} mid={540} />;

// ======================= L07 · 5 raisons (magazine) =======================

const MagNum: React.FC<{n: number}> = ({n}) => <N style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 260, color: '#D7322D', lineHeight: 0.9}}>0{n}</N>;

const CITIES = ['تونس', 'صفاقس', 'سوسة', 'نابل', 'بنزرت', 'قابس', 'القيروان', 'المنستير', 'المهدية', 'قفصة', 'مدنين', 'جندوبة'];

const MagReason: React.FC<{n: number; title: string; sub: string; visual: React.ReactNode}> = ({n, title, sub, visual}) => {
	const {vertical} = useStage();
	return (
		<AbsoluteFill>
			<ThemeBg t="mag" />
			<Stage>
				<Abs top={vertical ? 90 : 60} right={50} center={false}>
					<In at={0} kind="right">
						<MagNum n={n} />
					</In>
				</Abs>
				<Abs top={vertical ? 130 : 100} left={60} center={false}>
					<In at={4} kind="fade">
						<div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, letterSpacing: 8, color: '#151312'}}>AURA BIO</div>
						<div style={{width: 220, height: 4, background: '#D7322D', marginTop: 10}} />
					</In>
				</Abs>
				<Abs top={330} left={60} right={60}>
					<KText text={title} size={80} align="right" delay={4} />
				</Abs>
				<Abs top={vertical ? 445 : 455} left={60} right={60}>
					<KText text={sub} size={40} align="right" display={false} delay={12} color="#5B524A" />
				</Abs>
				<Abs top={vertical ? 545 : 580}>
					<In at={10} kind="up" dist={160}>
						{visual}
					</In>
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

/** Couverture du magazine : tout est posé dès la frame 0, puis le « 5 » respire. */
const MagCover6: React.FC = () => {
	const {vertical} = useStage();
	const f = useCurrentFrame();
	const tilt = interpolate(f, [0, 66], [-2, 2]);
	return (
		<AbsoluteFill>
			<ThemeBg t="mag" />
			<Stage>
				<Abs top={vertical ? 100 : 60}>
					<div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 44, letterSpacing: 18, color: '#151312'}}>AURA BIO</div>
				</Abs>
				<Abs top={vertical ? 170 : 130}>
					<Breathe amp={0.04} speed={0.2}>
						<div style={{transform: `rotate(${tilt}deg)`}}>
							<N style={{fontSize: 330, color: '#D7322D', lineHeight: 1}}>5</N>
						</div>
					</Breathe>
				</Abs>
				<Abs top={vertical ? 510 : 480} left={50} right={50}>
					<StaticText text="أسباب باش تاخو *الباك*" size={84} />
				</Abs>
				<Abs top={vertical ? 630 : 630}>
					<Pack W={760} H={vertical ? 330 : 480} shadow="rgba(0,0,0,0.25)" />
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const L07_SCENES: Sc[] = [
	{dur: 66, el: <MagCover6 />, sfx: <Sfx at={0} s="slam" v={0.6} />},
	{dur: 150, el: <MagReason n={1} title="كل شي في باك واحد" sub="سدر، ديرما رولر، زيت، مشط وفرشة: ما تلوّج على شي" visual={<Pack W={820} H={380} shadow="rgba(0,0,0,0.25)" />} />},
	{
		dur: 150,
		el: (
			<MagReason
				n={2}
				title="أقل من 10 د.ت للقطعة"
				sub="5 قطع بـ 49 د.ت عوض 110"
				visual={
					<div dir="rtl" style={{display: 'flex', gap: 12}}>
						{P.map((p) => (
							<div key={p.key} style={{width: 176, height: 220, background: '#fff', borderRadius: 20, boxShadow: '0 10px 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4}}>
								<Prod k={p.key} w={140} h={150} />
								<div style={{background: '#D7322D', borderRadius: 10, padding: '0 10px 4px'}}>
									<T size={26}>
										<N style={{fontSize: 28}}>9.8</N> د.ت
									</T>
								</div>
							</div>
						))}
					</div>
				}
			/>
		),
	},
	{dur: 150, el: <MagReason n={3} title="طبيعي، كيما زمان" sub="سدر بيو وزيت إكليل الجبل" visual={<Framed src="rushs/sidr_chantilly.mp4" trim={2} w={760} h={400} />} />},
	{dur: 150, el: <MagReason n={4} title="تخلّص كي يوصلك" sub="ما تخلّص حتى شي قبل ما تشوف الباك" visual={<Framed src="rushs/real/p5_fermeture.mp4" trim={1} w={760} h={400} />} />},
	{
		dur: 150,
		el: (
			<MagReason
				n={5}
				title="توصيل لكامل الولايات"
				sub="وين ما كنت في تونس"
				visual={
					<div dir="rtl" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, width: 900}}>
						{CITIES.map((c, i) => (
							<In key={c} at={14 + i * 4} kind="pop">
								<div style={{background: i % 3 === 0 ? '#D7322D' : '#151312', borderRadius: 999, padding: '4px 26px 10px'}}>
									<T size={38}>{c}</T>
								</div>
							</In>
						))}
					</div>
				}
			/>
		),
		sfx: <>{CITIES.map((_, i) => (i % 2 === 0 ? <Sfx key={i} at={14 + i * 4} s="pop2" v={0.3} /> : null))}</>,
	},
];
const L07_END = 230;
export const L07_6_DUR = longDuration(L07_SCENES, L07_END);
export const L07_6: React.FC = () => <Timeline t="mag" scenes={L07_SCENES} endDur={L07_END} mid={420} />;

// ======================= L08 · du colis à ta routine (documentaire) =======================

const Rec: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical, top} = useStage();
	const s = Math.floor(f / 30);
	const tc = `00:${String(s).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`;
	return (
		<div style={{position: 'absolute', top: vertical ? top + 30 : 50, left: 50, display: 'flex', alignItems: 'center', gap: 12, zIndex: 60, direction: 'ltr'}}>
			<div style={{width: 22, height: 22, borderRadius: '50%', background: '#FF3B30', opacity: f % 30 < 18 ? 1 : 0.2}} />
			<span style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 30, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>REC {tc}</span>
		</div>
	);
};

/** Titre machine à écrire (utilisé au milieu de la vidéo, plus en ouverture). */
const DocTitle: React.FC<{text: string; sub?: string; truck?: boolean}> = ({text, sub, truck}) => {
	const f = useCurrentFrame();
	const n = Math.min(text.length, Math.floor(f / 1.6));
	const x = interpolate(f, [10, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<ThemeBg t="doc" />
			<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30}}>
				<T size={88} color="#FFC53D" font="Changa" weight={800} style={{textAlign: 'center'}}>
					{text.slice(0, n)}
					<span style={{display: 'inline-block', width: 8, height: 80, marginRight: 10, verticalAlign: 'middle', background: '#FFC53D', opacity: f % 16 < 8 ? 1 : 0}} />
				</T>
				{sub ? (
					<In at={30} kind="fade">
						<T size={44} color="#fff" font="Changa" weight={500}>
							{sub}
						</T>
					</In>
				) : null}
				{truck ? (
					<div style={{position: 'relative', width: 820, height: 90, marginTop: 20}}>
						<div style={{position: 'absolute', left: 0, right: 0, top: 60, height: 4, background: 'repeating-linear-gradient(90deg,#FFC53D 0 30px,transparent 30px 50px)'}} />
						<div style={{position: 'absolute', right: x * 700, top: 0, transform: 'scaleX(-1)'}}>
							<svg width="96" height="64" viewBox="0 0 24 16">
								<path d="M1 2h13v10H1zM14 6h5l3 3v3h-8z" fill="#fff" />
								<circle cx="5" cy="13" r="2" fill="#FFC53D" />
								<circle cx="18" cy="13" r="2" fill="#FFC53D" />
							</svg>
						</div>
					</div>
				) : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** Ouverture L08 : vraie préparation de commande (flacon en main), titre « documentaire » déjà affiché. */
const DocHook: React.FC = () => {
	const {vertical, top: st} = useStage();
	return (
		<HookShot src="rushs/real/p5_huile.mp4" trim={1.3} rate={0.6} pos="50% 35%" hook="" title="قصّة باك Aura Bio">
			<Abs top={vertical ? st + 110 : 120} left={50} right={50}>
				<Breathe>
					<div style={{background: 'rgba(0,0,0,0.72)', borderRight: '14px solid #FFC53D', padding: '10px 30px 22px'}}>
						<T size={88} color="#FFC53D" font="Changa" weight={800} style={{textAlign: 'center', lineHeight: 1.2}}>
							من الكوموند…
							<br />
							لروتينك
						</T>
					</div>
				</Breathe>
			</Abs>
		</HookShot>
	);
};

const L08_SCENES: Sc[] = [
	{dur: 66, el: <DocHook />, sfx: <Sfx at={0} s="v5/shutter" v={0.5} />},
	{dur: 54, el: <RushShot src="rushs/real/p5_sidr.mp4" trim={0.6} top={<Chapter n={1} text="نحضّرو الكوموند" />} title="سدر بيو" />},
	{dur: 50, el: <RushShot src="rushs/real/v2_huile.mp4" trim={0} title="زيت إكليل الجبل" />},
	{dur: 50, el: <RushShot src="rushs/real/p5_derma.mp4" trim={1.2} title="ديرما رولر 540" />},
	{dur: 50, el: <RushShot src="rushs/real/p5_applicateur.mp4" trim={0.8} title="مشط الجذور" />},
	{dur: 70, el: <RushShot src="rushs/real/p5_fermeture.mp4" trim={1} title="ونسكّرو الكوليه" />},
	{dur: 90, el: <DocTitle text="توصلك لباب الدار" sub="وتخلّص كي توصلك" truck />},
	{dur: 80, el: <RushShot src="rushs/real/v2_tous.mp4" trim={0.4} top={<Chapter n={3} text="تحلّها" />} title="5 قطع في باك واحد" />},
	{dur: 50, el: <RushShot src="rushs/real/v2_derma.mp4" trim={1.4} title="ديرما رولر 540" />},
	{dur: 75, el: <RushShot src="rushs/derma_roll_crown.mp4" top={<Chapter n={4} text="تبدا الروتين" />} title="ديرما بالشوية" />},
	{dur: 70, el: <BandShot src={MASSAGE.src} trim={MASSAGE.trim} rate={0.5} title="ماساج بفرشة التدليك" />},
	{dur: 70, el: <BandShot src={WASH.src} trim={WASH.trim} rate={washRate(70)} title="وفي الغسيل: سدر بيو" />},
];
const L08_END = 220;
export const L08_6_DUR = longDuration(L08_SCENES, L08_END);
export const L08_6: React.FC = () => <Timeline t="doc" scenes={L08_SCENES} endDur={L08_END} mid={520} overlay={<Rec />} cutSfxVol={0.35} />;

// ======================= L04 · le rituel du dimanche (éditorial) =======================

const EditoPack: React.FC = () => {
	const {vertical} = useStage();
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<ThemeBg t="edito" />
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% ${vertical ? 52 : 50}%, rgba(201,164,92,${0.25 + 0.1 * Math.sin(f / 10)}) 0%, transparent 45%)`}} />
			<Stage>
				<Abs top={120} left={60} right={60}>
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
	{dur: 150, el: <HookShot src="rushs/sidr_spoon_grass.mp4" rate={0.85} hook="" title="الأحد… وقت ليك" sub="روتين Aura Bio للشعر واللحية" />},
	{dur: 150, el: <RushShot src="rushs/sidr_chantilly.mp4" trim={1} rate={0.8} title="سدر بيو" sub="رغوة خفيفة، كيما في الحمّام" />},
	{dur: 140, el: <RushShot photo="photos/goutte_romarin.jpg" title="زيت إكليل الجبل" sub="قطرات على العروق" />},
	{dur: 120, el: <RushShot src="rushs/derma_in_hand.mp4" rate={0.75} title="ديرما رولر 540" sub="بالشوية" />},
	{dur: 150, el: <BandShot src={MASSAGE.src} trim={MASSAGE.trim} rate={0.3} title="ماساج" sub="بفرشة التدليك، على خاطرك" />},
	{dur: 140, el: <BandShot src={WASH.src} trim={WASH.trim} rate={washRate(140)} title="وشلّل" sub="سدر بيو وماء دافي" />},
	{dur: 120, el: <EditoPack />, sfx: <Sfx at={4} s="sparkle" v={0.4} />},
];
const L04_END = 210;
export const L04_6_DUR = longDuration(L04_SCENES, L04_END);
export const L04_6: React.FC = () => <Timeline t="edito" scenes={L04_SCENES} endDur={L04_END} mid={600} musicVol={0.5} cutSfxVol={0.3} endTitle="روتين كامل للشعر واللحية" />;

// ======================= L10 · 10 minutes par semaine (minuteur) =======================

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
				<span style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 72, color: '#fff', direction: 'ltr'}}>
					{mm}:{ss}
				</span>
			</div>
		</div>
	);
};

/** Carte texte déjà affichée à la frame 0 (le texte respire au lieu d'apparaître). */
const StaticCard: React.FC<{t: 'clean'; text: string; size: number; marker?: string}> = ({t, text, size, marker}) => {
	const {vertical} = useStage();
	return (
		<AbsoluteFill>
			<ThemeBg t={t} />
			<Stage>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: vertical ? '120px 50px 60px' : '80px 60px'}}>
					<Breathe amp={0.03}>
						<StaticText text={text} size={size} marker={marker} />
					</Breathe>
				</div>
			</Stage>
			<Below>
				<div style={{display: 'flex', justifyContent: 'center', paddingTop: 40}}>
					<Pack W={940} H={560} shadow="rgba(0,0,0,0.2)" />
				</div>
			</Below>
		</AbsoluteFill>
	);
};

const L10_SCENES: Sc[] = [
	{dur: 60, el: <StaticCard t="clean" text={'*10 دقايق* في الجمعة\nهذا الكل'} size={100} marker="rgba(31,164,99,0.22)" />, sfx: <Sfx at={0} s="pop2" v={0.6} />},
	{dur: 120, el: <RushShot src="rushs/derma_roll_crown.mp4" n={1} title="الديرما رولر" sub="دقيقتين" />},
	{dur: 100, el: <PhotoShot photo="photos/rituel_huile.jpg" n={2} title="زيت إكليل الجبل" sub="دقيقة بمشط الجذور" />},
	{dur: 130, el: <BandShot src={MASSAGE.src} trim={MASSAGE.trim} rate={0.35} n={3} title="ماساج بفرشة التدليك" sub="5 دقايق" />},
	{dur: 110, el: <BandShot src={WASH.src} trim={WASH.trim} rate={washRate(110)} n={4} title="وفي الغسيل" sub="سدر بيو وماء دافي" />},
];
const L10_END = 230;
export const L10_6_DUR = longDuration(L10_SCENES, L10_END);
export const L10_6: React.FC = () => <Timeline t="clean" scenes={L10_SCENES} endDur={L10_END} overlay={<Timer />} endTitle="روتين ساهل في الدار" />;
