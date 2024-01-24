import { Euler, Object3D, Vector3, Matrix4 } from 'three';
import { useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { getState, mutation, useStore } from '../store';

const e = new Euler();
const m = new Matrix4();
const o = new Object3D();
const v = new Vector3();

export function Skid({ count = 500, opacity = 0.5, size = 0.4 }) {
  const ref = useRef(null);
  const [chassisBody, wheels] = useStore((state) => [state.chassisBody, state.wheels]);

  let brake;
  let index = 0;
  useFrame(() => {
    brake = getState().controls.brake;
    if (chassisBody.current && wheels[2].current && wheels[3].current && brake && mutation.speed > 10) {
      e.setFromRotationMatrix(m.extractRotation(chassisBody.current.matrix));
      setItemAt(ref.current, e, wheels[2].current, index++);
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
      <meshBasicMaterial color={0x4d4d4d} transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  );
}

function setItemAt(instances, rotation, wheel, index) {
  o.position.copy(wheel.getWorldPosition(v));
  o.rotation.copy(rotation);
  o.scale.setScalar(1);
  o.updateMatrix();
  instances.setMatrixAt(index, o.matrix);
  instances.instanceMatrix.needsUpdate = true;
}
