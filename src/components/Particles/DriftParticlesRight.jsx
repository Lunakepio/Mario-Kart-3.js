import { Particles2 } from "./Particles2";
import { Particles4 } from "./Particles4";

export const DriftParticlesRight = ({turboColor,scale, ...props}) => {

  // if(scale < 0.8) {
  //   return null;
  // }

  return (
    <group {...props}>
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />

    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    <Particles2 turboColor={turboColor} scale={scale} />
    </group>
  )
}