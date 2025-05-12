import { Kart } from "./models/Kart"
import { PerspectiveCamera, useKeyboardControls, OrbitControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react";
import { Vector3, Quaternion } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { kartSettings } from "./constants";
import { useGameStore } from "./store";

export const PlayerController = () => {
  const rbRef = useRef(null);
  const playerRef = useRef(null);
  const cameraGroupRef = useRef(null);
  const cameraLookAtRef = useRef(null);
  const kartRef = useRef(null);
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
  
  const speedRef = useRef(0);
  const rotationSpeedRef = useRef(0);
  const smoothedDirectionRef = useRef(new Vector3(0, 0, -1));
  
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setIsBoosting = useGameStore((state) => state.setIsBoosting);
  
  function updateSpeed(forward, backward, delta) {
    const maxSpeed = kartSettings.speed.max + (turbo.current > 0 ? 40 : 0);
    maxSpeed > kartSettings.speed.max ? setIsBoosting(true) : setIsBoosting(false);
    speedRef.current = lerp(speedRef.current, maxSpeed * Number(forward) + kartSettings.speed.min * Number(backward), 1.5 * delta);
    turbo.current -= delta;

  }
  
  function rotatePlayer(left, right, player, delta) {
    const inputTurn = (Number(left) - Number(right) + driftDirection.current) * 0.1;
  
    rotationSpeedRef.current = lerp(rotationSpeedRef.current, inputTurn, 8 * delta);
    const targetRotation = player.rotation.y + rotationSpeedRef.current * (speedRef.current > 40 ? 40 : speedRef.current) / (kartSettings.speed.max ) ;
  
    player.rotation.y = lerp(player.rotation.y, targetRotation, 8 * delta);
  }
  
  function jumpPlayer(spaceKey, left, right, ){
    if(spaceKey && !jumpIsHeld.current){
      // rb.applyImpulse({ x: 0, y: 45, z: 0 }, true);
      jumpIsHeld.current = true;
      driftDirection.current = left ? driftDirections.left : right ? driftDirections.right : driftDirections.none;
    }

    
    if(!spaceKey){
      jumpIsHeld.current = false;
      if(turbo.current <= 0){
        turbo.current = useGameStore.getState().boostPower ? useGameStore.getState().boostPower : 0 ;
      }
      driftDirection.current = driftDirections.none;
      driftPower.current = 0;
    }
  }
  
  function driftPlayer(delta){
    if(driftDirection.current !== driftDirections.none){
      driftPower.current += delta;
    }
  }

  function updatePlayer( player, speed, camera, kart, delta) {

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
    

    kart.rotation.y = lerp(kart.rotation.y, angle * 1.3 + driftDirection.current * 0.1, 6 * delta);
  

    camera.lookAt(cameraLookAtRef.current.getWorldPosition(new Vector3()));
    camera.position.lerp(cameraGroupRef.current.getWorldPosition(new Vector3()), 8 * delta);
    const direction = smoothedDirectionRef.current;


    player.position.x += direction.x * speed * delta;
    player.position.z += direction.z * speed * delta;
  
    setPlayerPosition(player.position);
  }

  
  useFrame((state, delta)=>{
    if(!playerRef.current && !rbRef.current) return;
    const player = playerRef.current;
    const cameraGroup = cameraGroupRef.current;
    const kart = kartRef.current;
    const camera = state.camera
    
    if(!player || !cameraGroup || !kart) return;   
    const { forward, backward, left, right, jump } = get();
    updateSpeed(forward, backward, delta); 
    rotatePlayer(left, right, player, delta);
    updatePlayer(player, speedRef.current, camera, kart, delta);
    jumpPlayer(jump, left, right);
    driftPlayer(delta);

  })
  
  return(
    <>
      <group >

      </group>
    <group ref={playerRef}>
      <group ref={cameraGroupRef} position={[0, 2, 5]} >
      </group>

      <group ref={kartRef}>
      
          <Kart speed={speedRef} driftDirection={driftDirection} driftPower={driftPower} />

        <group ref={cameraLookAtRef} position={[0,0,-3]}>

        </group>
      </group>
    </group>

    {/* <OrbitControls/> */}
    </>
  )
}
