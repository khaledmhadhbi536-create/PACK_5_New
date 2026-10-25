import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {IconCheck} from '../components/Icons';
import {C} from '../theme/brand';
import {OFFER2 as O} from '../v2/offer';
import {Badge, N, RED, Rays, Stars, T, YELLOW} from '../v2/WinStill';
import {byKey, PKey, Pack, Prod, TITLE} from '../v3/V3Still';
import {Abs, Below, Clip, Counter, CtaAnim, ease, Flash, FooterPill, In, Music, Pulse, Sfx, Shake, Spin, Stage, StrikeAnim, Tag, Ticks, useStage} from './kit';

// ---------------------------------------------------------------- briques

/** Plan avec « punch » d'entrée (léger zoom) ; à utiliser dans une Sequence. */
const Punch: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, 7], [1.1, 1], {extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

const Shot: React.FC<{from: number; dur: number; src: string; trim?: number; rate?: number; pos?: string; muted?: boolean; vol?: number; children?: React.ReactNode}> = ({
	from,
	dur,
	src,
	trim,
	rate,
	pos,
	muted = true,
	vol,
	children,
}) => (
	<Sequence from={from} durationInFrames={dur}>
		<Punch>
			<Clip src={src} trim={trim} rate={rate} pos={pos} muted={muted} vol={vol} />
		</Punch>
		{children}
	</Sequence>
);

/** Photo avec lent zoom (Ken Burns). */
const Photo: React.FC<{src: string; pos?: string}> = ({src, pos = '50% 50%'}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${1.05 + f * 0.0015})`}} />
		</AbsoluteFill>
	);
};

/** Assombrit haut et bas pour la lisibilité du texte sur vidéo. */
const Scrim: React.FC<{top?: number; bottom?: number}> = ({top = 0.55, bottom = 0.35}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,${top}) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 62%, rgba(0,0,0,${bottom}) 100%)`}} />
);

/** Grand titre blanc lisible sur vidéo. */
const Big: React.FC<{size?: number; color?: string; children: React.ReactNode}> = ({size = 96, color = '#fff', children}) => (
	<T size={size} color={color} style={{textAlign: 'center', lineHeight: 1.15, textShadow: '0 6px 22px rgba(0,0,0,0.75), 0 2px 0 rgba(0,0,0,0.6)'}}>
		{children}
	</T>
);

/** Étiquette produit numérotée (pastille blanche + badge rouge). */
const ProdTag: React.FC<{n: number; k: PKey; at?: number}> = ({n, k, at = 4}) => (
	<In at={at} kind="pop">
		<div style={{position: 'relative'}}>
			<Tag size={60}>{byKey(k).name}</Tag>
			<Badge n={n} size={78} style={{top: -34, right: -30}} />
		</div>
	</In>
);

