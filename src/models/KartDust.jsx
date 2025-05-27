import { Dust } from "../particles/Dust";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store";

export const KartDust = ({ wheelStates }) => {
  const dustRefs = useRef([null, null, null, null]);

  useFrame(() => {
    wheelStates.forEach((wheel, i) => {
      const ref = dustRefs.current[i];
      if (!ref) return;

      const position = wheel.position;
     
      ref.setPosition(position);
      useGameStore.getState().setIsOnDirt(wheel.shouldEmit);
      if (wheel.shouldEmit) {
        ref.start();
      } else {
        ref.stop();
      }
    });
  })

  return (
    <>
    <group layers={1} position-y={0.5}>
            {wheelStates.map((wheel, i) => (
        <Dust key={i} ref={(el) => (dustRefs.current[i] = el)} />
      ))}
    </group>
    </>
  );
};

