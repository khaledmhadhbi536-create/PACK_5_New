import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {IconCheck} from '../components/Icons';
import {OFFER2 as O} from '../v2/offer';
import {N, T} from '../v2/WinStill';
import {P, Pack, Prod} from '../v3/V3Still';
import {Abs, Below, Clip, Counter, ease, In, Sfx, Stage, StrikeAnim, Ticks, useStage} from '../v4/kit';
import {KText, longDuration, RushShot, Sc, Timeline} from './kit5';
import {ThemeBg} from './theme';

// ======================= L02 · FAQ en interface de messagerie (35 s) =======================

type Msg = {side: 'q' | 'a'; at: number; h: number; body: React.ReactNode};

const Bubble: React.FC<{side: 'q' | 'a'; children: React.ReactNode}> = ({side, children}) => (
	<div style={{display: 'flex', justifyContent: side === 'q' ? 'flex-start' : 'flex-end', padding: '0 34px'}}>
		<div
			dir="rtl"
			style={{
				maxWidth: 820,
				background: side === 'q' ? '#fff' : '#DCF8C6',
				borderRadius: 30,
				borderTopRightRadius: side === 'q' ? 6 : 30,
				borderTopLeftRadius: side === 'a' ? 6 : 30,
				padding: '16px 26px 20px',
				boxShadow: '0 2px 2px rgba(0,0,0,0.12)',
			}}
		>
			{children}
		</div>
	</div>
);

const Typing: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{display: 'flex', justifyContent: 'flex-end', padding: '0 34px'}}>
			<div style={{background: '#DCF8C6', borderRadius: 30, padding: '22px 30px', display: 'flex', gap: 10}}>
				{[0, 1, 2].map((i) => (
					<div key={i} style={{width: 16, height: 16, borderRadius: '50%', background: '#4E7A55', opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - i * 4) / 4))}} />
				))}
			</div>
		</div>
	);
};

const Txt: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 44, color = '#111'}) => (
	<T size={size} color={color} weight={700} style={{lineHeight: 1.4}}>
		{children}
	</T>
);

