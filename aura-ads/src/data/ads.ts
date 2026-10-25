import {COPY} from './copy';
import type {AdSpec, Scene, Visual} from './types';
import type {FormatKey} from '../theme/brand';
import {OFFER} from './product';

/**
 * ================================================================
 *  BIBLIOTHÈQUE DES PUBS VIDÉO
 * ================================================================
 * Chaque concept est une fonction qui fabrique une pub à partir
 * d'un format et d'un hook. Pour créer une nouvelle variante :
 *   1. ajoute un hook dans src/data/copy.ts (ou écris-le ici)
 *   2. ajoute une ligne dans la liste ADS en bas de ce fichier
 *   3. lance `npm run render:one -- C01` (ou `npm run render:all`)
 */

const PRICE_LINE = `الباك الكامل بـ *${OFFER.price} ${OFFER.currencyAr}*`;

// Textes d'annonce Meta réutilisés (texte principal)
const PT = {
	ritual: `🌿 روتين كامل للشعر واللحية، طبيعي وساهل في الدار.

الباك فيه 5 حوايج:
1️⃣ سدر طبيعي: ينظّف بالشوية ويقوّي الشعر
2️⃣ زيت الروماران: ينشّط جلدة الراس
3️⃣ ديرما رولر 540: الزيت يدخل خير
4️⃣ فلاكون: الزيت طول على العروق
5️⃣ بروس ماساج: يفرّق الزيت ويمشي مع السدر

🕒 2 ولا 3 مرات في الجمعة. النتيجة تحب صبر وانتظام.

💰 الباك الكامل: ${OFFER.price} دينار
💵 تخلّص كي يوصلك | 🚚 توصيل لكامل تونس
📞 كوموندي توّا: ${OFFER.phone}`,
	unbox: `📦 شنوّة فيه الباك؟ 5 منتوجات للعناية بالشعر واللحية:
سدر طبيعي • زيت الروماران • ديرما رولر 540 • فلاكون • بروس ماساج

💰 الكل بـ ${OFFER.price} دينار برك
💵 تخلّص كي يوصلك | 🚚 توصيل لكامل ولايات تونس
📞 ${OFFER.phone}`,
	heritage: `🇹🇳 السدر… من الحمّام متاع جدودنا لروتينك اليوم.
في Aura Bio زدنالو زيت الروماران، ديرما رولر، فلاكون وبروس ماساج: روتين كامل للشعر واللحية.

💰 ${OFFER.price} دينار الباك الكامل
💵 تخلّص كي يوصلك | 🚚 توصيل لكامل تونس
📞 ${OFFER.phone}`,
	offer: `🔥 الباك الكامل للشعر واللحية بـ ${OFFER.price} دينار برك!
5 منتوجات: سدر، زيت الروماران، ديرما رولر، فلاكون، بروس ماساج.
💵 تخلّص كي يوصلك | 🚚 توصيل لكامل تونس
📞 ${OFFER.phone}`,
	gift: `🎁 تلوّج على هدية تفرّح بيها راجل عزيز عليك؟
باك كامل للعناية بالشعر واللحية: سدر طبيعي، زيت الروماران، ديرما رولر، فلاكون وبروس ماساج.

💰 ${OFFER.price} دينار | 💵 تخلّص كي يوصلك | 🚚 توصيل لكامل تونس
📞 ${OFFER.phone}`,
	asmr: `😌 سدر طبيعي يولّي شانتيي… وماساج يرتّح.
روتين Aura Bio للشعر واللحية: 5 منتوجات بـ ${OFFER.price} دينار.
💵 تخلّص كي يوصلك | 📞 ${OFFER.phone}`,
	derma: `🧐 الديرما رولر: 540 إبرة صغيرة تنشّط جلدة الراس وتخلّي زيت الروماران يدخل خير.
⚠️ استعملو بالشوية على راس نظيف وناشف، وعقّمو قبل وبعد كل استعمال.

في الباك: ديرما رولر + زيت الروماران + سدر + فلاكون + بروس ماساج
💰 ${OFFER.price} دينار | 💵 تخلّص كي يوصلك | 📞 ${OFFER.phone}`,
	beard: `🧔 الباك مش كان للشعر… للّحية زادة.
زيت الروماران + ديرما رولر + بروس ماساج + سدر + فلاكون.
💰 ${OFFER.price} دينار | 💵 تخلّص كي يوصلك | 📞 ${OFFER.phone}`,
};

