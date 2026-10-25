import {COPY} from './copy';
import {OFFER} from './product';
import type {StillSpec} from './types';

/**
 * ================================================================
 *  BIBLIOTHÈQUE DES PUBS IMAGE
 * ================================================================
 * Une ligne = une image : mise en page (`layout`) + style + format + texte.
 */

const PT_BASE = `✅ 5 منتوجات: سدر طبيعي، زيت الروماران، ديرما رولر 540، فلاكون، بروس ماساج
💰 الباك الكامل: ${OFFER.price} دينار
💵 تخلّص كي يوصلك | 🚚 توصيل لكامل تونس
📞 ${OFFER.phone}`;

const m = (approach: string, hook: string, intro: string, headline: string) => ({
	approach,
	hook,
	primaryText: `${intro}\n\n${PT_BASE}`,
	headline,
});

const H = COPY.hooks;
const PRICE_HL = `الباك الكامل بـ ${OFFER.price} DT`;
const FMTS3 = ['9x16', '4x5', '1x1'] as const;

export const STILLS: StillSpec[] = [
	// I01 — Pack + offre (nature premium et souk)
	...FMTS3.flatMap((format): StillSpec[] => [
		{
			concept: 'I01', slug: 'pack', variant: 'nat', format, style: 'nat', layout: 'packOffer', title: H.unboxFull,
			meta: m('Pack + offre', 'باك كامل للشعر واللحية', '🌿 روتين كامل للشعر واللحية في باك واحد.', PRICE_HL),
		},
		{
			concept: 'I01', slug: 'pack', variant: 'souk', format, style: 'souk', layout: 'packOffer', title: H.offerPrice,
			meta: m('Pack + offre (prix en accroche)', '49 دينار برك', '🔥 الباك الكامل للشعر واللحية بـ 49 دينار برك!', `${OFFER.price} DT برك`),
		},
	]),

	// I02 — Grille des 5 produits
	{
		concept: 'I02', slug: 'grille', variant: 'v1', format: '4x5', style: 'stu', layout: 'grid5', title: H.unboxWhat,
		meta: m('Contenu du pack', 'شنوّة فيه الباك هذا؟', '📦 شنوّة فيه الباك؟ 5 حوايج للشعر واللحية.', `5 منتوجات | ${OFFER.price} DT`),
	},
	{
		concept: 'I02', slug: 'grille', variant: 'v1', format: '1x1', style: 'stu', layout: 'grid5', title: COPY.pack5,
		meta: m('Contenu du pack', '5 منتوجات في باك واحد', '📦 5 منتوجات في باك واحد.', `5 منتوجات | ${OFFER.price} DT`),
	},
	{
		concept: 'I02', slug: 'grille', variant: 'v1', format: '9x16', style: 'stu', layout: 'grid5', title: H.unboxWhat,
		meta: m('Contenu du pack (story)', 'شنوّة فيه الباك هذا؟', '📦 شنوّة فيه الباك؟', `5 منتوجات | ${OFFER.price} DT`),
	},

	// I03 — Infographie rituel
	{
		concept: 'I03', slug: 'rituel', variant: 'v1', format: '4x5', style: 'nat', layout: 'steps',
		meta: m('Tutoriel en image', 'روتين الشعر واللحية في 4 خطوات', '🕒 روتين بسيط: 2 ولا 3 مرات في الجمعة. النتيجة تحب صبر وانتظام.', 'روتين في 4 خطوات'),
	},
	{
		concept: 'I03', slug: 'rituel', variant: 'v1', format: '9x16', style: 'nat', layout: 'steps',
		meta: m('Tutoriel en image (story)', 'روتين الشعر واللحية في 4 خطوات', '🕒 روتين بسيط: 2 ولا 3 مرات في الجمعة.', 'روتين في 4 خطوات'),
	},
	{
		concept: 'I03', slug: 'rituel', variant: 'clair', format: '4x5', style: 'stu', layout: 'steps',
		meta: m('Tutoriel en image (version claire)', 'روتين الشعر واللحية في 4 خطوات', '🕒 روتين بسيط: 2 ولا 3 مرات في الجمعة.', 'روتين في 4 خطوات'),
	},

	// I04 — Héritage
	...(['4x5', '1x1', '9x16'] as const).map(
		(format): StillSpec => ({
			concept: 'I04', slug: 'heritage', variant: 'v1', format, style: 'her', layout: 'heritage', title: H.heritageSecret,
			sub: 'وزدنالو *زيت الروماران*',
			meta: m('Héritage tunisien', 'السدر… سرّ الحمّام متاع جدودنا', '🇹🇳 السدر… من الحمّام متاع جدودنا لروتينك اليوم.', `السدر + الروماران | ${OFFER.price} DT`),
		}),
	),
	{
		concept: 'I04', slug: 'heritage', variant: 'h2', format: '4x5', style: 'her', layout: 'heritage', title: H.heritageBefore,
		meta: m('Héritage tunisien', 'قبل الشامبوان… كان فمّا السدر', '🇹🇳 قبل الشامبوان… كان فمّا السدر.', `السدر + الروماران | ${OFFER.price} DT`),
	},

	// I05 — Cadeau
	{
		concept: 'I05', slug: 'cadeau', variant: 'v1', format: '4x5', style: 'stu', layout: 'gift', title: H.giftWho,
		meta: m('Cadeau', 'هدية لخوك، لبوك ولا لراجلك', '🎁 هدية تفرّح بيها راجل عزيز عليك.', `هدية للراجل | ${OFFER.price} DT`),
	},
	{
		concept: 'I05', slug: 'cadeau', variant: 'v1', format: '1x1', style: 'stu', layout: 'gift', title: H.giftIdea,
		meta: m('Cadeau', 'فكرة هدية للراجل؟', '🎁 فكرة هدية للراجل؟', `هدية للراجل | ${OFFER.price} DT`),
	},
	{
		concept: 'I05', slug: 'cadeau', variant: 'v1', format: '9x16', style: 'souk', layout: 'gift', title: H.giftIdea,
		meta: m('Cadeau (story)', 'فكرة هدية للراجل؟', '🎁 فكرة هدية للراجل؟', `هدية للراجل | ${OFFER.price} DT`),
	},

	// I06 — Réassurance
	{
		concept: 'I06', slug: 'confiance', variant: 'v1', format: '1x1', style: 'souk', layout: 'trust',
		meta: m('Réassurance (paiement à la livraison)', 'كوموندي وانت مرتاح', '💵 ما تخلّص شي قبل: تخلّص كي يوصلك.', 'الخلاص عند الاستلام'),
	},
	{
		concept: 'I06', slug: 'confiance', variant: 'v1', format: '4x5', style: 'souk', layout: 'trust',
		meta: m('Réassurance (paiement à la livraison)', 'كوموندي وانت مرتاح', '💵 ما تخلّص شي قبل: تخلّص كي يوصلك.', 'الخلاص عند الاستلام'),
	},

	// I07 — Carrousel 1:1 (7 cartes)
	...[0, 1, 2, 3, 4, 5, 6].map(
		(card): StillSpec => ({
			concept: 'I07', slug: 'carrousel', variant: `carte${card + 1}`, format: '1x1', style: 'stu', layout: 'carousel', card,
			meta: m('Carrousel : couverture, 5 produits, offre', 'شنوّة فيه الباك؟ (carrousel)', '👉 اسحب وشوف الـ 5 منتوجات.', `5 منتوجات | ${OFFER.price} DT`),
		}),
	),

	// I08 — Macro goutte de romarin
	{
		concept: 'I08', slug: 'goutte', variant: 'v1', format: '4x5', style: 'nat', layout: 'macro', sub: 'ينشّط جلدة الراس… *في روتين كامل*',
		meta: m('Nature premium (macro)', 'زيت الروماران', '🌿 زيت الروماران في روتين كامل للشعر واللحية.', 'زيت الروماران + 4 منتوجات'),
	},
	{
		concept: 'I08', slug: 'goutte', variant: 'v1', format: '9x16', style: 'nat', layout: 'macro', sub: 'ينشّط جلدة الراس… *في روتين كامل*',
		meta: m('Nature premium (macro, story)', 'زيت الروماران', '🌿 زيت الروماران في روتين كامل.', 'زيت الروماران + 4 منتوجات'),
	},

	// I09 — Derma 540
	{
		concept: 'I09', slug: 'derma540', variant: 'v1', format: '4x5', style: 'nat', layout: 'derma',
		meta: m('Curiosité derma roller', '540 إبرة صغيرة', '🧐 الديرما رولر: 540 إبرة صغيرة تنشّط جلدة الراس.', `ديرما رولر + روماران | ${OFFER.price} DT`),
	},
	{
		concept: 'I09', slug: 'derma540', variant: 'v1', format: '1x1', style: 'nat', layout: 'derma',
		meta: m('Curiosité derma roller', '540 إبرة صغيرة', '🧐 الديرما رولر: 540 إبرة صغيرة تنشّط جلدة الراس.', `ديرما رولر + روماران | ${OFFER.price} DT`),
	},

	// I10 — Barbe
	{
		concept: 'I10', slug: 'barbe', variant: 'v1', format: '4x5', style: 'souk', layout: 'beard',
		meta: m('Barbe aussi', 'مش كان للشعر… للّحية زادة', '🧔 الباك مش كان للشعر… للّحية زادة.', `للشعر واللحية | ${OFFER.price} DT`),
	},
	{
		concept: 'I10', slug: 'barbe', variant: 'v1', format: '1x1', style: 'souk', layout: 'beard',
		meta: m('Barbe aussi', 'مش كان للشعر… للّحية زادة', '🧔 الباك مش كان للشعر… للّحية زادة.', `للشعر واللحية | ${OFFER.price} DT`),
	},

	// I11 — Photo du geste
	{
		concept: 'I11', slug: 'geste', variant: 'v1', format: '4x5', style: 'nat', layout: 'ritualPhoto', sub: 'زيت الروماران *طول على العروق*',
		meta: m('Lifestyle : le geste du rituel', 'روتين الشعر واللحية في الدار', '🌿 روتين الشعر واللحية في الدار.', PRICE_HL),
	},
	{
		concept: 'I11', slug: 'geste', variant: 'v1', format: '9x16', style: 'nat', layout: 'ritualPhoto', sub: 'زيت الروماران *طول على العروق*',
		meta: m('Lifestyle (story)', 'روتين الشعر واللحية في الدار', '🌿 روتين الشعر واللحية في الدار.', PRICE_HL),
	},
];
