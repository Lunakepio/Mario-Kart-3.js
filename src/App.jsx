import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { Suspense, useEffect, useMemo } from 'react'
import { Physics } from '@react-three/rapier'
import { KeyboardControls, Loader, OrbitControls, Preload, Stats } from '@react-three/drei'
import { insertCoin, onPlayerJoin } from 'playroomkit'
import { useStore } from "./components/store";

export const Controls = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
  boost: 'boost',
  shoot: 'shoot',
  slow: 'slow',
  reset: 'reset'
}
function App() {
  const map = useMemo(
    () => [
      { name: Controls.up, keys: ['KeyW', 'ArrowUp'] },
      { name: Controls.down, keys: ['KeyS', 'ArrowDown'] },
      { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
      { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
      { name: Controls.jump, keys: ['Space'] },
      { name: Controls.slow, keys: ['Shift'] },
      { name: Controls.shoot, keys: ['KeyE', 'Click'] },
      { name: Controls.reset, keys: ['KeyR'] }
    ],
    []
  )

  const { actions } = useStore();
  const start = async () => {
    await insertCoin();

    onPlayerJoin((state) => {
      actions.addPlayer(state);
      console.log('player joined', state);
      actions.setId(state.id);
      console.log(state)

      state.onQuit(() => {
        actions.removePlayer(state);
        console.log('player quit', state);
      });
    });
  }

  useEffect(() => {
    start();
  }, [])

  return (
    <>
    <Loader />
    <Canvas
      shadows
      dpr={1}
      gl={{ antialias: false, stencil: false, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
      <Preload all />
        <Physics
          gravity={[0, -90, 0]}
          timeStep={'vary'}
        >
          <KeyboardControls map={map}>
            <Experience />
          </KeyboardControls>
        </Physics>
      </Suspense>
    </Canvas>
    </>
  )
}

export default App
