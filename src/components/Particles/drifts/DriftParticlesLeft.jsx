import { Particles1 } from "./Particles1";
import { Particles3 } from "./Particles3";

export const DriftParticlesLeft = ({turboColor,scale, ...props}) => {

  // if(scale < 0.8) {
  //   return null;
  // }

  return (
    <group {...props}>
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      <Particles1 turboColor={turboColor} scale={scale} />
      {/* <Particles3 turboColor={turboColor} scale={scale} /> */}

    </group>
  )
}