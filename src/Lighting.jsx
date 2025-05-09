import { Environment } from "@react-three/drei";
import { useRef } from "react";
import { useGameStore } from "./store";
import { useFrame } from "@react-three/fiber";

export const Lighting = () => {
  const directionalLight = useRef(null)
  
  useFrame(() => {

        const playerPosition = useGameStore.getState().playerPosition;
        if (!playerPosition && !directionalLight.current) return;
    
        if(playerPosition){
        directionalLight.current.position.x = playerPosition.x - 5;
        directionalLight.current.target.position.x = playerPosition.x;
    
        directionalLight.current.position.y = playerPosition.y + 30;
        directionalLight.current.target.position.y = playerPosition.y;
    
        directionalLight.current.position.z = playerPosition.z - 40;
        directionalLight.current.target.position.z = playerPosition.z;
    
        directionalLight.current.target.updateMatrixWorld();
        }
  })
  
  return (
    <>
      <ambientLight intensity={0.} />
      <directionalLight
            castShadow
            ref={directionalLight}
            position={[0, 0, 0]}
            intensity={1}
            color={"#FFFFFF"}
            // shadow-normalBias={0.04}
            shadow-bias={-0.001}
            shadow-mapSize={[4096, 4096]}
            // layers={1}
            
          >
            <orthographicCamera
              attach="shadow-camera"
              near={1}
              far={100}
              top={100}
              right={100}
              left={-100}
              bottom={-100}
            >
              {/* <Helper type={CameraHelper} /> */}
            </orthographicCamera>
          </directionalLight>
          <Environment preset="apartment"  background backgroundBlurriness={1}/>
    </>
  );
};
