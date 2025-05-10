import { Dust } from "../particles/Dust";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const KartDust = ({ wheelStates }) => {
  const dustRefs = useRef([null, null, null, null]);

  useFrame(() => {
    wheelStates.forEach((wheel, i) => {
      const ref = dustRefs.current[i];
      if (!ref) return;

      console.log(wheel.position)
      const position = wheel.position;
      // position.y -= 0.5;
      ref.setPosition(position);
      if (wheel.shouldEmit) {
        ref.start();
      } else {
        ref.stop();
      }
    });
  })

  return (
    <>
      {wheelStates.map((wheel, i) => (
        <Dust key={i} ref={(el) => (dustRefs.current[i] = el)} />
      ))}
    </>
  );
};

