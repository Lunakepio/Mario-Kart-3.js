import { PlayerController } from "./PlayerController";
import { Grid } from "@react-three/drei";
import { Track } from "./models/Track";
import Flames from "./particles/drift/flames/Flames";
import VFXEmitter from "./wawa-vfx/VFXEmitter";

export const TrackScene = () => {
  return (
    <>
      <PlayerController />
      <Track />


      <Flames />

      {/* <Grid position={[0, -1.99, 0]} infiniteGrid/> */}
    </>
  );
};
