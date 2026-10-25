import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {OFFER2 as O} from '../v2/offer';
import {N, T} from '../v2/WinStill';
import {P, Pack, Prod} from '../v3/V3Still';
import {Abs, ease, Flash, In, Sfx, Shake, Stage, Ticks, useStage} from '../v4/kit';
import {Chapter, Framed, KText, longDuration, RushShot, Sc, Timeline} from './kit5';
import {ThemeBg} from './theme';

// ======================= L03 · pourquoi 49 c'est rien (néo-brutal, 30 s) =======================

const BRUT_ROLES: {i: number; role: string}[] = [
	{i: 0, role: 'ينظّف جلدة الراس بالشوية'},
	{i: 1, role: '540 إبرة صغيرة تنشّط جلدة الراس'},
	{i: 2, role: 'للعروق، مرّتين ولا ثلاثة في الجمعة'},
	{i: 3, role: 'يحطّ الزيت طول على العروق'},
	{i: 4, role: 'ماساج يرتّح ويفرّق الزيت'},
];

const BrutBox: React.FC<{children: React.ReactNode; bg?: string; shadow?: string; style?: React.CSSProperties}> = ({children, bg = '#fff', shadow = '#E2343B', style}) => (
	<div style={{background: bg, border: '6px solid #0A0A0A', boxShadow: `12px 12px 0 ${shadow}`, ...style}}>{children}</div>
);

