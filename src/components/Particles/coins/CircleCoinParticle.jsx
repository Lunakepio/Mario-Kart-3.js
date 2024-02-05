import React, { useEffect,useRef, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const CircleCoinParticle = ({ position, coins }) => {
  const texture = useLoader(THREE.TextureLoader, "./particles/circle_coin.png");
  const pointsRef = useRef();
  const materialRef = useRef();
  const [size, setSize] = useState(1);
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
      materialRef.current.color.multiplyScalar(4);
    }
  }, []);

  useEffect(() => {
    setSize(0);
    setOpacity(1);
  }, [coins]);

  useFrame((_, delta) => {
   if (size < 5) {
      setSize((size) => Math.min(size + 0.2 * delta * 144, 5));
    } else if (opacity > 0) {
      setOpacity((opacity) => Math.max(opacity - 0.1 * delta * 144, 0));
      setSize((size) => Math.max(size - 0.1 * delta * 144, 0));
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
        opacity={opacity}
        toneMapped={false}
        color={0xbf8717}
      />
    </points>
  );
};
