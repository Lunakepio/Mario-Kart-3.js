import { InstancedMesh2 } from '@three.ez/instanced-mesh';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { PlaneGeometry, Vector3, Euler, MeshPhongMaterial, FrontSide, Quaternion } from 'three';
import { useGameStore } from '../../store';

extend({ InstancedMesh2 });

export const Skid = () => {
  const ref = useRef(null);
  const lifeTime = 10;
  const size = 0.3;
  const minDistance = 0.1;

  const lastLeftPos = useRef(new Vector3());
  const lastRightPos = useRef(new Vector3());
  const wasSpinning = useRef(false);

  const geometry = useMemo(() => new PlaneGeometry(size, size), [size]);
  const material = useMemo(() => new MeshPhongMaterial({ color: 0x878787, side: FrontSide}), []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const wheelPositions = useGameStore.getState().wheelPositions
    if (!wheelPositions) return;
    const leftPos = wheelPositions[2];
    const rightPos = wheelPositions[3]
    const worldQuat = wheelPositions[4].getWorldQuaternion(new Quaternion());

    const isSpinning = wheelPositions[4].isDrifting;
    if (leftPos.y !== rightPos.y) return;

    if (isSpinning) {
      if (!wasSpinning.current) {
        lastLeftPos.current.copy(leftPos);
        lastRightPos.current.copy(rightPos);
      }

      const leftDistance = leftPos.distanceTo(lastLeftPos.current);
      const rightDistance = rightPos.distanceTo(lastRightPos.current);
      const maxDist = Math.max(leftDistance, rightDistance);

      if (maxDist > minDistance) {
        const steps = Math.ceil(maxDist / minDistance);
        for (let i = 0; i < steps; i++) {
          const factor = (i / steps) + 5;
          const interpolatedLeft = lastLeftPos.current.clone().lerp(leftPos, factor);
          const interpolatedRight = lastRightPos.current.clone().lerp(rightPos, factor);

          ref.current.addInstances(2, (obj, index) => {
            obj.position.copy(index % 2 === 0 ? interpolatedLeft : interpolatedRight);
            obj.position.y -= 0.22;
            obj.quaternion.copy(worldQuat);
            obj.rotateX(-Math.PI / 2);

            obj.currentTime = 0;
          });
        }
      }

      lastLeftPos.current.copy(leftPos);
      lastRightPos.current.copy(rightPos);
      wasSpinning.current = true;
    } else {
      wasSpinning.current = false;
    }


    ref.current.updateInstances((obj) => {
      obj.currentTime += delta;
      if (obj.currentTime >= lifeTime) obj.remove();
    });
  });

  return <instancedMesh2 layers={1} renderOrder={1} ref={ref} args={[geometry, material, { createEntities: true }]} frustumCulled={false} />;
};