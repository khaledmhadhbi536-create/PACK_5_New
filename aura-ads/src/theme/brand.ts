import {useVideoConfig} from 'remotion';

/** Charte Aura Bio — tirée du logo (vert forêt + halo doré) et enrichie d'accents tunisiens. */
export const C = {
	forest: '#1F2E25',
	forestDeep: '#121C16',
	sage: '#6F8B5B',
	leaf: '#9DB36A',
	gold: '#D2B06A',
	goldLight: '#EBD49C',
	cream: '#F5EEDF',
	sand: '#E9D9BB',
	kraft: '#CDB089',
	terracotta: '#B9653A',
	terracottaDark: '#8E4524',
	blue: '#1E5A96',
	ink: '#0E1611',
	white: '#FFFFFF',
} as const;

export const F = {
	display: 'Lalezar',
	body: 'Cairo',
	ruqaa: 'Aref Ruqaa',
	kufi: 'Reem Kufi',
	latin: 'Montserrat',
} as const;

export type FormatKey = '9x16' | '4x5' | '1x1';

/**
 * Zones de sécurité.
 * 9:16 : rien d'important dans les 14 % du haut (269 px) ni les 35 % du bas (672 px).
 */
export const FORMATS: Record<
	FormatKey,
	{width: number; height: number; safe: {top: number; bottom: number; x: number}}
> = {
	'9x16': {width: 1080, height: 1920, safe: {top: 269, bottom: 672, x: 72}},
	'4x5': {width: 1080, height: 1350, safe: {top: 64, bottom: 64, x: 64}},
	'1x1': {width: 1080, height: 1080, safe: {top: 56, bottom: 56, x: 56}},
};

export const FPS = 30;

export const formatOf = (width: number, height: number): FormatKey => {
	const r = height / width;
	if (r > 1.5) return '9x16';
	if (r > 1.1) return '4x5';
	return '1x1';
};

/** Format courant + rectangle utile (zone de sécurité). */
export const useFormat = () => {
	const {width, height} = useVideoConfig();
	const key = formatOf(width, height);
	const {safe} = FORMATS[key];
	return {
		key,
		width,
		height,
		safe,
		safeHeight: height - safe.top - safe.bottom,
		safeWidth: width - safe.x * 2,
		/** facteur d'échelle typographique selon le format */
		k: key === '9x16' ? 1 : key === '4x5' ? 0.88 : 0.8,
		vertical: key === '9x16',
	};
};

export type StyleKey = 'nat' | 'ugc' | 'souk' | 'her' | 'stu';

export type StyleTheme = {
	bg: string;
	bg2: string;
	text: string;
	muted: string;
	accent: string;
	accent2: string;
	titleFont: string;
	titleWeight: number;
	captionMode: 'pill' | 'shadow';
	dark: boolean;
};

export const STYLES: Record<StyleKey, StyleTheme> = {
	nat: {
		bg: C.forestDeep,
		bg2: C.forest,
		text: C.cream,
		muted: '#B9C2B0',
		accent: C.gold,
		accent2: C.leaf,
		titleFont: F.display,
		titleWeight: 400,
		captionMode: 'pill',
		dark: true,
	},
	ugc: {
		bg: C.ink,
		bg2: C.forest,
		text: C.white,
		muted: '#DADADA',
		accent: C.gold,
		accent2: C.leaf,
		titleFont: F.body,
		titleWeight: 900,
		captionMode: 'pill',
		dark: true,
	},
	souk: {
		bg: C.cream,
		bg2: '#F3D9C2',
		text: C.forest,
		muted: '#5B6B5F',
		accent: C.terracotta,
		accent2: C.forest,
		titleFont: F.display,
		titleWeight: 400,
		captionMode: 'pill',
		dark: false,
	},
	her: {
		bg: C.sand,
		bg2: C.cream,
		text: C.forest,
		muted: '#6E5E45',
		accent: C.terracotta,
		accent2: C.blue,
		titleFont: F.ruqaa,
		titleWeight: 700,
		captionMode: 'pill',
		dark: false,
	},
	stu: {
		bg: C.cream,
		bg2: C.sand,
		text: C.forest,
		muted: '#66766A',
		accent: C.sage,
		accent2: C.gold,
		titleFont: F.display,
		titleWeight: 400,
		captionMode: 'pill',
		dark: false,
	},
};
