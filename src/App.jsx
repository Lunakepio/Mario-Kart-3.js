import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { Suspense, useEffect, useMemo } from 'react'
import { Physics } from '@react-three/rapier'
import { Environment, KeyboardControls, Loader, OrbitControls, Preload, Stats } from '@react-three/drei'
import { insertCoin, onPlayerJoin } from 'playroomkit'
import { useStore } from "./components/store";
import * as THREE from "three";
import { ParisBis } from './components/models/tracks/Paris-bis'

export const Controls = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
  boost: 'boost',
  shoot: 'shoot',
  slow: 'slow',
  reset: 'reset',
  escape: 'escape'
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
      { name: Controls.reset, keys: ['KeyR'] },
      { name: Controls.escape, keys: ['Escape']}
    ],
    []
  )

  const { actions } = useStore();
  const start = async () => {
    await insertCoin({ skipLobby: true});

    onPlayerJoin((state) => {
      actions.addPlayer(state);

      actions.setId(state.id);

      state.onQuit(() => {
        actions.removePlayer(state);

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
      // shadows
      dpr={1}
      gl={{ antialias: false, stencil: false, depth:false, powerPreference: 'high-performance' }}
      mode="concurrent"
      onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.AgXToneMapping
          gl.setClearColor(0x000000, 0)
        }}>
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
