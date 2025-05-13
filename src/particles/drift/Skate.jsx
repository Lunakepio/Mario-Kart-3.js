import { Billboard, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { AdditiveBlending, Color } from "three";
import { Spark } from "./Spark";
import { lerp } from "three/src/math/MathUtils.js";


export const Skate = forwardRef(({ driftDirection }, ref) => {
  const materialRef = useRef(null);
  const sparkRef = useRef(null);

  const vertexShader = /* glsl */ `
    uniform float time;
    uniform float timeOffset;
    uniform float level;
    uniform vec3 color;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float xDisplacement;
    
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
      
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;

    vec3 radialDir = normalize(vec3(vPosition.xy + 1e-4, 0.0));
        
    float n = noise(position.xy * 20. + vec2((time + timeOffset * 10.) * 4.0, 0.0));
    
    float edgeFactor = length(vPosition.xy);
    float displacement = abs(n * edgeFactor * (4.0 + level * 0.2));

    if (mod(float(gl_VertexID), 2.0) > 0.5 || (color.r > 0.8 && color.g > 0.8)) {
      displacement = 0.0;
    } else {
        vPosition.x += xDisplacement * edgeFactor;
        vPosition.y -= edgeFactor * 0.1;
    }

    float scale = 1.0 + abs(sin(time * 40.)) * 0.3;
    vec3 scaledPosition = vPosition * scale;
    vec3 newPosition = scaledPosition + radialDir * displacement;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
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

 void main() {
      float displacedRadius = length(vPosition.xy);

        vec2 center = vec2(0.5);
      vec2 uv = vUv;

      vec2 diff = uv - center;
      float radius = length(diff);
      float innerThreshold = 0.1;
      float outerThreshold = 0.4; 

      float edgeFactor = smoothstep(innerThreshold, outerThreshold, radius);
      float fade = smoothstep(1.0, 0.0, radius) - 0.5;
      fade = (color. r > 0.5 && color.g > 0.5) ? fade : 1.0;

      vec3 finalColor = mix(vec3(1.0), color, edgeFactor);


      gl_FragColor = vec4(finalColor, opacity * fade);
 }
`;

 const [, get] = useKeyboardControls();
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      const { left, right } = get();
    
      materialRef.current.uniforms.xDisplacement.value = -(driftDirection.current) * 0.5;
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
      setLevel: (level) => {
        materialRef.current.uniforms.level.value = level;
      },
      setOpacity: (newOpacity) => {
        if (materialRef.current) {
          materialRef.current.uniforms.opacity.value = newOpacity;
        }
      },
    };
  });
  

  const size = 0.1;

  return (
    <Billboard layers={1}>
      <mesh layers={1}>
        <circleGeometry args={[size, 22]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            time: { value: 0 },
            color: { value: new Color(0xffffff) },
            level: { value: 0 },
            opacity: { value: 1 },
            timeOffset: { value: Math.random() * 3},
            xDisplacement: { value: 0 },
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
