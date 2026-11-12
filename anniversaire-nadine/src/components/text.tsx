import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";
import { Heart } from "./fx";

const C = theme.colors;

// Autocollant « sticker » : carte blanche inclinée, entrée bouncy (opacité + échelle + rotation), sortie rapide.
export const Sticker: React.FC<{
  lines: string[]; delay?: number; y?: number; rot?: number; size?: number; heart?: boolean; until?: number;
}> = ({ lines, delay = 8, y = 1380, rot = -3, size = 84, heart = false, until }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const end = until ?? durationInFrames - 2;
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const out = interpolate(frame, [end - 9, end], [0, 1], { ...clamp, easing: theme.ease.in });
  const breathe = 1 + Math.sin(frame / 20) * 0.012;
  const floatY = Math.sin(frame / 28) * 4;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center",
      opacity: Math.min(p * 1.4, 1) * (1 - out),
      transform: `translateY(${interpolate(p, [0, 1], [70, 0]) + floatY - out * 40}px) scale(${interpolate(p, [0, 1], [0.6, 1]) * breathe * (1 - out * 0.15)}) rotate(${interpolate(p, [0, 1], [rot - 10, rot])}deg)` }}>
      <div style={{ background: "#FFFFFF", borderRadius: 48, padding: "26px 54px 32px", textAlign: "center",
        boxShadow: "0 30px 60px -18px rgba(91,31,62,0.45)", border: `6px solid ${C.blush}`, position: "relative" }}>
        {lines.map((l, i) => {
          const pl = spring({ frame: frame - delay - 5 - i * 5, fps, config: theme.spring.snappy });
          return (
            <div key={i} style={{ fontFamily: theme.fonts.hand, fontWeight: 700, fontSize: size, lineHeight: 1.1,
              color: C.ink, opacity: pl, transform: `translateY(${interpolate(pl, [0, 1], [18, 0])}px)` }}>{l}</div>
          );
        })}
        {heart && (
          <div style={{ position: "absolute", right: -30, top: -38,
            transform: `scale(${spring({ frame: frame - delay - 12, fps, config: theme.spring.bouncy }) * (1 + Math.sin(frame / 6) * 0.06)}) rotate(14deg)` }}>
            <Heart size={96} color={C.primary} style={{ filter: `drop-shadow(0 6px 14px ${C.glow})` }} />
          </div>
        )}
      </div>
    </div>
  );
};

// Mot par mot (spring snappy, décalage 3 images)
export const WordReveal: React.FC<{ text: string; delay?: number; per?: number; style?: React.CSSProperties }> = ({
  text, delay = 0, per = 3, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 22, ...style }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        return (
          <span key={i} style={{ display: "inline-block", opacity: p,
            transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})` }}>{w}</span>
        );
      })}
    </div>
  );
};

// « Nadine » lettre par lettre, dégradé or-rose + halo
export const NameReveal: React.FC<{ delay?: number; size?: number }> = ({ delay = 0, size = 230 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = "Nadine".split("");
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline" }}>
      {letters.map((l, i) => {
        const p = spring({ frame: frame - delay - i * 4, fps, config: theme.spring.bouncy });
        const bob = Math.sin((frame - i * 5) / 14) * 6;
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: theme.fonts.display, fontSize: size, lineHeight: 1.25,
            padding: "0 4px",
            background: `linear-gradient(180deg, #FFF3C9 0%, ${C.accent} 45%, #E39A4C 100%)`,
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            filter: `drop-shadow(0 6px 0 ${C.primary}) drop-shadow(0 0 26px ${C.goldGlow})`,
            opacity: Math.min(1, p * 1.5),
            transform: `translateY(${interpolate(p, [0, 1], [120, 0]) + bob}px) scale(${interpolate(p, [0, 1], [0.3, 1])}) rotate(${interpolate(p, [0, 1], [-25, 0])}deg)` }}>{l}</span>
        );
      })}
    </div>
  );
};

// Pastille « 1 an déjà ! »
export const Pill: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ background: C.primary, color: "#FFFFFF", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 64,
        padding: "16px 48px", borderRadius: 999, boxShadow: `0 0 50px ${C.glow}, 0 20px 40px -12px rgba(91,31,62,0.5)`,
        opacity: Math.min(1, p * 1.5), transform: `scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${interpolate(p, [0, 1], [8, -2])}deg)` }}>{text}</div>
    </div>
  );
};
