import { Euler, Object3D, Vector3, Matrix4, DoubleSide, Quaternion, TextureLoader, BackSide } from 'three'
import { useRef, useLayoutEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { vec3 } from '@react-three/rapier'


import  { useStore } from './store'


const e = new Euler()
const m = new Matrix4()
const o = new Object3D()
const v = new Vector3()
const q = new Quaternion()



export function Dust({ count = 500, opacity = 0.1, size = 0.6 }) {
  const smoke01 = useLoader(TextureLoader, './particles/smokes/smoke_01.png');
  const smoke02 = useLoader(TextureLoader, './particles/smokes/smoke_02.png');
  const smoke03 = useLoader(TextureLoader, './particles/smokes/smoke_03.png');
  const smoke04 = useLoader(TextureLoader, './particles/smokes/smoke_04.png');
  const smoke05 = useLoader(TextureLoader, './particles/smokes/smoke_05.png');
  const smoke06 = useLoader(TextureLoader, './particles/smokes/smoke_06.png');
  const smoke07 = useLoader(TextureLoader, './particles/smokes/smoke_07.png');
  const smoke08 = useLoader(TextureLoader, './particles/smokes/smoke_08.png');

  const texture = [smoke01, smoke02, smoke03, smoke04, smoke05, smoke06, smoke07, smoke08]
  const ref = useRef(null);
  const { leftWheel, rightWheel } = useStore();
  let index = 0
  let time = 0
  let i = 0
  useFrame((state,delta ) => {
    if(!leftWheel && !rightWheel) return;
    const rotation = leftWheel.kartRotation;
    if (state.clock.getElapsedTime() - time > 0.02 && leftWheel && rightWheel && ref.current && leftWheel.isSpinning) {
      time = state.clock.getElapsedTime()
      setItemAt(ref.current, rotation, leftWheel, index++);
      setItemAt(ref.current, rotation, rightWheel, index++);
      
      if (index === count) index = 0
    } else {
      // Shrink old one
      for (i = 0; i < count; i++) {
        const direction = new Vector3(Math.sin(time * 6 + i * 10) , 2, 0);
        ref.current.getMatrixAt(i, m)
        m.decompose(o.position, q, v)
        o.scale.setScalar(Math.max(0, v.x - 0.005))
        o.position.addScaledVector(direction, 0.01)
        o.updateMatrix()
        ref.current.setMatrixAt(i, o.matrix)
        ref.current.instanceMatrix.needsUpdate = true
      }
    }
  })

  useLayoutEffect(() => {
    if(ref.current){
      ref.current.geometry.rotateY(-Math.PI / 2)
      return () => {
        ref.current.geometry.rotateY(Math.PI / 2)
      }
    }
  })

  return (
    <instancedMesh frustumCulled={false} ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial color={0xfcebc5} transparent map={smoke01} opacity={1} depthWrite={false} side={DoubleSide} />
    </instancedMesh>
  )
}

function setItemAt(instances, rotation, body, index) {
  const randomOffset = (Math.random() - 0.5) * 0.3 ;
  const pos = body.getWorldPosition(v);
  o.rotation.set(0, rotation + Math.PI / 2, 0);
  pos.x += randomOffset
  // pos.y += randomOffset
  pos.z += randomOffset
  o.position.copy(pos);
  o.scale.setScalar(1)
  o.updateMatrix()
  instances.setMatrixAt(index, o.matrix)
  instances.instanceMatrix.needsUpdate = true
}
