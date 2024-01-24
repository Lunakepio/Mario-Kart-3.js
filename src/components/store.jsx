import { create } from "zustand";

export const useStore = create((set, get) => ({
  return : {
    particles1: [],
    particles2: [],
    bodyPosition: [0, 0, 0],
    bodyRotation: [0, 0, 0],
    actions : {
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
    },



  }
}));