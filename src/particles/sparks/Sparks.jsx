import { useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { ShaderMaterial, BufferGeometry, Float32BufferAttribute, AdditiveBlending, Color } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

export const Sparks = forwardRef(({ left }, ref) => {
  const pointsRef = useRef();
  const simulationTimeRef = useRef(0);
  const shouldEmitRef = useRef(false);

  const texture = useTexture("/textures/particles/alpha.png");

  const particleCount = 200;
  const positions = [];
  const colors = [];
  const sizes = [];
  const directions = [];
  const timeOffsets = [];

  const colorsRGB = [
    [238, 175, 74],
    [239, 198, 117],
    [174, 132, 86],
    [255, 222, 189],
    [255, 175, 108],
  ];

  for (let i = 0; i < particleCount; i++) {
    positions.push(0, 0, 0);
    colors.push(...colorsRGB[Math.floor(Math.random() * colorsRGB.length)]);
    sizes.push(Math.random() * 10);
    directions.push(
      (1 + Math.random() * 20) * (left ? 1 : -1),
      Math.random() * 10,
      -Math.random() * 20
    );
    timeOffsets.push(1 + Math.random() * 3);
  }

  const particles = useRef(new BufferGeometry());
  particles.current.setAttribute("position", new Float32BufferAttribute(positions, 3));
  particles.current.setAttribute("color", new Float32BufferAttribute(colors, 3));
  particles.current.setAttribute("size", new Float32BufferAttribute(sizes, 1));
  particles.current.setAttribute("direction", new Float32BufferAttribute(directions, 3));
  particles.current.setAttribute("timeOffset", new Float32BufferAttribute(timeOffsets, 1));

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uMaxOpacity: { value: 0 },
        color: { value: new Color(0xffffff) },
        shouldEmit: { value: shouldEmitRef.current },
      },
      vertexShader,
      fragmentShader,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
    });
  }, [texture]);

  useFrame((_, delta) => {
    const targetOpacity = shouldEmitRef.current ? 1.0 : 0.0;
    material.uniforms.uMaxOpacity.value = lerp(material.uniforms.uMaxOpacity.value, targetOpacity, 0.1);
    material.uniforms.uTime.value = shouldEmitRef.current
      ? (simulationTimeRef.current += delta * 1.3)
      : 0;
  });

  useImperativeHandle(ref, () => ({
    setColor(newColor) {
      material.uniforms.color.value.set(newColor);
    },
    setEmitState(newEmitState) {
      shouldEmitRef.current = newEmitState;
      material.uniforms.shouldEmit.value = newEmitState;
      if (!newEmitState) {
        simulationTimeRef.current = 0;
        material.uniforms.uTime.value = 0;
      }
    },
  }));

  return (
    <group position={[0, 0, 0]} layers={1}>
      <points ref={pointsRef} geometry={particles.current} material={material} layers={1} />
    </group>
  );
});