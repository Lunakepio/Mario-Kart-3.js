import { extend, useFrame } from "@react-three/fiber";
import { InstancedMesh2 } from "@three.ez/instanced-mesh";
import { useMemo, useRef, useEffect } from "react";
import { ShaderMaterial, PlaneGeometry, Vector3, Color, Quaternion, Euler} from "three";
import { memo } from "react";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";
import { useGameStore } from "../../../store";

extend({ InstancedMesh2 });

export const Flames = () => {
  const ref = useRef();

  const geometry = useMemo(() => new PlaneGeometry(1.5, 1.5), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { 
          uCurrentTime: { value: 0 },
          color: { value: new Color(0xFFA22B).multiplyScalar(4)},
          uTimeOffset: { value: 0 },
          noiseTexture: { value: null }
        },        
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false,
        defines: {
          USE_INSTANCING_INDIRECT: true,
        },
      }),
    []
  );

  useEffect(() => {
    if (ref.current) {

      ref.current.initUniformsPerInstance({ fragment: { uCurrentTime: "float", uTimeOffset: "float" } });
    }
  }, [material.uniforms.noiseTexture]);

  const lastFiredTimeRef = useRef(0);
  const addInterval = 0.03;
  const scaleTarget = 2;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const camera = state.camera;
    const flamePositions = useGameStore.getState().flamePositions;
    const isBoosting = useGameStore.getState().isBoosting;
    if (flamePositions && state.clock.getElapsedTime() - lastFiredTimeRef.current >= addInterval && isBoosting) {
      const noiseTexture = useGameStore.getState().noiseTexture;
      material.uniforms.noiseTexture.value = noiseTexture;
      const [left, right] = flamePositions;
      ref.current.addInstances(1, (obj) => {
        obj.position.set(left.x, left.y -.1, left.z);
        obj.currentTime = 0;
        obj.setUniform('uCurrentTime', 0);
        obj.setUniform('uTimeOffset', Math.random());
      
        obj.scale.set(0.7, 0.7, 0.7);
      });

      ref.current.addInstances(1, (obj) => {
        obj.position.set(right.x, right.y -.1, right.z);
        obj.currentTime = 0;
        obj.setUniform('uCurrentTime', 0);
        obj.setUniform('uTimeOffset', Math.random());
      
        obj.scale.set(0.7, 0.7, 0.7);
      });

      lastFiredTimeRef.current = state.clock.getElapsedTime();
    }

    ref.current.updateInstances((obj) => {
      obj.currentTime += delta;
      obj.setUniform('uCurrentTime', obj.currentTime);
      obj.scale.lerp(new Vector3(scaleTarget, scaleTarget * 2, scaleTarget), 1 * delta);
      obj.position.y += delta * 13;

      const toCamera = new Vector3().subVectors(camera.getWorldPosition(new Vector3()), obj.position).normalize();
    

      const particleQuaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), toCamera);
      
      const randomRotationQuaternion = new Quaternion().setFromEuler(new Euler(0, 0, obj.randomZRotation));
      obj.scale.lerp(obj.scale, 0, delta * 30);
      
      particleQuaternion.multiply(randomRotationQuaternion);
      
      obj.quaternion.copy(particleQuaternion);
      

      if (obj.currentTime > .5) {
        obj.remove();
      }
    });
  });

  return (
    <instancedMesh2
      ref={ref}
      args={[geometry, material, { createEntities: true }]}
      frustumCulled={false}
    />
  );
};

export default memo(Flames);
