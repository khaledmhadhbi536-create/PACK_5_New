import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Pacifico", url: staticFile("fonts/Pacifico.ttf") }),
  loadFont({ family: "Fredoka", url: staticFile("fonts/Fredoka.ttf"), weight: "300 700" }),
  loadFont({ family: "Dancing Script", url: staticFile("fonts/DancingScript.ttf"), weight: "400 700" }),
]);