const MSGS: Msg[] = [
	{side: 'q', at: 10, h: 120, body: <Txt>شنوّة فيه الباك؟</Txt>},
	{
		side: 'a',
		at: 48,
		h: 390,
		body: (
			<>
				<Txt>
					<N>5</N> قطع: سدر بيو، ديرما رولر <N>540</N>، زيت إكليل الجبل، مشط الجذور وفرشة التدليك
				</Txt>
				<div style={{display: 'flex', gap: 8, marginTop: 12}}>
					{P.map((p) => (
						<div key={p.key} style={{width: 140, height: 140, background: '#fff', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<Prod k={p.key} w={115} h={120} />
						</div>
					))}
				</div>
			</>
		),
	},
	{side: 'q', at: 150, h: 120, body: <Txt>كيفاش نستعملو؟</Txt>},
	{
		side: 'a',
		at: 188,
		h: 600,
		body: (
			<>
				<div style={{width: 600, height: 380, borderRadius: 20, overflow: 'hidden', position: 'relative'}}>
					<Clip src="rushs/derma_roll_crown.mp4" />
				</div>
				<div style={{marginTop: 10}}>
					<Txt size={40}>ديرما بالشوية ← الزيت بالمشط ← ماساج بالفرشة ← وفي الغسيل السدر</Txt>
				</div>
			</>
		),
	},
	{side: 'q', at: 320, h: 120, body: <Txt>قدّاش من مرّة في الجمعة؟</Txt>},
	{side: 'a', at: 358, h: 175, body: <Txt><N>2</N> ولا <N>3</N> مرات. النتيجة تحب صبر وانتظام</Txt>},
	{side: 'q', at: 440, h: 120, body: <Txt>قدّاش السوم؟</Txt>},
	{
		side: 'a',
		at: 478,
		h: 250,
		body: (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
				<Txt>الباك الكامل بـ</Txt>
				<T size={110} color="#C8202A" style={{lineHeight: 1.1}}>
					<N style={{fontSize: 120}}>{O.price}</N> د.ت
				</T>
				<StrikeAnim at={500} size={38} color="#555" prefix="عوض" />
			</div>
		),
	},
	{side: 'q', at: 570, h: 120, body: <Txt>كيفاش نخلّص؟ والتوصيل؟</Txt>},
	{
		side: 'a',
		at: 608,
		h: 230,
		body: (
			<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
				{['تخلّص كي يوصلك', 'توصيل لكامل ولايات تونس', 'اطلب على 50 500 051'].map((s) => (
					<div key={s} style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<div style={{width: 40, height: 40, borderRadius: '50%', background: '#2FA35A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<IconCheck size={26} color="#fff" />
						</div>
						<Txt size={42}>{s}</Txt>
					</div>
				))}
			</div>
		),
	},
];

const GAP = 22;

const Chat: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical, top, h} = useStage();
	const headH = 130;
	const viewTop = (vertical ? top : 0) + headH;
	const viewH = (vertical ? h : 1350) - headH - 20;
	const visible = MSGS.filter((m) => f >= m.at);
	// hauteur du contenu (+ indicateur de frappe avant chaque réponse)
	const typingNow = MSGS.find((m) => m.side === 'a' && f >= m.at - 26 && f < m.at);
	const contentH = visible.reduce((a, m) => a + m.h + GAP, 0) + (typingNow ? 90 : 0);
	// défilement doux
	const target = Math.max(0, contentH - viewH + 20);
	let y = 0;
	for (const m of MSGS) {
		const upTo = MSGS.filter((x) => x.at <= m.at).reduce((a, x) => a + x.h + GAP, 0);
		const tg = Math.max(0, upTo - viewH + 20);
		y = Math.max(y, tg * ease(f, m.at, m.at + 10));
	}
	void target;
	return (
		<AbsoluteFill style={{background: '#ECE5DD'}}>
			<AbsoluteFill style={{opacity: 0.06, backgroundImage: 'radial-gradient(#000 1.5px, transparent 2px)', backgroundSize: '26px 26px'}} />
			{/* en-tête */}
			<div dir="rtl" style={{position: 'absolute', top: vertical ? top - 10 : 0, left: 0, right: 0, height: headH + (vertical ? 10 : 0), background: '#075E54', display: 'flex', alignItems: 'center', gap: 20, padding: '0 34px', zIndex: 5}}>
				<div style={{width: 84, height: 84, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
					<Img src={staticFile('brand/logo_mark.png')} style={{width: 64, height: 64, objectFit: 'contain'}} />
				</div>
				<div>
					<div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 40, color: '#fff'}}>Aura Bio</div>
					<T size={28} color="#CDEFE6" weight={700}>
						أسئلة متكرّرة على الباك
					</T>
				</div>
			</div>
			{vertical ? <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: top - 10, background: '#054C44'}} /> : null}
			{/* messages */}
			<div style={{position: 'absolute', top: viewTop, left: 0, right: 0, height: viewH, overflow: 'hidden'}}>
				<div style={{transform: `translateY(${-y + 20}px)`, display: 'flex', flexDirection: 'column', gap: GAP}}>
					{visible.map((m, i) => (
						<div key={i} style={{height: m.h}}>
							<In at={m.at} kind="pop">
								<Bubble side={m.side}>{m.body}</Bubble>
							</In>
						</div>
					))}
					{typingNow ? <Typing /> : null}
				</div>
			</div>
			<Below>
				<AbsoluteFill style={{background: '#ECE5DD'}}>
					<div style={{display: 'flex', justifyContent: 'center', paddingTop: 40, opacity: 0.9}}>
						<Pack W={960} H={580} shadow="rgba(0,0,0,0.2)" />
					</div>
				</AbsoluteFill>
			</Below>
		</AbsoluteFill>
	);
};

