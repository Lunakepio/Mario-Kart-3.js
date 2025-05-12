import VFXEmitter from "../wawa-vfx/VFXEmitter";
import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

export const Dust = forwardRef(({ position }, ref) => {
  const dustRef = useRef(null);
  const groupRef = useRef(null);

  useImperativeHandle(ref, () => ({
    start: () => dustRef.current?.startEmitting(),
    stop: () => dustRef.current?.stopEmitting(),
    setPosition: (pos) => {

        groupRef.current.position.copy(pos);
      
    },
  }));

  useEffect(() => {
    if (groupRef.current.position && position) {
      groupRef.current.position.copy(position);
    }
  }, [position]);

  return (
    <group ref={groupRef} layers={1}>
    <VFXEmitter
      ref={dustRef}
      emitter="dust"
      settings={{
        duration: 0.02,
        delay: 0.1,
        nbParticles: 1,
        spawnMode: "time",
        loop: true,
        startPositionMin: [0, 0, 0],
        startPositionMax: [0, 0, 0],
        startRotationMin: [0, 0, -1],
        startRotationMax: [0, 0, 1],
        particlesLifetime: [0.2, 0.7],
        speed: [0, 0],
        colorStart: "#B2996E",
        colorEnd: "#352C1C",
        directionMin: [0, 0, 0],
        directionMax: [0, 0, 0],
        rotationSpeedMin: [0, 0, -1],
        rotationSpeedMax: [0, 0, 1],
        size: [0.5, 1],
      }}
    />
    </group>
  );
});

