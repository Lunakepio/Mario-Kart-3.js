import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { App } from "./App";
import { Bvh, Preload } from "@react-three/drei";
import { NoToneMapping } from "three";

export const WebGPUCanvas = () => {
  
  return (
    <Canvas shadows dpr={1} gl={{ depth: false, alpha: false, antialias: false, stencil: false, toneMapping: NoToneMapping }} camera={{far: 2500}} >

          <Bvh >
            <App/>
            <Preload all/>
          </Bvh>
          
      {/* <Perf /> */}
    </Canvas>
  );
}
