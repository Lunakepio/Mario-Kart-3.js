import React, { useState, useEffect, useRef } from "react";
import { Canvas, useLoader, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

export const HitParticle = ({ position, shouldLaunch }) => {
  const texture = useLoader(THREE.TextureLoader, "./particles/star_symbol.png");
  const pointsRef = useRef();
  const materialRef = useRef();
  const [size, setSize] = useState(3);
  const frames = useRef(50);

  const gravity = -0.03;
  const velocity = useRef({
    x: (Math.random() - 0.5) * 33,
    y: (Math.random() + 0.3) * 4,
  });
  const points = React.useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(position, 3)
    );
    return geom;
  }, [position]);

  useEffect(() => {
    if (shouldLaunch) {
      if (pointsRef.current) {
        // Reset position
        pointsRef.current.position.set(0, 0, 0);

        // Reset velocity
        velocity.current = {
          x: (Math.random() - 0.5) * 33,
          y: (Math.random() + 0.3) * 4,
        };

        // Reset opacity if needed
        if (materialRef.current) {
          materialRef.current.opacity = 1;
          materialRef.current.size = 3;
        }

        frames.current = 50;
      }
    }
  }, [shouldLaunch]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.multiplyScalar(15);
    }
  }, []);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      let position = pointsRef.current.position;

      // Normalized time value for ease-out effect
      let t = 1 - Math.max(frames.current / 150, 0); // Ensure t is between 0 and 1
      let easeOutCubic = 1 - Math.pow(1 - t, 3);

      // Apply the velocity to the position
      position.x += velocity.current.x * delta * easeOutCubic;
      position.y += velocity.current.y * delta * easeOutCubic;

      // Adjust gravity based on delta
      velocity.current.y += gravity * delta * 144;

      // Decrease frames
      frames.current -= 1;

      if (materialRef.current) {
        // materialRef.current.size = 3 + Math.sin(frames.current * 0.1) * 2;
        materialRef.current.opacity = Math.abs(Math.sin(frames.current * 0.1));
      }
      // Reset the particle position and velocity when it goes too far
      if (frames.current < 0) {
        // if(materialRef.current.opacity > 0) {
        //   Math.max(materialRef.current.opacity -= 0.01 * delta * 144, 0);
        // }
        if (materialRef.current.size > 0) {
          Math.max((materialRef.current.size -= 0.1 * delta * 144), 0);
        }
      }
      pointsRef.current.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <points ref={pointsRef} geometry={points}>
      <pointsMaterial
        ref={materialRef}
        size={size}
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        color={0xfafad2}
        opacity={1}
      />

    </points>
  );
};

export const PointsShaderMaterial = shaderMaterial(
  {
    time: 0,
    tex: undefined,
    color: new THREE.Color(0xfafad2),
  },
  // Vertex Shader
  ` 
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  ` 
  varying vec2 vUv;
  uniform sampler2D tex;
  uniform vec3 color;
  uniform float time;  // Using the declared 'time' uniform

  void main() {
    vec2 uv = vUv;
    vec4 texColor = texture2D(tex, uv);

    gl_FragColor = vec4(color, 1.0) * texColor * vec4(1.0, 1.0, 1.0, 1.0);
  }
  `
);

extend({ PointsShaderMaterial });

