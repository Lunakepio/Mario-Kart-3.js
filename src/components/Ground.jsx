import { RigidBody } from '@react-three/rapier'

export const Ground = (props) => {
  return (
    <RigidBody
      type='fixed'
      {...props}
    >
      <mesh
        transparent
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1000, 1000, 1000]} />
        <meshStandardMaterial
          color='yellow'
          opacity={0}
          transparent
        />
      </mesh>
    </RigidBody>
  )
}
