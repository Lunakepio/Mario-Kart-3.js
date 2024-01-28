/**
 * FakeFlame material component by Anderson Mancini - Jan 2024.
 */

import React, { useMemo, useRef } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { Color, DoubleSide, AdditiveBlending } from 'three'

export default function FakeFlame({ falloff = 3, glowInternalRadius = 1.0, glowColor = 'orange', glowSharpness = 1.0 , isBoosting,}) {
  const FakeFlame = useMemo(() => {
    return shaderMaterial(
      {
        falloffAmount: falloff,
        glowInternalRadius: glowInternalRadius,
        glowColor: new Color(glowColor),
        glowSharpness: glowSharpness,
        time: 0,
        isBoosting: isBoosting,
      },
      /*GLSL */
      `
      varying vec3 vNormal;
      varying vec2 vUv;
      uniform float time;
      
      float random2D(vec2 value)
      {
          return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
          // Position
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

          // Glitch
          float glitchTime = time + modelPosition.y;
          float glitchStrength = sin(glitchTime) + sin(glitchTime * .05) +  sin(glitchTime * .36);
          glitchStrength /= 2.0;
          glitchStrength = smoothstep(0.2, 0.8, glitchStrength);
          glitchStrength *= 0.;
          modelPosition.x += (random2D(modelNormal.xx + time) - 0.5) * glitchStrength;
          modelPosition.x += (random2D(modelNormal.xx - time) - 0.2) * glitchStrength;
          modelPosition.y += sin(smoothstep(0.4, vUv.y - 2.5, position.y) * 2.) * sin(time * 48.);
          modelPosition.z += sin(smoothstep(0., vUv.x - 1.8, position.z) * 2.) * sin(time * 24.);

          gl_Position = projectionMatrix * viewMatrix * modelPosition;

          vUv = uv;
      }`,
      /*GLSL */
      ` 
      uniform vec3 glowColor;
      uniform float falloffAmount;
      uniform float glowSharpness;
      uniform float glowInternalRadius;
      uniform float time;
      uniform bool isBoosting;

      varying vec2 vUv;

      vec2 hash( vec2 p )
      {
        p = vec2( dot(p,vec2(127.1,311.7)),
            dot(p,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
      }

      float noise( in vec2 p )
      {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;
        
        vec2 i = floor( p + (p.x+p.y)*K1 );
        
        vec2 a = p - i + (i.x+i.y)*K2;
        vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0*K2;
        
        vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
        
        vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        
        return dot( n, vec3(70.0) );
      }

      float fbm(vec2 uv)
      {
        float f;
        mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
        f  = 0.5000*noise( uv ); uv = m*uv;
        f += 0.2500*noise( uv ); uv = m*uv;
        // f += 0.1250*noise( uv ); uv = m*uv;
        // f += 0.0625*noise( uv ); uv = m*uv;
        f = 0.5 + 0.5*f;
        return f;
      }

      // #define BLUE_FLAME
      // #define GREEN_FLAME

      void main()
      {
        vec2 q = vUv;
        q.x *= 2.;
        q.y *= 2.;
        float strength = floor(q.x+1.5);
        float T3 = max(2.,2.25*strength)*time * 4.;
        q.x = mod(q.x,1.)-0.5;
        q.y -= 0.05;
        float n = fbm(strength*q + vec2(0,T3));
        float c = 0.7 - 0.01 * pow( max( 0., length(q*vec2(1.8+q.y*1.5,.75) ) - n * max( 0., q.y+.25 ) ),.2 );
      	// float c1 = n * c * fract((1.9-pow(0.15*vUv.y,2.))) * 2.;
        float c1 = n * c * (pow(1.90*vUv.y,2.));
        c1=clamp(c1,0.,1.);
      
        vec3 col = smoothstep(0.1, 0.8, vec3(c1, c1*c1*c1, c1*c1*c1*c1*c1*c1));

        #ifdef BLUE_FLAME
          col = col.zyx;
        #endif
        #ifdef GREEN_FLAME
          col = 0.85*col.yxz;
        #endif
          

        if (isBoosting) {
          gl_FragColor = vec4(col, 1.0);
        } else {
          gl_FragColor = vec4(col, 0.0);
        }

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
    )
  }, [falloff, glowInternalRadius, glowColor, glowSharpness, isBoosting])

  extend({ FakeFlame })

  useFrame((state, delta) => {
    ref.current.time += delta
  })

  const ref = useRef()

  return (
    <fakeFlame
      key={FakeFlame.key}
      side={DoubleSide}
      transparent={true}
      blending={AdditiveBlending}
      depthTest={false}
      ref={ref}
    />
  )
}
