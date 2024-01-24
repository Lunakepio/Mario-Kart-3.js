import React, { useState, useEffect, useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const FlameParticle = ({ position, png, turboColor, delay = 0 }) => {
  const texture = useLoader(THREE.TextureLoader, png);
  const pointsRef = useRef();
  const [size, setSize] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialized(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const points = React.useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(position, 3)
    );
    return geom;
  }, [position]);

  useFrame(({clock}, delta) => {
    if (!initialized) return;

    pointsRef.current.position.y += 0.03 * delta * 144;
    pointsRef.current.position.z += 0.06 * delta * 144;
    if(pointsRef.current.position.y > 0.4) {
      pointsRef.current.position.y = 0;
      pointsRef.current.position.z = 0;
      setOpacity(1);
    }
    if(opacity > 0) {
      setOpacity((opacity) => opacity - 0.05 * delta * 144);
    }
  });

  return (
    <points ref={pointsRef} geometry={points}>
      <pointsMaterial
        size={size}
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        color={turboColor}
        opacity={opacity}
        toneMapped={false}
      />
    </points>
  );
};
