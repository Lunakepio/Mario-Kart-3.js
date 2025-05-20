import { Vector3 } from "three";
import { create } from "zustand";

export const useGameStore = create((set) => ({
  playerPosition: null,
  setPlayerPosition: (position) => set({ playerPosition: position }),
  speed: null,
  setSpeed: (speed) => set({ speed: speed }),
  flamePositions: null,
  setFlamePositions: (positions) => set({ flamePositions: positions }),
  boostPower: 0,
  setBoostPower: (power) => set({ boostPower: power }),
  isBoosting : false,
  setIsBoosting: (isBoosting) => set({ isBoosting }),
  driftLevel: null,
  setDriftLevel: (level) => set({ driftLevel: level }),
  groundPosition: null,
  setGroundPosition: (groundPosition) => set({groundPosition: groundPosition}),
  wheelPositions: null,
  setWheelPositions: (wheelPositions) => set({wheelPositions: wheelPositions}),
  body: null,
  setBody: (body) => set({body: body}),
  joystick: {x: 0, y: 0, distance: 0},
  setJoystick: (joystick) => set({ joystick: joystick }),
  jumpButtonPressed: false,
  setJumpButtonPressed: (pressed) => set({ jumpButtonPressed: pressed }),
}));
