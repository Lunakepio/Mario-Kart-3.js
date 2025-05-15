import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { App } from "./App";
import { Bvh } from "@react-three/drei";

export const WebGPUCanvas = () => {
  
  return (
    <Canvas shadows dpr={1} gl={{ depth: false, alpha: false, antialias: false, stencil: false }} camera={{far: 2500}} >
          {/* <Canvas shadows dpr={1} camera={{far: 2500}} > */}

      <Bvh firstHitOnly={true} >
        <App/>
      </Bvh>
      {/* <Perf /> */}
    </Canvas>
  );
}
