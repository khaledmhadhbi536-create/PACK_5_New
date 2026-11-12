import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";

const C = theme.colors;

// ---------- 1. fond : mesh rose pastel animé ----------
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  const d3 = Math.sin(frame / 90) * 40;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${C.bgAlt} 0%, ${C.bg} 55%, #FFD3E4 100%)` }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", top: -500, left: -350 + d1,
        filter: "blur(60px)", background: `radial-gradient(circle, ${C.blush}AA, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", bottom: -420, right: -300 - d2,
        filter: "blur(70px)", background: `radial-gradient(circle, ${C.lilac}88, transparent 65%)` }} />
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", top: 700 + d3, left: 300,
        filter: "blur(80px)", background: `radial-gradient(circle, ${C.accent}44, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

// ---------- grade / grain / vignette ----------
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: C.blush, mixBlendMode: "soft-light", opacity: 0.22 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(91,31,62,0.10), transparent 25%, transparent 75%, rgba(91,31,62,0.16))" }} />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
      backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.05, mixBlendMode: "multiply" }} />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none",
    background: "radial-gradient(ellipse at center, transparent 58%, rgba(91,31,62,0.25) 100%)" }} />
);

// ---------- coeur SVG (pas d'emoji) ----------
export const Heart: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = C.primary, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path fill={color} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// ---------- ballons qui montent ----------
const BAL_COLORS = ["#F48FB1", "#F8BBD0", "#EC407A", "#FFFFFF", "#CE93D8", "#E8A598", "#F3C46E"];

const Balloon: React.FC<{ color: string; r: number }> = ({ color, r }) => (
  <svg width={r * 2.4} height={r * 4.4} viewBox={`0 0 ${r * 2.4} ${r * 4.4}`} style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id={`g${color}${r}`} cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="25%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor={color} stopOpacity="1" />
      </radialGradient>
    </defs>
    <path d={`M ${r * 1.2} ${r * 2.45} q -8 ${r * 0.5} 4 ${r * 1} t -2 ${r * 0.9}`} stroke="rgba(255,255,255,0.8)" strokeWidth={2.5} fill="none" />
    <ellipse cx={r * 1.2} cy={r * 1.2} rx={r} ry={r * 1.2} fill={`url(#g${color}${r})`} />
    <path d={`M ${r * 1.2 - 8} ${r * 2.48} L ${r * 1.2 + 8} ${r * 2.48} L ${r * 1.2} ${r * 2.3} Z`} fill={color} />
  </svg>
);

export const Balloons: React.FC<{ count?: number; seed?: string; speed?: number; opacity?: number }> = ({
  count = 12, seed = "b", speed = 1, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fade = interpolate(frame, [0, 15, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], { ...clamp, easing: theme.ease.out });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fade * opacity }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = 34 + random(`${seed}r${i}`) * 40;
        const x = random(`${seed}x${i}`) * 1000 - 40;
        const delay = random(`${seed}d${i}`) * durationInFrames * 0.55 - 25;
        const v = (6 + random(`${seed}v${i}`) * 5) * speed;
        const t = frame - delay;
        const y = 1980 - t * v;
        const sway = Math.sin((frame + i * 40) / 22) * (12 + random(`${seed}s${i}`) * 18);
        const rot = Math.sin((frame + i * 25) / 30) * 6;
        const color = BAL_COLORS[Math.floor(random(`${seed}c${i}`) * BAL_COLORS.length)];
        return (
          <div key={i} style={{ position: "absolute", left: x + sway, top: y, transform: `rotate(${rot}deg)`,
            filter: "drop-shadow(0 12px 18px rgba(91,31,62,0.18))" }}>
            <Balloon color={color} r={r} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- étoiles scintillantes ----------
const Star: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M20 0 L24 16 L40 20 L24 24 L20 40 L16 24 L0 20 L16 16 Z" fill={color} />
  </svg>
);

export const Sparkles: React.FC<{ count?: number; seed?: string; color?: string; area?: [number, number] }> = ({
  count = 18, seed = "s", color = "#FFFFFF", area = [120, 1700] }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const ph = random(`${seed}p${i}`) * Math.PI * 2;
        const tw = Math.pow(Math.max(0, Math.sin(frame / 9 + ph)), 3);
        const size = 22 + random(`${seed}z${i}`) * 34;
        return (
          <div key={i} style={{ position: "absolute", left: 40 + random(`${seed}x${i}`) * 980,
            top: area[0] + random(`${seed}y${i}`) * (area[1] - area[0]), opacity: tw,
            transform: `scale(${0.5 + tw * 0.7}) rotate(${frame * 2 + i * 20}deg)`,
            filter: `drop-shadow(0 0 10px ${C.goldGlow})` }}>
            <Star size={size} color={i % 3 === 0 ? C.accent : color} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- explosion de confettis ----------
export const Confetti: React.FC<{ delay?: number; count?: number; seed?: string; originY?: number }> = ({
  delay = 0, count = 90, seed = "c", originY = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame - delay) / fps;
  if (t < 0) return null;
  const cols = [C.primary, C.accent, "#FFFFFF", C.blush, C.lilac, "#F48FB1"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const ang = random(`${seed}a${i}`) * Math.PI * 2;
        const sp = 900 + random(`${seed}s${i}`) * 1300;
        const drag = 1 - Math.exp(-t * 2.2);
        const x = 540 + (Math.cos(ang) * sp * drag) / 2.2;
        const y = originY + (Math.sin(ang) * sp * drag) / 2.2 - 200 * drag + 380 * t * t * 0.5;
        const op = interpolate(t, [0, 0.05, 2.4, 3.2], [0, 1, 1, 0], { ...clamp, easing: theme.ease.out });
        const w = 14 + random(`${seed}w${i}`) * 14;
        const spin = t * (400 + random(`${seed}r${i}`) * 600);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: w * (i % 3 === 0 ? 1 : 0.45),
            borderRadius: i % 3 === 0 ? "50%" : 3, background: cols[i % cols.length], opacity: op,
            transform: `rotate(${spin}deg) rotateX(${spin * 1.3}deg)` }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- coeurs flottants (petits, discrets) ----------
export const FloatingHearts: React.FC<{ count?: number; seed?: string }> = ({ count = 7, seed = "h" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const delay = random(`${seed}d${i}`) * durationInFrames * 0.6;
        const t = frame - delay;
        if (t < 0) return null;
        const y = 1750 - t * (4 + random(`${seed}v${i}`) * 3);
        const x = 80 + random(`${seed}x${i}`) * 900 + Math.sin(t / 15) * 20;
        const op = interpolate(t, [0, 12, 70, 100], [0, 0.9, 0.9, 0], { ...clamp, easing: theme.ease.out });
        const s = spring({ frame: t, fps: 30, config: theme.spring.bouncy });
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: op, transform: `scale(${s})` }}>
            <Heart size={44 + random(`${seed}z${i}`) * 30} color={i % 2 ? "#FFFFFF" : C.blush} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
