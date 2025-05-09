import { RigidBody } from "@react-three/rapier";
import { PlayerController } from "./PlayerController";
import { Grid } from "@react-three/drei";
import { Track } from "./Track";
import Flames from "./particles/drift/flames/Flames";

export const TrackScene = () => {
  return (
    <>
      <PlayerController />
      <Track />

      <RigidBody type="fixed" restitution={0}>
        <mesh position-y={-2} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[1000, 1000]}/>
          <meshBasicMaterial color={0x000000} transparent opacity={0}/>
        </mesh>
      </RigidBody>
      <Flames/>
    
    
    {/* <Grid position={[0, -1.99, 0]} infiniteGrid/> */}
    </>
  );
}
