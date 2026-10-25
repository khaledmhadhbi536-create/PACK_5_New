/**
 * Données commerciales du Pack Pousse Homme.
 * Modifier ici = toutes les pubs se mettent à jour au prochain rendu.
 */
export const OFFER = {
	brand: 'Aura Bio',
	instagram: '@aurabio.tn',
	productNameFr: 'Pack Pousse Homme',
	productNameAr: 'باك الشعر واللحية',
	price: 49,
	currencyAr: 'دينار',
	currencyShort: 'DT',
	/** Toujours écrit sans espace. */
	phone: '50500051',
	/** Frais de livraison en DT. null = non affiché (à compléter). */
	deliveryFee: null as number | null,
	/** Lien de la page produit. null = non affiché (à compléter). */
	productUrl: null as string | null,
} as const;

export type ProductKey = 'sidr' | 'huile' | 'derma' | 'flacon' | 'brosse';

export type Product = {
	key: ProductKey;
	n: number;
	nameAr: string;
	nameFr: string;
	/** Bénéfice court (une ligne) en derja. */
	benefit: string;
	/** Image détourée dans public/. null = flacon dessiné (OilBottle). */
	image: string | null;
	/** Rush vidéo qui montre le produit. */
	rush?: string;
};

export const PRODUCTS: Record<ProductKey, Product> = {
	sidr: {
		key: 'sidr',
		n: 1,
		nameAr: 'السدر الطبيعي',
		nameFr: 'Sidr naturel',
		benefit: 'ينظّف بالشوية ويقوّي الشعر',
		image: 'products/sidr.png',
		rush: 'rushs/sidr_chantilly.mp4',
	},
	huile: {
		key: 'huile',
		n: 2,
		nameAr: 'زيت الروماران',
		nameFr: 'Huile de romarin',
		benefit: 'ينشّط جلدة الراس ويعاون على الكثافة',
		// Remplacer par 'products/huile.png' dès qu'une vraie photo existe.
		image: null,
	},
	derma: {
		key: 'derma',
		n: 3,
		nameAr: 'الديرما رولر 540',
		nameFr: 'Derma roller 540',
		benefit: 'ينشّط جلدة الراس والزيت يدخل خير',
		image: 'products/derma.png',
		rush: 'rushs/derma_in_hand.mp4',
	},
	flacon: {
		key: 'flacon',
		n: 4,
		nameAr: 'فلاكون التطبيق',
		nameFr: 'Flacon applicateur',
		benefit: 'الزيت طول على العروق، بلاش تبذير',
		image: 'products/applicateur.png',
	},
	brosse: {
		key: 'brosse',
		n: 5,
		nameAr: 'بروس الماساج',
		nameFr: 'Brosse de massage',
		benefit: 'ماساج يرتّح ويفرّق الزيت، وتمشي مع السدر',
		image: 'products/brosse.png',
		rush: 'rushs/brush_spikes.mp4',
	},
};

export const PRODUCT_ORDER: ProductKey[] = ['sidr', 'huile', 'derma', 'flacon', 'brosse'];
