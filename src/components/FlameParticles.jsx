import { FlameParticle } from "./FlameParticle";

export const FlameParticles = ({ isBoosting }) => {


  return (
    <group>
      {/* bottom left */}
      <group position={[-0.26, 0.45, 1]}>
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={0}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={100}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={200}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={300}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={400}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={500}
        />
      </group>

      {/* bottom right */}
      <group position={[0.26, 0.45, 1]}>
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={0}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={100}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={200}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={300}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={400}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={500}
        />
      </group>
      {/* top left */}
      <group position={[-0.18, 0.6, 0.8]}>
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={0}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={100}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={200}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={300}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={400}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={500}
        />
      </group>
      <group position={[0.18, 0.6, 0.8]}>
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={0}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={100}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={200}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={300}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_02.png"
          isBoosting={isBoosting}
          delay={400}
        />
        <FlameParticle
          position={[0, 0, 0]}
          png="./fire_01.png"
          isBoosting={isBoosting}
          delay={500}
        />
      </group>
    </group>
  );
};
