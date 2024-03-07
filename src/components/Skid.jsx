import { Euler, Object3D, Vector3, Matrix4, DoubleSide } from 'three'
import { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { vec3 } from '@react-three/rapier'


import  { useStore } from './store'


const e = new Euler()
const m = new Matrix4()
const o = new Object3D()
const v = new Vector3()



export function Skid({ count = 50000, opacity = 0.5, size = 0.3 }) {
  const ref = useRef(null);
  const { leftWheel, rightWheel } = useStore();
  let index = 0
  useFrame(() => {
    if(!leftWheel && !rightWheel) return;
    const rotation = leftWheel.kartRotation;
    if (leftWheel && rightWheel && ref.current && (leftWheel.isSpinning || rightWheel.isSpinning)) {
      setItemAt(ref.current, rotation, leftWheel, index++);
      setItemAt(ref.current, rotation, rightWheel, index++);
      
      if (index === count) index = 0
    }
  })

  useLayoutEffect(() => {
    if(ref.current){
      ref.current.geometry.rotateX(-Math.PI / 2)
      return () => {
        ref.current.geometry.rotateX(Math.PI / 2)
      }
    }
  })

  return (
    <instancedMesh frustumCulled={false} ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial color="black" side={DoubleSide} transparent opacity={opacity} />
    </instancedMesh>
  )
}

function setItemAt(instances, rotation, body, index) {
  o.position.copy(body.getWorldPosition(v));
  o.rotation.set(0, rotation, 0);
  o.scale.setScalar(1)
  o.updateMatrix()
  instances.setMatrixAt(index, o.matrix)
  instances.instanceMatrix.needsUpdate = true
}
