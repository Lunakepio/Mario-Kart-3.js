import { Environment, Lightformer, Sky } from "@react-three/drei";
import { useRef } from "react";
import { useGameStore } from "../store";
import { useFrame } from "@react-three/fiber";
import { EnvironmentSphere } from "./EnvironmentSphere";
import { Helper } from "@react-three/drei";
import { CameraHelper } from "three";

export const Lighting = () => {
  const directionalLight = useRef(null)
  
  useFrame(() => {

        const playerPosition = useGameStore.getState().playerPosition;
        if (!playerPosition && !directionalLight.current) return;
    
        if(playerPosition){
        directionalLight.current.position.x = playerPosition.x + 2;
        directionalLight.current.target.position.x = playerPosition.x;
    
        directionalLight.current.position.y = playerPosition.y + 5;
        directionalLight.current.target.position.y = playerPosition.y;
    
        directionalLight.current.position.z = playerPosition.z + 2 ;
        directionalLight.current.target.position.z = playerPosition.z;
    
        directionalLight.current.target.updateMatrixWorld();
        }
  })
  
  return (
    <>
      <directionalLight
            castShadow
            ref={directionalLight}
            position={[0, 0, 0]}
            intensity={3}
            color={"#FFffff"}
            shadow-bias={-0.0001}
            shadow-mapSize={[2048, 2048]}
            // layers={1}
            
          >
            <orthographicCamera
              attach="shadow-camera"
              near={1}
              far={20}
              top={5}
              left={-5}
              right={5}
              bottom={-5}
            >
              {/* <Helper type={CameraHelper} /> */}
            </orthographicCamera>
          </directionalLight>
          {/* <directionalLight 
          position={[20, 20, -100]}
          color={"#FFA22B"}
          intensity={10}

          /> */}
            
          <EnvironmentSphere />
    </>
  );
};
