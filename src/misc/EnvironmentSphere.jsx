import { Billboard, Environment, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import { BackSide, Color, DoubleSide } from "three";

export const EnvironmentSphere = () => {
const color1 = "#B3ECFF";
const color2 = "#1461C5";

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    void main() {
      vWorldNormal = normalize(normalMatrix * normal);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float exposure;
    varying vec3 vWorldNormal;
    
    vec3 toneMap(vec3 color) {
      return vec3(1.0) - exp(-color * exposure);
    }
    
    void main() {
      vec2 uv = vUv;
      float t = smoothstep(-1., 1., vWorldNormal.y);
      vec3 color = mix(color1, color2, t);
    
      color *= 6.;
    
    
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  
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
    <Environment preset={'warehouse'}>
      <mesh scale={100} position={[450,300, -1000]}>
        <planeGeometry args={[1, 1]}/>
        <meshBasicMaterial color={new Color(0xFCEAC9).multiplyScalar(5000)} map={sunTexture} transparent depthWrite={false} />
      </mesh>
      {/* <mesh
        position={[0, 0, 0]}
        scale={[1200, 1200, 1200]}
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
          side={BackSide}
          toneMapped={false}
        />
      </mesh> */}
     
    </Environment>
    </>
  );
};
