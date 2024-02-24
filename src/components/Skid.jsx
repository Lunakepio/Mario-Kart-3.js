import { Euler, Object3D, Vector3, Matrix4, DoubleSide } from 'three'
import { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { vec3 } from '@react-three/rapier'


import  { useStore } from './store'


const e = new Euler()
const m = new Matrix4()
const o = new Object3D()
const v = new Vector3()



export function Skid({ count = 500, opacity = 1, size = 2 }) {
  const ref = useRef(null);
  const { body } = useStore();
  let index = 0
  useFrame(() => {
    if (body && ref.current) {
      setItemAt(ref.current, e, body, index++)
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
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[size, size * 2]} />
      <meshBasicMaterial color="black" side={DoubleSide} />
    </instancedMesh>
  )
}

function setItemAt(instances, rotation, body, index) {
  o.position.copy(vec3(body.translation()))
  o.rotation.copy(rotation)
  o.scale.setScalar(1)
  o.updateMatrix()
  instances.setMatrixAt(index, o.matrix)
  instances.instanceMatrix.needsUpdate = true
}
