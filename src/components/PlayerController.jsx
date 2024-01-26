import { Controls } from "../App";
import { BallCollider, RigidBody, useRapier, vec3 } from "@react-three/rapier";
import {
  useKeyboardControls,
  PerspectiveCamera,
  ContactShadows,
  Sphere,
  OrbitControls,
  Trail,
  PositionalAudio,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";

import { Mario } from "./models/characters/Mario_kart";
import { DriftParticlesLeft } from "./Particles/DriftParticlesLeft";
import { DriftParticlesRight } from "./Particles/DriftParticlesRight";

import { PointParticle } from "./Particles/PointParticle";

import { FlameParticles } from "./Particles/FlameParticles";
import { useStore } from "./store";
import { Cylinder } from "@react-three/drei";

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
  const damping = -0.1;
  const MaxSteeringSpeed = 0.01;
  const [currentSteeringSpeed, setCurrentSteeringSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(initialSpeed);
  const camMaxOffset = 1;
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
  const [isBoosting, setIsBoosting] = useState(false);
  let targetXPosition = 0;
  let targetZPosition = 8;
  const [steeringAngleWheels, setSteeringAngleWheels] = useState(0);
  const engineSound = useRef();

  const [scale, setScale] = useState(0);
  const { actions, addPastPosition } = useStore();

  useFrame(({ pointer, clock }, delta) => {
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
    actions.setBodyPosition(body.current.translation());
    actions.setBodyRotation(kart.current.rotation);

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

    if (!driftLeft.current && !driftRight.current) {
      steeringAngle = currentSteeringSpeed * -pointer.x;
      targetXPosition = -camMaxOffset * -pointer.x;
    } else if (driftLeft.current && !driftRight.current) {
      steeringAngle = currentSteeringSpeed * -(pointer.x - 0.5);
      targetXPosition = -camMaxOffset * -pointer.x;
    } else if (driftRight.current && !driftLeft.current) {
      steeringAngle = currentSteeringSpeed * -(pointer.x + 0.5);
      targetXPosition = -camMaxOffset * -pointer.x;
    }
    // ACCELERATING

    if (upPressed && currentSpeed < maxSpeed) {
      // Accelerate the kart within the maximum speed limit
      setCurrentSpeed(
        Math.min(currentSpeed + acceleration * delta * 144, maxSpeed)
      );
    } else if (
      upPressed &&
      currentSpeed > maxSpeed &&
      boostDuration.current > 0
    ) {
      setCurrentSpeed(
        Math.max(currentSpeed - decceleration * delta * 144, maxSpeed)
      );
    }

    if (upPressed) {
      if (currentSteeringSpeed < MaxSteeringSpeed) {
        setCurrentSteeringSpeed(
          Math.min(
            currentSteeringSpeed + 0.0001 * delta * 144,
            MaxSteeringSpeed
          )
        );
      }
    }
    // REVERSING
    if (downPressed && currentSpeed < -maxSpeed) {
      setCurrentSpeed(
        Math.max(currentSpeed - acceleration * delta * 144, -maxSpeed)
      );
    }
    // DECELERATING
    else if (!upPressed && !downPressed) {
      if (currentSteeringSpeed > 0) {
        setCurrentSteeringSpeed(
          Math.max(currentSteeringSpeed - 0.00005 * delta * 144, 0)
        );
      } else if (currentSteeringSpeed < 0) {
        setCurrentSteeringSpeed(
          Math.min(currentSteeringSpeed + 0.00005 * delta * 144, 0)
        );
      }
      setCurrentSpeed(Math.max(currentSpeed - decceleration * delta * 144, 0));
    }

    // Update the kart's rotation based on the steering angle
    kart.current.rotation.y += steeringAngle * delta * 144;

    // Apply damping to simulate slowdown when no keys are pressed
    body.current.applyImpulse(
      {
        x: -body.current.linvel().x * (1 - damping) * delta * 144,
        y: 0,
        z: -body.current.linvel().z * (1 - damping) * delta * 144,
      },
      true
    );
    const bodyPosition = body.current.translation();
    kart.current.position.set(
      bodyPosition.x,
      bodyPosition.y - 0.5,
      bodyPosition.z
    );

    // JUMPING
    if (jumpPressed && isOnFloor.current && !jumpIsHeld.current) {
      jumpForce.current += 10;
      isOnFloor.current = false;
      jumpIsHeld.current = true;
    }

    if (!isOnFloor.current && jumpForce.current > 0) {
      jumpForce.current -= 1 * delta * 144;
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
      pointer.x < -0.1 &&
      !driftRight.current
    ) {
      driftLeft.current = true;
    }
    if (
      jumpIsHeld.current &&
      currentSteeringSpeed > 0 &&
      pointer.x > 0.1 &&
      !driftLeft.current
    ) {
      driftRight.current = true;
    }

    if (!jumpIsHeld.current && !driftLeft.current && !driftRight.current) {
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        0,
        0.0001 * delta * 144
      );
      setTurboColor(0xffffff);
      accumulatedDriftPower.current = 0;
    }

    if (driftLeft.current) {
      driftDirection.current = 1;
      driftForce.current = 0.4;
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        steeringAngle * 50 + 0.5,
        0.05 * delta * 144
      );
      accumulatedDriftPower.current += 0.1 * (steeringAngle + 1) * delta * 144;
    }
    if (driftRight.current) {
      driftDirection.current = -1;
      driftForce.current = 0.4;
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        -(-steeringAngle * 50 + 0.5),
        0.05 * delta * 144
      );
      accumulatedDriftPower.current += 0.1 * (-steeringAngle + 1) * delta * 144;
    }
    if (!driftLeft.current && !driftRight.current) {
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        steeringAngle * 30,
        0.05 * delta * 144
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

    if (driftLeft.current || driftRight.current) {
      const oscillation = Math.sin(time * 1000) * 0.1;
      const vibration = oscillation + 0.9;

      if (turboColor === 0xffffff) {
        setScale(vibration * 0.8);
      } else {
        setScale(vibration);
      }
    }
    // RELEASING DRIFT

    if (boostDuration.current > 1 && !jumpIsHeld.current) {
      setIsBoosting(true);
    } else if (boostDuration.current <= 1) {
      targetZPosition = 8;
      setIsBoosting(false);
    }

    if (isBoosting && boostDuration.current > 1) {
      setCurrentSpeed(boostSpeed);
      boostDuration.current -= 1 * delta * 144;
      targetZPosition = 10;
    } else if (boostDuration.current <= 1) {
      setIsBoosting(false);
      targetZPosition = 8;
    }

    // CAMERA WORK

    cam.current.updateMatrixWorld();

    cam.current.position.x = THREE.MathUtils.lerp(
      cam.current.position.x,
      targetXPosition,
      0.01 * delta * 144
    );

    cam.current.position.z = THREE.MathUtils.lerp(
      cam.current.position.z,
      targetZPosition,
      0.01 * delta * 144
    );

    body.current.applyImpulse(
      {
        x: forwardDirection.x * currentSpeed * delta * 144,
        y: 0 + jumpForce.current * delta * 144,
        z: forwardDirection.z * currentSpeed * delta * 144,
      },
      true
    );

    // Update the kart's rotation based on the steering angle
    setSteeringAngleWheels(steeringAngle * 25);

    // SOUND WORK

    // console.lowg(body.current.translation())
  });

  return (
    <group>
      <RigidBody
        ref={body}
        colliders={false}
        position={[8, 20, -96]}
        centerOfMass={[0, -1, 0]}
        mass={3}
        ccd
      >
        <BallCollider
          args={[0.5]}
          mass={3}
          onCollisionEnter={(event) => {
            isOnFloor.current = true;
          }}
          // onCollisionExit={(event) => {
          //   isOnFloor.current = false
          // }}
        />
      </RigidBody>

      <group ref={kart} rotation={[0, Math.PI / 2, 0]}>
        <group ref={mario}>
          <Mario
            currentSpeed={currentSpeed}
            steeringAngleWheels={steeringAngleWheels}
            isBoosting={isBoosting}
          />
          {/* <pointLight
            position={[0.6, 0.05, 0.5]}
            intensity={scale}
            color={turboColor}
            distance={1}
          /> */}

          <mesh position={[0.6, 0.05, 0.5]} scale={scale}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              emissive={turboColor}
              toneMapped={false}
              emissiveIntensity={100}
              transparent
              opacity={0.4}
            />
          </mesh>
          {/* <pointLight
            position={[-0.6, 0.05, 0.5]}
            intensity={scale}
            color={turboColor}
            distance={1}
          /> */}
          <mesh position={[-0.6, 0.05, 0.5]} scale={scale}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              emissive={turboColor}
              toneMapped={false}
              emissiveIntensity={100}
              transparent
              opacity={0.4}
            />
          </mesh>

          {/* <Cylinder
            args={[0.1, 0, 1, 128, 64, true]}
            position={[-0.6, 0.05, 0.5]}
            rotation={[Math.PI / 3, 0 , 0]}
          >
            <meshStandardMaterial side={THREE.DoubleSide} />
          </Cylinder> */}
          {/* <Flame/> */}
          <FlameParticles isBoosting={isBoosting} />
          <DriftParticlesLeft turboColor={turboColor} scale={scale} />
          <DriftParticlesRight turboColor={turboColor} scale={scale} />
          <PointParticle
            position={[-0.6, 0.05, 0.5]}
            png="./circle.png"
            turboColor={turboColor}
          />
          <PointParticle
            position={[0.6, 0.05, 0.5]}
            png="./circle.png"
            turboColor={turboColor}
          />
          <PointParticle
            position={[-0.6, 0.05, 0.5]}
            png="./star.png"
            turboColor={turboColor}
          />
          <PointParticle
            position={[0.6, 0.05, 0.5]}
            png="./star.png"
            turboColor={turboColor}
          />
        </group>

        {/* <ContactShadows frames={1} /> */}
        <PerspectiveCamera
          makeDefault
          position={[0, 2, 8]}
          fov={50}
          ref={cam}
        />
        {/* <PositionalAudio ref={engineSound} url="./sounds/engine.wav" autoplay loop distance={10}/> */}
      </group>
    </group>
  );
};