// ------------------------------------------------------------------
// Briques de scènes réutilisables
// ------------------------------------------------------------------
const ritualBody = (): Scene[] => [
	{kind: 'rush', dur: 3.4, src: 'rushs/derma_roll_crown.mp4', step: 1, title: 'الديرما رولر', caption: COPY.steps[0].text, inset: 'derma'},
	{kind: 'rush', dur: 2.4, src: 'rushs/derma_roll_side.mp4', rate: 0.75, caption: COPY.safetyDerma},
	{kind: 'rush', dur: 3.2, src: 'photos/rituel_huile.jpg', step: 2, title: 'زيت الروماران', caption: COPY.steps[1].text, inset: 'huile', focusY: 40},
	{kind: 'rush', dur: 3.0, src: 'rushs/brush_spikes.mp4', step: 3, title: 'ماساج', caption: COPY.steps[2].text},
	{kind: 'rush', dur: 2.6, src: 'photos/goutte_romarin.jpg', step: 4, title: 'خلّيه يخدم', caption: COPY.steps[3].text, focusY: 35},
	{kind: 'rush', dur: 3.0, src: 'rushs/sidr_chantilly.mp4', title: COPY.wash.title, caption: COPY.wash.text, inset: 'sidr'},
	{kind: 'rush', dur: 2.6, src: 'rushs/sidr_massage.mp4', trim: 2, mode: 'card', caption: 'ماساج بالسدر والبروس، *وشلّل*'},
];

// ------------------------------------------------------------------
// C01 — LE RITUEL (tutoriel)
// ------------------------------------------------------------------
const C01 = (format: FormatKey, variant: string, hook: string, visual: Visual, hookLabel: string, short = false): AdSpec => ({
	concept: 'C01',
	slug: 'rituel',
	variant,
	format,
	style: 'ugc',
	music: 'rituel',
	transition: 'fade',
	scenes: [
		{kind: 'hook', dur: 2.6, text: hook, visual, sub: short ? undefined : 'روتين *طبيعي* في الدار'},
		...(short ? ritualBody().filter((_, i) => [0, 2, 3, 5].includes(i)) : ritualBody()),
		...(short ? [] : [{kind: 'steps', dur: 4.6} as Scene]),
		{kind: 'offer', dur: 3.4, title: PRICE_LINE},
		{kind: 'cta', dur: 3.2, title: COPY.packFull},
	],
	meta: {
		approach: 'Tutoriel : le rituel en 4 étapes + lavage au sidr',
		hook: hookLabel,
		primaryText: PT.ritual,
		headline: `روتين الشعر واللحية | ${OFFER.price} DT`,
	},
});

// ------------------------------------------------------------------
// C02 — UNBOXING 5 EN 1
// ------------------------------------------------------------------
const C02 = (format: FormatKey, variant: string, hook: string, hookLabel: string): AdSpec => ({
	concept: 'C02',
	slug: 'unboxing',
	variant,
	format,
	style: 'stu',
	music: 'darbuka',
	transition: 'slide',
	scenes: [
		{kind: 'hook', dur: 2.3, text: hook, visual: {type: 'pack'}, sticker: '5 في 1'},
		{kind: 'rush', dur: 1.6, src: 'rushs/derma_unbox_box.mp4', caption: 'يلّا *نحلّو الباك*'},
		{kind: 'product', dur: 1.8, product: 'sidr', total: 5},
		{kind: 'product', dur: 1.8, product: 'huile', total: 5},
		{kind: 'product', dur: 1.8, product: 'derma', total: 5},
		{kind: 'product', dur: 1.8, product: 'flacon', total: 5},
		{kind: 'product', dur: 1.8, product: 'brosse', total: 5},
		{kind: 'offer', dur: 3.0, title: `الـ 5 الكل بـ *${OFFER.price} ${OFFER.currencyAr}*`},
		{kind: 'cta', dur: 2.8},
	],
	meta: {
		approach: 'Unboxing : révélation des 5 produits un par un, prix à la fin',
		hook: hookLabel,
		primaryText: PT.unbox,
		headline: `5 منتوجات بـ ${OFFER.price} DT | تخلّص كي يوصلك`,
	},
});

