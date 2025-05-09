#ifdef USE_INSTANCING_INDIRECT
  #include <instanced_pars_vertex>
#endif

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vPosition = position;
  vUv = uv;
  
  #ifdef USE_INSTANCING_INDIRECT
    #include <instanced_vertex>
  #endif


  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
