import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Suspense, useMemo } from "react";
import { Physics } from "@react-three/rapier";
import {
  KeyboardControls,
  Loader,
  OrbitControls,
  Preload,
  Stats,
} from "@react-three/drei";

export const Controls = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  boost: "boost",
  shoot: "shoot",
  slow: "slow",
  reset: "reset",
};
function App() {


  const map = useMemo(
    () => [
      { name: Controls.up, keys: ["KeyW", "ArrowUp"] },
      { name: Controls.down, keys: ["KeyS", "ArrowDown"] },
      { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
      { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.slow, keys: ["Shift"] },
      { name: Controls.shoot, keys: ["KeyE", "Click"] },
      { name: Controls.reset, keys: ["KeyR"] },
    ],
    []
  );

  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <Physics gravity={[0,-90,0]}>
        <KeyboardControls map={map}>
            <Experience />
        </KeyboardControls>
        {/* <Stats /> */}
        </Physics>
      </Suspense>

    </Canvas>
  );
}

export default App;
