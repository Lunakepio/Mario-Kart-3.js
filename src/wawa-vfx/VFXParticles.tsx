import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  AdditiveBlending,
  Color,
  DynamicDrawUsage,
  Euler,
  Matrix4,
  PlaneGeometry,
  Quaternion,
  Vector3,
} from "three";
import { EmitCallbackSettingsFn, useVFX } from "./VFXStore";
import { easings } from "./easings";
import { EaseFunction, easeFunctionList } from "./types";

const tmpPosition = new Vector3();
const tmpRotationEuler = new Euler();
const tmpRotation = new Quaternion();
const tmpScale = new Vector3(1, 1, 1);
const tmpMatrix = new Matrix4();
const tmpColor = new Color();

interface VFXParticlesSettings {
  nbParticles?: number;
  intensity?: number;
  renderMode?: "stretchBillboard" | "billboard" | "mesh";
  stretchScale?: number;
  fadeSize?: [number, number];
  fadeAlpha?: [number, number];
  gravity?: [number, number, number];
  frustumCulled?: boolean;
  appearance?: "default" | "circular";
  easeFunction?: EaseFunction;
}

const AppearanceModes = {
  SQUARE: 0,
  CIRCULAR: 1,
} as const;

type AppearanceModeValue = (typeof AppearanceModes)[keyof typeof AppearanceModes];
  
interface VFXParticlesProps {
  name: string;
  settings?: VFXParticlesSettings;
  alphaMap?: THREE.Texture;
  geometry?: React.ReactElement;
}

