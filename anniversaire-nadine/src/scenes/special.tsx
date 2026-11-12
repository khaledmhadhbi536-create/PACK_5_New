import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";
import { Balloons, BgMesh, Confetti, FloatingHearts, Heart, Sparkles } from "../components/fx";
import { KenBurns } from "../components/media";
import { NameReveal, Pill, WordReveal } from "../components/text";

const C = theme.colors;
const B = theme.bar;

// ---------- INTRO : portrait rond + « 1 » + Joyeux anniversaire Nadine ----------
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 3, fps, config: theme.spring.bouncy });
  const badge = spring({ frame: frame - 20, fps, config: theme.spring.bouncy });
  const breathe = 1 + Math.sin(frame / 22) * 0.015;
  const size = 560;
  return (
    <AbsoluteFill>
      <BgMesh />
      <Balloons count={13} seed="intro" opacity={0.95} />
      <Sparkles count={16} seed="intro" />
      {/* portrait */}
      <div style={{ position: "absolute", left: (1080 - size) / 2, top: 300, width: size, height: size,
        transform: `scale(${interpolate(pop, [0, 1], [0.3, 1]) * breathe}) rotate(${interpolate(pop, [0, 1], [-20, 0])}deg)`,
        opacity: Math.min(1, pop * 1.5) }}>
        <div style={{ position: "absolute", inset: -26, borderRadius: "50%", border: `8px dashed ${C.accent}`,
          transform: `rotate(${frame * 0.6}deg)`, opacity: 0.9 }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: "14px solid #FFFFFF",
          boxShadow: `0 30px 70px -20px rgba(91,31,62,0.5), 0 0 0 4px ${C.blush}` }}>
          <Img src={staticFile("photos/274fb991.jpg")} style={{ position: "absolute", width: "230%", left: "-68%", top: "-12%" }} />
        </div>
        {/* badge 1 */}
        <div style={{ position: "absolute", right: -40, top: -30, width: 210, height: 210, borderRadius: "50%",
          background: C.primary, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 60px ${C.glow}, 0 16px 30px -8px rgba(91,31,62,0.5)`, border: "8px solid #FFFFFF",
          transform: `scale(${badge * (1 + Math.sin(frame / 10) * 0.03)}) rotate(${interpolate(badge, [0, 1], [-90, 12])}deg)` }}>
          <span style={{ fontFamily: theme.fonts.display, fontSize: 150, color: "#FFFFFF", lineHeight: 1, marginTop: -10 }}>1</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 945, left: 0, right: 0 }}>
        <WordReveal text="Joyeux anniversaire" delay={B} per={5}
          style={{ fontFamily: theme.fonts.display, fontSize: 92, color: C.ink, textShadow: "0 4px 0 #FFFFFF" }} />
      </div>
      <div style={{ position: "absolute", top: 1065, left: 0, right: 0 }}>
        <NameReveal delay={2 * B} size={230} />
      </div>
      <div style={{ position: "absolute", top: 1440, left: 0, right: 0 }}>
        <Pill text="1 an déjà !" delay={3 * B} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- COLLAGE : polaroïds qui tombent ----------
const POLAS = [
  { src: "photos/3ed9a6aa.jpg", x: 60, y: 430, r: -8 },
  { src: "photos/f725edb8.jpg", x: 560, y: 380, r: 7 },
  { src: "photos/16cbd29a.jpg", x: 300, y: 820, r: -2 },
  { src: "photos/e4f6ec8f.jpg", x: 40, y: 1180, r: 6 },
  { src: "photos/23c61d6a.jpg", x: 580, y: 1150, r: -7 },
];
export const Collage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame: frame - 2, fps, config: theme.spring.bouncy });
  return (
    <AbsoluteFill>
      <BgMesh />
      <Sparkles count={10} seed="col" color={C.accent} />
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center", fontFamily: theme.fonts.display,
        fontSize: 110, color: C.ink, textShadow: "0 5px 0 #FFFFFF", opacity: Math.min(1, title * 1.5),
        transform: `translateY(${interpolate(title, [0, 1], [-60, 0])}px) scale(${interpolate(title, [0, 1], [0.7, 1])})` }}>
        Notre petite star
      </div>
      {POLAS.map((p, i) => {
        const s = spring({ frame: frame - 10 - i * theme.beat / 2, fps, config: theme.spring.bouncy });
        const idle = Math.sin((frame + i * 20) / 25) * 1.2;
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: 440, background: "#FFFFFF", padding: "18px 18px 70px",
            borderRadius: 10, boxShadow: "0 30px 60px -18px rgba(91,31,62,0.5)", opacity: Math.min(1, s * 2),
            transform: `translateY(${interpolate(s, [0, 1], [-700, 0])}px) rotate(${p.r * s + idle + (1 - s) * 30}deg) scale(${interpolate(s, [0, 1], [1.3, 1])})` }}>
            <Img src={staticFile(p.src)} style={{ width: "100%", height: 480, objectFit: "cover", display: "block", borderRadius: 4 }} />
            <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <Heart size={40} color={C.blush} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- LETTRE : petit message pour Nadine ----------
const LETTER = [
  { t: "Ma petite Nadine,", big: true },
  { t: "en un an, tu as rempli" },
  { t: "nos cœurs de bonheur." },
  { t: "Reste aussi cool," },
  { t: "aussi drôle et aussi douce." },
  { t: "On t'aime fort !", big: true },
];
export const Letter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: theme.spring.smooth });
  const float = Math.sin(frame / 30) * 5;
  let delay = 10;
  return (
    <AbsoluteFill>
      <BgMesh />
      <FloatingHearts count={9} seed="let" />
      <div style={{ position: "absolute", left: 90, right: 90, top: 400, padding: "80px 50px 90px", background: "#FFFDF8",
        borderRadius: 36, boxShadow: "0 40px 90px -24px rgba(91,31,62,0.5)", border: `3px solid ${C.blush}`,
        opacity: card, transform: `translateY(${interpolate(card, [0, 1], [120, 0]) + float}px) rotate(${interpolate(card, [0, 1], [6, -1.5])}deg) scale(${interpolate(card, [0, 1], [0.9, 1])})` }}>
        {/* ruban */}
        <div style={{ position: "absolute", top: -46, left: "50%", transform: "translateX(-50%) rotate(-3deg)", background: C.primary,
          color: "#FFFFFF", fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 44, padding: "10px 40px", borderRadius: 999, whiteSpace: "nowrap",
          boxShadow: `0 0 40px ${C.glow}` }}>Un petit mot pour toi</div>
        {LETTER.map((l, i) => {
          const d = delay;
          delay += l.t.split(" ").length * 3 + 10;
          return (
            <WordReveal key={i} text={l.t} delay={d} per={3}
              style={{ fontFamily: theme.fonts.hand, fontWeight: 700, fontSize: l.big ? 92 : 74, lineHeight: 1.3, columnGap: 18,
                color: l.big ? C.primary : C.ink, marginTop: i === 5 ? 30 : 0 }} />
          );
        })}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <div style={{ transform: `scale(${spring({ frame: frame - delay, fps, config: theme.spring.bouncy }) * (1 + Math.sin(frame / 6) * 0.07)})` }}>
            <Heart size={110} color={C.primary} style={{ filter: `drop-shadow(0 8px 18px ${C.glow})` }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- FINALE ----------
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const end = interpolate(frame, [durationInFrames - 30, durationInFrames], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const love = spring({ frame: frame - 80, fps, config: theme.spring.bouncy });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#7A2E52" }} />
      <AbsoluteFill style={{ transform: "translateY(-330px) scale(1.12)", transformOrigin: "50% 0%" }}>
        <KenBurns src="photos/718a1533.jpg" x={45} y={50} dir={-1} pan={10} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, rgba(122,46,82,0.65) 58%, rgba(122,46,82,0.95) 72%, #7A2E52 100%)" }} />
      <Balloons count={14} seed="fin" speed={1.1} />
      <Sparkles count={20} seed="fin" area={[100, 1100]} />
      <Confetti delay={30} seed="c1" originY={1100} />
      <Confetti delay={4 * theme.bar} seed="c2" originY={800} count={110} />
      <div style={{ position: "absolute", top: 1110, left: 0, right: 0 }}>
        <WordReveal text="Joyeux 1er anniversaire" delay={4} per={5}
          style={{ fontFamily: theme.fonts.display, fontSize: 86, color: "#FFFFFF", textShadow: "0 4px 16px rgba(91,31,62,0.6)" }} />
      </div>
      <div style={{ position: "absolute", top: 1215, left: 0, right: 0 }}>
        <NameReveal delay={28} size={250} />
      </div>
      <div style={{ position: "absolute", top: 1600, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 20,
        opacity: Math.min(1, love * 1.5), transform: `translateY(${interpolate(love, [0, 1], [40, 0])}px) scale(${interpolate(love, [0, 1], [0.7, 1])})` }}>
        <Heart size={64} color="#FFFFFF" />
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 66, color: "#FFFFFF", textShadow: "0 4px 14px rgba(91,31,62,0.6)" }}>
          On t'aime fort
        </span>
        <Heart size={64} color="#FFFFFF" />
      </div>
      <AbsoluteFill style={{ background: C.bgAlt, opacity: end }} />
    </AbsoluteFill>
  );
};
