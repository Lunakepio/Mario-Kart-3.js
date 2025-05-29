import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import { AdditiveBlending, Color, ShaderMaterial } from "three";
import { Spark } from "../Spark";
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import { useGameStore } from "../../../store";


export const Glow = forwardRef(({ driftDirection }, ref) => {
  const materialRef = useRef(null);
  const sparkRef = useRef(null);
  let noiseTexture = null;
  
  const material = useMemo(() => new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new Color(0xffffff)},
      level: { value: 2 },
      opacity: { value: 1 },
      timeOffset: { value: Math.random() * 3},
      xDisplacement: { value: 0 },
      noiseTexture: { value : null}
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending:AdditiveBlending
  }), [])
  
  useFrame((state) => {
    if (material) {
      material.uniforms.time.value = state.clock.getElapsedTime() * 1.3;
    
      material.uniforms.xDisplacement.value = -(driftDirection.current) * 0.3;
      if(noiseTexture === null){
        noiseTexture = useGameStore.getState().noiseTexture;
        material.uniforms.noiseTexture.value = noiseTexture;
        
      }
    }
    
  });

  useImperativeHandle(ref, () => {
    let prevColor = new Color(0xffffff);
  
    return {
      setColor: (newColor) => {
        const newCol = new Color(newColor);
  
        if (!newCol.equals(prevColor)) {
          prevColor.copy(newCol);
          material.uniforms.color.value.copy(newCol);
  
          const isWhite = newCol.r === 1 && newCol.g === 1 && newCol.b === 1;
          if (!isWhite) {
            sparkRef.current?.setColor(newCol);
            sparkRef.current?.emit();
          }
        }
      },
      setLevel: (level) => {
        material.uniforms.level.value = level;
      },
      setOpacity: (newOpacity) => {
          material.uniforms.opacity.value = newOpacity;
      },
    };
  });
  

  const size = 0.1;

  return (
    <Billboard layers={1}>
      <mesh layers={1} material={material}>
        <circleGeometry args={[size, 22]} />
      </mesh>
      <Spark ref={sparkRef}/>
    </Billboard>
  );
});
