import { Environment, OrbitControls, PerspectiveCamera, Lightformer } from '@react-three/drei'
import { Ground } from './Ground'
import { PlayerController } from './PlayerController'
import { Paris } from './models/tracks/Tour_paris_promenade'
import { EffectComposer, N8AO, Bloom, TiltShift2, HueSaturation, SMAA, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { Skid } from './Skid'

export const Experience = () => {
  return (
    <>
      <PlayerController />
      {/* <Skid /> */}
      <Ground position={[0, 0, 0]} />
      <Environment
        resolution={256}
        preset='lobby'

      />

      <directionalLight
        position={[10, 50, -30]}
        intensity={1}
        shadow-bias={-0.0001}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-3000}
        castShadow
      />

      <Paris position={[0, 0, 0]} />
      <EffectComposer
        multisampling={0}
        disableNormalPass
        disableSSAO
        disableDepthPass
        
      >
        <SMAA />
        <N8AO distanceFalloff={1} aoRadius={1} intensity={3} />
        <Bloom
          luminanceThreshold={0}
          mipmapBlur
          luminanceSmoothing={0.01}
          intensity={0.5}
        />

        <TiltShift2/>
        <ChromaticAberration offset={[0.0006, 0.0006]} />
        <HueSaturation saturation={0.1} />
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
      </EffectComposer>
    </>
  )
}
