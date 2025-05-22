import { Bvh, OrbitControls, KeyboardControls, Preload, useTexture,} from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { TrackScene } from "./TrackScene";
import { Lighting } from "./misc/Lighting";
import VFXParticles from "./wawa-vfx/VFXParticles";
import { Composer } from "./Composer";
import { useThree } from "@react-three/fiber";
import { Skid } from "./particles/drift/Skid";
import { Leva } from "leva";
import { useGameStore } from "./store";

export const App = () => {
  const controls = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
  ];
  
  const smokeTexture = useTexture('./textures/particles/smoke.png');
  const noiseTexture = useTexture('./textures/noise.png');
  
  const setNoiseTexture = useGameStore((state) => state.setNoiseTexture);
  const {camera} = useThree()

  useEffect(() => {
    if(camera){
      camera.layers.enable(1);
      setNoiseTexture(noiseTexture);
    }
  }, [camera])

  return (

      <>
        {/* <OrbitControls /> */}

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
              intensity: 10,
              nbParticles: 1000,
              renderMode: "billboard",
              gravity: [0, 1, 0],
              frustumCulled: false,
            }}
            alphaMap={smokeTexture}
          />
          {/* <Skid/> */}
          <KeyboardControls map={controls}>
                <TrackScene />
                
              <Lighting />
          </KeyboardControls>

        <Composer/>
        <Leva
          fill // default = false,  true makes the pane fill the parent dom node it's rendered in
          flat // default = false,  true removes border radius and shadow
          oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
          hideTitleBar // default = false, hides the GUI header
          collapsed // default = false, when true the GUI is collpased
          hidden // def
        />
      </>
  );
};
