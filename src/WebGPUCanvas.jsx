import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { App } from "./App";
import { Bvh } from "@react-three/drei";
import { Suspense } from "react";
import { NoToneMapping } from "three";

export const WebGPUCanvas = () => {
  
  return (
    <Canvas shadows dpr={1} gl={{ depth: false, alpha: false, antialias: false, stencil: false, toneMapping: NoToneMapping }} camera={{far: 2500, fov: 55}} >
          {/* <Canvas shadows dpr={1} camera={{far: 2500}} > */}

          <Suspense fallback={null}>
          <Bvh >
            <App/>
          </Bvh>
          </Suspense>
      {/* <Perf /> */}
    </Canvas>
  );
}
