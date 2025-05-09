import { useRef, forwardRef, useImperativeHandle } from "react";
import { AdditiveBlending } from "three";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";



export const Spark = forwardRef((props, ref) => {
  const texture = useTexture("./textures/particles/spark.png");
  const materialRef = useRef();
  const meshRef = useRef();

  // useFrame((state) => {
  //   if (materialRef.current) {
  //     materialRef.current.uTime = state.clock.getElapsedTime() * 5;
  //   }
  // });
  

  const scaleTarget = 0.3
  
  const animateParticle = () => {
    if (materialRef.current) {
      gsap.to(materialRef.current, {
        duration: 0.05,
        opacity: 1,
        onComplete: () => {
          gsap.to(materialRef.current, {
            duration: 0.1,
            delay: 0.1,
            opacity: 0.0,
            // delay: 0.2
          });
        }
      });
      gsap.to(meshRef.current.scale,{
        duration: 0.2,
        x: scaleTarget,
        y: scaleTarget,
        z: scaleTarget,
        onComplete: () => {
          gsap.set(meshRef.current.scale,{
            x: 0,
            y: 0,
            z: 0,
            delay: 0.5  
          })
        }
      })
    }
  };

  useImperativeHandle(ref, () => ({
    emit: () => {
        animateParticle();
    },
    setColor: (newColor) => {
      if (materialRef.current) {
        materialRef.current.color = newColor.multiplyScalar(12);
      }
    },
    mesh: meshRef,
  }));

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={0} >
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={AdditiveBlending}
        opacity={0}
      />
    </mesh>
  );
});
