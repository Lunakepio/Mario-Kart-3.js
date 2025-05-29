import { Billboard, Float, RoundedBox, useGLTF, useTexture } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import { ShaderMaterial, PlaneGeometry, Color, MeshStandardMaterial } from "three"
import vert from "./shaders/vertex.glsl"
import frag from "./shaders/fragment.glsl"
import { extend, useFrame } from "@react-three/fiber"
import { InstancedMesh2 } from "@three.ez/instanced-mesh"
import { sin } from "three/tsl"

extend({InstancedMesh2})
export const ItemBox = () => {
    const questionTexture = useTexture("./textures/itembox/question.png")
    const questionNormal = useTexture("./textures/itembox/question-normal.png")
    const rainbowTexture = useTexture("./textures/itembox/rainbow-2.jpg")
    const boxRef = useRef()
    const questionRef = useRef()

    const { nodes } = useGLTF("./models/box.glb")

    const boxShaderMaterial = useMemo(() => new ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        uniforms: {
            time: { value: 0 },
            rainbowTexture: { value: rainbowTexture },
            // color: { value: new Color(0x19abff) },
        },
        defines: {
          USE_INSTANCING_INDIRECT: true,
        },
        // side: BackSide
    }), [rainbowTexture])

    const questionGeometry = useMemo(() => new PlaneGeometry(0.8, 0.8), [])
    const questionMaterial = useMemo(() => new MeshStandardMaterial({
        map: questionTexture,
        normalMap: questionNormal,
        depthTest: false,
        transparent: true,
        roughness: 0,
    }), [questionNormal, questionTexture])
    let boxHasBeenCreated = false
    useFrame((state, delta) => {
        boxShaderMaterial.uniforms.time.value += delta
        const time = state.clock.getElapsedTime()
        if(!boxHasBeenCreated){
             boxRef.current.addInstances(12, (obj, i) => {
                obj.position.set((2 * i) % 12, 0,( 2 * i) - 6)
                
                obj.position.x -= 3.5;
                obj.position.z -= 16;
                obj.scale.set(0.5, 0.5, 0.5)
                questionRef.current.addInstances(1, (obj2) => {
                    obj2.position.set(obj.position.x, obj.position.y, obj.position.z)
                    // obj.scale.set(0.1, 0.1, 0.1)
                    
                })
            })
            boxHasBeenCreated = true
        }

    boxRef.current.updateInstances((obj) => {
            // obj.position.y = Math.sin(time * 0.1) * 0.5
            obj.quaternion.y = Math.sin(time * 0.1) * 0.5
            obj.quaternion.x = Math.cos(time * 0.1) * 0.5
    })
    })

    return (<>
    {/* <Float rotation={[Math.PI / 3.5, 0, 0]} rotationIntensity={4} floatIntensity={6} speed={1.5} >
        <RoundedBox
        args={[1, 1, 1]}
        radius={0.1}
        smoothness={4}
        bevelSegments={5} 
        creaseAngle={0.4}
        material={boxShaderMaterial}
        >
        
            <Billboard>
            <mesh>
                <planeGeometry args={[0.8, 0.8]} />
                <meshStandardMaterial map={questionTexture} normalMap={questionNormal} depthTest={false} transparent roughness={0}/>
            </mesh>
            </Billboard>
        </RoundedBox>
    </Float> */}
    <instancedMesh2 ref={boxRef} args={[nodes.Cube.geometry, boxShaderMaterial, { createEntities: true }]} frustumCulled={false} />
    <instancedMesh2 ref={questionRef} args={[questionGeometry, questionMaterial, { createEntities: true }]} frustumCulled={false} />
    </>)
}
