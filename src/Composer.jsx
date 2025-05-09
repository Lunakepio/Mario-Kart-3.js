import { Bloom, ChromaticAberration, EffectComposer, ShockWave, TiltShift2, WaterEffect } from "@react-three/postprocessing";


export const Composer = () => {




  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.} intensity={0.2} mipmapBlur />
      <ChromaticAberration opacity={0.5}/>
      <TiltShift2 blur={0.1}/>
      {/* <N8AO /> */}
    </EffectComposer>
  );
};
