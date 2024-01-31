import React from 'react'
import { HitParticle } from './HitParticle'

export const HitParticles = ({ position, shouldLaunch }) => {
  return (
    <>
      <HitParticle position={[0,0,0]} shouldLaunch={shouldLaunch}/>
      <HitParticle position={[0,0,0]} shouldLaunch={shouldLaunch}/>
      <HitParticle position={[0,0,0]} shouldLaunch={shouldLaunch}/>
      <HitParticle position={[0,0,0]} shouldLaunch={shouldLaunch}/>
      <HitParticle position={[0,0,0]} shouldLaunch={shouldLaunch}/>
      <HitParticle position={[0,0,0]} shouldLaunch={shouldLaunch}/>
      <HitParticle position={[0,0,0]} shouldLaunch={shouldLaunch}/>
      <HitParticle position={[0,0,0]} shouldLaunch={shouldLaunch}/>
      <HitParticle position={[0,0,0]} shouldLaunch={shouldLaunch}/>

    </>
  )
}