import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

export const Particles2 = ({ turboColor, scale, ...props }) => {
  const ref = useRef();
  const velocity = useRef({
    x: Math.random() * 0.05,
    y: Math.random() * 0.05,
    z: Math.random() * 0.02,
  });
  const gravity = -0.003;
  
  useFrame((state, delta) => {
    let position = ref.current.position;
    let velocityVector = new THREE.Vector3(velocity.current.x, velocity.current.y, velocity.current.z);
  

    velocity.current.y += gravity * delta * 144; 

    position.x += velocity.current.x * delta * 144;
    position.y += velocity.current.y * delta * 144;
    position.z += velocity.current.z * delta * 144;
  
    if (!velocityVector.equals(new THREE.Vector3(0, 0, 0))) {
      const alignmentQuaternion = new THREE.Quaternion();
      alignmentQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), velocityVector.normalize());
      ref.current.quaternion.slerp(alignmentQuaternion, 0.1);
    }
  
    if (position.y < 0.05) {
      position.set(0.6, 0.05, 0.5);
      velocity.current = {
        x: Math.random() * 0.05,
        y: Math.random() * 0.05,
        z: Math.random() * 0.02,
      };
    }
  
    ref.current.position.set(position.x, position.y, position.z);
  });
  

  return (
    <mesh ref={ref} position={[0.6, 0.05, 0.5]} scale={[scale, scale * 5, scale]}>
      <sphereGeometry args={[0.01, 16, 16]} />
      <meshStandardMaterial
        emissive={turboColor}
        toneMapped={false}
        emissiveIntensity={5}
      />
    </mesh>
  );
};