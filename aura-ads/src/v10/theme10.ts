// theme10.ts : source unique de la V10 (skill remotion-motion-graphics).
// Aucune couleur, courbe ou ressort en dur dans les composants : tout vient d'ici.
import {Easing} from 'remotion';
import {F} from '../theme/brand';

export const theme = {
	colors: {
		bg: '#0E2416', // vert Aura Bio (base sombre)
		bgAlt: '#163521',
		primary: '#FFD43B', // LA couleur héros (jaune) : un seul élément par image
		paper: '#F6F0E2', // crème (sol clair et texte clair)
		ink: '#111111',
		accent: '#7BC67E', // vert feuille (sidr / romarin)
		hot: '#F07A2A',
		danger: '#D7263D', // trait du prix barré
		glow: 'rgba(255, 212, 59, 0.45)',
	},
	fonts: {display: F.display, body: F.body, latin: F.latin},
	// Les courbes : jamais de linéaire.
	ease: {
		out: Easing.bezier(0.16, 1, 0.3, 1), // entrées (easeOutExpo)
		inOut: Easing.bezier(0.83, 0, 0.17, 1), // déplacements, Ken Burns
		in: Easing.bezier(0.7, 0, 0.84, 0), // sorties seulement
	},
	spring: {
		snappy: {damping: 14, stiffness: 160, mass: 0.6}, // mots, pastilles
		smooth: {damping: 20, stiffness: 90, mass: 1}, // gros éléments
		bouncy: {damping: 11, stiffness: 170, mass: 0.7}, // produits, logo
	},
	// Rythme : 150 BPM à 30 i/s = 12 images par temps.
	beat: 12,
	sfxLead: 2, // les effets sonores partent 2 images avant l'image
} as const;
