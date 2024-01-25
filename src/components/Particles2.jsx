import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

export const Particles2 = ({ turboColor, scale, numParticles = 50, ...props }) => {
  const instancedMeshRef = useRef();
  const particlesData = useMemo(() => {
    return new Array(numParticles).fill().map(() => ({
      position: new THREE.Vector3(0.6, 0.05, 0.5),
      velocity: new THREE.Vector3(Math.random() * 0.05, Math.random() * 0.05, Math.random() * 0.02),
      gravity: -0.003
    }));
  }, [numParticles]);

  useFrame((state, delta) => {
    const deltaScaled = delta * 144; // Scale for 144 FPS
    particlesData.forEach((particle, i) => {
      particle.velocity.y += particle.gravity * deltaScaled;

      particle.position.x += particle.velocity.x * deltaScaled;
      particle.position.y += particle.velocity.y * deltaScaled;
      particle.position.z += particle.velocity.z * deltaScaled;

      if (particle.position.y < 0.05) {
        particle.position.set(0.6, 0.05, 0.5);
        particle.velocity.set(Math.random() * 0.05, Math.random() * 0.05, Math.random() * 0.02);
      }

      const matrix = new THREE.Matrix4();
      matrix.setPosition(particle.position);
      instancedMeshRef.current.setMatrixAt(i, matrix);
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instancedMeshRef} args={[null, null, numParticles]}>
      <sphereGeometry args={[0.01, 16, 16]} />
      <meshStandardMaterial
        emissive={turboColor}
        toneMapped={false}
        emissiveIntensity={5}
      />
    </instancedMesh>
  );
};
