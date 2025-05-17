import { Bvh, KeyboardControls, Preload, useTexture,} from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { TrackScene } from "./TrackScene";
import { Lighting } from "./misc/Lighting";
import VFXParticles from "./wawa-vfx/VFXParticles";
import { Composer } from "./Composer";
import { useThree } from "@react-three/fiber";

export const App = () => {
  const controls = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
  ];
  
  const smokeTexture = useTexture('./textures/particles/smoke.png');
  const {camera} = useThree()

  useEffect(() => {
    if(camera){
      camera.layers.enable(1);
    }
  }, [camera])

  return (

      <>
          <VFXParticles
            name="smoke"
            settings={{
              fadeAlpha: [1, 0],
              fadeSize: [0.5, 1],
              intensity: 0.5,
              nbParticles: 100,
              renderMode: "billboard",
              gravity: [0, 0, 0],
              frustumCulled: false,
            }}
            alphaMap={smokeTexture}
          />
          <VFXParticles
            name="dust"
            settings={{
              fadeAlpha: [1, 0],
              fadeSize: [0, 1],
              intensity: 3,
              nbParticles: 1000,
              renderMode: "billboard",
              gravity: [0, 1, 0],
              frustumCulled: false,
            }}
            alphaMap={smokeTexture}
          />
          <KeyboardControls map={controls}>
                <TrackScene />
                
              <Lighting />
          </KeyboardControls>

        <Composer/>
        {/* <OrbitControls /> */}
      </>
  );
};
