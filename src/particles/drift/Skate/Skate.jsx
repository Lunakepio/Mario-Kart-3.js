import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { AdditiveBlending, BackSide, DoubleSide } from "three";
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';


export const Skate = forwardRef((props, ref) => {
  const materialRef = useRef(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  useImperativeHandle(ref, () => {
  
    return {
      setOpacity: (newOpacity) => {
        if (materialRef.current) {
          materialRef.current.uniforms.opacity.value = newOpacity;
        }
      },
    };
  });
  

  const size = 0.7;

  return (
    <>
      <mesh layers={1}>
        <planeGeometry args={[size / 2, size + 0.2, 1, 10]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            time: { value: 0 },
            opacity: { value: 0. },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
          // depthTest={false}
          // blending={AdditiveBlending}
          side={DoubleSide}
        />
      </mesh>
      </>
  );
});
