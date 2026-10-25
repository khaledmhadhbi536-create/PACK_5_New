import React from 'react';
import {AbsoluteFill} from 'remotion';
import {OFFER2 as O} from '../v2/offer';
import {N, RED, Rays, Stars, T, THEMES} from '../v2/WinStill';
import {Card, Pack, TITLE} from '../v3/V3Still';
import {Abs, Below, CtaAnim, Flash, FooterPill, In, Music, Sfx, Shake, Spin, Stage, StrikeAnim, useStage} from './kit';

/** V01 · « عرض استثنائي! » — ad1 animée (9 s). */
export const V01_DUR = 270;

export const V01: React.FC = () => {
	const {y, vertical} = useStage();
	const th = THEMES.or;
	const cw = vertical ? 300 : 312;
	const ch = vertical ? 272 : 318;
	const OUT = 112; // sortie des cartes
	return (
		<AbsoluteFill style={{background: th.bg, overflow: 'hidden'}}>
			<Spin speed={0.12}>
				<Rays color={th.ray} opacity={0.18} cy="45%" />
			</Spin>
			<Stars color={th.star} opacity={0.12} />
			<Shake hits={[4, 120]}>
				{/* bas de l'écran 9:16 : le pack, visible dès la 1re image */}
				<Below>
					<In at={0} kind="up" dist={200}>
						<div style={{display: 'flex', justifyContent: 'center', paddingTop: 30}}>
							<Pack W={980} H={600} />
						</div>
					</In>
				</Below>
				<Stage>
					<Abs top={y(6)} z={3}>
						<In at={2} kind="drop">
							<T size={vertical ? 92 : 96} style={{background: RED, padding: '4px 56px 16px', borderRadius: 30, transform: 'rotate(-2deg)', boxShadow: '0 12px 0 rgba(0,0,0,0.22)'}}>
								عرض استثنائي!
							</T>
						</In>
					</Abs>
					<Abs top={y(150)}>
						<In at={16} kind="up">
							<T size={70} style={{textShadow: '0 4px 14px rgba(0,0,0,0.35)', whiteSpace: 'nowrap'}}>{TITLE}</T>
						</In>
					</Abs>
					<Abs top={y(240)}>
						<In at={26} kind="fade">
							<T size={44} color="#FFE7A8">
								أقل من <N>10</N> د.ت للقطعة
							</T>
						</In>
					</Abs>
					{/* 4:5 / 1:1 : le pack d'abord (produit visible dès la 1re image) */}
					{vertical ? null : (
						<Abs top={y(300)}>
							<In at={0} kind="zoom" out={32} outKind="shrink">
								<Pack W={820} H={540} />
							</In>
						</Abs>
					)}
					{/* scène A : les 5 cartes */}
					<Abs top={y(325)}>
						<div dir="rtl" style={{display: 'flex', gap: 22}}>
							{[0, 1, 2].map((i) => (
								<In key={i} at={36 + i * 9} kind="pop" out={OUT + i * 2} outKind="up">
									<Card i={i} w={cw} h={ch} nameSize={vertical ? 32 : 36} />
								</In>
							))}
						</div>
					</Abs>
					<Abs top={y(325) + ch + 30}>
						<div dir="rtl" style={{display: 'flex', gap: 22}}>
							{[3, 4].map((i) => (
								<In key={i} at={36 + i * 9} kind="pop" out={OUT + i * 2} outKind="up">
									<Card i={i} w={cw} h={ch} nameSize={vertical ? 32 : 36} />
								</In>
							))}
						</div>
					</Abs>
					{/* scène B : le prix */}
					<Abs top={y(330)}>
						<In at={120} kind="up">
							<T size={64}>
								<N>5</N> قطع بـ
							</T>
						</In>
					</Abs>
					<Abs top={y(420)} z={4}>
						<In at={124} kind="zoom">
							<div style={{background: '#FFF3C4', borderRadius: 34, padding: '0 50px', boxShadow: '0 16px 0 rgba(0,0,0,0.22)'}}>
								<T size={170} color="#111" style={{lineHeight: 1.25}}>
									<N style={{fontSize: 180}}>{O.price}</N> د.ت
								</T>
							</div>
						</In>
					</Abs>
					<Abs top={y(660)}>
						<In at={140} kind="fade">
							<StrikeAnim at={150} size={56} />
						</In>
					</Abs>
					<Abs top={y(760)}>
						<CtaAnim at={176} size={60} />
					</Abs>
					<Abs top={y(889)} left={0} right={0}>
						<FooterPill at={188} />
					</Abs>
				</Stage>
			</Shake>
			<Flash at={4} max={0.55} />
			<Flash at={124} max={0.4} color="#FFF3C4" />
			{/* son */}
			<Music src="audio/v4/beat_promo.wav" vol={0.42} />
			<Sfx at={2} s="slam" v={0.9} />
			<Sfx at={15} s="whoosh" v={0.5} />
			{[0, 1, 2, 3, 4].map((i) => (
				<Sfx key={i} at={36 + i * 9} s={`pop${i + 1}` as 'pop1'} v={0.75} />
			))}
			<Sfx at={OUT - 2} s="whoosh" v={0.6} />
			<Sfx at={124} s="stamp" v={0.95} />
			<Sfx at={150} s="marker" v={0.8} />
			<Sfx at={162} s="cash" v={0.7} />
			<Sfx at={176} s="pop5" v={0.6} />
		</AbsoluteFill>
	);
};

