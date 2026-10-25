import {OFFER} from './product';

/**
 * Banque de phrases en derja tunisienne (écriture arabe).
 * Syntaxe : *mot* = mot surligné (couleur d'accent), \n = retour à la ligne.
 *
 * Règles Meta respectées : on ne dit jamais au spectateur qu'il a un problème,
 * aucune promesse ni délai garanti, pas d'avant/après.
 */
export const COPY = {
	price: `*${OFFER.price} ${OFFER.currencyAr}* برك`,
	priceShort: `${OFFER.price}`,
	cod: 'تخلّص كي يوصلك',
	delivery: 'توصيل لكامل ولايات تونس',
	order: 'كوموندي توّا',
	orderDm: 'ولا ابعثلنا ميساج',
	pack5: '5 منتوجات في باك واحد',
	packFull: 'الباك الكامل للشعر واللحية',
	frequency: '2 ولا 3 مرات في الجمعة',
	consistency: 'النتيجة تحب *صبر وانتظام*',
	natural: 'منتوجات طبيعية',
	safetyDerma: 'عقّم الديرما رولر قبل وبعد كل استعمال',

	steps: [
		{n: 1, title: 'الديرما رولر', text: 'بالشوية، على راس *نظيف وناشف*'},
		{n: 2, title: 'زيت الروماران', text: 'بالفلاكون، طول *على العروق*'},
		{n: 3, title: 'ماساج', text: '*3 لـ 5 دقايق* بالبروس'},
		{n: 4, title: 'خلّيه يخدم', text: 'سوايع ولا *الليل الكل*'},
	],
	wash: {title: 'وقت الغسيل', text: '*سدر + ماء دافي*، ماساج، وشلّل'},

	hooks: {
		ritual: 'روتين الشعر واللحية\nفي *4 خطوات*',
		ritualHow: 'كيفاش تستعمل الديرما رولر\nمع *الروماران*؟',
		ritualTime: '*10 دقايق*\n2 ولا 3 مرات في الجمعة',
		unboxWhat: 'شنوّة فيه\n*الباك هذا*؟',
		unbox5: '*5 حوايج*\nفي باك واحد',
		unboxFull: 'باك كامل\nللشعر *واللحية*',
		heritageSecret: 'السدر…\nسرّ الحمّام متاع *جدودنا*',
		heritageBefore: 'قبل الشامبوان…\nكان فمّا *السدر*',
		offerPrice: `*${OFFER.price} ${OFFER.currencyAr}*\nبرك`,
		offerCod: 'تخلّص\n*كي يوصلك*',
		offerDelivery: 'توصيل\nلكامل *تونس*',
		giftIdea: 'فكرة *هدية*\nللراجل؟',
		giftWho: 'هدية لخوك،\nلبوك ولا *لراجلك*',
		asmr: 'ASMR\n*سدر شانتيي*',
		derma540: '*540* إبرة صغيرة…\nعلاش؟',
		dermaTrend: 'الروماران ولّى ترند…\nأما *كيفاش* تستعملو صحيح؟',
		tips3: '*3 حاجات* لازم تعرفهم\nعلى الديرما رولر',
		beard: 'مش كان للشعر…\n*للّحية زادة*',
		guide: 'كل شي على الباك\nفي *دقيقة*',
	},
} as const;
