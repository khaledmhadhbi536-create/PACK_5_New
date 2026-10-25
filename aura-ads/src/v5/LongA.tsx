import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Sfx} from '../v4/kit';
import {Chapter, KText, longDuration, ProductHero, RushShot, Sc, TextCard, Timeline} from './kit5';

/** Titre blanc lisible posé sur une vidéo. */
const OnVideo: React.FC<{text: string; size?: number; delay?: number}> = ({text, size = 84, delay = 0}) => (
	<KText text={text} size={size} color="#fff" accent="#FFD43B" delay={delay} shadow="0 6px 22px rgba(0,0,0,0.8), 0 2px 0 rgba(0,0,0,0.6)" />
);

// ======================= L01 · le guide complet (kraft, ~41 s) =======================

const L01_SCENES: Sc[] = [
	{
		dur: 75,
		el: <RushShot src="rushs/real/v2_tous.mp4" trim={0.4} top={<OnVideo text={'كل شي على الباك\nفي *45 ثانية*'} size={92} />} title="باك الشعر واللحية للرجال" sub="شنوّة فيه وكيفاش تستعملو" />,
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
	{dur: 105, el: <RushShot photo="photos/rituel_huile.jpg" n={2} title="زيت إكليل الجبل" sub="بمشط الجذور، طول على العروق" />},
	{dur: 105, el: <RushShot src="rushs/sidr_massage.mp4" trim={2} n={3} title="ماساج بفرشة التدليك" sub="من 3 لـ 5 دقايق" />},
	{dur: 105, el: <RushShot src="rushs/sidr_rinse.mp4" trim={1} n={4} title="وقت الغسيل" sub="سدر بيو وماء دافي، ماساج وشلّل" />},
	{dur: 90, el: <TextCard text={'*2 ولا 3* مرات\nفي الجمعة'} sub="النتيجة تحب صبر وانتظام" size={104} marker="rgba(47,107,42,0.25)" />},
];
const L01_END = 240;
export const L01_DUR = longDuration(L01_SCENES, L01_END);
export const L01: React.FC = () => (
	<AbsoluteFill>
		<Timeline t="kraft" scenes={L01_SCENES} endDur={L01_END} mid={540} />
	</AbsoluteFill>
);