const BrutHook: React.FC = () => {
	const {vertical} = useStage();
	return (
		<AbsoluteFill>
			<ThemeBg t="brutal" />
			<Stage>
				<Abs top={110}>
					<In at={0} kind="zoom">
						<BrutBox bg="#0A0A0A" style={{padding: '0 46px', transform: 'rotate(-3deg)'}}>
							<T size={170} color="#FFD43B" style={{lineHeight: 1.25}}>
								<N style={{fontSize: 180}}>{O.price}</N> دينار؟
							</T>
						</BrutBox>
					</In>
				</Abs>
				<Abs top={vertical ? 400 : 420}>
					<In at={10} kind="pop">
						<T size={72} color="#0A0A0A">شوف آش تاخو بيهم</T>
					</In>
				</Abs>
				<Abs top={vertical ? 520 : 560}>
					<In at={2} kind="up" dist={200}>
						<Pack W={vertical ? 860 : 900} H={vertical ? 440 : 600} shadow="rgba(0,0,0,0.3)" />
					</In>
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const BrutItem: React.FC<{i: number; role: string}> = ({i, role}) => {
	const {vertical} = useStage();
	const f = useCurrentFrame();
	const p = P[i];
	const fill = interpolate(f, [6, 26], [i / 5, (i + 1) / 5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<ThemeBg t="brutal" />
			<Stage>
				<Abs top={vertical ? 100 : 90} left={60} right={60} center={false}>
					<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<T size={36} color="#0A0A0A" style={{whiteSpace: 'nowrap'}}>قيمة الباك</T>
						<div style={{flex: 1, height: 34, border: '5px solid #0A0A0A', background: '#fff', position: 'relative'}}>
							<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: '#E2343B'}} />
						</div>
						<N style={{fontSize: 40, color: '#0A0A0A'}}>{i + 1}/5</N>
					</div>
				</Abs>
				<Abs top={vertical ? 200 : 210}>
					<In at={0} kind="drop">
						<BrutBox style={{width: 620, height: vertical ? 430 : 520, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${i % 2 ? 3 : -3}deg)`}}>
							<Prod k={p.key} w={560} h={vertical ? 390 : 480} />
						</BrutBox>
					</In>
				</Abs>
				<Abs top={vertical ? 670 : 800}>
					<In at={8} kind="pop">
						<BrutBox bg="#0A0A0A" shadow="#fff" style={{padding: '4px 40px 14px'}}>
							<T size={72} color="#FFD43B" style={{whiteSpace: 'nowrap'}}>{p.name}</T>
						</BrutBox>
					</In>
				</Abs>
				<Abs top={vertical ? 820 : 960} left={60} right={60}>
					<KText text={role} size={48} color="#0A0A0A" display={false} delay={14} />
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const BrutReveal: React.FC = () => {
	const {vertical} = useStage();
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<ThemeBg t="brutal" />
			<Shake hits={[34]} amp={18}>
				<Stage>
					<Abs top={vertical ? 110 : 120}>
						<T size={64} color="#0A0A0A">القيمة الكل</T>
					</Abs>
					<Abs top={vertical ? 200 : 220}>
						<div style={{position: 'relative'}}>
							<T size={170} color={f > 30 ? '#777' : '#0A0A0A'}>
								<N style={{fontSize: 190}}>{O.oldPrice}</N> د.ت
							</T>
							<div style={{position: 'absolute', right: -20, top: '50%', height: 28, background: '#E2343B', transform: 'rotate(-8deg)', transformOrigin: 'right center', width: `${ease(f, 16, 28) * 112}%`}} />
						</div>
					</Abs>
					<Abs top={vertical ? 470 : 520}>
						<In at={34} kind="zoom">
							<BrutBox bg="#E2343B" shadow="#0A0A0A" style={{padding: '0 50px', transform: 'rotate(-3deg)'}}>
								<T size={200} color="#fff" style={{lineHeight: 1.2}}>
									<N style={{fontSize: 220}}>{O.price}</N> د.ت
								</T>
							</BrutBox>
						</In>
					</Abs>
					<Abs top={vertical ? 800 : 920}>
						<In at={50} kind="pop">
							<T size={56} color="#0A0A0A">
								أقل من <N>10</N> د.ت للقطعة
							</T>
						</In>
					</Abs>
				</Stage>
			</Shake>
			<Flash at={34} max={0.6} />
		</AbsoluteFill>
	);
};

const L03_SCENES: Sc[] = [
	{
		dur: 60,
		el: <BrutHook />,
		sfx: (
			<>
				<Sfx at={0} s="slam" v={0.8} />
				<Sfx at={10} s="pop3" v={0.6} />
			</>
		),
	},
	...BRUT_ROLES.map((r) => ({
		dur: 96,
		el: <BrutItem i={r.i} role={r.role} />,
		sfx: (
			<>
				<Sfx at={2} s="slam" v={0.6} />
				<Sfx at={8} s={`pop${r.i + 1}` as 'pop1'} v={0.7} />
				<Ticks a={6} b={26} every={4} v={0.3} />
			</>
		),
	})),
	{
		dur: 100,
		el: <BrutReveal />,
		sfx: (
			<>
				<Sfx at={16} s="marker" v={0.9} />
				<Sfx at={34} s="slam" v={0.9} />
				<Sfx at={38} s="cash" v={0.8} />
			</>
		),
	},
];
const L03_END = 220;
export const L03_DUR = longDuration(L03_SCENES, L03_END);
export const L03: React.FC = () => <Timeline t="brutal" scenes={L03_SCENES} endDur={L03_END} mid={300} musicVol={0.45} />;

// ======================= L07 · 5 raisons (magazine, 35 s) =======================

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

const MagCover: React.FC = () => {
	const {vertical} = useStage();
	return (
		<AbsoluteFill>
			<ThemeBg t="mag" />
			<Stage>
				<Abs top={vertical ? 100 : 60}>
					<div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 44, letterSpacing: 18, color: '#151312'}}>AURA BIO</div>
				</Abs>
				<Abs top={vertical ? 170 : 130}>
					<In at={0} kind="zoom">
						<N style={{fontSize: 330, color: '#D7322D', lineHeight: 1}}>5</N>
					</In>
				</Abs>
				<Abs top={vertical ? 510 : 480} left={50} right={50}>
					<KText text="أسباب باش تاخو *الباك*" size={84} delay={6} />
				</Abs>
				<Abs top={vertical ? 630 : 630}>
					<In at={10} kind="up" dist={160}>
						<Pack W={760} H={vertical ? 330 : 480} shadow="rgba(0,0,0,0.25)" />
					</In>
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const L07_SCENES: Sc[] = [
	{dur: 66, el: <MagCover />, sfx: <Sfx at={0} s="slam" v={0.6} />},
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
export const L07_DUR = longDuration(L07_SCENES, L07_END);
export const L07: React.FC = () => <Timeline t="mag" scenes={L07_SCENES} endDur={L07_END} mid={420} />;

// ======================= L08 · du colis à ta routine (documentaire, 35 s) =======================

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

const L08_SCENES: Sc[] = [
	{dur: 66, el: <DocTitle text="من الكوموند… لروتينك" sub="قصّة باك Aura Bio" />, sfx: <Sfx at={2} s="tick" v={0.3} />},
	{dur: 54, el: <RushShot src="rushs/real/p5_sidr.mp4" trim={0.6} top={<Chapter n={1} text="نحضّرو الكوموند" />} title="سدر بيو" />},
	{dur: 50, el: <RushShot src="rushs/real/p5_huile.mp4" trim={0.9} title="زيت إكليل الجبل" />},
	{dur: 50, el: <RushShot src="rushs/real/p5_derma.mp4" trim={1.2} title="ديرما رولر 540" />},
	{dur: 50, el: <RushShot src="rushs/real/p5_applicateur.mp4" trim={0.8} title="مشط الجذور" />},
	{dur: 70, el: <RushShot src="rushs/real/p5_fermeture.mp4" trim={1} title="ونسكّرو الكوليه" />},
	{dur: 90, el: <DocTitle text="توصلك لباب الدار" sub="وتخلّص كي توصلك" truck />},
	{dur: 80, el: <RushShot src="rushs/real/v2_tous.mp4" trim={0.4} top={<Chapter n={3} text="تحلّها" />} title="5 قطع في باك واحد" />},
	{dur: 50, el: <RushShot src="rushs/real/v2_derma.mp4" trim={1.4} title="ديرما رولر 540" />},
	{dur: 75, el: <RushShot src="rushs/derma_roll_crown.mp4" top={<Chapter n={4} text="تبدا الروتين" />} title="ديرما بالشوية" />},
	{dur: 70, el: <RushShot src="rushs/sidr_massage.mp4" trim={2} title="ماساج بفرشة التدليك" />},
	{dur: 70, el: <RushShot src="rushs/sidr_rinse.mp4" trim={1} title="وفي الغسيل: سدر بيو" />},
];
const L08_END = 220;
export const L08_DUR = longDuration(L08_SCENES, L08_END);
export const L08: React.FC = () => <Timeline t="doc" scenes={L08_SCENES} endDur={L08_END} mid={520} overlay={<Rec />} cutSfxVol={0.35} />;
