import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";

export function FrontLeftWheel({
  currentSpeed,
  left,
  right,
  ...props
}) {
  const { nodes, materials } = useGLTF("./models/front_wheel.glb");
  const wheel = useRef();


  useEffect(() => {
    if (!wheel.current) return;
    if(left){
      gsap.to(wheel.current.rotation, {
        duration: 0.5,
        y: Math.PI + Math.PI / 8,
        ease: "power2.inOut",
      });
      gsap.to(wheel.current.position, {
        duration: 0.5,
        z: 0.075,
        ease: "power2.inOut",
      });
    } else if(right){
      gsap.to(wheel.current.rotation, {
        duration: 0.5,
        y: Math.PI - Math.PI / 8,
        ease: "power2.inOut",
      });
      gsap.to(wheel.current.position, {
        duration: 0.5,
        z: -0.075,
        ease: "power2.inOut",
      });
    } else if(!left && !right){
      gsap.to(wheel.current.rotation, {
        duration: 0.2,
        y: Math.PI,
        ease: "power2.inOut",
      });
      gsap.to(wheel.current.position, {
        duration: 0.2,
        z: 0,
        ease: "power2.inOut",
      });
    }
    
  }, [left, right]);
  return (
    <group {...props} dispose={null}>
      <group ref={wheel}>
        <mesh
          geometry={nodes.FL_Wheel_Body_0001.geometry}
          material={materials.Body}
        />
        <mesh
          geometry={nodes.FL_Wheel_Rims_0001.geometry}
          material={materials.Rims}
        />
        <mesh
          geometry={nodes.FL_Wheel_Tires_0001.geometry}
          material={materials.Tires}
        />
      </group>
    </group>
  );
}

useGLTF.preload("./models/front_wheel.glb");