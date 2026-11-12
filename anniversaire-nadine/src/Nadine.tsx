import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { clamp, theme } from "./theme";
import { Grade, Grain, FloatingHearts, Vignette } from "./components/fx";
import { Clip, CutIn, FitPhoto, KenBurns } from "./components/media";
import { Sticker } from "./components/text";
import { Collage, Finale, Intro, Letter } from "./scenes/special";

const B = theme.bar; // 54 images = 1 mesure à 100 BPM (3/4)

type Scene = { len: number; el: React.ReactNode; flash?: boolean; pops?: number[]; shimmer?: number[] };

const photo = (src: string, lines: string[], o: { dir?: 1 | -1; x?: number; y?: number; heart?: boolean; rot?: number } = {}): Scene => ({
  len: 2 * B,
  pops: [12],
  el: (
    <>
      <KenBurns src={`photos/${src}.jpg`} dir={o.dir} x={o.x} y={o.y} />
      <Sticker lines={lines} delay={14} rot={o.rot ?? -3} heart={o.heart} />
    </>
  ),
});

const SCENES: Scene[] = [
  { len: 4 * B, el: <Intro />, flash: false, pops: [3, 20, 3 * B], shimmer: [2 * B] },
  { len: 5 * B, pops: [26], el: (<><Clip src="videos/room.mp4" /><Sticker lines={["Surprise", "Nadine !"]} delay={28} y={1340} heart /></>) },
  { len: 2 * B, pops: [14], el: (<><FitPhoto src="photos/e018990c.jpg" top={330} /><Sticker lines={["La plus cool", "de la fête !"]} delay={16} y={1430} rot={3} /></>) },
  photo("bcae7b7b", ["Ton tout premier", "gâteau"], { x: 40, dir: -1 }),
  photo("4a77f28d", ["Des éclats de rire"], { x: 40, rot: 3 }),
  photo("cae8a7e9", ["Miam miam !"], { x: 40, dir: -1 }),
  photo("d1f1c890", ["Et un sacré", "caractère !"], { x: 42, heart: true, rot: 4 }),
  { len: 3 * B, el: <Collage />, pops: [2] },
  photo("335fa163", ["Petite princesse"], { x: 48, dir: -1, heart: true }),
  photo("274fb991", ["Douce comme", "une fleur"], { x: 52, rot: 3 }),
  {
    len: 5 * B, pops: [16],
    el: (
      <>
        <Sequence durationInFrames={78}><Clip src="videos/car.mp4" /></Sequence>
        <Sequence from={78} durationInFrames={56}><Clip src="videos/cart.mp4" /></Sequence>
        <Sequence from={134} durationInFrames={68}><Clip src="videos/sea.mp4" /></Sequence>
        <Sequence from={202} durationInFrames={68}><CutIn exit={false}><KenBurns src="photos/5279ea5a.jpg" x={45} /></CutIn></Sequence>
        <Sequence durationInFrames={134}><Sticker lines={["Pilote", "en herbe !"]} delay={16} y={1380} rot={-4} /></Sequence>
        <Sequence from={134}><Sticker lines={["Toujours", "en vadrouille"]} delay={14} y={1380} rot={3} /></Sequence>
      </>
    ),
  },
  { len: 3 * B, pops: [14], el: (<><Clip src="videos/park.mp4" rate={0.985} /><Sticker lines={["Notre rayon", "de soleil"]} delay={16} y={1380} /></>) },
  { len: 2 * B, pops: [14], el: (<><FitPhoto src="photos/6ffefcc8.jpg" top={200} dir={-1} /><FloatingHearts count={6} seed="fam" /><Sticker lines={["Entourée", "d'amour"]} delay={16} y={1500} heart rot={-2} /></>) },
  { len: 4 * B, el: <Letter /> },
  { len: 7 * B, el: <Finale />, shimmer: [26, 4 * B - 2], flash: true },
];

const starts: number[] = [];
let acc = 0;
for (const s of SCENES) { starts.push(acc); acc += s.len; }
export const TOTAL = acc; // 47 mesures = 2538 images = 84,6 s

export const Nadine: React.FC = () => (
  <AbsoluteFill style={{ background: theme.colors.bg }}>
    {SCENES.map((s, i) => (
      <Sequence key={i} from={starts[i]} durationInFrames={s.len}>
        <CutIn flash={s.flash ?? true} exit={i !== SCENES.length - 1}>{s.el}</CutIn>
      </Sequence>
    ))}
    {/* couche 4-5 : étalonnage, grain, vignette */}
    <Grade />
    <Grain />
    <Vignette />

    {/* son : musique + effets 2-3 images avant l'impact */}
    <Audio src={staticFile("audio/music.wav")} volume={(f) => interpolate(f, [TOTAL - 20, TOTAL], [1, 0], clamp)} />
    {SCENES.map((s, i) => (
      <React.Fragment key={`sfx${i}`}>
        {i > 0 && (
          <Sequence from={starts[i] - 6} durationInFrames={20}><Audio src={staticFile("audio/whoosh.wav")} volume={0.18} /></Sequence>
        )}
        {(s.pops ?? []).map((p, k) => (
          <Sequence key={`p${k}`} from={starts[i] + p} durationInFrames={10}><Audio src={staticFile("audio/pop.wav")} volume={0.35} /></Sequence>
        ))}
        {(s.shimmer ?? []).map((p, k) => (
          <Sequence key={`s${k}`} from={starts[i] + p} durationInFrames={66}><Audio src={staticFile("audio/shimmer.wav")} volume={0.3} /></Sequence>
        ))}
      </React.Fragment>
    ))}
  </AbsoluteFill>
);
