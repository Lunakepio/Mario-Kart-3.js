import { Kart } from "./models/Kart"
import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react";
import { Vector3 } from "three";
import { damp } from "three/src/math/MathUtils.js";
import { kartSettings } from "./constants";
import { useGameStore } from "./store";
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
  const gamepadRef = useRef(null);
  const inputTurn = useRef(0);
  
  const [, get] = useKeyboardControls();
  
  const speedRef = useRef(0);
  const rotationSpeedRef = useRef(0);
  const smoothedDirectionRef = useRef(new Vector3(0, 0, -1));
  
  const isTouchScreen = useTouchScreen();
  
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setIsBoosting = useGameStore((state) => state.setIsBoosting);
  const setSpeed = useGameStore((state) => state.setSpeed);

  const getGamepad = () => {
    if(navigator.getGamepads){
      const gamepads = navigator.getGamepads();
      if(gamepads.length > 0){
        gamepadRef.current = gamepads[0];
      }
    }
  }
  
  const jumpAnim = () => {
      gsap.to(jumpOffset, {
        current: .3,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          isJumping.current = false;
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

    const gamepadButtons = {
      forward: false,
      backward: false
    }
    
    if(gamepadRef.current){
      gamepadButtons.forward = gamepadRef.current.buttons[0].pressed;
      gamepadButtons.backward = gamepadRef.current.buttons[1].pressed;
    }
    const forwardAccel = Number(isTouchScreen && !gamepadRef.current || forward || gamepadButtons.forward);

    speedRef.current = damp(speedRef.current, maxSpeed * forwardAccel + kartSettings.speed.min * Number(backward || gamepadButtons.backward), 1.5, delta);
    setSpeed(speedRef.current);
    turbo.current -= delta;

  }
  
  function rotatePlayer(left, right, player, joystickX, delta) {
    const gamepadJoystick = {
      x: 0,
    }

    if(gamepadRef.current){
      gamepadJoystick.x = gamepadRef.current.axes[0];
    }

    inputTurn.current = (-gamepadJoystick.x -joystickX + (Number(left) - Number(right)) + driftDirection.current) * 0.1;
  
    rotationSpeedRef.current = damp(rotationSpeedRef.current, inputTurn.current, 8, delta);
    const targetRotation = player.rotation.y + rotationSpeedRef.current * (speedRef.current > 40 ? 40 : speedRef.current) / (kartSettings.speed.max ) ;
  
    player.rotation.y = damp(player.rotation.y, targetRotation, 8, delta);
  }
  
  function jumpPlayer(spaceKey, left, right, joystickX ){
    if(spaceKey && !jumpIsHeld.current && !isJumping.current){
      // rb.applyImpulse({ x: 0, y: 45, z: 0 }, true);
  
      jumpAnim();
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

    smoothedDirectionRef.current.lerp(desiredDirection, 12 * delta);
    const dir = smoothedDirectionRef.current;
    
      const angle = Math.atan2(
        desiredDirection.x * dir.z - desiredDirection.z * dir.x,
        desiredDirection.x * dir.x + desiredDirection.z * dir.z
      );
    

    kart.rotation.y = damp(kart.rotation.y, angle * 1.3 + driftDirection.current * 0.1, 6, delta);
  

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
    
    const gamepadButtons = {
      jump: false,
      x: 0
      
    }

    if(gamepadRef.current){
      gamepadButtons.jump = gamepadRef.current.buttons[5].pressed || gamepadRef.current.buttons[7].pressed;
      gamepadButtons.x = gamepadRef.current.axes[0];
    }
    updateSpeed(forward, backward, delta); 
    rotatePlayer(left, right, player, joystick.x, delta);
    updatePlayer(player, speedRef.current, camera, kart, delta);
    const isJumpPressed = jumpButtonPressed || jump || gamepadButtons.jump;
    jumpPlayer(isJumpPressed, left, right, joystick.x || gamepadButtons.x);
    driftPlayer(delta);
    getGamepad();

  })
  
  return(
    <>
      <group >

      </group>
    <group ref={playerRef}>
      <group ref={cameraGroupRef} position={[0, 2, 5]} >
      </group>

      <group ref={kartRef}>
      
          <Kart speed={speedRef} driftDirection={driftDirection} driftPower={driftPower} jumpOffset={jumpOffset} backWheelOffset={backWheelOffset} inputTurn={inputTurn} />

        <group ref={cameraLookAtRef} position={[0, -2,-9]}>

        </group>
      </group>
    </group>

    {/* <OrbitControls/> */}
    </>
  )
}
