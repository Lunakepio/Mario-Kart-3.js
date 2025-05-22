    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float exposure;
    varying vec3 vWorldNormal;
    
    vec3 toneMap(vec3 color) {
      return vec3(1.0) - exp(-color * exposure);
    }
    
    void main() {
      vec2 uv = vUv;
      float t = smoothstep(-1., 1., vWorldNormal.y);
      vec3 color = mix(color1, color2, t);
    
      color *= 5.;
    
    
      gl_FragColor = vec4(color, 1.0);
    }