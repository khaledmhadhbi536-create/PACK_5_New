import {Easing} from 'remotion';

/** Al Mozon Academy : couleurs prises sur le logo (orange #F5732A) et sur les vidéos du centre (villa blanche). */
export const M = {
	orange: '#F5732A',
	orangeDeep: '#D9561A',
	ink: '#17130F',
	cream: '#FFF6EE',
	white: '#FFFFFF',
	sea: '#CFE0EA',
	land: '#F6EDE3',
	landEdge: '#E4D3C2',
	glow: 'rgba(245,115,42,0.55)',
	ease: {
		out: Easing.bezier(0.16, 1, 0.3, 1),
		inOut: Easing.bezier(0.65, 0, 0.35, 1),
		in: Easing.bezier(0.7, 0, 0.84, 0),
	},
	spring: {
		snappy: {damping: 14, stiffness: 220, mass: 0.7},
		bouncy: {damping: 10, stiffness: 200, mass: 0.6},
		soft: {damping: 20, stiffness: 120, mass: 1},
	},
	sfxLead: 2,
};
