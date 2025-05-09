import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { App } from "./App";

export const WebGPUCanvas = ({ children }) => {
  
  return (
    <Canvas shadows dpr={1} gl={{ depth: false, alpha: false, antialias: false, stencil: false }} >
      <App/>
      <Perf />
    </Canvas>
  );
}
