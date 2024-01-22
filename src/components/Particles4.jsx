import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";

export const Particles4 = ({ turboColor, scale, ...props }) => {
  const ref = useRef();
  const frame = useRef(0);

  const velocity = useRef({
    x: Math.random() * 0.1,
    y: Math.random() * 0.2,
    z: Math.random() * 0.05,
  });
  const gravity = -0.003;

  useFrame(() => {
    frame.current += 1;
    let position = ref.current.position;

    velocity.current.y += gravity;

    position.x += velocity.current.x;
    position.y += velocity.current.y;
    position.z += velocity.current.z;

    if (position.y < 0) {
      position.set(0.6, 0.05, 0.5);
      velocity.current = {
        x: Math.random() * 0.1,
        y: Math.random() * 0.1,
        z: Math.random() * 0.05,
      };
    }

    ref.current.position.set(position.x, position.y, position.z);
  });

  return (
    <mesh ref={ref} position={[0.6, 0.05, 0.5]} scale={scale}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial
        emissive={turboColor}
        toneMapped={false}
        emissiveIntensity={50}
      />
    </mesh>
  );
};
