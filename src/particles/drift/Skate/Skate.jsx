import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef, useMemo, useEffect } from "react";
import { ShaderMaterial, DoubleSide } from "three";
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import { useGameStore } from "../../../store";

export const Skate = forwardRef((props, ref) => {
  const elapsedTimeRef = useRef(0);

  const noiseTexture = useGameStore.getState().noiseTexture;

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0 },
        noiseTexture: { value: noiseTexture || null }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    });
  }, [noiseTexture]);

  useFrame((state) => {
    elapsedTimeRef.current = state.clock.getElapsedTime();
    material.uniforms.time.value = elapsedTimeRef.current;
  });

  useImperativeHandle(ref, () => ({
    setOpacity: (newOpacity) => {
      material.uniforms.opacity.value = newOpacity;
    },
  }));

  const size = 0.7;

  return (
    <mesh layers={1} material={material}>
      <planeGeometry args={[size / 2, size + 0.2, 1, 10]} />
    </mesh>
  );
});