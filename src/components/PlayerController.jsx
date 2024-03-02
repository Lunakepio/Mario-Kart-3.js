import { Controls } from "../App";
import { BallCollider, RigidBody, useRapier, vec3 } from "@react-three/rapier";
import {
  useKeyboardControls,
  PerspectiveCamera,
  PositionalAudio,
} from "@react-three/drei";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";

import { Mario } from "./models/characters/Mario_kart";
import { DriftParticlesLeft } from "./Particles/drifts/DriftParticlesLeft";
import { DriftParticlesRight } from "./Particles/drifts/DriftParticlesRight";

import { PointParticle } from "./Particles/drifts/PointParticle";

import { SmokeParticles } from "./Particles/smoke/SmokeParticles";
import { useStore } from "./store";
import { Cylinder } from "@react-three/drei";
import FakeGlowMaterial from "./ShaderMaterials/FakeGlow/FakeGlowMaterial";
import { HitParticles } from "./Particles/hits/HitParticles";
import { CoinParticles } from "./Particles/coins/CoinParticles";
import { ItemParticles } from "./Particles/items/ItemParticles";
import { geometry } from "maath";
extend(geometry);

export const PlayerController = ({
  player,
  userPlayer,
  setNetworkBananas,
  setNetworkShells,
  networkBananas,
  networkShells,
}) => {
  const upPressed = useKeyboardControls((state) => state[Controls.up]);
  const downPressed = useKeyboardControls((state) => state[Controls.down]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const shootPressed = useKeyboardControls((state) => state[Controls.shoot]);
  const resetPressed = useKeyboardControls((state) => state[Controls.reset]);
  const escPressed = useKeyboardControls((state) => state[Controls.escape]);

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
  const driftSound = useRef();
  const driftTwoSound = useRef();
  const driftOrangeSound = useRef();
  const driftPurpleSound = useRef();
  const driftBlueSound = useRef();
  const jumpSound = useRef();
  const landingSound = useRef();
  const turboSound = useRef();
  const [scale, setScale] = useState(0);
  const raycaster = new THREE.Raycaster();
  const downDirection = new THREE.Vector3(0, -1, 0);
  const [shouldLaunch, setShouldLaunch] = useState(false);
  const effectiveBoost = useRef(0);
  const text = useRef();

  const { actions, shouldSlowDown, item, bananas, coins, id, controls } =
    useStore();
  const slowDownDuration = useRef(1500);

  const rightWheel = useRef();
  const leftWheel = useRef();
  useEffect(() => {
    if (leftWheel.current && rightWheel.current && body.current) {
      actions.setLeftWheel(leftWheel.current);
      actions.setRightWheel(rightWheel.current);
    }
  }, [body.current]);
  useFrame(({ pointer, clock }, delta) => {
    if (player.id !== id) return;
    const time = clock.getElapsedTime();
    if (!body.current && !mario.current) return;
    engineSound.current.setVolume(currentSpeed / 300 + 0.2);
    engineSound.current.setPlaybackRate(currentSpeed / 10 + 0.1);
    jumpSound.current.setPlaybackRate(1.5);
    jumpSound.current.setVolume(0.5);
    driftSound.current.setVolume(0.2);

    driftBlueSound.current.setVolume(0.5);
    driftOrangeSound.current.setVolume(0.6);
    driftPurpleSound.current.setVolume(0.7);
    // HANDLING AND STEERING
    const kartRotation =
      kart.current.rotation.y - driftDirection.current * driftForce.current;
    const forwardDirection = new THREE.Vector3(
      -Math.sin(kartRotation),
      0,
      -Math.cos(kartRotation)
    );

    if (escPressed) {
      actions.setGameStarted(false);
    }
    if(kartRotation){
      leftWheel.current.kartRotation = kartRotation;
    }
    if (leftPressed && currentSpeed > 0) {
      steeringAngle = currentSteeringSpeed;
      targetXPosition = -camMaxOffset;
    } else if (rightPressed && currentSpeed > 0) {
      steeringAngle = -currentSteeringSpeed;
      targetXPosition = camMaxOffset;
    } else if (rightPressed && currentSpeed < 0) {
      steeringAngle = currentSteeringSpeed;
      targetXPosition = -camMaxOffset;
    } else if (leftPressed && currentSpeed < 0) {
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
      steeringAngle = currentSteeringSpeed * -(pointer.x - 1);
      targetXPosition = -camMaxOffset * -pointer.x;
    } else if (driftRight.current && !driftLeft.current) {
      steeringAngle = currentSteeringSpeed * -(pointer.x + 1);
      targetXPosition = -camMaxOffset * -pointer.x;
    }
    // ACCELERATING
    const shouldSlow = actions.getShouldSlowDown();

    if (upPressed && currentSpeed < maxSpeed) {
      // Accelerate the kart within the maximum speed limit
      setCurrentSpeed(
        Math.min(currentSpeed + acceleration * delta * 144, maxSpeed)
      );
    } else if (
      upPressed &&
      currentSpeed > maxSpeed &&
      effectiveBoost.current > 0
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
    if (shouldSlow) {
      rightWheel.current.isSpinning = true;

      setCurrentSpeed(
        Math.max(currentSpeed - decceleration * 2 * delta * 144, 0)
      );
      setCurrentSteeringSpeed(0);
      slowDownDuration.current -= 1500 * delta;
      setShouldLaunch(true);
      if (slowDownDuration.current <= 1) {
        rightWheel.current.isSpinning = false;
        actions.setShouldSlowDown(false);
        slowDownDuration.current = 1500;
        setShouldLaunch(false);
      }
    }

    // REVERSING
    if (downPressed) {
      if (currentSteeringSpeed < MaxSteeringSpeed) {
        setCurrentSteeringSpeed(
          Math.min(
            currentSteeringSpeed + 0.0001 * delta * 144,
            MaxSteeringSpeed
          )
        );
      }
    }

    if (downPressed && currentSpeed <= 0) {
      setCurrentSpeed(
        Math.max(currentSpeed - acceleration * delta * 144, -maxSpeed)
      );
    }
    // DECELERATING
    else if (!upPressed) {
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
    if (jumpPressed && isOnGround && !jumpIsHeld.current) {
      jumpForce.current += 10;
      isOnFloor.current = false;
      jumpIsHeld.current = true;
      jumpSound.current.play();
      setIsOnGround(false);

      if (jumpSound.current.isPlaying) {
        jumpSound.current.stop();
        jumpSound.current.play();
      }
    }

    if (isOnFloor.current && jumpForce.current > 0) {
      landingSound.current.play();
    }
    if (!isOnGround && jumpForce.current > 0) {
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
      upPressed &&
      pointer.x < -0.1 &&
      !driftRight.current
    ) {
      driftLeft.current = true;
    }
    if (
      jumpIsHeld.current &&
      currentSteeringSpeed > 0 &&
      upPressed &&
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
      driftSound.current.stop();
      driftTwoSound.current.stop();
      driftOrangeSound.current.stop();
      driftPurpleSound.current.stop();
    }

    if (driftLeft.current) {
      driftDirection.current = 1;
      driftForce.current = 0.4;
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        steeringAngle * 25 + 0.4,
        0.05 * delta * 144
      );
      if (isOnFloor.current) {
        leftWheel.current.isSpinning = true;
        accumulatedDriftPower.current +=
          0.1 * (steeringAngle + 1) * delta * 144;
      }
    }
    if (driftRight.current) {
      driftDirection.current = -1;
      driftForce.current = 0.4;
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        -(-steeringAngle * 25 + 0.4),
        0.05 * delta * 144
      );
      if(isOnFloor.current){
        leftWheel.current.isSpinning = true;
        accumulatedDriftPower.current += 0.1 * (-steeringAngle + 1) * delta * 144;

      }
    }
    if (!driftLeft.current && !driftRight.current) {
      mario.current.rotation.y = THREE.MathUtils.lerp(
        mario.current.rotation.y,
        steeringAngle * 30,
        0.05 * delta * 144
      );
      setScale(0);
      if((pointer.x > 0.8 || pointer.x < -0.8) && currentSpeed > 20 && isOnFloor.current){
        leftWheel.current.isSpinning = true;
      } else {
        leftWheel.current.isSpinning = false;
      }
    }
    if (accumulatedDriftPower.current > blueTurboThreshold) {
      setTurboColor(0x00ffff);
      boostDuration.current = 50;
      driftBlueSound.current.play();
    }
    if (accumulatedDriftPower.current > orangeTurboThreshold) {
      setTurboColor(0xffcf00);
      boostDuration.current = 100;
      driftBlueSound.current.stop();
      driftOrangeSound.current.play();
    }
    if (accumulatedDriftPower.current > purpleTurboThreshold) {
      setTurboColor(0xff00ff);
      boostDuration.current = 250;
      driftOrangeSound.current.stop();
      driftPurpleSound.current.play();
    }

    if (driftLeft.current || driftRight.current) {
      const oscillation = Math.sin(time * 1000) * 0.1;
      const vibration = oscillation + 0.9;
      if (turboColor === 0xffffff) {
        setScale(vibration * 0.8);
      } else {
        setScale(vibration);
      }
      if (isOnFloor.current && !driftSound.current.isPlaying) {
        driftSound.current.play();
        driftTwoSound.current.play();
        landingSound.current.play();
      }
    }
    // RELEASING DRIFT

    if (boostDuration.current > 1 && !jumpIsHeld.current) {
      setIsBoosting(true);
      effectiveBoost.current = boostDuration.current;
      boostDuration.current = 0;
    } else if (effectiveBoost.current <= 1) {
      targetZPosition = 8;
      setIsBoosting(false);
    }

    if (isBoosting && effectiveBoost.current > 1) {
      setCurrentSpeed(boostSpeed);
      effectiveBoost.current -= 1 * delta * 144;
      targetZPosition = 10;
      if (!turboSound.current.isPlaying) turboSound.current.play();
      driftTwoSound.current.play();
      driftBlueSound.current.stop();
      driftOrangeSound.current.stop();
      driftPurpleSound.current.stop();
    } else if (effectiveBoost.current <= 1) {
      setIsBoosting(false);
      targetZPosition = 8;
      turboSound.current.stop();
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

    // MISC

    if (resetPressed) {
      body.current.setTranslation({ x: 8, y: 2, z: -119 });
      body.current.setLinvel({ x: 0, y: 0, z: 0 });
      body.current.setAngvel({ x: 0, y: 0, z: 0 });
      setCurrentSpeed(0);
      setCurrentSteeringSpeed(0);
      setIsBoosting(false);
      effectiveBoost.current = 0;
      setIsOnGround(false);
      jumpForce.current = 0;
      driftDirection.current = 0;
      kart.current.rotation.y = Math.PI / 2;
    }

    // ITEMS

    if (shootPressed && item === "banana") {
      const distanceBehind = 2;
      const scaledBackwardDirection =
        forwardDirection.multiplyScalar(distanceBehind);

      const kartPosition = new THREE.Vector3(
        ...vec3(body.current.translation())
      );

      const bananaPosition = kartPosition.sub(scaledBackwardDirection);
      const newBanana = {
        id: Math.random() + "-" + +new Date(),
        position: bananaPosition,
        player: true,
      };
      setNetworkBananas([...networkBananas, newBanana]);

      actions.useItem();
    }

    if (shootPressed && item === "shell") {
      const distanceBehind = -2;
      const scaledBackwardDirection =
        forwardDirection.multiplyScalar(distanceBehind);

      const kartPosition = new THREE.Vector3(
        body.current.translation().x,
        body.current.translation().y,
        body.current.translation().z
      );

      const shellPosition = kartPosition.sub(scaledBackwardDirection);
      const newShell = {
        id: Math.random() + "-" + +new Date(),
        position: shellPosition,
        player: true,
        rotation: kartRotation,
      };
      setNetworkShells([...networkShells, newShell]);
      actions.useItem();
    }

    if (shootPressed && item === "mushroom") {
      setIsBoosting(true);
      effectiveBoost.current = 300;
      actions.useItem();
    }

    player.setState("position", body.current.translation());
    player.setState("rotation", kartRotation + mario.current.rotation.y);
    player.setState("isBoosting", isBoosting);
    player.setState("shouldLaunch", shouldLaunch);
    player.setState("turboColor", turboColor);
    player.setState("scale", scale);
    player.setState("bananas", bananas);
  });

  return player.id === id ? (
    <group>
      <RigidBody
        ref={body}
        colliders={false}
        position={[8, 60, -119]}
        centerOfMass={[0, -1, 0]}
        mass={3}
        ccd
        name="player"
        type={player.id === id ? "dynamic" : "kinematic"}
      >
        <BallCollider
          args={[0.5]}
          mass={3}
          onCollisionEnter={({ other }) => {
            isOnFloor.current = true;
            setIsOnGround(true);
          }}
          onCollisionExit={({ other }) => {
            isOnFloor.current = false;
            setIsOnGround(false);
          }}
        />
      </RigidBody>

      <group ref={kart} rotation={[0, Math.PI / 2, 0]}>
        <group ref={mario}>
          <Mario
            currentSpeed={currentSpeed}
            steeringAngleWheels={steeringAngleWheels}
            isBoosting={isBoosting}
            shouldLaunch={shouldLaunch}
          />
          <CoinParticles coins={coins} />
          <ItemParticles item={item} />
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
          <mesh position={[0.6, 0.05, 0.5]} scale={scale * 10}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <FakeGlowMaterial
              falloff={3}
              glowInternalRadius={1}
              glowColor={turboColor}
              glowSharpness={1}
            />
          </mesh>
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
          <mesh position={[-0.46, 0.05, 0.3]} ref={leftWheel}></mesh>
          <mesh position={[0.46, 0.05, 0.3]} ref={rightWheel}></mesh>
          <mesh position={[-0.6, 0.05, 0.5]} scale={scale * 10}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <FakeGlowMaterial
              falloff={3}
              glowInternalRadius={1}
              glowColor={turboColor}
              glowSharpness={1}
            />
          </mesh>
          {/* <FlameParticles isBoosting={isBoosting} /> */}
          <DriftParticlesLeft turboColor={turboColor} scale={scale} />
          <DriftParticlesRight turboColor={turboColor} scale={scale} />
          <SmokeParticles
            driftRight={driftRight.current}
            driftLeft={driftLeft.current}
          />
          <PointParticle
            position={[-0.6, 0.05, 0.5]}
            png="./particles/circle.png"
            turboColor={turboColor}
          />
          <PointParticle
            position={[0.6, 0.05, 0.5]}
            png="./particles/circle.png"
            turboColor={turboColor}
          />
          <PointParticle
            position={[-0.6, 0.05, 0.5]}
            png="./particles/star.png"
            turboColor={turboColor}
          />
          <PointParticle
            position={[0.6, 0.05, 0.5]}
            png="./particles/star.png"
            turboColor={turboColor}
          />
          <HitParticles shouldLaunch={shouldLaunch} />
        </group>

        {/* <ContactShadows frames={1} /> */}
        <PerspectiveCamera
          makeDefault
          position={[0, 2, 8]}
          fov={50}
          ref={cam}
          far={5000}
        />
        <PositionalAudio
          ref={engineSound}
          url="./sounds/engine.wav"
          autoplay
          loop
          distance={1000}
        />
        <PositionalAudio
          ref={driftSound}
          url="./sounds/drifting.mp3"
          loop
          distance={1000}
        />
        <PositionalAudio
          ref={driftTwoSound}
          url="./sounds/driftingTwo.mp3"
          loop
          distance={1000}
        />
        <PositionalAudio
          ref={driftOrangeSound}
          url="./sounds/driftOrange.wav"
          loop={false}
          distance={1000}
        />
        <PositionalAudio
          ref={driftBlueSound}
          url="./sounds/driftBlue.wav"
          loop={false}
          distance={1000}
        />

        <PositionalAudio
          ref={driftPurpleSound}
          url="./sounds/driftPurple.wav"
          loop={false}
          distance={1000}
        />
        <PositionalAudio
          ref={jumpSound}
          url="./sounds/jump.mp3"
          loop={false}
          distance={1000}
        />
        <PositionalAudio
          ref={landingSound}
          url="./sounds/landing.wav"
          loop={false}
          distance={1000}
        />
        <PositionalAudio
          ref={turboSound}
          url="./sounds/turbo.wav"
          loop={false}
          distance={1000}
        />
      </group>
    </group>
  ) : null;
};
