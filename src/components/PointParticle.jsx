import React, { useState, useEffect, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const PointParticle = ({ position, png, turboColor }) => {
  const texture = useLoader(THREE.TextureLoader, png);
  const pointsRef = useRef();
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

    setSize(0);
    setOpacity(1);
  }, [turboColor]);

  useFrame(() => {
    if (turboColor === 0xffffff) return;
    if (size < 3) {
      setSize((size) => size + 0.5);
    } else if (opacity > 0) {
      setOpacity((opacity) => opacity - 0.05);
      setSize((size) => size + 0.2);
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
