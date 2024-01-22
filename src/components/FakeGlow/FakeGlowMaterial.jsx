/**
 * FakeGlow material component by Anderson Mancini - Dec 2024.
 */

import React, { useRef, useMemo } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { Color, BackSide, AdditiveBlending } from 'three'

export default function FakeGlowMaterial({ glowCenter = 0.05, edgeIntensity = 6.0, glowColor = '#00ff00', glowOpacity = 1.0, fresnelOpacity = 0.5, fresnelAmount = 0.5, wireframe = false }) {
  const FakeGlowMaterial = useMemo(() => {
    return shaderMaterial(
      {
        time: 0,
        glowCenter: glowCenter,
        edgeIntensity: edgeIntensity,
        glowColor: new Color(glowColor),
        glowOpacity: glowOpacity,
        fresnelOpacity: fresnelOpacity,
        fresnelAmount: fresnelAmount
      },
      /*GLSL */
      `
      uniform float glowCenter;
      uniform float edgeIntensity;
      varying float intensity;
      varying vec3 vNormel;
      varying vec3 vNormal;
      uniform float fresnelOpacity;
      uniform float fresnelAmount;

      void main() {
        vec3 viewVector = normalize(vec3(cameraPosition-position));
        float fresnelEffect = dot(vNormel, vNormal) * ( fresnelOpacity);
        fresnelEffect = clamp(fresnelAmount - fresnelEffect, 0.5, fresnelOpacity);
        vec3 vNormal = normalize( normalMatrix * normal );
        vec3 vNormel = normalize( normalMatrix * viewVector );
        intensity = pow( glowCenter - dot(vNormal, vNormel), edgeIntensity / fresnelEffect );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
      /*GLSL */
      ` 
      uniform vec3 glowColor;
      varying float intensity;
      uniform float glowOpacity;
      uniform float fresnelOpacity;
      uniform float fresnelAmount;
      varying vec3 vNormel;
      varying vec3 vNormal;
      uniform float glowCenter;
      uniform float edgeIntensity;

      void main()
      {
        vec3 glow = glowColor * intensity;
        float fresnelEffect =  - dot(vNormel, vNormal);
        fresnelEffect = clamp(fresnelEffect, 0.1, 1.0);
        gl_FragColor = vec4( clamp(glow, 0., 1.0), clamp(glowOpacity - intensity * fresnelEffect, 0., 1.0 ));
      }`
    )
  }, [glowCenter, edgeIntensity, glowColor, glowOpacity, fresnelOpacity, fresnelAmount])

  extend({ FakeGlowMaterial })

  useFrame((state, delta) => {
    ref.current.time += delta
  })

  const ref = useRef()

  return (
    <fakeGlowMaterial
      wireframe={wireframe}
      key={FakeGlowMaterial.key}
      side={BackSide}
      transparent={true}
      blending={AdditiveBlending}
      depthTest={false}
      ref={ref}
    />
  )
}
