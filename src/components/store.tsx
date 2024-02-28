import { StoreApi, UseBoundStore, create } from 'zustand'

type CallbackFunction = () => void

export const playAudio = (path: string, callback?: CallbackFunction): void => {
  const audio = new Audio(`./sounds/${path}.mp3`)
  if (callback) {
    audio.addEventListener('ended', callback)
  }
  audio.play()
}

export const items: string[] = ['banana', 'shell']

type Position = [number, number, number]

interface Particle {
  id: string
  // Other properties can be added here as needed
}

interface Banana {
  id: string
  // Other properties can be added here as needed
}

interface Shell {
  id: string
  // Other properties can be added here as needed
}

interface Skid {
  // Define properties for Skid
}

interface Player {
  id: string
  // Other properties can be added here as needed
}

interface StoreState {
  gameStarted: boolean
  controls: string
  particles1: Particle[]
  particles2: Particle[]
  bodyPosition: Position
  bodyRotation: Position
  pastPositions: Position[] // Define a more specific type if possible
  shouldSlowdown: boolean
  bananas: Banana[]
  items: string[]
  item: string
  shells: Shell[]
  skids: Skid[]
  coins: number
  players: Player[]
  id: string
  joystickX: number
  driftButton: boolean
  itemButton: boolean
  menuButton: boolean
  actions: {
    addPastPosition: (position: Position) => void
    addParticle1: (particle: Particle) => void
    removeParticle1: (particle: Particle) => void
    addParticle2: (particle: Particle) => void
    removeParticle2: (particle: Particle) => void
    setBodyPosition: (position: Position) => void
    setBodyRotation: (rotation: Position) => void
    getBodyPosition: () => Position
    getBodyRotation: () => Position
    setShouldSlowDown: (shouldSlowdown: boolean) => void
    getShouldSlowDown: () => boolean
    addBanana: (banana: Banana) => void
    removeBanana: (banana: Banana) => void
    getBananas: () => Banana[]
    removeBananaById: (id: string) => void
    setBananas: (bananas: Banana[]) => void
    setItem: () => void
    useItem: () => void
    addShell: (shell: Shell) => void
    removeShell: (shell: Shell) => void
    addSkid: (skid: Skid) => void
    addCoins: () => void
    looseCoins: () => void
    addPlayer: (player: Player) => void
    removePlayer: (player: Player) => void
    setId: (id: string) => void
    setGameStarted: (gameStarted: boolean) => void
    setControls: (controls: string) => void
    setJoystickX: (joystickX: number) => void
    setDriftButton: (driftButton: boolean) => void
    setItemButton: (itemButton: boolean) => void
    setMenuButton: (menuButton: boolean) => void
  }
}

export const useStore: UseBoundStore<StoreApi<StoreState>> = create(
  (set, get) => ({
    gameStarted: false,
    controls: '',
    particles1: [],
    particles2: [],
    bodyPosition: [0, 0, 0],
    bodyRotation: [0, 0, 0],
    pastPositions: [],
    shouldSlowdown: false,
    bananas: [],
    items: ['mushroom', 'shell', 'banana'],
    item: '',
    shells: [],
    skids: [],
    coins: 0,
    players: [],
    id: '',
    joystickX: 0,
    driftButton: false,
    itemButton: false,
    menuButton: false,
    actions: {
      addPastPosition: (position: Position) => {
        set((state: StoreState) => ({
          pastPositions: [position, ...state.pastPositions.slice(0, 499)],
        }))
      },
      addParticle1: (particle: Particle) => {
        set((state: StoreState) => ({
          particles1: [...state.particles1, particle],
        }))
      },
      removeParticle1: (particle: Particle) => {
        set((state: StoreState) => ({
          particles1: state.particles1.filter((p) => p.id !== particle.id),
        }))
      },
      addParticle2: (particle: Particle) => {
        set((state: StoreState) => ({
          particles2: [...state.particles2, particle],
        }))
      },
      removeParticle2: (particle: Particle) => {
        set((state: StoreState) => ({
          particles2: state.particles2.filter((p) => p.id !== particle.id),
        }))
      },
      setBodyPosition: (position: Position) => {
        set({ bodyPosition: position })
      },
      setBodyRotation: (rotation: Position) => {
        set({ bodyRotation: rotation })
      },
      getBodyPosition: (): Position => {
        return (get() as StoreState).bodyPosition
      },
      getBodyRotation: (): Position => {
        return (get() as StoreState).bodyRotation
      },
      setShouldSlowDown: (shouldSlowdown: boolean) => {
        set({ shouldSlowdown })
      },
      getShouldSlowDown: (): boolean => {
        return (get() as StoreState).shouldSlowdown
      },
      addBanana: (banana: Banana) => {
        set((state: StoreState) => ({
          bananas: [...state.bananas, banana],
        }))
      },
      removeBanana: (banana: Banana) => {
        set((state: StoreState) => ({
          bananas: state.bananas.filter((b) => b.id !== banana.id),
        }))
      },
      getBananas: () => {
        return (get() as StoreState).bananas
      },
      removeBananaById: (id: string) => {
        set((state: StoreState) => ({
          bananas: state.bananas.filter((b) => b.id !== id),
        }))
      },
      setBananas: (bananas: Banana[]) => {
        set({ bananas })
      },
      setItem: () => {
        set((state: StoreState) => ({
          item: state.items[Math.floor(Math.random() * state.items.length)],
        }))
      },
      useItem: () => {
        set((state: StoreState) => ({
          item: '',
        }))
      },
      addShell: (shell: Shell) => {
        set((state: StoreState) => ({
          shells: [...state.shells, shell],
        }))
      },
      removeShell: (shell: Shell) => {
        set((state: StoreState) => ({
          shells: state.shells.filter((s) => s.id !== shell.id),
        }))
      },
      addSkid: (skid: Skid) => {
        set((state: StoreState) => ({
          skids: [...state.skids, skid],
        }))
      },
      addCoins: () => {
        set((state: StoreState) => ({
          coins: state.coins + 1,
        }))
      },
      looseCoins: () => {
        set((state: StoreState) => ({
          coins: state.coins - 1,
        }))
      },
      addPlayer: (player: Player) => {
        set((state: StoreState) => ({
          players: [...state.players, player],
        }))
      },
      removePlayer: (player: Player) => {
        set((state: StoreState) => ({
          players: state.players.filter((p) => p.id !== player.id),
        }))
      },
      setId: (id: string) => {
        set({ id })
      },
      setGameStarted: (gameStarted: boolean) => {
        set({ gameStarted })
      },
      setControls: (controls: string) => {
        set({ controls })
      },
      setJoystickX: (joystickX: number) => {
        set({ joystickX })
      },
      setDriftButton: (driftButton: boolean) => {
        set({ driftButton })
      },
      setItemButton: (itemButton: boolean) => {
        set({ itemButton })
      },
      setMenuButton: (menuButton: boolean) => {
        set({ menuButton })
      },
    },
  })
)
