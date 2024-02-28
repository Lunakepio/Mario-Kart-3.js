import React, { useRef, useMemo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const SmokeParticle = ({ position, png, leftDrift, rightDrift, delay = 0 }) => {
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

    if(leftDrift || rightDrift){
      pointsCurrent.position.z += 0.1 * delta * 144;

      //Set inclination
      if(leftDrift){
        pointsCurrent.position.x -= 0.09 * delta * 144;
      }

      if(rightDrift){
        pointsCurrent.position.x += 0.09 * delta * 144;
      }

      if(pointsCurrent.position.x < -1.8 || pointsCurrent.position.x > 1.8) {
        pointsCurrent.position.z = 0;
        pointsCurrent.position.x = 0;
        pointsCurrent.material.opacity = 1.5;
        pointsCurrent.material.size = 4;
      }
    
      if(pointsCurrent.material.opacity > 0) {
        pointsCurrent.material.opacity -= 0.01 * delta * 144;
      }

      if(pointsCurrent.material.size > 0) {
        //Shrinking effect
        pointsCurrent.material.size -= 0.1* delta * 144;
      }

    } else {
      pointsCurrent.position.z = 0;
      pointsCurrent.position.x = 0;
      pointsCurrent.material.opacity = 0;
      pointsCurrent.material.size = 0;
    }

  });

  return (
    <points ref={pointsRef} geometry={points}>
      <pointsMaterial
        size={1}
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        color={0xBFBFBF}
        opacity={1}
        toneMapped={false}
      />
    </points>
  );
};
