import { Euler, Object3D, BackSide, Vector3 } from "three";
import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "./store";

const o = new Object3D();

export function Skid({ count = 500, opacity = 1, size = 0.4 }) {
  const ref = useRef(null);
  const [bodyPosition, bodyRotation] = useStore((state) => [
    state.bodyPosition,
    state.bodyRotation,
  ]);

  let index = 0;
  useFrame(() => {
    // console.log(bodyPosition, bodyRotation);
    if (ref.current && bodyPosition && bodyRotation !== undefined) {
      setItemAt(ref.current, bodyPosition, bodyRotation, index++);
      if (index === count) index = 0;
    }
  });

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.geometry.rotateX(-Math.PI / 2);
      return () => {
        ref.current.geometry.rotateX(Math.PI / 2);
      };
    }
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[size, size * 2]} />
      <meshBasicMaterial
        color={0x000000}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={BackSide}
      />
    </instancedMesh>
  );
}

function setItemAt(instances, bodyPosition, bodyRotation, index) {
  // Calculate the backward offset
  const backwardOffset = 0.5; // Adjust this value as needed
  const forwardDirection = new Vector3(
    -Math.sin(bodyRotation),
    0,
    -Math.cos(bodyRotation)
  );
  const backwardPosition = forwardDirection
    .multiplyScalar(-backwardOffset)
    .add(bodyPosition);

  // Apply the offset to position the skid marks behind the body
  console.log(bodyPosition);
  o.position.copy(bodyPosition.x, bodyPosition.y + 2, bodyPosition.z);

  o.rotation.set(0, bodyRotation, 0);
  o.scale.setScalar(1);
  o.updateMatrix();
  instances.setMatrixAt(index, o.matrix);
  instances.instanceMatrix.needsUpdate = true;
}