const NotifHook: React.FC = () => {
	const {vertical, top} = useStage();
	return (
		<AbsoluteFill>
			<ThemeBg t="clean" />
			<Stage>
				<Abs top={vertical ? 330 : 420}>
					<In at={0} kind="up" dist={150}>
						<Pack W={900} H={vertical ? 560 : 640} shadow="rgba(0,0,0,0.25)" />
					</In>
				</Abs>
			</Stage>
			<div style={{position: 'absolute', top: (vertical ? top : 60) + 30, left: 40, right: 40, zIndex: 5}}>
				<In at={4} kind="drop" dist={60}>
					<div dir="rtl" style={{background: 'rgba(255,255,255,0.96)', borderRadius: 36, padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.25)'}}>
						<div style={{width: 90, height: 90, borderRadius: 22, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<Img src={staticFile('brand/logo_mark_light.png')} style={{width: 66, height: 66, objectFit: 'contain'}} />
						</div>
						<div style={{flex: 1}}>
							<div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 34, color: '#111'}}>Aura Bio</div>
							<T size={42} color="#111" weight={800}>
								عندك سؤال على الباك؟ هاو الجواب
							</T>
						</div>
					</div>
				</In>
			</div>
		</AbsoluteFill>
	);
};

const L02_SCENES: Sc[] = [
	{dur: 50, el: <NotifHook />, sfx: <Sfx at={4} s="v5/bubble" v={0.8} />},
	{
		dur: 700,
		el: <Chat />,
		sfx: (
			<>
				{MSGS.map((m, i) =>
					m.side === 'q' ? (
						<Sfx key={i} at={m.at} s="pop2" v={0.6} />
					) : (
						<React.Fragment key={i}>
							<Sfx at={m.at - 24} s="tick" v={0.25} />
							<Sfx at={m.at} s="check" v={0.5} />
						</React.Fragment>
					),
				)}
			</>
		),
	},
];
const L02_END = 230;
export const L02_DUR = longDuration(L02_SCENES, L02_END);
export const L02: React.FC = () => <Timeline t="clean" scenes={L02_SCENES} endDur={L02_END} musicVol={0.3} endTitle="باك الشعر واللحية للرجال" />;

// ======================= L06 · le derma 540 expliqué (infographie, 30 s) =======================

const Brackets: React.FC<{color: string}> = ({color}) => {
	const s: React.CSSProperties = {position: 'absolute', width: 70, height: 70, borderColor: color, borderStyle: 'solid'};
	return (
		<>
			<div style={{...s, top: 0, left: 0, borderWidth: '5px 0 0 5px'}} />
			<div style={{...s, top: 0, right: 0, borderWidth: '5px 5px 0 0'}} />
			<div style={{...s, bottom: 0, left: 0, borderWidth: '0 0 5px 5px'}} />
			<div style={{...s, bottom: 0, right: 0, borderWidth: '0 5px 5px 0'}} />
		</>
	);
};

const TechHook: React.FC = () => {
	const {vertical, top, h} = useStage();
	return (
		<AbsoluteFill>
			<RushShot src="rushs/derma_roll_crown.mp4" />
			<AbsoluteFill style={{background: 'rgba(8,19,43,0.35)'}} />
			<div style={{position: 'absolute', left: 60, right: 60, top: (vertical ? top : 0) + 260, height: (vertical ? h : 1350) - 520}}>
				<Brackets color="#22D3EE" />
			</div>
			<Stage>
				<Abs top={110}>
					<In at={0} kind="fade">
						<div style={{display: 'flex', alignItems: 'baseline', gap: 16, direction: 'rtl'}}>
							<Counter at={2} dur={40} from={0} to={540} style={{fontSize: 170, color: '#22D3EE', textShadow: '0 0 30px rgba(34,211,238,0.6)'}} />
							<T size={70} color="#fff">إبرة</T>
						</div>
					</In>
				</Abs>
				<Abs top={vertical ? 760 : 1000} left={60} right={60}>
					<KText text="ديرما رولر *540*: كيفاش يخدم؟" size={66} color="#fff" accent="#22D3EE" delay={20} shadow="0 4px 18px rgba(0,0,0,0.8)" />
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const CALLOUTS = [
	{t: '540 إبرة صغيرة', y: 120},
	{t: 'رولر يدور على جلدة الراس', y: 330},
	{t: 'يحضّر الجلدة للزيت', y: 540},
];

const TechDiagram: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical} = useStage();
	const base = vertical ? 160 : 220;
	return (
		<AbsoluteFill>
			<ThemeBg t="tech" />
			<Stage>
				<Abs top={vertical ? 40 : 60}>
					<T size={56} color="#8FB8D8">كيفاش مصنوع؟</T>
				</Abs>
				<Abs top={base} left={40} center={false}>
					<In at={0} kind="left">
						<div style={{transform: 'rotate(-12deg)', filter: 'drop-shadow(0 0 30px rgba(34,211,238,0.35))'}}>
							<Prod k="derma" w={330} h={vertical ? 640 : 760} />
						</div>
					</In>
				</Abs>
				<svg width={1080} height={900} style={{position: 'absolute', top: base, left: 0, overflow: 'visible'}}>
					{CALLOUTS.map((c, i) => {
						const p = ease(f, 20 + i * 40, 40 + i * 40);
						const x1 = 300;
						const x2 = 520;
						const y1 = 110 + i * 120;
						return (
							<g key={i} opacity={p > 0 ? 1 : 0}>
								<circle cx={x1} cy={y1} r={10} fill="#22D3EE" />
								<path d={`M ${x1} ${y1} L ${x1 + (x2 - x1) * p} ${y1 + (c.y - y1) * p}`} stroke="#22D3EE" strokeWidth={4} fill="none" />
							</g>
						);
					})}
				</svg>
				{CALLOUTS.map((c, i) => (
					<Abs key={i} top={base + c.y - 46} right={40} center={false}>
						<In at={36 + i * 40} kind="right">
							<div dir="rtl" style={{width: 500, background: 'rgba(34,211,238,0.1)', border: '2px solid #22D3EE', borderRadius: 16, padding: '12px 22px 16px', boxShadow: '0 0 24px rgba(34,211,238,0.25)'}}>
								<T size={44} color="#EAF6FF">{c.t}</T>
							</div>
						</In>
					</Abs>
				))}
			</Stage>
		</AbsoluteFill>
	);
};

const RULES = [
	{t: 'على راس نظيف وناشف', src: 'rushs/derma_roll_top.mp4', rate: 0.55},
	{t: 'بالشوية، بلا ما تضغط', src: 'rushs/derma_in_hand.mp4', rate: 1},
	{t: 'عقّمو قبل وبعد كل استعمال', src: 'rushs/derma_case.mp4', rate: 0.9},
];

const TechRule: React.FC<{n: number; t: string; src: string; rate: number}> = ({n, t, src, rate}) => {
	const {vertical} = useStage();
	return (
		<AbsoluteFill>
			<ThemeBg t="tech" />
			<Stage>
				<Abs top={vertical ? 40 : 60}>
					<In at={0} kind="down">
						<div style={{display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl'}}>
							<T size={44} color="#8FB8D8">قاعدة</T>
							<N style={{fontSize: 64, color: '#22D3EE'}}>{n}/3</N>
						</div>
					</In>
				</Abs>
				<Abs top={vertical ? 150 : 170}>
					<In at={2} kind="zoom">
						<div style={{width: 900, height: vertical ? 520 : 720, borderRadius: 24, overflow: 'hidden', position: 'relative', border: '3px solid #22D3EE', boxShadow: '0 0 40px rgba(34,211,238,0.3)'}}>
							<Clip src={src} rate={rate} />
						</div>
					</In>
				</Abs>
				<Abs top={vertical ? 720 : 960} left={60} right={60}>
					<div dir="rtl" style={{background: 'rgba(3,10,24,0.8)', border: '2px solid #22D3EE', borderRadius: 18, padding: '14px 26px 20px'}}>
						<KText text={t} size={58} color="#EAF6FF" accent="#22D3EE" delay={8} />
					</div>
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const TechCombo: React.FC = () => {
	const {vertical} = useStage();
	const f = useCurrentFrame();
	const items: {k: 'derma' | 'huile' | 'applicateur'; label: string}[] = [
		{k: 'derma', label: 'ديرما'},
		{k: 'huile', label: 'زيت إكليل الجبل'},
		{k: 'applicateur', label: 'مشط الجذور'},
	];
	return (
		<AbsoluteFill>
			<ThemeBg t="tech" />
			<Stage>
				<Abs top={vertical ? 60 : 80} left={50} right={50}>
					<KText text="ومن بعد: *زيت إكليل الجبل* بمشط الجذور" size={64} color="#EAF6FF" accent="#22D3EE" />
				</Abs>
				<Abs top={vertical ? 300 : 360}>
					<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 10}}>
						{items.map((it, i) => (
							<React.Fragment key={it.k}>
								<In at={10 + i * 18} kind="pop">
									<div style={{width: 270, height: 380, background: 'rgba(34,211,238,0.08)', border: '2px solid #22D3EE', borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
										<Prod k={it.k} w={200} h={260} />
										<T size={32} color="#EAF6FF">{it.label}</T>
									</div>
								</In>
								{i < 2 ? <T size={70} color="#22D3EE" style={{opacity: ease(f, 20 + i * 18, 28 + i * 18)}}>←</T> : null}
							</React.Fragment>
						))}
					</div>
				</Abs>
				<Abs top={vertical ? 760 : 900}>
					<In at={66} kind="fade">
						<T size={44} color="#8FB8D8">
							<N>2</N> ولا <N>3</N> مرات في الجمعة
						</T>
					</In>
				</Abs>
			</Stage>
		</AbsoluteFill>
	);
};

const L06_SCENES: Sc[] = [
	{dur: 90, el: <TechHook />, sfx: <><Ticks a={2} b={42} every={2} v={0.3} /><Sfx at={42} s="check" v={0.5} /></>},
	{dur: 210, el: <TechDiagram />, sfx: <>{CALLOUTS.map((_, i) => <Sfx key={i} at={36 + i * 40} s="pop3" v={0.5} />)}</>},
	...RULES.map((r, i) => ({dur: 84, el: <TechRule n={i + 1} t={r.t} src={r.src} rate={r.rate} />})),
	{dur: 150, el: <TechCombo />, sfx: <>{[0, 1, 2].map((i) => <Sfx key={i} at={10 + i * 18} s={`pop${i + 2}` as 'pop2'} v={0.6} />)}</>},
];
const L06_END = 220;
export const L06_DUR = longDuration(L06_SCENES, L06_END);
export const L06: React.FC = () => <Timeline t="tech" scenes={L06_SCENES} endDur={L06_END} cutSfxVol={0.35} />;

