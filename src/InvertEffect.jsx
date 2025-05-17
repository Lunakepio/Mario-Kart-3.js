import { Effect } from 'postprocessing';
import { Uniform, Vector2, Vector3, Euler, Quaternion } from 'three';
import { forwardRef, useEffect, useMemo, useRef, } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from './store';
import { lerp } from 'three/src/math/MathUtils.js';

const fragmentShader = /* glsl */ `
uniform sampler2D tDiffuse;
uniform float time;

uniform vec2 motionDirection;
uniform float motionStrength;

vec2 hash(vec2 p) {
  p = vec2(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3))
  );
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;

  vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
  vec3 n = h * h * h * h * vec3(
    dot(a, hash(i + 0.0)),
    dot(b, hash(i + o)),
    dot(c, hash(i + 1.0))
  );

  return dot(n, vec3(70.0));
}

vec4 blurMotion(sampler2D tex, vec2 uv, vec2 resolution, vec2 direction, float strength) 
{
    vec4 color = vec4(0.0);
    float total = 0.0;

    for ( float i = -5.0; i <= 5.0; i++ ) 
    {
        float weight = 1.0 - abs(i) / 5.0;
        vec2 offset = direction * ( i * strength ) / resolution;
        color += texture2D(tex, uv + offset) * weight;
        total += weight;
    }

    return color / total;
}

vec3 colorContrast( vec3 color, float contrast )
{

    float midPoint = pow( 0.5, 2.2 );

    return ( color - midPoint ) * contrast + midPoint;
    
}

vec3 colorSaturation( vec3 color, float saturation )
{

    float luminance = dot( color, vec3( 0.299, 0.587, 0.114 ) );
    
    vec3 grayscale = vec3( luminance );

    return mix( grayscale, color, 1.0 + saturation );

}
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 fragColor) {
  vec2 direction = motionDirection * motionStrength;
  vec4 color = texture2D(tDiffuse, uv);
  vec4 blurColor = blurMotion(tDiffuse, uv, vec2(${window.innerWidth}., ${window.innerHeight}.), direction, 12.);

  vec3 finalColor = colorSaturation(colorContrast(blurColor.rgb, 1.05), 0.12);
  
  fragColor = vec4(finalColor, 1.0);
}


`;

export class InvertEffect extends Effect {
  constructor() {
    super('InvertEffect', fragmentShader, {
      uniforms: new Map([
        ['time', new Uniform(0)],
        ['motionDirection', new Uniform(new Vector2(0, 0))],
        ['motionStrength', new Uniform(0)],
      ])
    });
  }

  updateTime(t) {
    this.uniforms.get('time').value = t;
  }
  
  updateMotion(dir, strength) {
    this.uniforms.get('motionDirection').value.copy(dir);
    this.uniforms.get('motionStrength').value = strength;
  }
}

export const Invert = forwardRef((props, ref) => {
  const effect = useMemo(() => new InvertEffect(), []);
  const { camera } = useThree();
  const prevQuat = useRef(new Quaternion());
  const prevSpeed = useRef(0)
  useFrame((state, delta) => {
    if (!camera) return;
  
    effect.updateTime(state.clock.elapsedTime);
  
    const speed = useGameStore.getState().speed;

  
    let verticalDir = new Vector2(0, 0);
    let verticalStrength = 0;
  
    const normalizedSpeed = Math.abs(prevSpeed.current / 30 - speed / 30);
    prevSpeed.current = lerp(prevSpeed.current, speed, 8 * delta);
  
    verticalDir = new Vector2(0.0, normalizedSpeed);
    verticalStrength = Math.abs(normalizedSpeed) * 0.01;
  
    const currentQuat = camera.quaternion.clone();
    const deltaQuat = currentQuat.clone().multiply(prevQuat.current.clone().invert());
    const deltaEuler = new Euler().setFromQuaternion(deltaQuat);
    const yawChange = deltaEuler.y;
  
    let horizontalDir = new Vector2(0, 0);
    let horizontalStrength = 0;
  
    horizontalDir = new Vector2(Math.sign(yawChange), 0.0);
    horizontalStrength = Math.abs(yawChange) * 0.2;
  
    const combinedDir = new Vector2()
      .addScaledVector(horizontalDir, horizontalStrength)
      .addScaledVector(verticalDir, verticalStrength);
  
    const combinedStrength = combinedDir.length();
    if (combinedStrength > 0.0) combinedDir.normalize();
  
    prevQuat.current.copy(currentQuat);
    effect.updateMotion(combinedDir, combinedStrength);
  });
  
    useEffect(() => {
      if (ref) ref.current = effect;
      // Init previous quaternion on mount
      if (camera) {
        prevQuat.current.copy(camera.quaternion);
      }
    }, [effect, camera]);
  
    return <primitive object={effect} />;
  });