import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Lightformer,
  Bvh,
} from "@react-three/drei";
import { Ground } from "./Ground";
import { PlayerController } from "./PlayerController";
import { PlayerControllerGamepad } from "./PlayerControllerGamepad";
import { PlayerControllerKeyboard } from "./PlayerControllerKeyboard";
import { PlayerControllerTouch } from "./PlayerControllerTouch";
import { Paris } from "./models/tracks/Tour_paris_promenade";
import {
  EffectComposer,
  N8AO,
  Bloom,
  TiltShift2,
  HueSaturation,
  SMAA,
  ChromaticAberration,
  Vignette,
  LUT,
} from "@react-three/postprocessing";
import { Banana } from "./models/items/Banana_peel_mario_kart";
import { ItemBox } from "./models/misc/Gift";
import { useStore } from "./store";
import { Shell } from "./models/items/Mario_shell_red";
import { Coin } from "./models/misc/Super_mario_bros_coin";
import {
  RPC,
  getState,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { PlayerDummies } from "./PlayerDummies";
import { useEffect, useState, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { LUTPass, LUTCubeLoader } from "three-stdlib";
import { useCurvedPathPoints } from "./useCurvedPath";
import { ParisBis } from "./models/tracks/Paris-bis";
import { Skid } from "./Skid";
import { Dust } from "./Dust";

export const Experience = () => {
  const onCollide = (event) => {};
  const { gameStarted, bananas, shells, players, id, actions, controls } =
    useStore();
  const [networkBananas, setNetworkBananas] = useMultiplayerState(
    "bananas",
    []
  );

  const { points, loading, error } = useCurvedPathPoints("./CurvedPath.json");

  const [networkShells, setNetworkShells] = useMultiplayerState("shells", []);
  const [pointest, setPointest] = useState([]);
  const [currentPoint, setCurrentPoint] = useState(0);
  useEffect(() => {
    if (points) {
      //This is adjusted to Paris scale
      const scaledPoints = points.map((point) => ({
        x: point.x * 50,
        y: point.y * 50,
        z: point.z * 50,
      }));
      setPointest(scaledPoints.reverse());
    }
  }, [points]);

  const testing = getState("bananas");
  const cam = useRef();
  const lookAtTarget = useRef();
  // useEffect(() => {
  //   setNetworkBananas(bananas);
  // }, [bananas]);

  // useEffect(() => {
  //   setNetworkShells(shells);
  // }, [shells]);
  const speedFactor = 5;
  const { texture } = useLoader(LUTCubeLoader, "./cubicle-99.CUBE");
  useFrame((state, delta) => {
    if (!gameStarted) {
      const camera = cam.current;

      if (currentPoint < pointest.length - 1) {
        camera.position.lerp(pointest[currentPoint], delta * speedFactor);
        lookAtTarget.current.position.lerp(
          pointest[currentPoint + 1],
          delta * speedFactor
        );
        camera.lookAt(lookAtTarget.current.position);

        if (camera.position.distanceTo(pointest[currentPoint]) < 5) {
          setCurrentPoint(currentPoint + 1);
        }
      } else {
        setCurrentPoint(0);
      }
    }
  });

  return (
    <>
      {gameStarted &&
        players.map((player) => {
          const ControllerComponent =
            controls === "keyboard"
              ? PlayerControllerKeyboard
              : controls === "gamepad"
              ? PlayerControllerGamepad
              : controls === "touch"
              ? PlayerControllerTouch
              : PlayerController;

          return (
            <ControllerComponent
              key={player.id}
              player={player}
              userPlayer={player.id === myPlayer()?.id}
              setNetworkBananas={setNetworkBananas}
              setNetworkShells={setNetworkShells}
              networkBananas={networkBananas}
              networkShells={networkShells}
            />
          );
        })}
      {gameStarted &&
        players.map((player) => (
          <PlayerDummies
            key={player.id}
            player={player}
            userPlayer={player.id === myPlayer()?.id}
          />
        ))}
      {!gameStarted && (
        <>
          <mesh ref={lookAtTarget}></mesh>
          <PerspectiveCamera
            ref={cam}
            makeDefault
            position={[0, 2, 0]}
            far={5000}
          />
        </>
      )}
      {/* <Paris position={[0, 0, 0]} /> */}

      <ParisBis position={[0, 0, 0]} />
      <ItemBox position={[-20, 2.5, -119]} />
      <Coin position={[-30, 2, -119]} />
      <Skid />
      <Dust />

      <Ground position={[0, 0, 0]} />
      <Environment resolution={256} preset="lobby" />
      {networkBananas.map((banana) => (
        <Banana
          key={banana.id}
          position={banana.position}
          setNetworkBananas={setNetworkBananas}
          networkBananas={networkBananas}
          id={banana.id}
        />
      ))}
      {networkShells.map((shell) => (
        <Shell
          key={shell.id}
          id={shell.id}
          position={shell.position}
          rotation={shell.rotation}
          setNetworkShells={setNetworkShells}
          networkShells={networkShells}
        />
      ))}

      <directionalLight
        position={[10, 50, -30]}
        intensity={1}
        shadow-bias={-0.0001}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}
        castShadow
      />

      <EffectComposer
        multisampling={0}
        disableNormalPass
        disableSSAO
        disableDepthPass
      >
        <SMAA />
        {/* <N8AO distanceFalloff={1} aoRadius={1} intensity={3} /> */}
        <Bloom
          luminanceThreshold={0}
          mipmapBlur
          luminanceSmoothing={0.01}
          intensity={0.5}
        />
        <TiltShift2 />
        {/* <ChromaticAberration offset={[0.0006, 0.0006]} /> */}
        <HueSaturation saturation={0.05} />
        {/* <Vignette eskil={false} offset={0.1} darkness={0.4} /> */}
      </EffectComposer>
    </>
  );
};
