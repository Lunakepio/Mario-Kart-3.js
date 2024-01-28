import React, { useRef, useMemo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const FlameParticle = ({ position, png, isBoosting, delay = 0 }) => {
  const texture = useLoader(THREE.TextureLoader, png);
  const pointsRef = useRef();
  const initialized = useRef(false);

  // Initialize after delay
  useMemo(() => {
    const timer = setTimeout(() => {
      initialized.current = true;
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const points = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(position, 3)
    );
    return geom;
  }, [position]);

  useFrame(({clock}, delta) => {
    if (!initialized.current) return;

    const pointsCurrent = pointsRef.current;

    if (isBoosting) {
      // Update logic when boosting
      pointsCurrent.position.y += 0.03 * delta * 144;
      pointsCurrent.position.z += 0.06 * delta * 144;

      if(pointsCurrent.position.y > 0.4) {
        pointsCurrent.position.y = 0;
        pointsCurrent.position.z = 0;
        pointsCurrent.material.opacity = 1;
      }
    
      if(pointsCurrent.material.opacity > 0) {
        pointsCurrent.material.opacity -= 0.05 * delta * 144;
      }
    } else {
      // Reset position and opacity when not boosting
      pointsCurrent.position.y = 0;
      pointsCurrent.position.z = 0;
      pointsCurrent.material.opacity = 0;
    }
  });

  return (
    <points ref={pointsRef} geometry={points}>
      <pointsMaterial
        size={1}
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        color={0xff9900}
        opacity={1}
        toneMapped={false}
      />
    </points>
  );
};
