import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Color } from "three";
import { Spark } from "./Spark";


export const Glow = forwardRef((props, ref) => {
  const materialRef = useRef(null);
  const sparkRef = useRef(null);

  const vertexShader = /* glsl */ `
    uniform float time;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      float scale = 1.0 + 0.1 * sin(time * 105.0);
      vec3 scaledPosition = position * scale;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float time;
    uniform vec3 color;
    uniform float opacity;
    varying vec2 vUv;

    void main() {
      vec3 lightColor = color;
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      float start = 0.0;
      float end = 0.5;
      float fade = smoothstep(end, start, dist);
      float colorScalar = 3.0;
      gl_FragColor = vec4(lightColor * (colorScalar * fade), fade * opacity * 0.3);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  useImperativeHandle(ref, () => {
    let prevColor = new Color(0xffffff);
  
    return {
      setColor: (newColor) => {
        const newCol = new Color(newColor);
  
        if (!newCol.equals(prevColor)) {
          prevColor.copy(newCol);
          materialRef.current.uniforms.color.value.copy(newCol);
  
          const isWhite = newCol.r === 1 && newCol.g === 1 && newCol.b === 1;
          if (!isWhite) {
            sparkRef.current?.setColor(newCol);
            sparkRef.current?.emit();
          }
        }
      },
      setOpacity: (newOpacity) => {
        if (materialRef.current) {
          materialRef.current.uniforms.opacity.value = newOpacity;
        }
      },
    };
  });
  

  const size = 1;

  return (
    <Billboard>
      <mesh>
        <planeGeometry args={[size, size]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            time: { value: 0 },
            color: { value: new Color(0xffffff) },
            opacity: { value: 1. },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
        />
      </mesh>
      <Spark ref={sparkRef}/>
    </Billboard>
  );
});
