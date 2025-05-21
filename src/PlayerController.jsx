import { Kart } from "./models/Kart"
import { PerspectiveCamera, useKeyboardControls, OrbitControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react";
import { Vector3, Quaternion } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { kartSettings } from "./constants";
import { useGameStore } from "./store";
import { useEffect } from "react";
import gsap from "gsap";
import { useTouchScreen } from "./hooks/useTouchScreen";

export const PlayerController = () => {
  const rbRef = useRef(null);
  const playerRef = useRef(null);
  const cameraGroupRef = useRef(null);
  const cameraLookAtRef = useRef(null);
  const kartRef = useRef(null);
  const jumpIsHeld = useRef(false);
  const driftDirections = {
    none : 0,
    left : 1.4,
    right: -1.4
  }
  const jumpOffset = useRef(0);
  const driftDirection = useRef(driftDirections.none);
  const driftPower = useRef(0);
  const turbo = useRef(0);
  const isJumping = useRef(false);
  const backWheelOffset = useRef({
    left: 0,
    right: 0
  })
  
  const [, get] = useKeyboardControls();
  
  const speedRef = useRef(0);
  const rotationSpeedRef = useRef(0);
  const smoothedDirectionRef = useRef(new Vector3(0, 0, -1));
  
  const isTouchScreen = useTouchScreen();
  
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setIsBoosting = useGameStore((state) => state.setIsBoosting);
  const setSpeed = useGameStore((state) => state.setSpeed);
  
  const jumpAnim = (left, right) => {
      gsap.to(jumpOffset, {
        current: .3,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          isJumping.current = false;
          // driftDirection.current = left ? driftDirections.left : right ? driftDirections.right : driftDirections.none;
          setTimeout(() => {
            if(driftDirection.current !== 0){
              gsap.killTweensOf(backWheelOffset.current);
              gsap.to(backWheelOffset.current, {
                left: driftDirection.current === driftDirections.left ? 0.4 : 0,
                right: driftDirection.current === driftDirections.right ? 0.4 : 0,
                duration: 0.3,
                ease: "power4.out",
                onComplete:() => {
                  gsap.to(backWheelOffset.current, {
                    left: 0,
                    right: 0,
                    duration: 0.8,
                    ease: "bounce.out"
                  })
                }
        
              })
            }
          }, 100)
        }
      })
}

  
  function updateSpeed(forward, backward, delta) {
    const maxSpeed = kartSettings.speed.max + (turbo.current > 0 ? 40 : 0);
    maxSpeed > kartSettings.speed.max ? setIsBoosting(true) : setIsBoosting(false);
    const forwardAccel = Number(isTouchScreen || forward);
    speedRef.current = lerp(speedRef.current, maxSpeed * forwardAccel + kartSettings.speed.min * Number(backward), 1.5 * delta);
    setSpeed(speedRef.current);
    turbo.current -= delta;

  }
  
  function rotatePlayer(left, right, player, joystickX, delta) {
    const inputTurn = (-joystickX + (Number(left) - Number(right)) + driftDirection.current) * 0.1;
  
    rotationSpeedRef.current = lerp(rotationSpeedRef.current, inputTurn, 8 * delta);
    const targetRotation = player.rotation.y + rotationSpeedRef.current * (speedRef.current > 40 ? 40 : speedRef.current) / (kartSettings.speed.max ) ;
  
    player.rotation.y = lerp(player.rotation.y, targetRotation, 8 * delta);
  }
  
  function jumpPlayer(spaceKey, left, right, joystickX ){
    if(spaceKey && !jumpIsHeld.current && !isJumping.current){
      // rb.applyImpulse({ x: 0, y: 45, z: 0 }, true);
  
      jumpAnim(left, right);
      isJumping.current = true;
      jumpIsHeld.current = true;
      driftDirection.current = left || joystickX < 0 ? driftDirections.left : right || joystickX > 0 ? driftDirections.right : driftDirections.none;

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
    
    // const body = useGameStore.getState().body;
    // if(body){
    //   cameraGroupRef.current.position.y = lerp(cameraGroupRef.current.position.y, body.position.y + 2, 8 * delta);
    //   cameraLookAtRef.current.position.y = body.position.y;
    // }
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
    
    const joystick = useGameStore.getState().joystick;
    const jumpButtonPressed = useGameStore.getState().jumpButtonPressed;
  
    const { forward, backward, left, right, jump } = get();
    
    updateSpeed(forward, backward, delta); 
    rotatePlayer(left, right, player, joystick.x, delta);
    updatePlayer(player, speedRef.current, camera, kart, delta);
    const isJumpPressed = jumpButtonPressed || jump;
    jumpPlayer(isJumpPressed, left, right, joystick.x);
    driftPlayer(delta);

  })
  
  return(
    <>
      <group >

      </group>
    <group ref={playerRef}>
      <group ref={cameraGroupRef} position={[0, 2, 8]} >
      </group>

      <group ref={kartRef}>
      
          <Kart speed={speedRef} driftDirection={driftDirection} driftPower={driftPower} jumpOffset={jumpOffset} backWheelOffset={backWheelOffset} />

        <group ref={cameraLookAtRef} position={[0, -2,-9]}>

        </group>
      </group>
    </group>

    {/* <OrbitControls/> */}
    </>
  )
}