// ------------------------------------------------------------------
// C03 — HÉRITAGE DU SIDR
// ------------------------------------------------------------------
const C03 = (format: FormatKey, variant: string, hook: string, hookLabel: string): AdSpec => ({
	concept: 'C03',
	slug: 'heritage',
	variant,
	format,
	style: 'her',
	music: 'heritage',
	transition: 'fade',
	scenes: [
		{kind: 'heritage', dur: 3.0, text: hook, visual: {type: 'rush', src: 'rushs/sidr_spoon_grass.mp4'}},
		{kind: 'heritage', dur: 3.0, text: 'من الحمّام متاع *جدّاتنا*…\nلروتينك اليوم', visual: {type: 'rush', src: 'rushs/sidr_whisk.mp4'}},
		{kind: 'heritage', dur: 3.0, text: 'السدر *الطبيعي*', sub: 'ينظّف بالشوية ويقوّي الشعر', visual: {type: 'product', product: 'sidr'}},
		{kind: 'heritage', dur: 3.2, text: 'وزدنالو *زيت الروماران*', sub: 'وديرما رولر، فلاكون وبروس ماساج', visual: {type: 'pack'}},
		{kind: 'rush', dur: 2.6, src: 'rushs/sidr_massage.mp4', trim: 3, mode: 'card', caption: 'ماساج بالسدر… *كيما زمان*'},
		{kind: 'offer', dur: 3.2, title: 'روتين *تونسي* للشعر واللحية'},
		{kind: 'cta', dur: 3.0},
	],
	meta: {
		approach: 'Héritage tunisien : le sidr du hammam + le romarin moderne',
		hook: hookLabel,
		primaryText: PT.heritage,
		headline: `السدر + الروماران | ${OFFER.price} DT`,
	},
});

// ------------------------------------------------------------------
// C04 — OFFRE FLASH (bumpers)
// ------------------------------------------------------------------
const C04 = (format: FormatKey, variant: string, hook: string, hookLabel: string, long = false): AdSpec => ({
	concept: 'C04',
	slug: 'offre',
	variant,
	format,
	style: 'souk',
	music: 'punch',
	transition: 'wipe',
	scenes: long
		? [
				{kind: 'text', dur: 2.3, text: hook, visual: {type: 'pack'}},
				{kind: 'grid', dur: 2.8, title: COPY.pack5},
				{kind: 'offer', dur: 3.0, title: COPY.packFull},
				{kind: 'cta', dur: 2.8},
			]
		: [
				{kind: 'text', dur: 2.4, text: hook, visual: {type: 'pack'}},
				{kind: 'cta', dur: 3.9, title: COPY.packFull},
			],
	meta: {
		approach: 'Offre flash : prix, paiement à la livraison, livraison partout',
		hook: hookLabel,
		primaryText: PT.offer,
		headline: `${OFFER.price} DT برك | الخلاص عند الاستلام`,
	},
});

// ------------------------------------------------------------------
// C05 — IDÉE CADEAU
// ------------------------------------------------------------------
const C05 = (format: FormatKey, variant: string, hook: string, hookLabel: string): AdSpec => ({
	concept: 'C05',
	slug: 'cadeau',
	variant,
	format,
	style: 'stu',
	music: 'darbuka',
	musicStart: 8,
	transition: 'slide',
	scenes: [
		{kind: 'hook', dur: 2.6, text: hook, visual: {type: 'pack'}, sticker: 'هدية'},
		{kind: 'text', dur: 2.6, text: 'روتين كامل للشعر\n*واللحية* في الدار', visual: {type: 'product', product: 'derma'}},
		{kind: 'grid', dur: 3.0, title: COPY.pack5},
		{kind: 'offer', dur: 3.2, title: `هدية تفرّح… بـ *${OFFER.price} ${OFFER.currencyAr}*`},
		{kind: 'cta', dur: 3.0},
	],
	meta: {
		approach: 'Cadeau : pour les femmes qui achètent pour un homme',
		hook: hookLabel,
		primaryText: PT.gift,
		headline: `هدية للراجل | ${OFFER.price} DT`,
	},
});

