import React, { useState, useEffect, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const PointParticle = ({ position, png, turboColor }) => {
  const texture = useLoader(THREE.TextureLoader, png);
  const pointsRef = useRef();
  const materialRef = useRef();
  const [size, setSize] = useState(0);
  const [opacity, setOpacity] = useState(1);

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
      materialRef.current.color.multiplyScalar(10);
    }
    setSize(0);
    setOpacity(1);
  }, [turboColor]);

  useFrame((_, delta) => {
    if (turboColor === 0xffffff) return;
    if (size < 5) {
      setSize((size) => Math.min(size + 0.3 * delta * 144, 5));
    } else if (opacity > 0) {
      setOpacity((opacity) => Math.max(opacity - 0.2 * delta * 144, 0));
      setSize((size) => Math.max(size - 0.2 * delta * 144, 0));
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
        color={turboColor}
        opacity={opacity}
        toneMapped={false}
      />
    </points>
  );
};
