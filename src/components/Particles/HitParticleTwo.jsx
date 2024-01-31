import React, { useState, useEffect, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";


export const HitParticleTwo = ({ position, shouldLaunch}) => {
  const texture = useLoader(THREE.TextureLoader, "./particles/star_symbol.png");
  const pointsRef = useRef();
  const materialRef = useRef();
  const [size, setSize] = useState(1);
  const frames = useRef(100);

  const gravity = -0.03;
  const velocity = useRef({
    x: (Math.random() - 0.5) * 16,
    y: (Math.random() + 0.3) *4,
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
          x: (Math.random() - 0.5) * 16,
          y: (Math.random() + 0.3) * 4,
        };

        // Reset opacity if needed
        if (materialRef.current) {
          materialRef.current.opacity = 1;
        }
        frames.current = 100;
      }
    }

  }, [shouldLaunch]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.multiplyScalar(15);
    }
  }, []);


  
  return (
    <points ref={pointsRef} geometry={points}>
      <pointsMaterial
      ref={materialRef}
        size={size}
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        color={0xFAFAD2}
        opacity={1}
        // toneMapped={false}
      />
    </points>
  );
};
