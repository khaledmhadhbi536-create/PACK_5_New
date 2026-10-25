import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {F} from './brand';

// Polices locales (public/fonts) : aucun accès réseau nécessaire au rendu.
export const fontsReady = Promise.all([
	loadFont({family: F.display, url: staticFile('fonts/Lalezar.ttf'), weight: '400'}),
	...['400', '600', '700', '800', '900'].map((weight) =>
		loadFont({family: F.body, url: staticFile('fonts/Cairo.ttf'), weight}),
	),
	loadFont({family: F.ruqaa, url: staticFile('fonts/ArefRuqaa-Bold.ttf'), weight: '700'}),
	...['400', '700'].map((weight) =>
		loadFont({family: F.kufi, url: staticFile('fonts/ReemKufi.ttf'), weight}),
	),
	...['500', '700', '800'].map((weight) =>
		loadFont({family: F.latin, url: staticFile('fonts/Montserrat.ttf'), weight}),
	),
]);
