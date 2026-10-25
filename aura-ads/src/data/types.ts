import type {FormatKey, StyleKey} from '../theme/brand';
import type {ProductKey} from './product';

/** Ce qu'on voit derrière un texte d'accroche. */
export type Visual =
	| {type: 'pack'}
	| {type: 'product'; product: ProductKey}
	| {type: 'rush'; src: string; trim?: number; rate?: number; mode?: 'cover' | 'card'; focusY?: number}
	| {type: 'photo'; src: string; focusY?: number};

/**
 * Une scène = un bloc de la pub. `dur` en secondes.
 * Textes : *mot* = surligné, \n = retour à la ligne.
 */
export type Scene =
	| {kind: 'hook'; dur: number; text: string; sub?: string; visual: Visual; sticker?: string}
	| {
			kind: 'rush';
			dur: number;
			src: string;
			trim?: number;
			rate?: number;
			mode?: 'cover' | 'card';
			focusY?: number;
			/** sous-titre principal (pastille) */
			caption?: string;
			/** petit titre au-dessus */
			title?: string;
			step?: number;
			/** produit détouré en incrustation (renforce la marque sur un rush internet) */
			inset?: ProductKey;
	  }
	| {kind: 'product'; dur: number; product: ProductKey; withRush?: boolean; total?: number}
	| {kind: 'pack'; dur: number; title?: string; sub?: string}
	| {kind: 'grid'; dur: number; title?: string}
	| {kind: 'steps'; dur: number; title?: string}
	| {kind: 'offer'; dur: number; title?: string; sub?: string}
	| {kind: 'cta'; dur: number; title?: string}
	| {kind: 'text'; dur: number; text: string; sub?: string; size?: number; visual?: Visual}
	| {kind: 'photo'; dur: number; src: string; text?: string; sub?: string; focusY?: number}
	| {kind: 'tip'; dur: number; n: number; text: string; sub?: string; visual: Visual}
	| {kind: 'heritage'; dur: number; text: string; sub?: string; visual?: Visual};

export type MusicKey = 'rituel' | 'darbuka' | 'punch' | 'heritage';

export type AdSpec = {
	/** numéro de concept, ex. « C01 » */
	concept: string;
	/** nom court du concept, ex. « rituel » */
	slug: string;
	/** variante, ex. « h1 », « h2 » (hooks) ou « v1 » */
	variant: string;
	format: FormatKey;
	style: StyleKey;
	music: MusicKey;
	/** seconde de départ dans la musique */
	musicStart?: number;
	transition?: 'fade' | 'slide' | 'wipe' | 'none';
	scenes: Scene[];
	/** voix off optionnelle (fichier dans public/), la musique baisse automatiquement */
	voiceover?: string;
	/** Infos pour le catalogue / Ads Manager */
	meta: {
		approach: string;
		hook: string;
		primaryText: string;
		headline: string;
	};
};

export type StillLayout =
	| 'packOffer'
	| 'grid5'
	| 'steps'
	| 'heritage'
	| 'gift'
	| 'trust'
	| 'macro'
	| 'derma'
	| 'carousel'
	| 'beard'
	| 'ritualPhoto';

export type StillSpec = {
	concept: string;
	slug: string;
	variant: string;
	format: FormatKey;
	style: StyleKey;
	layout: StillLayout;
	title?: string;
	sub?: string;
	/** pour le carrousel : index de la carte */
	card?: number;
	meta: {approach: string; hook: string; primaryText: string; headline: string};
};
