import { KeyboardControls, OrbitControls, useTexture } from "@react-three/drei";
import { WebGPUCanvas } from "./WebGPUCanvas";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { TrackScene } from "./TrackScene";
import { Lighting } from "./Lighting";
import VFXParticles from "./wawa-vfx/VFXParticles";
import { Composer } from "./Composer";

export const App = () => {
  const controls = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
  ];
  
  const alphaTexture = useTexture('./textures/particles/alpha.png');

  return (

      <>
        <Suspense fallback={null}>
          <VFXParticles
            name="drifting"
            settings={{
              fadeAlpha: [0, 1],
              fadeSize: [0, 0],
              intensity: 4,
              nbParticles: 1000,
              renderMode: "stretchBillboard",
              gravity: [0, -6, 0],
              frustumCulled: false,
            }}
            alphaMap={alphaTexture}
          />
          <KeyboardControls map={controls}>
            <Physics timestep={"vary"} gravity={[0, -90, 0]}>
              <TrackScene />
              <Lighting />
            </Physics>
          </KeyboardControls>
        </Suspense>
        <Composer/>
        {/* <OrbitControls /> */}
      </>
  );
};
