import { BallCollider, RigidBody, useRapier, vec3 } from "@react-three/rapier"
import { Kart } from "./models/Kart"
import { PerspectiveCamera, useKeyboardControls, OrbitControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react";
import { Vector3, Quaternion } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { getDriftLevel, kartSettings } from "./constants";
import { useGameStore } from "./store";

export const PlayerController = () => {
  const rbRef = useRef(null);
  const playerRef = useRef(null);
  const cameraGroupRef = useRef(null);
  const cameraLookAtRef = useRef(null);
  const kartRef = useRef(null);
  const cameraRef = useRef(null);
  const groundRef = useRef(0);
  const jumpIsHeld = useRef(false);
  const driftDirections = {
    none : 0,
    left : 1.2,
    right: -1.2
  }
  const driftDirection = useRef(driftDirections.none);
  const driftPower = useRef(0);
  const turbo = useRef(0);
  
  const [, get] = useKeyboardControls();
  const { world, rapier } = useRapier();
  
  const speedRef = useRef(0);
  const rotationSpeedRef = useRef(0);
  const smoothedDirectionRef = useRef(new Vector3(0, 0, -1));
  
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setBoostPower = useGameStore((state) => state.setBoostPower);
  
  function updateSpeed(forward, backward, delta) {
    speedRef.current = lerp(speedRef.current, kartSettings.speed.max * Number(forward) + kartSettings.speed.min * Number(backward), 1.5 * delta);
  }
  
  function groundRaycast(position) {
    const ray = new rapier.Ray(position, {
      x: 0,
      y: -1,
      z: 0
    });
  
    const raycastResult = world.castRayAndGetNormal(
      ray,
      1,
      false,
      undefined,
      undefined,
      undefined,
      position,
    );
  
    if (raycastResult) {
      groundRef.current = raycastResult;

  

      // if (testRef.current) {
      //   testRef.current.quaternion.slerp(quaternion, 0.1);
      // }
    }
  }

  
  function rotatePlayer(left, right, player, delta) {
    const inputTurn = (Number(left) - Number(right) + driftDirection.current) * 0.1;
  
    rotationSpeedRef.current = lerp(rotationSpeedRef.current, inputTurn, 8 * delta);
    const targetRotation = player.rotation.y + rotationSpeedRef.current * speedRef.current / (kartSettings.speed.max ) ;
  
    player.rotation.y = lerp(player.rotation.y, targetRotation, 8 * delta);
  }
  
  function jumpPlayer(spaceKey, left, right, rb){
    if(spaceKey && !jumpIsHeld.current){
      rb.applyImpulse({ x: 0, y: 45, z: 0 }, true);
      jumpIsHeld.current = true;
      driftDirection.current = left ? driftDirections.left : right ? driftDirections.right : driftDirections.none;
    }

    
    if(!spaceKey){
      jumpIsHeld.current = false;
      driftDirection.current = driftDirections.none;
      driftPower.current = 0;
    }
  }
  
  function driftPlayer(delta){
    if(driftDirection.current !== driftDirections.none){
      driftPower.current += delta;
    }
  }

  function updatePlayer(rigidBody, player, speed, camera, kart, delta) {

    const desiredDirection = new Vector3(
      -Math.sin(player.rotation.y),
      0,
      -Math.cos(player.rotation.y)
    );

    smoothedDirectionRef.current.lerp(desiredDirection, 8 * delta);
    const dir = smoothedDirectionRef.current;
    
      const angle = Math.atan2(
        desiredDirection.x * dir.z - desiredDirection.z * dir.x,
        desiredDirection.x * dir.x + desiredDirection.z * dir.z
      );
    

      // cameraGroup.rotation.y = lerp(cameraGroup.rotation.y, angle * 0.4, 10 * delta);
    kart.rotation.y = lerp(kart.rotation.y, angle * 1.3 + driftDirection.current * 0.1, 6 * delta);
  

    camera.lookAt(cameraLookAtRef.current.getWorldPosition(new Vector3()));
    const direction = smoothedDirectionRef.current;
    const rbPosition = rigidBody.translation();
  
    rigidBody.setLinvel({
      x: direction.x * speed,
      y: rigidBody.linvel().y,
      z: direction.z * speed,
    });
  
    player.position.lerp(vec3(rbPosition), 30 * delta);
    setPlayerPosition(player.position);
  }

  
  useFrame((state, delta)=>{
    if(!playerRef.current && !rbRef.current) return;
    const player = playerRef.current;
    const rb = rbRef.current;
    const cameraGroup = cameraGroupRef.current;
    const kart = kartRef.current;
    
    if(!player || !rb || !cameraGroup || !kart) return;   
    const { forward, backward, left, right, jump } = get();
    updateSpeed(forward, backward, delta); 
    rotatePlayer(left, right, player, delta);
    updatePlayer(rb, player, speedRef.current, cameraRef.current, kart, delta);
    jumpPlayer(jump, left, right, rb);
    driftPlayer(delta);
    groundRaycast(rbRef.current.translation());  
  })
  
  return(
    <>
      <group >

      </group>
      <RigidBody 
        ref={rbRef} colliders={'false'} ccd={true} canSleep={false}>
        <BallCollider args={[1]}  />

      </RigidBody>
    <group ref={playerRef}>
      <group ref={cameraGroupRef}>
        <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 4, 15]} />
      </group>

      <group ref={kartRef}>
      
          <Kart speed={speedRef} driftDirection={driftDirection} driftPower={driftPower} />

        <group ref={cameraLookAtRef} position={[0,0,-3]}>
          {/* <mesh>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial/>
          </mesh> */}
        </group>
      </group>
    </group>

    {/* <OrbitControls/> */}
    </>
  )
}
