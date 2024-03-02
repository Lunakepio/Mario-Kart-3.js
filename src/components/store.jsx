import { create } from "zustand";

export const playAudio = (path, callback) => {
  const audio = new Audio(`./sounds/${path}.mp3`);
  if (callback) {
    audio.addEventListener("ended", callback);
  }
  audio.play();
};
export const items = [
  "banana",
  "shell",
]

export const useStore = create((set, get) => ({
  gameStarted: false,
  controls: "",
  particles1: [],
  particles2: [],
  leftWheel: null,
  rightWheel: null,
  bodyRotation: null,
  pastPositions: [],
  shouldSlowdown: false,
  bananas: [],
  items: ["mushroom", "shell", "banana"],
  item: "",
  shells: [],
  skids: [],
  coins : 0,
  players : [],
  body: null,
  id : "",
  joystickX: 0,
  driftButton: false,
  itemButton: false,
  menuButton: false,
  isDrifting: false,
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
      set({ rotation });
    },
    getBodyPosition: () => {
      return get().bodyPosition;
    },
    getBodyRotation: () => {
      return get().bodyRotation;
    },
    setShouldSlowDown: (shouldSlowdown) => {
      set({ shouldSlowdown });
    },
    getShouldSlowDown: () => {
      return get().shouldSlowdown;
    },
    addBanana: (banana) => {
      set((state) => ({
        bananas: [...state.bananas, banana],
      }));
    },
    removeBanana: (banana) => {
      set((state) => ({
        bananas: state.bananas.filter((id) => id !== banana.id),
      }));
    },
    getBananas: () => {
      return get().bananas;
    },
    removeBananaById: (id) => {
      set((state) => ({
        bananas: state.bananas.filter((b) => b.id !== id),
      }));
    },
    setBananas: (bananas) => {
      set({ bananas });
    },
    setItem:() => {
      set((state) => ({
        item: state.items[Math.floor(Math.random() * state.items.length)],
      }));
    },
    useItem:() => {
      set((state) => ({
        item: "",
      }));
    },
    addShell: (shell) => {
      set((state) => ({
        shells: [...state.shells, shell],
      }));
    },
    removeShell: (shell) => {
      set((state) => ({
        shells: state.shells.filter((s) => s.id !== shell.id),
      }));
    },
    addSkid: (skid) => {
      set((state) => ({
        skids: [...state.skids, skid],
      }));
    },
    addCoins : () => {
      set((state) => ({
        coins: state.coins + 1,
      }));
    },
    looseCoins : () => {
      set((state) => ({
        coins: state.coins - 1,
      }));
    },
    addPlayer : (player) => {
      set((state) => ({
        players: [...state.players, player],
      }));
    },
    removePlayer : (player) => {
      set((state) => ({
        players: state.players.filter((p) => p.id !== player.id),
      }));
    },
    setId : (id) => {
      set({id});
    },
    setGameStarted: (gameStarted) => {
      set({ gameStarted });
    },
    setControls: (controls) => {
      set({ controls });
    },
    setJoystickX: (joystickX) => {
      set({ joystickX });
    },
    setDriftButton: (driftButton) => {
      set({ driftButton });
    },
    setItemButton: (itemButton) => {
      set({ itemButton });
    },
    setMenuButton: (menuButton) => {
      set({ menuButton });
    },
    setBody: (body) => {
      set({ body });
    },
    setLeftWheel: (leftWheel) => {
      set({ leftWheel });
    },
    setRightWheel: (rightWheel) => {
      set({ rightWheel });
    },
    setIsDrifting: (isDrifting) => {
      set({ isDrifting });
    },
    getIsDrifting: () => {
      return get().isDrifting;
    },
  },
 
}));
