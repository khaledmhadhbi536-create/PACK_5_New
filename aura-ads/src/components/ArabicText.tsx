import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {F} from '../theme/brand';

/**
 * Texte arabe (derja) RTL, animé mot par mot — jamais lettre par lettre,
 * pour garder les lettres liées.
 *
 * Syntaxe du texte :
 *   *mots*  → surlignés (couleur `accent`)
 *   \n      → retour à la ligne
 * Les suites de mots latins / chiffres (« Aura Bio », « 49 DT ») sont
 * regroupées en un seul bloc LTR, sinon le RTL les inverserait.
 */

type Token = {text: string; hl: boolean; ltr: boolean; br?: boolean};

const PUNCT = /^[،؛؟!.,:…]+$/;
const LTR_WORD = /^[A-Za-z0-9.,:;%+\-–'’()@!?&/]+$/;

export const tokenize = (text: string): Token[] => {
	const out: Token[] = [];
	// « … » est absent de Lalezar (affiché comme un point) : on écrit trois points
	const lines = text.replace(/…/g, '...').split('\n');
	lines.forEach((line, li) => {
		const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
		for (const part of parts) {
			const hl = part.startsWith('*') && part.endsWith('*');
			const words = (hl ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean);
			for (const w of words) {
				const prev = out[out.length - 1];
				// la ponctuation seule se colle au mot précédent (pas d'espace parasite)
				if (PUNCT.test(w) && prev && !prev.br) {
					prev.text += w;
					continue;
				}
				const ltr = LTR_WORD.test(w);
				if (ltr && prev && prev.ltr && !prev.br && prev.hl === hl) {
					prev.text += ' ' + w;
				} else {
					out.push({text: w, hl, ltr});
				}
			}
		}
		if (li < lines.length - 1) out.push({text: '', hl: false, ltr: false, br: true});
	});
	return out;
};

export const plainText = (text: string) => text.replace(/\*/g, '').replace(/\n/g, ' ');

export type ArabicTextProps = {
	text: string;
	size: number;
	color: string;
	accent?: string;
	font?: string;
	weight?: number;
	lineHeight?: number;
	/** frame de départ de l'animation (relative à la séquence) */
	delay?: number;
	/** frames entre deux mots */
	stagger?: number;
	anim?: 'rise' | 'pop' | 'fade' | 'none';
	align?: 'center' | 'right' | 'left';
	maxWidth?: number | string;
	shadow?: string;
	/** surlignage en « marqueur » derrière les mots *accent* */
	marker?: string;
	style?: React.CSSProperties;
};

export const ArabicText: React.FC<ArabicTextProps> = ({
	text,
	size,
	color,
	accent,
	font = F.body,
	weight = 800,
	lineHeight = 1.32,
	delay = 0,
	stagger = 3,
	anim = 'rise',
	align = 'center',
	maxWidth = '100%',
	shadow,
	marker,
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const tokens = tokenize(text);
	let wi = 0;
	return (
		<div
			dir="rtl"
			lang="ar"
			style={{
				fontFamily: font,
				fontWeight: weight,
				fontSize: size,
				lineHeight,
				color,
				textAlign: align,
				maxWidth,
				textShadow: shadow,
				...style,
			}}
		>
			{tokens.map((t, i) => {
				if (t.br) return <br key={i} />;
				const start = delay + wi++ * stagger;
				const p =
					anim === 'none'
						? 1
						: interpolate(frame, [start, start + Math.round(0.45 * fps)], [0, 1], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
								easing: Easing.bezier(0.16, 1, 0.3, 1),
							});
				const wordStyle: React.CSSProperties = {
					display: 'inline-block',
					whiteSpace: 'pre',
					opacity: anim === 'none' ? 1 : Math.min(1, p * 1.6),
					translate: anim === 'rise' ? `0 ${(1 - p) * size * 0.45}px` : undefined,
					scale: anim === 'pop' ? String(0.6 + 0.4 * p) : undefined,
					color: t.hl && accent ? accent : color,
					fontFamily: t.ltr ? `${F.latin}, ${font}` : undefined,
					fontWeight: t.ltr ? 800 : undefined,
					padding: marker && t.hl ? `0 ${size * 0.14}px` : undefined,
					margin: `0 ${size * 0.12}px`,
					borderRadius: marker && t.hl ? size * 0.16 : undefined,
					background: marker && t.hl ? marker : undefined,
				};
				return (
					<span key={i} dir={t.ltr ? 'ltr' : undefined} style={wordStyle}>
						{t.text}
					</span>
				);
			})}
		</div>
	);
};
