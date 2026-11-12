// theme.ts — source unique : couleurs, easings, springs, polices, tempo.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#FFE3EE",
    bgAlt: "#FFF6F9",
    primary: "#E2457E", // couleur héros : 1 élément max par image
    accent: "#F3C46E", // or
    blush: "#F9B9D0",
    lilac: "#D9B8F0",
    text: "#FFFFFF",
    ink: "#5B1F3E",
    glow: "rgba(226, 69, 126, 0.55)",
    goldGlow: "rgba(243, 196, 110, 0.75)",
  },
  fonts: {
    display: "Pacifico",
    body: "Fredoka",
    hand: "Dancing Script",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 9, stiffness: 170, mass: 0.7 },
  },
  // Musique : 100 BPM en 3/4 → 1 temps = 18 images, 1 mesure = 54 images (30 fps)
  beat: 18,
  bar: 54,
} as const;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
