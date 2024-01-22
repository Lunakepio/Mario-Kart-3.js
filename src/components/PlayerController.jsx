import { Controls } from "../App";
import { RigidBody, useRapier } from "@react-three/rapier";
import {
  useKeyboardControls,
  PerspectiveCamera,
  ContactShadows,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Model } from "./models/Racing_kart";
import { FrontRightWheel } from "./models/Front_Right_Wheel";
import { FrontLeftWheel } from "./models/Front_Left_Wheel";
import { RearWheels } from "./models/Rear_wheels";
import gsap from "gsap";
import { Mario } from "./models/Mario_kart";

export const PlayerController = () => {
  const upPressed = useKeyboardControls((state) => state[Controls.up]);
  const downPressed = useKeyboardControls((state) => state[Controls.down]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const [isOnGround, setIsOnGround] = useState(false);
  const body = useRef();
  const kart = useRef();
  const cam = useRef();
  const initialSpeed = 0;
  const maxSpeed = 30;
  const boostSpeed = 50;
  const acceleration = 0.1;
  const decceleration = 0.2;
  const damping = 0.001;
  const MaxSteeringSpeed = 0.01;
  const [currentSteeringSpeed, setCurrentSteeringSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(initialSpeed);
  const camMaxOffset = 0.5;
  let steeringAngle = 0;
  const isOnFloor = useRef(false);
  const jumpForce = useRef(0);
  const jumpIsHeld = useRef(false);
  const driftDirection = useRef(0);
  const driftLeft = useRef(false);
  const driftRight = useRef(false);
  const driftForce = useRef(0);
  const mario = useRef();
  const accumulatedDriftPower = useRef(0);
  const blueTurboThreshold = 10;
  const orangeTurboThreshold = 30;
  const purpleTurboThreshold = 60;
  const [turboColor, setTurboColor] = useState(0xffffff);
  const boostDuration = useRef(0);
  const isBoosting = useRef(false);
  let targetXPosition = 0;
  let targetZPosition = 8;
  const [steeringAngleWheels, setSteeringAngleWheels] = useState(0);

  const [scale, setScale] = useState(0);

  useFrame(({ pointer, clock }) => {
    const time = clock.getElapsedTime();
    if (!body.current && !mario.current) return;

    // HANDLING AND STEERING
    const kartRotation =
      kart.current.rotation.y - driftDirection.current * driftForce.current;
    const forwardDirection = new THREE.Vector3(
      -Math.sin(kartRotation),
      0,
      -Math.cos(kartRotation)
    );

    if (leftPressed && currentSpeed > 0) {
      steeringAngle = currentSteeringSpeed;
      targetXPosition = -camMaxOffset;
    } else if (rightPressed && currentSpeed > 0) {
      steeringAngle = -currentSteeringSpeed;
      targetXPosition = camMaxOffset;
    } else {
      steeringAngle = 0;
      targetXPosition = 0;
      1;
    }

    // mouse steering
    steeringAngle = currentSteeringSpeed * -pointer.x;
    targetXPosition = -camMaxOffset * -pointer.x;

    // ACCELERATING

    if (upPressed && currentSpeed < maxSpeed) {
      // Accelerate the kart within the maximum speed limit
      setCurrentSpeed(Math.min(currentSpeed + acceleration, maxSpeed));
    } else if (upPressed && currentSpeed > maxSpeed && boostDuration.current > 0){
      setCurrentSpeed(Math.max(currentSpeed - decceleration, maxSpeed));
      }

    if (upPressed) {
      if (currentSteeringSpeed < MaxSteeringSpeed) {
        setCurrentSteeringSpeed(
          Math.min(currentSteeringSpeed + 0.0001, MaxSteeringSpeed)
        );
      }
    }
    // REVERSING
    if (downPressed && currentSpeed < -maxSpeed) {
      setCurrentSpeed(Math.max(currentSpeed - acceleration, -maxSpeed));
    }
    // DECELERATING
    else if (!upPressed && !downPressed) {
      if (currentSteeringSpeed > 0) {
        setCurrentSteeringSpeed(Math.max(currentSteeringSpeed - 0.00005, 0));
      } else if (currentSteeringSpeed < 0) {
        setCurrentSteeringSpeed(Math.min(currentSteeringSpeed + 0.00005, 0));
      }
      setCurrentSpeed(Math.max(currentSpeed - decceleration, 0));
    }


    // Update the kart's rotation based on the steering angle
    kart.current.rotation.y += steeringAngle;

    // Apply damping to simulate slowdown when no keys are pressed
    body.current.applyImpulse(
      {
        x: -body.current.linvel().x * (1 - damping),
        y: 0,
        z: -body.current.linvel().z * (1 - damping),
      },
      true
    );
    const bodyPosition = body.current.translation();
    kart.current.position.set(
      bodyPosition.x,
      bodyPosition.y - 1,
      bodyPosition.z
    );

    // JUMPING
    if (jumpPressed && isOnFloor.current && !jumpIsHeld.current) {
      jumpForce.current += 11;
      isOnFloor.current = false;
      jumpIsHeld.current = true;
    }

    if (!isOnFloor.current && jumpForce.current > 0) {
      jumpForce.current -= 1;
    }
    if (!jumpPressed) {
      jumpIsHeld.current = false;
      driftDirection.current = 0;
      driftForce.current = 0;
      driftLeft.current = false;
      driftRight.current = false;
    }
    // DRIFTING
    if (
      jumpIsHeld.current &&
      currentSteeringSpeed > 0 &&
      pointer.x < -0.24 &&
      !driftRight.current
    ) {
      driftLeft.current = true;
    }
    if (
      jumpIsHeld.current &&
      currentSteeringSpeed > 0 &&
      pointer.x > 0.24 &&
      !driftLeft.current
    ) {
      driftRight.current = true;
    }

    if (!jumpIsHeld.current && !driftLeft.current && !driftRight.current) {
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        0,
        0.001
      );
      setTurboColor(0xffffff);
      accumulatedDriftPower.current = 0;
      
    }

    if (driftLeft.current) {
      driftDirection.current = 1;
      driftForce.current = 0.4;
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        (steeringAngle * 50 + 0.5),
        0.1
      );
      accumulatedDriftPower.current += 0.1 * (steeringAngle + 1);
    }
    if (driftRight.current) {
      driftDirection.current = -1;
      driftForce.current = 0.4;
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        -(-steeringAngle * 50 + 0.5),
        0.1
      );
      accumulatedDriftPower.current += 0.1 * (-steeringAngle + 1);
    }
    if (!driftLeft.current && !driftRight.current) {
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        steeringAngle * 30,
        0.1
      );
      setScale(0);
    }
    if (accumulatedDriftPower.current > blueTurboThreshold) {
      setTurboColor(0x00ffff);
      boostDuration.current = 50;
    }
    if (accumulatedDriftPower.current > orangeTurboThreshold) {
      setTurboColor(0xffcf00);
      boostDuration.current = 100;
    }
    if (accumulatedDriftPower.current > purpleTurboThreshold) {
      setTurboColor(0xff00ff);
      boostDuration.current = 250;
    }

    if(driftLeft.current || driftRight.current){
      const oscillation = Math.sin(time * 1000) * 0.1;

      const vibration = oscillation + 0.9;
      setScale(vibration);
    }
    // RELEASING DRIFT 

    if (boostDuration.current > 1 && !jumpIsHeld.current) {
      setCurrentSpeed(boostSpeed);
      boostDuration.current -= 1;
      targetZPosition = 10;
    }  else if (boostDuration.current <= 1) {
      targetZPosition = 8;
    }
    

    // CAMERA WORK

    cam.current.updateMatrixWorld();

    cam.current.position.x = THREE.MathUtils.lerp(
      cam.current.position.x,
      targetXPosition,
      0.01
    );
    
    cam.current.position.z = THREE.MathUtils.lerp(
      cam.current.position.z,
      targetZPosition,
      0.01
    );
    cam.current.updateMatrixWorld();

    body.current.applyImpulse(
      {
        x: forwardDirection.x * currentSpeed,
        y: 0 + jumpForce.current,
        z: forwardDirection.z * currentSpeed,
      },
      true
    );

    // Update the kart's rotation based on the steering angle
    setSteeringAngleWheels(steeringAngle * 25);
    console.log(scale)
  });

  return (
    <group>
      <RigidBody
        ref={body}
        type="dynamic"
        colliders="ball"
        position={[0, 20, 0]}
        centerOfMass={[0, -1, 0]}
        onCollisionEnter={(event) => {
          isOnFloor.current = true;
        }}
      >
        <mesh transparent>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="blue" transparent opacity={0} />
        </mesh>
      </RigidBody>

      <group ref={kart}>
        <group ref={mario}>
          <Mario currentSpeed={currentSpeed} steeringAngleWheels={steeringAngleWheels}/>
          <pointLight
            position={[0.6, 0.05, 0.5]}
            intensity={scale}
            color={turboColor}
            distance={1}
            
          />
          <mesh position={[0.6, 0.05, 0.5]} scale={scale}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial emissive={turboColor} toneMapped={false} emissiveIntensity={2} transparent opacity={1}/>
          </mesh>
          <pointLight
            position={[-0.6, 0.05, 0.5]}
            intensity={scale}
            color={turboColor}
            distance={1}

          />
                    <mesh position={[-0.6, 0.05, 0.5]} scale={scale}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial emissive={turboColor} toneMapped={false} emissiveIntensity={2} transparent opacity={1}/>
          </mesh>
        </group>

        {/* <ContactShadows frames={1} /> */}
        <PerspectiveCamera
          makeDefault
          position={[0, 2, 8]}
          fov={50}
          ref={cam}
        />
      </group>
    </group>
  );
};
