import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export function Track(props) {
  const { nodes, materials } = useGLTF('/models/track-transformed.glb')

  useEffect(() => {
    // Mark specific ground meshes
    const groundMeshes = [
      nodes.Object_4,
      nodes.Object_6,
      nodes.Object_9,
      nodes.Object_10,
      nodes.Object_11,
      nodes.Object_12,
      nodes.Object_22,
      nodes.Object_25,
      nodes.Object_27,
      nodes.Object_24,
    ]

    groundMeshes.forEach((node) => {
      if (node) node.userData.ground = true
    })
  }, [nodes])

  return (
    <group {...props} dispose={null} position={[155, -28.4, 15]} scale={0.08}>
      <mesh name={'ground'} castShadow receiveShadow geometry={nodes.Object_4.geometry} material={materials.material_0} />
      <mesh name={'ground'} castShadow receiveShadow geometry={nodes.Object_6.geometry} material={materials.material_1} />
      <mesh name={'ground'} castShadow receiveShadow geometry={nodes.Object_9.geometry} material={materials.material_4} />
      <mesh name={'ground'} castShadow receiveShadow geometry={nodes.Object_10.geometry} material={materials.material_5} />
      <mesh name={'ground dirt'} castShadow receiveShadow geometry={nodes.Object_11.geometry} material={materials.material_6} />
      <mesh name={'ground'} castShadow receiveShadow geometry={nodes.Object_12.geometry} material={materials.material_7} />
      <mesh name={'ground'} castShadow receiveShadow geometry={nodes.Object_22.geometry} material={materials.material_16} />
      <mesh name={'ground'} castShadow receiveShadow geometry={nodes.Object_25.geometry} material={materials.material_19} />
      <mesh name={'ground'} castShadow receiveShadow geometry={nodes.Object_27.geometry} material={materials.material_21} />
      <mesh name={'ground'} castShadow receiveShadow geometry={nodes.Object_24.geometry} material={materials.material_18} />
    </group>
  )
}
