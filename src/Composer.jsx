import { Bloom, ChromaticAberration, EffectComposer, N8AO, TiltShift2, } from "@react-three/postprocessing";
import { ColorGrading } from "./ColorGradingEffect";
import { extend } from "@react-three/fiber";

extend({ ColorGrading });


export const Composer = () => {




  return (
    <EffectComposer disableNormalPass multisampling={8}>
      <ColorGrading/>

      <Bloom luminanceThreshold={1.} intensity={0.5} mipmapBlur />
      {/* <TiltShift2 blur={0.1}/> */}
      {/* <N8AO  aoRadius={50} distanceFalloff={0.2} intensity={40} screenSpaceRadius halfRes/> */}
    </EffectComposer>
  );
};

