import React, { useEffect, useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const StarItemParticle = ({ position, item, timeModifier, color }) => {
  const texture = useLoader(THREE.TextureLoader, "./particles/star_coin.png");
  const pointsRef = useRef();
  const materialRef = useRef();
  const sizeRef = useRef(1);
  const opacityRef = useRef(1);
  const originalYpos = useRef(0);

  const points = React.useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(position, 3)
    );
    return geom;
  }, [position]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.multiplyScalar(6);
    }
  }, []);

  useEffect(() => {
    if(item){
      sizeRef.current = 0;
      opacityRef.current = 1;
      pointsRef.current.position.x = Math.random() * 1 - 0.5;
      pointsRef.current.position.y = Math.random() * 0.5 - 0.25;
      originalYpos.current = pointsRef.current.position.y;
    }
  }, [item]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    pointsRef.current.position.y += 0.008 * delta * 144;
    if (sizeRef.current < 1) {
      sizeRef.current = Math.min(sizeRef.current + 0.01 * delta * 144, 1);
    }

    if (pointsRef.current.position.y > originalYpos.current + 0.01) {
      opacityRef.current = Math.max(opacityRef.current - 0.01 * delta * 144, 0);
    } else {
      opacityRef.current = Math.abs(Math.sin(time * timeModifier * 1500));
    }

    // Update material properties directly
    if (materialRef.current) {
      materialRef.current.size = sizeRef.current;
      materialRef.current.opacity = opacityRef.current;
    }
});

  return (
    <points ref={pointsRef} geometry={points}>
      <pointsMaterial
        ref={materialRef}
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        toneMapped={false}
        color={color}
      />
    </points>
  );
};
