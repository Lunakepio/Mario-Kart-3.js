import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { lerp } from "three/src/math/MathUtils.js";
import { useRef, useImperativeHandle, forwardRef } from "react";
import { BufferGeometry, Float32BufferAttribute, AdditiveBlending, Color } from "three";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

export const Sparks = forwardRef(({ left }, ref) => {
  const pointsRef = useRef();
  const materialRef = useRef();
  const simulationTimeRef = useRef(0);
  const shouldEmitRef = useRef(false);

  const texture = useTexture("/textures/particles/alpha.png");

  const particleCount = 2000;
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
    const x = 0;
    const y = 0;
    const z = 0;
    positions.push(x, y, z);

    colors.push(...colorsRGB[Math.floor(Math.random() * colorsRGB.length)]);

    sizes.push(Math.random() * 10);
    directions.push(
      (1 + (Math.random()) * 20) * (left ? 1 : -1),
      (Math.random()) * 10,
      -(Math.random()) * 20
    );

    timeOffsets.push(1 + (Math.random() * 3));
  }

  const particles = useRef(new BufferGeometry());
  particles.current.setAttribute(
    "position",
    new Float32BufferAttribute(positions, 3)
  );
  particles.current.setAttribute(
    "color",
    new Float32BufferAttribute(colors, 3)
  );
  particles.current.setAttribute(
    "size",
    new Float32BufferAttribute(sizes, 1)
  );
  particles.current.setAttribute(
    "direction",
    new Float32BufferAttribute(directions, 3)
  );
  particles.current.setAttribute(
    "timeOffset",
    new Float32BufferAttribute(timeOffsets, 1)
  );

  let currentOpacity = 0.0;
  useFrame((state, delta) => {
    if (materialRef.current) {
      const targetOpacity = shouldEmitRef.current ? 1.0 : 0.0;
      currentOpacity = lerp(currentOpacity, targetOpacity, 0.1);

      if (shouldEmitRef.current) {
        simulationTimeRef.current += delta;
        materialRef.current.uniforms.uTime.value = simulationTimeRef.current;
      } else {
        materialRef.current.uniforms.uTime.value = 0;
      }

      materialRef.current.uniforms.uMaxOpacity.value = currentOpacity;
    }
  });

  useImperativeHandle(ref, () => ({
    setColor(newColor) {
      if (materialRef.current) {
         materialRef.current.uniforms.color.value.set(newColor);
      }
    },
    setEmitState(newEmitState) {
      shouldEmitRef.current = newEmitState;
      if (materialRef.current) {
        materialRef.current.uniforms.shouldEmit.value = newEmitState;
        if (!newEmitState) {
          simulationTimeRef.current = 0;
          materialRef.current.uniforms.uTime.value = 0;
        }
      }
    },
  }));

  return (
    <group position={[0, 0, 0]} layers={1}>
      <points ref={pointsRef} geometry={particles.current} transparent layers={1}>
        <shaderMaterial
          ref={materialRef}
          attach="material"
          uniforms={{
            uTime: { value: 0 }, // Start time at 0
            uTexture: { value: texture },
            uMaxOpacity: { value: 0 }, // Start faded out
            color: { value: new Color(0xffffff) },
            shouldEmit: { value: shouldEmitRef.current }, // Initial value from ref
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          vertexColors
          transparent
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
});