// ------------------------------------------------------------------
// C06 — ASMR SIDR
// ------------------------------------------------------------------
const C06 = (format: FormatKey, variant: string): AdSpec => ({
	concept: 'C06',
	slug: 'asmr',
	variant,
	format,
	style: 'nat',
	music: 'rituel',
	musicStart: 11,
	transition: 'fade',
	scenes: [
		{kind: 'hook', dur: 2.6, text: COPY.hooks.asmr, visual: {type: 'rush', src: 'rushs/sidr_whisk.mp4'}},
		{kind: 'rush', dur: 2.6, src: 'rushs/sidr_chantilly.mp4', trim: 3, caption: 'سدر *طبيعي* + ماء دافي', inset: 'sidr'},
		{kind: 'rush', dur: 2.0, src: 'rushs/brush_spikes.mp4', caption: 'بروس *الماساج*'},
		{kind: 'rush', dur: 2.2, src: 'photos/goutte_romarin.jpg', caption: 'زيت *الروماران*', inset: 'huile', focusY: 40},
		{kind: 'cta', dur: 3.2, title: COPY.packFull},
	],
	meta: {
		approach: 'ASMR : textures satisfaisantes (sidr chantilly, brosse, goutte)',
		hook: 'ASMR : سدر شانتيي',
		primaryText: PT.asmr,
		headline: `روتين Aura Bio | ${OFFER.price} DT`,
	},
});

// ------------------------------------------------------------------
// C07 — LE DERMA ROLLER EXPLIQUÉ
// ------------------------------------------------------------------
const C07 = (format: FormatKey, variant: string, hook: string, visual: Visual, hookLabel: string): AdSpec => ({
	concept: 'C07',
	slug: 'derma',
	variant,
	format,
	style: 'nat',
	music: 'rituel',
	musicStart: 4,
	transition: 'fade',
	scenes: [
		{kind: 'hook', dur: 2.6, text: hook, visual},
		{kind: 'rush', dur: 2.6, src: 'rushs/derma_in_hand.mp4', caption: 'إبر صغيرة برشا… *تنشّط جلدة الراس*'},
		{kind: 'rush', dur: 2.6, src: 'rushs/derma_roll_top.mp4', rate: 0.7, caption: 'وزيت الروماران *يدخل خير* للعروق', inset: 'huile'},
		{kind: 'rush', dur: 2.4, src: 'rushs/derma_rinse.mp4', rate: 0.5, caption: COPY.safetyDerma},
		{kind: 'offer', dur: 3.2, title: 'الديرما رولر + *4 منتوجات*'},
		{kind: 'cta', dur: 3.0},
	],
	meta: {
		approach: 'Curiosité : à quoi sert le derma roller et comment l’utiliser en douceur',
		hook: hookLabel,
		primaryText: PT.derma,
		headline: `ديرما رولر + روماران | ${OFFER.price} DT`,
	},
});

