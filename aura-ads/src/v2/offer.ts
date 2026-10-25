/**
 * V2 : données des nouvelles créas, inspirées des pubs gagnantes (ad1 / ad2).
 * Vrais produits = photos tirées des vidéos « pack 5 » et « pack 5 V2 ».
 */
export const OFFER2 = {
	price: 49,
	oldPrice: 110,
	perPiece: '9.8',
	phone: '50 500 051',
	brand: 'AURA BIO',
	cod: 'الخلاص عند الاستلام',
	cta: 'اطلب توّا',
	title: 'باك نموّ الشعر للرجال',
};

export type RealKey = 'sidr' | 'huile' | 'derma' | 'applicateur' | 'brosse';

/** Ordre et noms repris des pubs gagnantes ; « إكليل الجبل » à la place de « روماران ». */
export const REAL: {key: RealKey; name: string; photo: string; pos: string; zoom?: number}[] = [
	{key: 'sidr', name: 'سدر بيو', photo: 'photos/real/sidr.jpg', pos: '22% 60%'},
	{key: 'derma', name: 'ديرما رولر 540', photo: 'photos/real/derma.jpg', pos: '40% 50%'},
	{key: 'huile', name: 'زيت إكليل الجبل', photo: 'photos/real/huile.jpg', pos: '35% 50%'},
	{key: 'applicateur', name: 'مشط الجذور', photo: 'photos/real/applicateur.jpg', pos: '40% 45%'},
	{key: 'brosse', name: 'فرشة التدليك', photo: 'photos/real/brosse.jpg', pos: '45% 45%'},
];
