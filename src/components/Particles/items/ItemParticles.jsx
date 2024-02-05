import { CircleItemParticle } from "./CircleItemParticle"
import { StarItemParticle } from "./StarItemParticle"
import { SmallCircleParticle } from "./SmallCircleParticle"

export const ItemParticles = ({item}) => {
  return (
    <>
      <CircleItemParticle position={[0,0.8, 0.2]} item={item} color={0x75ff9a}/>
      <StarItemParticle position={[0,0.8, 0.2]} item={item} timeModifier={50} color={0x75ff9a}/>
      <StarItemParticle position={[0,0.8, 0.2]} item={item} timeModifier={60} color={0xe872fc}/>
      <StarItemParticle position={[0,0.8, 0.2]} item={item} timeModifier={40} color={0x72e5fc}/>
      <StarItemParticle position={[0,0.8, 0.2]} item={item} timeModifier={90} color={0xf0db7f}/>
      <SmallCircleParticle position={[0,0.8, 0.2]} item={item} timeModifier={50} color={0x75ff9a}/>
      <SmallCircleParticle position={[0,0.8, 0.2]} item={item} timeModifier={60} color={0xe872fc}/>
      <SmallCircleParticle position={[0,0.8, 0.2]} item={item} timeModifier={40} color={0x72e5fc}/>
      <SmallCircleParticle position={[0,0.8, 0.2]} item={item} timeModifier={90} color={0xf0db7f}/>

    </>
  )
}