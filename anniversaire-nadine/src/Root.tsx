import { Composition } from "remotion";
import { Nadine, TOTAL } from "./Nadine";
import "./fonts";

export const RemotionRoot = () => (
  <Composition id="Nadine" component={Nadine} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
