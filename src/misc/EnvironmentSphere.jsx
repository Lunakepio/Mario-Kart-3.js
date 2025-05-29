import { Environment, useTexture } from "@react-three/drei";
import { Color, DoubleSide } from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

export const EnvironmentSphere = () => {
const color1 = "#9bdbd9";
const color2 = "#137aff";
  
  const sunTexture = useTexture('/textures/sun.png')

  return (
    <> <mesh
        position={[0, 0, 0]}
        scale={[2000, 2000, 2000]}
        rotation={[0, 0, 0]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            color1: { value: new Color(color1) },
            color2: { value: new Color(color2) },
          }}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
        <mesh scale={100} position={[450,300, -1000]}>
          <planeGeometry args={[1, 1]}/>
          <meshBasicMaterial color={new Color(0xFCEAC9).multiplyScalar(100)} map={sunTexture} transparent depthWrite={false} />
        </mesh>
    <Environment preset={'apartment'}>
      <mesh scale={100} position={[450,300, -1000]}>
        <planeGeometry args={[1, 1]}/>
        <meshBasicMaterial color={new Color(0xFCEAC9).multiplyScalar(5000)} map={sunTexture} transparent depthWrite={false} />
      </mesh>
    </Environment>
    </>
  );
};
