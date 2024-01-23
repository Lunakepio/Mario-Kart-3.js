import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

export const Particles4 = ({ turboColor, scale, ...props }) => {
  const ref = useRef();
  const velocity = useRef({
    x: Math.random() * 0.05,
    y: Math.random() * 0.1,
    z: Math.random() * 0.02,
  });
  const gravity = -0.001;

  const frames = useRef(0);
  useFrame(() => {
    let position = ref.current.position;
    let velocityVector = new THREE.Vector3(velocity.current.x, velocity.current.y, velocity.current.z);

    velocity.current.y += gravity;

    position.x += velocity.current.x;
    position.y += velocity.current.y;
    position.z += velocity.current.z;

    if (!velocityVector.equals(new THREE.Vector3(0, 0, 0))) {
      const alignmentQuaternion = new THREE.Quaternion();
      alignmentQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), velocityVector.normalize());
      ref.current.quaternion.slerp(alignmentQuaternion, 0.1);
    }

    if (frames.current > Math.floor(Math.random() * (150 - 100)) + 100 ) {
      position.set(0.6, 0.05, 0.5);
      velocity.current = {
        x: Math.random() * 0.05,
        y: Math.random() * 0.1,
        z: Math.random() * 0.02,
      };
      frames.current = 0;
    }

    ref.current.position.set(position.x, position.y, position.z);

    frames.current++;
    console.log(frames.current)
  });

  return (
    <mesh ref={ref} position={[0.6, 0.05, 0.5]} scale={[scale, scale * 20, scale]}>
      <sphereGeometry args={[0.01, 16, 16]} />
      <meshStandardMaterial
        emissive={turboColor}
        toneMapped={false}
        emissiveIntensity={10}
      />
    </mesh>
  );
};
