import { Bloom, EffectComposer, LensFlare } from "@react-three/postprocessing";
import { ColorGrading } from "./ColorGradingEffect";
import { extend } from "@react-three/fiber";
import { Color } from "three";
import { useTexture } from "@react-three/drei";

extend({ ColorGrading });

function DirtLensFlare() {
  const texture = useTexture("/textures/lensDirt.jpg");

  return (
    <LensFlare
      enabled={true}
      opacity={1.0}
      position={{ x: -25, y: 6, z: -60 }}
      glareSize={0.35}
      starPoints={6}
      animated={true}
      followMouse={false}
      anamorphic={false}
      colorGain={new Color("#38160B")}
      flareSpeed={0.4}
      flareShape={0.1}
      flareSize={0.005}
      secondaryGhosts={true}
      ghostScale={0.1}
      aditionalStreaks={true}
      starBurst={true}
      haloScale={0.5}
      lensDirtTexture={texture}
    />
  );
}


export const Composer = () => {
  return (
    <EffectComposer disableNormalPass multisampling={false}>
      <ColorGrading />

      <Bloom luminanceThreshold={1.0} intensity={0.5} mipmapBlur />
    </EffectComposer>
  );
};

