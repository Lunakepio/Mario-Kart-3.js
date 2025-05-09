import { Vector3 } from "three";
import { create } from "zustand";

export const useGameStore = create((set) => ({
  playerPosition: null,
  setPlayerPosition: (position) => set({ playerPosition: position }),
  flamePositions: null,
  setFlamePositions: (positions) => set({ flamePositions: positions }),
  boostPower: 0,
  setBoostPower: (power) => set({ boostPower: power }),

}));
