import React, { useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { RepeatWrapping } from 'three'

export function Track(props) {
  const { nodes, materials } = useGLTF('/models/track-transformed.glb')
  
  const normalMap = useTexture('/textures/normal.jpg')
  
  useEffect(() => {
      if (normalMap) {
        normalMap.wrapS = RepeatWrapping
        normalMap.wrapT = RepeatWrapping
  
        // Adjust this based on how often you want it to tile on the mesh
        normalMap.repeat.set(300, 300);
        normalMap.offset.set(0, 0);
  
        // Optional: maintain aspect ratio manually if needed
        normalMap.anisotropy = 32
  
      }
  
      materials.material_18.normalMap = normalMap
    materials.material_18.roughness = 0.52;
      materials.material_18.needsUpdate = true
    }, [normalMap, materials.material_18])
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