// ------------------------------------------------------------------
// C08 — 3 CONSEILS DERMA
// ------------------------------------------------------------------
const C08 = (format: FormatKey, variant: string): AdSpec => ({
	concept: 'C08',
	slug: 'conseils',
	variant,
	format,
	style: 'ugc',
	music: 'rituel',
	musicStart: 20,
	transition: 'fade',
	scenes: [
		{kind: 'hook', dur: 2.6, text: COPY.hooks.tips3, visual: {type: 'rush', src: 'rushs/derma_in_hand.mp4'}},
		{kind: 'tip', dur: 3.2, n: 1, text: '*عقّمو* قبل وبعد كل استعمال', visual: {type: 'rush', src: 'rushs/derma_rinse.mp4', rate: 0.5}},
		{kind: 'tip', dur: 3.2, n: 2, text: 'بالشوية… *بلاش ما تضغط*', sub: 'على راس نظيف وناشف', visual: {type: 'rush', src: 'rushs/derma_roll_crown.mp4'}},
		{kind: 'tip', dur: 3.2, n: 3, text: '*2 ولا 3 مرات* في الجمعة', sub: 'النتيجة تحب صبر وانتظام', visual: {type: 'photo', src: 'photos/rituel_huile.jpg', focusY: 40}},
		{kind: 'pack', dur: 2.8, title: 'وفي الباك *عندك كل شي*'},
		{kind: 'cta', dur: 3.0},
	],
	meta: {
		approach: 'Éducation / confiance : 3 conseils d’utilisation du derma roller',
		hook: '3 حاجات لازم تعرفهم على الديرما رولر',
		primaryText: PT.derma,
		headline: `3 نصايح + باك كامل | ${OFFER.price} DT`,
	},
});

// ------------------------------------------------------------------
// C09 — BARBE AUSSI
// ------------------------------------------------------------------
const C09 = (format: FormatKey, variant: string): AdSpec => ({
	concept: 'C09',
	slug: 'barbe',
	variant,
	format,
	style: 'souk',
	music: 'punch',
	musicStart: 16,
	transition: 'wipe',
	scenes: [
		{kind: 'text', dur: 2.6, text: COPY.hooks.beard, visual: {type: 'pack'}},
		{kind: 'text', dur: 2.6, text: 'زيت الروماران + ماساج\n*للّحية زادة*', visual: {type: 'product', product: 'huile'}},
		{kind: 'grid', dur: 2.8, title: COPY.pack5},
		{kind: 'cta', dur: 3.2, title: COPY.packFull},
	],
	meta: {
		approach: 'Élargissement : le pack sert aussi pour la barbe',
		hook: 'مش كان للشعر… للّحية زادة',
		primaryText: PT.beard,
		headline: `للشعر واللحية | ${OFFER.price} DT`,
	},
});

// ------------------------------------------------------------------
// C10 — LE GUIDE COMPLET (long, retargeting)
// ------------------------------------------------------------------
const C10 = (format: FormatKey, variant: string): AdSpec => ({
	concept: 'C10',
	slug: 'guide',
	variant,
	format,
	style: 'nat',
	music: 'rituel',
	transition: 'fade',
	scenes: [
		{kind: 'hook', dur: 2.6, text: COPY.hooks.guide, visual: {type: 'pack'}},
		{kind: 'product', dur: 2.4, product: 'sidr', withRush: true, total: 5},
		{kind: 'product', dur: 2.4, product: 'huile', total: 5},
		{kind: 'product', dur: 2.4, product: 'derma', withRush: true, total: 5},
		{kind: 'product', dur: 2.4, product: 'flacon', total: 5},
		{kind: 'product', dur: 2.4, product: 'brosse', withRush: true, total: 5},
		{kind: 'text', dur: 2.2, text: 'كيفاش *تستعملو*؟'},
		...ritualBody(),
		{kind: 'steps', dur: 4.6},
		{kind: 'offer', dur: 3.4, title: PRICE_LINE},
		{kind: 'cta', dur: 3.4},
	],
	meta: {
		approach: 'Guide complet : produits + rituel + offre (audiences chaudes / retargeting)',
		hook: 'كل شي على الباك في دقيقة',
		primaryText: PT.ritual,
		headline: `كل شي على الباك | ${OFFER.price} DT`,
	},
});

