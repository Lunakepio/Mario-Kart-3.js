import { create } from "zustand";

export const useStore = create((set, get) => ({
  particles1: [],
  particles2: [],
  bodyPosition: [0, 0, 0],
  bodyRotation: [0, 0, 0],
  pastPositions: [],
  LeftAxis: [0, 0],
  buttons : {
    A: false,
    B: false,
    X: false,
    Y: false,
    LB: false,
    RB: false,
    LT: false,
    RT: false,
    Back: false,
    Start: false,
    LeftStick: false,
    RightStick: false,
    Up: false,
    Down: false,
    Left: false,
    Right: false,
  },
  setLeftAxis: (axis) => {
    set({ LeftAxis: axis });
  },
  setButtons: (button, value) => {
    set((state) => ({
      buttons: {
        ...state.buttons,
        [button]: value,
      },
    }));
  },
  getButtons: () => {
    return get().buttons;
  },
  addPastPosition: (position) => {
    set((state) => ({
      pastPositions: [position, ...state.pastPositions.slice(0, 499)],
    }));
  },
  actions: {
    addParticle1: (particle) => {
      set((state) => ({
        particles1: [...state.particles1, particle],
      }));
    },
    removeParticle1: (particle) => {
      set((state) => ({
        particles1: state.particles1.filter((p) => p.id !== particle.id),
      }));
    },
    addParticle2: (particle) => {
      set((state) => ({
        particles2: [...state.particles2, particle],
      }));
    },
    removeParticle2: (particle) => {
      set((state) => ({
        particles2: state.particles2.filter((p) => p.id !== particle.id),
      }));
    },
    setBodyPosition: (position) => {
      set({ bodyPosition: position });
    },
    setBodyRotation: (rotation) => {
      set({ bodyRotation: rotation });
    },
    getBodyPosition: () => {
      return get().bodyPosition;
    },
    getBodyRotation: () => {
      return get().bodyRotation;
    },
  },
}));
