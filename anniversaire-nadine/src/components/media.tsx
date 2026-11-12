import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";

// Ken Burns sur une photo plein cadre. dir=1 zoom avant, -1 zoom arrière.
export const KenBurns: React.FC<{ src: string; dir?: 1 | -1; x?: number; y?: number; pan?: number }> = ({
  src, dir = 1, x = 50, y = 50, pan = -20 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const scale = dir === 1 ? 1 + 0.09 * p : 1.09 - 0.09 * p;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${x}% ${y}%`,
        transform: `scale(${scale}) translateX(${pan * p}px)` }} />
    </AbsoluteFill>
  );
};

// Photo large : fond flouté + photo entière dans une carte arrondie.
export const FitPhoto: React.FC<{ src: string; dir?: 1 | -1; top?: number }> = ({ src, dir = 1, top = 300 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const scale = dir === 1 ? 1 + 0.06 * p : 1.06 - 0.06 * p;
  const pop = spring({ frame, fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill>
      <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover",
        filter: "blur(40px) saturate(1.2) brightness(1.05)", transform: "scale(1.2)" }} />
      <AbsoluteFill style={{ background: "rgba(255,227,238,0.25)" }} />
      <div style={{ position: "absolute", left: 50, right: 50, top, borderRadius: 40, overflow: "hidden",
        border: "10px solid #FFFFFF", boxShadow: "0 40px 80px -20px rgba(91,31,62,0.45)",
        transform: `scale(${interpolate(pop, [0, 1], [0.92, 1]) * scale}) rotate(${interpolate(pop, [0, 1], [-3, -1])}deg)` }}>
        <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; from?: number; rate?: number }> = ({ src, from = 0, rate = 1 }) => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile(src)} startFrom={from} playbackRate={rate} muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

// Entrée de scène calée sur le temps fort : zoom 1.14→1 + flou + flash blanc. Sortie rapide.
export const CutIn: React.FC<{ children: React.ReactNode; flash?: boolean; exit?: boolean }> = ({ children, flash = true, exit = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: theme.ease.out });
  const outP = exit ? interpolate(frame, [durationInFrames - 8, durationInFrames], [0, 1], { ...clamp, easing: theme.ease.in }) : 0;
  const scale = interpolate(inP, [0, 1], [1.14, 1]) * (1 + outP * 0.06);
  const blur = (1 - inP) * 14 + outP * 8;
  const flashO = flash ? interpolate(frame, [0, 10], [0.85, 0], { ...clamp, easing: theme.ease.out }) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "#FFF6F9", opacity: flashO + outP * 0.35, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