const VFXParticles: React.FC<VFXParticlesProps> = ({
  name,
  settings = {},
  alphaMap,
  geometry,
}) => {
  const {
    nbParticles = 1000,
    intensity = 1,
    renderMode = "mesh",
    stretchScale = 1.0,
    fadeSize = [0.1, 0.9],
    fadeAlpha = [0, 1.0],
    gravity = [0, 0, 0],
    frustumCulled = true,
    appearance = "default",
    easeFunction = "easeLinear",
  } = settings;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const defaultGeometry = useMemo(() => new PlaneGeometry(0.5, 0.5), []);
  const easingIndex = easeFunctionList.indexOf(easeFunction);

  const onBeforeRender = () => {
    if (!needsUpdate.current || !mesh.current) {
      return;
    }
    const attributes = [
      mesh.current.instanceMatrix,
      mesh.current.geometry.getAttribute("instanceColor"),
      mesh.current.geometry.getAttribute("instanceColorEnd"),
      mesh.current.geometry.getAttribute("instanceDirection"),
      mesh.current.geometry.getAttribute("instanceLifetime"),
      mesh.current.geometry.getAttribute("instanceSpeed"),
      mesh.current.geometry.getAttribute("instanceRotationSpeed"),
    ];
    attributes.forEach((attr) => {
      const attribute = attr as THREE.InstancedBufferAttribute;
      attribute.clearUpdateRanges();
      if (lastCursor.current > cursor.current) {
        attribute.addUpdateRange(0, cursor.current * attribute.itemSize);
        attribute.addUpdateRange(
          lastCursor.current * attribute.itemSize,
          nbParticles * attribute.itemSize -
            lastCursor.current * attribute.itemSize
        );
      } else {
        attribute.addUpdateRange(
          lastCursor.current * attribute.itemSize,
          cursor.current * attribute.itemSize -
            lastCursor.current * attribute.itemSize
        );
      }
      attribute.needsUpdate = true;
    });
    lastCursor.current = cursor.current;
    needsUpdate.current = false;
  };

  const cursor = useRef(0);
  const lastCursor = useRef(0);
  const needsUpdate = useRef(false);

  const emit = (count: number, setup: EmitCallbackSettingsFn) => {
    const instanceColor = mesh.current.geometry.getAttribute(
      "instanceColor"
    ) as THREE.BufferAttribute;
    const instanceColorEnd = mesh.current.geometry.getAttribute(
      "instanceColorEnd"
    ) as THREE.BufferAttribute;
    const instanceDirection = mesh.current.geometry.getAttribute(
      "instanceDirection"
    ) as THREE.BufferAttribute;
    const instanceLifetime = mesh.current.geometry.getAttribute(
      "instanceLifetime"
    ) as THREE.BufferAttribute;
    const instanceSpeed = mesh.current.geometry.getAttribute(
      "instanceSpeed"
    ) as THREE.BufferAttribute;
    const instanceRotationSpeed = mesh.current.geometry.getAttribute(
      "instanceRotationSpeed"
    ) as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      if (cursor.current >= nbParticles) {
        cursor.current = 0;
      }
      const {
        scale,
        rotation,
        rotationSpeed,
        position,
        direction,
        lifetime,
        colorStart,
        colorEnd,
        speed,
      } = setup();

      tmpPosition.set(...position);
      tmpRotationEuler.set(...rotation);
      if (renderMode === "billboard" || renderMode === "stretchBillboard") {
        tmpRotationEuler.x = 0;
        tmpRotationEuler.y = 0;
      }
      tmpRotation.setFromEuler(tmpRotationEuler);
      tmpScale.set(...scale);
      tmpMatrix.compose(tmpPosition, tmpRotation, tmpScale);
      mesh.current.setMatrixAt(cursor.current, tmpMatrix);

      tmpColor.set(colorStart);
      instanceColor.set(
        [tmpColor.r, tmpColor.g, tmpColor.b],
        cursor.current * 3
      );
      tmpColor.set(colorEnd);
      instanceColorEnd.set(
        [tmpColor.r, tmpColor.g, tmpColor.b],
        cursor.current * 3
      );
      instanceDirection.set(direction, cursor.current * 3);
      instanceLifetime.set(lifetime, cursor.current * 2);
      instanceSpeed.set(speed, cursor.current);
      instanceRotationSpeed.set(rotationSpeed, cursor.current * 3);
      cursor.current++;
      cursor.current = cursor.current % nbParticles;
    }

    mesh.current.instanceMatrix.needsUpdate = true;
    instanceColor.needsUpdate = true;
    instanceColorEnd.needsUpdate = true;
    instanceDirection.needsUpdate = true;
    instanceLifetime.needsUpdate = true;
    instanceSpeed.needsUpdate = true;
    instanceRotationSpeed.needsUpdate = true;
    needsUpdate.current = true;
  };

  const [attributeArrays] = useState({
    instanceColor: new Float32Array(nbParticles * 3),
    instanceColorEnd: new Float32Array(nbParticles * 3),
    instanceDirection: new Float32Array(nbParticles * 3),
    instanceLifetime: new Float32Array(nbParticles * 2),
    instanceSpeed: new Float32Array(nbParticles * 1),
    instanceRotationSpeed: new Float32Array(nbParticles * 3),
  });

  useFrame(({ clock }) => {
    if (!mesh.current) {
      return;
    }
    const material = mesh.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uIntensity.value = intensity;
    material.uniforms.uStretchScale.value = stretchScale;
    material.uniforms.uFadeSize.value = fadeSize;
    material.uniforms.uFadeAlpha.value = fadeAlpha;
    material.uniforms.uGravity.value = gravity;
    material.uniforms.uAppearanceMode.value = 
      appearance === "circular" ? AppearanceModes.CIRCULAR :
      AppearanceModes.SQUARE;
    material.uniforms.uEasingFunction.value = easingIndex;
  });

  const registerEmitter = useVFX((state) => state.registerEmitter);
  const unregisterEmitter = useVFX((state) => state.unregisterEmitter);

  useEffect(() => {
    registerEmitter(name, emit);
    return () => {
      unregisterEmitter(name);
    };
  }, []);

  return (
    <>
      <instancedMesh
        args={[
          (geometry ? undefined : defaultGeometry) as
            | THREE.BufferGeometry
            | undefined,
          undefined,
          nbParticles,
        ]}
        ref={mesh as React.RefObject<THREE.InstancedMesh>}
        frustumCulled={frustumCulled}
        onBeforeRender={onBeforeRender}
      >
        {geometry}
        <particlesMaterial
          blending={AdditiveBlending}
          defines={{
            STRETCH_BILLBOARD_MODE: renderMode === "stretchBillboard",
            BILLBOARD_MODE: renderMode === "billboard",
            MESH_MODE: renderMode === "mesh",
          }}
          transparent
          alphaMap={alphaMap}
          depthWrite={false}
        />
        <instancedBufferAttribute
          attach={"geometry-attributes-instanceColor"}
          args={[attributeArrays.instanceColor, 3]}
          itemSize={3}
          count={nbParticles}
          usage={DynamicDrawUsage}
        />
        <instancedBufferAttribute
          attach={"geometry-attributes-instanceColorEnd"}
          args={[attributeArrays.instanceColorEnd, 3]}
          itemSize={3}
          count={nbParticles}
          usage={DynamicDrawUsage}
        />
        <instancedBufferAttribute
          attach={"geometry-attributes-instanceDirection"}
          args={[attributeArrays.instanceDirection, 3]}
          itemSize={3}
          count={nbParticles}
          usage={DynamicDrawUsage}
        />
        <instancedBufferAttribute
          attach={"geometry-attributes-instanceLifetime"}
          args={[attributeArrays.instanceLifetime, 2]}
          itemSize={2}
          count={nbParticles}
          usage={DynamicDrawUsage}
        />
        <instancedBufferAttribute
          attach={"geometry-attributes-instanceSpeed"}
          args={[attributeArrays.instanceSpeed, 1]}
          itemSize={1}
          count={nbParticles}
          usage={DynamicDrawUsage}
        />
        <instancedBufferAttribute
          attach={"geometry-attributes-instanceRotationSpeed"}
          args={[attributeArrays.instanceRotationSpeed, 3]}
          itemSize={3}
          count={nbParticles}
          usage={DynamicDrawUsage}
        />
      </instancedMesh>
    </>
  );
};

const ParticlesMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 1,
    uStretchScale: 1,
    uFadeSize: [0.1, 0.9],
    uFadeAlpha: [0, 1.0],
    uGravity: [0, 0, 0],
    uAppearanceMode: 0,
    alphaMap: null,
    uEasingFunction: 0,
  },
  /* glsl */ `
${easings}
mat4 rotationX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
      1,  0,  0,  0,
      0,  c, -s,  0,
      0,  s,  c,  0,
      0,  0,  0,  1
  );
}

mat4 rotationY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
        c,  0,  s,  0,
        0,  1,  0,  0,
      -s,  0,  c,  0,
        0,  0,  0,  1
  );
}

mat4 rotationZ(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
      c, -s,  0,  0,
      s,  c,  0,  0,
      0,  0,  1,  0,
      0,  0,  0,  1
  );
}


vec3 billboard(vec2 v, mat4 view) {
  vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
  vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
  vec3 p = right * v.x + up * v.y;
  return p;
}

uniform float uTime;
uniform vec2 uFadeSize;
uniform vec3 uGravity;
uniform float uStretchScale;
uniform int uEasingFunction;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vColorEnd;
varying float vProgress;

attribute float instanceSpeed;
attribute vec3 instanceRotationSpeed;
attribute vec3 instanceDirection;
attribute vec3 instanceColor;
attribute vec3 instanceColorEnd;
attribute vec2 instanceLifetime; // x: startTime, y: duration

void main() {
  float startTime = instanceLifetime.x;
  float duration = instanceLifetime.y;
  float age = uTime - startTime;
  vProgress = applyEasing(clamp(age / duration, 0.0, 1.0), uEasingFunction);
  if (vProgress < 0.0 || vProgress > 1.0) {
    gl_Position = vec4(vec3(9999.0), 1.0);
    return;
  }

  float scale = smoothstep(0.0, uFadeSize.x, vProgress) * smoothstep(1.01, uFadeSize.y, vProgress);

  vec3 normalizedDirection = length(instanceDirection) > 0.0 ? normalize(instanceDirection) : vec3(0.0);
  vec3 gravityForce = 0.5 * uGravity * (age * age);
  float easedAge = vProgress * duration;
  vec3 offset = normalizedDirection * easedAge * instanceSpeed;
  offset += gravityForce;

  vec3 rotationSpeed = instanceRotationSpeed * age;
  mat4 rotX = rotationX(rotationSpeed.x);
  mat4 rotY = rotationY(rotationSpeed.y);
  mat4 rotZ = rotationZ(rotationSpeed.z);
  mat4 rotationMatrix = rotZ * rotY * rotX;

  vec4 mvPosition;
  #ifdef MESH_MODE
  /* Mesh Mode */
    vec4 startPosition = modelMatrix * instanceMatrix * rotationMatrix * vec4(position * scale, 1.0);
    
    vec3 instancePosition = startPosition.xyz;

    vec3 finalPosition = instancePosition + offset;
    mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
  #endif
  #ifdef BILLBOARD_MODE
  /* Billboard Mode */
    // Instance position (translation from instanceMatrix)
    vec3 instancePosition = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz + offset;
    
    // Compute billboard's local coordinate system
    // Forward vector (billboard's local Z-axis, points toward camera)
    vec3 localZ = normalize(cameraPosition - instancePosition);
    // World up vector (assuming Y-up world)
    vec3 worldUp = vec3(0.0, 1.0, 0.0);
    // Local X-axis (right vector)
    vec3 localX = normalize(cross(worldUp, localZ));
    // Local Y-axis (up vector)
    vec3 localY = cross(localZ, localX);

    // Construct billboard's orientation matrix (converts from local to world space)
    mat3 billboardMatrix = mat3(localX, localY, localZ);

    float scaleX = length(instanceMatrix[0].xyz);
    float scaleY = length(instanceMatrix[1].xyz);
    float scaleZ = length(instanceMatrix[2].xyz);
    vec3 instanceScale = vec3(scaleX, scaleY, scaleZ);

    // Combine billboard orientation with local rotation
    mat3 finalMatrix = billboardMatrix * mat3(rotationMatrix);

    // Extract final right and up vectors, apply scale
    vec3 finalRight = finalMatrix[0] * instanceScale * scale;
    vec3 finalUp = finalMatrix[1] * instanceScale * scale;
    // Compute vertex position in world space
    vec3 vertexWorldPos = instancePosition +
                          finalRight * position.x +
                          finalUp * position.y;
    mvPosition = viewMatrix * vec4(vertexWorldPos, 1.0);
  #endif
  #ifdef STRETCH_BILLBOARD_MODE
    vec3 instancePosition = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz + offset;
    vec3 viewDir = normalize(cameraPosition - instancePosition);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(abs(dot(viewDir, up)) > 0.99 ? vec3(1,0,0) : up, viewDir));
    vec3 velocity = instanceDirection * instanceSpeed + uGravity * age;
    vec3 stretchDir = normalize(velocity);
    float stretchLength = length(velocity);
    // stretchLength = clamp(stretchLength, 0., 1.0);
    stretchLength *= uStretchScale;
    float scaleX = length(instanceMatrix[0].xyz);
    float scaleY = length(instanceMatrix[1].xyz);
    float scaleZ = length(instanceMatrix[2].xyz);
    float instanceScale = (scaleX + scaleY + scaleZ);
    float width = scale * instanceScale;
    float height = (scale + stretchLength) * instanceScale;
    
  
    vec3 finalRight = right * width;
    vec3 finalUp = normalize(stretchDir) * height * sign(dot(stretchDir, viewDir));
    
    vec3 vertexWorldPos = instancePosition +
                          finalRight * position.x +
                          finalUp * position.y;
  
    mvPosition = viewMatrix * vec4(vertexWorldPos, 1.0);
  #endif

  gl_Position = projectionMatrix * mvPosition;

  vUv = uv;
  vColor = instanceColor;
  vColorEnd = instanceColorEnd;
}
`,
  /* glsl */ `
uniform float uIntensity;
uniform vec2 uFadeAlpha;
uniform sampler2D alphaMap;
uniform int uAppearanceMode;

varying vec3 vColor;
varying vec3 vColorEnd;
varying float vProgress;
varying vec2 vUv;


void main() {
  if (vProgress < 0.0 || vProgress > 1.0) {
    discard;
  }
  vec3 finalColor = mix(vColor, vColorEnd, vProgress);
  finalColor *= uIntensity;

  float alpha = smoothstep(0.0, uFadeAlpha.x, vProgress) * smoothstep(1.01, uFadeAlpha.y, vProgress);

  #ifdef USE_ALPHAMAP
    vec2 uv = vUv;
    vec4 tex = texture2D(alphaMap, uv);
    gl_FragColor = vec4(finalColor, tex.a * alpha);
  #else
    if(uAppearanceMode == 1){
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      
      if(dist > 0.5){
        discard; // creating circular shape 
      }
    }
    gl_FragColor = vec4(finalColor, alpha);
  #endif
}`
);

extend({ ParticlesMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements {
    particlesMaterial: ThreeElements["shaderMaterial"] & {
      alphaMap?: THREE.Texture;
    };
  }
}

export default VFXParticles;
