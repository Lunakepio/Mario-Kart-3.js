/**
 * fakeGlow material component by Anderson Mancini - Dec 2023.
 */

import React, { useMemo } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { Color, DoubleSide, AdditiveBlending } from 'three'

export default function FakeGlowMaterial({ falloff = 3, glowInternalRadius = 1.0, glowColor = '#b97939', glowSharpness = 1.0 }) {
  const FakeGlowMaterial = useMemo(() => {
    return shaderMaterial(
      {
        falloffAmount: falloff,
        glowInternalRadius: glowInternalRadius,
        glowColor: new Color(glowColor),
        glowSharpness: glowSharpness
      },
      /*GLSL */
      `
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
        vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
        vPosition = modelPosition.xyz;
        vNormal = modelNormal.xyz;

      }`,
      /*GLSL */
      ` 
      uniform vec3 glowColor;
      uniform float falloffAmount;
      uniform float glowSharpness;
      uniform float glowInternalRadius;

      varying vec3 vPosition;
      varying vec3 vNormal;

      void main()
      {
        // Normal
        vec3 normal = normalize(vNormal);
        if(!gl_FrontFacing){ normal *= - 1.0; }
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = dot(viewDirection, normal);
        fresnel = pow(fresnel, glowInternalRadius);
        float falloff = smoothstep(0., falloffAmount, fresnel);
        float fakeGlow = fresnel;
        fakeGlow += fresnel * glowSharpness;
        fakeGlow *= falloff;
        gl_FragColor = vec4(clamp(glowColor * fresnel, 0., 1.0), clamp(fakeGlow, 0., 1.0));

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
    )
  }, [falloff, glowInternalRadius, glowColor, glowSharpness])

  extend({ FakeGlowMaterial })

  return (
    <fakeGlowMaterial
      key={FakeGlowMaterial.key}
      side={DoubleSide}
      transparent={true}
      blending={AdditiveBlending}
      depthTest={false}
    />
  )
}