// ==================================================================
//  LA LISTE — une ligne = une pub rendue
// ==================================================================
const H = COPY.hooks;
export const ADS: AdSpec[] = [
	// C01 Rituel — 3 hooks testés sur le même corps (seul le texte change)
	C01('9x16', 'h1', H.ritual, {type: 'pack'}, 'روتين الشعر واللحية في 4 خطوات'),
	C01('9x16', 'h2', H.ritualHow, {type: 'pack'}, 'كيفاش تستعمل الديرما رولر مع الروماران؟'),
	C01('9x16', 'h3', H.ritualTime, {type: 'pack'}, '10 دقايق، 2 ولا 3 مرات في الجمعة'),
	C01('9x16', 'h4', H.ritualHow, {type: 'rush', src: 'rushs/derma_in_hand.mp4'}, 'كيفاش تستعمل الديرما رولر… (visuel rush)'),
	C01('9x16', 'court', H.ritual, {type: 'pack'}, 'روتين الشعر واللحية في 4 خطوات (version courte)', true),
	C01('4x5', 'h1', H.ritual, {type: 'pack'}, 'روتين الشعر واللحية في 4 خطوات'),

	// C02 Unboxing
	C02('9x16', 'h1', H.unboxWhat, 'شنوّة فيه الباك هذا؟'),
	C02('9x16', 'h2', H.unbox5, '5 حوايج في باك واحد'),
	C02('9x16', 'h3', H.unboxFull, 'باك كامل للشعر واللحية'),
	C02('4x5', 'h1', H.unboxWhat, 'شنوّة فيه الباك هذا؟'),
	C02('1x1', 'h2', H.unbox5, '5 حوايج في باك واحد'),

	// C03 Héritage
	C03('9x16', 'h1', H.heritageSecret, 'السدر… سرّ الحمّام متاع جدودنا'),
	C03('9x16', 'h2', H.heritageBefore, 'قبل الشامبوان… كان فمّا السدر'),
	C03('4x5', 'h1', H.heritageSecret, 'السدر… سرّ الحمّام متاع جدودنا'),

	// C04 Offre flash
	C04('9x16', 'prix', H.offerPrice, '49 دينار برك'),
	C04('9x16', 'cod', H.offerCod, 'تخلّص كي يوصلك'),
	C04('9x16', 'livraison', H.offerDelivery, 'توصيل لكامل تونس'),
	C04('9x16', 'long', H.offerPrice, '49 دينار برك (version 10 s)', true),
	C04('4x5', 'long', H.offerPrice, '49 دينار برك (version 10 s)', true),
	C04('1x1', 'prix', H.offerPrice, '49 دينار برك'),

	// C05 Cadeau
	C05('9x16', 'h1', H.giftIdea, 'فكرة هدية للراجل؟'),
	C05('9x16', 'h2', H.giftWho, 'هدية لخوك، لبوك ولا لراجلك'),
	C05('4x5', 'h1', H.giftIdea, 'فكرة هدية للراجل؟'),

	// C06 ASMR
	C06('9x16', 'v1'),
	C06('1x1', 'v1'),

	// C07 Derma expliqué
	C07('9x16', 'h1', H.derma540, {type: 'product', product: 'derma'}, '540 إبرة صغيرة… علاش؟'),
	C07('9x16', 'h2', H.dermaTrend, {type: 'product', product: 'huile'}, 'الروماران ولّى ترند… أما كيفاش تستعملو صحيح؟'),

	// C08 Conseils
	C08('9x16', 'v1'),

	// C09 Barbe
	C09('9x16', 'v1'),

	// C10 Guide complet
	C10('9x16', 'v1'),
	C10('4x5', 'v1'),
];

/**
 * Versions avec voix off de TEST (synthèse ar-TN) — rendues dans out/voix_off_a_valider/.
 * À écouter avant toute diffusion. Pour utiliser ta propre voix : remplace le fichier
 * public/voice/<nom>.mp3 par ton enregistrement (même nom) et relance le rendu.
 */
export const VO_TESTS: AdSpec[] = [
	{...C04('9x16', 'long', H.offerPrice, '49 دينار برك (version 10 s, voix off)', true), variant: 'voixTEST', voiceover: 'voice/C04_long.mp3'},
	{...C02('9x16', 'h1', H.unboxWhat, 'شنوّة فيه الباك هذا؟ (voix off)'), variant: 'voixTEST', voiceover: 'voice/C02_h1.mp3'},
	{...C03('9x16', 'h1', H.heritageSecret, 'السدر… سرّ الحمّام متاع جدودنا (voix off)'), variant: 'voixTEST', voiceover: 'voice/C03_h1.mp3'},
];
