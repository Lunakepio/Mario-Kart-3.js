import { Billboard, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { AdditiveBlending, Color } from "three";
import { Spark } from "../Spark";
import { lerp } from "three/src/math/MathUtils.js";
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';


export const Glow = forwardRef(({ driftDirection }, ref) => {
  const materialRef = useRef(null);
  const sparkRef = useRef(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    
      materialRef.current.uniforms.xDisplacement.value = -(driftDirection.current) * 0.3;
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
      setLevel: (level) => {
        materialRef.current.uniforms.level.value = level;
      },
      setOpacity: (newOpacity) => {
        if (materialRef.current) {
          materialRef.current.uniforms.opacity.value = newOpacity;
        }
      },
    };
  });
  

  const size = 0.1;

  return (
    <Billboard layers={1}>
      <mesh layers={1}>
        <circleGeometry args={[size, 22]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            time: { value: 0 },
            color: { value: new Color(0xffffff) },
            level: { value: 0 },
            opacity: { value: 1 },
            timeOffset: { value: Math.random() * 3},
            xDisplacement: { value: 0 },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <Spark ref={sparkRef}/>
    </Billboard>
  );
});
