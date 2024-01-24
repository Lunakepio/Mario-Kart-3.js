import { Controls } from "../App";
import { BallCollider, RigidBody, useRapier } from "@react-three/rapier";
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
import { Model } from "./models/Racing_kart";
import { FrontRightWheel } from "./models/Front_Right_Wheel";
import { FrontLeftWheel } from "./models/Front_Left_Wheel";
import { RearWheels } from "./models/Rear_wheels";
import gsap from "gsap";
import { Mario } from "./models/Mario_kart";
import { Particles1 } from "./Particles1";
import { DriftParticlesLeft } from "./DriftParticlesLeft";
import { DriftParticlesRight } from "./DriftParticlesRight";
import FakeGlowMaterial from "./FakeGlow/FakeGlowMaterial";
import { PointParticle } from "./PointParticle";
import { FlameParticle } from "./FlameParticle";
import { FlameParticles } from "./FlameParticles";

export const PlayerControllerAgain = () => {
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
  const maxSpeed = 45;
  const boostSpeed = 70;
  const acceleration = 30;
  const decceleration = 50;
  const damping = 90;
  const MaxSteeringSpeed = 1.1;
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
  const cameraLerpFactor = 2;
  const marioLerpFactor = 5;

  const [scale, setScale] = useState(0);
  let lastTime = performance.now();

  useFrame(({ pointer, clock }) => {
    const time = clock.getElapsedTime();
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) * 0.001;
    lastTime = currentTime;
    if (!body.current && !mario.current) return;

    // HANDLING AND STEERING
    const kartRotation =
      kart.current.rotation.y - driftDirection.current * driftForce.current;
    const forwardDirection = new THREE.Vector3(
      -Math.sin(kartRotation),
      0,
      -Math.cos(kartRotation)
    );
    body.current.applyImpulse(
      {
        x: forwardDirection.x * currentSpeed * 50 * deltaTime,
        y: 0 + jumpForce.current,
        z: forwardDirection.z * currentSpeed * 50 * deltaTime,
      },
      true
    );

    // ACCELERATING
    if (upPressed && currentSpeed < maxSpeed) {

      setCurrentSpeed(
        Math.min(currentSpeed + acceleration * deltaTime, maxSpeed)
      );
    } 
    if (!upPressed) {
      if (currentSpeed > 0) {
        setCurrentSpeed(Math.max(currentSpeed - decceleration * deltaTime, 0));
      }
      if (currentSteeringSpeed > 0) {
        setCurrentSteeringSpeed(
          Math.max(currentSteeringSpeed - 1 * deltaTime, 0)
        );
      }
    }

    if (upPressed) {
      if (currentSteeringSpeed < MaxSteeringSpeed) {
        setCurrentSteeringSpeed(
          Math.min(currentSteeringSpeed + 1 * deltaTime, MaxSteeringSpeed)
        );
      }
    }
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

    if (!driftLeft.current && !driftRight.current) {
      steeringAngle = currentSteeringSpeed * -pointer.x;
      targetXPosition = -camMaxOffset * -pointer.x;
    } else if (driftLeft.current && !driftRight.current) {
      steeringAngle = currentSteeringSpeed * -(pointer.x - 0.8);
      targetXPosition = -camMaxOffset * -pointer.x;
    } else if (driftRight.current && !driftLeft.current) {
      steeringAngle = currentSteeringSpeed * -(pointer.x + 0.8);
      targetXPosition = -camMaxOffset * -pointer.x;
    }
    kart.current.rotation.y += steeringAngle * deltaTime;
    body.current.applyImpulse(
      {
        x: -body.current.linvel().x * damping * deltaTime,
        y: 0,
        z: -body.current.linvel().z * damping * deltaTime,
      },
      true
    );
    body.current.applyImpulse(
      {
        x: forwardDirection.x * currentSpeed * 50 * deltaTime,
        y: 0 + jumpForce.current,
        z: forwardDirection.z * currentSpeed * 50 * deltaTime,
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
      jumpForce.current += 7;
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

    if (driftLeft.current) {
      driftDirection.current = 1;
      driftForce.current = 0.15;
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        steeringAngle * 0.5,
        marioLerpFactor * deltaTime
      );
      accumulatedDriftPower.current += 10 * (steeringAngle + 1) * deltaTime;
    }
    if (driftRight.current) {
      driftDirection.current = -1;
      driftForce.current = 0.15;
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        -(-steeringAngle) * 0.5,
        marioLerpFactor * deltaTime
      );
      accumulatedDriftPower.current += 10 * (-steeringAngle + 1) * deltaTime;
    }

    // console.log(steeringAngle)
    if (!driftLeft.current && !driftRight.current) {
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        steeringAngle * 0.2,
        marioLerpFactor * deltaTime
      );
      setScale(0);
      accumulatedDriftPower.current = 0;
      setTurboColor(0xffffff);

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
    if (isBoosting) {
      setCurrentSpeed(boostSpeed);
      boostDuration.current -= deltaTime * 200; 
      targetZPosition = 10;

      if (boostDuration.current <= 0) {
        setIsBoosting(false); 
        targetZPosition = 8;
      }
    } else if (boostDuration.current > 0 && !jumpIsHeld.current) {
      setIsBoosting(true); 
    }

    if (!isBoosting && currentSpeed === boostSpeed) {
      setCurrentSpeed(maxSpeed); 
    }


    if (!isBoosting) {
      if (upPressed && currentSpeed < maxSpeed) {
        setCurrentSpeed(Math.min(currentSpeed + acceleration * deltaTime, maxSpeed));
      } else if (!upPressed && currentSpeed > 0) {
        setCurrentSpeed(Math.max(currentSpeed - decceleration * deltaTime, 0));
      }
    }

    // Debug logging
    // console.log(`Speed: ${currentSpeed}, Boosting: ${isBoosting}, Boost Duration: ${boostDuration.current}`);

        // CAMERA WORK

        cam.current.position.x = THREE.MathUtils.lerp(
          cam.current.position.x,
          targetXPosition,
          cameraLerpFactor * deltaTime
        );
    
        cam.current.position.z = THREE.MathUtils.lerp(
          cam.current.position.z,
          targetZPosition,
          cameraLerpFactor * deltaTime
        );

        cam.current.updateMatrixWorld();

    setSteeringAngleWheels(steeringAngle * 0.1);
    //misc / debug

    // SOUND WORK
  });

  return (
    <group>
      <RigidBody
        ref={body}
        colliders={false}
        position={[8, 20, -96]}
        centerOfMass={[0, -1, 0]}
        mass={3}
      >
        <BallCollider
          args={[0.5]}
          mass={3}
          onCollisionEnter={(event) => {
            isOnFloor.current = true;
          }}
        />
        onCollisionEnter=
        {(event) => {
          isOnFloor.current = false;
        }}
      </RigidBody>

      <group ref={kart} rotation={[0, Math.PI / 2, 0]}>
        <group ref={mario}>
          <Mario
            currentSpeed={currentSpeed}
            steeringAngleWheels={steeringAngleWheels}
          />
          <pointLight
            position={[0.6, 0.05, 0.5]}
            intensity={scale}
            color={turboColor}
            distance={1}
          />

          <mesh position={[0.6, 0.05, 0.5]} scale={scale}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              emissive={turboColor}
              toneMapped={false}
              emissiveIntensity={100}
              transparent
              opacity={0.4}
            />
          </mesh>
          <pointLight
            position={[-0.6, 0.05, 0.5]}
            intensity={scale}
            color={turboColor}
            distance={1}
          />
          <mesh position={[-0.6, 0.05, 0.5]} scale={scale}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              emissive={turboColor}
              toneMapped={false}
              emissiveIntensity={100}
              transparent
              opacity={0.4}
            />
          </mesh>
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
          fov={40}
          ref={cam}
        />
        {/* <PositionalAudio ref={engineSound} url="./sounds/engine.wav" autoplay loop distance={10}/> */}
      </group>
    </group>
  );
};
