import React from 'react';

type P = {size?: number; color?: string; style?: React.CSSProperties};

const Svg: React.FC<P & {children: React.ReactNode; vb?: string}> = ({size = 48, style, children, vb = '0 0 24 24'}) => (
	<svg width={size} height={size} viewBox={vb} style={{display: 'block', flexShrink: 0, ...style}}>
		{children}
	</svg>
);

export const IconPhone: React.FC<P> = ({color = '#fff', ...p}) => (
	<Svg {...p}>
		<path
			fill={color}
			d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"
		/>
	</Svg>
);

export const IconTruck: React.FC<P> = ({color = '#fff', ...p}) => (
	<Svg {...p}>
		<path
			fill={color}
			d="M3 5h11v9h1.2a3 3 0 0 1 5.6 0H22v-3.5L19.5 7H16V5.8A.8.8 0 0 0 15.2 5H3zm0 10v-1h9.2a3 3 0 0 0-5.4 1H3zm4.5 3.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10.5 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM16 8.5h2.8l1.7 2.5H16z"
		/>
	</Svg>
);

export const IconCash: React.FC<P> = ({color = '#fff', ...p}) => (
	<Svg {...p}>
		<path
			fill={color}
			d="M2 6h20v12H2zm2 2v8h16V8zm8 1.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM5 9.5h2v1.5H5zm12 3.5h2v1.5h-2z"
			fillRule="evenodd"
		/>
	</Svg>
);

export const IconCheck: React.FC<P> = ({color = '#fff', ...p}) => (
	<Svg {...p}>
		<path fill={color} d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L21 7.5l-1.4-1.4z" />
	</Svg>
);

export const IconLeaf: React.FC<P> = ({color = '#fff', ...p}) => (
	<Svg {...p}>
		<path
			fill={color}
			d="M20 3c-7 0-13 3.5-13 11 0 1.4.3 2.6.8 3.6L4 21.3 5.4 22.7l3.5-3.6c1 .6 2.3.9 3.6.9C19 20 21 13 20 3zm-8.3 14.9c-.7 0-1.3-.1-1.8-.3l5.3-5.3-1.4-1.4-5.4 5.3a6 6 0 0 1-.4-2.2C8 8.6 12.3 5.6 18 5.1c.4 7.3-1.6 12.8-6.3 12.8z"
		/>
	</Svg>
);

export const IconGift: React.FC<P> = ({color = '#fff', ...p}) => (
	<Svg {...p}>
		<path
			fill={color}
			d="M20 7h-2.2A3 3 0 0 0 12 4.4 3 3 0 0 0 6.2 7H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-5-1a1 1 0 1 1 0 2h-2V7a1 1 0 0 1 2-1zM8 7a1 1 0 0 1 3 0v1H9a1 1 0 0 1-1-1zM5 9h6v1H5zm1 3h5v7H6zm7 7v-7h5v7zm0-9V9h6v1z"
		/>
	</Svg>
);

export const IconInsta: React.FC<P> = ({color = '#fff', ...p}) => (
	<Svg {...p}>
		<path
			fill={color}
			d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21.9 8c-.1-1.6-.4-3-1.6-4.2S17.6 2.2 16 2.1C14.4 2 9.6 2 8 2.1c-1.6.1-3 .4-4.2 1.6S2.2 6.4 2.1 8C2 9.6 2 14.4 2.1 16c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.4 0-8zm-2 9.8a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4a3.3 3.3 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7a3.3 3.3 0 0 1 1.8-1.8c1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7z"
		/>
	</Svg>
);

export const IconClock: React.FC<P> = ({color = '#fff', ...p}) => (
	<Svg {...p}>
		<path
			fill={color}
			d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7z"
		/>
	</Svg>
);

export const IconShield: React.FC<P> = ({color = '#fff', ...p}) => (
	<Svg {...p}>
		<path fill={color} d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4z" />
	</Svg>
);
