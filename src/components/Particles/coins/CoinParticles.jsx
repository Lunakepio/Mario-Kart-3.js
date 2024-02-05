import { CircleCoinParticle } from "./CircleCoinParticle"
import { StarCoinParticle } from "./StarCoinParticle"

export const CoinParticles = ({ coins }) => {
  return (
    <>
      <CircleCoinParticle position={[0,0.8, 0.2]} coins={coins}/>
      <StarCoinParticle position={[0,0.8, 0.2]} coins={coins} timeModifier={50}/>
      <StarCoinParticle position={[0,0.8, 0.2]} coins={coins} timeModifier={60}/>
      <StarCoinParticle position={[0,0.8, 0.2]} coins={coins} timeModifier={40}/>
      <StarCoinParticle position={[0,0.8, 0.2]} coins={coins} timeModifier={90}/>

    </>
  )
}