/** Écran de fin commun : pack + prix + 110 barré + bouton + pied de page. */
const EndCard: React.FC<{title?: React.ReactNode; bg?: string; ray?: string; footBg?: string}> = ({
	title = (
		<>
			كل هذا بـ <N style={{fontSize: 110, color: C.goldLight}}>{O.price}</N> دينار
		</>
	),
	bg = 'radial-gradient(circle at 50% 45%, #34573F 0%, #1C3325 60%, #0E1B13 100%)',
	ray = '#CDE8B5',
	footBg = '#0A0F0C',
}) => {
	const {vertical} = useStage();
	const L = {title: 40, pack: 200, packH: 640, stamp: 200, row: 930, foot: 1236};
	return (
		<AbsoluteFill style={{background: bg}}>
			<Stars color="#000" opacity={0.12} />
			<Spin speed={0.12}>
				<Rays color={ray} opacity={0.12} cy="50%" />
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
						<In at={8} kind="up"><T size={58}><N>5</N> قطع بـ</T></In>
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
						<In at={24} kind="fade"><StrikeAnim at={28} size={54} /></In>
					</Abs>
					<Abs top={650}>
						<CtaAnim at={40} size={62} />
					</Abs>
					<Abs top={889} left={0} right={0}>
						<FooterPill at={50} bg={footBg} />
					</Abs>
				</Stage>
			) : (
				<Stage>
					<Abs top={L.title}>
						<In at={0} kind="drop">
							<T size={92} style={{textShadow: '0 6px 18px rgba(0,0,0,0.4)'}}>{title}</T>
						</In>
					</Abs>
					<Abs top={L.pack}>
						<In at={4} kind="up" dist={160}>
							<Pack W={900} H={L.packH} />
						</In>
					</Abs>
					<Abs top={L.stamp} left={36} z={6}>
						<In at={14} kind="drop">
							<div style={{width: 230, height: 230, borderRadius: '50%', background: RED, border: '7px solid #fff', boxShadow: '0 16px 40px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)', boxSizing: 'border-box'}}>
								<T size={26}>الباك كامل</T>
								<N style={{fontSize: 96, color: '#fff', lineHeight: 1}}>{O.price}</N>
								<T size={30}>دينار</T>
							</div>
						</In>
					</Abs>
					<Abs top={L.row} left={50} right={50} center={false}>
						<div dir="rtl" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
							<In at={24} kind="fade">
								<StrikeAnim at={28} size={48} />
							</In>
							<CtaAnim at={40} size={58} />
						</div>
					</Abs>
					<Abs top={L.foot} left={0} right={0}>
						<FooterPill at={50} bg={footBg} />
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

const END = 100; // durée de l'écran de fin

/** Position du texte « bas de zone utile » (au-dessus de l'interface Reels). */
const useLow = () => {
	const {vertical, top, h} = useStage();
	return vertical ? top + h - 210 : 1350 - 260;
};
const useHigh = () => {
	const {vertical, top} = useStage();
	return vertical ? top + 10 : 60;
};

// ======================= V05 · tout ça pour 49 (vrais produits) =======================

const V05_SHOTS: {src: string; trim: number; k: PKey}[] = [
	{src: 'rushs/real/v2_derma.mp4', trim: 1.0, k: 'derma'},
	{src: 'rushs/real/v2_huile.mp4', trim: 0.0, k: 'huile'},
	{src: 'rushs/real/v2_brosse.mp4', trim: 2.4, k: 'brosse'},
	{src: 'rushs/real/v2_applicateur.mp4', trim: 3.0, k: 'applicateur'},
	{src: 'rushs/real/v2_sidr.mp4', trim: 1.0, k: 'sidr'},
];
const SH = 46;
export const V05_DUR = SH * 5 + END + 10;
export const V05: React.FC = () => {
	const low = useLow();
	const high = useHigh();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{V05_SHOTS.map((s, i) => (
				<Shot key={i} from={i * SH} dur={SH} src={s.src} trim={s.trim}>
					<Scrim top={0.5} bottom={0.45} />
					<Abs top={low}>
						<ProdTag n={i + 1} k={s.k} />
					</Abs>
				</Shot>
			))}
			{/* hook + compteur permanents pendant le défilé */}
			<Sequence from={0} durationInFrames={SH * 5}>
				<Abs top={high}>
					<In at={0} kind="pop">
						<Big size={92}>شوف آش فمّا في الباك</Big>
					</In>
				</Abs>
				<Abs top={high + 130}>
					<In at={8} kind="fade">
						<Tag bg={YELLOW} size={44}>
							<N>5</N> قطع بـ <N>{O.price}</N> د.ت
						</Tag>
					</In>
				</Abs>
			</Sequence>
			<Sequence from={SH * 5}>
				<EndCard />
			</Sequence>
			<Music src="audio/v4/beat_promo.wav" vol={0.42} />
			{V05_SHOTS.map((_, i) => (
				<React.Fragment key={i}>
					<Sfx at={i * SH} s="whoosh" v={0.45} />
					<Sfx at={i * SH + 4} s={`pop${i + 1}` as 'pop1'} v={0.7} />
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};

// ======================= V06 · le sidr =======================

export const V06_DUR = 75 + 65 + 65 + 60 + END;
export const V06: React.FC = () => {
	const low = useLow();
	const high = useHigh();
	const {vertical} = useStage();
	const S4 = 75 + 65 + 65;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shot from={0} dur={75} src="rushs/sidr_chantilly.mp4" trim={2}>
				<Scrim />
				<Abs top={high}>
					<In at={0} kind="zoom">
						<Big size={140} color="#D9F2A6">سدر بيو</Big>
					</In>
				</Abs>
				<Abs top={high + 175}>
					<In at={10} kind="up">
						<Big size={58}>سرّ الحمّام التونسي</Big>
					</In>
				</Abs>
				<Abs top={low}>
					<In at={18} kind="pop">
						<div style={{width: 200, height: 200, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.4)'}}>
							<Prod k="sidr" w={170} h={150} />
						</div>
					</In>
				</Abs>
			</Shot>
			<Shot from={75} dur={65} src="rushs/sidr_whisk.mp4" trim={0}>
				<Scrim top={0.3} />
				<Abs top={low}>
					<In at={4} kind="pop"><Tag size={56}>مع شويّة ماء دافي</Tag></In>
				</Abs>
			</Shot>
			<Shot from={140} dur={65} src="rushs/sidr_massage.mp4" trim={1}>
				<Scrim top={0.3} />
				<Abs top={low}>
					<In at={4} kind="pop"><Tag size={56}>ماساج بفرشة التدليك</Tag></In>
				</Abs>
			</Shot>
			{/* « et 4 pièces en plus » */}
			<Sequence from={S4} durationInFrames={60}>
				<AbsoluteFill style={{background: 'linear-gradient(180deg, #F3F7EA 0%, #DDE8C6 100%)'}}>
					<Stars color={C.sage} opacity={0.1} />
					<Stage>
						<Abs top={vertical ? 30 : 80}>
							<In at={0} kind="drop"><T size={76} color="#2E4A22">وزيد معاه <N>4</N> قطع</T></In>
						</Abs>
						<Abs top={vertical ? 170 : 260}>
							<In at={4} kind="pop"><Prod k="sidr" w={520} h={300} /></In>
						</Abs>
						<Abs top={vertical ? 520 : 700}>
							<div dir="rtl" style={{display: 'flex', gap: 18}}>
								{(['derma', 'huile', 'applicateur', 'brosse'] as PKey[]).map((k, i) => (
									<In key={k} at={14 + i * 7} kind="pop">
										<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
											<div style={{width: 210, height: 210, borderRadius: '50%', background: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
												<Prod k={k} w={150} h={170} />
											</div>
											<T size={28} color="#111" style={{whiteSpace: 'nowrap'}}>{byKey(k).name}</T>
										</div>
									</In>
								))}
							</div>
						</Abs>
					</Stage>
					<Below>
						<div style={{display: 'flex', justifyContent: 'center', paddingTop: 40}}>
							<Pack W={900} H={560} shadow="rgba(60,90,30,0.3)" />
						</div>
					</Below>
				</AbsoluteFill>
			</Sequence>
			<Sequence from={S4 + 60}>
				<EndCard />
			</Sequence>
			<Music src="audio/v4/beat_promo.wav" vol={0.4} start={20} />
			<Sfx at={0} s="sparkle" v={0.6} />
			<Sfx at={75} s="whoosh" v={0.5} />
			<Sfx at={79} s="pop2" v={0.6} />
			<Sfx at={140} s="whoosh" v={0.5} />
			<Sfx at={144} s="pop3" v={0.6} />
			<Sfx at={S4} s="slam" v={0.6} />
			{[0, 1, 2, 3].map((i) => <Sfx key={i} at={S4 + 14 + i * 7} s={`pop${i + 2}` as 'pop2'} v={0.65} />)}
		</AbsoluteFill>
	);
};

// ======================= V07 · derma 540 =======================

export const V07_DUR = 75 + 60 + 70 + END;
export const V07: React.FC = () => {
	const low = useLow();
	const high = useHigh();
	const {vertical} = useStage();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shot from={0} dur={75} src="rushs/derma_roll_crown.mp4" trim={0}>
				<Scrim top={0.55} />
				<Abs top={high}>
					<In at={0} kind="pop">
						<div style={{display: 'flex', alignItems: 'baseline', gap: 16, direction: 'rtl'}}>
							<Counter at={2} dur={34} from={0} to={540} style={{fontSize: 190, color: '#FF6FB5', textShadow: '0 6px 22px rgba(0,0,0,0.7)'}} />
							<Big size={90}>إبرة</Big>
						</div>
					</In>
				</Abs>
				<Abs top={low}>
					<In at={38} kind="pop"><Tag size={60}>ديرما رولر <N>540</N></Tag></In>
				</Abs>
			</Shot>
			<Shot from={75} dur={60} src="rushs/real/v2_derma.mp4" trim={1.5}>
				<Scrim top={0.4} />
				<Abs top={high}>
					<In at={2} kind="drop"><Big size={80}>موجود في الباك</Big></In>
				</Abs>
			</Shot>
			<Sequence from={135} durationInFrames={70}>
				<AbsoluteFill style={{background: 'radial-gradient(circle at 60% 40%, #3A2A3F 0%, #1A141D 60%, #0D0A0F 100%)'}}>
					<Stage>
						<Abs top={vertical ? 0 : 40}>
							<In at={0} kind="down"><T size={74}>ومعاه في نفس الباك</T></In>
						</Abs>
						<Abs top={vertical ? 140 : 200} left={30} center={false}>
							<In at={2} kind="left">
								<div style={{transform: 'rotate(-16deg)'}}>
									<Prod k="derma" w={330} h={vertical ? 640 : 760} />
								</div>
							</In>
						</Abs>
						<Abs top={vertical ? 150 : 230} right={50} center={false}>
							<div dir="rtl" style={{display: 'flex', flexDirection: 'column', gap: 16}}>
								{(['huile', 'sidr', 'applicateur', 'brosse'] as PKey[]).map((k, i) => (
									<In key={k} at={8 + i * 8} kind="right">
										<div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.18)', borderRadius: 24, padding: '10px 18px', width: 540, boxSizing: 'border-box'}}>
											<div style={{width: 120, height: 120, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
												<Prod k={k} w={100} h={104} />
											</div>
											<T size={40}>+ {byKey(k).name}</T>
										</div>
									</In>
								))}
							</div>
						</Abs>
					</Stage>
				</AbsoluteFill>
			</Sequence>
			<Sequence from={205}>
				<EndCard bg="radial-gradient(circle at 50% 45%, #4A2F52 0%, #241A29 60%, #0D0A0F 100%)" ray="#F4B6E0" footBg="#08060A" />
			</Sequence>
			<Music src="audio/v4/beat_promo.wav" vol={0.42} start={6} />
			<Ticks a={2} b={36} every={2} />
			<Sfx at={36} s="check" v={0.6} />
			<Sfx at={75} s="whoosh" v={0.5} />
			<Sfx at={77} s="slam" v={0.6} />
			<Sfx at={135} s="whoosh" v={0.5} />
			{[0, 1, 2, 3].map((i) => <Sfx key={i} at={135 + 8 + i * 8} s={`pop${i + 2}` as 'pop2'} v={0.6} />)}
		</AbsoluteFill>
	);
};

// ======================= V08 · 4 étapes =======================

const STEPS: {k: PKey; t: string; s: string; src?: string; photo?: string; trim?: number; rate?: number}[] = [
	{k: 'derma', t: 'الديرما رولر', s: 'بالشوية على راس نظيف', src: 'rushs/derma_roll_crown.mp4', trim: 0, rate: 1},
	{k: 'huile', t: 'زيت إكليل الجبل', s: 'بمشط الجذور، طول على العروق', photo: 'photos/rituel_huile.jpg'},
	{k: 'brosse', t: 'ماساج', s: 'بفرشة التدليك، 3 لـ 5 دقايق', src: 'rushs/sidr_massage_b.mp4', trim: 0.5},
	{k: 'sidr', t: 'وقت الغسيل', s: 'سدر بيو وماء دافي', src: 'rushs/sidr_rinse.mp4', trim: 1},
];
const ST = 84;
export const V08_DUR = ST * 4 + END + 10;
export const V08: React.FC = () => {
	const low = useLow();
	const high = useHigh();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{STEPS.map((s, i) => (
				<Sequence key={i} from={i * ST} durationInFrames={ST}>
					<Punch>{s.src ? <Clip src={s.src} trim={s.trim} rate={s.rate} /> : <Photo src={s.photo!} />}</Punch>
					<Scrim top={0.5} bottom={0.5} />
					<Abs top={low - 40} left={40} right={40} center={false}>
						<In at={3} kind="up">
							<div dir="rtl" style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(255,255,255,0.95)', borderRadius: 30, padding: '14px 26px', boxShadow: '0 14px 30px rgba(0,0,0,0.35)'}}>
								<div style={{width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Prod k={s.k} w={130} h={130} />
								</div>
								<div>
									<T size={56} color="#111">{s.t}</T>
									<T size={36} color="#555" weight={700}>{s.s}</T>
								</div>
								<Badge n={i + 1} size={86} style={{top: -36, right: -24}} />
							</div>
						</In>
					</Abs>
				</Sequence>
			))}
			<Sequence from={0} durationInFrames={ST * 4}>
				<Abs top={high}>
					<In at={0} kind="pop">
						<Big size={86}>
							روتين ساهل في <span style={{color: YELLOW}}><N>4</N> خطوات</span>
						</Big>
					</In>
				</Abs>
				<Abs top={high + 120}>
					<In at={10} kind="fade">
						<Tag size={40} bg="rgba(255,255,255,0.9)">
							<N>2</N> ولا <N>3</N> مرات في الجمعة
						</Tag>
					</In>
				</Abs>
			</Sequence>
			<Sequence from={ST * 4}>
				<EndCard title={<>روتين كامل بـ <N style={{fontSize: 110, color: C.goldLight}}>{O.price}</N> دينار</>} />
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

// ======================= V09 · paiement à la livraison =======================

const CHECKS = ['5 قطع في باك واحد', 'الخلاص عند الاستلام', 'توصيل لكامل ولايات تونس'];
export const V09_DUR = 130 + END;
export const V09: React.FC = () => {
	const high = useHigh();
	const {vertical, top, h} = useStage();
	const listTop = vertical ? top + h - 380 : 1350 - 430;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shot from={0} dur={44} src="rushs/real/p5_huile.mp4" trim={0.9} />
			<Shot from={44} dur={42} src="rushs/real/p5_derma.mp4" trim={1.2} />
			<Shot from={86} dur={44} src="rushs/real/p5_fermeture.mp4" trim={1.5} />
			<Sequence from={0} durationInFrames={130}>
				<Scrim top={0.6} bottom={0.55} />
				<Abs top={high}>
					<In at={0} kind="pop"><Big size={110}>اطلب توّا</Big></In>
				</Abs>
				<Abs top={high + 140}>
					<In at={8} kind="up"><Big size={74} color={YELLOW}>وخلّص كي يوصلك</Big></In>
				</Abs>
				<Abs top={listTop} right={50} center={false}>
					<div dir="rtl" style={{display: 'flex', flexDirection: 'column', gap: 18}}>
						{CHECKS.map((c, i) => (
							<In key={c} at={24 + i * 22} kind="right">
								<div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.65)', borderRadius: 999, padding: '8px 28px 12px 18px'}}>
									<div style={{width: 58, height: 58, borderRadius: '50%', background: '#2FA35A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<IconCheck size={38} color="#fff" />
									</div>
									<T size={46}>{c}</T>
								</div>
							</In>
						))}
					</div>
				</Abs>
			</Sequence>
			<Sequence from={130}>
				<EndCard title={<>الباك كامل بـ <N style={{fontSize: 110, color: C.goldLight}}>{O.price}</N> دينار</>} />
			</Sequence>
			<Music src="audio/v4/beat_promo.wav" vol={0.4} start={14} />
			<Sfx at={0} s="slam" v={0.6} />
			<Sfx at={44} s="whoosh" v={0.4} />
			<Sfx at={86} s="whoosh" v={0.4} />
			{CHECKS.map((_, i) => <Sfx key={i} at={24 + i * 22} s="check" v={0.75} />)}
		</AbsoluteFill>
	);
};

// ======================= V13 · ASMR =======================

export const V13_DUR = 80 + 65 + 60 + 55 + END;
export const V13: React.FC = () => {
	const high = useHigh();
	const low = useLow();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shot from={0} dur={80} src="rushs/real/v2_brosse.mp4" trim={2.0} muted={false} vol={3} />
			<Shot from={80} dur={65} src="rushs/sidr_whisk.mp4" trim={0} />
			<Shot from={145} dur={60} src="rushs/real/v2_derma.mp4" trim={1.0} muted={false} vol={3} />
			<Shot from={205} dur={55} src="rushs/real/v2_huile.mp4" trim={0.2} muted={false} vol={3} />
			<Sequence from={0} durationInFrames={260}>
				<Scrim top={0.35} bottom={0.3} />
				<Abs top={high}>
					<In at={0} kind="fade" out={70}>
						<Tag size={44} bg="rgba(0,0,0,0.6)" color="#fff">
							علّي الصوت
						</Tag>
					</In>
				</Abs>
				<Abs top={low}>
					<In at={150} kind="fade">
						<Tag size={50}>
							<N>5</N> قطع بـ <N>{O.price}</N> د.ت
						</Tag>
					</In>
				</Abs>
			</Sequence>
			<Sequence from={260}>
				<EndCard />
			</Sequence>
			<Music src="audio/v4/beat_promo.wav" vol={0.14} start={20} />
		</AbsoluteFill>
	);
};

// ======================= V14 · POV =======================

const POV_TAGS: {k: PKey; at: number; x: number; y: number}[] = [
	{k: 'derma', at: 40, x: 560, y: 380},
	{k: 'huile', at: 58, x: 180, y: 300},
	{k: 'brosse', at: 76, x: 120, y: 560},
	{k: 'applicateur', at: 94, x: 640, y: 120},
	{k: 'sidr', at: 112, x: 600, y: 640},
];
export const V14_DUR = 150 + END;
export const V14: React.FC = () => {
	const {vertical, top} = useStage();
	const high = useHigh();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shot from={0} dur={150} src="rushs/real/v2_tous.mp4" trim={0.4} />
			<Sequence from={0} durationInFrames={150}>
				<Scrim top={0.6} bottom={0.3} />
				<Abs top={high}>
					<In at={0} kind="pop">
						<div style={{textAlign: 'center'}}>
							<span style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 80, color: YELLOW, textShadow: '0 4px 14px rgba(0,0,0,0.6)'}}>POV:</span>
							<Big size={78}>لقيت باك كامل بـ <N>{O.price}</N> د.ت</Big>
						</div>
					</In>
				</Abs>
				{POV_TAGS.map((p) => (
					<div key={p.k} style={{position: 'absolute', left: p.x - 60, top: (vertical ? top + 200 : 230) + p.y * (vertical ? 1 : 0.95)}}>
						<In at={p.at} kind="pop">
							<Tag size={40} rotate={p.x > 500 ? 3 : -3}>{byKey(p.k).name}</Tag>
						</In>
					</div>
				))}
			</Sequence>
			<Sequence from={150}>
				<EndCard />
			</Sequence>
			<Music src="audio/v4/beat_promo.wav" vol={0.42} start={2} />
			<Sfx at={0} s="pop1" v={0.6} />
			{POV_TAGS.map((p, i) => <Sfx key={p.k} at={p.at} s={`pop${i + 1}` as 'pop1'} v={0.7} />)}
		</AbsoluteFill>
	);
};

// ======================= V11 · cadeau (animé, sans rush) =======================

export const GiftBox: React.FC<{openAt: number}> = ({openAt}) => {
	const f = useCurrentFrame();
	const lid = ease(f, openAt, openAt + 14);
	return (
		<div style={{position: 'relative', width: 520, height: 330}}>
			{/* couvercle */}
			<div style={{position: 'absolute', left: -20, top: -60, width: 560, height: 90, background: '#C8202A', borderRadius: 14, boxShadow: '0 8px 0 #8E141B', transform: `translate(${lid * 700}px, ${-lid * 160}px) rotate(${lid * 75}deg)`, opacity: 1 - ease(f, openAt + 8, openAt + 16), zIndex: 3}}>
				<div style={{position: 'absolute', left: 250, top: 0, width: 60, height: '100%', background: YELLOW}} />
			</div>
			{/* boîte */}
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#E2343B,#B21C25)', borderRadius: 18, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', zIndex: 2}}>
				<div style={{position: 'absolute', left: 230, top: 0, width: 60, height: '100%', background: YELLOW}} />
			</div>
		</div>
	);
};

export const Sparkles: React.FC<{at: number}> = ({at}) => {
	const f = useCurrentFrame();
	if (f < at) return null;
	const d = f - at;
	return (
		<>
			{Array.from({length: 22}, (_, i) => {
				const a = (i / 22) * Math.PI * 2;
				const r = d * (10 + (i % 5) * 3);
				const o = Math.max(0, 1 - d / 30);
				return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * r, top: 420 + Math.sin(a) * r * 0.8, width: 14, height: 14, background: i % 2 ? YELLOW : '#fff', transform: 'rotate(45deg)', opacity: o}} />;
			})}
		</>
	);
};

const WHO = ['لبوك', 'لخوك', 'لراجلك'];
export const V11_DUR = 300;
export const V11: React.FC = () => {
	const f = useCurrentFrame();
	const {vertical} = useStage();
	const rise = ease(f, 24, 46);
	const L = vertical ? {title: 0, who: 115, box: 300, price: 650, row: 770, foot: 889} : {title: 40, who: 160, box: 420, price: 880, row: 1060, foot: 1236};
	const wi = f < 70 ? -1 : Math.min(2, Math.floor((f - 70) / 22));
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #FFF2EC 0%, #F7D3C4 70%, #EDB9A6 100%)', overflow: 'hidden'}}>
			<Stars color={C.terracotta} opacity={0.1} />
			<Shake hits={[24, 150]} amp={10}>
				<Below>
					<div style={{display: 'flex', justifyContent: 'center', paddingTop: 40}}>
						<In at={0} kind="up" dist={120}><Pack W={900} H={560} shadow="rgba(90,26,18,0.3)" /></In>
					</div>
				</Below>
				<Stage>
					<Abs top={L.title}>
						<In at={0} kind="drop"><T size={92} color="#5A1A12">فكرة هدية للراجل</T></In>
					</Abs>
					<Abs top={L.who}>
						{wi >= 0 ? (
							<div dir="rtl" style={{display: 'flex', gap: 26}}>
								{WHO.map((w, i) => (
									<In key={w} at={70 + i * 22} kind="pop">
										<div style={{background: i === wi ? RED : 'rgba(255,255,255,0.8)', borderRadius: 999, padding: '2px 30px 10px'}}>
											<T size={56} color={i === wi ? '#fff' : '#5A1A12'}>{w}</T>
										</div>
									</In>
								))}
							</div>
						) : null}
					</Abs>
					{/* boîte + pack qui sort */}
					<Abs top={L.box}>
						<div style={{position: 'relative', width: 900, height: 340, display: 'flex', justifyContent: 'center'}}>
							<div style={{position: 'absolute', bottom: 20 + rise * 130, opacity: Math.min(1, rise * 3), transform: `scale(${0.5 + 0.5 * rise})`, transformOrigin: 'bottom center', zIndex: 3}}>
								<Pack W={520} H={290} shadow="rgba(0,0,0,0.25)" />
							</div>
							<div style={{position: 'absolute', bottom: -10, zIndex: 2, transform: 'scale(0.8)', transformOrigin: 'bottom center'}}>
								<GiftBox openAt={22} />
							</div>
						</div>
					</Abs>
					<Abs top={L.price}>
						<In at={150} kind="zoom">
							<div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 18}}>
								<T size={56} color="#111"><N>5</N> قطع بـ</T>
								<div style={{background: '#111', borderRadius: 26, padding: '0 34px'}}>
									<T size={100} color={YELLOW}><N style={{fontSize: 108}}>{O.price}</N> د.ت</T>
								</div>
							</div>
						</In>
					</Abs>
					<Abs top={L.row} left={50} right={50} center={false}>
						<div dir="rtl" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
							<In at={168} kind="fade"><StrikeAnim at={172} size={46} color="#111" /></In>
							<CtaAnim at={190} size={56} bg={RED} />
						</div>
					</Abs>
					<Abs top={L.foot} left={0} right={0}>
						<FooterPill at={200} />
					</Abs>
				</Stage>
				<div style={{position: 'absolute', left: 0, right: 0, top: vertical ? 269 + L.box - 400 : L.box - 400, height: 900}}>
					<Sparkles at={24} />
				</div>
			</Shake>
			<Flash at={24} max={0.5} />
			<Music src="audio/v4/beat_promo.wav" vol={0.38} start={24} />
			<Sfx at={0} s="slam" v={0.5} />
			<Sfx at={22} s="boxpop" v={0.9} />
			<Sfx at={24} s="sparkle" v={0.8} />
			{WHO.map((_, i) => <Sfx key={i} at={70 + i * 22} s={`pop${i + 2}` as 'pop2'} v={0.7} />)}
			<Sfx at={150} s="stamp" v={0.9} />
			<Sfx at={172} s="marker" v={0.75} />
			<Sfx at={180} s="cash" v={0.6} />
		</AbsoluteFill>
	);
};

