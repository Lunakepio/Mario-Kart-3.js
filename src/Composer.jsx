import { Bloom, ChromaticAberration, EffectComposer, N8AO, TiltShift2, } from "@react-three/postprocessing";
import { Invert } from "./InvertEffect.jsx";
import { extend } from "@react-three/fiber";

extend({ Invert });


export const Composer = () => {




  return (
    <EffectComposer disableNormalPass multisampling={8}>
      <Bloom luminanceThreshold={0.} intensity={0.2} mipmapBlur />
      <ChromaticAberration opacity={0.5}/>
      <TiltShift2 blur={0.1}/>
      {/* <N8AO  aoRadius={50} distanceFalloff={0.2} intensity={40} screenSpaceRadius halfRes/> */}
      <Invert/>
    </EffectComposer>
  );
};

