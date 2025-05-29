uniform float uCurrentTime;
uniform vec3 color;
uniform vec3 baseColor;
uniform float uTimeOffset;
uniform sampler2D noiseTexture;

varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    vec2 noiseUV = fract(vUv * 0.5 + vec2(0.0, -(uTimeOffset + uCurrentTime * 1.2) * 0.5 ));
    vec3 n = texture2D(noiseTexture, noiseUV).rgb;
    dist += n.r * 0.2; 
    
    float end = 0.3;
    float start = 0.;
    
    end -= uCurrentTime * 1.25;
    end = clamp(end, 0.0, 0.3);
    float innerFade = smoothstep(start, uCurrentTime, dist);
    float fade = dist < end ? innerFade : 0.0;
    float colorScalar = 20. - uCurrentTime;
    float o = clamp(uCurrentTime * 30., 0., 1.);

    float t = clamp(uCurrentTime * 10., 0.0, 1.0);
    vec3 finalColor = mix(baseColor, color, t);

    gl_FragColor = vec4(finalColor * (colorScalar * fade), dist * fade * o);
  }
