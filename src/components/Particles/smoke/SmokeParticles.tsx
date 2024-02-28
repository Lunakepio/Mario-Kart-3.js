import { SmokeParticle } from "./SmokeParticle";

export const SmokeParticles = ({ driftRight, driftLeft }) => {


  return (
    <group>
      <SmokeParticle
        position={[-0.6, 0.05, 0.5]}
        png="./particles/fire_02.png"
        leftDrift={driftLeft}
        rightDrift={driftRight}
        delay={200}
      />
      <SmokeParticle
        position={[0.6, 0.05, 0.5]}
        png="./particles/fire_01.png"
        leftDrift={driftLeft}
        rightDrift={driftRight}
        delay={200}
      />
    </group>
  );
};
