import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { AdditiveBlending, Color } from "three";
import { Spark } from "./Spark";


export const Glow = forwardRef((props, ref) => {
  const materialRef = useRef(null);
  const sparkRef = useRef(null);

  const vertexShader = /* glsl */ `
    uniform float time;
    varying vec2 vUv;

    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      float scale = 1.0;
      vec3 scaledPosition = position * scale;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float time;
    uniform vec3 color;
    uniform float opacity;
    varying vec2 vUv;
    varying vec3 vPosition;

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
      

   float triangleWave(float x) {
    return abs(fract(x) - 0.5) * 2.0;
  }

  // void main() {
  //   vec2 center = vec2(0.5);
  //   vec2 uv = vUv - center;

  //   float radius = length(uv);
  //   float angle = atan(uv.y, uv.x);
  //   float points = 12.0;

  //   float noiseFactor = noise(uv * 0.5 + time * 5.);
  //   float randomOffset = noise(vec2(angle * 1.5, time * 5.)) * 6.28; // Random offset per angle
  //   float jaggedRadius = 0.3 * sin(points * angle + randomOffset);
  //   if (radius > jaggedRadius) discard;

  //   vec3 finalColor = color;
  //   gl_FragColor = vec4(finalColor, opacity);
  // }

void main() {
  vec2 center = vec2(0.5);
  vec2 uv = vUv;

  vec2 diff = uv - center;
  float radius = length(diff);

  float angle = atan(diff.y, diff.x);
  float noiseValue = noise(vec2(angle * 1.5, time * 7.));

  bool isWhite = color.r > 0.5 && color.g > 0.5;
  float threshold = 0.3 + 0.5 * noiseValue * (!isWhite ? 1.0 : 0.1);

  if (radius > threshold) discard;

  float t = smoothstep(0.0, threshold, radius);
  vec3 finalColor = mix(vec3(1.0), color, t); 

  gl_FragColor = vec4(finalColor, opacity);
}`;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  useImperativeHandle(ref, () => {
    let prevColor = new Color(0xffffff);
  
    return {
      setColor: (newColor) => {
        const newCol = new Color(newColor);
  
        if (!newCol.equals(prevColor)) {
          prevColor.copy(newCol);
          materialRef.current.uniforms.color.value.copy(newCol);
  
          const isWhite = newCol.r === 1 && newCol.g === 1 && newCol.b === 1;
          if (!isWhite) {
            sparkRef.current?.setColor(newCol);
            sparkRef.current?.emit();
          }
        }
      },
      setOpacity: (newOpacity) => {
        if (materialRef.current) {
          materialRef.current.uniforms.opacity.value = newOpacity;
        }
      },
    };
  });
  

  const size = 0.5;

  return (
    <Billboard layers={1}>
      <mesh layers={1}>
        <planeGeometry args={[size, size]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            time: { value: 0 },
            color: { value: new Color(0xffffff) },
            opacity: { value: 1 },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <Spark ref={sparkRef}/>
    </Billboard>
  );
});
